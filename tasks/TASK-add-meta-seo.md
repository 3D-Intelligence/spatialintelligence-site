# TASK-add-meta-seo

**Status**: Pending
**Branch**: feat/add-meta-seo
**Commit**: —

## Problem

`index.html` is missing `<meta name="description">` and all Open Graph tags. Without
these, search engine snippets are empty and link previews on Slack, Twitter/X, and
LinkedIn show no description or image. The site has no `<title>` beyond the bare
tag (verify and update if needed).

## Fix

Add the following to the `<head>` of `index.html`, after the `<meta charset>` and
`<meta name="viewport">` tags:

```html
<title>Spatial Intelligence — Tools for machines to understand 3D environments</title>
<meta name="description" content="Spatial Intelligence builds AI that understands the structure, content and meaning of physical space — across gaming, architecture, and robotics.">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.spatial-intelligence.co.uk/">
<meta property="og:title" content="Spatial Intelligence — Tools for machines to understand 3D environments">
<meta property="og:description" content="Spatial Intelligence builds AI that understands the structure, content and meaning of physical space — across gaming, architecture, and robotics.">
<meta property="og:image" content="https://www.spatial-intelligence.co.uk/assets/images/og-image.png">

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Spatial Intelligence — Tools for machines to understand 3D environments">
<meta name="twitter:description" content="Spatial Intelligence builds AI that understands the structure, content and meaning of physical space — across gaming, architecture, and robotics.">
<meta name="twitter:image" content="https://www.spatial-intelligence.co.uk/assets/images/og-image.png">
```

The `og:image` should be a 1200×630px PNG placed at `assets/images/og-image.png`.
Source or generate this image separately — it can be a branded dark card with the
company name and tagline. Add a placeholder path for now if the image is not yet ready.

Update the `og:url` value once the custom domain is confirmed.

## Files

- `index.html` — add meta description and OG tags to `<head>`
- `assets/images/og-image.png` — new; 1200×630px branded OG image (source separately)

## Verification

- [ ] `<meta name="description">` present in `index.html`
- [ ] All `og:*` and `twitter:*` tags present in `index.html`
- [ ] Paste the live URL into [opengraph.xyz](https://www.opengraph.xyz) — preview renders correctly
- [ ] `<title>` tag contains the full page title
