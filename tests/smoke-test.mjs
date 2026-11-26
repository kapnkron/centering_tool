import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(path.join(root, "index.html"), "utf8");
const app = readFileSync(path.join(root, "app.js"), "utf8");
const electronMain = readFileSync(path.join(root, "electron-main.js"), "utf8");
const gpuFilters = readFileSync(path.join(root, "gpu-filters.js"), "utf8");

const { SessionStore } = require(path.join(root, "session-store.js"));
const {
  GrblController,
  buildCardScanPlan,
  parseGrblStatusLine,
  validateGcodeSafety,
} = require(path.join(root, "grbl-controller.js"));
const { VisionBridge } = require(path.join(root, "vision-bridge.js"));

const requiredIds = [
  "playerInput",
  "manufacturerInput",
  "setInput",
  "yearInput",
  "cardNumberInput",
  "serialNumberInput",
  "traceLockReportIdInput",
  "saveInspectionButton",
  "resumeInspectionInput",
  "phoneTransferButton",
  "phoneTransferModal",
  "phoneTransferQr",
  "snapshotModal",
  "snapshotForm",
  "snapshotAnnotationInput",
  "sessionsButton",
  "sessionsModal",
  "cncControlSection",
  "cncStartScanButton",
  "cncEstopButton",
  "visionControlSection",
  "visionAutofillMetadataButton",
  "visionSuggestionsBar",
];

for (const id of requiredIds) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `missing UI field: ${id}`);
}

assert.ok(!app.includes("window.prompt("), "Electron-incompatible window.prompt() must not be used");

for (const symbol of [
  "function inspectionMetadata()",
  "function currentInspectionState()",
  "async function saveInspection()",
  "async function resumeInspection(file)",
  "function buildHtmlReport(evidence = reportEvidence)",
  "function createNormalizedMark(mark)",
  "function renderFullResolutionMarkedDataUrl(image, marks)",
  "function renderFilteredSurface(",
  "function positionComparisonLine()",
  "function initCncControls()",
  "function initVisionControls()",
  "async function runVisionOnEvidenceItem(",
  "traceLockReportId",
  "metadataHtml",
  "function loadImageSource(dataUrl, name",
]) {
  assert.ok(app.includes(symbol), `missing workflow code: ${symbol}`);
}

for (const symbol of ["TraceLockGpuFilter", "u_splitEnabled", "u_splitX", "webgl2"]) {
  assert.ok(gpuFilters.includes(symbol), `missing GPU filter code: ${symbol}`);
}

for (const symbol of [
  "startPhoneServer",
  "phone-transfer-ready",
  "phone-photo",
  "MAX_PHOTO_BYTES",
  "tracelock-media",
  "registerSessionHandlers",
  "registerCncHandlers",
  "registerVisionHandlers",
]) {
  assert.ok(electronMain.includes(symbol), `missing desktop main code: ${symbol}`);
}

// 1. Test disk-backed SessionStore + YOLO label export
const tempSessionsRoot = mkdtempSync(path.join(os.tmpdir(), "tracelock-sessions-"));
try {
  const store = new SessionStore(tempSessionsRoot);
  const tinyPngDataUrl =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X2dIAAAAASUVORK5CYII=";
  const savedAsset = await store.saveAsset({
    sessionId: "TL-TEST-001",
    assetKey: "corner-tl-orig",
    dataUrl: tinyPngDataUrl,
  });
  assert.equal(savedAsset.assetPath, "images/corner-tl-orig.png");
  assert.match(savedAsset.mediaUrl, /^tracelock-media:\/\/TL-TEST-001\/images\/corner-tl-orig\.png$/);

  const savedManifest = await store.saveManifest({
    sessionId: "TL-TEST-001",
    manifest: {
      identity: { cardId: "2026-TL-99", cardName: "Test Foil Card" },
      images: { originalAssetPath: savedAsset.assetPath, sourceAssetPath: savedAsset.assetPath },
      evidence: [
        {
          title: "Corner TL",
          step: "corners",
          assetPath: savedAsset.assetPath,
          originalAssetPath: savedAsset.assetPath,
          width: 1920,
          height: 1080,
          marks: [
            {
              coordSpace: "normalized",
              flawType: "Corner Ding",
              severity: "Moderate",
              bbox: { cx: 0.25, cy: 0.35, w: 0.1, h: 0.12 },
            },
          ],
        },
      ],
    },
  });
  assert.equal(savedManifest.labelCount, 1);
  assert.ok(existsSync(path.join(savedManifest.sessionDir, "labels", "classes.txt")));
  assert.ok(existsSync(path.join(savedManifest.sessionDir, "labels", "corner-tl-orig.txt")));
  assert.ok(existsSync(path.join(savedManifest.sessionDir, "labels", "annotations.json")));

  const listed = await store.listSessions();
  assert.equal(listed.length, 1);
  assert.equal(listed[0].evidenceCount, 1);

  const loaded = await store.loadSession("TL-TEST-001");
  assert.equal(loaded.evidence[0].url, savedAsset.mediaUrl);
  assert.throws(() => store.resolveMediaFile("TL-TEST-001", "../../etc/passwd"));
} finally {
  rmSync(tempSessionsRoot, { recursive: true, force: true });
}

// 2. Test GRBL protocol parsing, safety envelope, scan recipe, and simulator
const parsedStatus = parseGrblStatusLine("<Idle|MPos:12.500,24.000,-3.250|WCO:2.500,4.000,0.000>");
assert.equal(parsedStatus.state, "Idle");
assert.deepEqual(parsedStatus.wpos, { x: 10, y: 20, z: -3.25 });

assert.throws(() => validateGcodeSafety("M3 S1000"), /Blocked M3\/M4/);
assert.throws(() => validateGcodeSafety("G1 X450 Y10 F1000"), /outside safety bounds/);
assert.equal(validateGcodeSafety("G21 G90 G1 X30 Y40 F2000"), "G21 G90 G1 X30 Y40 F2000");

const plan = buildCardScanPlan({ fovXMm: 20, fovYMm: 20, includeCorners: true, includeEdges: true, includeSurface: true, includeUv: true });
assert.ok(plan.length >= 16, `expected multi-pass card scan plan, got ${plan.length}`);
assert.equal(plan[0].step, "corners");
assert.ok(plan.some((wp) => wp.step === "surface"));
assert.ok(plan.some((wp) => wp.step === "uv"));

const cnc = new GrblController();
const simStatus = await cnc.connect({ path: "SIM://GRBL-GANTRY" });
assert.equal(simStatus.connected, true);
assert.equal(simStatus.simulated, true);
await cnc.moveTo({ x: 15, y: 25, z: -2, settleMs: 10 });
assert.deepEqual(cnc.getStatus().wpos, { x: 15, y: 25, z: -2 });
await cnc.setWorkZero({ x: true, y: true, z: false });
assert.deepEqual(cnc.getStatus().wpos, { x: 0, y: 0, z: -2 });
await cnc.emergencyStop();
assert.equal(cnc.getStatus().state, "Hold/Reset");
await cnc.disconnect();

// 3. Test Python Vision Sidecar (VisionBridge + classical CV + dataset builder)
const tempVisionRoot = mkdtempSync(path.join(os.tmpdir(), "tracelock-vision-"));
const tempStore = new SessionStore(tempVisionRoot);
const vision = new VisionBridge({ rootDir: root, port: 18765, sessionStore: tempStore });
try {
  const visionStatus = await vision.getStatus();
  assert.equal(visionStatus.ok, true, `vision sidecar health failed: ${visionStatus.error || ""}`);
  assert.equal(visionStatus.running, true);

  // Create a synthetic 200x200 dark card image with a bright white scratch line in Python and analyze it
  const syntheticPngPath = path.join(tempVisionRoot, "scratch-test.png");
  execFileSync(
    "python3",
    [
      "-c",
      `from PIL import Image, ImageDraw; img = Image.new('RGB', (240, 240), (35, 40, 48)); d = ImageDraw.Draw(img); d.line([(40, 120), (190, 125)], fill=(245, 245, 245), width=3); img.save(r'${syntheticPngPath}')`,
    ],
    { stdio: "inherit" }
  );

  const analysis = await vision.analyzeImage({
    filePath: syntheticPngPath,
    step: "surface",
    mmPerPx: 0.02,
  });
  assert.equal(analysis.ok, true);
  assert.ok(analysis.detections.length >= 1, "expected classical CV to detect synthetic scratch");
  assert.equal(analysis.detections[0].flawType, "Scratch");
  assert.equal(analysis.detections[0].coordSpace, "normalized");
  assert.ok(analysis.detections[0].bbox.w > 0 && analysis.detections[0].bbox.h > 0);

  // Clean surface should produce 0 false positives
  const cleanPngPath = path.join(tempVisionRoot, "clean-test.png");
  execFileSync(
    "python3",
    ["-c", `from PIL import Image; Image.new('RGB', (240, 240), (35, 40, 48)).save(r'${cleanPngPath}')`],
    { stdio: "inherit" }
  );
  const cleanAnalysis = await vision.analyzeImage({ filePath: cleanPngPath, step: "surface" });
  assert.equal(cleanAnalysis.ok, true);
  assert.equal(cleanAnalysis.detections.length, 0, "expected 0 false positives on clean uniform tile");
} finally {
  vision.stop();
  rmSync(tempVisionRoot, { recursive: true, force: true });
}

for (const file of [
  "app.js",
  "gpu-filters.js",
  "electron-main.js",
  "preload.js",
  "session-store.js",
  "grbl-controller.js",
  "vision-bridge.js",
]) {
  execFileSync("node", ["--check", path.join(root, file)], { stdio: "inherit" });
}

console.log(
  `TraceLock tests passed (${requiredIds.length} UI fields, disk SessionStore + YOLO labels, GPU filters, GRBL controller, and live Python Vision sidecar).`
);
