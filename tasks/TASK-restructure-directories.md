# TASK-restructure-directories

**Status**: Pending
**Branch**: feat/restructure-directories
**Commit**: —

## Problem

The repository does not follow the directory structure required by
`standards/frontend/TEMPLATE-static_github_pages.md`. All CSS and JavaScript are
embedded directly in `index.html`. There are no `css/`, `js/`, `assets/images/`,
`assets/favicons/`, or `assets/models/` directories. The single existing asset
(`assets/top_down.png`) is already in `assets/` but the full directory tree is absent.

This restructure is a prerequisite for TASK-extract-css, TASK-extract-js,
TASK-add-favicons, and TASK-add-glb-viewer.

## Fix

Create the following directories (add a `.gitkeep` to empty ones so they are tracked):

```
css/
js/
assets/images/
assets/favicons/
assets/models/
docs/
```

Move `assets/top_down.png` → `assets/images/top_down.png` and update the `<img>` src
in `index.html` accordingly (search for `top_down.png`).

Do not extract CSS or JS in this task — that is handled by TASK-extract-css and
TASK-extract-js. This task only creates the directory skeleton and moves the existing
image.

## Files

- `css/.gitkeep` — new; empty placeholder
- `js/.gitkeep` — new; empty placeholder
- `assets/images/top_down.png` — moved from `assets/top_down.png`
- `assets/images/.gitkeep` — new; placeholder (remove once images are present)
- `assets/favicons/.gitkeep` — new; empty placeholder
- `assets/models/.gitkeep` — new; empty placeholder
- `docs/.gitkeep` — new; empty placeholder
- `index.html` — update `src="assets/top_down.png"` → `src="assets/images/top_down.png"`

## Verification

- [ ] `ls css/ js/ assets/images/ assets/favicons/ assets/models/ docs/` — all directories exist
- [ ] `assets/top_down.png` no longer exists at the old path
- [ ] Site served via `python -m http.server 8000` shows the top-down building image correctly
- [ ] No other references to `assets/top_down.png` remain (search with grep)
