# Freshness Above All!

"Freshness Above All!" is a local-first food expiration tracker prototype for managing household food inventory, monitoring expiry dates, and reducing food waste.

The app includes a dashboard, an all-food inventory view, add/edit flows, a trash system with restore support, settings persistence, and food detail sheets. Data is stored locally in JSON files, so it works well as a lightweight prototype without a database.

## Current Features

- Dashboard with expiration summary cards and recent items
- All Food inventory page with search, filter chips, sorting, batch selection, and cleanup
- Add Food flow with quick category selection, barcode scan entry, and optional size/icon fields
- Edit Food flow with current settings highlighted
- Food detail bottom sheet from the All Food page
- Cleanup flow with deletion reason and optional notes
- Trash page with restore support and deleted-item detail view
- Settings page with reminder strategy, theme, and trash retention controls
- Barcode lookup via Open Food Facts for unknown products
- Settings persistence via `setting.json`
- Local data persistence via `food.json`, `trash.json`, and `setting.json`

## Tech Stack

- Vanilla JavaScript
- Tailwind CSS via CDN
- Node.js built-in `http` server
- Local JSON file storage

## How to Run

1. Install dependencies:

```bash
npm install
```

2. Start the local server:

```bash
npm start
```

3. Open the app in your browser:

```text
http://localhost:3000
```

## Camera Access For Barcode Scan

Barcode scanning only works when the app is opened through the local server in a browser.

1. Start the local server:

```bash
npm start
```

2. Open the app at:

```text
http://localhost:3000
```

3. Open `Add Food`
4. Choose `Scan Barcode`
5. Click `Start Scan`
6. When the browser asks for camera access, choose `Allow`

### Important Notes

- Do not open the app with `file://.../index.html` if you want camera access
- Your browser must support `getUserMedia` and `BarcodeDetector`
- Your computer must be online if you want scanned barcodes to query Open Food Facts

### macOS Permission Check

If the camera does not open, check:

- Browser permission:
  - Chrome / Edge: click the camera icon in the address bar and allow camera access
  - Safari: `Safari -> Settings for This Website -> Camera -> Allow`
- System permission:
  - `System Settings -> Privacy & Security -> Camera`
  - Make sure your browser is allowed to use the camera

### What To Expect

- If camera permission is granted, the scan panel will start the camera preview
- If a barcode is detected, the app stores the barcode and tries to auto-fill food info
- If the barcode already exists in your local data, the app reuses the existing item details
- If the barcode is new, the app queries Open Food Facts
- If Open Food Facts has no result, the barcode is still kept and you can complete the rest manually

## Project Structure

- [`index.html`](/Users/dongperry/code/Freshness-Above-All/index.html): app shell, global styles, script loading
- [`ui.js`](/Users/dongperry/code/Freshness-Above-All/ui.js): main app state, view switching, event handling
- [`uiData.js`](/Users/dongperry/code/Freshness-Above-All/uiData.js): request helpers, food/date utilities
- [`add.js`](/Users/dongperry/code/Freshness-Above-All/add.js): add/edit food UI helpers
- [`scan.js`](/Users/dongperry/code/Freshness-Above-All/scan.js): barcode scan controller
- [`setting.js`](/Users/dongperry/code/Freshness-Above-All/setting.js): settings UI and settings helpers
- [`trash.js`](/Users/dongperry/code/Freshness-Above-All/trash.js): trash UI, cleanup flow, trash detail helpers
- [`server.js`](/Users/dongperry/code/Freshness-Above-All/server.js): local API, Open Food Facts lookup, and static file server
- [`food.json`](/Users/dongperry/code/Freshness-Above-All/food.json): active food inventory
- [`trash.json`](/Users/dongperry/code/Freshness-Above-All/trash.json): deleted items waiting for permanent removal
- [`setting.json`](/Users/dongperry/code/Freshness-Above-All/setting.json): persisted app settings

## Data Persistence

"Freshness Above All!" currently uses local JSON files instead of a database.

- Active inventory is stored in `food.json`
- Trash / recycle-bin data is stored in `trash.json`
- App settings are stored in `setting.json`

This means the project is currently best treated as a single-user local prototype.

## Interaction Highlights

- Delete an item -> choose a cleanup reason -> move it to Trash
- Restore an item from Trash back into the main inventory
- Open food details by clicking the item icon or title in All Food
- Save settings permanently through `setting.json`
- Use batch cleanup from the All Food inventory page

## Known Limitations

- No user authentication
- No cloud sync or shared storage
- No database
- No real image upload pipeline yet
- Calendar / notification behavior is still mostly UI-level
- Sound effects are planned but not implemented yet
- Barcode scanning depends on browser support for `BarcodeDetector`
- Open Food Facts lookup depends on network availability and third-party data coverage

## Planned Improvements

- Sound effects for add, delete, and detail interactions
- Richer food metadata and storage locations
- More complete trash batch actions
- Better filtering and inventory analytics
- Improved mobile polish and animation
