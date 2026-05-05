# Card Centering Tool

A browser-based measuring tool for sports cards and trading cards. Upload a scan or straight-on photo, align the outer card guide and inner printed-area guide, then read left/right and top/bottom centering ratios.

## Use

Open `index.html` in a browser. No build step is required.

## Features

- Image upload for card scans or photos
- Four-corner perspective correction for angled photos
- Auto-detected card and printed-area guides
- Draggable guide corners for manual correction
- Pixel measurements for all four borders
- Left/right and top/bottom centering ratios
- Scrollable visual zoom up to 1200% without changing measurement coordinates
- Live USB microscope inspection with contrast, edge, relief, and invert filters
- Copyable measurement report

For best results, use a flat scan or a straight-on photo with the full card visible against a contrasting background.

## Angled Photos

Use **Set Corners** when the photo is not perfectly straight on. Drag the TL, TR, BR, and BL handles to the physical card corners, then choose **Flatten Card**. After the card is flattened, adjust the printed-area guide for the border measurement.

The green guide should sit on the physical card edge. The red guide should sit on the transition where the border ends and the printed/design area begins. The border width is the distance between those two edge lines.

## Microscope Inspection

Use **Start Camera** to open a USB microscope that appears as a camera. Move the card slowly under the lens and use angled light to reveal surface issues. Try **Scratch edges** for fine lines, **Relief / divots** for shallow dents, and **Invert highlights** for reflective scratches. Use **Freeze** when something appears, then **Snapshot** to save a downloadable inspection image.

Camera access usually requires opening the tool from `localhost` or HTTPS rather than directly from the file system.
