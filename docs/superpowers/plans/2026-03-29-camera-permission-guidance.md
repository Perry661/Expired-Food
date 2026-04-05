# Camera Permission Guidance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trigger the browser's native camera permission prompt directly for scanning, then show denial recovery guidance in-app when access is blocked.

**Architecture:** Keep camera prompting native to the browser by entering scan/photo flows directly, then surface blocked-permission guidance inside the existing add-food surfaces and in Settings.

**Tech Stack:** Plain browser JavaScript, existing modular render helpers in `ui.js`, `add.js`, and `setting.js`

---

### Task 1: Simplify entry flow to native permission prompts

**Files:**
- Modify: `ui.js`

- [ ] **Step 1: Remove the custom pre-permission sheet state**

- [ ] **Step 2: Route `Scan Barcode` directly into scan mode and start the scanner immediately**

- [ ] **Step 3: Route `Take Picture` directly into the existing file-input flow**

### Task 2: Keep only inline recovery help

**Files:**
- Modify: `add.js`
- Modify: `ui.js`

- [ ] **Step 1: Render a barcode recovery card when camera permission is blocked**

- [ ] **Step 2: Render a compact helper note in the photo capture sheet for reopening camera access**

### Task 3: Improve scanner permission failure handling

**Files:**
- Modify: `scan.js`
- Modify: `ui.js`

- [ ] **Step 1: Preserve a useful failure signal from `getUserMedia` startup errors**

- [ ] **Step 2: Translate permission-denied failures into user-facing recovery state in the barcode panel**

- [ ] **Step 3: Keep manual barcode entry available as the immediate fallback**

### Task 4: Add Settings help entry and align documentation

**Files:**
- Modify: `setting.js`
- Modify: `SUPPORT.md`

- [ ] **Step 1: Add a small `Camera Access Help` entry under support**

- [ ] **Step 2: Reuse the same plain-language recovery wording as the in-app helper**

- [ ] **Step 3: Update support docs if needed so in-app text and help center stay consistent**

### Task 5: Verify and sync public assets

**Files:**
- Modify: `public/add.js`
- Modify: `public/setting.js`
- Modify: `public/ui.js`
- Modify: `public/scan.js`

- [ ] **Step 1: Run syntax checks for touched JS files**

- [ ] **Step 2: Run `npm run sync:public`**

- [ ] **Step 3: Re-run syntax checks or diff review on synced public assets**
