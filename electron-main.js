const { app, BrowserWindow, ipcMain, protocol, session, shell } = require("electron");
const crypto = require("crypto");
const fsp = require("fs/promises");
const http = require("http");
const os = require("os");
const path = require("path");
const QRCode = require("qrcode");
const { SessionStore } = require("./session-store");
const { GrblController, buildCardScanPlan } = require("./grbl-controller");
const { VisionBridge } = require("./vision-bridge");

const MAX_PHOTO_BYTES = 35 * 1024 * 1024;
let mainWindow;
let phoneServer;
let phoneTransfer;
let sessionStore;
let grblController;
let visionBridge;

protocol.registerSchemesAsPrivileged([
  {
    scheme: "tracelock-media",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: "#0d0d10",
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.webContents.on("did-finish-load", sendPhoneTransferDetails);
  mainWindow.loadFile(path.join(__dirname, "index.html"));
}

function localNetworkAddress() {
  const candidates = [];
  for (const [name, addresses] of Object.entries(os.networkInterfaces())) {
    if (/virtual|vmware|vethernet|loopback|bluetooth/i.test(name)) continue;
    for (const address of addresses || []) {
      if (address.family !== "IPv4" || address.internal) continue;
      let score = 0;
      if (/wi-?fi|wireless|ethernet/i.test(name)) score += 20;
      if (/^192\.168\./.test(address.address)) score += 8;
      if (/^10\./.test(address.address)) score += 6;
      if (/^172\.(1[6-9]|2\d|3[01])\./.test(address.address)) score += 4;
      candidates.push({ address: address.address, score });
    }
  }
  candidates.sort((left, right) => right.score - left.score);
  return candidates[0]?.address || "127.0.0.1";
}

function phoneUploadPage() {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Send to TraceLock</title>
<style>:root{color-scheme:dark;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}*{box-sizing:border-box}body{min-height:100dvh;margin:0;display:grid;place-items:center;padding:24px;background:#08080a;color:#f5f5f6}.card{width:min(520px,100%);padding:28px;border:1px solid rgba(255,72,91,.35);border-radius:16px;background:#111114}span{color:#ff344f;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}h1{margin:10px 0;font-size:30px;line-height:1.1}p{color:#aaaab2;line-height:1.55}label{display:flex;min-height:56px;align-items:center;justify-content:center;margin-top:24px;padding:0 18px;border-radius:10px;background:#a3132a;color:#fff;font-weight:750}input{position:absolute;opacity:0;pointer-events:none}#status{margin-top:18px;color:#ff8292;font-weight:700}.note{font-size:12px}</style></head>
<body><main class="card"><span>TraceLock local transfer</span><h1>Photograph the full card</h1><p>Place the card flat, keep the camera directly above it, and include all four edges.</p><label>Take or choose photo<input id="photo" type="file" accept="image/*" capture="environment"></label><p id="status">Ready.</p><p class="note">The photo goes directly to TraceLock on your local network.</p></main>
<script>const input=document.querySelector("#photo");const status=document.querySelector("#status");async function compatiblePhoto(file){if(file.type==="image/jpeg"||file.type==="image/png")return file;status.textContent="Preparing photo…";const image=await createImageBitmap(file,{imageOrientation:"from-image"});const canvas=document.createElement("canvas");canvas.width=image.width;canvas.height=image.height;canvas.getContext("2d").drawImage(image,0,0);image.close();const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error("Could not prepare this photo.")),"image/jpeg",.96));return new File([blob],file.name.replace(/\.[^.]+$/,"")+".jpg",{type:"image/jpeg"})}input.addEventListener("change",async()=>{const selected=input.files[0];if(!selected)return;try{const file=await compatiblePhoto(selected);status.textContent="Sending "+file.name+"…";const response=await fetch(location.pathname+"/upload",{method:"POST",headers:{"Content-Type":file.type,"X-File-Name":encodeURIComponent(file.name)},body:file});if(!response.ok)throw new Error(await response.text());status.textContent="Photo sent. You can return to TraceLock."}catch(error){status.textContent="Transfer failed: "+error.message}});</script></body></html>`;
}

function startPhoneServer() {
  const token = crypto.randomBytes(18).toString("hex");
  phoneServer = http.createServer((request, response) => {
    const pagePath = `/${token}`;
    const uploadPath = `${pagePath}/upload`;
    if (request.method === "GET" && request.url === pagePath) {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      response.end(phoneUploadPage());
      return;
    }
    if (request.method !== "POST" || request.url !== uploadPath) {
      response.writeHead(404).end("Not found");
      return;
    }
    const contentType = String(request.headers["content-type"] || "");
    const declaredSize = Number(request.headers["content-length"] || 0);
    if (!contentType.startsWith("image/") || declaredSize > MAX_PHOTO_BYTES) {
      response.writeHead(415).end("Choose a JPG, PNG, or HEIC image under 35 MB.");
      return;
    }
    const chunks = [];
    let size = 0;
    let tooLarge = false;
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_PHOTO_BYTES) tooLarge = true;
      else if (!tooLarge) chunks.push(chunk);
    });
    request.on("end", () => {
      if (tooLarge) {
        response.writeHead(413).end("Photo is larger than 35 MB.");
        return;
      }
      const encodedName = String(request.headers["x-file-name"] || "iPhone-card-photo.jpg");
      let name = "iPhone-card-photo.jpg";
      try {
        name = path.basename(decodeURIComponent(encodedName));
      } catch {}
      const dataUrl = `data:${contentType};base64,${Buffer.concat(chunks).toString("base64")}`;
      mainWindow?.webContents.send("phone-transfer-status", "Photo received. Opening it for centering…");
      mainWindow?.webContents.send("phone-photo", { dataUrl, name });
      response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" }).end("Photo sent to TraceLock.");
    });
    request.on("error", () => {
      if (!response.headersSent) response.writeHead(400).end("Transfer interrupted.");
    });
  });

  phoneServer.listen(0, "0.0.0.0", async () => {
    const port = phoneServer.address().port;
    const url = `http://${localNetworkAddress()}:${port}/${token}`;
    phoneTransfer = { url, qrDataUrl: await QRCode.toDataURL(url, { width: 480, margin: 2 }) };
    sendPhoneTransferDetails();
  });
}

function sendPhoneTransferDetails() {
  if (mainWindow && !mainWindow.isDestroyed() && phoneTransfer) {
    mainWindow.webContents.send("phone-transfer-ready", phoneTransfer);
  }
}

function mediaContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".json") return "application/json; charset=utf-8";
  return "image/png";
}

function registerSessionHandlers() {
  sessionStore = new SessionStore(path.join(app.getPath("userData"), "sessions"));
  sessionStore.ensureRoot();

  protocol.handle("tracelock-media", async (request) => {
    try {
      const parsed = new URL(request.url);
      const sessionId = decodeURIComponent(parsed.hostname);
      const relativePath = parsed.pathname
        .split("/")
        .filter(Boolean)
        .map(decodeURIComponent)
        .join("/");
      const filePath = sessionStore.resolveMediaFile(sessionId, relativePath);
      const buffer = await fsp.readFile(filePath);
      return new Response(buffer, {
        status: 200,
        headers: {
          "Content-Type": mediaContentType(filePath),
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch {
      return new Response("Not found", { status: 404 });
    }
  });

  ipcMain.handle("session:save-asset", async (_event, payload) => sessionStore.saveAsset(payload));
  ipcMain.handle("session:save-manifest", async (_event, payload) => sessionStore.saveManifest(payload));
  ipcMain.handle("session:list", async () => sessionStore.listSessions());
  ipcMain.handle("session:load", async (_event, sessionId) => sessionStore.loadSession(sessionId));
  ipcMain.handle("session:open-folder", async (_event, sessionId) => {
    const target = sessionId ? sessionStore.sessionDir(sessionId).dir : sessionStore.ensureRoot();
    await fsp.mkdir(target, { recursive: true });
    return shell.openPath(target);
  });
}

function registerCncHandlers() {
  grblController = new GrblController();
  grblController.on("status", (status) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("cnc-status", status);
    }
  });
  grblController.on("log", (line) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("cnc-log", line);
    }
  });

  ipcMain.handle("cnc:list-ports", async () => grblController.listPorts());
  ipcMain.handle("cnc:connect", async (_event, options) => grblController.connect(options));
  ipcMain.handle("cnc:disconnect", async () => grblController.disconnect());
  ipcMain.handle("cnc:status", async () => grblController.getStatus());
  ipcMain.handle("cnc:home", async () => grblController.home());
  ipcMain.handle("cnc:unlock", async () => grblController.unlock());
  ipcMain.handle("cnc:set-zero", async (_event, axes) => grblController.setWorkZero(axes));
  ipcMain.handle("cnc:jog", async (_event, options) => grblController.jog(options));
  ipcMain.handle("cnc:move-to", async (_event, options) => grblController.moveTo(options));
  ipcMain.handle("cnc:set-light", async (_event, profile) => grblController.setLightProfile(profile));
  ipcMain.handle("cnc:update-safety", async (_event, patch) => grblController.updateSafety(patch));
  ipcMain.handle("cnc:build-scan-plan", async (_event, options) => buildCardScanPlan(options));
  ipcMain.handle("cnc:estop", async () => grblController.emergencyStop());
}

function registerVisionHandlers() {
  visionBridge = new VisionBridge({
    rootDir: __dirname,
    sessionStore,
  });
  ipcMain.handle("vision:status", async () => visionBridge.getStatus());
  ipcMain.handle("vision:analyze", async (_event, options) => visionBridge.analyzeImage(options));
  ipcMain.handle("vision:extract-metadata", async (_event, options) => visionBridge.extractMetadata(options));
  ipcMain.handle("vision:reload-model", async () => visionBridge.reloadModel());
  ipcMain.handle("vision:build-dataset", async () => visionBridge.buildDataset());
}

app.whenReady().then(() => {
  session.defaultSession.setPermissionCheckHandler(
    (webContents, permission) => webContents === mainWindow?.webContents && permission === "media"
  );
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback, details) => {
    const isTraceLock = webContents === mainWindow?.webContents;
    const isCameraRequest = permission === "media" && !details.mediaTypes?.includes("audio");
    callback(isTraceLock && isCameraRequest);
  });
  registerSessionHandlers();
  registerCncHandlers();
  registerVisionHandlers();
  startPhoneServer();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  visionBridge?.stop();
  grblController?.disconnect().catch(() => {});
  phoneServer?.close();
  if (process.platform !== "darwin") app.quit();
});
