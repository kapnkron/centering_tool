# TraceLock Inspection Instrument Design QA

## Comparison target

- Source visual truth: `/home/morgan/.codex/generated_images/01a085e5-31f7-7922-ab8c-b8393413f77c/exec-73db011c-37b4-4074-9126-ada4362a62f5.png`
- Implementation screenshot: `/home/morgan/Documents/Codex/2026-09-09/ok-x20/work/card-audit/22-tracelock-image-first-final.png`
- Combined comparison: `/home/morgan/Documents/Codex/2026-09-09/ok-x20/work/card-audit/design-qa-comparison-final.png`
- Browser viewport: 1280 x 720 CSS pixels at device scale factor 1
- Source pixels: 1488 x 1058
- Implementation pixels: 1280 x 720
- Density normalization: the full source was proportionally fitted inside a 1280 x 720 frame without distortion, then placed beside the 1280 x 720 implementation capture.
- State: Surface inspection active, microscope-style image loaded, instrument drawer collapsed, calibrated scale visible, and paired original plus annotated evidence captured.

## Full-view comparison evidence

The source and implementation were inspected together in the combined comparison. Both use the same image-first structure: compact identity header, horizontal inspection rail, dominant microscope viewport, translucent measurement ribbon, one primary evidence action, and a low evidence timeline. The implementation preserves the source hierarchy at the shorter production viewport without page overflow.

## Focused comparison evidence

The header, microscope viewport, measurement ribbon, and evidence timeline are all large enough to judge in the original-resolution combined image, so separate enlarged crops were not required. The implementation intentionally omits the generated logo symbol because TraceLock does not yet have a logo; the plain text wordmark is a replaceable brand slot.

## Required fidelity surfaces

- Fonts and typography: the system sans-serif stack closely matches the clean instrument typography. Weight, tracking, uppercase labels, and truncation remain readable at 1280 x 720.
- Spacing and layout rhythm: the feed owns the screen by default, controls are collapsed, the measurement ribbon aligns across the lower feed, and the evidence rail remains visible without page scrolling.
- Colors and visual tokens: graphite surfaces, pale text, restrained cyan state color, fine dividers, and translucent overlays match the selected direction without gamer-style effects.
- Image quality and asset fidelity: inspection imagery is rendered through the real application canvas at source resolution. No fabricated logo or placeholder illustration is used. Real card and microscope imagery will come from the user's camera or image source.
- Copy and content: language consistently describes inspection, evidence, calibration, illumination, and provenance. No grading score or AI-grade framing is introduced.

## Comparison history

### Pass 1

- P1: the initial shell extended below the 720-pixel viewport, clipping the measurement ribbon and evidence rail.
- Fix: constrained the desktop shell to the viewport and allowed only the instrument drawer and microscope canvas to scroll internally.
- Post-fix evidence: `15-tracelock-empty-fixed.png` shows the complete shell within 1280 x 720.

### Pass 2

- P2: the permanently open control drawer reduced the microscope image and drifted from the selected image-first concept.
- Fix: made the drawer collapsed by default, removed its hidden-layout overflow, and changed initial image fitting to prioritize viewport width.
- Post-fix evidence: `22-tracelock-image-first-final.png` shows the feed dominating the screen, with no document-level overflow.

### Pass 3

- No actionable P0, P1, or P2 differences remain. The remaining differences are intentional product constraints: the real app has a text wordmark because no logo exists, and full functionality lives in a collapsible drawer rather than being removed.

## Primary interactions tested

- Local image upload and automatic centering analysis
- Seven-stage inspection rail and four control groups
- Instrument drawer open and close behavior
- Magnification, region, and illumination readouts
- Millimeter-per-pixel calibration and on-canvas scale rendering
- Normal versus analysis comparison split and divider
- Paired original and annotated evidence capture
- Evidence markup modal within the viewport
- Self-contained HTML report generation
- Presentation Mode enter and exit behavior
- Existing WebM presentation-video render and download
- Browser runtime log check: zero console entries in the final preview

## Follow-up polish

- P3: replace the text wordmark slot when the final TraceLock identity is created.
- P3: verify camera-specific labels and illumination presets against the final microscope and lighting hardware.

final result: passed
