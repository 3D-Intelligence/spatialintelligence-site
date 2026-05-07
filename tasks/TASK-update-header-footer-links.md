# TASK-update-header-footer-links

**Status**: Pending
**Branch**: main
**Commit**: —

## Problem

Several links in the header nav and footer of `index.html` are either placeholder `#` hrefs or obfuscated Cloudflare email-protection URLs. Specifically:

- Nav "Get in touch" (`index.html:44`) links to `#contact` — should mailto.
- Closing section CTA (`index.html:202`) is a Cloudflare-obfuscated `[email protected]` link — should be a plain `mailto:` with the label `[ LET'S CHAT ]`.
- Footer "Contact" (`index.html:230`) links to `#contact` — should mailto.
- Footer "GitHub" (`index.html:238`) has a `#` placeholder href.
- Footer "LinkedIn" (`index.html:240`) has a `#` placeholder href.

## Fix

Update `index.html`:

1. Nav "Get in touch" href: `#contact` → `mailto:hello@spatial-intelligence.co.uk`
2. Closing CTA: replace the entire Cloudflare-encoded `<a>` (and its Cloudflare decode script) with `<a href="mailto:hello@spatial-intelligence.co.uk" class="btn">[ LET'S CHAT ] →</a>`
3. Footer "Contact" href: `#contact` → `mailto:hello@spatial-intelligence.co.uk`
4. Footer "GitHub" href: `#` → `https://github.com/3D-Intelligence`
5. Footer "LinkedIn" href: `#` → `https://www.linkedin.com/company/spatial-intelligence/`

Remove the Cloudflare email-decode script tag (`<script data-cfasync="false" ...>`) from the bottom of the file as it is no longer needed.

## Files

- `index.html` — update five hrefs, replace CTA markup, remove Cloudflare script

## Verification

- [ ] Nav "Get in touch" `href` attribute is `mailto:hello@spatial-intelligence.co.uk`
- [ ] Closing CTA text reads `[ LET'S CHAT ] →` and href is `mailto:hello@spatial-intelligence.co.uk`
- [ ] Footer "Contact" `href` is `mailto:hello@spatial-intelligence.co.uk`
- [ ] Footer "GitHub" `href` is `https://github.com/3D-Intelligence`
- [ ] Footer "LinkedIn" `href` is `https://www.linkedin.com/company/spatial-intelligence/`
- [ ] No Cloudflare email-protection markup or script remains in the file
