const canvas = document.querySelector("#cardCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const imageInput = document.querySelector("#imageInput");
const resumeInspectionInput = document.querySelector("#resumeInspectionInput");
const saveInspectionButton = document.querySelector("#saveInspectionButton");
const emptyUploadButton = document.querySelector("#emptyUploadButton");
const stageWrap = document.querySelector(".stage-wrap");
const microscopeVideo = document.querySelector("#microscopeVideo");
const emptyState = document.querySelector("#emptyState");
const cardMetadataForm = document.querySelector("#cardMetadataForm");
const startMicroscopeButton = document.querySelector("#startMicroscopeButton");
const stopMicroscopeButton = document.querySelector("#stopMicroscopeButton");
const cameraSelect = document.querySelector("#cameraSelect");
const cameraQualitySelect = document.querySelector("#cameraQualitySelect");
const filterSelect = document.querySelector("#filterSelect");
const filterStrengthControl = document.querySelector("#filterStrengthControl");
const freezeButton = document.querySelector("#freezeButton");
const snapshotButton = document.querySelector("#snapshotButton");
const captureCenteringButton = document.querySelector("#captureCenteringButton");
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
const reportNoteText = document.querySelector("#reportNoteText");
const reportSideSelect = document.querySelector("#reportSideSelect");
const markerColorSelect = document.querySelector("#markerColorSelect");
const addCenteringButtons = document.querySelectorAll("[data-add-centering-side]");
const addCardImagesButton = document.querySelector("#addCardImagesButton");
const reportEvidenceList = document.querySelector("#reportEvidenceList");
const exportReportButton = document.querySelector("#exportReportButton");
const reportDownloadLink = document.querySelector("#reportDownloadLink");
const markModal = document.querySelector("#markModal");
const markCanvas = document.querySelector("#markCanvas");
const markCtx = markCanvas.getContext("2d");
const saveMarkButton = document.querySelector("#saveMarkButton");
const cancelMarkButton = document.querySelector("#cancelMarkButton");
const flawTypeSelect = document.querySelector("#flawTypeSelect");
const flawSeveritySelect = document.querySelector("#flawSeveritySelect");
const flawDetailsInput = document.querySelector("#flawDetailsInput");
const loupeToggle = document.querySelector("#loupeToggle");
const markupShapeSelect = document.querySelector("#markupShapeSelect");
const clearLastMarkButton = document.querySelector("#clearLastMarkButton");
const clearAllMarksButton = document.querySelector("#clearAllMarksButton");
const promoImageInput = document.querySelector("#promoImageInput");
const addCurrentFrameButton = document.querySelector("#addCurrentFrameButton");
const promoTitleInput = document.querySelector("#promoTitleInput");
const promoSubtitleInput = document.querySelector("#promoSubtitleInput");
const promoCtaInput = document.querySelector("#promoCtaInput");
const promoFormatSelect = document.querySelector("#promoFormatSelect");
const promoDurationSelect = document.querySelector("#promoDurationSelect");
const promoThumbs = document.querySelector("#promoThumbs");
const generatePromoButton = document.querySelector("#generatePromoButton");
const promoStatus = document.querySelector("#promoStatus");
const promoDownloadLink = document.querySelector("#promoDownloadLink");
const promoPreviewCanvas = document.querySelector("#promoPreviewCanvas");
const promoBrandInput = document.querySelector("#promoBrandInput");
const promoStyleSelect = document.querySelector("#promoStyleSelect");
const cameraStateBadge = document.querySelector("#cameraStateBadge");
const workflowTabs = document.querySelectorAll("[data-panel-target]");
const panelViews = document.querySelectorAll("[data-panel-view]");
const panelScroll = document.querySelector(".panel-scroll");
const inspectionSteps = document.querySelectorAll("[data-inspection-step]");
const guideProgress = document.querySelector("#guideProgress");
const guideTitle = document.querySelector("#guideTitle");
const guideInstruction = document.querySelector("#guideInstruction");
const guideStatus = document.querySelector("#guideStatus");
const guideSideLabel = document.querySelector("#guideSideLabel");
const guideSideSelect = document.querySelector("#guideSideSelect");
const guideOpenPhotoButton = document.querySelector("#guideOpenPhotoButton");
const guideBackButton = document.querySelector("#guideBackButton");
const guidePrimaryButton = document.querySelector("#guidePrimaryButton");
const guideNextButton = document.querySelector("#guideNextButton");
const presentationModeButton = document.querySelector("#presentationModeButton");
const drawerToggleButton = document.querySelector("#drawerToggleButton");
const emptyCameraButton = document.querySelector("#emptyCameraButton");
const cardIdInput = document.querySelector("#cardIdInput");
const playerInput = document.querySelector("#playerInput");
const manufacturerInput = document.querySelector("#manufacturerInput");
const setInput = document.querySelector("#setInput");
const yearInput = document.querySelector("#yearInput");
const cardNumberInput = document.querySelector("#cardNumberInput");
const serialNumberInput = document.querySelector("#serialNumberInput");
const cardNameInput = document.querySelector("#cardNameInput");
const inspectionIdInput = document.querySelector("#inspectionIdInput");
const traceLockReportIdInput = document.querySelector("#traceLockReportIdInput");
const headerCardId = document.querySelector("#headerCardId");
const headerCardName = document.querySelector("#headerCardName");
const headerInspectionId = document.querySelector("#headerInspectionId");
const magnificationInput = document.querySelector("#magnificationInput");
const magnificationReadout = document.querySelector("#magnificationReadout");
const illuminationSelect = document.querySelector("#illuminationSelect");
const illuminationReadout = document.querySelector("#illuminationReadout");
const regionSelect = document.querySelector("#regionSelect");
const regionReadout = document.querySelector("#regionReadout");
const activeRegionLabel = document.querySelector("#activeRegionLabel");
const calibrationDistanceInput = document.querySelector("#calibrationDistanceInput");
const startCalibrationButton = document.querySelector("#startCalibrationButton");
const calibrateButton = document.querySelector("#calibrateButton");
const calibrationStatus = document.querySelector("#calibrationStatus");
const calibrationBadge = document.querySelector("#calibrationBadge");
const scaleReadout = document.querySelector("#scaleReadout");
const captureEvidenceButton = document.querySelector("#captureEvidenceButton");
const evidenceCount = document.querySelector("#evidenceCount");
const compareToggle = document.querySelector("#compareToggle");
const comparisonDivider = document.querySelector("#comparisonDivider");
const comparisonWash = document.querySelector("#comparisonWash");
const comparisonLine = document.querySelector("#comparisonLine");
const comparisonModeLabel = document.querySelector("#comparisonModeLabel");
const feedStatusText = document.querySelector("#feedStatusText");
const phoneTransferButton = document.querySelector("#phoneTransferButton");
const phoneTransferModal = document.querySelector("#phoneTransferModal");
const closePhoneTransferButton = document.querySelector("#closePhoneTransferButton");
const phoneTransferQr = document.querySelector("#phoneTransferQr");
const phoneTransferUrl = document.querySelector("#phoneTransferUrl");
const phoneTransferStatus = document.querySelector("#phoneTransferStatus");
const snapshotModal = document.querySelector("#snapshotModal");
const snapshotForm = document.querySelector("#snapshotForm");
const snapshotPreviewImage = document.querySelector("#snapshotPreviewImage");
const snapshotAnnotationInput = document.querySelector("#snapshotAnnotationInput");
const closeSnapshotModalButton = document.querySelector("#closeSnapshotModalButton");
const skipSnapshotReportButton = document.querySelector("#skipSnapshotReportButton");
const sessionsButton = document.querySelector("#sessionsButton");
const sessionsModal = document.querySelector("#sessionsModal");
const sessionsList = document.querySelector("#sessionsList");
const sessionsModalStatus = document.querySelector("#sessionsModalStatus");
const closeSessionsModalButton = document.querySelector("#closeSessionsModalButton");
const openSessionsRootButton = document.querySelector("#openSessionsRootButton");
const refreshSessionsButton = document.querySelector("#refreshSessionsButton");

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
let centeringImageSide = null;
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
const microscopeRawFrame = document.createElement("canvas");
microscopeRawFrame.width = 0;
const microscopeRawContext = microscopeRawFrame.getContext("2d");
const gpuSurfaceFilter = typeof TraceLockGpuFilter === "function" ? new TraceLockGpuFilter() : null;
let cpuGrayBuffer = null;
let pendingSnapshot = null;
let promoImages = [];
let reportEvidence = [];
let centeringReports = {};
let activeMarkIndex = null;
let activeMarkBase = null;
let lastInteractedItem = null;
let hoverPoint = null;
let activeMarkImage = null;
let currentMarks = [];
let isDrawingMark = false;
let markStartX = 0;
let markStartY = 0;
let markCurrentX = 0;
let markCurrentY = 0;
let reportObjectUrl = null;
let promoObjectUrl = null;
let millimetersPerPixel = null;
let calibrationLine = null;
let calibrationDrawing = false;
let presentationMode = false;

let guides = {
  outer: { x: 120, y: 80, w: 720, h: 1040 },
  inner: { x: 210, y: 180, w: 540, h: 840 },
};
let guidePoints = {
  outer: rectToGuidePoints(guides.outer),
  inner: rectToGuidePoints(guides.inner),
};

requestAnimationFrame(() => {
  fitCanvasToStage();
  updateZoomValue();
  updateInstrumentReadouts();
});

inspectionIdInput.value = createInspectionId();
traceLockReportIdInput.value = createTraceLockReportId();
syncInspectionIdentity();

imageInput.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) return;
  loadImage(file);
});

if (window.traceLockDesktop) {
  phoneTransferButton.hidden = false;
  phoneTransferButton.addEventListener("click", () => {
    phoneTransferModal.hidden = false;
  });
  closePhoneTransferButton.addEventListener("click", () => {
    phoneTransferModal.hidden = true;
  });
  phoneTransferModal.addEventListener("click", (event) => {
    if (event.target === phoneTransferModal) phoneTransferModal.hidden = true;
  });
  window.traceLockDesktop.onPhoneTransferReady((transfer) => {
    phoneTransferQr.src = transfer.qrDataUrl;
    phoneTransferUrl.textContent = transfer.url;
    phoneTransferStatus.textContent = "Waiting for a photo.";
  });
  window.traceLockDesktop.onPhoneTransferStatus((message) => {
    phoneTransferStatus.textContent = message;
  });
  window.traceLockDesktop.onPhonePhoto((photo) => {
    loadImageSource(photo.dataUrl, photo.name);
    phoneTransferStatus.textContent = `${photo.name} received and opened for centering.`;
    setTimeout(() => {
      phoneTransferModal.hidden = true;
    }, 900);
  });
  if (window.traceLockDesktop.session && sessionsButton) {
    sessionsButton.hidden = false;
    sessionsButton.addEventListener("click", () => {
      openSessionsModal();
    });
    closeSessionsModalButton.addEventListener("click", () => {
      sessionsModal.hidden = true;
    });
    sessionsModal.addEventListener("click", (event) => {
      if (event.target === sessionsModal) sessionsModal.hidden = true;
    });
    openSessionsRootButton.addEventListener("click", () => {
      window.traceLockDesktop.session.openSessionFolder("");
    });
    refreshSessionsButton.addEventListener("click", () => {
      refreshSessionsList();
    });
  }
  if (window.traceLockDesktop.cnc) {
    initCncControls();
  }
  if (window.traceLockDesktop.vision) {
    initVisionControls();
  }
}

resumeInspectionInput.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) return;
  resumeInspection(file);
  resumeInspectionInput.value = "";
});

saveInspectionButton.addEventListener("click", saveInspection);

emptyUploadButton.addEventListener("click", () => imageInput.click());
emptyCameraButton.addEventListener("click", () => startMicroscope());

presentationModeButton.addEventListener("click", togglePresentationMode);
drawerToggleButton.addEventListener("click", toggleInstrumentDrawer);

[cardIdInput, playerInput, manufacturerInput, setInput, yearInput, cardNumberInput, serialNumberInput, cardNameInput, inspectionIdInput, traceLockReportIdInput].forEach((input) => {
  input.addEventListener("input", syncInspectionIdentity);
});

magnificationInput.addEventListener("input", updateInstrumentReadouts);
illuminationSelect.addEventListener("change", updateInstrumentReadouts);
regionSelect.addEventListener("change", updateInstrumentReadouts);
calibrateButton.addEventListener("click", calibrateMeasurementScale);
startCalibrationButton.addEventListener("click", startCalibrationLine);
captureEvidenceButton.addEventListener("click", captureStandardEvidence);
compareToggle.addEventListener("change", () => updateComparisonView(true));
comparisonDivider.addEventListener("input", () => updateComparisonView(true));

inspectionSteps.forEach((step) => {
  step.addEventListener("click", () => selectInspectionStep(step));
});
guideSideSelect.addEventListener("change", () => {
  reportSideSelect.value = guideSideSelect.value;
  updateGuide();
});
guideBackButton.addEventListener("click", () => moveGuideStep(-1));
guideNextButton.addEventListener("click", () => moveGuideStep(1));
guidePrimaryButton.addEventListener("click", runGuideAction);
guideOpenPhotoButton.addEventListener("click", () => imageInput.click());
cardMetadataForm.addEventListener("submit", (event) => {
  event.preventDefault();
  selectInspectionStep(document.querySelector('[data-inspection-step="centering"]'));
});

workflowTabs.forEach((tab) => {
  tab.addEventListener("click", () => activatePanel(tab.dataset.panelTarget));
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

cameraQualitySelect.addEventListener("change", () => {
  if (microscopeStream) startMicroscope();
});

filterSelect.addEventListener("change", () => {
  updateInstrumentReadouts();
  if (mode === "microscope") restartMicroscopeDraw();
  else if (sourceImage) draw();
});

filterStrengthControl.addEventListener("input", () => {
  if (mode === "microscope") restartMicroscopeDraw();
  else if (sourceImage && (filterSelect.value !== "normal" || compareToggle.checked)) draw();
});

stageWrap.addEventListener("scroll", positionComparisonLine);
window.addEventListener("resize", positionComparisonLine);

freezeButton.addEventListener("click", () => {
  if (mode !== "microscope") return;
  microscopeFrozen = !microscopeFrozen;
  freezeButton.textContent = microscopeFrozen ? "Unfreeze" : "Freeze";
  microscopeStatus.textContent = microscopeFrozen
    ? "Frame frozen. Snapshot it or unfreeze to keep scanning."
    : "Live view resumed. Move the card slowly under angled light.";
  restartMicroscopeDraw();
});

snapshotButton.addEventListener("click", () => {
  if (mode !== "microscope") return;
  addMicroscopeSnapshot();
});

captureCenteringButton.addEventListener("click", () => {
  if (mode !== "microscope") return;
  captureCameraForCentering();
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
  lastInteractedItem = null;
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
  lastInteractedItem = null;
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

loupeToggle.addEventListener("change", () => {
  if (mode === "microscope") {
    restartMicroscopeDraw();
  } else {
    draw();
  }
});

// Live CV listeners removed

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

addCardImagesButton.addEventListener("click", () => {
  addCardImagesToReport(reportSideSelect.value);
});

exportReportButton.addEventListener("click", async () => {
  await exportHtmlReport();
});

addCenteringButtons.forEach((button) => {
  button.addEventListener("click", () => {
    addCenteringToReport(button.dataset.addCenteringSide);
  });
});
reportSideSelect.addEventListener("change", () => {
  guideSideSelect.value = reportSideSelect.value;
  updateGuide();
});

function normalizedMarkPoint(event) {
  const rect = markCanvas.getBoundingClientRect();
  return {
    x: Math.min(1, Math.max(0, (event.clientX - rect.left) / (rect.width || 1))),
    y: Math.min(1, Math.max(0, (event.clientY - rect.top) / (rect.height || 1))),
  };
}

markCanvas.addEventListener("pointerdown", (event) => {
  if (activeMarkIndex === null) return;
  isDrawingMark = true;
  markCanvas.setPointerCapture(event.pointerId);
  const point = normalizedMarkPoint(event);
  markStartX = point.x;
  markStartY = point.y;
  markCurrentX = point.x;
  markCurrentY = point.y;
});

markCanvas.addEventListener("pointermove", (event) => {
  if (!isDrawingMark) return;
  const point = normalizedMarkPoint(event);
  markCurrentX = point.x;
  markCurrentY = point.y;

  redrawMarkCanvas();
  const shape = markupShapeSelect ? markupShapeSelect.value : "rect";
  drawSingleMark(
    markCtx,
    markCanvas.width,
    markCanvas.height,
    {
      coordSpace: "normalized",
      shape,
      x1: markStartX,
      y1: markStartY,
      x2: markCurrentX,
      y2: markCurrentY,
      number: 0,
      color: markerColorSelect.value,
    },
    true
  );
});

markCanvas.addEventListener("pointerup", (event) => {
  if (!isDrawingMark) return;
  isDrawingMark = false;
  if (markCanvas.hasPointerCapture(event.pointerId)) {
    markCanvas.releasePointerCapture(event.pointerId);
  }
  const point = normalizedMarkPoint(event);
  markCurrentX = point.x;
  markCurrentY = point.y;

  const distPx = Math.hypot(
    (markCurrentX - markStartX) * markCanvas.width,
    (markCurrentY - markStartY) * markCanvas.height
  );
  if (distPx > 5) {
    const shape = markupShapeSelect ? markupShapeSelect.value : "rect";
    const flawType = flawTypeSelect ? flawTypeSelect.value : "Flaw";
    const severity = flawSeveritySelect ? flawSeveritySelect.value : "Moderate";
    const details = flawDetailsInput ? flawDetailsInput.value.trim() : "";

    currentMarks.push(
      createNormalizedMark({
        shape,
        x1: markStartX,
        y1: markStartY,
        x2: markCurrentX,
        y2: markCurrentY,
        flawType,
        severity,
        details,
        number: currentMarks.length + 1,
        color: markerColorSelect.value,
      })
    );

    if (flawDetailsInput) flawDetailsInput.value = "";
  }

  redrawMarkCanvas();
});

markCanvas.addEventListener("pointercancel", (event) => {
  if (isDrawingMark) {
    isDrawingMark = false;
    if (markCanvas.hasPointerCapture(event.pointerId)) {
      markCanvas.releasePointerCapture(event.pointerId);
    }
    redrawMarkCanvas();
  }
});

saveMarkButton.addEventListener("click", () => {
  saveMarkedEvidence();
});

cancelMarkButton.addEventListener("click", () => {
  closeMarkModal();
});

snapshotForm.addEventListener("submit", (event) => {
  event.preventDefault();
  confirmSnapshotReport();
});

closeSnapshotModalButton.addEventListener("click", () => {
  closeSnapshotModal(true);
});

skipSnapshotReportButton.addEventListener("click", () => {
  closeSnapshotModal(true);
});

snapshotModal.addEventListener("click", (event) => {
  if (event.target === snapshotModal) closeSnapshotModal(true);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !snapshotModal.hidden) {
    event.preventDefault();
    closeSnapshotModal(true);
  }
});

clearLastMarkButton.addEventListener("click", () => {
  if (currentMarks.length > 0) {
    currentMarks.pop();
    redrawMarkCanvas();
  }
});

clearAllMarksButton.addEventListener("click", () => {
  currentMarks = [];
  redrawMarkCanvas();
});

promoImageInput.addEventListener("change", (event) => {
  addPromoFiles([...event.target.files]);
  promoImageInput.value = "";
});

[promoBrandInput, promoTitleInput, promoSubtitleInput, promoCtaInput].forEach((input) => {
  input.addEventListener("input", refreshPromoPreview);
});

[promoFormatSelect, promoStyleSelect].forEach((select) => {
  select.addEventListener("change", refreshPromoPreview);
});

addCurrentFrameButton.addEventListener("click", () => {
  addPromoCanvas(canvas, "Current app view");
});

generatePromoButton.addEventListener("click", () => {
  generatePromoVideo();
});

refreshPromoPreview();

canvas.addEventListener("pointerdown", (event) => {
  if ((!sourceImage && mode !== "microscope") || (mode === "microscope" && !calibrationDrawing)) return;
  event.preventDefault();
  const point = canvasPoint(event);
  if (calibrationDrawing) {
    calibrationLine = { start: point, end: point };
    canvas.setPointerCapture(event.pointerId);
    if (mode === "microscope") restartMicroscopeDraw();
    else draw();
    return;
  }
  if (mode === "corners") {
    activeCorner = cornerHitTest(point);
    if (activeCorner !== null) {
      lastInteractedItem = { type: "corner", index: activeCorner };
      updateCornerPlacementHint(activeCorner);
      canvas.setPointerCapture(event.pointerId);
      draw();
    }
    return;
  }
  activeGuide = hitTest(point);
  if (activeGuide) {
    lastInteractedItem = { type: "guide", name: activeGuide.name, handle: activeGuide.handle };
    updateGuidePlacementHint(activeGuide);
    canvas.setPointerCapture(event.pointerId);
    dragOffset = point;
    draw();
  }
});

canvas.addEventListener("pointermove", (event) => {
  const point = canvasPoint(event);
  if (calibrationDrawing && calibrationLine) {
    event.preventDefault();
    calibrationLine.end = clampPoint(point);
    if (mode === "microscope") restartMicroscopeDraw();
    else draw();
    return;
  }
  if (mode === "corners" && activeCorner !== null) {
    event.preventDefault();
    corners[activeCorner] = clampPoint(point);
    hoverPoint = clampPoint(point);
    updateCornerPlacementHint(activeCorner);
    draw();
    return;
  }
  if (sourceImage && activeGuide) {
    const dx = point.x - dragOffset.x;
    const dy = point.y - dragOffset.y;
    moveGuide(activeGuide, dx, dy);
    dragOffset = point;
    hoverPoint = clampPoint(point);
    updateGuidePlacementHint(activeGuide);
    draw();
    return;
  }
  if (sourceImage && mode !== "microscope") {
    hoverPoint = point;
    draw();
  }
});

canvas.addEventListener("pointerup", (event) => {
  if (calibrationDrawing && calibrationLine) {
    calibrationDrawing = false;
    const pixels = pointDistance(calibrationLine.start, calibrationLine.end);
    calibrateButton.disabled = pixels <= 0;
    calibrationStatus.textContent = pixels > 0
      ? `Reference line: ${Math.round(pixels)} canvas px. Enter the known distance and apply calibration.`
      : "Draw a longer reference line, then enter its real-world distance.";
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    if (mode === "microscope") restartMicroscopeDraw();
    else draw();
    return;
  }
  const finishedGuide = activeGuide;
  activeGuide = null;
  activeCorner = null;
  if (mode === "corners") updateCornerPlacementHint();
  if (finishedGuide && mode !== "corners") updateGuidePlacementHint();
  if (canvas.hasPointerCapture(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId);
  }
});

canvas.addEventListener("pointercancel", (event) => {
  if (calibrationDrawing) {
    calibrationDrawing = false;
    calibrationLine = null;
    calibrateButton.disabled = true;
    calibrationStatus.textContent = "Calibration line cancelled. Draw it again when ready.";
  }
  activeGuide = null;
  activeCorner = null;
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  draw();
});

canvas.addEventListener("pointerleave", () => {
  hoverPoint = null;
  draw();
});

window.addEventListener("keydown", (event) => {
  if (!lastInteractedItem || !sourceImage || mode === "microscope") return;

  // Skip if user is typing in forms/text inputs
  if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;

  const nudgeKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "w", "a", "s", "d", "W", "A", "S", "D"];
  if (!nudgeKeys.includes(event.key)) return;

  event.preventDefault();
  const step = event.shiftKey ? 5 : 1;
  let dx = 0;
  let dy = 0;

  const keyLower = event.key.toLowerCase();
  if (event.key === "ArrowLeft" || keyLower === "a") dx = -step;
  if (event.key === "ArrowRight" || keyLower === "d") dx = step;
  if (event.key === "ArrowUp" || keyLower === "w") dy = -step;
  if (event.key === "ArrowDown" || keyLower === "s") dy = step;

  let changed = false;
  if (lastInteractedItem.type === "corner") {
    const corner = corners[lastInteractedItem.index];
    if (corner) {
      corner.x = Math.min(Math.max(0, corner.x + dx), canvas.width);
      corner.y = Math.min(Math.max(0, corner.y + dy), canvas.height);
      changed = true;
    }
  } else if (lastInteractedItem.type === "guide") {
    moveGuide({ name: lastInteractedItem.name, handle: lastInteractedItem.handle }, dx, dy);
    changed = true;
  }

  if (changed) {
    draw();
  }
});

function activatePanel(name) {
  workflowTabs.forEach((tab) => {
    const isActive = tab.dataset.panelTarget === name;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  panelViews.forEach((view) => {
    const isActive = view.dataset.panelView === name;
    view.classList.toggle("is-active", isActive);
    view.hidden = !isActive;
  });
  panelScroll.scrollTop = 0;
  if (name === "promote") refreshPromoPreview();
}

function createInspectionId() {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const time = `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  return `TL-${date}-${time}`;
}

function createTraceLockReportId() {
  return `TLR-${createInspectionId().slice(3)}`;
}

function inspectionMetadata() {
  return {
    cardId: cardIdInput.value.trim(),
    player: playerInput.value.trim(),
    manufacturer: manufacturerInput.value.trim(),
    set: setInput.value.trim(),
    year: yearInput.value.trim(),
    cardNumber: cardNumberInput.value.trim(),
    serialNumber: serialNumberInput.value.trim(),
    cardName: cardNameInput.value.trim(),
    inspectionId: inspectionIdInput.value.trim(),
    traceLockReportId: traceLockReportIdInput.value.trim(),
  };
}

function syncInspectionIdentity() {
  headerCardId.textContent = cardIdInput.value.trim() || "Unassigned";
  headerCardName.textContent = cardNameInput.value.trim() || playerInput.value.trim() || "No card loaded";
  headerInspectionId.textContent = inspectionIdInput.value.trim() || "New session";
}

function togglePresentationMode() {
  presentationMode = !presentationMode;
  document.body.classList.toggle("presentation-mode", presentationMode);
  presentationModeButton.setAttribute("aria-pressed", String(presentationMode));
  presentationModeButton.textContent = presentationMode ? "Exit Presentation" : "Presentation Mode";
  requestAnimationFrame(() => {
    fitCanvasToStage();
    updateComparisonView();
  });
}

function toggleInstrumentDrawer() {
  const closed = document.body.classList.toggle("drawer-closed");
  drawerToggleButton.setAttribute("aria-expanded", String(!closed));
  drawerToggleButton.textContent = closed ? "Show controls" : "Instrument controls";
  requestAnimationFrame(() => fitCanvasToStage());
  setTimeout(() => fitCanvasToStage(), 240);
}

const guideDetails = {
  metadata: ["Card metadata", "Enter the card details you know, then continue to V-centering.", "You can return to this form at any time."],
  centering: ["V-centering", "Open a straight-on full-card photo. Set the physical corners if needed, then align the outer and printed-area guides.", "A photo is used here. Save each side before opening another photo."],
  surface: ["Surface", "Start the microscope. Scan the surface under normal and angled light, then capture any useful view.", "Move through the card slowly and record visible findings."],
  corners: ["Corners", "Inspect each corner under the microscope. Choose a corner in Region before capturing evidence.", "Check all four corners, changing Region as you go."],
  edges: ["Edges", "Inspect all four edges under the microscope. Choose the edge in Region before capturing evidence.", "Look for wear, cuts, and layer changes."],
  print: ["Print", "Inspect print detail under the microscope. Set the region and light profile, then capture useful views.", "Record any visible print differences in Evidence."],
  uv: ["UV", "Use your UV light on the card, set the matching illumination profile, and capture the view.", "The illumination setting labels the evidence; the physical UV light supplies the illumination."],
  security: ["Security", "Inspect security details under the microscope and capture the relevant regions.", "Add observations to the captured evidence in Evidence."],
  report: ["Report", "Review saved centering, captured evidence, and notes. Then prepare the inspection report.", "Save an inspection checkpoint if you may return later."],
};
const evidenceSteps = ["centering", "surface", "corners", "edges", "print", "uv", "security", "unsorted"];

function activeEvidenceStep() {
  const step = document.querySelector(".inspection-step.is-active")?.dataset.inspectionStep;
  return evidenceSteps.includes(step) ? step : "unsorted";
}

function evidenceStep(item) {
  if (evidenceSteps.includes(item.step)) return item.step;
  return item.type === "card" || /^(front|back)-/.test(item.key || "") ? "centering" : "unsorted";
}

function evidenceStepLabel(step) {
  return step === "unsorted" ? "Unsorted" : guideDetails[step][0];
}

function groupedEvidence(items) {
  return evidenceSteps.map((step) => ({
    step,
    items: items.map((item, index) => ({ item, index })).filter(({ item }) => evidenceStep(item) === step),
  })).filter(({ items: groupedItems }) => groupedItems.length);
}

function updateGuide() {
  const active = document.querySelector(".inspection-step.is-active");
  const stepName = active?.dataset.inspectionStep || "metadata";
  const index = Array.from(inspectionSteps).findIndex((step) => step === active);
  const [title, instruction, status] = guideDetails[stepName];
  guideProgress.textContent = `Step ${index + 1} of ${inspectionSteps.length}`;
  guideTitle.textContent = title;
  guideInstruction.textContent = instruction;
  guideStatus.textContent = status;
  guideBackButton.disabled = index <= 0;
  guideNextButton.hidden = stepName === "metadata";
  guideNextButton.disabled = index >= inspectionSteps.length - 1 || (stepName === "centering" && !Object.values(centeringReports).some(Boolean));
  guideNextButton.textContent = stepName === "security" ? "Review report" : "Next";
  guideSideLabel.hidden = stepName !== "centering";
  guideOpenPhotoButton.hidden = stepName !== "centering" || !sourceImage || mode === "microscope";
  if (stepName === "metadata") {
    guidePrimaryButton.textContent = "Continue to V-centering";
  } else if (stepName === "centering") {
    const side = guideSideSelect.value;
    const saved = Object.keys(centeringReports).filter((name) => centeringReports[name]).map(capitalize);
    guideStatus.textContent = `${saved.length ? `Saved: ${saved.join(", ")}. ` : "Save at least one side to continue. "}${sourceImage && centeringImageSide !== side ? `Open a ${side} photo before saving this side.` : "Save each side before opening another photo."}`;
    guidePrimaryButton.textContent = sourceImage && mode !== "microscope" && centeringImageSide === side ? `Save ${side} centering` : `Open ${side} photo`;
  } else if (stepName === "report") {
    guidePrimaryButton.textContent = "Prepare report";
  } else {
    guidePrimaryButton.textContent = mode === "microscope" ? "Capture evidence" : "Start microscope";
  }
}

function moveGuideStep(direction) {
  const current = Array.from(inspectionSteps).findIndex((step) => step.classList.contains("is-active"));
  const target = inspectionSteps[current + direction];
  if (target) selectInspectionStep(target);
}

function runGuideAction() {
  const stepName = document.querySelector(".inspection-step.is-active")?.dataset.inspectionStep;
  if (stepName === "metadata") {
    moveGuideStep(1);
  } else if (stepName === "centering") {
    if (!sourceImage || mode === "microscope" || centeringImageSide !== guideSideSelect.value) imageInput.click();
    else addCenteringToReport(guideSideSelect.value);
  } else if (stepName === "report") {
    exportHtmlReport();
  } else if (mode === "microscope") {
    captureStandardEvidence();
  } else {
    startMicroscope();
  }
}

selectInspectionStep(inspectionSteps[0]);

function selectInspectionStep(step) {
  inspectionSteps.forEach((item) => item.classList.toggle("is-active", item === step));
  const inspectionStep = step.dataset.inspectionStep;
  const isMetadata = inspectionStep === "metadata";
  document.body.classList.toggle("metadata-step", isMetadata);
  document.body.classList.toggle("drawer-closed", isMetadata);
  drawerToggleButton.setAttribute("aria-expanded", String(!isMetadata));
  drawerToggleButton.textContent = isMetadata ? "Show controls" : "Instrument controls";
  cardMetadataForm.hidden = !isMetadata;
  emptyState.hidden = isMetadata;
  const regionByStep = {
    surface: "Surface A",
    corners: "Corner TL",
    edges: "Top edge",
    centering: "Full card",
    print: "Surface B",
    uv: "Security mark",
    security: "Security mark",
    report: "Full card",
  };
  regionSelect.value = regionByStep[inspectionStep] || "Full card";
  if (inspectionStep === "uv") illuminationSelect.value = "uv365";
  activeRegionLabel.textContent = `${capitalize(inspectionStep)} · ${regionSelect.value}`;
  activatePanel(step.dataset.openPanel || "inspect");
  updateInstrumentReadouts();
  updateGuide();
  requestAnimationFrame(() => fitCanvasToStage());
}

function activeComparisonFilter() {
  return filterSelect.value !== "normal" ? filterSelect.value : "edges";
}

function activeFilterLabel(filterName) {
  const labels = {
    normal: "Natural color",
    contrast: "High-contrast",
    edges: "Scratch edges",
    emboss: "Relief / divots",
    invert: "Inverted highlights",
    redChannel: "Red channel",
    blueChannel: "Blue channel",
    threshold: "Binary threshold",
  };
  return labels[filterName] || "Analysis";
}

function updateInstrumentReadouts() {
  const magnification = Math.max(1, Number(magnificationInput.value) || 1);
  const illuminationLabels = {
    normal: "Normal",
    angled: "Angled",
    uv365: "UV 365 nm",
    uv395: "UV 395 nm",
    transmitted: "Transmitted",
  };
  magnificationReadout.textContent = String(magnification);
  illuminationReadout.textContent = illuminationLabels[illuminationSelect.value] || "Normal";
  regionReadout.textContent = regionSelect.value;
  comparisonModeLabel.textContent = activeFilterLabel(activeComparisonFilter());
  const activeStep = document.querySelector(".inspection-step.is-active")?.dataset.inspectionStep || "surface";
  activeRegionLabel.textContent = `${capitalize(activeStep)} · ${regionSelect.value}`;
  updateComparisonView(false);
}

function calibrateMeasurementScale() {
  const distance = Number(calibrationDistanceInput.value);
  const pixels = calibrationLine ? pointDistance(calibrationLine.start, calibrationLine.end) : 0;
  if (!(distance > 0) || !(pixels > 0)) {
    calibrationStatus.textContent = "Draw a reference line, then enter its real-world distance.";
    return;
  }
  millimetersPerPixel = distance / pixels;
  const precision = millimetersPerPixel < 0.01 ? 4 : 3;
  scaleReadout.textContent = `${millimetersPerPixel.toFixed(precision)} mm/px`;
  calibrationBadge.textContent = "Calibrated";
  calibrationBadge.classList.add("active");
  calibrationStatus.textContent = `${distance} mm across ${Math.round(pixels)} canvas px at the current camera position.`;
  startCalibrationButton.textContent = "Redraw reference line";
  syncCncFovFromCalibration();
  if (mode === "microscope") restartMicroscopeDraw();
  else draw();
}

function startCalibrationLine() {
  if (!canvas.width || (!sourceImage && mode !== "microscope")) {
    calibrationStatus.textContent = "Open an image or start the microscope before drawing a calibration line.";
    return;
  }
  calibrationDrawing = true;
  calibrationLine = null;
  millimetersPerPixel = null;
  calibrationBadge.textContent = "In progress";
  calibrationBadge.classList.remove("active");
  scaleReadout.textContent = "Not calibrated";
  calibrateButton.disabled = true;
  calibrationStatus.textContent = "Drag across a known distance in the image.";
  if (mode === "microscope") restartMicroscopeDraw();
  else draw();
}

function resetCalibration(message = "V-centering ratios work without calibration. Use this only when you need a physical scale.") {
  millimetersPerPixel = null;
  calibrationLine = null;
  calibrationDrawing = false;
  calibrateButton.disabled = true;
  calibrationBadge.textContent = "Optional";
  calibrationBadge.classList.remove("active");
  scaleReadout.textContent = "Not calibrated";
  calibrationStatus.textContent = message;
}

function positionComparisonLine() {
  const enabled = compareToggle.checked && Boolean(sourceImage || mode === "microscope");
  comparisonWash.hidden = true;
  comparisonLine.hidden = !enabled;
  if (!enabled) return;
  const ratioValue = Math.min(0.95, Math.max(0.05, (Number(comparisonDivider.value) || 50) / 100));
  const stageRect = stageWrap.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  if (canvasRect.width > 0 && stageRect.width > 0) {
    const leftPx = canvasRect.left - stageRect.left + stageWrap.scrollLeft + canvasRect.width * ratioValue;
    const topPx = Math.max(0, canvasRect.top - stageRect.top + stageWrap.scrollTop);
    comparisonLine.style.left = `${Math.round(leftPx)}px`;
    comparisonLine.style.top = `${Math.round(topPx)}px`;
    comparisonLine.style.height = `${Math.round(canvasRect.height)}px`;
    comparisonLine.style.bottom = "auto";
  } else {
    comparisonLine.style.left = `${ratioValue * 100}%`;
    comparisonLine.style.top = "14px";
    comparisonLine.style.bottom = "14px";
    comparisonLine.style.height = "auto";
  }
}

function updateComparisonView(redraw = true) {
  comparisonDivider.disabled = !compareToggle.checked;
  comparisonModeLabel.textContent = activeFilterLabel(activeComparisonFilter());
  positionComparisonLine();
  if (!redraw) return;
  if (mode === "microscope") restartMicroscopeDraw();
  else if (sourceImage) draw();
}

function captureStandardEvidence() {
  if (mode === "microscope" ? !microscopeRawFrame.width : !sourceImage) {
    feedStatusText.textContent = "No source";
    microscopeStatus.textContent = "Open an image or start the microscope before capturing evidence.";
    return;
  }
  const originalUrl = captureOriginalSourceDataUrl();
  const annotatedUrl = canvas.toDataURL("image/png");
  const region = regionSelect.value;
  const illumination = illuminationReadout.textContent;
  const scaleLabel = millimetersPerPixel ? scaleReadout.textContent : "uncalibrated scale";
  const metadata = `${magnificationReadout.textContent}x · ${illumination} · ${region} · ${scaleLabel} · ${inspectionIdInput.value}`;
  addReportEvidence(`${region} original`, `Unmodified source capture. ${metadata}`, originalUrl, "", "original");
  addReportEvidence(`${region} annotated view`, `Working view with inspection overlays. ${metadata}`, annotatedUrl, "", "annotated");
  addEvidenceThumbnail(originalUrl, `${region} original`);
  addEvidenceThumbnail(annotatedUrl, `${region} annotated`);
  queueOutputImage(originalUrl, `${region} original`);
  queueOutputImage(annotatedUrl, `${region} annotated`);
  feedStatusText.textContent = "Evidence captured";
  microscopeStatus.textContent = `${region} captured as separate original and annotated evidence.`;
  guideStatus.textContent = `${region} captured. Continue scanning or go to the next step.`;
}

function captureOriginalSourceDataUrl() {
  if (mode === "microscope") {
    return microscopeRawFrame.width ? microscopeRawFrame.toDataURL("image/png") : "";
  }
  return imageSourceToDataUrl(originalImage || sourceImage);
}

function addEvidenceThumbnail(url, label) {
  const link = document.createElement("a");
  const image = document.createElement("img");
  link.href = url;
  link.download = `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}.png`;
  link.title = label;
  image.src = url;
  image.alt = label;
  link.append(image);
  snapshotStrip.prepend(link);
  while (snapshotStrip.children.length > 10) snapshotStrip.lastElementChild.remove();
}

function loadImage(file) {
  stopMicroscope();
  const reader = new FileReader();
  reader.onload = () => {
    loadImageSource(reader.result, file.name);
  };
  reader.readAsDataURL(file);
}

function loadImageSource(dataUrl, name = "iPhone card photo.jpg") {
  stopMicroscope();
  const image = new Image();
  image.onload = () => {
    originalImage = image;
    sourceImage = image;
    resetCalibration();
    imageName = name;
    centeringImageSide = guideSideSelect.value;
    if (!cardNameInput.value.trim()) cardNameInput.value = name.replace(/\.[^.]+$/, "");
    syncInspectionIdentity();
    feedStatusText.textContent = "Image loaded";
    emptyState.style.display = "none";
    scale = 1;
    zoomControl.value = "1";
    resizeCanvas();
    fitCanvasToStage();
    updateZoomValue();
    resetCorners();
    resetGuides();
    detectCardAndWindow();
    perspectiveApplied = false;
    flattenedCardRect = null;
    lastInteractedItem = null;
    mode = "measure";
    setModeHint();
    draw();
    selectInspectionStep(document.querySelector('[data-inspection-step="centering"]'));
  };
  image.onerror = () => {
    phoneTransferStatus.textContent = "The photo format could not be opened. On the iPhone, choose Most Compatible and try again.";
  };
  image.src = dataUrl;
}

async function startMicroscope() {
  stopMicroscope(false);
  resetCalibration("For physical measurements, set the microscope height and focus, then draw across a known distance.");
  try {
    const deviceId = cameraSelect.value;
    const constraints = cameraConstraints(deviceId, cameraQualitySelect.value);
    microscopeStream = await navigator.mediaDevices.getUserMedia(constraints);
    microscopeVideo.srcObject = microscopeStream;
    await microscopeVideo.play();
    await populateCameraSelect();
    mode = "microscope";
    microscopeFrozen = false;
    freezeButton.textContent = "Freeze";
    emptyState.style.display = "none";
    scale = 1;
    zoomControl.value = "1";
    updateZoomValue();
    microscopeStatus.textContent = `Live microscope view at ${microscopeVideo.videoWidth || "?"} x ${microscopeVideo.videoHeight || "?"}.`;
    cameraStateBadge.textContent = "Live";
    cameraStateBadge.classList.add("accent");
    feedStatusText.textContent = "Live microscope";
    restartMicroscopeDraw();
    updateGuide();
    guideStatus.textContent = "Microscope live. Capture evidence when the selected region is in view.";
  } catch (error) {
    microscopeStatus.textContent = "Camera access failed. Open this tool from localhost or HTTPS and allow camera permission.";
    cameraStateBadge.textContent = "Unavailable";
    cameraStateBadge.classList.remove("accent");
    feedStatusText.textContent = "Camera unavailable";
    guideStatus.textContent = microscopeStatus.textContent;
  }
}

function cameraConstraints(deviceId, quality) {
  const video = deviceId ? { deviceId: { exact: deviceId } } : {};
  if (quality === "best") {
    video.width = { ideal: 1920 };
    video.height = { ideal: 1080 };
  } else if (quality && quality !== "default") {
    const [width, height] = quality.split("x").map(Number);
    video.width = { ideal: width };
    video.height = { ideal: height };
  }
  return {
    video: Object.keys(video).length ? video : true,
    audio: false,
  };
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
  microscopeRawFrame.width = 0;
  freezeButton.textContent = "Freeze";
  cameraStateBadge.textContent = "Offline";
  cameraStateBadge.classList.remove("accent");
  feedStatusText.textContent = sourceImage ? "Image loaded" : "Ready";
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
  updateGuide();
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
  if ((!microscopeFrozen || !microscopeRawFrame.width) && microscopeVideo.readyState >= 2) {
    const { videoWidth, videoHeight } = microscopeVideo;
    if (microscopeRawFrame.width !== videoWidth || microscopeRawFrame.height !== videoHeight) {
      microscopeRawFrame.width = videoWidth;
      microscopeRawFrame.height = videoHeight;
    }
    microscopeRawContext.drawImage(microscopeVideo, 0, 0);
  }

  if (!microscopeRawFrame.width) {
    microscopeFrameId = requestAnimationFrame(drawMicroscopeFrame);
    return;
  }

  const { width, height } = microscopeRawFrame;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    resizeMicroscopeCanvas();
  }

  renderFilteredSurface(microscopeRawFrame, width, height, { allowComparison: true });
  drawPhysicalScaleOverlay();
  drawCalibrationOverlay();
  positionComparisonLine();

  // AI live scanner checks removed

  if (microscopeFrozen) return;
  microscopeFrameId = requestAnimationFrame(drawMicroscopeFrame);
}

// runLiveAnomalyDetection function removed

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
  positionComparisonLine();
}

function renderFilteredSurface(source, width, height, { allowComparison = true } = {}) {
  const splitEnabled = allowComparison && compareToggle.checked;
  const filter = splitEnabled ? activeComparisonFilter() : filterSelect.value;
  const strength = Number(filterStrengthControl.value) || 3;
  const splitRatio = Math.min(0.95, Math.max(0.05, (Number(comparisonDivider.value) || 50) / 100));

  if (filter === "normal" && !splitEnabled) {
    ctx.drawImage(source, 0, 0, width, height);
    return;
  }

  if (gpuSurfaceFilter?.ready) {
    const rendered = gpuSurfaceFilter.render(source, width, height, {
      filter,
      strength,
      splitEnabled,
      splitRatio,
    });
    if (rendered) {
      ctx.drawImage(gpuSurfaceFilter.canvas, 0, 0, width, height);
      return;
    }
  }

  ctx.drawImage(source, 0, 0, width, height);
  applySurfaceFilter(filter, strength, splitEnabled ? Math.round(width * splitRatio) : 0);
}

function applySurfaceFilter(filter = filterSelect.value, strength = Number(filterStrengthControl.value), startX = 0) {
  if (filter === "normal") return;
  const width = canvas.width;
  const height = canvas.height;
  const clampedStartX = Math.max(0, Math.min(width, startX | 0));
  if (clampedStartX >= width) return;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  if (filter === "contrast" || filter === "invert") {
    const contrast = 1 + strength * 0.45;
    for (let y = 0; y < height; y++) {
      const row = y * width;
      for (let x = clampedStartX; x < width; x++) {
        const i = (row + x) * 4;
        const gray = luminance(data[i], data[i + 1], data[i + 2]);
        let value = clampByte((gray - 128) * contrast + 128);
        if (filter === "invert") value = 255 - value;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
      }
    }
  } else if (filter === "redChannel" || filter === "blueChannel") {
    const channelIdx = filter === "redChannel" ? 0 : 2;
    for (let y = 0; y < height; y++) {
      const row = y * width;
      for (let x = clampedStartX; x < width; x++) {
        const i = (row + x) * 4;
        const val = data[i + channelIdx];
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
      }
    }
  } else if (filter === "threshold") {
    const limit = strength * 42;
    for (let y = 0; y < height; y++) {
      const row = y * width;
      for (let x = clampedStartX; x < width; x++) {
        const i = (row + x) * 4;
        const gray = luminance(data[i], data[i + 1], data[i + 2]);
        const val = gray >= limit ? 255 : 0;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
      }
    }
  } else {
    const pixelCount = width * height;
    if (!cpuGrayBuffer || cpuGrayBuffer.length !== pixelCount) {
      cpuGrayBuffer = new Uint8Array(pixelCount);
    }
    for (let p = 0; p < pixelCount; p++) {
      const i = p * 4;
      cpuGrayBuffer[p] = clampByte(luminance(data[i], data[i + 1], data[i + 2]));
    }
    const kernel = filter === "edges"
      ? [-1, -1, -1, -1, 8 + strength, -1, -1, -1, -1]
      : [-2, -1, 0, -1, 1, 1, 0, 1, 2];
    const gain = filter === "emboss" ? 0.55 + strength * 0.25 : 1;
    convolveGrayscale(cpuGrayBuffer, data, width, height, kernel, filter === "emboss" ? 128 : 0, clampedStartX, gain);
  }

  ctx.putImageData(imageData, 0, 0);
}

function convolveGrayscale(graySource, target, width, height, kernel, offset, startX = 1, gain = 1) {
  const minX = Math.max(1, startX);
  const k0 = kernel[0], k1 = kernel[1], k2 = kernel[2];
  const k3 = kernel[3], k4 = kernel[4], k5 = kernel[5];
  const k6 = kernel[6], k7 = kernel[7], k8 = kernel[8];
  for (let y = 1; y < height - 1; y++) {
    const rowAbove = (y - 1) * width;
    const rowMid = y * width;
    const rowBelow = (y + 1) * width;
    for (let x = minX; x < width - 1; x++) {
      const sum =
        graySource[rowAbove + x - 1] * k0 + graySource[rowAbove + x] * k1 + graySource[rowAbove + x + 1] * k2 +
        graySource[rowMid + x - 1] * k3 + graySource[rowMid + x] * k4 + graySource[rowMid + x + 1] * k5 +
        graySource[rowBelow + x - 1] * k6 + graySource[rowBelow + x] * k7 + graySource[rowBelow + x + 1] * k8;
      const value = clampByte(sum * gain + offset);
      const out = (rowMid + x) * 4;
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
  if (!canvas.width || !canvas.height) return;
  const title = `${regionSelect.value} snapshot`;
  const url = canvas.toDataURL("image/png");
  const step = activeEvidenceStep();
  addEvidenceThumbnail(url, title);
  queueOutputImage(url, title);
  pendingSnapshot = { title, url, step };
  snapshotPreviewImage.src = url;
  snapshotAnnotationInput.value = "";
  snapshotModal.hidden = false;
  feedStatusText.textContent = "Snapshot saved";
  microscopeStatus.textContent = "Snapshot saved. Add an optional annotation to include it in the report.";
  requestAnimationFrame(() => snapshotAnnotationInput.focus());
}

function confirmSnapshotReport() {
  if (!pendingSnapshot) {
    closeSnapshotModal(false);
    return;
  }
  const { title, url, step } = pendingSnapshot;
  const annotation = snapshotAnnotationInput.value.trim();
  addReportEvidence(title, annotation || title, url, "", "snapshot", step);
  closeSnapshotModal(false);
  feedStatusText.textContent = "Snapshot added";
  microscopeStatus.textContent = "Snapshot saved and added to the report.";
}

function closeSnapshotModal(skipped = false) {
  snapshotModal.hidden = true;
  snapshotPreviewImage.removeAttribute("src");
  snapshotAnnotationInput.value = "";
  pendingSnapshot = null;
  if (skipped) {
    microscopeStatus.textContent = "Snapshot saved below. Click a thumbnail to download it.";
  }
}

function addCenteringToReport(side) {
  if (!metricEls.report.value.trim()) {
    reportStatus("Measure a card side before adding centering to the report.");
    return;
  }
  centeringReports[side] = metricEls.report.value;
  reportSideSelect.value = side;
  addCardImagesToReport(side);
  renderReportEvidence();
  reportStatus(`${capitalize(side)} centering added to the report.`);
  updateGuide();
}

function addCardImagesToReport(side = reportSideSelect.value) {
  if (!sourceImage) {
    reportStatus("Upload, capture, or flatten a card image first.");
    return;
  }
  const label = capitalize(side);

  if (originalImage) {
    addReportEvidence(`${label} original card image`, `${label} source image before perspective correction.`, imageSourceToDataUrl(originalImage), `${side}-original-card`, "card", "centering");
  }

  if (perspectiveApplied && sourceImage) {
    addReportEvidence(`${label} flattened card image`, `${label} perspective-corrected card image without measurement overlay.`, imageSourceToDataUrl(sourceImage), `${side}-flattened-card`, "card", "centering");
    addReportEvidence(`${label} flattened card with overlay`, `${label} perspective-corrected card with current measurement guides.`, canvas.toDataURL("image/png"), `${side}-flattened-overlay`, "card", "centering");
  } else {
    addReportEvidence(`${label} current card with overlay`, `${label} current card image with measurement guides.`, canvas.toDataURL("image/png"), `${side}-current-overlay`, "card", "centering");
  }

  renderReportEvidence();
  reportStatus("Card images added to the report.");
}

function activeSessionId() {
  const raw = inspectionIdInput.value.trim() || createInspectionId();
  if (!inspectionIdInput.value.trim()) inspectionIdInput.value = raw;
  return raw;
}

function isDataImageUrl(url) {
  return typeof url === "string" && url.startsWith("data:image/");
}

function persistEvidenceItemToDisk(item) {
  const api = window.traceLockDesktop?.session;
  if (!api || !item) return Promise.resolve(item);
  const sessionId = activeSessionId();
  const itemId = item.id || `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  item.id = itemId;

  const jobs = [];
  if (isDataImageUrl(item.originalUrl)) {
    const sameAsView = item.url === item.originalUrl;
    jobs.push(
      api.saveAsset({ sessionId, assetKey: `${itemId}-orig`, dataUrl: item.originalUrl }).then((saved) => {
        item.originalAssetPath = saved.assetPath;
        item.originalUrl = saved.mediaUrl;
        if (sameAsView) {
          item.assetPath = saved.assetPath;
          item.url = saved.mediaUrl;
        }
      })
    );
  }
  if (isDataImageUrl(item.url) && item.url !== item.originalUrl) {
    jobs.push(
      api.saveAsset({ sessionId, assetKey: `${itemId}-view`, dataUrl: item.url }).then((saved) => {
        item.assetPath = saved.assetPath;
        item.url = saved.mediaUrl;
      })
    );
  }
  if (!jobs.length) return Promise.resolve(item);
  return Promise.all(jobs)
    .then(() => {
      renderReportEvidence();
      return item;
    })
    .catch(() => item);
}

function addReportEvidence(title, annotation, url, key = "", type = "general", step = activeEvidenceStep(), extra = {}) {
  const item = {
    id: extra.id || `${key || type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    key,
    type,
    step,
    title,
    annotation,
    originalAnnotation: annotation,
    url,
    originalUrl: url,
    assetPath: extra.assetPath || "",
    originalAssetPath: extra.originalAssetPath || "",
    width: extra.width || null,
    height: extra.height || null,
    machine: extra.machine || null,
    marks: [],
    suggestedMarks: Array.isArray(extra.suggestedMarks) ? extra.suggestedMarks : [],
    createdAt: new Date().toLocaleString(),
  };
  const existingIndex = key ? reportEvidence.findIndex((entry) => entry.key === key) : -1;
  if (existingIndex >= 0) {
    reportEvidence[existingIndex] = item;
  } else {
    reportEvidence.push(item);
  }
  renderReportEvidence();
  persistEvidenceItemToDisk(item);
  return item;
}

function renderReportEvidence() {
  if (reportObjectUrl) {
    URL.revokeObjectURL(reportObjectUrl);
    reportObjectUrl = null;
  }
  reportDownloadLink.classList.remove("is-ready");
  reportDownloadLink.removeAttribute("href");
  reportEvidenceList.innerHTML = "";
  groupedEvidence(reportEvidence).forEach(({ step, items }) => {
    const group = document.createElement("section");
    group.className = "evidence-group";
    const heading = document.createElement("h4");
    heading.textContent = `${evidenceStepLabel(step)} (${items.length})`;
    group.append(heading);
    items.forEach(({ item, index }) => {
      const row = document.createElement("div");
      row.className = "evidence-item";
      const image = document.createElement("img");
      image.src = item.url;
      image.alt = item.title;
      const text = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = item.title;
      const annotation = document.createElement("span");
      annotation.textContent = item.annotation;
      const stepLabel = document.createElement("label");
      stepLabel.className = "evidence-step-label";
      stepLabel.textContent = "Workflow step";
      const stepSelect = document.createElement("select");
      stepSelect.setAttribute("aria-label", `Workflow step for ${item.title}`);
      evidenceSteps.forEach((optionStep) => {
        const option = document.createElement("option");
        option.value = optionStep;
        option.textContent = evidenceStepLabel(optionStep);
        stepSelect.append(option);
      });
      stepSelect.value = step;
      stepSelect.addEventListener("change", () => {
        item.step = stepSelect.value;
        renderReportEvidence();
        reportStatus(`${item.title} moved to ${evidenceStepLabel(item.step)}.`);
      });
      stepLabel.append(stepSelect);
      const actions = document.createElement("div");
      actions.className = "evidence-actions";
      const markButton = document.createElement("button");
      markButton.type = "button";
      const aiCount = Array.isArray(item.suggestedMarks) ? item.suggestedMarks.length : 0;
      markButton.textContent = aiCount > 0 ? `Review (${aiCount} AI)` : "Mark";
      markButton.addEventListener("click", () => openMarkModal(index));
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", () => removeReportEvidence(index));
      if (window.traceLockDesktop?.vision) {
        const detectBtn = document.createElement("button");
        detectBtn.type = "button";
        detectBtn.className = "secondary";
        detectBtn.textContent = "Detect";
        detectBtn.addEventListener("click", () => runVisionOnEvidenceItem(index, true));
        actions.append(markButton, detectBtn, removeButton);
      } else {
        actions.append(markButton, removeButton);
      }
      text.append(title, annotation, stepLabel, actions);
      row.append(image, text);
      group.append(row);
    });
    reportEvidenceList.append(group);
  });
  evidenceCount.textContent = `${reportEvidence.length} report image${reportEvidence.length === 1 ? "" : "s"}`;
}

function removeReportEvidence(index) {
  reportEvidence.splice(index, 1);
  renderReportEvidence();
  reportStatus("Evidence removed from the report.");
}

function clampUnit(value) {
  return Math.min(1, Math.max(0, Number(value) || 0));
}

function createNormalizedMark(mark) {
  const x1 = clampUnit(mark.x1);
  const y1 = clampUnit(mark.y1);
  const x2 = clampUnit(mark.x2);
  const y2 = clampUnit(mark.y2);
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  return {
    coordSpace: "normalized",
    shape: mark.shape || "rect",
    x1,
    y1,
    x2,
    y2,
    bbox: {
      cx: Number(((minX + maxX) / 2).toFixed(6)),
      cy: Number(((minY + maxY) / 2).toFixed(6)),
      w: Number((maxX - minX).toFixed(6)),
      h: Number((maxY - minY).toFixed(6)),
    },
    flawType: mark.flawType || "Flaw",
    severity: mark.severity || "Moderate",
    details: mark.details || "",
    number: mark.number || 1,
    color: mark.color || markerColorSelect.value,
  };
}

function normalizeStoredMark(mark, legacyWidth, legacyHeight) {
  if (mark.coordSpace === "normalized") {
    return createNormalizedMark(mark);
  }
  const maxCoord = Math.max(Math.abs(mark.x1 || 0), Math.abs(mark.y1 || 0), Math.abs(mark.x2 || 0), Math.abs(mark.y2 || 0));
  if (maxCoord <= 1) {
    return createNormalizedMark(mark);
  }
  const w = Math.max(1, legacyWidth || 900);
  const h = Math.max(1, legacyHeight || 700);
  return createNormalizedMark({
    ...mark,
    x1: mark.x1 / w,
    y1: mark.y1 / h,
    x2: mark.x2 / w,
    y2: mark.y2 / h,
  });
}

let currentSuggestions = [];

function openMarkModal(index) {
  activeMarkIndex = index;
  activeMarkBase = reportEvidence[index].originalUrl || reportEvidence[index].url;

  if (flawTypeSelect) flawTypeSelect.selectedIndex = 0;
  if (flawSeveritySelect) flawSeveritySelect.value = "Moderate";
  if (flawDetailsInput) flawDetailsInput.value = "";
  if (markupShapeSelect) markupShapeSelect.selectedIndex = 0;

  activeMarkImage = new Image();
  if (String(activeMarkBase).startsWith("tracelock-media://")) activeMarkImage.crossOrigin = "anonymous";
  activeMarkImage.onload = () => {
    const naturalWidth = activeMarkImage.naturalWidth || activeMarkImage.width;
    const naturalHeight = activeMarkImage.naturalHeight || activeMarkImage.height;
    const maxWidth = 900;
    const maxHeight = 700;
    const previewScale = Math.min(1, maxWidth / naturalWidth, maxHeight / naturalHeight);
    markCanvas.width = Math.max(1, Math.round(naturalWidth * previewScale));
    markCanvas.height = Math.max(1, Math.round(naturalHeight * previewScale));
    currentMarks = (reportEvidence[index].marks || []).map((mark, i) =>
      normalizeStoredMark({ ...mark, number: mark.number || i + 1 }, markCanvas.width, markCanvas.height)
    );
    currentSuggestions = (reportEvidence[index].suggestedMarks || []).map((sug) => ({ ...sug }));
    renderVisionSuggestionsPanel();
    redrawMarkCanvas();
    markModal.hidden = false;
  };
  activeMarkImage.src = activeMarkBase;
}

function redrawMarkCanvas() {
  if (!activeMarkImage) return;
  markCtx.clearRect(0, 0, markCanvas.width, markCanvas.height);
  markCtx.drawImage(activeMarkImage, 0, 0, markCanvas.width, markCanvas.height);
  currentSuggestions.forEach((sug, idx) => {
    drawSuggestedMark(markCtx, markCanvas.width, markCanvas.height, sug, idx + 1);
  });
  currentMarks.forEach((mark) => {
    drawSingleMark(markCtx, markCanvas.width, markCanvas.height, mark, false);
  });
}

function drawSuggestedMark(targetCtx, width, height, sug, index) {
  const x1 = sug.x1 * width;
  const y1 = sug.y1 * height;
  const x2 = sug.x2 * width;
  const y2 = sug.y2 * height;
  const uiScale = Math.max(1, Math.min(width, height) / 700);
  targetCtx.save();
  targetCtx.strokeStyle = "#51dfcd";
  targetCtx.lineWidth = 2.2 * uiScale;
  targetCtx.setLineDash([7 * uiScale, 4 * uiScale]);
  targetCtx.strokeRect(x1, y1, x2 - x1, y2 - y1);
  targetCtx.setLineDash([]);
  const pct = Math.round((Number(sug.confidence) || 0) * 100);
  const label = `AI ${index} · ${sug.flawType}${pct ? ` ${pct}%` : ""}`;
  targetCtx.font = `700 ${Math.round(10 * uiScale)}px system-ui, sans-serif`;
  const textWidth = targetCtx.measureText(label).width;
  const boxW = textWidth + 10 * uiScale;
  const boxH = 18 * uiScale;
  const bx = Math.min(width - boxW - 2, Math.max(2, Math.min(x1, x2)));
  const rawBy = Math.min(y1, y2) - boxH - 3 * uiScale;
  const by = rawBy < 2 ? Math.min(height - boxH - 2, Math.min(y1, y2) + 3 * uiScale) : rawBy;
  targetCtx.fillStyle = "rgba(8, 28, 32, 0.92)";
  targetCtx.fillRect(bx, by, boxW, boxH);
  targetCtx.strokeStyle = "#51dfcd";
  targetCtx.lineWidth = 1;
  targetCtx.strokeRect(bx, by, boxW, boxH);
  targetCtx.fillStyle = "#51dfcd";
  targetCtx.textBaseline = "middle";
  targetCtx.fillText(label, bx + 5 * uiScale, by + boxH / 2 + 0.5);
  targetCtx.restore();
}

function renderVisionSuggestionsPanel() {
  const bar = document.querySelector("#visionSuggestionsBar");
  const titleEl = document.querySelector("#visionSuggestionsTitle");
  const listEl = document.querySelector("#visionSuggestionsList");
  if (!bar || !titleEl || !listEl) return;

  if (!currentSuggestions.length) {
    bar.hidden = true;
    listEl.innerHTML = "";
    return;
  }

  bar.hidden = false;
  titleEl.textContent = `AI Suggestions (${currentSuggestions.length} unverified)`;
  listEl.innerHTML = "";
  currentSuggestions.forEach((sug, idx) => {
    const row = document.createElement("div");
    row.className = "vision-suggestion-row";
    const info = document.createElement("span");
    const pct = Math.round((Number(sug.confidence) || 0) * 100);
    info.textContent = `AI #${idx + 1} · ${sug.flawType} (${sug.severity}${pct ? `, ${pct}%` : ""})${sug.details ? ` — ${sug.details}` : ""}`;

    const btns = document.createElement("div");
    btns.className = "row-btns";
    const acceptBtn = document.createElement("button");
    acceptBtn.type = "button";
    acceptBtn.textContent = "Accept";
    acceptBtn.addEventListener("click", () => {
      const accepted = currentSuggestions.splice(idx, 1)[0];
      currentMarks.push(
        createNormalizedMark({
          ...accepted,
          number: currentMarks.length + 1,
          color: markerColorSelect.value,
        })
      );
      renderVisionSuggestionsPanel();
      redrawMarkCanvas();
    });
    const rejectBtn = document.createElement("button");
    rejectBtn.type = "button";
    rejectBtn.className = "secondary";
    rejectBtn.textContent = "Reject";
    rejectBtn.addEventListener("click", () => {
      currentSuggestions.splice(idx, 1);
      renderVisionSuggestionsPanel();
      redrawMarkCanvas();
    });
    btns.append(acceptBtn, rejectBtn);
    row.append(info, btns);
    listEl.append(row);
  });
}

function drawSingleMark(targetCtx, width, height, mark, isPreview = false) {
  const x1 = mark.x1 * width;
  const y1 = mark.y1 * height;
  const x2 = mark.x2 * width;
  const y2 = mark.y2 * height;
  const color = mark.color || markerColorSelect.value;
  const uiScale = Math.max(1, Math.min(width, height) / 700);

  targetCtx.save();
  targetCtx.strokeStyle = color;
  targetCtx.lineWidth = (isPreview ? 2 : 3) * uiScale;
  if (isPreview) {
    targetCtx.setLineDash([6 * uiScale, 4 * uiScale]);
  }

  if (mark.shape === "rect") {
    targetCtx.strokeRect(x1, y1, x2 - x1, y2 - y1);
  } else if (mark.shape === "ellipse") {
    targetCtx.beginPath();
    const rx = Math.abs(x2 - x1) / 2;
    const ry = Math.abs(y2 - y1) / 2;
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    targetCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    targetCtx.stroke();
  }
  targetCtx.restore();

  if (!isPreview) {
    targetCtx.save();
    const badgeRadius = 10 * uiScale;
    const pad = badgeRadius + 2 * uiScale;
    const badgeX = Math.min(width - pad, Math.max(pad, Math.min(x1, x2)));
    const rawBadgeY = Math.min(y1, y2) - 12 * uiScale;
    const badgeY = rawBadgeY < pad ? Math.min(height - pad, Math.min(y1, y2) + 12 * uiScale) : rawBadgeY;

    targetCtx.beginPath();
    targetCtx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
    targetCtx.fillStyle = color;
    targetCtx.fill();

    targetCtx.fillStyle = "#ffffff";
    targetCtx.font = `bold ${Math.round(11 * uiScale)}px system-ui, sans-serif`;
    targetCtx.textAlign = "center";
    targetCtx.textBaseline = "middle";
    targetCtx.fillText(String(mark.number), badgeX, badgeY + uiScale * 0.5);
    targetCtx.restore();
  }
}

function renderFullResolutionMarkedDataUrl(image, marks) {
  const fullWidth = image.naturalWidth || image.width;
  const fullHeight = image.naturalHeight || image.height;
  const fullCanvas = document.createElement("canvas");
  fullCanvas.width = fullWidth;
  fullCanvas.height = fullHeight;
  const fullCtx = fullCanvas.getContext("2d");
  fullCtx.drawImage(image, 0, 0, fullWidth, fullHeight);
  marks.forEach((mark) => {
    drawSingleMark(fullCtx, fullWidth, fullHeight, mark, false);
  });
  return {
    dataUrl: fullCanvas.toDataURL("image/png"),
    width: fullWidth,
    height: fullHeight,
  };
}

function saveMarkedEvidence() {
  if (activeMarkIndex === null || !activeMarkImage) return;

  const item = reportEvidence[activeMarkIndex];
  const normalizedMarks = currentMarks.map((mark, idx) =>
    createNormalizedMark({ ...mark, number: idx + 1 })
  );
  item.marks = normalizedMarks;
  item.suggestedMarks = currentSuggestions.map((sug) => ({ ...sug }));
  item.width = activeMarkImage.naturalWidth || activeMarkImage.width;
  item.height = activeMarkImage.naturalHeight || activeMarkImage.height;

  if (normalizedMarks.length > 0) {
    const rendered = renderFullResolutionMarkedDataUrl(activeMarkImage, normalizedMarks);
    item.url = rendered.dataUrl;
    item.assetPath = "";
    const listItems = normalizedMarks.map((m) => {
      let desc = `[${m.number}] ${m.flawType} (${m.severity})`;
      if (m.details) desc += `: ${m.details}`;
      return desc;
    });
    const original = item.originalAnnotation || item.annotation;
    item.annotation = `${original}\nDocumented observations:\n${listItems.join("\n")}`;
  } else {
    item.url = item.originalUrl || item.url;
    item.assetPath = item.originalAssetPath || "";
    item.annotation = item.originalAnnotation;
  }

  closeMarkModal();
  renderReportEvidence();
  persistEvidenceItemToDisk(item);
}

function closeMarkModal() {
  markModal.hidden = true;
  activeMarkIndex = null;
  activeMarkBase = null;
}

function reportStatus(message) {
  metricEls.gradeHint.textContent = message;
}

function imageSourceToDataUrl(source) {
  if (!source) return "";
  if (source.toDataURL) return source.toDataURL("image/png");
  const output = document.createElement("canvas");
  output.width = source.naturalWidth || source.width;
  output.height = source.naturalHeight || source.height;
  output.getContext("2d").drawImage(source, 0, 0, output.width, output.height);
  return output.toDataURL("image/png");
}

function loadImageDataUrl(url) {
  return new Promise((resolve, reject) => {
    if (!url) {
      resolve(null);
      return;
    }
    const image = new Image();
    if (String(url).startsWith("tracelock-media://")) image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Saved inspection image could not be loaded."));
    image.src = url;
  });
}

function inspectionFileName() {
  const base = cardIdInput.value.trim() || cardNameInput.value.trim() || inspectionIdInput.value.trim() || "tracelock-inspection";
  return `${base.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "") || "tracelock-inspection"}.json`;
}

function currentInspectionState() {
  const liveFrame = mode === "microscope" ? captureOriginalSourceDataUrl() : "";
  const originalUrl = imageSourceToDataUrl(originalImage) || liveFrame;
  const sourceUrl = imageSourceToDataUrl(sourceImage) || (mode === "microscope" && canvas.width ? canvas.toDataURL("image/png") : originalUrl);
  const activeStep = document.querySelector(".inspection-step.is-active")?.dataset.inspectionStep || "centering";
  const activePanel = document.querySelector(".panel-view.is-active")?.dataset.panelView || "inspect";

  return {
    type: "tracelock-inspection",
    version: 1,
    savedAt: new Date().toISOString(),
    identity: {
      ...inspectionMetadata(),
      imageName,
    },
    images: { original: originalUrl, source: sourceUrl },
    geometry: {
      guides,
      guidePoints,
      corners,
      perspectiveApplied,
      flattenedCardRect,
      calibrationLine,
      millimetersPerPixel,
      calibrationDistance: calibrationDistanceInput.value,
    },
    evidence: reportEvidence,
    centeringReports,
    reportNote: reportNoteText.value,
    instrument: {
      magnification: magnificationInput.value,
      illumination: illuminationSelect.value,
      region: regionSelect.value,
      filter: filterSelect.value,
      filterStrength: filterStrengthControl.value,
      threshold: thresholdControl.value,
      zoom: scale,
      comparisonEnabled: compareToggle.checked,
      comparisonDivider: comparisonDivider.value,
    },
    output: {
      images: promoImages.map(({ name, url }) => ({ name, url })),
      brand: promoBrandInput.value,
      title: promoTitleInput.value,
      subtitle: promoSubtitleInput.value,
      cta: promoCtaInput.value,
      style: promoStyleSelect.value,
      format: promoFormatSelect.value,
      duration: promoDurationSelect.value,
    },
    ui: { activeStep, activePanel, mode, centeringImageSide },
  };
}

async function saveInspection() {
  const api = window.traceLockDesktop?.session;
  if (api) {
    try {
      const sessionId = activeSessionId();
      feedStatusText.textContent = "Saving session…";
      const state = currentInspectionState();

      let originalAssetPath = "";
      if (isDataImageUrl(state.images.original)) {
        const saved = await api.saveAsset({ sessionId, assetKey: "card-original", dataUrl: state.images.original });
        originalAssetPath = saved.assetPath;
      }
      let sourceAssetPath = "";
      if (isDataImageUrl(state.images.source)) {
        if (state.images.source === state.images.original && originalAssetPath) {
          sourceAssetPath = originalAssetPath;
        } else {
          const saved = await api.saveAsset({ sessionId, assetKey: "card-source", dataUrl: state.images.source });
          sourceAssetPath = saved.assetPath;
        }
      }

      const diskEvidence = [];
      for (let i = 0; i < reportEvidence.length; i++) {
        const item = reportEvidence[i];
        await persistEvidenceItemToDisk(item);
        diskEvidence.push({
          ...item,
          url: item.assetPath ? "" : item.url,
          originalUrl: item.originalAssetPath ? "" : item.originalUrl,
        });
      }

      const diskOutputImages = [];
      for (let i = 0; i < promoImages.length; i++) {
        const entry = promoImages[i];
        if (!entry.assetPath && isDataImageUrl(entry.url)) {
          const saved = await api.saveAsset({ sessionId, assetKey: `output-${String(i + 1).padStart(3, "0")}`, dataUrl: entry.url });
          entry.assetPath = saved.assetPath;
          entry.url = saved.mediaUrl;
        }
        diskOutputImages.push({
          name: entry.name,
          assetPath: entry.assetPath || "",
          url: entry.assetPath ? "" : entry.url,
        });
      }

      const manifest = {
        ...state,
        version: 2,
        images: {
          originalAssetPath,
          sourceAssetPath,
        },
        evidence: diskEvidence,
        output: {
          ...state.output,
          images: diskOutputImages,
        },
      };

      const saved = await api.saveManifest({ sessionId, manifest });
      feedStatusText.textContent = "Session saved to disk";
      microscopeStatus.textContent = `Saved session ${saved.sessionId} (${diskEvidence.length} evidence, ${saved.labelCount} YOLO labels).`;
      return saved;
    } catch (error) {
      feedStatusText.textContent = "Save failed";
      microscopeStatus.textContent = `Disk save failed: ${error.message || error}`;
      return null;
    }
  }

  const state = currentInspectionState();
  const blob = new Blob([JSON.stringify(state)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = inspectionFileName();
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  feedStatusText.textContent = "Inspection saved";
  microscopeStatus.textContent = `Checkpoint saved as ${link.download}. Resume it later from the header.`;
  return null;
}

async function openSessionsModal() {
  sessionsModal.hidden = false;
  await refreshSessionsList();
}

async function refreshSessionsList() {
  const api = window.traceLockDesktop?.session;
  if (!api) return;
  sessionsList.innerHTML = "";
  sessionsModalStatus.textContent = "Loading saved sessions…";
  try {
    const sessions = await api.listSessions();
    if (!sessions.length) {
      sessionsModalStatus.textContent = "No disk-backed sessions yet. Click Save inspection to create one.";
      return;
    }
    sessionsModalStatus.textContent = `${sessions.length} saved session${sessions.length === 1 ? "" : "s"} on disk.`;
    sessions.forEach((entry) => {
      const row = document.createElement("div");
      row.className = "session-row";
      const copy = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = `${entry.cardName}${entry.cardId ? ` · ${entry.cardId}` : ""}`;
      const meta = document.createElement("small");
      const timestamp = entry.savedAt ? new Date(entry.savedAt).toLocaleString() : "Unknown time";
      meta.textContent = `${entry.sessionId} · ${entry.evidenceCount} evidence · Step: ${entry.activeStep} · ${timestamp}`;
      copy.append(title, meta);

      const actions = document.createElement("div");
      actions.className = "session-row-actions";
      const openBtn = document.createElement("button");
      openBtn.type = "button";
      openBtn.textContent = "Open";
      openBtn.addEventListener("click", async () => {
        await resumeDiskSession(entry.sessionId);
        sessionsModal.hidden = true;
      });
      const folderBtn = document.createElement("button");
      folderBtn.type = "button";
      folderBtn.className = "secondary";
      folderBtn.textContent = "Folder";
      folderBtn.addEventListener("click", () => {
        api.openSessionFolder(entry.sessionId);
      });
      actions.append(openBtn, folderBtn);
      row.append(copy, actions);
      sessionsList.append(row);
    });
  } catch (error) {
    sessionsModalStatus.textContent = `Could not list sessions: ${error.message || error}`;
  }
}

async function resumeDiskSession(sessionId) {
  const api = window.traceLockDesktop?.session;
  if (!api) return;
  try {
    const state = await api.loadSession(sessionId);
    await applyInspectionState(state, sessionId);
  } catch (error) {
    feedStatusText.textContent = "Resume failed";
    microscopeStatus.textContent = error.message || "The disk session could not be opened.";
  }
}

async function resumeInspection(file) {
  try {
    const state = JSON.parse(await file.text());
    await applyInspectionState(state, file.name);
  } catch (error) {
    feedStatusText.textContent = "Resume failed";
    microscopeStatus.textContent = error.message || "The saved inspection could not be opened.";
  }
}

async function applyInspectionState(state, fallbackName = "Saved inspection") {
  try {
    if (!state || state.type !== "tracelock-inspection" || ![1, 2].includes(state.version)) {
      throw new Error("This is not a supported TraceLock inspection file.");
    }

    const [savedOriginal, savedSource] = await Promise.all([
      loadImageDataUrl(state.images?.original),
      loadImageDataUrl(state.images?.source || state.images?.original),
    ]);
    stopMicroscope(false);
    originalImage = savedOriginal;
    sourceImage = savedSource || savedOriginal;
    imageName = state.identity?.imageName || fallbackName;
    centeringImageSide = state.ui?.centeringImageSide || null;
    if (centeringImageSide === "front" || centeringImageSide === "back") {
      guideSideSelect.value = centeringImageSide;
      reportSideSelect.value = centeringImageSide;
    }
    const identity = state.identity || {};
    cardIdInput.value = identity.cardId || "";
    playerInput.value = identity.player || "";
    manufacturerInput.value = identity.manufacturer || "";
    setInput.value = identity.set || "";
    yearInput.value = identity.year || "";
    cardNumberInput.value = identity.cardNumber || "";
    serialNumberInput.value = identity.serialNumber || "";
    cardNameInput.value = identity.cardName || "";
    inspectionIdInput.value = identity.inspectionId || createInspectionId();
    traceLockReportIdInput.value = identity.traceLockReportId || createTraceLockReportId();
    syncInspectionIdentity();

    const geometry = state.geometry || {};
    perspectiveApplied = Boolean(geometry.perspectiveApplied);
    flattenedCardRect = geometry.flattenedCardRect || null;
    corners = Array.isArray(geometry.corners) ? geometry.corners : [];
    guides = geometry.guides || guides;
    guidePoints = geometry.guidePoints || {
      outer: rectToGuidePoints(guides.outer),
      inner: rectToGuidePoints(guides.inner),
    };
    calibrationLine = geometry.calibrationLine || null;
    millimetersPerPixel = Number(geometry.millimetersPerPixel) > 0 ? Number(geometry.millimetersPerPixel) : null;
    calibrationDistanceInput.value = geometry.calibrationDistance || "1";
    calibrationDrawing = false;
    calibrateButton.disabled = !(calibrationLine && millimetersPerPixel);
    calibrationBadge.textContent = millimetersPerPixel ? "Calibrated" : "Optional";
    calibrationBadge.classList.toggle("active", Boolean(millimetersPerPixel));
    scaleReadout.textContent = millimetersPerPixel ? `${millimetersPerPixel.toFixed(millimetersPerPixel < 0.01 ? 4 : 3)} mm/px` : "Not calibrated";
    calibrationStatus.textContent = millimetersPerPixel ? "Saved calibration restored." : "V-centering ratios work without calibration. Use this only when you need a physical scale.";
    startCalibrationButton.textContent = millimetersPerPixel ? "Redraw reference line" : "Draw reference line";

    const instrument = state.instrument || {};
    magnificationInput.value = instrument.magnification || "40";
    illuminationSelect.value = instrument.illumination || "normal";
    regionSelect.value = instrument.region || "Full card";
    filterSelect.value = instrument.filter || "normal";
    filterStrengthControl.value = instrument.filterStrength || "3";
    thresholdControl.value = instrument.threshold || "42";
    scale = Number(instrument.zoom) > 0 ? Number(instrument.zoom) : 1;
    zoomControl.value = String(scale);
    compareToggle.checked = Boolean(instrument.comparisonEnabled);
    comparisonDivider.value = instrument.comparisonDivider || "50";

    centeringReports = state.centeringReports || {};
    reportEvidence = Array.isArray(state.evidence) ? state.evidence : [];
    reportNoteText.value = state.reportNote || "";
    renderReportEvidence();
    const output = state.output || {};
    promoBrandInput.value = output.brand || promoBrandInput.value;
    promoTitleInput.value = output.title || promoTitleInput.value;
    promoSubtitleInput.value = output.subtitle || promoSubtitleInput.value;
    promoCtaInput.value = output.cta || promoCtaInput.value;
    promoStyleSelect.value = output.style || promoStyleSelect.value;
    promoFormatSelect.value = output.format || promoFormatSelect.value;
    promoDurationSelect.value = output.duration || promoDurationSelect.value;
    promoImages = [];
    for (const item of (output.images || [])) {
      const image = await loadImageDataUrl(item.url);
      if (image) promoImages.push({ image, name: item.name || "Saved output image", url: item.url });
    }
    renderPromoThumbs();

    mode = "measure";
    if (sourceImage) {
      emptyState.style.display = "none";
      resizeCanvas();
      canvas.style.width = `${Math.round(canvas.width * scale)}px`;
      canvas.style.height = `${Math.round(canvas.height * scale)}px`;
      updateZoomValue();
      draw();
    } else {
      emptyState.style.display = "";
    }
    updateInstrumentReadouts();
    updateComparisonView();
    setModeHint();
    const step = document.querySelector(`[data-inspection-step="${state.ui?.activeStep || "centering"}"]`);
    if (step) selectInspectionStep(step);
    else activatePanel(state.ui?.activePanel || "inspect");
    feedStatusText.textContent = "Inspection resumed";
    microscopeStatus.textContent = "Saved inspection resumed. Reconnect the microscope if you need live camera view.";
  } catch (error) {
    feedStatusText.textContent = "Resume failed";
    microscopeStatus.textContent = error.message || "The saved inspection could not be opened.";
  }
}

async function exportHtmlReport() {
  if (!metricEls.report.value.trim() && !reportEvidence.length) {
    reportStatus("Add measurements or evidence before exporting.");
    return;
  }

  exportReportButton.disabled = true;
  reportDownloadLink.classList.remove("is-ready");
  reportStatus("Optimizing report images...");

  const targetBytes = 23.5 * 1024 * 1024;
  const profiles = [
    { maxDimension: 1600, quality: 0.78 },
    { maxDimension: 1200, quality: 0.68 },
    { maxDimension: 900, quality: 0.58 },
    { maxDimension: 700, quality: 0.48 },
    { maxDimension: 500, quality: 0.4 },
    { maxDimension: 360, quality: 0.32 },
  ];
  let html = "";
  let blob = null;

  try {
    for (const profile of profiles) {
      const optimizedEvidence = await compressEvidenceForReport(profile);
      html = buildHtmlReport(optimizedEvidence);
      blob = new Blob([html], { type: "text/html" });
      if (blob.size <= targetBytes) break;
    }
  } catch (error) {
    exportReportButton.disabled = false;
    reportStatus("Report image compression failed. Try removing an unnecessary snapshot and export again.");
    return;
  }

  if (!blob || blob.size > targetBytes) {
    exportReportButton.disabled = false;
    reportStatus(`Report is still ${formatFileSize(blob?.size || 0)}. Remove some snapshots and try again.`);
    return;
  }

  if (reportObjectUrl) URL.revokeObjectURL(reportObjectUrl);
  reportObjectUrl = URL.createObjectURL(blob);
  reportDownloadLink.href = reportObjectUrl;
  reportDownloadLink.classList.add("is-ready");
  exportReportButton.disabled = false;
  reportStatus(`HTML report ready to download (${formatFileSize(blob.size)}).`);
}

async function compressEvidenceForReport(profile) {
  const optimized = [];
  for (const item of reportEvidence) {
    optimized.push({
      ...item,
      url: await compressReportImage(item.url, profile.maxDimension, profile.quality),
    });
  }
  return optimized;
}

function compressReportImage(url, maxDimension, quality) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    if (String(url).startsWith("tracelock-media://")) image.crossOrigin = "anonymous";
    image.onload = () => {
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      const output = document.createElement("canvas");
      output.width = width;
      output.height = height;
      const outputCtx = output.getContext("2d");
      outputCtx.fillStyle = "#ffffff";
      outputCtx.fillRect(0, 0, width, height);
      outputCtx.imageSmoothingEnabled = true;
      outputCtx.imageSmoothingQuality = "high";
      outputCtx.drawImage(image, 0, 0, width, height);
      resolve(output.toDataURL("image/jpeg", quality));
    };
    image.onerror = reject;
    image.src = url;
  });
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function buildHtmlReport(evidence = reportEvidence) {
  const metadata = inspectionMetadata();
  const metadataLabels = {
    cardId: "Card ID",
    player: "Player",
    manufacturer: "Manufacturer",
    set: "Set",
    year: "Year",
    cardNumber: "Card number",
    serialNumber: "Serial number",
    cardName: "Card identity",
    inspectionId: "Inspection ID",
    traceLockReportId: "TraceLock report ID",
  };
  const metadataHtml = Object.entries(metadataLabels).map(([key, label]) => `
    <div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(metadata[key] || "Not provided")}</dd></div>
  `).join("");
  const centeringHtml = Object.entries(centeringReports).map(([side, text]) => `
    <h3>${escapeHtml(capitalize(side))} Centering</h3>
    <pre>${escapeHtml(text)}</pre>
  `).join("");
  const evidenceHtml = groupedEvidence(evidence).map(({ step, items }) => `
    <section class="evidence-group">
      <h3>${escapeHtml(evidenceStepLabel(step))} (${items.length})</h3>
      ${items.map(({ item }) => `
        <section class="evidence">
          <h4>${escapeHtml(item.title)}</h4>
          <p>${escapeHtml(item.annotation)}</p>
          <img src="${item.url}" alt="${escapeHtml(item.title)}">
          <small>${escapeHtml(item.createdAt)}</small>
        </section>
      `).join("")}
    </section>
  `).join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Card Inspection Report</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; color: #172132; font-family: Inter, Arial, sans-serif; background: #edf1f4; }
    main { max-width: 980px; margin: 32px auto; overflow: hidden; background: #fff; border: 1px solid #dbe1e8; border-radius: 14px; box-shadow: 0 24px 70px rgba(20,32,48,.12); }
    .report-header { padding: 34px 38px; color: #f5fbff; background: linear-gradient(135deg, #081321, #11283a); }
    .brand { color: #51dfcd; font-size: 11px; font-weight: 900; letter-spacing: .18em; }
    .kicker { margin-top: 28px; color: #91a1b5; font-size: 10px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
    h1 { margin: 7px 0 0; font-size: 34px; letter-spacing: -.035em; }
    .report-date { margin-top: 9px; color: #a9b7c8; font-size: 12px; }
    .report-body { padding: 32px 38px 40px; }
    h2 { margin: 30px 0 10px; color: #0b8f81; font-size: 11px; letter-spacing: .13em; text-transform: uppercase; }
    h3 { margin: 24px 0 8px; font-size: 17px; }
    h4 { margin: 0; color: #0b8f81; font-size: 13px; letter-spacing: .04em; }
    pre { white-space: pre-wrap; padding: 18px; border: 1px solid #dbe1e8; border-radius: 9px; background: #f5f7f9; color: #27354a; font: 13px/1.6 ui-monospace, monospace; }
    img { display: block; max-width: 100%; max-height: 760px; margin: 14px auto 0; object-fit: contain; border: 1px solid #dbe1e8; border-radius: 9px; background: #eef1f5; }
    .note { white-space: pre-wrap; padding: 17px; border-left: 4px solid #20bca8; border-radius: 0 8px 8px 0; background: #edf9f7; line-height: 1.55; }
    .metadata { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; margin: 0; border: 1px solid #dbe1e8; border-radius: 9px; overflow: hidden; background: #dbe1e8; }
    .metadata div { padding: 13px 15px; background: #f8fafb; }
    .metadata dt { color: #78869a; font-size: 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    .metadata dd { margin: 5px 0 0; color: #27354a; font-size: 13px; }
    .evidence { page-break-inside: avoid; padding: 20px 0 28px; border-bottom: 1px solid #e5e9ee; }
    .evidence p { white-space: pre-wrap; margin: 8px 0; color: #526074; font-size: 13px; line-height: 1.55; }
    small { display: block; margin-top: 8px; color: #78869a; font-size: 11px; }
    @media (max-width: 700px) { body { background: #fff; } main { margin: 0; border: 0; border-radius: 0; } .report-header, .report-body { padding: 26px 22px; } }
    @media print { body { background: #fff; } main { margin: 0; border: 0; box-shadow: none; } }
  </style>
</head>
<body>
  <main>
    <header class="report-header">
      <div class="brand">TRACELOCK</div>
      <div class="kicker">Proprietary inspection record</div>
      <h1>Card Inspection Report</h1>
      <div class="report-date">${escapeHtml(metadata.traceLockReportId || metadata.inspectionId || "Unassigned")} · Generated ${escapeHtml(new Date().toLocaleString())}</div>
    </header>
    <div class="report-body">
      <h2>Card metadata</h2>
      <dl class="metadata">${metadataHtml}</dl>
      <h2>Measurement summary</h2>
      <pre>${escapeHtml(metricEls.report.value || "No measurements recorded.")}</pre>
      ${centeringHtml || ""}
      <h2>Inspector notes</h2>
      <div class="note">${escapeHtml(reportNoteText.value || "No additional notes.")}</div>
      <h2>Visual evidence</h2>
      ${evidenceHtml || "<p>No image evidence added.</p>"}
    </div>
  </main>
</body>
</html>`;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function addPromoFiles(files) {
  files
    .filter((file) => file.type.startsWith("image/"))
    .forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          promoImages.push({ image, name: file.name, url: reader.result });
          renderPromoThumbs();
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
}

function addPromoCanvas(sourceCanvas, name) {
  if ((!sourceImage && mode !== "microscope") || !sourceCanvas.width || !sourceCanvas.height) {
    promoStatus.textContent = "Open a card image or camera view before adding the current canvas.";
    return;
  }
  const copy = document.createElement("canvas");
  copy.width = sourceCanvas.width;
  copy.height = sourceCanvas.height;
  copy.getContext("2d").drawImage(sourceCanvas, 0, 0);
  const url = copy.toDataURL("image/png");
  queueOutputImage(url, name);
}

function queueOutputImage(url, name) {
  const image = new Image();
  if (String(url).startsWith("tracelock-media://")) image.crossOrigin = "anonymous";
  image.onload = () => {
    promoImages.push({ image, name, url });
    renderPromoThumbs();
    promoStatus.textContent = `${name} added to Output automatically.`;
  };
  image.src = url;
}

function renderPromoThumbs() {
  promoThumbs.innerHTML = "";
  promoImages.forEach((item, index) => {
    const thumb = document.createElement("div");
    thumb.className = "promo-thumb";
    const image = document.createElement("img");
    image.src = item.url;
    image.alt = item.name;
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${item.name}`);
    removeButton.addEventListener("click", () => {
      promoImages.splice(index, 1);
      renderPromoThumbs();
    });
    thumb.append(image, removeButton);
    promoThumbs.append(thumb);
  });
  promoStatus.textContent = `${promoImages.length} promo image${promoImages.length === 1 ? "" : "s"} ready.`;
  refreshPromoPreview();
}

async function generatePromoVideo() {
  if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) {
    promoStatus.textContent = "Video export is not supported in this browser.";
    return;
  }
  if (!promoImages.length) {
    promoStatus.textContent = "Add at least one image before generating.";
    return;
  }

  const selectedImages = [...promoImages];
  const { width, height } = promoFormatSize(promoFormatSelect.value);
  const secondsPerImage = Number(promoDurationSelect.value);
  const fps = 24;
  const renderCanvas = document.createElement("canvas");
  renderCanvas.width = width;
  renderCanvas.height = height;
  const renderCtx = renderCanvas.getContext("2d");
  const preparedImages = selectedImages.map((item) => ({
    ...item,
    backdrop: createPromoBackdrop(item.image, width, height),
  }));
  const stream = renderCanvas.captureStream(fps);
  const mimeTypes = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
  const mimeType = mimeTypes.find((type) => MediaRecorder.isTypeSupported(type));
  if (!mimeType) {
    promoStatus.textContent = "This browser cannot encode a WebM marketing video.";
    stream.getTracks().forEach((track) => track.stop());
    return;
  }

  let recorder;
  try {
    recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6500000 });
  } catch (error) {
    promoStatus.textContent = "The video encoder could not start. Try a different browser.";
    stream.getTracks().forEach((track) => track.stop());
    return;
  }
  const chunks = [];

  recorder.addEventListener("dataavailable", (event) => {
    if (event.data.size) chunks.push(event.data);
  });

  const finished = new Promise((resolve) => {
    recorder.addEventListener("stop", () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      if (promoObjectUrl) URL.revokeObjectURL(promoObjectUrl);
      promoObjectUrl = URL.createObjectURL(blob);
      promoDownloadLink.href = promoObjectUrl;
      promoDownloadLink.classList.add("is-ready");
      promoStatus.textContent = `Marketing video ready (${formatFileSize(blob.size)}).`;
      generatePromoButton.disabled = false;
      stream.getTracks().forEach((track) => track.stop());
      resolve();
    });
  });

  generatePromoButton.disabled = true;
  promoDownloadLink.classList.remove("is-ready");
  promoStatus.textContent = "Rendering promo video...";
  try {
    recorder.start();

    const introFrames = Math.round(0.9 * fps);
    for (let frame = 0; frame < introFrames; frame++) {
      drawPromoIntro(renderCtx, frame / Math.max(1, introFrames - 1), width, height);
      promoStatus.textContent = "Rendering branded opening...";
      await waitFrame(1000 / fps);
    }

    for (let index = 0; index < preparedImages.length; index++) {
      const totalFrames = Math.round(secondsPerImage * fps);
      for (let frame = 0; frame < totalFrames; frame++) {
        const progress = frame / Math.max(1, totalFrames - 1);
        drawPromoFrame(renderCtx, preparedImages[index].image, index, progress, width, height, preparedImages[index].backdrop);
        promoStatus.textContent = `Rendering scene ${index + 1} of ${preparedImages.length}...`;
        await waitFrame(1000 / fps);
      }
    }

    const outroFrames = Math.round(1.1 * fps);
    for (let frame = 0; frame < outroFrames; frame++) {
      drawPromoOutro(renderCtx, frame / Math.max(1, outroFrames - 1), width, height);
      promoStatus.textContent = "Rendering final call to action...";
      await waitFrame(1000 / fps);
    }

    recorder.stop();
    await finished;
  } catch (error) {
    if (recorder.state === "recording") recorder.stop();
    generatePromoButton.disabled = false;
    promoStatus.textContent = "Video rendering stopped unexpectedly. Try fewer or smaller images.";
  }
}

function promoFormatSize(format) {
  if (format === "square") return { width: 1080, height: 1080 };
  if (format === "wide") return { width: 1280, height: 720 };
  return { width: 1080, height: 1920 };
}

function promoTheme() {
  const themes = {
    midnight: { background: "#08080a", panel: "#17171b", ink: "#f8f8f9", muted: "#aaaab2", accent: "#ff344f", shadow: "rgba(0,0,0,.58)" },
    collector: { background: "#130f09", panel: "#241b0e", ink: "#fff8e7", muted: "#cbbd9e", accent: "#f5c451", shadow: "rgba(0,0,0,.56)" },
    clean: { background: "#edf1f5", panel: "#ffffff", ink: "#152033", muted: "#637086", accent: "#0d8f81", shadow: "rgba(20,32,51,.24)" },
  };
  return themes[promoStyleSelect.value] || themes.midnight;
}

function refreshPromoPreview() {
  if (!promoPreviewCanvas) return;
  const sizes = {
    vertical: { width: 540, height: 960 },
    square: { width: 640, height: 640 },
    wide: { width: 800, height: 450 },
  };
  const size = sizes[promoFormatSelect.value] || sizes.vertical;
  promoPreviewCanvas.width = size.width;
  promoPreviewCanvas.height = size.height;
  const previewCtx = promoPreviewCanvas.getContext("2d");
  if (promoImages.length) {
    drawPromoFrame(previewCtx, promoImages[0].image, 0, 0.35, size.width, size.height);
  } else {
    drawPromoIntro(previewCtx, 0.72, size.width, size.height);
  }
}

function fillPromoBackground(renderCtx, width, height, theme) {
  renderCtx.fillStyle = theme.background;
  renderCtx.fillRect(0, 0, width, height);
  const glow = renderCtx.createRadialGradient(width * 0.5, height * 0.34, 0, width * 0.5, height * 0.34, Math.max(width, height) * 0.72);
  glow.addColorStop(0, `${theme.accent}33`);
  glow.addColorStop(0.52, `${theme.accent}0d`);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  renderCtx.fillStyle = glow;
  renderCtx.fillRect(0, 0, width, height);
}

function drawPromoIntro(renderCtx, progress, width, height) {
  const theme = promoTheme();
  fillPromoBackground(renderCtx, width, height, theme);
  const margin = Math.round(width * 0.075);
  const brandSize = Math.max(14, Math.round(width * 0.028));
  const titleSize = Math.max(30, Math.round(width * 0.075));
  const reveal = Math.min(1, progress * 1.4);

  renderCtx.globalAlpha = reveal;
  renderCtx.fillStyle = theme.accent;
  renderCtx.fillRect(margin, height * 0.18, Math.max(32, width * 0.11 * reveal), 4);
  renderCtx.font = `900 ${brandSize}px system-ui, sans-serif`;
  renderCtx.letterSpacing = `${Math.max(1, width * 0.004)}px`;
  renderCtx.fillText((promoBrandInput.value || "TRACELOCK").toUpperCase(), margin, height * 0.18 - brandSize * 1.4);
  renderCtx.letterSpacing = "0px";
  renderCtx.fillStyle = theme.ink;
  renderCtx.font = `850 ${titleSize}px system-ui, sans-serif`;
  wrapPromoText(renderCtx, promoTitleInput.value || "Card Inspection", margin, height * 0.34, width - margin * 2, titleSize * 1.04, 3);
  renderCtx.fillStyle = theme.muted;
  renderCtx.font = `600 ${Math.max(17, Math.round(width * 0.033))}px system-ui, sans-serif`;
  wrapPromoText(renderCtx, promoSubtitleInput.value, margin, height * 0.62, width - margin * 2, width * 0.046, 3);
  renderCtx.globalAlpha = 1;
}

function createPromoBackdrop(image, width, height) {
  const backdrop = document.createElement("canvas");
  backdrop.width = width;
  backdrop.height = height;
  const backdropCtx = backdrop.getContext("2d");
  const imageRatio = image.width / image.height;
  const canvasRatio = width / height;
  let drawWidth;
  let drawHeight;
  if (imageRatio > canvasRatio) {
    drawHeight = height * 1.08;
    drawWidth = drawHeight * imageRatio;
  } else {
    drawWidth = width * 1.08;
    drawHeight = drawWidth / imageRatio;
  }
  backdropCtx.filter = "blur(24px) brightness(.42) saturate(.8)";
  backdropCtx.globalAlpha = 0.72;
  backdropCtx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
  return backdrop;
}

function drawPromoFrame(renderCtx, image, index, progress, width, height, preparedBackdrop = null) {
  const theme = promoTheme();
  fillPromoBackground(renderCtx, width, height, theme);
  const zoom = 1.01 + progress * 0.045;
  const imageRatio = image.width / image.height;
  const canvasRatio = width / height;
  let backWidth;
  let backHeight;
  if (imageRatio > canvasRatio) {
    backHeight = height * 1.08;
    backWidth = backHeight * imageRatio;
  } else {
    backWidth = width * 1.08;
    backHeight = backWidth / imageRatio;
  }
  if (preparedBackdrop) {
    renderCtx.drawImage(preparedBackdrop, 0, 0, width, height);
  } else {
    renderCtx.save();
    renderCtx.filter = "blur(24px) brightness(.42) saturate(.8)";
    renderCtx.globalAlpha = 0.72;
    renderCtx.drawImage(image, (width - backWidth) / 2, (height - backHeight) / 2, backWidth, backHeight);
    renderCtx.restore();
  }

  const margin = Math.round(width * 0.072);
  const copyHeight = Math.max(height * 0.26, width * 0.28);
  const availableWidth = width - margin * 2;
  const availableHeight = height - copyHeight - margin * 2.2;
  const fit = Math.min(availableWidth / image.width, availableHeight / image.height) * zoom;
  const drawWidth = image.width * fit;
  const drawHeight = image.height * fit;
  const drift = (progress - 0.5) * width * 0.022 * (index % 2 === 0 ? 1 : -1);
  const x = (width - drawWidth) / 2 + drift;
  const y = margin * 1.55 + (availableHeight - drawHeight) / 2 - progress * height * 0.008;
  renderCtx.save();
  renderCtx.fillStyle = theme.shadow;
  roundedRect(renderCtx, x + width * 0.012, y + width * 0.018, drawWidth, drawHeight, Math.max(8, width * 0.012));
  renderCtx.fill();
  roundedRect(renderCtx, x - 5, y - 5, drawWidth + 10, drawHeight + 10, Math.max(8, width * 0.012));
  renderCtx.fillStyle = theme.panel;
  renderCtx.fill();
  renderCtx.drawImage(image, x, y, drawWidth, drawHeight);
  renderCtx.restore();

  const gradient = renderCtx.createLinearGradient(0, height - copyHeight * 1.2, 0, height);
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(0.24, `${theme.background}dc`);
  gradient.addColorStop(1, theme.background);
  renderCtx.fillStyle = gradient;
  renderCtx.fillRect(0, 0, width, height);

  const titleSize = Math.max(25, Math.round(width * 0.055));
  const bodySize = Math.max(14, Math.round(width * 0.027));
  renderCtx.fillStyle = theme.accent;
  renderCtx.font = `850 ${Math.max(11, Math.round(width * .021))}px system-ui, sans-serif`;
  renderCtx.fillText(`${(promoBrandInput.value || "TRACELOCK").toUpperCase()}  /  CARD INSPECTION`, margin, margin);
  renderCtx.fillStyle = theme.ink;
  renderCtx.font = `850 ${titleSize}px system-ui, sans-serif`;
  renderCtx.textBaseline = "top";
  wrapPromoText(renderCtx, promoTitleInput.value, margin, height - copyHeight, width - margin * 2, titleSize * 1.04, 2);

  renderCtx.fillStyle = theme.muted;
  renderCtx.font = `600 ${bodySize}px system-ui, sans-serif`;
  wrapPromoText(renderCtx, promoSubtitleInput.value, margin, height - copyHeight + titleSize * 2.15, width - margin * 2, bodySize * 1.28, 2);

  const dotSize = Math.max(4, width * .006);
  const dotGap = dotSize * 2.5;
  const dotsWidth = Math.max(0, promoImages.length - 1) * dotGap + dotSize * 2;
  let dotX = width - margin - dotsWidth;
  for (let i = 0; i < promoImages.length; i++) {
    renderCtx.beginPath();
    renderCtx.arc(dotX + i * dotGap, height - margin, dotSize, 0, Math.PI * 2);
    renderCtx.fillStyle = i === index ? theme.accent : `${theme.muted}66`;
    renderCtx.fill();
  }
}

function drawPromoOutro(renderCtx, progress, width, height) {
  const theme = promoTheme();
  fillPromoBackground(renderCtx, width, height, theme);
  const margin = Math.round(width * .075);
  const titleSize = Math.max(30, Math.round(width * .072));
  renderCtx.globalAlpha = Math.min(1, progress * 1.5);
  renderCtx.fillStyle = theme.accent;
  renderCtx.font = `900 ${Math.max(14, Math.round(width * .028))}px system-ui, sans-serif`;
  renderCtx.fillText((promoBrandInput.value || "TRACELOCK").toUpperCase(), margin, height * .25);
  renderCtx.fillStyle = theme.ink;
  renderCtx.font = `850 ${titleSize}px system-ui, sans-serif`;
  wrapPromoText(renderCtx, promoCtaInput.value || "Book your card review", margin, height * .38, width - margin * 2, titleSize * 1.05, 3);
  renderCtx.fillStyle = theme.muted;
  renderCtx.font = `600 ${Math.max(15, Math.round(width * .029))}px system-ui, sans-serif`;
  renderCtx.fillText("Centering. Surface. Evidence.", margin, height * .68);
  renderCtx.globalAlpha = 1;
}

function wrapPromoText(renderCtx, text, x, y, maxWidth, lineHeight, maxLines = 4) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  let line = "";
  let cursorY = y;
  let lines = 0;
  for (const word of words) {
    const nextLine = line ? `${line} ${word}` : word;
    if (renderCtx.measureText(nextLine).width > maxWidth && line) {
      renderCtx.fillText(line, x, cursorY);
      lines++;
      if (lines >= maxLines) return;
      cursorY += lineHeight;
      line = word;
    } else {
      line = nextLine;
    }
  }
  if (line && lines < maxLines) renderCtx.fillText(line, x, cursorY);
}

function roundedRect(renderCtx, x, y, width, height, radius) {
  renderCtx.beginPath();
  renderCtx.moveTo(x + radius, y);
  renderCtx.lineTo(x + width - radius, y);
  renderCtx.quadraticCurveTo(x + width, y, x + width, y + radius);
  renderCtx.lineTo(x + width, y + height - radius);
  renderCtx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  renderCtx.lineTo(x + radius, y + height);
  renderCtx.quadraticCurveTo(x, y + height, x, y + height - radius);
  renderCtx.lineTo(x, y + radius);
  renderCtx.quadraticCurveTo(x, y, x + radius, y);
  renderCtx.closePath();
}

function waitFrame(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function captureCameraForCentering() {
  const width = microscopeVideo.videoWidth || canvas.width;
  const height = microscopeVideo.videoHeight || canvas.height;
  if (!width || !height) {
    microscopeStatus.textContent = "Camera frame is not ready yet.";
    return;
  }

  const captureCanvas = document.createElement("canvas");
  captureCanvas.width = width;
  captureCanvas.height = height;
  const captureCtx = captureCanvas.getContext("2d");
  captureCtx.drawImage(microscopeVideo, 0, 0, width, height);

  stopMicroscope(false);
  resetCalibration();
  originalImage = captureCanvas;
  sourceImage = captureCanvas;
  imageName = `Camera capture ${new Date().toLocaleString()}`;
  centeringImageSide = guideSideSelect.value;
  perspectiveApplied = false;
  flattenedCardRect = null;
  mode = "measure";
  scale = 1;
  zoomControl.value = "1";
  emptyState.style.display = "none";
  resizeCanvas();
  fitCanvasToStage();
  updateZoomValue();
  resetCorners();
  resetGuides();
  detectCardAndWindow();
  setModeHint();
  draw();
  queueOutputImage(imageSourceToDataUrl(captureCanvas), "Centering source capture");
  queueOutputImage(canvas.toDataURL("image/png"), "Centering overlay capture");
  selectInspectionStep(document.querySelector('[data-inspection-step="centering"]'));
  microscopeStatus.textContent = "Captured webcam frame for centering. Use Set Corners if the photo is angled.";
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

function fitCanvasToStage() {
  if (!canvas.width || !canvas.height) return;
  const availableWidth = Math.max(240, stageWrap.clientWidth - 56);
  const minimum = Number(zoomControl.min) || 0.25;
  scale = Math.max(minimum, Math.min(1, availableWidth / canvas.width));
  zoomControl.value = String(scale);
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
  for (const points of [guidePoints.outer, guidePoints.inner]) {
    points.forEach((point) => {
      point.x *= sx;
      point.y *= sy;
    });
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
  syncGuidePointsFromRects();
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
  fitCanvasToStage();
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
  syncGuidePointsFromRects();
}

function detectCardAndWindow() {
  drawBaseImage();
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const threshold = Number(thresholdControl.value);
  const outer = detectContentBounds(imageData, threshold, 0);
  if (outer) {
    guides.outer = clampRect(padRect(outer, 2), { x: 0, y: 0, w: canvas.width, h: canvas.height });
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
  syncGuidePointsFromRects();
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
  drawBaseImage(true);
  if (!sourceImage) return;
  if (mode === "corners") {
    drawCornerOverlay();
    drawLoupe();
    drawPhysicalScaleOverlay();
    return;
  }
  drawGuide("outer", getComputedStyle(document.documentElement).getPropertyValue("--outer"), "CARD EDGE", false);
  drawGuide("inner", getComputedStyle(document.documentElement).getPropertyValue("--inner"), "PRINTED AREA", true);
  drawBorderMeasurements();
  updateMetrics();
  drawLoupe();
  drawPhysicalScaleOverlay();
  drawCalibrationOverlay();
}

function drawCalibrationOverlay() {
  if (!calibrationLine || millimetersPerPixel) return;
  const { start, end } = calibrationLine;
  const pixels = pointDistance(start, end);
  ctx.save();
  ctx.strokeStyle = "#ffd400";
  ctx.fillStyle = "#ffd400";
  ctx.lineWidth = Math.max(2, canvas.width / 700);
  ctx.setLineDash([10, 6]);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.setLineDash([]);
  for (const point of [start, end]) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, Math.max(5, canvas.width / 180), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.font = `700 ${Math.max(12, canvas.width / 85)}px system-ui, sans-serif`;
  ctx.fillText(`${Math.round(pixels)} px`, (start.x + end.x) / 2 + 8, (start.y + end.y) / 2 - 8);
  ctx.restore();
}

function drawPhysicalScaleOverlay() {
  if (!millimetersPerPixel || !canvas.width || !canvas.height) return;
  const maximumPixels = Math.max(70, Math.min(180, canvas.width * 0.14));
  const maximumMillimeters = maximumPixels * millimetersPerPixel;
  const magnitude = 10 ** Math.floor(Math.log10(maximumMillimeters));
  const measuredMillimeters = [5, 2, 1].map((value) => value * magnitude).find((value) => value <= maximumMillimeters) || magnitude;
  const targetPixels = measuredMillimeters / millimetersPerPixel;
  const x = canvas.width - targetPixels - Math.max(28, canvas.width * 0.035);
  const y = canvas.height - Math.max(34, canvas.height * 0.055);
  const lineWidth = Math.max(2, canvas.width / 700);
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,.94)";
  ctx.fillStyle = "rgba(255,255,255,.96)";
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + targetPixels, y);
  ctx.moveTo(x, y - 7);
  ctx.lineTo(x, y + 7);
  ctx.moveTo(x + targetPixels, y - 7);
  ctx.lineTo(x + targetPixels, y + 7);
  ctx.stroke();
  ctx.font = `600 ${Math.max(12, canvas.width / 85)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(`${Number(measuredMillimeters.toPrecision(2))} mm`, x + targetPixels / 2, y - 12);
  ctx.restore();
}

function drawLoupe() {
  if (!loupeToggle || !loupeToggle.checked || !hoverPoint || !sourceImage || mode === "microscope") return;

  const mx = hoverPoint.x;
  const my = hoverPoint.y;
  const diameter = 130;
  const radius = diameter / 2;
  const zoom = 2.5;
  const sSize = diameter / zoom;

  ctx.save();
  ctx.beginPath();
  ctx.arc(mx, my, radius, 0, Math.PI * 2);
  ctx.clip();

  ctx.drawImage(
    canvas,
    mx - sSize / 2,
    my - sSize / 2,
    sSize,
    sSize,
    mx - radius,
    my - radius,
    diameter,
    diameter
  );
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = "#ffd400";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(mx, my, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#ffd400";
  ctx.beginPath();
  ctx.arc(mx, my, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBaseImage(applyFilter = false) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!sourceImage) return;
  if (applyFilter) {
    renderFilteredSurface(sourceImage, canvas.width, canvas.height, { allowComparison: true });
    positionComparisonLine();
  } else {
    ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
  }
}

function drawCornerOverlay() {
  ctx.save();
  const color = "#ff344f";
  ctx.strokeStyle = color;
  ctx.fillStyle = "rgba(255, 52, 79, 0.14)";
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
    const active = activeCorner === index || (lastInteractedItem && lastInteractedItem.type === "corner" && lastInteractedItem.index === index);
    drawCornerTarget(corner, color, labels[index], index, active);
  });
  ctx.restore();
}

function drawGuide(rectName, color, label, showCornerTargets) {
  const points = guidePoints[rectName];
  ctx.save();
  const guideColor = color.trim();
  ctx.strokeStyle = guideColor;
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 6]);
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);
  const names = ["nw", "ne", "se", "sw"];
  const labels = ["TL", "TR", "BR", "BL"];
  points.forEach((point, index) => {
    const active = lastInteractedItem && lastInteractedItem.type === "guide" && lastInteractedItem.name === rectName && lastInteractedItem.handle === names[index];
    drawCornerTarget(point, guideColor, labels[index], names[index], active, rectName);
  });
  ctx.font = "700 12px system-ui, sans-serif";
  ctx.fillStyle = guideColor;
  ctx.textAlign = "left";
  ctx.fillText(label, points[0].x + 8, points[0].y - 18);
  ctx.restore();
}

function drawCornerTarget(point, color, label, corner, active, guideName = null) {
  const offset = cornerLabelOffset(corner, point, guideName);
  const labelX = point.x + offset.x;
  const labelY = point.y + offset.y;

  ctx.save();
  ctx.strokeStyle = active ? "#ffd400" : color;
  ctx.fillStyle = active ? "#ffd400" : color;
  ctx.lineWidth = active ? 4 : 2;
  ctx.beginPath();
  ctx.moveTo(point.x - 12, point.y);
  ctx.lineTo(point.x - 3, point.y);
  ctx.moveTo(point.x + 3, point.y);
  ctx.lineTo(point.x + 12, point.y);
  ctx.moveTo(point.x, point.y - 12);
  ctx.lineTo(point.x, point.y - 3);
  ctx.moveTo(point.x, point.y + 3);
  ctx.lineTo(point.x, point.y + 12);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(labelX, labelY);
  ctx.stroke();

  ctx.fillRect(labelX - 13, labelY - 10, 26, 20);
  ctx.fillStyle = active ? "#111820" : "#ffffff";
  ctx.font = "700 12px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, labelX, labelY + 1);
  ctx.restore();
}

function drawLHandle(point, color, active = false) {
  const size = active ? 22 : 16;
  const directionX = point.name.includes("w") ? 1 : -1;
  const directionY = point.name.includes("n") ? 1 : -1;
  ctx.save();
  ctx.strokeStyle = active ? "#ffd400" : color;
  ctx.lineWidth = active ? 5 : 3;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y + directionY * size);
  ctx.lineTo(point.x, point.y);
  ctx.lineTo(point.x + directionX * size, point.y);
  ctx.stroke();
  if (active) {
    ctx.fillStyle = "#ffd400";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function cornerLabelOffset(corner, point = null, guideName = null) {
  if (guideName === "outer") {
    const inwardOffsets = {
      nw: { x: 54, y: 18 },
      ne: { x: -54, y: 18 },
      se: { x: -54, y: -18 },
      sw: { x: 54, y: -18 },
    };
    return inwardOffsets[corner] || { x: 54, y: 18 };
  }
  const offsets = {
    0: { x: -26, y: -26 },
    1: { x: 26, y: -26 },
    2: { x: 26, y: 26 },
    3: { x: -26, y: 26 },
    nw: { x: -26, y: -26 },
    ne: { x: 26, y: -26 },
    se: { x: 26, y: 26 },
    sw: { x: -26, y: 26 },
  };
  const preferred = offsets[corner] || { x: 26, y: 26 };
  if (!point) return preferred;
  const margin = 18;
  let x = preferred.x;
  let y = preferred.y;
  if (point.x + x < margin || point.x + x > canvas.width - margin) x *= -1;
  if (point.y + y < margin || point.y + y > canvas.height - margin) y *= -1;
  return { x, y };
}

function drawBorderMeasurements() {
  const m = getMeasurements();
  ctx.save();
  ctx.strokeStyle = "rgba(31, 39, 51, 0.72)";
  ctx.fillStyle = "rgba(31, 39, 51, 0.88)";
  ctx.lineWidth = 2;
  ctx.font = "700 13px system-ui, sans-serif";
  const outerMid = guideSideMidpoints(guidePoints.outer);
  const innerMid = guideSideMidpoints(guidePoints.inner);
  drawMeasureLine(outerMid.left.x, outerMid.left.y, innerMid.left.x, innerMid.left.y, `${m.left}px`);
  drawMeasureLine(innerMid.right.x, innerMid.right.y, outerMid.right.x, outerMid.right.y, `${m.right}px`);
  drawMeasureLine(outerMid.top.x, outerMid.top.y, innerMid.top.x, innerMid.top.y, `${m.top}px`);
  drawMeasureLine(innerMid.bottom.x, innerMid.bottom.y, outerMid.bottom.x, outerMid.bottom.y, `${m.bottom}px`);
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
  const outer = guidePoints.outer;
  const inner = guidePoints.inner;
  function borderWidth(first, last) {
    const start = outer[first];
    const dx = outer[last].x - start.x;
    const dy = outer[last].y - start.y;
    const edgeLength = Math.hypot(dx, dy);
    if (!edgeLength) return 0;

    const distanceToEdge = (point) =>
      Math.abs(dx * (point.y - start.y) - dy * (point.x - start.x)) / edgeLength;
    return Math.round((distanceToEdge(inner[first]) + distanceToEdge(inner[last])) / 2);
  }

  return {
    left: borderWidth(0, 3),
    right: borderWidth(1, 2),
    top: borderWidth(0, 1),
    bottom: borderWidth(3, 2),
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
  if (score >= 90) return "#ff344f";
  if (score >= 80) return "#8a7a15";
  return "#b45d1d";
}

function gradeText(horizontalScore, verticalScore) {
  const score = Math.min(horizontalScore, verticalScore);
  if (score >= 95) return "Excellent centering by border width.";
  if (score >= 90) return "Strong centering with minor visible variance.";
  if (score >= 80) return "Moderate centering variance. Document for manual inspection review.";
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
  const candidates = ["inner", "outer"];
  const names = ["nw", "ne", "se", "sw"];
  const canvasRect = canvas.getBoundingClientRect();
  const cssToCanvas = canvasRect.width ? canvas.width / canvasRect.width : 1;
  const tolerance = Math.max(26, 22 * cssToCanvas);
  let closestHandle = null;
  let closestDistance = Infinity;
  for (const name of candidates) {
    const points = guidePoints[name];
    for (let index = 0; index < points.length; index++) {
      const handleDistance = pointDistance(point, points[index]);
      if (handleDistance <= tolerance && handleDistance < closestDistance) {
        closestHandle = { name, handle: names[index] };
        closestDistance = handleDistance;
      }
      const offset = cornerLabelOffset(names[index], points[index], name);
      const labelPoint = { x: points[index].x + offset.x, y: points[index].y + offset.y };
      const labelDistance = pointDistance(point, labelPoint);
      if (labelDistance <= tolerance && labelDistance < closestDistance) {
        closestHandle = { name, handle: names[index] };
        closestDistance = labelDistance;
      }
    }
  }
  if (closestHandle) return closestHandle;
  for (const name of candidates) {
    if (nearGuideEdge(point, guidePoints[name], Math.max(10, 8 * cssToCanvas))) return { name, handle: "move" };
  }
  return null;
}

function cornerHitTest(point) {
  let closest = null;
  let closestDistance = Infinity;
  const canvasRect = canvas.getBoundingClientRect();
  const cssToCanvas = canvasRect.width ? canvas.width / canvasRect.width : 1;
  const handleRadius = Math.max(34, 24 * cssToCanvas);
  corners.forEach((corner, index) => {
    const distance = Math.hypot(point.x - corner.x, point.y - corner.y);
    if (distance < closestDistance) {
      closest = index;
      closestDistance = distance;
    }
    const offset = cornerLabelOffset(index, corner);
    const labelX = corner.x + offset.x;
    const labelY = corner.y + offset.y;
    if (Math.abs(point.x - labelX) <= 18 * cssToCanvas && Math.abs(point.y - labelY) <= 16 * cssToCanvas) {
      closest = index;
      closestDistance = 0;
    }
  });
  return closestDistance <= handleRadius ? closest : null;
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

function rectToGuidePoints(rect) {
  return [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.w, y: rect.y },
    { x: rect.x + rect.w, y: rect.y + rect.h },
    { x: rect.x, y: rect.y + rect.h },
  ];
}

function syncGuidePointsFromRects() {
  guidePoints.outer = rectToGuidePoints(guides.outer);
  guidePoints.inner = rectToGuidePoints(guides.inner);
}

function syncGuideRectFromPoints(name) {
  const xs = guidePoints[name].map((point) => point.x);
  const ys = guidePoints[name].map((point) => point.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  guides[name] = { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

function guideSideMidpoints(points) {
  const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  return {
    top: midpoint(points[0], points[1]),
    right: midpoint(points[1], points[2]),
    bottom: midpoint(points[3], points[2]),
    left: midpoint(points[0], points[3]),
  };
}

function pointDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function nearGuideEdge(point, points, tolerance) {
  for (let index = 0; index < points.length; index++) {
    const start = points[index];
    const end = points[(index + 1) % points.length];
    const lengthSquared = (end.x - start.x) ** 2 + (end.y - start.y) ** 2;
    if (!lengthSquared) continue;
    const t = Math.max(0, Math.min(1, ((point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)) / lengthSquared));
    const projected = { x: start.x + t * (end.x - start.x), y: start.y + t * (end.y - start.y) };
    if (pointDistance(point, projected) <= tolerance) return true;
  }
  return false;
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
  const points = guidePoints[active.name];
  if (active.handle === "move") {
    const minX = Math.min(...points.map((point) => point.x));
    const maxX = Math.max(...points.map((point) => point.x));
    const minY = Math.min(...points.map((point) => point.y));
    const maxY = Math.max(...points.map((point) => point.y));
    const safeDx = Math.min(Math.max(dx, -minX), canvas.width - maxX);
    const safeDy = Math.min(Math.max(dy, -minY), canvas.height - maxY);
    points.forEach((point) => { point.x += safeDx; point.y += safeDy; });
    syncGuideRectFromPoints(active.name);
    return;
  }
  const index = { nw: 0, ne: 1, se: 2, sw: 3 }[active.handle];
  if (index === undefined) return;
  points[index] = clampPoint({ x: points[index].x + dx, y: points[index].y + dy });
  syncGuideRectFromPoints(active.name);
}

function nudgeInnerEdge(edge, amount) {
  const points = guidePoints.inner;
  const indexes = { left: [0, 3], right: [1, 2], top: [0, 1], bottom: [3, 2] }[edge];
  const axis = edge === "left" || edge === "right" ? "x" : "y";
  indexes.forEach((index) => {
    points[index][axis] = Math.min(Math.max(0, points[index][axis] + amount), axis === "x" ? canvas.width : canvas.height);
  });
  syncGuideRectFromPoints("inner");
}

function warpPerspective() {
  const srcWidth = getSourceWidth();
  const srcHeight = getSourceHeight();
  const scaleX = srcWidth / Math.max(1, canvas.width);
  const scaleY = srcHeight / Math.max(1, canvas.height);
  const src = corners.map((corner) => ({
    x: corner.x * scaleX,
    y: corner.y * scaleY,
  }));

  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = srcWidth;
  sourceCanvas.height = srcHeight;
  const sourceCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  sourceCtx.drawImage(sourceImage, 0, 0, srcWidth, srcHeight);

  const topWidth = Math.hypot(src[1].x - src[0].x, src[1].y - src[0].y);
  const bottomWidth = Math.hypot(src[2].x - src[3].x, src[2].y - src[3].y);
  const leftHeight = Math.hypot(src[3].x - src[0].x, src[3].y - src[0].y);
  const rightHeight = Math.hypot(src[2].x - src[1].x, src[2].y - src[1].y);
  let outputWidth = Math.round((topWidth + bottomWidth) / 2);
  let outputHeight = Math.round((leftHeight + rightHeight) / 2);

  outputWidth = Math.min(Math.max(outputWidth, 240), 2200);
  outputHeight = standardRatioToggle.checked
    ? Math.round(outputWidth * 1.4)
    : Math.min(Math.max(outputHeight, 336), 3080);

  const dst = [
    { x: 0, y: 0 },
    { x: outputWidth - 1, y: 0 },
    { x: outputWidth - 1, y: outputHeight - 1 },
    { x: 0, y: outputHeight - 1 },
  ];
  const matrix = homography(dst, src);
  if (!matrix) return null;

  const sourceData = sourceCtx.getImageData(0, 0, srcWidth, srcHeight);
  const sData = sourceData.data;
  const maxSrcX = srcWidth - 1;
  const maxSrcY = srcHeight - 1;
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = outputWidth;
  outputCanvas.height = outputHeight;
  const outputCtx = outputCanvas.getContext("2d");
  const outputData = outputCtx.createImageData(outputWidth, outputHeight);
  const outData = outputData.data;
  const m0 = matrix[0];
  const m1 = matrix[1];
  const m2 = matrix[2];
  const m3 = matrix[3];
  const m4 = matrix[4];
  const m5 = matrix[5];
  const m6 = matrix[6];
  const m7 = matrix[7];

  for (let y = 0; y < outputHeight; y++) {
    const rowOffset = y * outputWidth;
    for (let x = 0; x < outputWidth; x++) {
      const denom = m6 * x + m7 * y + 1;
      let sx = (m0 * x + m1 * y + m2) / denom;
      let sy = (m3 * x + m4 * y + m5) / denom;
      if (sx < 0) sx = 0;
      else if (sx > maxSrcX) sx = maxSrcX;
      if (sy < 0) sy = 0;
      else if (sy > maxSrcY) sy = maxSrcY;

      const x0 = sx | 0;
      const y0 = sy | 0;
      const x1 = x0 < maxSrcX ? x0 + 1 : maxSrcX;
      const y1 = y0 < maxSrcY ? y0 + 1 : maxSrcY;
      const tx = sx - x0;
      const ty = sy - y0;
      const itx = 1 - tx;
      const ity = 1 - ty;
      const w00 = itx * ity;
      const w10 = tx * ity;
      const w01 = itx * ty;
      const w11 = tx * ty;

      const i00 = (y0 * srcWidth + x0) * 4;
      const i10 = (y0 * srcWidth + x1) * 4;
      const i01 = (y1 * srcWidth + x0) * 4;
      const i11 = (y1 * srcWidth + x1) * 4;
      const out = (rowOffset + x) * 4;

      outData[out] = Math.round(sData[i00] * w00 + sData[i10] * w10 + sData[i01] * w01 + sData[i11] * w11);
      outData[out + 1] = Math.round(sData[i00 + 1] * w00 + sData[i10 + 1] * w10 + sData[i01 + 1] * w01 + sData[i11 + 1] * w11);
      outData[out + 2] = Math.round(sData[i00 + 2] * w00 + sData[i10 + 2] * w10 + sData[i01 + 2] * w01 + sData[i11 + 2] * w11);
      outData[out + 3] = 255;
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
    updateCornerPlacementHint();
    cornerModeButton.textContent = "Finish Corner Placement";
    return;
  }
  cornerModeButton.textContent = "Set Corners";
  modeHint.textContent = perspectiveApplied
    ? "Perspective correction is applied. Now align the printed-area guide."
    : "For angled photos, set the four physical card corners first.";
}

function updateCornerPlacementHint(activeIndex = null) {
  const labels = ["TL", "TR", "BR", "BL"];
  const positions = corners
    .map((corner, index) => `${labels[index]} ${Math.round(corner.x)},${Math.round(corner.y)}`)
    .join(" · ");
  const action = activeIndex === null
    ? "Drag each corner independently, then flatten the card."
    : `Moving ${labels[activeIndex]} only.`;
  modeHint.textContent = `${action} ${positions}`;
}

function updateGuidePlacementHint(active = null) {
  if (!active) {
    modeHint.textContent = "Each red and grey corner moves independently. Drag an edge to move its entire overlay.";
    return;
  }
  const guideName = active.name === "outer" ? "red card edge" : "grey printed area";
  const cornerName = { nw: "TL", ne: "TR", se: "BR", sw: "BL" }[active.handle];
  modeHint.textContent = cornerName
    ? `Moving only the ${guideName} ${cornerName} corner.`
    : `Moving the entire ${guideName} overlay.`;
}

let cncStatusState = null;
let cncScanAbortRequested = false;
let cncScanRunning = false;

function syncCncFovFromCalibration() {
  if (!millimetersPerPixel || !canvas.width || !canvas.height) return;
  const fovXInput = document.querySelector("#cncFovXInput");
  const fovYInput = document.querySelector("#cncFovYInput");
  if (!fovXInput || !fovYInput) return;
  const fovX = Number((canvas.width * millimetersPerPixel).toFixed(1));
  const fovY = Number((canvas.height * millimetersPerPixel).toFixed(1));
  if (fovX >= 4 && fovX <= 80) fovXInput.value = String(fovX);
  if (fovY >= 4 && fovY <= 80) fovYInput.value = String(fovY);
}

function computeFrameSharpness() {
  const source = mode === "microscope" && microscopeRawFrame.width ? microscopeRawFrame : canvas;
  if (!source.width || !source.height) return 0;
  const sampleSize = 180;
  const probe = document.createElement("canvas");
  probe.width = sampleSize;
  probe.height = sampleSize;
  const probeCtx = probe.getContext("2d", { willReadFrequently: true });
  const cropW = Math.min(source.width, Math.round(source.width * 0.5));
  const cropH = Math.min(source.height, Math.round(source.height * 0.5));
  const sx = Math.floor((source.width - cropW) / 2);
  const sy = Math.floor((source.height - cropH) / 2);
  probeCtx.drawImage(source, sx, sy, cropW, cropH, 0, 0, sampleSize, sampleSize);

  const data = probeCtx.getImageData(0, 0, sampleSize, sampleSize).data;
  const gray = new Float32Array(sampleSize * sampleSize);
  for (let i = 0; i < gray.length; i++) {
    const p = i * 4;
    gray[i] = data[p] * 0.2126 + data[p + 1] * 0.7152 + data[p + 2] * 0.0722;
  }

  let sum = 0;
  let sumSq = 0;
  let count = 0;
  for (let y = 1; y < sampleSize - 1; y++) {
    const row = y * sampleSize;
    for (let x = 1; x < sampleSize - 1; x++) {
      const lap =
        gray[row - sampleSize + x] +
        gray[row + sampleSize + x] +
        gray[row + x - 1] +
        gray[row + x + 1] -
        4 * gray[row + x];
      sum += lap;
      sumSq += lap * lap;
      count++;
    }
  }
  const mean = sum / Math.max(1, count);
  return Math.max(0, sumSq / Math.max(1, count) - mean * mean);
}

async function waitForFreshMicroscopeFrames(frameCount = 3) {
  for (let i = 0; i < frameCount; i++) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  if (mode === "microscope" && !microscopeFrozen) {
    restartMicroscopeDraw();
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
}

function initCncControls() {
  const api = window.traceLockDesktop?.cnc;
  const section = document.querySelector("#cncControlSection");
  if (!api || !section) return;
  section.hidden = false;

  const badge = document.querySelector("#cncStateBadge");
  const portSelect = document.querySelector("#cncPortSelect");
  const connectBtn = document.querySelector("#cncConnectButton");
  const refreshBtn = document.querySelector("#cncRefreshPortsButton");
  const disconnectBtn = document.querySelector("#cncDisconnectButton");
  const estopBtn = document.querySelector("#cncEstopButton");
  const homeBtn = document.querySelector("#cncHomeButton");
  const zeroBtn = document.querySelector("#cncZeroButton");
  const unlockBtn = document.querySelector("#cncUnlockButton");
  const autofocusBtn = document.querySelector("#cncAutofocusButton");
  const jogStepSelect = document.querySelector("#cncJogStepSelect");
  const jogButtons = section.querySelectorAll("[data-cnc-jog]");
  const xReadout = document.querySelector("#cncXReadout");
  const yReadout = document.querySelector("#cncYReadout");
  const zReadout = document.querySelector("#cncZReadout");
  const sharpnessReadout = document.querySelector("#cncSharpnessReadout");
  const fovXInput = document.querySelector("#cncFovXInput");
  const fovYInput = document.querySelector("#cncFovYInput");
  const scanCorners = document.querySelector("#cncScanCorners");
  const scanEdges = document.querySelector("#cncScanEdges");
  const scanSurface = document.querySelector("#cncScanSurface");
  const scanUv = document.querySelector("#cncScanUv");
  const scanAutofocus = document.querySelector("#cncScanAutofocus");
  const startScanBtn = document.querySelector("#cncStartScanButton");
  const stopScanBtn = document.querySelector("#cncStopScanButton");
  const scanMeter = document.querySelector("#cncScanMeter");
  const statusText = document.querySelector("#cncStatusText");

  function renderCncStatus(status) {
    cncStatusState = status;
    const connected = Boolean(status?.connected);
    badge.textContent = connected ? (status.simulated ? `${status.state} (Sim)` : status.state) : "Offline";
    badge.classList.toggle("active", connected);
    xReadout.textContent = Number(status?.wpos?.x || 0).toFixed(2);
    yReadout.textContent = Number(status?.wpos?.y || 0).toFixed(2);
    zReadout.textContent = Number(status?.wpos?.z || 0).toFixed(2);
    connectBtn.disabled = connected;
    disconnectBtn.disabled = !connected;
    homeBtn.disabled = !connected || cncScanRunning;
    zeroBtn.disabled = !connected || cncScanRunning;
    unlockBtn.disabled = !connected || cncScanRunning;
    autofocusBtn.disabled = !connected || cncScanRunning;
    startScanBtn.disabled = !connected || cncScanRunning;
    stopScanBtn.disabled = !cncScanRunning;
    jogButtons.forEach((btn) => {
      btn.disabled = !connected || cncScanRunning;
    });
  }

  async function refreshPorts() {
    const result = await api.listPorts();
    const current = portSelect.value;
    portSelect.innerHTML = "";
    (result.ports || []).forEach((port) => {
      const option = document.createElement("option");
      option.value = port.path;
      option.textContent = port.friendlyName || port.path;
      portSelect.append(option);
    });
    if (Array.from(portSelect.options).some((opt) => opt.value === current)) {
      portSelect.value = current;
    }
    if (!result.serialportAvailable) {
      statusText.textContent = "Simulator ready. Install optional 'serialport' package for physical USB GRBL ports.";
    }
  }

  async function runZAutofocus(spanMm = 1.0, stepMm = 0.25) {
    if (!cncStatusState?.connected) return null;
    const baseZ = Number(cncStatusState.wpos?.z || 0);
    const minZ = cncStatusState.safety?.zMin ?? -50;
    const maxZ = cncStatusState.safety?.zMax ?? 0;
    let bestZ = baseZ;
    let bestScore = -1;

    for (let offset = -spanMm; offset <= spanMm + 1e-6; offset += stepMm) {
      if (cncScanAbortRequested) break;
      const targetZ = Math.min(maxZ, Math.max(minZ, Number((baseZ + offset).toFixed(2))));
      await api.moveTo({ z: targetZ, feedRate: 400, settleMs: 120 });
      await waitForFreshMicroscopeFrames(3);
      const score = computeFrameSharpness();
      sharpnessReadout.textContent = String(Math.round(score));
      if (score > bestScore) {
        bestScore = score;
        bestZ = targetZ;
      }
    }

    await api.moveTo({ z: bestZ, feedRate: 400, settleMs: 150 });
    await waitForFreshMicroscopeFrames(2);
    sharpnessReadout.textContent = String(Math.round(bestScore));
    statusText.textContent = `Autofocus locked at Z=${bestZ.toFixed(2)} mm (sharpness ${Math.round(bestScore)}).`;
    return { bestZ, bestScore };
  }

  async function runAutomatedCardScan() {
    if (!cncStatusState?.connected || cncScanRunning) return;
    cncScanRunning = true;
    cncScanAbortRequested = false;
    renderCncStatus(cncStatusState);
    scanMeter.style.width = "0%";

    try {
      const plan = await api.buildScanPlan({
        originX: 0,
        originY: 0,
        focusZ: Number(cncStatusState.wpos?.z || 0),
        fovXMm: Number(fovXInput.value) || 14,
        fovYMm: Number(fovYInput.value) || 10.5,
        includeCorners: scanCorners.checked,
        includeEdges: scanEdges.checked,
        includeSurface: scanSurface.checked,
        includeUv: scanUv.checked,
      });

      if (!plan.length) {
        statusText.textContent = "Select at least one scan pass (Corners, Edges, Surface, or UV).";
        return;
      }

      statusText.textContent = `Starting automated scan (${plan.length} waypoints)…`;
      for (let i = 0; i < plan.length; i++) {
        if (cncScanAbortRequested) {
          statusText.textContent = `Auto scan stopped at waypoint ${i}/${plan.length}.`;
          break;
        }
        const wp = plan[i];
        statusText.textContent = `Moving ${i + 1}/${plan.length}: ${wp.label || wp.region} (X${wp.x} Y${wp.y})…`;
        await api.moveTo({ x: wp.x, y: wp.y, z: wp.z, feedRate: 2400, settleMs: 150 });
        await api.setLightProfile(wp.illumination || "normal");

        if (regionSelect && Array.from(regionSelect.options).some((opt) => opt.value === wp.region)) {
          regionSelect.value = wp.region;
        }
        if (illuminationSelect && wp.illumination) {
          illuminationSelect.value = wp.illumination;
        }
        updateInstrumentReadouts();

        if (scanAutofocus.checked) {
          await runZAutofocus(0.6, 0.2);
        } else {
          await waitForFreshMicroscopeFrames(3);
        }

        const sharpness = Math.round(computeFrameSharpness());
        sharpnessReadout.textContent = String(sharpness);

        if (mode === "microscope" ? microscopeRawFrame.width : Boolean(sourceImage)) {
          const originalUrl = captureOriginalSourceDataUrl();
          const title = wp.label || wp.region;
          const metaText = `CNC (${wp.x.toFixed(2)}, ${wp.y.toFixed(2)}, ${wp.z.toFixed(2)} mm) · ${magnificationReadout.textContent}x · ${illuminationReadout.textContent} · Sharpness ${sharpness}`;
          const item = addReportEvidence(
            title,
            metaText,
            originalUrl,
            "",
            "cnc-tile",
            wp.step,
            {
              width: mode === "microscope" ? microscopeRawFrame.width : canvas.width,
              height: mode === "microscope" ? microscopeRawFrame.height : canvas.height,
              machine: {
                xMm: wp.x,
                yMm: wp.y,
                zMm: wp.z,
                sharpness,
                illumination: wp.illumination,
                mmPerPx: millimetersPerPixel || null,
              },
            }
          );
          await persistEvidenceItemToDisk(item);
          const autoVisionToggle = document.querySelector("#visionAutoScanToggle");
          if (window.traceLockDesktop?.vision && autoVisionToggle?.checked) {
            const idx = reportEvidence.indexOf(item);
            if (idx >= 0) {
              await runVisionOnEvidenceItem(idx, false);
            }
          }
        }

        scanMeter.style.width = `${Math.round(((i + 1) / plan.length) * 100)}%`;
      }

      await api.setLightProfile("normal");
      if (!cncScanAbortRequested) {
        await saveInspection();
        statusText.textContent = `Auto scan complete (${plan.length} waypoints saved to disk).`;
      }
    } catch (error) {
      statusText.textContent = `Auto scan failed: ${error.message || error}`;
    } finally {
      cncScanRunning = false;
      renderCncStatus(cncStatusState);
    }
  }

  api.onStatus((status) => renderCncStatus(status));
  api.onLog((line) => {
    if (line.startsWith("!!")) statusText.textContent = line;
  });

  refreshBtn.addEventListener("click", refreshPorts);
  connectBtn.addEventListener("click", async () => {
    try {
      statusText.textContent = `Connecting to ${portSelect.value}…`;
      const status = await api.connect({ path: portSelect.value, baudRate: 115200 });
      renderCncStatus(status);
      statusText.textContent = status.simulated
        ? "Connected to Virtual GRBL Simulator (safe dry-run mode)."
        : `Connected to GRBL on ${status.port}.`;
    } catch (error) {
      statusText.textContent = error.message || "GRBL connection failed.";
    }
  });
  disconnectBtn.addEventListener("click", async () => {
    cncScanAbortRequested = true;
    const status = await api.disconnect();
    renderCncStatus(status);
    statusText.textContent = "GRBL disconnected.";
  });
  estopBtn.addEventListener("click", async () => {
    cncScanAbortRequested = true;
    const status = await api.emergencyStop();
    renderCncStatus(status);
    statusText.textContent = "E-STOP sent. Verify gantry clearance and Unlock ($X) before resuming.";
  });
  homeBtn.addEventListener("click", async () => {
    try {
      statusText.textContent = "Homing gantry ($H)…";
      renderCncStatus(await api.home());
      statusText.textContent = "Homing complete.";
    } catch (error) {
      statusText.textContent = error.message || "Homing failed.";
    }
  });
  zeroBtn.addEventListener("click", async () => {
    try {
      renderCncStatus(await api.setWorkZero({ x: true, y: true, z: false }));
      statusText.textContent = "Card datum set: X0 Y0 saved to G54 work offset.";
    } catch (error) {
      statusText.textContent = error.message || "Set zero failed.";
    }
  });
  unlockBtn.addEventListener("click", async () => {
    try {
      renderCncStatus(await api.unlock());
      statusText.textContent = "GRBL alarm unlocked ($X).";
    } catch (error) {
      statusText.textContent = error.message || "Unlock failed.";
    }
  });
  autofocusBtn.addEventListener("click", async () => {
    try {
      statusText.textContent = "Running Z-axis autofocus sweep…";
      await runZAutofocus(1.0, 0.25);
    } catch (error) {
      statusText.textContent = error.message || "Autofocus failed.";
    }
  });
  jogButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const [axis, dirRaw] = btn.dataset.cncJog.split(":");
      const step = Number(jogStepSelect.value) || 1;
      const dir = Number(dirRaw);
      try {
        if (axis === "home") {
          renderCncStatus(await api.moveTo({ x: 0, y: 0, feedRate: 2000, settleMs: 80 }));
        } else {
          renderCncStatus(await api.jog({ [`d${axis}`]: step * dir, feedRate: 1200 }));
        }
      } catch (error) {
        statusText.textContent = error.message || "Jog blocked.";
      }
    });
  });
  startScanBtn.addEventListener("click", runAutomatedCardScan);
  stopScanBtn.addEventListener("click", () => {
    cncScanAbortRequested = true;
    statusText.textContent = "Stopping auto scan after current move…";
  });

  refreshPorts();
  api.getStatus().then(renderCncStatus).catch(() => {});
}

async function runVisionOnEvidenceItem(index, openModalAfter = false) {
  const api = window.traceLockDesktop?.vision;
  const item = reportEvidence[index];
  if (!api || !item) return [];

  const statusEl = document.querySelector("#visionStatusText");
  const badgeEl = document.querySelector("#visionStateBadge");
  const modelSelect = document.querySelector("#visionModelSelect");
  const vlmTriageToggle = document.querySelector("#visionVlmTriageToggle");

  if (badgeEl) badgeEl.textContent = "Analyzing";
  if (statusEl) statusEl.textContent = `Analyzing ${item.title}…`;

  try {
    const sourceUrl = item.originalUrl || item.url;
    const payload = {
      step: item.step || activeEvidenceStep(),
      region: item.title || regionSelect.value,
      mmPerPx: item.machine?.mmPerPx || millimetersPerPixel || null,
      useVlmTriage: Boolean(vlmTriageToggle?.checked),
      vlmModel: modelSelect?.value || "",
    };
    if (String(sourceUrl).startsWith("tracelock-media://")) {
      payload.imageUrl = sourceUrl;
    } else {
      payload.imageDataUrl = sourceUrl;
    }

    const result = await api.analyzeImage(payload);
    const detections = Array.isArray(result.detections) ? result.detections : [];
    item.suggestedMarks = detections;
    if (activeMarkIndex === index) {
      currentSuggestions = detections.map((d) => ({ ...d }));
      renderVisionSuggestionsPanel();
      redrawMarkCanvas();
    }
    renderReportEvidence();
    const modeLabel = result.meta?.mode || "vision";
    if (badgeEl) badgeEl.textContent = modeLabel === "yolo" ? "YOLO11" : "Classical CV";
    if (statusEl) {
      statusEl.textContent = `${item.title}: ${detections.length} candidate flaw${detections.length === 1 ? "" : "s"} flagged (${modeLabel}).`;
    }
    if (openModalAfter && activeMarkIndex !== index) {
      openMarkModal(index);
    }
    return detections;
  } catch (error) {
    if (badgeEl) badgeEl.textContent = "Error";
    if (statusEl) statusEl.textContent = `Vision analysis failed: ${error.message || error}`;
    return [];
  }
}

function initVisionControls() {
  const api = window.traceLockDesktop?.vision;
  const section = document.querySelector("#visionControlSection");
  if (!api || !section) return;
  section.hidden = false;

  const badge = document.querySelector("#visionStateBadge");
  const modelSelect = document.querySelector("#visionModelSelect");
  const statusText = document.querySelector("#visionStatusText");
  const scanCurrentBtn = document.querySelector("#visionScanCurrentButton");
  const refreshBtn = document.querySelector("#visionRefreshButton");
  const buildDatasetBtn = document.querySelector("#visionBuildDatasetButton");
  const reloadModelBtn = document.querySelector("#visionReloadModelButton");
  const autofillBtn = document.querySelector("#visionAutofillMetadataButton");
  const metadataHint = document.querySelector("#metadataFormHint");
  const runOnMarkBtn = document.querySelector("#runVisionOnMarkButton");
  const acceptAllBtn = document.querySelector("#acceptAllSuggestionsButton");
  const rejectAllBtn = document.querySelector("#rejectAllSuggestionsButton");

  if (autofillBtn) autofillBtn.hidden = false;
  if (runOnMarkBtn) runOnMarkBtn.hidden = false;

  async function refreshVisionStatus() {
    badge.textContent = "Starting…";
    const status = await api.getStatus();
    if (!status.ok) {
      badge.textContent = "Offline";
      badge.classList.remove("active");
      statusText.textContent = status.error || "Python vision sidecar could not start.";
      return status;
    }

    const activeEngine = status.yoloModelLoaded ? "YOLO11" : "Classical CV";
    badge.textContent = activeEngine;
    badge.classList.add("active");

    const currentModel = modelSelect.value;
    modelSelect.innerHTML = "";
    const ollamaModels = status.ollama?.visionModels?.length
      ? status.ollama.visionModels
      : status.ollama?.models || [];
    if (!ollamaModels.length) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = status.ollama?.available
        ? "Ollama running (pull qwen2.5vl:7b)"
        : "Ollama offline (Classical CV ready)";
      modelSelect.append(opt);
    } else {
      ollamaModels.forEach((name) => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        modelSelect.append(opt);
      });
      if (ollamaModels.includes(currentModel)) modelSelect.value = currentModel;
    }

    statusText.textContent = status.yoloModelLoaded
      ? `YOLO11 loaded (${status.yoloModelPath}). Ollama: ${ollamaModels.length ? ollamaModels[0] : "none"}.`
      : `Classical CV ready (Python ${status.python}). Ollama: ${ollamaModels.length ? ollamaModels[0] : "pull qwen2.5vl:7b for VLM"}.`;
    return status;
  }

  refreshBtn.addEventListener("click", refreshVisionStatus);

  scanCurrentBtn.addEventListener("click", async () => {
    if (mode === "microscope" ? !microscopeRawFrame.width : !sourceImage) {
      statusText.textContent = "Open a card image or start the microscope before scanning.";
      return;
    }
    const rawUrl = captureOriginalSourceDataUrl();
    const region = regionSelect.value;
    const item = addReportEvidence(
      `${region} AI scan`,
      `Vision AI inspection (${magnificationReadout.textContent}x · ${illuminationReadout.textContent}).`,
      rawUrl,
      "",
      "vision-scan",
      activeEvidenceStep()
    );
    await persistEvidenceItemToDisk(item);
    const idx = reportEvidence.indexOf(item);
    if (idx >= 0) {
      await runVisionOnEvidenceItem(idx, true);
    }
  });

  if (runOnMarkBtn) {
    runOnMarkBtn.addEventListener("click", async () => {
      if (activeMarkIndex === null) return;
      await runVisionOnEvidenceItem(activeMarkIndex, false);
    });
  }

  if (acceptAllBtn) {
    acceptAllBtn.addEventListener("click", () => {
      while (currentSuggestions.length) {
        const accepted = currentSuggestions.shift();
        currentMarks.push(
          createNormalizedMark({
            ...accepted,
            number: currentMarks.length + 1,
            color: markerColorSelect.value,
          })
        );
      }
      renderVisionSuggestionsPanel();
      redrawMarkCanvas();
    });
  }

  if (rejectAllBtn) {
    rejectAllBtn.addEventListener("click", () => {
      currentSuggestions = [];
      renderVisionSuggestionsPanel();
      redrawMarkCanvas();
    });
  }

  buildDatasetBtn.addEventListener("click", async () => {
    statusText.textContent = "Compiling YOLO dataset from disk sessions…";
    try {
      const summary = await api.buildDataset();
      statusText.textContent = `YOLO dataset built: ${summary.totalLabeledImages} labeled image(s) (${summary.trainImages} train / ${summary.valImages} val) -> ${summary.dataYaml}`;
    } catch (error) {
      statusText.textContent = `Dataset build failed: ${error.message || error}`;
    }
  });

  reloadModelBtn.addEventListener("click", async () => {
    try {
      const res = await api.reloadModel();
      statusText.textContent = res.yoloModelLoaded
        ? `Reloaded YOLO model: ${res.yoloModelPath}`
        : "No custom model found in vision/models/tracelock-flaws.pt yet.";
      await refreshVisionStatus();
    } catch (error) {
      statusText.textContent = `Reload failed: ${error.message || error}`;
    }
  });

  if (autofillBtn) {
    autofillBtn.addEventListener("click", async () => {
      const runExtract = async (imageDataUrl) => {
        autofillBtn.disabled = true;
        if (metadataHint) metadataHint.textContent = "Reading card metadata with local Ollama Vision model…";
        try {
          const res = await api.extractMetadata({
            imageDataUrl,
            model: modelSelect.value || "",
          });
          const m = res.metadata || {};
          if (m.player) playerInput.value = m.player;
          if (m.manufacturer) manufacturerInput.value = m.manufacturer;
          if (m.set) setInput.value = m.set;
          if (m.year) yearInput.value = m.year;
          if (m.cardNumber) cardNumberInput.value = m.cardNumber;
          if (m.serialNumber) serialNumberInput.value = m.serialNumber;
          if (m.cardName) cardNameInput.value = m.cardName;
          syncInspectionIdentity();
          if (metadataHint) metadataHint.textContent = `Metadata filled via ${m.model || "Ollama VLM"}. Verify before continuing.`;
        } catch (error) {
          if (metadataHint) metadataHint.textContent = error.message || "Metadata extraction failed.";
        } finally {
          autofillBtn.disabled = false;
        }
      };

      if (originalImage || sourceImage) {
        await runExtract(imageSourceToDataUrl(originalImage || sourceImage));
        return;
      }

      const picker = document.createElement("input");
      picker.type = "file";
      picker.accept = "image/*";
      picker.addEventListener("change", () => {
        const [file] = picker.files;
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => runExtract(reader.result);
        reader.readAsDataURL(file);
      });
      picker.click();
    });
  }

  refreshVisionStatus().catch(() => {});
}
