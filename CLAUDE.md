# Spatial Intelligence Site — Coding Agent Instructions

IMPORTANT: This is a no-build static site. Do not add npm, a package.json, node_modules, or any build step.

---

## Safety

Never read or commit `.env` files.

## What this project is

The public-facing marketing site for Spatial Intelligence Ltd., presenting the company's
three core products (Spintel, SCP, CORD) to customers, partners, and researchers.

## Stack

| Concern | Detail |
|---|---|
| Markup | Semantic HTML5 |
| Styling | Vanilla CSS with custom properties (`css/styles.css`) |
| Scripting | Vanilla JS ES modules (`js/main.js`) |
| 3D viewer | Three.js via CDN import map (no npm) |
| Fonts | Google Fonts: Syne, DM Sans, JetBrains Mono |
| Deployment | GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`) |

## Standards

Standards are in `standards/` (git submodule). Traverse to find relevant documents.

Key standards for this project:

- `standards/frontend/FRONTEND_STANDARDS.md` — template selection guide
- `standards/frontend/TEMPLATE-static_github_pages.md` — canonical conventions for this project
- `standards/design/DESIGN_SYSTEM-scp.html` — design tokens, components, and copy voice
- `standards/agents/AGENTS_STANDARDS.md` — agentic coding entry point
- `standards/agents/task_workflow.md` — mandatory before implementing anything
- `standards/agents/claude/claude.md` — how to write and maintain this file

## Architecture

| Path | Contents |
|---|---|
| `index.html` | Single-page site entry point |
| `spintel.html` | Spintel GLB scene viewer page |
| `css/styles.css` | All site styles |
| `js/main.js` | JS entry point — scroll animations, shared behaviour |
| `js/viewer.js` | Three.js GLB viewer for `spintel.html` |
| `assets/images/` | Raster and vector images |
| `assets/favicons/` | Favicon set (svg, ico, png variants) |
| `assets/models/` | GLB scene files (DRACO-compressed) |
| `markdowns/copy.md` | Structured text content reference |
| `tasks/` | Pending task files (see task workflow) |
| `tasks/complete/` | Completed task files |

## Pitfalls

- ES modules require a local server — `open index.html` fails; use `python -m http.server 8000`
- `standards/` is a git submodule — always clone with `--recurse-submodules`
- No build step — the repo is the deployable artifact; do not introduce npm or a bundler
- Three.js is loaded via CDN import map; do not bundle or install it locally
- GLB files must be DRACO-compressed to stay well under 100 MB (git file limit); aim for 1–5 MB per scene

## Git

Do not add Claude attribution lines to commit messages.
