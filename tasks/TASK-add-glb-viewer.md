# TASK-add-glb-viewer

**Status**: Pending
**Branch**: feat/add-glb-viewer
**Commit**: —

**Prerequisite**: TASK-restructure-directories must be complete (requires `js/` and `assets/models/`).

## Problem

The Spintel pillar on `index.html` describes text-to-scene generation but has no
interactive demonstration. A small set of selected Spintel GLB scene exports should be
viewable in-browser so visitors can explore the spatial output directly. No viewer
infrastructure exists yet.

## Fix

### 1. Prepare GLB assets

Place DRACO-compressed GLB files in `assets/models/`. Aim for 1–5 MB per file. Name
them descriptively in kebab-case (e.g. `office-scene.glb`, `apartment-living-room.glb`).
Compress with `gltf-pipeline` or Blender's DRACO export if files exceed ~5 MB.

Do not commit any GLB over 100 MB (git hard limit). If a scene is unavoidably large,
host it externally (Cloudflare R2) and reference by URL.

### 2. Create `spintel.html`

A standalone page at the repository root (consistent relative paths per the static
template). It should follow the same `<head>` conventions as `index.html` (charset,
viewport, fonts, favicon links, OG tags) and share `css/styles.css` for base styles.

Add a `<link rel="stylesheet" href="css/viewer.css">` for viewer-specific layout.

Basic page structure:

```html
<header class="nav"><!-- same nav as index.html --></header>
<main>
  <section class="viewer-hero">
    <p class="eyebrow">01 · SPINTEL</p>
    <h1>Scene viewer</h1>
    <p>Select a scene to explore a Spintel generation in 3D.</p>
  </section>
  <section class="viewer-shell">
    <div class="viewer-sidebar">
      <!-- Scene selector list -->
    </div>
    <div class="viewer-canvas">
      <canvas id="viewer-canvas"></canvas>
      <div class="viewer-instructions">Drag to orbit · Scroll to zoom · Right-drag to pan</div>
    </div>
  </section>
</main>
<footer><!-- same footer as index.html --></footer>
```

### 3. Create `js/viewer.js`

Vanilla JS ES module. Load Three.js and addons via the import map already declared in
`spintel.html`. No npm, no bundler.

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
```

DRACO decoder path (CDN): `https://www.gstatic.com/draco/versioned/decoders/1.5.6/`

Viewer behaviour:
- WebGL renderer, SRGB colour space, ACESFilmic tone mapping
- Perspective camera, FOV 45°, auto-rotate on load, stops on user interaction
- OrbitControls with damping enabled
- Ambient light + two directional lights (key and fill)
- On scene load: fit camera to bounding box, centre the model at origin
- Loading state: show a spinner or `loading…` text on the canvas overlay while fetch is in progress

Scene list: define a `const SCENES` array at the top of `viewer.js`:

```js
const SCENES = [
  { label: 'Office', path: 'assets/models/office-scene.glb' },
  { label: 'Apartment — living room', path: 'assets/models/apartment-living-room.glb' },
  // add scenes here
];
```

Sidebar renders this list as `<button>` elements. Clicking one calls `loadScene(path)`.

### 4. Import map in `spintel.html`

```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/"
  }
}
</script>
<script type="module" src="js/viewer.js"></script>
```

### 5. Link from `index.html`

Update the Spintel pillar CTA link in `index.html` to point to `spintel.html` instead
of (or in addition to) the existing external Spintel product link. A secondary
`View scenes →` link is sufficient.

### 6. Create `css/viewer.css`

Viewer-specific layout only. The canvas should fill available height (e.g.
`height: calc(100vh - var(--nav-height))`). Sidebar fixed width (~240px). Both sit in
a flex row. Styles should use the existing CSS custom properties from `css/styles.css`
— no new hard-coded colour values.

## Files

- `spintel.html` — new; scene viewer page
- `js/viewer.js` — new; Three.js GLB viewer module
- `css/viewer.css` — new; viewer layout styles
- `assets/models/*.glb` — new; DRACO-compressed scene files (one per selected scene)
- `index.html` — add `View scenes →` link in the Spintel pillar section

## Verification

- [ ] `python -m http.server 8000` → open `http://localhost:8000/spintel.html`
- [ ] Page loads without console errors
- [ ] Each scene button loads and renders its GLB in the canvas
- [ ] OrbitControls work (drag, scroll, right-drag)
- [ ] Auto-rotate stops on first user interaction
- [ ] Loading indicator visible while GLB is fetching
- [ ] Canvas is responsive at 375px, 768px, 1280px
- [ ] No GLB file in `assets/models/` exceeds 100 MB
- [ ] Nav and footer match `index.html` visually
