# TASK-scp-terminal-mobile-overflow

**Status**: Pending
**Branch**: main
**Commit**: —

## Problem

On mobile viewports the page gains a horizontal scrollbar and dead space to the right. The root cause is that `css/styles.css` applies `padding: 0 48px` to `.container` and `.nav-inner` at all viewport widths. On a 375 px phone this consumes 96 px of horizontal space, leaving only 279 px for content. The SCP terminal contains long unbreakable monospace strings (e.g. `scp.actuate(zone="lecture_hall_01", target="lights", state="off")`) that exceed 279 px in the JetBrains Mono font, forcing the page wider than the viewport.

The companion `spatialcontextprotocol.github.io` site — which uses the same terminal component without overflow issues — reduces container padding to 24 px at ≤ 700 px.

## Fix

Two changes to `css/styles.css`:

1. Add a `@media (max-width: 700px)` block that reduces `.container` padding to `0 24px` and `.nav-inner` padding to `18px 24px`, and collapses `.footer-inner` to a single column. This matches the approach in the reference implementation and gives adequate content width on small screens.

2. Add `overflow-wrap: break-word` and `min-width: 0` to `.terminal-text` as a safety net so that any long monospace token that still reaches a terminal boundary wraps rather than overflowing.

## Files

- `css/styles.css` — add `@media (max-width: 700px)` responsive block; add `overflow-wrap: break-word` and `min-width: 0` to `.terminal-text`

## Verification

- [ ] On a viewport of 375 px wide (iPhone SE), no horizontal scrollbar appears anywhere on the page
- [ ] No dead space appears to the right of the page on narrow viewports
- [ ] The SCP terminal text wraps within the terminal box on small screens
- [ ] Desktop layout (≥ 900 px) is visually unchanged
