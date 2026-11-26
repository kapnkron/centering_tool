const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("traceLockDesktop", {
  onPhoneTransferReady(callback) {
    ipcRenderer.on("phone-transfer-ready", (_event, transfer) => callback(transfer));
  },
  onPhoneTransferStatus(callback) {
    ipcRenderer.on("phone-transfer-status", (_event, message) => callback(message));
  },
  onPhonePhoto(callback) {
    ipcRenderer.on("phone-photo", (_event, photo) => callback(photo));
  },
  session: {
    saveAsset(payload) {
      return ipcRenderer.invoke("session:save-asset", payload);
    },
    saveManifest(payload) {
      return ipcRenderer.invoke("session:save-manifest", payload);
    },
    listSessions() {
      return ipcRenderer.invoke("session:list");
    },
    loadSession(sessionId) {
      return ipcRenderer.invoke("session:load", sessionId);
    },
    openSessionFolder(sessionId) {
      return ipcRenderer.invoke("session:open-folder", sessionId);
    },
  },
  cnc: {
    listPorts() {
      return ipcRenderer.invoke("cnc:list-ports");
    },
    connect(options) {
      return ipcRenderer.invoke("cnc:connect", options);
    },
    disconnect() {
      return ipcRenderer.invoke("cnc:disconnect");
    },
    getStatus() {
      return ipcRenderer.invoke("cnc:status");
    },
    home() {
      return ipcRenderer.invoke("cnc:home");
    },
    unlock() {
      return ipcRenderer.invoke("cnc:unlock");
    },
    setWorkZero(axes) {
      return ipcRenderer.invoke("cnc:set-zero", axes);
    },
    jog(options) {
      return ipcRenderer.invoke("cnc:jog", options);
    },
    moveTo(options) {
      return ipcRenderer.invoke("cnc:move-to", options);
    },
    setLightProfile(profile) {
      return ipcRenderer.invoke("cnc:set-light", profile);
    },
    updateSafety(patch) {
      return ipcRenderer.invoke("cnc:update-safety", patch);
    },
    buildScanPlan(options) {
      return ipcRenderer.invoke("cnc:build-scan-plan", options);
    },
    emergencyStop() {
      return ipcRenderer.invoke("cnc:estop");
    },
    onStatus(callback) {
      ipcRenderer.on("cnc-status", (_event, status) => callback(status));
    },
    onLog(callback) {
      ipcRenderer.on("cnc-log", (_event, line) => callback(line));
    },
  },
  vision: {
    getStatus() {
      return ipcRenderer.invoke("vision:status");
    },
    analyzeImage(options) {
      return ipcRenderer.invoke("vision:analyze", options);
    },
    extractMetadata(options) {
      return ipcRenderer.invoke("vision:extract-metadata", options);
    },
    reloadModel() {
      return ipcRenderer.invoke("vision:reload-model");
    },
    buildDataset() {
      return ipcRenderer.invoke("vision:build-dataset");
    },
  },
});
