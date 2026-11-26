#!/usr/bin/env python3
"""
TraceLock Local Vision Sidecar
------------------------------
Runs locally on 127.0.0.1:8765 (configurable via TRACELOCK_VISION_PORT).
Supports three progressive detection layers:
  1. Classical forensic CV (zero-install: numpy + Pillow; enhanced with OpenCV if installed):
     - Sharpness scoring (Laplacian variance)
     - Surface scratch / edge whitening / print-spot candidate boxes
     - Photometric pair differencing (Normal vs. Angled/Raking light)
  2. Custom local YOLO11 / ONNX defect detector (auto-loads vision/models/tracelock-flaws.pt or .onnx)
  3. Local Ollama Vision-Language Model (e.g. qwen2.5vl:7b / gemma3:12b / llama3.2-vision):
     - Step 01 full-card metadata auto-fill
     - Candidate flaw verification & forensic description drafting
"""

from __future__ import annotations

import base64
import io
import json
import math
import os
import sys
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageFilter

try:
    import cv2  # type: ignore
except Exception:
    cv2 = None

try:
    from ultralytics import YOLO  # type: ignore
except Exception:
    YOLO = None

try:
    import onnxruntime as ort  # type: ignore
except Exception:
    ort = None

ROOT_DIR = Path(__file__).resolve().parent
MODELS_DIR = ROOT_DIR / "models"
DEFAULT_PORT = int(os.environ.get("TRACELOCK_VISION_PORT", "8765"))
OLLAMA_URL = os.environ.get("OLLAMA_HOST", "http://127.0.0.1:11434").rstrip("/")

FLAW_CLASSES = [
    "Scratch",
    "Corner Ding",
    "Edge Whitening",
    "Crease",
    "Print Defect",
    "Discoloration",
]

PREFERRED_VLM_KEYWORDS = ("qwen2.5vl", "qwen2.5-vl", "qwen3-vl", "gemma3", "llama3.2-vision", "minicpm-v", "llava", "moondream")


def decode_image_input(data_url: str | None = None, file_path: str | None = None) -> Image.Image:
    if file_path and os.path.isfile(file_path):
        return Image.open(file_path).convert("RGB")
    if data_url:
        raw = data_url.split(",", 1)[1] if "," in data_url else data_url
        return Image.open(io.BytesIO(base64.b64decode(raw))).convert("RGB")
    raise ValueError("Provide either 'imageDataUrl' or a readable 'filePath'.")


def encode_pil_jpeg_base64(image: Image.Image, max_dim: int = 1280, quality: int = 88) -> str:
    w, h = image.size
    scale = min(1.0, max_dim / max(1, w, h))
    if scale < 1.0:
        image = image.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    image.save(buf, format="JPEG", quality=quality)
    return base64.b64encode(buf.getvalue()).decode("ascii")


def to_normalized_box(
    x1: float,
    y1: float,
    x2: float,
    y2: float,
    width: int,
    height: int,
    flaw_type: str,
    severity: str,
    confidence: float,
    details: str,
    source: str,
) -> dict[str, Any]:
    nx1 = max(0.0, min(1.0, x1 / max(1, width)))
    ny1 = max(0.0, min(1.0, y1 / max(1, height)))
    nx2 = max(0.0, min(1.0, x2 / max(1, width)))
    ny2 = max(0.0, min(1.0, y2 / max(1, height)))
    if nx2 < nx1:
        nx1, nx2 = nx2, nx1
    if ny2 < ny1:
        ny1, ny2 = ny2, ny1
    bw = max(0.002, nx2 - nx1)
    bh = max(0.002, ny2 - ny1)
    return {
        "coordSpace": "normalized",
        "shape": "rect",
        "x1": round(nx1, 6),
        "y1": round(ny1, 6),
        "x2": round(nx2, 6),
        "y2": round(ny2, 6),
        "bbox": {
            "cx": round(nx1 + bw / 2.0, 6),
            "cy": round(ny1 + bh / 2.0, 6),
            "w": round(bw, 6),
            "h": round(bh, 6),
        },
        "flawType": flaw_type,
        "severity": severity,
        "confidence": round(float(confidence), 3),
        "details": details,
        "source": source,
        "verified": False,
    }


def compute_sharpness(gray: np.ndarray) -> float:
    if gray.shape[0] < 3 or gray.shape[1] < 3:
        return 0.0
    lap = (
        gray[:-2, 1:-1]
        + gray[2:, 1:-1]
        + gray[1:-1, :-2]
        + gray[1:-1, 2:]
        - 4.0 * gray[1:-1, 1:-1]
    )
    return float(np.var(lap))


def connected_boxes_from_mask(mask: np.ndarray, min_area: int = 12, max_boxes: int = 8) -> list[tuple[int, int, int, int, int]]:
    """Find bounding boxes of anomalous pixel clusters (uses cv2 when installed, else fast grid clustering)."""
    h, w = mask.shape
    if cv2 is not None:
        num_labels, _labels, stats, _centroids = cv2.connectedComponentsWithStats(mask.astype(np.uint8), connectivity=8)
        boxes: list[tuple[int, int, int, int, int]] = []
        for idx in range(1, num_labels):
            area = int(stats[idx, cv2.CC_STAT_AREA])
            if area < min_area:
                continue
            x = int(stats[idx, cv2.CC_STAT_LEFT])
            y = int(stats[idx, cv2.CC_STAT_TOP])
            bw = int(stats[idx, cv2.CC_STAT_WIDTH])
            bh = int(stats[idx, cv2.CC_STAT_HEIGHT])
            if bw >= w * 0.85 and bh >= h * 0.85:
                continue
            boxes.append((x, y, x + bw, y + bh, area))
        boxes.sort(key=lambda b: b[4], reverse=True)
        return boxes[:max_boxes]

    # Pure-numpy block aggregation fallback (fast, zero C-extension dependencies)
    cell = max(8, min(w, h) // 32)
    gy = max(1, h // cell)
    gx = max(1, w // cell)
    trimmed = mask[: gy * cell, : gx * cell].reshape(gy, cell, gx, cell)
    cell_counts = trimmed.sum(axis=(1, 3))
    threshold = max(3, int(cell * cell * 0.06))
    active = cell_counts >= threshold

    visited = np.zeros_like(active, dtype=bool)
    boxes = []
    for r in range(gy):
        for c in range(gx):
            if not active[r, c] or visited[r, c]:
                continue
            stack = [(r, c)]
            visited[r, c] = True
            min_r = max_r = r
            min_c = max_c = c
            total_pixels = 0
            while stack:
                cr, cc = stack.pop()
                total_pixels += int(cell_counts[cr, cc])
                min_r = min(min_r, cr)
                max_r = max(max_r, cr)
                min_c = min(min_c, cc)
                max_c = max(max_c, cc)
                for dr in (-1, 0, 1):
                    for dc in (-1, 0, 1):
                        nr, nc = cr + dr, cc + dc
                        if 0 <= nr < gy and 0 <= nc < gx and active[nr, nc] and not visited[nr, nc]:
                            visited[nr, nc] = True
                            stack.append((nr, nc))
            if total_pixels >= min_area:
                x1 = min_c * cell
                y1 = min_r * cell
                x2 = min(w, (max_c + 1) * cell)
                y2 = min(h, (max_r + 1) * cell)
                if (x2 - x1) < w * 0.85 or (y2 - y1) < h * 0.85:
                    boxes.append((x1, y1, x2, y2, total_pixels))
    boxes.sort(key=lambda b: b[4], reverse=True)
    return boxes[:max_boxes]


def classical_forensic_detect(
    image: Image.Image,
    step: str = "surface",
    mm_per_px: float | None = None,
    raking_image: Image.Image | None = None,
) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    orig_w, orig_h = image.size
    work_max = 640
    scale = min(1.0, work_max / max(1, orig_w, orig_h))
    work_w = max(32, int(round(orig_w * scale)))
    work_h = max(32, int(round(orig_h * scale)))
    work_img = image.resize((work_w, work_h), Image.Resampling.BILINEAR)
    rgb = np.asarray(work_img, dtype=np.float32)
    gray = rgb[:, :, 0] * 0.2126 + rgb[:, :, 1] * 0.7152 + rgb[:, :, 2] * 0.0722
    sharpness = compute_sharpness(gray)

    detections: list[dict[str, Any]] = []
    inv_scale = 1.0 / scale

    # Mode A: Photometric pair differencing (Normal vs. Raking/Angled light)
    if raking_image is not None:
        raking_work = raking_image.resize((work_w, work_h), Image.Resampling.BILINEAR)
        r_rgb = np.asarray(raking_work, dtype=np.float32)
        r_gray = r_rgb[:, :, 0] * 0.2126 + r_rgb[:, :, 1] * 0.7152 + r_rgb[:, :, 2] * 0.0722
        # Normalize global exposure before diffing
        g1 = (gray - gray.mean()) / (gray.std() + 1e-5)
        g2 = (r_gray - r_gray.mean()) / (r_gray.std() + 1e-5)
        diff = np.abs(g1 - g2)
        thresh = float(np.percentile(diff, 98.5))
        mask = diff > max(2.2, thresh)
        for x1, y1, x2, y2, area in connected_boxes_from_mask(mask, min_area=18, max_boxes=6):
            bw = max(1, x2 - x1)
            bh = max(1, y2 - y1)
            aspect = max(bw / bh, bh / bw)
            flaw_type = "Scratch" if aspect >= 2.2 else "Crease"
            score = min(0.95, 0.55 + float(diff[y1:y2, x1:x2].mean()) * 0.1)
            size_note = ""
            if mm_per_px:
                diag_mm = math.hypot(bw * inv_scale, bh * inv_scale) * mm_per_px
                size_note = f" (~{diag_mm:.2f} mm)"
            severity = "Severe" if area > 400 else ("Moderate" if area > 120 else "Light")
            detections.append(
                to_normalized_box(
                    x1 * inv_scale,
                    y1 * inv_scale,
                    x2 * inv_scale,
                    y2 * inv_scale,
                    orig_w,
                    orig_h,
                    flaw_type,
                    severity,
                    score,
                    f"Photometric relief anomaly{size_note}",
                    "classical-photometric",
                )
            )
        return detections, {"sharpness": round(sharpness, 2), "mode": "photometric-diff"}

    # Mode B: Single-frame classical CV tuned by inspection step
    # 1. Local high-frequency ridge/scratch energy vs. smooth local background
    gx = np.abs(gray[:, 2:] - gray[:, :-2])
    gy = np.abs(gray[2:, :] - gray[:-2, :])
    grad = np.zeros_like(gray)
    grad[1:-1, 1:-1] = np.hypot(gx[1:-1, :], gy[:, 1:-1])

    grad_u8 = np.clip(grad, 0, 255).astype(np.uint8)
    local_bg = np.asarray(Image.fromarray(grad_u8).filter(ImageFilter.BoxBlur(11)), dtype=np.float32)
    ridge = np.maximum(0.0, grad - local_bg * 1.4)
    ridge_thresh = max(28.0, float(ridge.mean() + 3.5 * ridge.std()))
    ridge_mask = ridge > ridge_thresh

    for x1, y1, x2, y2, area in connected_boxes_from_mask(ridge_mask, min_area=14, max_boxes=4):
        bw = max(1, x2 - x1)
        bh = max(1, y2 - y1)
        aspect = max(bw / bh, bh / bw)
        if step == "corners":
            flaw_type = "Corner Ding"
        elif step == "edges":
            flaw_type = "Edge Whitening"
        elif aspect >= 2.1:
            flaw_type = "Scratch"
        else:
            flaw_type = "Print Defect"
        peak = float(ridge[y1:y2, x1:x2].max())
        conf = min(0.88, 0.42 + (peak / 255.0) * 0.45)
        size_note = ""
        if mm_per_px:
            length_mm = max(bw, bh) * inv_scale * mm_per_px
            size_note = f" (~{length_mm:.2f} mm)"
        severity = "Severe" if area > 260 else ("Moderate" if area > 75 else "Light")
        detections.append(
            to_normalized_box(
                max(0, (x1 - 4) * inv_scale),
                max(0, (y1 - 4) * inv_scale),
                min(orig_w, (x2 + 4) * inv_scale),
                min(orig_h, (y2 + 4) * inv_scale),
                orig_w,
                orig_h,
                flaw_type,
                severity,
                conf,
                f"High-contrast surface/edge anomaly{size_note}",
                "classical-cv",
            )
        )

    # 2. Edge / corner whitening check (bright low-saturation paper core against darker borders)
    if step in ("edges", "corners"):
        max_c = rgb.max(axis=2)
        min_c = rgb.min(axis=2)
        sat = (max_c - min_c) / (max_c + 1e-5)
        # Only flag localized white flecks if overall frame isn't already pure white
        if float(gray.mean()) < 195.0:
            white_mask = (gray > 218.0) & (sat < 0.16)
            for x1, y1, x2, y2, area in connected_boxes_from_mask(white_mask, min_area=16, max_boxes=3):
                size_note = ""
                if mm_per_px:
                    span_mm = max(x2 - x1, y2 - y1) * inv_scale * mm_per_px
                    size_note = f" (~{span_mm:.2f} mm)"
                flaw_type = "Corner Ding" if step == "corners" else "Edge Whitening"
                severity = "Severe" if area > 300 else ("Moderate" if area > 90 else "Light")
                detections.append(
                    to_normalized_box(
                        max(0, (x1 - 3) * inv_scale),
                        max(0, (y1 - 3) * inv_scale),
                        min(orig_w, (x2 + 3) * inv_scale),
                        min(orig_h, (y2 + 3) * inv_scale),
                        orig_w,
                        orig_h,
                        flaw_type,
                        severity,
                        0.68,
                        f"Localized exposed white stock / whitening{size_note}",
                        "classical-whitening",
                    )
                )

    return detections[:6], {"sharpness": round(sharpness, 2), "mode": "classical-cv"}


class YoloDetector:
    def __init__(self) -> None:
        self.model = None
        self.model_path: str = ""
        self.load_if_available()

    def load_if_available(self) -> bool:
        if YOLO is None:
            return False
        for candidate in (MODELS_DIR / "tracelock-flaws.pt", MODELS_DIR / "tracelock-flaws.onnx"):
            if candidate.is_file():
                try:
                    self.model = YOLO(str(candidate))
                    self.model_path = str(candidate)
                    return True
                except Exception:
                    self.model = None
        return False

    def detect(self, image: Image.Image, conf: float = 0.25, mm_per_px: float | None = None) -> list[dict[str, Any]]:
        if self.model is None:
            return []
        orig_w, orig_h = image.size
        results = self.model.predict(source=image, conf=conf, verbose=False)
        detections: list[dict[str, Any]] = []
        for res in results:
            boxes = getattr(res, "boxes", None)
            if boxes is None:
                continue
            names = getattr(res, "names", {}) or {}
            for box in boxes:
                xyxy = box.xyxy[0].tolist()
                cls_id = int(box.cls[0].item())
                score = float(box.conf[0].item())
                label = names.get(cls_id) if isinstance(names, dict) else None
                if not label:
                    label = FLAW_CLASSES[cls_id] if 0 <= cls_id < len(FLAW_CLASSES) else "Print Defect"
                bw = abs(xyxy[2] - xyxy[0])
                bh = abs(xyxy[3] - xyxy[1])
                size_note = f" (~{max(bw, bh) * mm_per_px:.2f} mm)" if mm_per_px else ""
                severity = "Severe" if score >= 0.8 else ("Moderate" if score >= 0.5 else "Light")
                detections.append(
                    to_normalized_box(
                        xyxy[0],
                        xyxy[1],
                        xyxy[2],
                        xyxy[3],
                        orig_w,
                        orig_h,
                        label,
                        severity,
                        score,
                        f"YOLO11 detected {label.lower()}{size_note}",
                        "yolo",
                    )
                )
        return detections


def ollama_request(endpoint: str, payload: dict[str, Any] | None = None, timeout: int = 90) -> dict[str, Any]:
    url = f"{OLLAMA_URL}{endpoint}"
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"} if data is not None else {},
        method="POST" if data is not None else "GET",
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def list_ollama_models() -> dict[str, Any]:
    try:
        res = ollama_request("/api/tags", None, timeout=3)
        models = [m.get("name", "") for m in res.get("models", []) if m.get("name")]
        vision_models = [
            name for name in models if any(kw in name.lower() for kw in PREFERRED_VLM_KEYWORDS)
        ]
        recommended = vision_models[0] if vision_models else (models[0] if models else "")
        return {
            "available": True,
            "models": models,
            "visionModels": vision_models,
            "recommended": recommended,
        }
    except Exception:
        return {
            "available": False,
            "models": [],
            "visionModels": [],
            "recommended": "",
        }


def extract_json_object(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("\n", 1)[1] if "\n" in cleaned else cleaned
        cleaned = cleaned.rsplit("```", 1)[0].strip()
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start >= 0 and end > start:
        cleaned = cleaned[start : end + 1]
    return json.loads(cleaned)


def ollama_extract_card_metadata(image: Image.Image, model: str) -> dict[str, Any]:
    b64 = encode_pil_jpeg_base64(image, max_dim=1400, quality=90)
    prompt = (
        "You are a trading card cataloging assistant. Inspect this card image and return ONLY a valid JSON object "
        "with these exact keys (use empty string \"\" if not clearly visible; never invent details):\n"
        '{"player": "", "manufacturer": "", "set": "", "year": "", "cardNumber": "", "serialNumber": "", "cardName": ""}\n'
        "For cardName, combine subject + variant/parallel if visible (e.g. 'Silver Prizm Rookie'). "
        "For year, return a 4-digit year string if visible."
    )
    response = ollama_request(
        "/api/chat",
        {
            "model": model,
            "stream": False,
            "format": "json",
            "messages": [{"role": "user", "content": prompt, "images": [b64]}],
            "options": {"temperature": 0.1},
        },
        timeout=120,
    )
    content = response.get("message", {}).get("content", "{}")
    parsed = extract_json_object(content)
    return {
        "player": str(parsed.get("player", "") or "").strip(),
        "manufacturer": str(parsed.get("manufacturer", "") or "").strip(),
        "set": str(parsed.get("set", "") or "").strip(),
        "year": str(parsed.get("year", "") or "").strip(),
        "cardNumber": str(parsed.get("cardNumber", "") or "").strip(),
        "serialNumber": str(parsed.get("serialNumber", "") or "").strip(),
        "cardName": str(parsed.get("cardName", "") or "").strip(),
        "model": model,
    }


def ollama_triage_detections(
    image: Image.Image,
    detections: list[dict[str, Any]],
    model: str,
    step: str,
) -> list[dict[str, Any]]:
    if not detections:
        return detections
    w, h = image.size
    triaged: list[dict[str, Any]] = []
    for det in detections[:4]:
        pad_x = max(24, int((det["x2"] - det["x1"]) * w * 0.45))
        pad_y = max(24, int((det["y2"] - det["y1"]) * h * 0.45))
        cx1 = max(0, int(det["x1"] * w) - pad_x)
        cy1 = max(0, int(det["y1"] * h) - pad_y)
        cx2 = min(w, int(det["x2"] * w) + pad_x)
        cy2 = min(h, int(det["y2"] * h) + pad_y)
        crop = image.crop((cx1, cy1, max(cx1 + 8, cx2), max(cy1 + 8, cy2)))
        b64 = encode_pil_jpeg_base64(crop, max_dim=512, quality=90)
        prompt = (
            f"You are inspecting a close-up trading card microscope crop from the '{step}' inspection step. "
            f"A detector flagged a possible '{det['flawType']}' ({det['details']}). "
            "Determine if this looks like an actual physical defect vs normal printed card artwork/foil texture. "
            "Return ONLY valid JSON with keys: "
            '{"isDefect": true, "flawType": "Scratch|Corner Ding|Edge Whitening|Crease|Print Defect|Discoloration", '
            '"severity": "Light|Moderate|Severe", "details": "concise 1-sentence forensic note"}'
        )
        try:
            res = ollama_request(
                "/api/chat",
                {
                    "model": model,
                    "stream": False,
                    "format": "json",
                    "messages": [{"role": "user", "content": prompt, "images": [b64]}],
                    "options": {"temperature": 0.1},
                },
                timeout=60,
            )
            verdict = extract_json_object(res.get("message", {}).get("content", "{}"))
            if verdict.get("isDefect") is False:
                continue
            flaw = str(verdict.get("flawType") or det["flawType"])
            if flaw not in FLAW_CLASSES:
                flaw = det["flawType"]
            sev = str(verdict.get("severity") or det["severity"])
            if sev not in ("Light", "Moderate", "Severe"):
                sev = det["severity"]
            triaged.append(
                {
                    **det,
                    "flawType": flaw,
                    "severity": sev,
                    "details": str(verdict.get("details") or det["details"]).strip(),
                    "source": f"{det['source']}+vlm",
                }
            )
        except Exception:
            triaged.append(det)
    return triaged


YOLO_DETECTOR = YoloDetector()


class VisionHandler(BaseHTTPRequestHandler):
    def log_message(self, format: str, *args: Any) -> None:
        return

    def send_json(self, status_code: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def read_json(self) -> dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0") or "0")
        raw = self.rfile.read(length) if length > 0 else b"{}"
        return json.loads(raw.decode("utf-8"))

    def do_GET(self) -> None:
        if self.path == "/health":
            ollama_info = list_ollama_models()
            self.send_json(
                200,
                {
                    "ok": True,
                    "python": sys.version.split()[0],
                    "opencv": cv2 is not None,
                    "ultralytics": YOLO is not None,
                    "onnxruntime": ort is not None,
                    "yoloModelLoaded": YOLO_DETECTOR.model is not None,
                    "yoloModelPath": YOLO_DETECTOR.model_path,
                    "ollama": ollama_info,
                    "classes": FLAW_CLASSES,
                },
            )
            return
        self.send_json(404, {"error": "Not found"})

    def do_POST(self) -> None:
        try:
            payload = self.read_json()
        except Exception as exc:
            self.send_json(400, {"error": f"Invalid JSON: {exc}"})
            return

        if self.path == "/analyze":
            try:
                image = decode_image_input(payload.get("imageDataUrl"), payload.get("filePath"))
                raking = None
                if payload.get("rakingImageDataUrl") or payload.get("rakingFilePath"):
                    raking = decode_image_input(payload.get("rakingImageDataUrl"), payload.get("rakingFilePath"))

                step = str(payload.get("step") or "surface")
                mm_per_px = payload.get("mmPerPx")
                mm_per_px_val = float(mm_per_px) if mm_per_px is not None and float(mm_per_px) > 0 else None
                use_vlm = bool(payload.get("useVlmTriage"))
                vlm_model = str(payload.get("vlmModel") or "").strip()

                detections: list[dict[str, Any]] = []
                meta: dict[str, Any] = {}

                if YOLO_DETECTOR.model is not None:
                    detections = YOLO_DETECTOR.detect(image, conf=float(payload.get("conf", 0.25)), mm_per_px=mm_per_px_val)
                    meta = {"mode": "yolo", "model": YOLO_DETECTOR.model_path}
                    rgb = np.asarray(image.resize((320, 320)), dtype=np.float32)
                    gray = rgb[:, :, 0] * 0.2126 + rgb[:, :, 1] * 0.7152 + rgb[:, :, 2] * 0.0722
                    meta["sharpness"] = round(compute_sharpness(gray), 2)
                else:
                    detections, meta = classical_forensic_detect(
                        image,
                        step=step,
                        mm_per_px=mm_per_px_val,
                        raking_image=raking,
                    )

                if use_vlm and detections:
                    if not vlm_model:
                        vlm_model = list_ollama_models().get("recommended", "")
                    if vlm_model:
                        detections = ollama_triage_detections(image, detections, vlm_model, step)
                        meta["vlmTriaged"] = vlm_model

                self.send_json(
                    200,
                    {
                        "ok": True,
                        "width": image.width,
                        "height": image.height,
                        "detections": detections,
                        "meta": meta,
                    },
                )
            except Exception as exc:
                self.send_json(500, {"error": str(exc)})
            return

        if self.path == "/extract-metadata":
            try:
                image = decode_image_input(payload.get("imageDataUrl"), payload.get("filePath"))
                model = str(payload.get("model") or "").strip()
                if not model:
                    info = list_ollama_models()
                    if not info["available"] or not info["recommended"]:
                        self.send_json(
                            503,
                            {
                                "error": "No local Ollama vision model found. Pull one with: ollama pull qwen2.5vl:7b",
                            },
                        )
                        return
                    model = info["recommended"]
                metadata = ollama_extract_card_metadata(image, model)
                self.send_json(200, {"ok": True, "metadata": metadata})
            except Exception as exc:
                self.send_json(500, {"error": str(exc)})
            return

        if self.path == "/reload-model":
            loaded = YOLO_DETECTOR.load_if_available()
            self.send_json(200, {"ok": True, "yoloModelLoaded": loaded, "yoloModelPath": YOLO_DETECTOR.model_path})
            return

        self.send_json(404, {"error": "Not found"})


class ReusableVisionServer(ThreadingHTTPServer):
    allow_reuse_address = True


def main() -> None:
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    server = ReusableVisionServer(("127.0.0.1", DEFAULT_PORT), VisionHandler)
    print(f"TRACELOCK_VISION_READY http://127.0.0.1:{DEFAULT_PORT}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
