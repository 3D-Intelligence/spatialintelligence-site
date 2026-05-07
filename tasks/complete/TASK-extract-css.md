# TASK-extract-css

**Status**: Complete
**Branch**: main
**Commit**: 9442e3d

**Prerequisite**: TASK-restructure-directories must be complete (requires `css/` directory).

## Problem

All CSS is embedded in a `<style>` block inside `index.html`. This violates
`standards/frontend/TEMPLATE-static_github_pages.md`, which requires styles in
`css/styles.css` linked via `<link rel="stylesheet">`. The embedded block spans
roughly 600+ lines and mixes reset, custom properties, layout, components, utilities,
animations, and responsive rules without section headers.

## Fix

1. Extract the entire contents of the `<style>...</style>` block in `index.html` into
   `css/styles.css`.
2. Organise the CSS into labelled sections matching the standard order:
   ```
   /* ── Reset ─────────────────────────────────────── */
   /* ── Custom properties ─────────────────────────── */
   /* ── Typography ────────────────────────────────── */
   /* ── Layout ────────────────────────────────────── */
   /* ── Navigation ────────────────────────────────── */
   /* ── Components ────────────────────────────────── */
   /* ── Utilities ─────────────────────────────────── */
   /* ── Animations ────────────────────────────────── */
   /* ── Responsive ────────────────────────────────── */
   ```
3. Remove the `<style>` block from `index.html` and replace with:
   ```html
   <link rel="stylesheet" href="css/styles.css">
   ```
   Place this `<link>` after the Google Fonts `<link>` tags in `<head>`.

Do not make any visual changes to the CSS rules — copy exactly as-is, then add section
headers only.

## Files

- `css/styles.css` — new file; extracted CSS with section headers added
- `index.html` — remove `<style>` block; add `<link rel="stylesheet" href="css/styles.css">`

## Verification

- [ ] `css/styles.css` exists and is non-empty
- [ ] No `<style>` block remains in `index.html`
- [ ] Site served via `python -m http.server 8000` is visually identical to before
- [ ] All sections (hero, pillars, closing, footer) render correctly at 375px, 768px, 1280px
- [ ] Dark background and OKLch colour tokens are applied (no unstyled flash)
