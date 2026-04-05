# Camera Permission Guidance Design

## Goal

Reduce confusion around camera access in Add Food flows by letting the browser ask for camera access first, then showing inline recovery guidance only after denial, plus a Settings entry that points users back to the relevant browser/system controls.

## Current Context

- Barcode scanning uses [`scan.js`](/Users/dongperry/code/Freshness-Above-All/scan.js) and calls `navigator.mediaDevices.getUserMedia(...)`.
- Photo capture in Add Food currently uses a hidden file input with `capture="environment"` from [`add.js`](/Users/dongperry/code/Freshness-Above-All/add.js), which opens the system camera or picker instead of a custom web camera stream.
- The current UI only surfaces raw status text after scanner startup and has a generic support article for denied camera permissions in [`SUPPORT.md`](/Users/dongperry/code/Freshness-Above-All/SUPPORT.md).

## Approved Approach

### 1. Ask through the browser first

When the user taps `Scan Barcode`, the app should switch into the scan UI and immediately call `getUserMedia` so the browser shows its native camera permission prompt.

- If the user allows access, the scanner starts immediately.
- If the user denies access, the app stays in the barcode panel and shows recovery guidance.

When the user taps `Take Picture`, the app should immediately open the system camera/photo input without a custom pre-permission sheet.

### 2. Inline recovery guidance after denial

If barcode scanning fails because camera access is blocked, the scan panel will show a recovery card in-place with:

- a short “camera access is blocked” message
- concrete next steps to reopen browser/site permissions
- a note that manual barcode entry still works

For photo capture, because the browser file input does not reliably expose a denial error distinct from cancel, the photo capture sheet will include a persistent helper note that explains what to do if the camera does not open.

### 3. Settings helper

The Settings page will get a small `Camera Access Help` entry under support/help content. It will not be the primary recovery path, but it gives users a stable place to find the same instructions later.

## Interaction Rules

- Barcode denial detection is based on scanner startup failure messages and/or permission-denied error names from `getUserMedia`.
- The design should not introduce a new permanent settings toggle for camera permissions; browsers and OS settings remain the source of truth.

## Files Affected

- [`ui.js`](/Users/dongperry/code/Freshness-Above-All/ui.js)
  - direct scan/photo entry handling
  - click handling
  - scanner denial handling
- [`add.js`](/Users/dongperry/code/Freshness-Above-All/add.js)
  - inline denial/recovery messaging in scan/photo UI
- [`setting.js`](/Users/dongperry/code/Freshness-Above-All/setting.js)
  - support entry for camera access help
- [`SUPPORT.md`](/Users/dongperry/code/Freshness-Above-All/SUPPORT.md)
  - keep existing support article aligned with in-app wording

## Testing Expectations

- Tapping `Scan Barcode` immediately triggers the browser permission request.
- Allowing access starts the scanner without another custom confirmation step.
- Denying access shows recovery help in the barcode panel.
- Tapping `Take Picture` immediately opens the system camera/picker.
- Denying scanner permission shows recovery help in the scan panel.
- Settings page includes a camera-help entry that points to the same recovery guidance.
