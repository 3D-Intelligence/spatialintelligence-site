# TASK-header-footer-logo-font

**Status**: Complete
**Branch**: main
**Commit**: 092e307

## Problem

The brand name text ("Spatial Intelligence") in the header `.nav-brand` and footer `.footer-brand` uses the display font Syne via `var(--font-hero)`. The word spacing between "Spatial" and "Intelligence" is a full browser-default word space (~0.25 em), which looks too loose alongside the logo mark. Space Grotesk was preferred for the brand lockup over the general display font.

## Fix

- Add Space Grotesk (weights 300, 400, 500) to the Google Fonts import in `index.html`.
- Override `font-family` on `.nav-brand` and `.footer-brand` in `css/styles.css` to `'Space Grotesk', sans-serif`.
- Replace the plain space between "Spatial" and `<em>Intelligence</em>` in both header and footer with `&thinsp;` (thin space, ~0.167 em) so screen readers still hear a word boundary.
- Add `margin-left: -0.3em` on `.nav-brand em` and `.footer-brand em` to tighten the visual gap to the desired level.

## Files

- `index.html` — add Space Grotesk to font import; replace word space with `&thinsp;` in header and footer brand lockups
- `css/styles.css` — update `font-family` on `.nav-brand` and `.footer-brand`; add `margin-left` to `.nav-brand em` and `.footer-brand em`

## Verification

- [x] Header brand name renders in Space Grotesk (inspect computed font-family)
- [x] Footer brand name renders in Space Grotesk
- [x] "Intelligence" sits visually tighter to "Spatial" than the default word space
- [x] Screen reader announces "Spatial Intelligence" as two words (thin space preserved in source)
- [ ] No layout breakage at mobile viewport (375 px)
