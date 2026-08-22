MACHINE TRACK — FINAL GITHUB PAGES BUILD

Upload/replace these files at the ROOT of your existing GitHub Pages repository:
- index.html
- manifest.webmanifest
- sw.js
- icons/icon.svg

Then commit the changes. GitHub Pages keeps the same URL. Open the site once in Chrome so the new service worker is installed; closing/reopening the installed PWA will pick up the new version. Your app code and locally stored production data are separate.

FEATURES
- 8 machines: Machines 1–2 Haas, 3–8 Hurco
- Haas: Cycle/Machine Time and Feed Time stored separately; Feed is never added to Cycle
- Hurco: Machine Time
- Protected baseline per machine, reset requires RESET
- Test/Production mode separation
- Live in-app Android Chrome camera (HTTPS required)
- OCR fills fields, then operator verifies and taps Save
- OCR label matching for Machine Time/Cycle Time/Feed Time and common Hurco variants
- Photos stored with readings as audit trail
- Time History
- Graph page
- Anomaly warnings
- Time-frame filters
- Generate Report
- CSV / Excel-compatible export / Print-to-PDF
- Coworker export/import
- Backups

OCR
This build uses Tesseract.js from jsDelivr for OCR. The first OCR use requires network access to load the OCR runtime/language data. The service worker caches fetched resources where the browser permits, so later use may work offline. This is not a cloud OCR service: recognition happens in the browser on the phone. Always verify detected values before Save.

TIME FORMATS
If the control displays a value like 1234:30, Machine Track interprets it as 1234 hours 30 minutes = 1234.5 hours. Decimal values are preserved as decimals.

PATCH v2: Haas feed OCR now recognizes FEED CUTTING TIME, FEED CUT TIME, FEED CUTTING, FEED CUT, FEED TIME, and FEED TIMER.
