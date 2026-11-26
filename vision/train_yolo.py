#!/usr/bin/env python3
"""
Fine-tune a YOLO11 defect detector on your TraceLock card dataset (RTX GPU ready).

Example:
  python3 vision/dataset_builder.py
  python3 vision/train_yolo.py --data vision/dataset/data.yaml --model yolo11s.pt --epochs 60 --imgsz 1024
"""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description="Train TraceLock YOLO11 card flaw detector.")
    parser.add_argument("--data", type=Path, default=Path(__file__).resolve().parent / "dataset" / "data.yaml")
    parser.add_argument("--model", type=str, default="yolo11s.pt")
    parser.add_argument("--epochs", type=int, default=60)
    parser.add_argument("--imgsz", type=int, default=1024)
    parser.add_argument("--batch", type=int, default=8)
    parser.add_argument("--device", type=str, default="0")
    args = parser.parse_args()

    from ultralytics import YOLO  # type: ignore

    if not args.data.is_file():
        raise SystemExit(f"Dataset YAML not found: {args.data}. Run vision/dataset_builder.py first.")

    models_dir = Path(__file__).resolve().parent / "models"
    models_dir.mkdir(parents=True, exist_ok=True)

    model = YOLO(args.model)
    results = model.train(
        data=str(args.data),
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=args.batch,
        device=args.device,
        amp=True,
        project=str(Path(__file__).resolve().parent / "runs"),
        name="tracelock-flaws",
        exist_ok=True,
        # Trading-card friendly augmentations (avoid vertical distortion of micro-scratches)
        hsv_h=0.015,
        hsv_s=0.35,
        hsv_v=0.35,
        degrees=5.0,
        fliplr=0.5,
        flipud=0.5,
        mosaic=0.4,
    )

    best_pt = Path(results.save_dir) / "weights" / "best.pt"
    if best_pt.is_file():
        target_pt = models_dir / "tracelock-flaws.pt"
        shutil.copy2(best_pt, target_pt)
        print(f"Installed trained weights -> {target_pt}")
        try:
            trained = YOLO(str(target_pt))
            onnx_path = Path(trained.export(format="onnx", imgsz=args.imgsz, simplify=True))
            if onnx_path.is_file():
                target_onnx = models_dir / "tracelock-flaws.onnx"
                shutil.copy2(onnx_path, target_onnx)
                print(f"Exported ONNX model -> {target_onnx}")
        except Exception as exc:
            print(f"ONNX export skipped ({exc}); .pt weights are ready to use.")


if __name__ == "__main__":
    main()
