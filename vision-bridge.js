const { spawn, execFile } = require("child_process");
const fs = require("fs");
const http = require("http");
const path = require("path");

function findPythonExecutable(rootDir) {
  const candidates = process.platform === "win32"
    ? [path.join(rootDir, "vision", ".venv", "Scripts", "python.exe"), "python", "python3"]
    : [path.join(rootDir, "vision", ".venv", "bin", "python"), "python3", "python"];
  for (const candidate of candidates) {
    if (candidate.includes(path.sep)) {
      if (fs.existsSync(candidate)) return candidate;
    } else {
      return candidate;
    }
  }
  return "python3";
}

function httpJsonRequest({ host = "127.0.0.1", port, method = "GET", reqPath = "/health", body = null, timeoutMs = 90000 }) {
  return new Promise((resolve, reject) => {
    const payload = body !== null ? Buffer.from(JSON.stringify(body), "utf8") : null;
    const req = http.request(
      {
        host,
        port,
        method,
        path: reqPath,
        headers: payload
          ? {
              "Content-Type": "application/json",
              "Content-Length": payload.length,
            }
          : {},
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          try {
            const parsed = JSON.parse(text || "{}");
            if (res.statusCode >= 400) {
              reject(new Error(parsed.error || `Vision sidecar HTTP ${res.statusCode}`));
              return;
            }
            resolve(parsed);
          } catch (err) {
            reject(new Error(`Invalid vision sidecar response: ${err.message}`));
          }
        });
      }
    );
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error("Vision sidecar request timed out."));
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

class VisionBridge {
  constructor({ rootDir, port = 8765, sessionStore = null } = {}) {
    this.rootDir = rootDir;
    this.port = Number(port) || 8765;
    this.sessionStore = sessionStore;
    this.pythonPath = findPythonExecutable(rootDir);
    this.serverScript = path.join(rootDir, "vision", "server.py");
    this.datasetScript = path.join(rootDir, "vision", "dataset_builder.py");
    this.child = null;
    this.startingPromise = null;
    this.lastError = "";
  }

  resolveLocalMediaPath(url) {
    if (!this.sessionStore || typeof url !== "string" || !url.startsWith("tracelock-media://")) {
      return "";
    }
    try {
      const parsed = new URL(url);
      const sessionId = decodeURIComponent(parsed.hostname);
      const relativePath = parsed.pathname
        .split("/")
        .filter(Boolean)
        .map(decodeURIComponent)
        .join("/");
      return this.sessionStore.resolveMediaFile(sessionId, relativePath);
    } catch {
      return "";
    }
  }

  async isHealthy() {
    try {
      const res = await httpJsonRequest({ port: this.port, reqPath: "/health", timeoutMs: 2500 });
      return Boolean(res.ok);
    } catch {
      return false;
    }
  }

  async ensureStarted() {
    if (await this.isHealthy()) return true;
    if (this.startingPromise) return this.startingPromise;

    this.startingPromise = new Promise((resolve, reject) => {
      if (!fs.existsSync(this.serverScript)) {
        reject(new Error(`Vision server script missing: ${this.serverScript}`));
        return;
      }

      const child = spawn(this.pythonPath, [this.serverScript], {
        cwd: this.rootDir,
        env: { ...process.env, TRACELOCK_VISION_PORT: String(this.port) },
        stdio: ["ignore", "pipe", "pipe"],
      });
      this.child = child;

      let settled = false;
      let stderrBuf = "";
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          this.lastError = stderrBuf || "Timed out starting Python vision sidecar.";
          reject(new Error(this.lastError));
        }
      }, 10000);

      child.stdout.on("data", (chunk) => {
        const text = chunk.toString("utf8");
        if (!settled && text.includes("TRACELOCK_VISION_READY")) {
          settled = true;
          clearTimeout(timer);
          this.lastError = "";
          resolve(true);
        }
      });

      child.stderr.on("data", (chunk) => {
        stderrBuf += chunk.toString("utf8");
      });

      child.on("error", (err) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          this.lastError = err.message;
          reject(err);
        }
      });

      child.on("exit", (code) => {
        this.child = null;
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          this.lastError = stderrBuf.trim() || `Vision sidecar exited with code ${code}.`;
          reject(new Error(this.lastError));
        }
      });
    }).finally(() => {
      this.startingPromise = null;
    });

    return this.startingPromise;
  }

  async getStatus() {
    try {
      await this.ensureStarted();
      const health = await httpJsonRequest({ port: this.port, reqPath: "/health", timeoutMs: 4000 });
      return {
        ...health,
        running: true,
        port: this.port,
        pythonPath: this.pythonPath,
      };
    } catch (error) {
      return {
        ok: false,
        running: false,
        port: this.port,
        pythonPath: this.pythonPath,
        error: error.message || this.lastError || "Vision sidecar unavailable.",
        ollama: { available: false, models: [], visionModels: [], recommended: "" },
      };
    }
  }

  async analyzeImage(options = {}) {
    await this.ensureStarted();
    const payload = { ...options };
    const localFile = this.resolveLocalMediaPath(payload.imageUrl || payload.imageDataUrl);
    if (localFile) {
      payload.filePath = localFile;
      delete payload.imageDataUrl;
    }
    const rakingFile = this.resolveLocalMediaPath(payload.rakingImageUrl || payload.rakingImageDataUrl);
    if (rakingFile) {
      payload.rakingFilePath = rakingFile;
      delete payload.rakingImageDataUrl;
    }
    return httpJsonRequest({
      port: this.port,
      method: "POST",
      reqPath: "/analyze",
      body: payload,
      timeoutMs: 120000,
    });
  }

  async extractMetadata(options = {}) {
    await this.ensureStarted();
    const payload = { ...options };
    const localFile = this.resolveLocalMediaPath(payload.imageUrl || payload.imageDataUrl);
    if (localFile) {
      payload.filePath = localFile;
      delete payload.imageDataUrl;
    }
    return httpJsonRequest({
      port: this.port,
      method: "POST",
      reqPath: "/extract-metadata",
      body: payload,
      timeoutMs: 120000,
    });
  }

  async reloadModel() {
    await this.ensureStarted();
    return httpJsonRequest({
      port: this.port,
      method: "POST",
      reqPath: "/reload-model",
      body: {},
      timeoutMs: 15000,
    });
  }

  buildDataset() {
    return new Promise((resolve, reject) => {
      const args = [this.datasetScript];
      if (this.sessionStore?.rootDir) {
        args.push("--sessions", this.sessionStore.rootDir);
      }
      execFile(this.pythonPath, args, { cwd: this.rootDir, timeout: 60000 }, (err, stdout, stderr) => {
        if (err) {
          reject(new Error(stderr?.trim() || err.message));
          return;
        }
        try {
          resolve(JSON.parse(stdout));
        } catch (parseErr) {
          reject(new Error(`Dataset builder output parse failed: ${parseErr.message}`));
        }
      });
    });
  }

  stop() {
    if (this.child) {
      this.child.kill();
      this.child = null;
    }
  }
}

module.exports = {
  VisionBridge,
  findPythonExecutable,
};
