# Card Centering Tool

A browser-based measuring tool for sports cards and trading cards. Upload a scan or straight-on photo, align the outer card guide and inner printed-area guide, then read left/right and top/bottom centering ratios.

## Use

Open `index.html` in a browser. No build step is required.

## Guided inspection

The guide starts with V-centering. Select Front or Back, open a straight-on full-card photo, align the guides, and save that side. Open a new photo before saving the other side. Choose Next to move through microscope checks for Surface, Corners, Edges, Print, UV, and Security, then review the Report. The Back and Next buttons keep your place, and a saved inspection checkpoint restores the active step. Only V-centering calls for a full-card photo; the later checks use the microscope.

Captured evidence is filed under the active workflow step in both the Evidence panel and exported report. Each item has a Workflow step selector for corrections. Evidence from older checkpoints without a known step appears under Unsorted so it can be assigned without losing the image.

## Features

- Image upload for card scans or photos
- Four-corner perspective correction for angled photos
- Auto-detected card and printed-area guides
- Draggable guide corners for manual correction
- Pixel measurements for all four borders
- Left/right and top/bottom centering ratios
- Scrollable visual zoom up to 1200% without changing measurement coordinates
- Live USB microscope inspection with contrast, edge, relief, and invert filters
- Top-panel controls for zoom, edge sensitivity, and filter strength
- Webcam capture for centering snapshots
- Promo video generator for stitching inspection images into short WebM videos
- Copyable measurement report

For best results, use a flat scan or a straight-on photo with the full card visible against a contrasting background.

## Angled Photos

Use **Set Corners** when the photo is not perfectly straight on. Drag the TL, TR, BR, and BL handles to the physical card corners, then choose **Flatten Card**. After the card is flattened, adjust the printed-area guide for the border measurement.

The green guide should sit on the physical card edge. The red guide should sit on the transition where the border ends and the printed/design area begins. The border width is the distance between those two edge lines.

## Measurement Calibration

Set the microscope height and focus first. In the Measure panel, enter the real distance of a visible ruler or calibration reference in millimetres, choose **Draw Reference Line**, and drag across that distance in the canvas. Choose **Apply Calibration** to calculate the scale automatically. The yellow reference line then disappears, and the white scale bar shows a clean distance such as 1 mm with a matching length. Calibration uses the current camera position and is reset when a new source image or camera capture is loaded.

## Microscope Inspection

Use **Start Camera** to open a USB microscope that appears as a camera. Move the card slowly under the lens and use angled light to reveal surface issues. Try **Scratch edges** for fine lines, **Relief / divots** for shallow dents, and **Invert highlights** for reflective scratches. Use **Freeze** when something appears, then **Snapshot** to save a downloadable inspection image.

Camera access usually requires opening the tool from `localhost` or HTTPS rather than directly from the file system.

Use **Camera quality** to request a higher-resolution stream when the webcam supports it. **Default** is safest for older webcams, while **Best available** asks the browser for up to 1080p. The live status shows the actual resolution the camera provides.

## Webcam Centering Capture

Use **Start Camera** with any webcam or USB camera, position the full card in view, then choose **Capture for Centering**. The tool grabs an unfiltered frame and switches back to the normal centering workflow. Use **Set Corners** afterward if the captured frame is angled.

## Inspection Reports

Use **Snapshot** during microscope inspection to save a surface image and optionally add an annotation to the report. Use **Add Card Images to Report** to attach the original card image, the flattened card image when available, and the current overlay view. Use **Export HTML Report** to create a self-contained report with measurements, notes, annotations, and embedded images.

Use **Add Front Centering** and **Add Back Centering** to store separate centering measurements and evidence for each side of the card. Evidence items can be marked with colored flaw callouts or removed from the report before export.

Report exports automatically resize and compress embedded image copies as JPEGs, progressively reducing their size until the self-contained HTML is below a 23.5 MB target. This leaves room under GitHub's 25 MB file limit without changing the full-quality images used inside the tool.

Use **Save inspection** to write a resumable JSON checkpoint. **Resume inspection** restores the embedded images, card metadata, measurements, calibration, evidence, annotations, notes, and output images inside the application. Run the dependency-free smoke checks with `node tests/smoke-test.mjs`.

## Promo Video Generator

Use **Add Promo Images** to load inspection snapshots, or **Add Current View** to use the current canvas. Set the title, subtitle, call to action, format, and seconds per image, then choose **Generate Promo Video**. The browser exports a downloadable `.webm` video suitable for short social promos.
