#!/usr/bin/env python3
"""
Compile all TraceLock disk-backed inspection sessions into a YOLO11 train/val dataset.

Usage:
  python3 vision/dataset_builder.py --sessions <sessions-dir> --out vision/dataset
"""

from __future__ import annotations

import argparse
import json
import os
import random
import shutil
from pathlib import Path

FLAW_CLASSES = [
    "Scratch",
    "Corner Ding",
    "Edge Whitening",
    "Crease",
    "Print Defect",
    "Discoloration",
]


def default_sessions_dir() -> Path:
    if os.name == "nt":
        appdata = Path(os.environ.get("APPDATA", Path.home() / "AppData" / "Roaming"))
        return appdata / "tracelock-inspection-instrument" / "sessions"
    return Path.home() / ".config" / "tracelock-inspection-instrument" / "sessions"


def build_yolo_dataset(sessions_dir: Path, output_dir: Path, val_ratio: float = 0.2, seed: int = 42) -> dict:
    samples: list[tuple[Path, Path, str]] = []

    if sessions_dir.is_dir():
        for session_folder in sorted(sessions_dir.iterdir()):
            if not session_folder.is_dir():
                continue
            labels_dir = session_folder / "labels"
            images_dir = session_folder / "images"
            if not labels_dir.is_dir() or not images_dir.is_dir():
                continue
            for label_file in sorted(labels_dir.glob("*.txt")):
                if label_file.name == "classes.txt":
                    continue
                content = label_file.read_text(encoding="utf-8").strip()
                if not content:
                    continue
                stem = label_file.stem
                img_match = None
                for ext in (".png", ".jpg", ".jpeg", ".webp"):
                    candidate = images_dir / f"{stem}{ext}"
                    if candidate.is_file():
                        img_match = candidate
                        break
                if img_match is not None:
                    samples.append((img_match, label_file, f"{session_folder.name}_{stem}"))

    rng = random.Random(seed)
    rng.shuffle(samples)

    for split in ("train", "val"):
        (output_dir / "images" / split).mkdir(parents=True, exist_ok=True)
        (output_dir / "labels" / split).mkdir(parents=True, exist_ok=True)

    val_count = max(1, int(round(len(samples) * val_ratio))) if len(samples) >= 5 else 0
    val_samples = samples[:val_count]
    train_samples = samples[val_count:] if val_count else samples

    def copy_split(items: list[tuple[Path, Path, str]], split: str) -> int:
        for img_path, lbl_path, prefix in items:
            shutil.copy2(img_path, output_dir / "images" / split / f"{prefix}{img_path.suffix}")
            shutil.copy2(lbl_path, output_dir / "labels" / split / f"{prefix}.txt")
        return len(items)

    n_train = copy_split(train_samples, "train")
    n_val = copy_split(val_samples if val_samples else train_samples, "val")

    names_yaml = "\n".join(f"  {idx}: {name}" for idx, name in enumerate(FLAW_CLASSES))
    data_yaml = (
        f"path: {output_dir.resolve()}\n"
        "train: images/train\n"
        "val: images/val\n"
        "names:\n"
        f"{names_yaml}\n"
    )
    (output_dir / "data.yaml").write_text(data_yaml, encoding="utf-8")

    return {
        "sessionsDir": str(sessions_dir.resolve()),
        "outputDir": str(output_dir.resolve()),
        "totalLabeledImages": len(samples),
        "trainImages": n_train,
        "valImages": n_val,
        "dataYaml": str((output_dir / "data.yaml").resolve()),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Build YOLO11 dataset from TraceLock sessions.")
    parser.add_argument("--sessions", type=Path, default=default_sessions_dir())
    parser.add_argument("--out", type=Path, default=Path(__file__).resolve().parent / "dataset")
    parser.add_argument("--val-ratio", type=float, default=0.2)
    args = parser.parse_args()
    summary = build_yolo_dataset(args.sessions, args.out, val_ratio=args.val_ratio)
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
