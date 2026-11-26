const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const FLAW_CLASSES = [
  "Scratch",
  "Corner Ding",
  "Edge Whitening",
  "Crease",
  "Print Defect",
  "Discoloration",
];

function sanitizeSegment(value, fallback = "session") {
  const cleaned = String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return cleaned || fallback;
}

function decodeDataUrl(dataUrl) {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(String(dataUrl || ""));
  if (!match) {
    throw new Error("Expected a base64 image data URL.");
  }
  const mimeType = match[1].toLowerCase();
  const extByMime = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/webp": ".webp",
  };
  const ext = extByMime[mimeType] || ".png";
  return {
    mimeType,
    ext,
    buffer: Buffer.from(match[2], "base64"),
  };
}

class SessionStore {
  constructor(rootDir) {
    this.rootDir = path.resolve(rootDir);
  }

  ensureRoot() {
    fs.mkdirSync(this.rootDir, { recursive: true });
    return this.rootDir;
  }

  sessionDir(sessionId) {
    const safeId = sanitizeSegment(sessionId, "tracelock-session");
    const resolved = path.resolve(this.rootDir, safeId);
    if (!resolved.startsWith(this.rootDir + path.sep)) {
      throw new Error("Invalid session identifier.");
    }
    return { safeId, dir: resolved };
  }

  resolveMediaFile(sessionId, relativePath) {
    const { dir } = this.sessionDir(sessionId);
    const cleanRelative = String(relativePath || "").replace(/^\/+/, "");
    const resolved = path.resolve(dir, cleanRelative);
    if (!resolved.startsWith(dir + path.sep)) {
      throw new Error("Blocked access outside session folder.");
    }
    return resolved;
  }

  mediaUrl(sessionId, relativePath) {
    const safeId = sanitizeSegment(sessionId, "tracelock-session");
    const normalized = String(relativePath || "").replace(/\\/g, "/").replace(/^\/+/, "");
    return `tracelock-media://${encodeURIComponent(safeId)}/${normalized
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`;
  }

  async saveAsset({ sessionId, assetKey, dataUrl }) {
    this.ensureRoot();
    const { safeId, dir } = this.sessionDir(sessionId);
    const imagesDir = path.join(dir, "images");
    await fsp.mkdir(imagesDir, { recursive: true });

    const { ext, buffer } = decodeDataUrl(dataUrl);
    const baseName = sanitizeSegment(assetKey || `asset-${Date.now()}`, "asset").replace(/\.(png|jpe?g|webp)$/i, "");
    const fileName = `${baseName}${ext}`;
    const relativePath = `images/${fileName}`;
    const targetPath = path.join(imagesDir, fileName);
    const tempPath = `${targetPath}.tmp`;

    await fsp.writeFile(tempPath, buffer);
    await fsp.rename(tempPath, targetPath);

    return {
      sessionId: safeId,
      assetPath: relativePath,
      mediaUrl: this.mediaUrl(safeId, relativePath),
      bytes: buffer.length,
    };
  }

  async saveManifest({ sessionId, manifest }) {
    this.ensureRoot();
    const { safeId, dir } = this.sessionDir(sessionId);
    await fsp.mkdir(dir, { recursive: true });

    const savedAt = new Date().toISOString();
    const payload = {
      ...manifest,
      type: "tracelock-inspection",
      version: 2,
      storage: "disk",
      sessionId: safeId,
      savedAt,
    };

    const manifestPath = path.join(dir, "manifest.json");
    const tempPath = `${manifestPath}.tmp`;
    await fsp.writeFile(tempPath, JSON.stringify(payload, null, 2), "utf8");
    await fsp.rename(tempPath, manifestPath);

    const yoloSummary = await this.writeYoloLabels(dir, payload);

    return {
      sessionId: safeId,
      sessionDir: dir,
      manifestPath,
      savedAt,
      labelCount: yoloSummary.labelCount,
    };
  }

  async writeYoloLabels(dir, manifest) {
    const labelsDir = path.join(dir, "labels");
    await fsp.mkdir(labelsDir, { recursive: true });
    await fsp.writeFile(path.join(labelsDir, "classes.txt"), `${FLAW_CLASSES.join("\n")}\n`, "utf8");

    const records = [];
    let labelCount = 0;

    for (let index = 0; index < (manifest.evidence || []).length; index++) {
      const item = manifest.evidence[index];
      const marks = Array.isArray(item.marks) ? item.marks : [];
      const sourceAsset = item.originalAssetPath || item.assetPath || "";
      if (!marks.length) continue;

      const yoloLines = [];
      for (const mark of marks) {
        if (!mark.bbox) continue;
        let classId = FLAW_CLASSES.indexOf(mark.flawType);
        if (classId < 0) classId = FLAW_CLASSES.length;
        yoloLines.push(
          `${classId} ${mark.bbox.cx.toFixed(6)} ${mark.bbox.cy.toFixed(6)} ${mark.bbox.w.toFixed(6)} ${mark.bbox.h.toFixed(6)}`
        );
        labelCount++;
      }

      const stem = sourceAsset
        ? path.basename(sourceAsset, path.extname(sourceAsset))
        : `evidence-${String(index + 1).padStart(3, "0")}`;
      if (yoloLines.length) {
        await fsp.writeFile(path.join(labelsDir, `${stem}.txt`), `${yoloLines.join("\n")}\n`, "utf8");
      }

      records.push({
        index,
        title: item.title,
        step: item.step,
        imageAsset: sourceAsset,
        width: item.width || null,
        height: item.height || null,
        machine: item.machine || null,
        marks,
      });
    }

    await fsp.writeFile(
      path.join(labelsDir, "annotations.json"),
      JSON.stringify(
        {
          sessionId: manifest.sessionId,
          classes: FLAW_CLASSES,
          exportedAt: new Date().toISOString(),
          items: records,
        },
        null,
        2
      ),
      "utf8"
    );

    return { labelCount, labelsDir };
  }

  async listSessions() {
    this.ensureRoot();
    const entries = await fsp.readdir(this.rootDir, { withFileTypes: true });
    const sessions = [];
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const manifestPath = path.join(this.rootDir, entry.name, "manifest.json");
      try {
        const raw = await fsp.readFile(manifestPath, "utf8");
        const manifest = JSON.parse(raw);
        sessions.push({
          sessionId: entry.name,
          sessionDir: path.join(this.rootDir, entry.name),
          cardId: manifest.identity?.cardId || "",
          cardName: manifest.identity?.cardName || manifest.identity?.player || "Untitled card",
          inspectionId: manifest.identity?.inspectionId || entry.name,
          savedAt: manifest.savedAt || "",
          evidenceCount: Array.isArray(manifest.evidence) ? manifest.evidence.length : 0,
          activeStep: manifest.ui?.activeStep || "centering",
        });
      } catch {
        // Ignore folders without a readable manifest.json
      }
    }
    sessions.sort((left, right) => String(right.savedAt).localeCompare(String(left.savedAt)));
    return sessions;
  }

  async loadSession(sessionId) {
    const { safeId, dir } = this.sessionDir(sessionId);
    const manifestPath = path.join(dir, "manifest.json");
    const raw = await fsp.readFile(manifestPath, "utf8");
    const manifest = JSON.parse(raw);

    const resolveUrl = (assetPath, fallbackUrl = "") =>
      assetPath ? this.mediaUrl(safeId, assetPath) : fallbackUrl;

    const images = {
      original: resolveUrl(manifest.images?.originalAssetPath, manifest.images?.original || ""),
      source: resolveUrl(manifest.images?.sourceAssetPath, manifest.images?.source || ""),
      originalAssetPath: manifest.images?.originalAssetPath || "",
      sourceAssetPath: manifest.images?.sourceAssetPath || "",
    };

    const evidence = (manifest.evidence || []).map((item) => ({
      ...item,
      url: resolveUrl(item.assetPath, item.url || ""),
      originalUrl: resolveUrl(item.originalAssetPath, item.originalUrl || item.url || ""),
    }));

    const outputImages = (manifest.output?.images || []).map((item) => ({
      ...item,
      url: resolveUrl(item.assetPath, item.url || ""),
    }));

    return {
      ...manifest,
      sessionId: safeId,
      sessionDir: dir,
      images,
      evidence,
      output: {
        ...(manifest.output || {}),
        images: outputImages,
      },
    };
  }
}

module.exports = {
  FLAW_CLASSES,
  SessionStore,
  sanitizeSegment,
};
