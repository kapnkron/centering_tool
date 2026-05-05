const canvas = document.querySelector("#cardCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const imageInput = document.querySelector("#imageInput");
const stageWrap = document.querySelector(".stage-wrap");
const microscopeVideo = document.querySelector("#microscopeVideo");
const emptyState = document.querySelector("#emptyState");
const startMicroscopeButton = document.querySelector("#startMicroscopeButton");
const stopMicroscopeButton = document.querySelector("#stopMicroscopeButton");
const cameraSelect = document.querySelector("#cameraSelect");
const filterSelect = document.querySelector("#filterSelect");
const filterStrengthControl = document.querySelector("#filterStrengthControl");
const freezeButton = document.querySelector("#freezeButton");
const snapshotButton = document.querySelector("#snapshotButton");
const microscopeStatus = document.querySelector("#microscopeStatus");
const snapshotStrip = document.querySelector("#snapshotStrip");
const detectButton = document.querySelector("#detectButton");
const resetButton = document.querySelector("#resetButton");
const cornerModeButton = document.querySelector("#cornerModeButton");
const applyPerspectiveButton = document.querySelector("#applyPerspectiveButton");
const originalButton = document.querySelector("#originalButton");
const standardRatioToggle = document.querySelector("#standardRatioToggle");
const modeHint = document.querySelector("#modeHint");
const snapToggle = document.querySelector("#snapToggle");
const zoomControl = document.querySelector("#zoomControl");
const zoomValue = document.querySelector("#zoomValue");
const thresholdControl = document.querySelector("#thresholdControl");
const stepControl = document.querySelector("#stepControl");
const nudgeButtons = document.querySelectorAll("[data-nudge-edge]");
const copyButton = document.querySelector("#copyButton");

const metricEls = {
  left: document.querySelector("#leftMetric"),
  right: document.querySelector("#rightMetric"),
  top: document.querySelector("#topMetric"),
  bottom: document.querySelector("#bottomMetric"),
  horizontal: document.querySelector("#horizontalScore"),
  vertical: document.querySelector("#verticalScore"),
  horizontalMeter: document.querySelector("#horizontalMeter"),
  verticalMeter: document.querySelector("#verticalMeter"),
  gradeHint: document.querySelector("#gradeHint"),
  report: document.querySelector("#reportText"),
};

let originalImage = null;
let sourceImage = null;
let imageName = "";
let scale = 1;
let activeGuide = null;
let activeCorner = null;
let dragOffset = { x: 0, y: 0 };
let mode = "measure";
let perspectiveApplied = false;
let flattenedCardRect = null;
let corners = [];
let microscopeStream = null;
let microscopeFrameId = null;
let microscopeFrozen = false;
let frozenFrame = null;

let guides = {
  outer: { x: 120, y: 80, w: 720, h: 1040 },
  inner: { x: 210, y: 180, w: 540, h: 840 },
};

imageInput.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) return;
  loadImage(file);
});

startMicroscopeButton.addEventListener("click", () => {
  startMicroscope();
});

stopMicroscopeButton.addEventListener("click", () => {
  stopMicroscope();
});

cameraSelect.addEventListener("change", () => {
  if (microscopeStream) {
    startMicroscope();
  }
});

filterSelect.addEventListener("change", () => {
  if (mode === "microscope") restartMicroscopeDraw();
});

filterStrengthControl.addEventListener("input", () => {
  if (mode === "microscope") restartMicroscopeDraw();
});

freezeButton.addEventListener("click", () => {
  if (mode !== "microscope") return;
  microscopeFrozen = !microscopeFrozen;
  freezeButton.textContent = microscopeFrozen ? "Unfreeze" : "Freeze";
  microscopeStatus.textContent = microscopeFrozen
    ? "Frame frozen. Snapshot it or unfreeze to keep scanning."
    : "Live view resumed. Move the card slowly under angled light.";
  if (!microscopeFrozen) {
    frozenFrame = null;
    restartMicroscopeDraw();
  }
});

snapshotButton.addEventListener("click", () => {
  if (mode !== "microscope") return;
  addMicroscopeSnapshot();
});

stageWrap.addEventListener("dragover", (event) => {
  event.preventDefault();
  stageWrap.classList.add("is-dragging");
});

stageWrap.addEventListener("dragleave", () => {
  stageWrap.classList.remove("is-dragging");
});

stageWrap.addEventListener("drop", (event) => {
  event.preventDefault();
  stageWrap.classList.remove("is-dragging");
  const [file] = event.dataTransfer.files;
  if (file && file.type.startsWith("image/")) {
    loadImage(file);
  }
});

detectButton.addEventListener("click", () => {
  if (!sourceImage || mode === "corners" || mode === "microscope") return;
  detectCardAndWindow();
  draw();
});

resetButton.addEventListener("click", () => {
  if (!sourceImage || mode === "corners" || mode === "microscope") return;
  resetGuides();
  draw();
});

cornerModeButton.addEventListener("click", () => {
  if (!sourceImage) return;
  stopMicroscope();
  if (mode === "corners") {
    mode = "measure";
  } else {
    useOriginalImage();
    mode = "corners";
  }
  activeGuide = null;
  setModeHint();
  draw();
});

applyPerspectiveButton.addEventListener("click", () => {
  if (!sourceImage || corners.length !== 4) return;
  applyPerspectiveCorrection();
});

originalButton.addEventListener("click", () => {
  if (!originalImage) return;
  useOriginalImage();
  mode = "measure";
  perspectiveApplied = false;
  setModeHint();
  detectCardAndWindow();
  draw();
});

zoomControl.addEventListener("input", () => {
  const center = stageCenterRatio();
  scale = Number(zoomControl.value);
  if (mode === "microscope") {
    resizeMicroscopeCanvas();
  } else {
    resizeCanvas();
  }
  updateZoomValue();
  if (mode === "microscope") {
    restartMicroscopeDraw();
  } else {
    draw();
  }
  requestAnimationFrame(() => restoreStageCenter(center));
});

thresholdControl.addEventListener("input", () => {
  if (!sourceImage || !snapToggle.checked || mode === "microscope") return;
  detectCardAndWindow();
  draw();
});

nudgeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!sourceImage || mode === "corners" || mode === "microscope") return;
    nudgeInnerEdge(
      button.dataset.nudgeEdge,
      Number(button.dataset.nudgeDirection) * Number(stepControl.value)
    );
    draw();
  });
});

copyButton.addEventListener("click", async () => {
  if (!metricEls.report.value.trim()) return;
  try {
    if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
    await navigator.clipboard.writeText(metricEls.report.value);
  } catch {
    metricEls.report.select();
    document.execCommand("copy");
  }
  copyButton.textContent = "Copied";
  setTimeout(() => {
    copyButton.textContent = "Copy Report";
  }, 1200);
});

canvas.addEventListener("pointerdown", (event) => {
  if (!sourceImage || mode === "microscope") return;
  const point = canvasPoint(event);
  if (mode === "corners") {
    activeCorner = cornerHitTest(point);
    if (activeCorner === null) return;
    canvas.setPointerCapture(event.pointerId);
    draw();
    return;
  }
  activeGuide = hitTest(point);
  if (!activeGuide) return;
  canvas.setPointerCapture(event.pointerId);
  dragOffset = point;
});

canvas.addEventListener("pointermove", (event) => {
  const point = canvasPoint(event);
  if (mode === "corners" && activeCorner !== null) {
    corners[activeCorner] = clampPoint(point);
    draw();
    return;
  }
  if (!sourceImage || !activeGuide) return;
  const dx = point.x - dragOffset.x;
  const dy = point.y - dragOffset.y;
  moveGuide(activeGuide, dx, dy);
  dragOffset = point;
  draw();
});

canvas.addEventListener("pointerup", (event) => {
  activeGuide = null;
  activeCorner = null;
  if (canvas.hasPointerCapture(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId);
  }
});

function loadImage(file) {
  stopMicroscope();
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      originalImage = image;
      sourceImage = image;
      imageName = file.name;
      emptyState.style.display = "none";
      scale = 1;
      zoomControl.value = "1";
      resizeCanvas();
      updateZoomValue();
      resetCorners();
      resetGuides();
      detectCardAndWindow();
      perspectiveApplied = false;
      flattenedCardRect = null;
      mode = "measure";
      setModeHint();
      draw();
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
}

async function startMicroscope() {
  stopMicroscope(false);
  try {
    const deviceId = cameraSelect.value;
    const constraints = {
      video: {
        deviceId: deviceId ? { exact: deviceId } : undefined,
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    };
    microscopeStream = await navigator.mediaDevices.getUserMedia(constraints);
    microscopeVideo.srcObject = microscopeStream;
    await microscopeVideo.play();
    await populateCameraSelect();
    mode = "microscope";
    microscopeFrozen = false;
    frozenFrame = null;
    freezeButton.textContent = "Freeze";
    emptyState.style.display = "none";
    scale = 1;
    zoomControl.value = "1";
    updateZoomValue();
    microscopeStatus.textContent = "Live microscope view. Move the card slowly and adjust angled light.";
    restartMicroscopeDraw();
  } catch (error) {
    microscopeStatus.textContent = "Camera access failed. Open this tool from localhost or HTTPS and allow camera permission.";
  }
}

function stopMicroscope(restoreImage = true) {
  if (microscopeFrameId) {
    cancelAnimationFrame(microscopeFrameId);
    microscopeFrameId = null;
  }
  if (microscopeStream) {
    microscopeStream.getTracks().forEach((track) => track.stop());
    microscopeStream = null;
  }
  microscopeVideo.srcObject = null;
  microscopeFrozen = false;
  frozenFrame = null;
  freezeButton.textContent = "Freeze";
  if (mode === "microscope") {
    mode = "measure";
    microscopeStatus.textContent = "Microscope stopped.";
    if (restoreImage && sourceImage) {
      resizeCanvas();
      draw();
    } else if (!sourceImage) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      emptyState.style.display = "";
    }
  }
}

async function populateCameraSelect() {
  if (!navigator.mediaDevices?.enumerateDevices) return;
  const devices = await navigator.mediaDevices.enumerateDevices();
  const cameras = devices.filter((device) => device.kind === "videoinput");
  const selected = cameraSelect.value;
  cameraSelect.innerHTML = '<option value="">Default camera</option>';
  cameras.forEach((camera, index) => {
    const option = document.createElement("option");
    option.value = camera.deviceId;
    option.textContent = camera.label || `Camera ${index + 1}`;
    cameraSelect.append(option);
  });
  cameraSelect.value = cameras.some((camera) => camera.deviceId === selected) ? selected : "";
}

function drawMicroscopeFrame() {
  if (mode !== "microscope") return;
  const width = microscopeVideo.videoWidth || 1280;
  const height = microscopeVideo.videoHeight || 720;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    resizeMicroscopeCanvas();
  }

  if (microscopeFrozen && frozenFrame) {
    ctx.putImageData(frozenFrame, 0, 0);
    return;
  }

  ctx.drawImage(microscopeVideo, 0, 0, canvas.width, canvas.height);
  applySurfaceFilter();
  if (microscopeFrozen) {
    frozenFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return;
  }
  microscopeFrameId = requestAnimationFrame(drawMicroscopeFrame);
}

function restartMicroscopeDraw() {
  if (microscopeFrameId) {
    cancelAnimationFrame(microscopeFrameId);
    microscopeFrameId = null;
  }
  drawMicroscopeFrame();
}

function resizeMicroscopeCanvas() {
  canvas.style.width = `${Math.round(canvas.width * scale)}px`;
  canvas.style.height = `${Math.round(canvas.height * scale)}px`;
}

function applySurfaceFilter() {
  const filter = filterSelect.value;
  if (filter === "normal") return;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const source = new Uint8ClampedArray(imageData.data);
  const data = imageData.data;
  const strength = Number(filterStrengthControl.value);

  if (filter === "contrast" || filter === "invert") {
    const contrast = 1 + strength * 0.45;
    for (let i = 0; i < data.length; i += 4) {
      const gray = luminance(data[i], data[i + 1], data[i + 2]);
      let value = clampByte((gray - 128) * contrast + 128);
      if (filter === "invert") value = 255 - value;
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
    }
  } else {
    const kernel = filter === "edges"
      ? [-1, -1, -1, -1, 8 + strength, -1, -1, -1, -1]
      : [-2, -1, 0, -1, 1, 1, 0, 1, 2];
    convolveGrayscale(source, data, canvas.width, canvas.height, kernel, filter === "emboss" ? 128 : 0);
  }

  ctx.putImageData(imageData, 0, 0);
}

function convolveGrayscale(source, target, width, height, kernel, offset) {
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sum = 0;
      let k = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const index = ((y + ky) * width + x + kx) * 4;
          sum += luminance(source[index], source[index + 1], source[index + 2]) * kernel[k];
          k++;
        }
      }
      const value = clampByte(sum + offset);
      const out = (y * width + x) * 4;
      target[out] = value;
      target[out + 1] = value;
      target[out + 2] = value;
    }
  }
}

function luminance(r, g, b) {
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}

function clampByte(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function addMicroscopeSnapshot() {
  const link = document.createElement("a");
  const image = document.createElement("img");
  link.href = canvas.toDataURL("image/png");
  link.download = `surface-inspection-${Date.now()}.png`;
  image.src = link.href;
  image.alt = "Surface inspection snapshot";
  link.append(image);
  snapshotStrip.prepend(link);
  while (snapshotStrip.children.length > 6) {
    snapshotStrip.lastElementChild.remove();
  }
  microscopeStatus.textContent = "Snapshot saved below. Click a thumbnail to download it.";
}

function resizeCanvas() {
  if (!sourceImage) return;
  const maxWidth = 1400;
  const baseScale = Math.min(1, maxWidth / getSourceWidth());
  canvas.width = Math.round(getSourceWidth() * baseScale);
  canvas.height = Math.round(getSourceHeight() * baseScale);
  canvas.style.width = `${Math.round(canvas.width * scale)}px`;
  canvas.style.height = `${Math.round(canvas.height * scale)}px`;
}

function scaleGuides(from, to) {
  if (!from.w || !from.h) return;
  const sx = to.w / from.w;
  const sy = to.h / from.h;
  for (const rect of [guides.outer, guides.inner]) {
    rect.x *= sx;
    rect.y *= sy;
    rect.w *= sx;
    rect.h *= sy;
  }
}

function resetGuides() {
  if (perspectiveApplied && flattenedCardRect) {
    setGuidesFromCardRect(flattenedCardRect);
    return;
  }
  const marginX = canvas.width * 0.08;
  const marginY = canvas.height * 0.06;
  guides.outer = {
    x: marginX,
    y: marginY,
    w: canvas.width - marginX * 2,
    h: canvas.height - marginY * 2,
  };
  guides.inner = {
    x: canvas.width * 0.2,
    y: canvas.height * 0.18,
    w: canvas.width * 0.6,
    h: canvas.height * 0.64,
  };
}

function resetCorners() {
  corners = [
    { x: canvas.width * 0.12, y: canvas.height * 0.08 },
    { x: canvas.width * 0.88, y: canvas.height * 0.08 },
    { x: canvas.width * 0.88, y: canvas.height * 0.92 },
    { x: canvas.width * 0.12, y: canvas.height * 0.92 },
  ];
}

function useOriginalImage() {
  const shouldResetCorners = perspectiveApplied || corners.length !== 4;
  sourceImage = originalImage;
  flattenedCardRect = null;
  perspectiveApplied = false;
  const oldSize = { w: canvas.width, h: canvas.height };
  resizeCanvas();
  if (shouldResetCorners) {
    resetCorners();
  } else {
    scaleCorners(oldSize, { w: canvas.width, h: canvas.height });
  }
  resetGuides();
}

function applyPerspectiveCorrection() {
  const corrected = warpPerspective();
  if (!corrected) return;
  sourceImage = corrected.image;
  mode = "measure";
  perspectiveApplied = true;
  flattenedCardRect = corrected.cardRect;
  scale = 1;
  zoomControl.value = "1";
  resizeCanvas();
  updateZoomValue();
  setGuidesFromCardRect(flattenedCardRect);
  setModeHint();
  draw();
}

function setGuidesFromCardRect(cardRect) {
  const sx = canvas.width / getSourceWidth();
  const sy = canvas.height / getSourceHeight();
  guides.outer = {
    x: cardRect.x * sx,
    y: cardRect.y * sy,
    w: cardRect.w * sx,
    h: cardRect.h * sy,
  };
  guides.inner = {
    x: guides.outer.x + guides.outer.w * 0.12,
    y: guides.outer.y + guides.outer.h * 0.12,
    w: guides.outer.w * 0.76,
    h: guides.outer.h * 0.76,
  };
}

function detectCardAndWindow() {
  drawBaseImage();
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const threshold = Number(thresholdControl.value);
  const outer = detectContentBounds(imageData, threshold, 0);
  if (outer) {
    guides.outer = padRect(outer, 2);
  }

  const inset = Math.max(12, Math.min(guides.outer.w, guides.outer.h) * 0.08);
  const searchArea = {
    x: guides.outer.x + inset,
    y: guides.outer.y + inset,
    w: guides.outer.w - inset * 2,
    h: guides.outer.h - inset * 2,
  };
  const inner = detectContentBounds(imageData, threshold + 10, searchArea);
  if (inner && inner.w > 20 && inner.h > 20) {
    guides.inner = clampRect(padRect(inner, -1), guides.outer);
  } else {
    guides.inner = {
      x: guides.outer.x + guides.outer.w * 0.12,
      y: guides.outer.y + guides.outer.h * 0.12,
      w: guides.outer.w * 0.76,
      h: guides.outer.h * 0.76,
    };
  }
}

function detectContentBounds(imageData, threshold, area) {
  const bounds = area || { x: 0, y: 0, w: canvas.width, h: canvas.height };
  const data = imageData.data;
  const sampleStep = 3;
  const startX = Math.max(0, Math.floor(bounds.x));
  const startY = Math.max(0, Math.floor(bounds.y));
  const endX = Math.min(canvas.width, Math.ceil(bounds.x + bounds.w));
  const endY = Math.min(canvas.height, Math.ceil(bounds.y + bounds.h));
  const bg = averageColor(data, canvas.width, [
    [startX, startY, Math.min(40, endX - startX), Math.min(40, endY - startY)],
    [Math.max(startX, endX - 40), startY, Math.min(40, endX - startX), Math.min(40, endY - startY)],
    [startX, Math.max(startY, endY - 40), Math.min(40, endX - startX), Math.min(40, endY - startY)],
    [Math.max(startX, endX - 40), Math.max(startY, endY - 40), Math.min(40, endX - startX), Math.min(40, endY - startY)],
  ]);

  let minX = endX;
  let minY = endY;
  let maxX = startX;
  let maxY = startY;

  for (let y = startY; y < endY; y += sampleStep) {
    for (let x = startX; x < endX; x += sampleStep) {
      const index = (y * canvas.width + x) * 4;
      const distance = colorDistance(data[index], data[index + 1], data[index + 2], bg);
      if (distance > threshold) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (minX >= maxX || minY >= maxY) return null;
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

function averageColor(data, width, rects) {
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  for (const rect of rects) {
    const [rx, ry, rw, rh] = rect.map(Math.floor);
    for (let y = ry; y < ry + rh; y += 4) {
      for (let x = rx; x < rx + rw; x += 4) {
        const index = (y * width + x) * 4;
        r += data[index];
        g += data[index + 1];
        b += data[index + 2];
        count++;
      }
    }
  }
  return [r / count, g / count, b / count];
}

function colorDistance(r, g, b, bg) {
  return Math.hypot(r - bg[0], g - bg[1], b - bg[2]);
}

function padRect(rect, amount) {
  return {
    x: rect.x - amount,
    y: rect.y - amount,
    w: rect.w + amount * 2,
    h: rect.h + amount * 2,
  };
}

function clampRect(rect, outer) {
  const x = Math.max(outer.x, rect.x);
  const y = Math.max(outer.y, rect.y);
  const right = Math.min(outer.x + outer.w, rect.x + rect.w);
  const bottom = Math.min(outer.y + outer.h, rect.y + rect.h);
  return { x, y, w: right - x, h: bottom - y };
}

function draw() {
  drawBaseImage();
  if (!sourceImage) return;
  if (mode === "corners") {
    drawCornerOverlay();
    return;
  }
  drawGuide(guides.outer, getComputedStyle(document.documentElement).getPropertyValue("--outer"), "CARD EDGE");
  drawGuide(guides.inner, getComputedStyle(document.documentElement).getPropertyValue("--inner"), "PRINTED AREA");
  drawBorderMeasurements();
  updateMetrics();
}

function drawBaseImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (sourceImage) {
    ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
  }
}

function drawCornerOverlay() {
  ctx.save();
  ctx.strokeStyle = "#187c74";
  ctx.fillStyle = "rgba(24, 124, 116, 0.14)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(corners[0].x, corners[0].y);
  for (let i = 1; i < corners.length; i++) {
    ctx.lineTo(corners[i].x, corners[i].y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  const labels = ["TL", "TR", "BR", "BL"];
  ctx.font = "700 13px system-ui, sans-serif";
  corners.forEach((corner, index) => {
    ctx.fillStyle = activeCorner === index ? "#0f5d57" : "#187c74";
    ctx.beginPath();
    ctx.arc(corner.x, corner.y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText(labels[index], corner.x - 8, corner.y + 5);
  });
  ctx.restore();
}

function drawGuide(rect, color, label) {
  ctx.save();
  ctx.strokeStyle = color.trim();
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 6]);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.setLineDash([]);
  ctx.fillStyle = color.trim();
  for (const handle of handles(rect)) {
    ctx.fillRect(handle.x - 5, handle.y - 5, 10, 10);
  }
  ctx.font = "700 12px system-ui, sans-serif";
  ctx.fillText(label, rect.x + 8, rect.y - 8);
  ctx.restore();
}

function drawBorderMeasurements() {
  const m = getMeasurements();
  ctx.save();
  ctx.strokeStyle = "rgba(31, 39, 51, 0.72)";
  ctx.fillStyle = "rgba(31, 39, 51, 0.88)";
  ctx.lineWidth = 2;
  ctx.font = "700 13px system-ui, sans-serif";
  drawMeasureLine(guides.outer.x, guides.inner.y + guides.inner.h / 2, guides.inner.x, guides.inner.y + guides.inner.h / 2, `${m.left}px`);
  drawMeasureLine(guides.inner.x + guides.inner.w, guides.inner.y + guides.inner.h / 2, guides.outer.x + guides.outer.w, guides.inner.y + guides.inner.h / 2, `${m.right}px`);
  drawMeasureLine(guides.inner.x + guides.inner.w / 2, guides.outer.y, guides.inner.x + guides.inner.w / 2, guides.inner.y, `${m.top}px`);
  drawMeasureLine(guides.inner.x + guides.inner.w / 2, guides.inner.y + guides.inner.h, guides.inner.x + guides.inner.w / 2, guides.outer.y + guides.outer.h, `${m.bottom}px`);
  ctx.restore();
}

function drawMeasureLine(x1, y1, x2, y2, text) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  const x = (x1 + x2) / 2;
  const y = (y1 + y2) / 2;
  ctx.fillText(text, x + 6, y - 6);
}

function getMeasurements() {
  return {
    left: Math.max(0, Math.round(guides.inner.x - guides.outer.x)),
    right: Math.max(0, Math.round(guides.outer.x + guides.outer.w - guides.inner.x - guides.inner.w)),
    top: Math.max(0, Math.round(guides.inner.y - guides.outer.y)),
    bottom: Math.max(0, Math.round(guides.outer.y + guides.outer.h - guides.inner.y - guides.inner.h)),
  };
}

function updateMetrics() {
  const m = getMeasurements();
  metricEls.left.textContent = `${m.left}px`;
  metricEls.right.textContent = `${m.right}px`;
  metricEls.top.textContent = `${m.top}px`;
  metricEls.bottom.textContent = `${m.bottom}px`;

  const horizontal = ratio(m.left, m.right);
  const vertical = ratio(m.top, m.bottom);
  metricEls.horizontal.textContent = horizontal.label;
  metricEls.vertical.textContent = vertical.label;
  metricEls.horizontalMeter.style.width = `${horizontal.score}%`;
  metricEls.verticalMeter.style.width = `${vertical.score}%`;
  metricEls.horizontalMeter.style.backgroundColor = scoreColor(horizontal.score);
  metricEls.verticalMeter.style.backgroundColor = scoreColor(vertical.score);
  metricEls.gradeHint.textContent = gradeText(horizontal.score, vertical.score);
  metricEls.report.value = reportText(m, horizontal, vertical);
}

function ratio(a, b) {
  const total = a + b;
  if (!total) return { label: "--", score: 0, variance: 0 };
  const low = Math.min(a, b);
  const high = Math.max(a, b);
  const left = Math.round((a / total) * 100);
  const right = 100 - left;
  const score = Math.round((low / high) * 100);
  return {
    label: `${left}/${right}`,
    score,
    variance: Math.round(Math.abs(a - b)),
  };
}

function scoreColor(score) {
  if (score >= 90) return "#187c74";
  if (score >= 80) return "#8a7a15";
  return "#b45d1d";
}

function gradeText(horizontalScore, verticalScore) {
  const score = Math.min(horizontalScore, verticalScore);
  if (score >= 95) return "Excellent centering by border width.";
  if (score >= 90) return "Strong centering with minor visible variance.";
  if (score >= 80) return "Moderate centering variance. Review manually before grading.";
  return "Heavy centering variance. Manual verification is recommended.";
}

function reportText(m, horizontal, vertical) {
  if (!sourceImage) return "";
  return [
    `Card Centering Report`,
    `Image: ${imageName || "Untitled"}`,
    `Left border: ${m.left}px`,
    `Right border: ${m.right}px`,
    `Top border: ${m.top}px`,
    `Bottom border: ${m.bottom}px`,
    `Perspective corrected: ${perspectiveApplied ? "Yes" : "No"}`,
    `Left/Right centering: ${horizontal.label} (${horizontal.variance}px variance)`,
    `Top/Bottom centering: ${vertical.label} (${vertical.variance}px variance)`,
  ].join("\n");
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
  };
}

function hitTest(point) {
  const candidates = [
    ["inner", guides.inner],
    ["outer", guides.outer],
  ];
  for (const [name, rect] of candidates) {
    for (const handle of handles(rect)) {
      if (Math.abs(point.x - handle.x) < 16 && Math.abs(point.y - handle.y) < 16) {
        return { name, handle: handle.name };
      }
    }
    if (nearEdge(point, rect)) {
      return { name, handle: "move" };
    }
  }
  return null;
}

function cornerHitTest(point) {
  let closest = null;
  let closestDistance = Infinity;
  corners.forEach((corner, index) => {
    const distance = Math.hypot(point.x - corner.x, point.y - corner.y);
    if (distance < closestDistance) {
      closest = index;
      closestDistance = distance;
    }
  });
  return closestDistance <= 28 ? closest : null;
}

function clampPoint(point) {
  return {
    x: Math.min(Math.max(0, point.x), canvas.width),
    y: Math.min(Math.max(0, point.y), canvas.height),
  };
}

function scaleCorners(from, to) {
  if (!from.w || !from.h) return;
  const sx = to.w / from.w;
  const sy = to.h / from.h;
  corners = corners.map((corner) => ({
    x: corner.x * sx,
    y: corner.y * sy,
  }));
}

function handles(rect) {
  return [
    { name: "nw", x: rect.x, y: rect.y },
    { name: "ne", x: rect.x + rect.w, y: rect.y },
    { name: "sw", x: rect.x, y: rect.y + rect.h },
    { name: "se", x: rect.x + rect.w, y: rect.y + rect.h },
  ];
}

function nearEdge(point, rect) {
  const tolerance = 10;
  const insideX = point.x >= rect.x - tolerance && point.x <= rect.x + rect.w + tolerance;
  const insideY = point.y >= rect.y - tolerance && point.y <= rect.y + rect.h + tolerance;
  const onVertical = Math.abs(point.x - rect.x) < tolerance || Math.abs(point.x - rect.x - rect.w) < tolerance;
  const onHorizontal = Math.abs(point.y - rect.y) < tolerance || Math.abs(point.y - rect.y - rect.h) < tolerance;
  return insideX && insideY && (onVertical || onHorizontal);
}

function moveGuide(active, dx, dy) {
  const rect = guides[active.name];
  if (active.handle === "move") {
    rect.x += dx;
    rect.y += dy;
  }
  if (active.handle.includes("w")) {
    rect.x += dx;
    rect.w -= dx;
  }
  if (active.handle.includes("e")) {
    rect.w += dx;
  }
  if (active.handle.includes("n")) {
    rect.y += dy;
    rect.h -= dy;
  }
  if (active.handle.includes("s")) {
    rect.h += dy;
  }
  rect.w = Math.max(30, rect.w);
  rect.h = Math.max(30, rect.h);
  rect.x = Math.min(Math.max(0, rect.x), canvas.width - rect.w);
  rect.y = Math.min(Math.max(0, rect.y), canvas.height - rect.h);
  if (active.name === "inner") {
    guides.inner = clampRect(rect, guides.outer);
  }
}

function nudgeInnerEdge(edge, amount) {
  const rect = guides.inner;
  if (edge === "left") {
    rect.x += amount;
    rect.w -= amount;
  }
  if (edge === "right") {
    rect.w += amount;
  }
  if (edge === "top") {
    rect.y += amount;
    rect.h -= amount;
  }
  if (edge === "bottom") {
    rect.h += amount;
  }
  rect.w = Math.max(20, rect.w);
  rect.h = Math.max(20, rect.h);
  guides.inner = clampRect(rect, guides.outer);
}

function warpPerspective() {
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = canvas.width;
  sourceCanvas.height = canvas.height;
  const sourceCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  sourceCtx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);

  const topWidth = Math.hypot(corners[1].x - corners[0].x, corners[1].y - corners[0].y);
  const bottomWidth = Math.hypot(corners[2].x - corners[3].x, corners[2].y - corners[3].y);
  const leftHeight = Math.hypot(corners[3].x - corners[0].x, corners[3].y - corners[0].y);
  const rightHeight = Math.hypot(corners[2].x - corners[1].x, corners[2].y - corners[1].y);
  let outputWidth = Math.round((topWidth + bottomWidth) / 2);
  let outputHeight = Math.round((leftHeight + rightHeight) / 2);

  outputWidth = Math.min(Math.max(outputWidth, 240), 1400);
  outputHeight = standardRatioToggle.checked
    ? Math.round(outputWidth * 1.4)
    : Math.min(Math.max(outputHeight, 336), 1960);

  const src = [
    corners[0],
    corners[1],
    corners[2],
    corners[3],
  ];
  const dst = [
    { x: 0, y: 0 },
    { x: outputWidth - 1, y: 0 },
    { x: outputWidth - 1, y: outputHeight - 1 },
    { x: 0, y: outputHeight - 1 },
  ];
  const matrix = homography(dst, src);
  if (!matrix) return null;

  const sourceData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = outputWidth;
  outputCanvas.height = outputHeight;
  const outputCtx = outputCanvas.getContext("2d");
  const outputData = outputCtx.createImageData(outputWidth, outputHeight);

  for (let y = 0; y < outputHeight; y++) {
    for (let x = 0; x < outputWidth; x++) {
      const mapped = applyHomography(matrix, x, y);
      const color = sampleBilinear(sourceData, mapped.x, mapped.y);
      const out = (y * outputWidth + x) * 4;
      outputData.data[out] = color[0];
      outputData.data[out + 1] = color[1];
      outputData.data[out + 2] = color[2];
      outputData.data[out + 3] = 255;
    }
  }

  outputCtx.putImageData(outputData, 0, 0);

  const padding = Math.round(Math.min(outputWidth, outputHeight) * 0.08);
  const paddedCanvas = document.createElement("canvas");
  paddedCanvas.width = outputWidth + padding * 2;
  paddedCanvas.height = outputHeight + padding * 2;
  const paddedCtx = paddedCanvas.getContext("2d");
  paddedCtx.fillStyle = "#eef1f5";
  paddedCtx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
  paddedCtx.drawImage(outputCanvas, padding, padding);

  return {
    image: paddedCanvas,
    cardRect: { x: padding, y: padding, w: outputWidth, h: outputHeight },
  };
}

function homography(from, to) {
  const a = [];
  const b = [];
  for (let i = 0; i < 4; i++) {
    const x = from[i].x;
    const y = from[i].y;
    const u = to[i].x;
    const v = to[i].y;
    a.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    a.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }
  const h = solveLinearSystem(a, b);
  if (!h) return null;
  return [h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], 1];
}

function solveLinearSystem(a, b) {
  const n = b.length;
  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(a[r][i]) > Math.abs(a[maxRow][i])) maxRow = r;
    }
    if (Math.abs(a[maxRow][i]) < 1e-10) return null;
    [a[i], a[maxRow]] = [a[maxRow], a[i]];
    [b[i], b[maxRow]] = [b[maxRow], b[i]];

    const pivot = a[i][i];
    for (let c = i; c < n; c++) a[i][c] /= pivot;
    b[i] /= pivot;

    for (let r = 0; r < n; r++) {
      if (r === i) continue;
      const factor = a[r][i];
      for (let c = i; c < n; c++) a[r][c] -= factor * a[i][c];
      b[r] -= factor * b[i];
    }
  }
  return b;
}

function applyHomography(matrix, x, y) {
  const denominator = matrix[6] * x + matrix[7] * y + 1;
  return {
    x: (matrix[0] * x + matrix[1] * y + matrix[2]) / denominator,
    y: (matrix[3] * x + matrix[4] * y + matrix[5]) / denominator,
  };
}

function sampleBilinear(imageData, x, y) {
  const width = imageData.width;
  const height = imageData.height;
  x = Math.min(Math.max(0, x), width - 1);
  y = Math.min(Math.max(0, y), height - 1);
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(x0 + 1, width - 1);
  const y1 = Math.min(y0 + 1, height - 1);
  const tx = x - x0;
  const ty = y - y0;
  const c00 = pixel(imageData.data, width, x0, y0);
  const c10 = pixel(imageData.data, width, x1, y0);
  const c01 = pixel(imageData.data, width, x0, y1);
  const c11 = pixel(imageData.data, width, x1, y1);
  return [0, 1, 2].map((channel) => {
    const top = c00[channel] * (1 - tx) + c10[channel] * tx;
    const bottom = c01[channel] * (1 - tx) + c11[channel] * tx;
    return Math.round(top * (1 - ty) + bottom * ty);
  });
}

function pixel(data, width, x, y) {
  const index = (y * width + x) * 4;
  return [data[index], data[index + 1], data[index + 2]];
}

function getSourceWidth() {
  return sourceImage.naturalWidth || sourceImage.width;
}

function getSourceHeight() {
  return sourceImage.naturalHeight || sourceImage.height;
}

function updateZoomValue() {
  zoomValue.textContent = `${Math.round(scale * 100)}%`;
}

function stageCenterRatio() {
  const visualWidth = canvas.getBoundingClientRect().width || canvas.width;
  const visualHeight = canvas.getBoundingClientRect().height || canvas.height;
  return {
    x: (stageWrap.scrollLeft + stageWrap.clientWidth / 2) / visualWidth,
    y: (stageWrap.scrollTop + stageWrap.clientHeight / 2) / visualHeight,
  };
}

function restoreStageCenter(center) {
  const visualWidth = canvas.getBoundingClientRect().width || canvas.width;
  const visualHeight = canvas.getBoundingClientRect().height || canvas.height;
  stageWrap.scrollLeft = visualWidth * center.x - stageWrap.clientWidth / 2;
  stageWrap.scrollTop = visualHeight * center.y - stageWrap.clientHeight / 2;
}

function setModeHint() {
  if (mode === "corners") {
    modeHint.textContent = "Drag TL, TR, BR, and BL onto the physical card corners, then flatten the card.";
    cornerModeButton.textContent = "Measuring Mode";
    return;
  }
  cornerModeButton.textContent = "Set Corners";
  modeHint.textContent = perspectiveApplied
    ? "Perspective correction is applied. Now align the printed-area guide."
    : "For angled photos, set the four physical card corners first.";
}
