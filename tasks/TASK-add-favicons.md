# TASK-add-favicons

**Status**: Pending
**Branch**: feat/add-favicons
**Commit**: —

**Prerequisite**: TASK-restructure-directories must be complete (requires `assets/favicons/` directory).

## Problem

`index.html` has no favicon `<link>` tags and `assets/favicons/` contains no favicon
files. Browsers show a blank tab icon; iOS home screen saves show a generic icon.
The standard requires `favicon.svg`, `favicon.ico`, `favicon-32x32.png`, and
`apple-touch-icon.png`.

## Fix

1. Source or generate the favicon set from the Spatial Intelligence brand mark. The
   recommended approach is to start from an SVG (company logomark or monogram) and
   export the required variants. Tools: Figma export, Inkscape, or an online favicon
   generator such as realfavicongenerator.net.

2. Place files at:
   ```
   assets/favicons/favicon.svg
   assets/favicons/favicon.ico
   assets/favicons/favicon-32x32.png
   assets/favicons/apple-touch-icon.png   (180×180px)
   ```

3. Add the following `<link>` tags to the `<head>` of `index.html`, after the `<title>`:
   ```html
   <link rel="icon" type="image/svg+xml" href="assets/favicons/favicon.svg">
   <link rel="icon" type="image/png" sizes="32x32" href="assets/favicons/favicon-32x32.png">
   <link rel="shortcut icon" href="assets/favicons/favicon.ico">
   <link rel="apple-touch-icon" sizes="180x180" href="assets/favicons/apple-touch-icon.png">
   ```

## Files

- `assets/favicons/favicon.svg` — new; SVG favicon
- `assets/favicons/favicon.ico` — new; legacy ICO (16×16 + 32×32 embedded)
- `assets/favicons/favicon-32x32.png` — new; 32×32px PNG
- `assets/favicons/apple-touch-icon.png` — new; 180×180px PNG
- `index.html` — add four `<link>` favicon tags to `<head>`

## Verification

- [ ] All four favicon files present in `assets/favicons/`
- [ ] All four `<link>` tags present in `index.html`
- [ ] Browser tab shows the favicon when served via `python -m http.server 8000`
- [ ] No 404s for favicon requests in the browser network tab
