# TASK-glb-viewer-optimisations

**Status**: Complete
**Branch**: main
**Commit**: c84e12c

## Problem

`js/viewer.js` is missing four optimisations required by `standards/frontend/TEMPLATE-static_github_pages.md` (§ 3D GLB Viewer):

1. **OrbitControls blocks page scroll.** `controls.enableZoom` is never disabled on init, so OrbitControls registers a `{ passive: false }` wheel listener that calls `event.preventDefault()` immediately. Any `wheel` event over the canvas prevents the page from scrolling — breaking scroll-driven effects elsewhere on the page.

2. **No deferred initialisation.** `init()` runs on module load regardless of whether the canvas is in the viewport. WebGL context creation, shader compilation, and the GLB fetch all fire on page load, competing with CSS transitions running at the same time.

3. **Render loop never pauses.** The `animate()` `requestAnimationFrame` loop runs at ~60 FPS indefinitely — even when the canvas is scrolled off-screen or the browser tab is hidden. This consumes GPU bandwidth and causes scroll jank.

4. **Missing `will-change: contents` on canvas.** `css/styles.css` styles `.figure--viewer canvas` but does not include `will-change: contents`, so the browser does not keep the canvas on its own compositor layer. WebGL repaints can invalidate adjacent CSS transition layers.

## Fix

### `js/viewer.js`

- Wrap the entire setup in an `IntersectionObserver` (threshold 0.1). Only call `startViewer(canvas)` when the canvas enters the viewport for the first time; disconnect immediately after.
- Inside `startViewer`, set `controls.enableZoom = false` on init. On the first `pointerdown` event on the renderer's DOM element, set `controls.enableZoom = true` (use `{ once: true }`). The existing `onInteract` handler already fires on `pointerdown` — extend it rather than adding a second listener.
- Replace the bare `animate()` call with a start/stop loop pattern:
  - `animHandle` variable, `startLoop()` / `stopLoop()` helpers.
  - A second `IntersectionObserver` (threshold 0.05) on the canvas: call `startLoop()` when intersecting, `stopLoop()` when not.
  - A `document.addEventListener('visibilitychange', ...)` listener: `stopLoop()` when `document.hidden`, `startLoop()` otherwise.
  - Call `startLoop()` once after setup to begin the initial render.

### `css/styles.css`

- Add `will-change: contents;` to the `.figure--viewer canvas` rule.

## Files

- `js/viewer.js` — deferred init, zoom gate, pauseable render loop
- `css/styles.css` — `will-change: contents` on canvas

## Verification

- [ ] `js/viewer.js`: `controls.enableZoom` is set to `false` before any interaction
- [ ] `js/viewer.js`: `controls.enableZoom` is set to `true` inside the first-`pointerdown` handler
- [ ] `js/viewer.js`: `init()` wraps setup in an `IntersectionObserver` that disconnects after first intersection
- [ ] `js/viewer.js`: a `startLoop` / `stopLoop` pattern replaces the bare `animate()` call
- [ ] `js/viewer.js`: a second `IntersectionObserver` (threshold 0.05) starts and stops the loop on canvas visibility
- [ ] `js/viewer.js`: a `visibilitychange` listener pauses and resumes the loop
- [ ] `css/styles.css`: `.figure--viewer canvas` includes `will-change: contents`
- [ ] Visual check: viewer still loads and displays the 3D scene on `spintel.html` (serve with `python -m http.server 8000`)
- [ ] Visual check: page scrolls normally when the cursor is over the canvas before any interaction
