const { EventEmitter } = require("events");

let SerialPortModule = null;
try {
  SerialPortModule = require("serialport");
} catch {
  SerialPortModule = null;
}

const DEFAULT_SAFETY = {
  xMin: 0,
  xMax: 300,
  yMin: 0,
  yMax: 300,
  zMin: -50,
  zMax: 0,
  maxFeedRate: 3000,
  allowLedPwm: false,
};

function parseGrblStatusLine(line, currentWco = { x: 0, y: 0, z: 0 }) {
  const trimmed = String(line || "").trim();
  if (!trimmed.startsWith("<") || !trimmed.endsWith(">")) return null;
  const body = trimmed.slice(1, -1);
  const parts = body.split("|");
  const state = parts[0] || "Unknown";
  const result = { state };
  let wco = { ...currentWco };

  for (let i = 1; i < parts.length; i++) {
    const [key, rawVal] = parts[i].split(":");
    if (!rawVal) continue;
    const coords = rawVal.split(",").map(Number);
    if (key === "MPos" && coords.length >= 3) {
      result.mpos = { x: coords[0], y: coords[1], z: coords[2] };
    } else if (key === "WPos" && coords.length >= 3) {
      result.wpos = { x: coords[0], y: coords[1], z: coords[2] };
    } else if (key === "WCO" && coords.length >= 3) {
      wco = { x: coords[0], y: coords[1], z: coords[2] };
      result.wco = wco;
    }
  }

  if (result.mpos && !result.wpos) {
    result.wpos = {
      x: Number((result.mpos.x - wco.x).toFixed(3)),
      y: Number((result.mpos.y - wco.y).toFixed(3)),
      z: Number((result.mpos.z - wco.z).toFixed(3)),
    };
  } else if (result.wpos && !result.mpos) {
    result.mpos = {
      x: Number((result.wpos.x + wco.x).toFixed(3)),
      y: Number((result.wpos.y + wco.y).toFixed(3)),
      z: Number((result.wpos.z + wco.z).toFixed(3)),
    };
  }

  return result;
}

function validateGcodeSafety(command, safety = DEFAULT_SAFETY) {
  const cleaned = String(command || "").trim();
  if (!cleaned) throw new Error("Empty G-code command.");
  const upper = cleaned.toUpperCase();

  // Block dangerous spindle rotation unless explicitly enabled for low-voltage LED PWM
  if (!safety.allowLedPwm && /\bM0?[34]\b/.test(upper)) {
    throw new Error("Blocked M3/M4 spindle command for microscope safety. Enable LED PWM mode if M3 drives lighting.");
  }

  // Enforce axis envelope on absolute moves (skip relative G91/$J jogs which are checked by caller)
  if (!/\bG91\b|\$J=/.test(upper)) {
    const checkAxis = (axis, min, max) => {
      const match = new RegExp(`\\b${axis}(-?\\d+(?:\\.\\d+)?)`).exec(upper);
      if (!match) return;
      const value = Number(match[1]);
      if (value < min || value > max) {
        throw new Error(`${axis}=${value} mm is outside safety bounds [${min}, ${max}] mm.`);
      }
    };
    checkAxis("X", safety.xMin, safety.xMax);
    checkAxis("Y", safety.yMin, safety.yMax);
    checkAxis("Z", safety.zMin, safety.zMax);
  }
  return cleaned;
}

function buildCardScanPlan(options = {}) {
  const cardWidthMm = Number(options.cardWidthMm) || 63.5;
  const cardHeightMm = Number(options.cardHeightMm) || 88.9;
  const originX = Number(options.originX) || 0;
  const originY = Number(options.originY) || 0;
  const focusZ = Number(options.focusZ) || 0;
  const fovXMm = Math.max(4, Number(options.fovXMm) || 14);
  const fovYMm = Math.max(4, Number(options.fovYMm) || 10.5);
  const overlap = Math.min(0.45, Math.max(0.05, Number(options.overlap) || 0.15));
  const includeCorners = options.includeCorners !== false;
  const includeEdges = options.includeEdges !== false;
  const includeSurface = options.includeSurface !== false;
  const includeUv = Boolean(options.includeUv);

  const waypoints = [];
  const marginX = Math.min(cardWidthMm * 0.12, fovXMm * 0.35);
  const marginY = Math.min(cardHeightMm * 0.12, fovYMm * 0.35);

  if (includeCorners) {
    waypoints.push(
      { step: "corners", region: "Corner TL", x: originX + marginX, y: originY + cardHeightMm - marginY, z: focusZ, illumination: "normal" },
      { step: "corners", region: "Corner TR", x: originX + cardWidthMm - marginX, y: originY + cardHeightMm - marginY, z: focusZ, illumination: "normal" },
      { step: "corners", region: "Corner BR", x: originX + cardWidthMm - marginX, y: originY + marginY, z: focusZ, illumination: "normal" },
      { step: "corners", region: "Corner BL", x: originX + marginX, y: originY + marginY, z: focusZ, illumination: "normal" }
    );
  }

  if (includeEdges) {
    const edgeStopsX = Math.max(2, Math.ceil(cardWidthMm / (fovXMm * (1 - overlap))) - 1);
    const edgeStopsY = Math.max(2, Math.ceil(cardHeightMm / (fovYMm * (1 - overlap))) - 1);
    for (let i = 1; i <= edgeStopsX; i++) {
      const t = i / (edgeStopsX + 1);
      waypoints.push({ step: "edges", region: "Top edge", label: `Top edge ${i}/${edgeStopsX}`, x: originX + cardWidthMm * t, y: originY + cardHeightMm - marginY * 0.6, z: focusZ, illumination: "normal" });
    }
    for (let i = 1; i <= edgeStopsY; i++) {
      const t = 1 - i / (edgeStopsY + 1);
      waypoints.push({ step: "edges", region: "Right edge", label: `Right edge ${i}/${edgeStopsY}`, x: originX + cardWidthMm - marginX * 0.6, y: originY + cardHeightMm * t, z: focusZ, illumination: "normal" });
    }
    for (let i = 1; i <= edgeStopsX; i++) {
      const t = 1 - i / (edgeStopsX + 1);
      waypoints.push({ step: "edges", region: "Bottom edge", label: `Bottom edge ${i}/${edgeStopsX}`, x: originX + cardWidthMm * t, y: originY + marginY * 0.6, z: focusZ, illumination: "normal" });
    }
    for (let i = 1; i <= edgeStopsY; i++) {
      const t = i / (edgeStopsY + 1);
      waypoints.push({ step: "edges", region: "Left edge", label: `Left edge ${i}/${edgeStopsY}`, x: originX + marginX * 0.6, y: originY + cardHeightMm * t, z: focusZ, illumination: "normal" });
    }
  }

  if (includeSurface) {
    const stepX = Math.max(2, fovXMm * (1 - overlap));
    const stepY = Math.max(2, fovYMm * (1 - overlap));
    const cols = Math.max(1, Math.ceil(cardWidthMm / stepX));
    const rows = Math.max(1, Math.ceil(cardHeightMm / stepY));
    const xSpan = cols > 1 ? (cardWidthMm - marginX * 2) / (cols - 1) : 0;
    const ySpan = rows > 1 ? (cardHeightMm - marginY * 2) / (rows - 1) : 0;

    for (let r = 0; r < rows; r++) {
      const y = originY + cardHeightMm - marginY - r * ySpan;
      const leftToRight = r % 2 === 0;
      for (let c = 0; c < cols; c++) {
        const colIdx = leftToRight ? c : cols - 1 - c;
        const x = originX + marginX + colIdx * xSpan;
        waypoints.push({
          step: "surface",
          region: r < rows / 2 ? "Surface A" : "Surface B",
          label: `Surface R${r + 1}C${colIdx + 1}`,
          row: r + 1,
          col: colIdx + 1,
          x,
          y,
          z: focusZ,
          illumination: "angled",
        });
      }
    }
  }

  if (includeUv) {
    waypoints.push({
      step: "uv",
      region: "Security mark",
      label: "UV center check",
      x: originX + cardWidthMm / 2,
      y: originY + cardHeightMm / 2,
      z: focusZ,
      illumination: "uv365",
    });
  }

  return waypoints.map((wp, index) => ({
    ...wp,
    index: index + 1,
    total: waypoints.length,
    x: Number(wp.x.toFixed(2)),
    y: Number(wp.y.toFixed(2)),
    z: Number(wp.z.toFixed(2)),
  }));
}

class GrblController extends EventEmitter {
  constructor() {
    super();
    this.port = null;
    this.portPath = "";
    this.baudRate = 115200;
    this.simulated = false;
    this.connected = false;
    this.safety = { ...DEFAULT_SAFETY };
    this.status = {
      connected: false,
      simulated: false,
      port: "",
      state: "Disconnected",
      mpos: { x: 0, y: 0, z: 0 },
      wpos: { x: 0, y: 0, z: 0 },
      wco: { x: 0, y: 0, z: 0 },
      safety: { ...DEFAULT_SAFETY },
      serialportAvailable: Boolean(SerialPortModule),
    };
    this.readBuffer = "";
    this.pendingQueue = [];
    this.activeCommand = null;
    this.pollTimer = null;
    this.simTimer = null;
  }

  getStatus() {
    return {
      ...this.status,
      mpos: { ...this.status.mpos },
      wpos: { ...this.status.wpos },
      wco: { ...this.status.wco },
      safety: { ...this.safety },
      serialportAvailable: Boolean(SerialPortModule),
    };
  }

  emitStatus() {
    this.emit("status", this.getStatus());
  }

  updateSafety(patch = {}) {
    this.safety = {
      ...this.safety,
      ...patch,
    };
    this.status.safety = { ...this.safety };
    this.emitStatus();
    return this.getStatus();
  }

  async listPorts() {
    const ports = [
      {
        path: "SIM://GRBL-GANTRY",
        manufacturer: "TraceLock Virtual CNC Simulator",
        friendlyName: "Virtual GRBL Simulator (dry-run)",
        simulated: true,
      },
    ];
    if (SerialPortModule?.SerialPort?.list) {
      try {
        const hardware = await SerialPortModule.SerialPort.list();
        for (const item of hardware) {
          ports.push({
            path: item.path,
            manufacturer: item.manufacturer || "USB Serial",
            friendlyName: item.friendlyName || `${item.path}${item.manufacturer ? ` (${item.manufacturer})` : ""}`,
            vendorId: item.vendorId || "",
            productId: item.productId || "",
            simulated: false,
          });
        }
      } catch {
        // Fall through with simulator entry available
      }
    }
    return {
      serialportAvailable: Boolean(SerialPortModule),
      ports,
    };
  }

  async connect({ path: portPath, baudRate = 115200 } = {}) {
    await this.disconnect();
    const targetPath = String(portPath || "SIM://GRBL-GANTRY");
    this.portPath = targetPath;
    this.baudRate = Number(baudRate) || 115200;

    if (targetPath === "SIM://GRBL-GANTRY") {
      this.simulated = true;
      this.connected = true;
      this.status = {
        ...this.status,
        connected: true,
        simulated: true,
        port: targetPath,
        state: "Idle",
      };
      this.emitStatus();
      return this.getStatus();
    }

    if (!SerialPortModule?.SerialPort) {
      throw new Error("The 'serialport' package is not installed. Run 'npm install serialport' to connect hardware, or select Virtual GRBL Simulator.");
    }

    await new Promise((resolve, reject) => {
      const serial = new SerialPortModule.SerialPort({
        path: targetPath,
        baudRate: this.baudRate,
        autoOpen: false,
      });
      serial.open((err) => {
        if (err) {
          reject(err);
          return;
        }
        this.port = serial;
        this.simulated = false;
        this.connected = true;
        this.status = {
          ...this.status,
          connected: true,
          simulated: false,
          port: targetPath,
          state: "Idle",
        };
        serial.on("data", (chunk) => this.handleSerialData(chunk.toString("utf8")));
        serial.on("close", () => {
          this.handleDisconnect("Disconnected");
        });
        serial.on("error", (serialErr) => {
          this.emit("log", `Serial error: ${serialErr.message}`);
        });
        this.startPolling();
        this.emitStatus();
        resolve();
      });
    });

    return this.getStatus();
  }

  async disconnect() {
    this.stopPolling();
    if (this.simTimer) {
      clearTimeout(this.simTimer);
      this.simTimer = null;
    }
    this.rejectPending(new Error("GRBL disconnected."));
    if (this.port && this.port.isOpen) {
      await new Promise((resolve) => this.port.close(() => resolve()));
    }
    this.port = null;
    this.handleDisconnect("Disconnected");
    return this.getStatus();
  }

  handleDisconnect(stateLabel = "Disconnected") {
    this.stopPolling();
    this.connected = false;
    this.simulated = false;
    this.status.connected = false;
    this.status.simulated = false;
    this.status.port = "";
    this.status.state = stateLabel;
    this.emitStatus();
  }

  startPolling() {
    this.stopPolling();
    this.pollTimer = setInterval(() => {
      if (this.connected && !this.simulated && this.port?.isOpen) {
        this.port.write("?");
      }
    }, 250);
  }

  stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  handleSerialData(text) {
    this.readBuffer += text;
    const lines = this.readBuffer.split(/\r?\n/);
    this.readBuffer = lines.pop() || "";

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      if (line.startsWith("<") && line.endsWith(">")) {
        const parsed = parseGrblStatusLine(line, this.status.wco);
        if (parsed) {
          this.status.state = parsed.state;
          if (parsed.mpos) this.status.mpos = parsed.mpos;
          if (parsed.wpos) this.status.wpos = parsed.wpos;
          if (parsed.wco) this.status.wco = parsed.wco;
          this.emitStatus();
        }
        continue;
      }

      this.emit("log", `<< ${line}`);
      if (line === "ok") {
        if (this.activeCommand) {
          const done = this.activeCommand;
          clearTimeout(done.timer);
          this.activeCommand = null;
          done.resolve({ ok: true, line });
          this.drainQueue();
        }
      } else if (/^(error|ALARM):/i.test(line)) {
        if (line.toUpperCase().startsWith("ALARM:")) {
          this.status.state = "Alarm";
          this.emitStatus();
        }
        if (this.activeCommand) {
          const failed = this.activeCommand;
          clearTimeout(failed.timer);
          this.activeCommand = null;
          failed.reject(new Error(`GRBL ${line}`));
          this.drainQueue();
        }
      }
    }
  }

  rejectPending(error) {
    if (this.activeCommand) {
      clearTimeout(this.activeCommand.timer);
      this.activeCommand.reject(error);
      this.activeCommand = null;
    }
    while (this.pendingQueue.length) {
      const item = this.pendingQueue.shift();
      item.reject(error);
    }
  }

  async sendCommand(rawCommand, timeoutMs = 15000) {
    if (!this.connected) {
      throw new Error("Connect to a GRBL controller (or simulator) first.");
    }
    const command = validateGcodeSafety(rawCommand, this.safety);
    this.emit("log", `>> ${command}`);

    if (this.simulated) {
      return this.executeSimulatedCommand(command);
    }

    return new Promise((resolve, reject) => {
      this.pendingQueue.push({ command, timeoutMs, resolve, reject });
      this.drainQueue();
    });
  }

  drainQueue() {
    if (this.activeCommand || !this.pendingQueue.length || !this.port?.isOpen) return;
    const next = this.pendingQueue.shift();
    next.timer = setTimeout(() => {
      this.activeCommand = null;
      next.reject(new Error(`Timed out waiting for GRBL response to: ${next.command}`));
      this.drainQueue();
    }, next.timeoutMs);
    this.activeCommand = next;
    this.port.write(`${next.command}\n`);
  }

  executeSimulatedCommand(command) {
    const upper = command.toUpperCase();
    return new Promise((resolve) => {
      this.status.state = "Run";
      this.emitStatus();

      let delayMs = 60;
      if (upper === "$H") {
        this.status.mpos = { x: 0, y: 0, z: 0 };
        this.status.wpos = {
          x: -this.status.wco.x,
          y: -this.status.wco.y,
          z: -this.status.wco.z,
        };
        delayMs = 180;
      } else if (upper === "$X") {
        delayMs = 40;
      } else if (/^G10\s+L20\s+P1/.test(upper)) {
        const setAxis = (axis, key) => {
          const match = new RegExp(`\\b${axis}(-?\\d+(?:\\.\\d+)?)`).exec(upper);
          if (match) {
            const targetWpos = Number(match[1]);
            this.status.wco[key] = Number((this.status.mpos[key] - targetWpos).toFixed(3));
            this.status.wpos[key] = targetWpos;
          }
        };
        setAxis("X", "x");
        setAxis("Y", "y");
        setAxis("Z", "z");
        delayMs = 30;
      } else {
        const isRelative = /\bG91\b|\$J=/.test(upper);
        const nextPos = { ...this.status.wpos };
        for (const [axis, key] of [["X", "x"], ["Y", "y"], ["Z", "z"]]) {
          const match = new RegExp(`\\b${axis}(-?\\d+(?:\\.\\d+)?)`).exec(upper);
          if (match) {
            const val = Number(match[1]);
            nextPos[key] = Number((isRelative ? nextPos[key] + val : val).toFixed(3));
          }
        }
        const dist = Math.hypot(
          nextPos.x - this.status.wpos.x,
          nextPos.y - this.status.wpos.y,
          nextPos.z - this.status.wpos.z
        );
        delayMs = Math.min(260, Math.max(40, Math.round(dist * 4)));
        this.status.wpos = nextPos;
        this.status.mpos = {
          x: Number((nextPos.x + this.status.wco.x).toFixed(3)),
          y: Number((nextPos.y + this.status.wco.y).toFixed(3)),
          z: Number((nextPos.z + this.status.wco.z).toFixed(3)),
        };
      }

      this.simTimer = setTimeout(() => {
        this.simTimer = null;
        this.status.state = "Idle";
        this.emitStatus();
        resolve({ ok: true, line: "ok" });
      }, delayMs);
    });
  }

  async waitForIdle(settleMs = 150, timeoutMs = 20000) {
    const start = Date.now();
    if (!this.simulated) {
      await this.sendCommand("G4 P0.05", timeoutMs);
    }
    while (Date.now() - start < timeoutMs) {
      if (!this.connected) throw new Error("GRBL disconnected while waiting for Idle.");
      if (this.status.state === "Alarm") throw new Error("GRBL entered Alarm state.");
      if (this.status.state === "Idle") {
        if (settleMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, settleMs));
        }
        return this.getStatus();
      }
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    throw new Error("Timed out waiting for gantry to settle.");
  }

  async home() {
    await this.sendCommand("$H", 45000);
    return this.waitForIdle(150);
  }

  async unlock() {
    await this.sendCommand("$X");
    this.status.state = "Idle";
    this.emitStatus();
    return this.getStatus();
  }

  async setWorkZero({ x = true, y = true, z = false } = {}) {
    const axes = [];
    if (x) axes.push("X0");
    if (y) axes.push("Y0");
    if (z) axes.push("Z0");
    if (!axes.length) return this.getStatus();
    await this.sendCommand(`G10 L20 P1 ${axes.join(" ")}`);
    return this.getStatus();
  }

  async jog({ dx = 0, dy = 0, dz = 0, feedRate = 1200 } = {}) {
    const targetX = Number((this.status.wpos.x + Number(dx || 0)).toFixed(3));
    const targetY = Number((this.status.wpos.y + Number(dy || 0)).toFixed(3));
    const targetZ = Number((this.status.wpos.z + Number(dz || 0)).toFixed(3));
    if (targetX < this.safety.xMin || targetX > this.safety.xMax) {
      throw new Error(`Jog X=${targetX} mm exceeds bounds [${this.safety.xMin}, ${this.safety.xMax}].`);
    }
    if (targetY < this.safety.yMin || targetY > this.safety.yMax) {
      throw new Error(`Jog Y=${targetY} mm exceeds bounds [${this.safety.yMin}, ${this.safety.yMax}].`);
    }
    if (targetZ < this.safety.zMin || targetZ > this.safety.zMax) {
      throw new Error(`Jog Z=${targetZ} mm exceeds bounds [${this.safety.zMin}, ${this.safety.zMax}].`);
    }
    const clampedFeed = Math.min(this.safety.maxFeedRate, Math.max(50, Number(feedRate) || 1200));
    const parts = [];
    if (dx) parts.push(`X${Number(dx).toFixed(3)}`);
    if (dy) parts.push(`Y${Number(dy).toFixed(3)}`);
    if (dz) parts.push(`Z${Number(dz).toFixed(3)}`);
    if (!parts.length) return this.getStatus();

    await this.sendCommand(`G21 G91 G1 ${parts.join(" ")} F${clampedFeed}`);
    await this.sendCommand("G90");
    return this.waitForIdle(80);
  }

  async moveTo({ x, y, z, feedRate = 2400, settleMs = 150 } = {}) {
    const clampedFeed = Math.min(this.safety.maxFeedRate, Math.max(50, Number(feedRate) || 2400));
    const parts = [];
    if (x !== undefined && x !== null && !Number.isNaN(Number(x))) parts.push(`X${Number(x).toFixed(3)}`);
    if (y !== undefined && y !== null && !Number.isNaN(Number(y))) parts.push(`Y${Number(y).toFixed(3)}`);
    if (z !== undefined && z !== null && !Number.isNaN(Number(z))) parts.push(`Z${Number(z).toFixed(3)}`);
    if (!parts.length) return this.getStatus();

    await this.sendCommand(`G21 G90 G1 ${parts.join(" ")} F${clampedFeed}`);
    return this.waitForIdle(settleMs);
  }

  async setLightProfile(profile = "normal") {
    if (!this.connected) return this.getStatus();
    if (profile === "uv365" || profile === "uv395") {
      await this.sendCommand("M7");
    } else if (profile === "angled") {
      await this.sendCommand("M8");
    } else {
      await this.sendCommand("M9");
    }
    return this.getStatus();
  }

  async emergencyStop() {
    if (this.simTimer) {
      clearTimeout(this.simTimer);
      this.simTimer = null;
    }
    this.rejectPending(new Error("Emergency stop triggered."));
    if (this.connected && !this.simulated && this.port?.isOpen) {
      this.port.write("!");
      setTimeout(() => {
        if (this.port?.isOpen) this.port.write(Buffer.from([0x18]));
      }, 30);
    }
    this.status.state = "Hold/Reset";
    this.emit("log", "!! EMERGENCY STOP SENT (! + Ctrl-X)");
    this.emitStatus();
    return this.getStatus();
  }
}

module.exports = {
  DEFAULT_SAFETY,
  GrblController,
  buildCardScanPlan,
  parseGrblStatusLine,
  validateGcodeSafety,
};
