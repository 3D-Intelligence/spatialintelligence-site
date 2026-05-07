# TASK-extract-js

**Status**: Complete
**Branch**: main
**Commit**: f52fe0f

**Prerequisite**: TASK-restructure-directories must be complete (requires `js/` directory).

## Problem

All JavaScript is embedded in a `<script>` block at the bottom of `index.html`. This
violates `standards/frontend/TEMPLATE-static_github_pages.md`, which requires JS in
`js/main.js` loaded via `<script type="module" src="js/main.js">`. The embedded script
also lacks null guards on DOM queries — if a selector returns `null`, the
IntersectionObserver setup will throw.

## Fix

1. Extract the entire contents of the `<script>...</script>` block at the bottom of
   `index.html` into `js/main.js`.
2. Add null guards to all `document.querySelectorAll` and `document.querySelector`
   calls before passing results to `IntersectionObserver`. Pattern:
   ```js
   const targets = document.querySelectorAll('.pillar, .hero-meta, .closing-title, .closing-body');
   if (!targets.length) return;
   ```
3. Remove the `<script>` block from `index.html` and replace with:
   ```html
   <script type="module" src="js/main.js"></script>
   ```
   Place this at the bottom of `<body>`, as the last element before `</body>`.

Do not change any logic — copy exactly as-is, then add null guards only.

## Files

- `js/main.js` — new file; extracted JS with null guards added
- `index.html` — remove `<script>` block; add `<script type="module" src="js/main.js">`

## Verification

- [ ] `js/main.js` exists and is non-empty
- [ ] No `<script>` block (other than the new module tag) remains in `index.html`
- [ ] Site served via `python -m http.server 8000` — scroll-triggered reveal animations work
- [ ] No console errors on page load
- [ ] `js/main.js` has no `console.log` statements
