# TASK-update-logo-svg

**Status**: Complete
**Branch**: main
**Commit**: 7510978

## Problem

The header (`<header class="nav">`) and footer (`<footer class="footer">`) in `index.html` both render the Spatial Intelligence logo as inline SVG — a hand-coded bracket mark with an "SI" text node. The brand asset `assets/images/Spatial Intelligence - logo blur, light.svg` exists but is not used anywhere on the site.

## Fix

Replace both inline SVG logo marks in `index.html` with an `<img>` element pointing to the brand SVG asset. Preserve the surrounding anchor/brand text structure and existing CSS classes so layout and styles are unaffected.

- Header: replace the `<svg class="nav-brand-mark" …>…</svg>` with `<img class="nav-brand-mark" src="assets/images/Spatial Intelligence - logo blur, light.svg" alt="Spatial Intelligence logo">`.
- Footer: replace the `<svg width="28" …>…</svg>` inside `.footer-brand` with `<img class="footer-brand-mark" src="assets/images/Spatial Intelligence - logo blur, light.svg" alt="Spatial Intelligence logo">`.

Add a CSS rule for `.footer-brand-mark` that matches the existing footer SVG dimensions (`width: 28px; height: 24px`) so the layout does not shift.

## Files

- `index.html` — swap inline SVGs for `<img>` elements in nav and footer
- `css/styles.css` — add `.footer-brand-mark` sizing rule

## Verification

- [ ] Open the site with `python -m http.server 8000` and confirm the logo image renders in the header
- [ ] Confirm the logo image renders in the footer
- [ ] Confirm no layout shift — nav and footer dimensions are visually unchanged
- [ ] Confirm the SVG file loads without a 404 in the browser network panel
