# Spatial Intelligence Site

[Spatial Intelligence](https://spatial-intelligence.co.uk) is a deeptech AI startup building AI that understands the structure, content and meaning of physical space — for machines that reason, build and operate in 3D. Unlocking new frontiers across gaming, architecture, and robotics.

## Cloning

This repository includes `standards/` as a git submodule. Clone with:

```bash
git clone --recurse-submodules https://github.com/3D-Intelligence/spatialintelligence-site.git
```

If you already cloned without the flag:

```bash
git submodule update --init
```

## Local development

The site uses ES modules (`type="module"`), which require a server — opening `index.html` directly in a browser will not work.

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

To make accessible over the network (e.g. to test on a mobile device), bind to the wildcard address `0.0.0.0`:

```bash
python -m http.server 8000 --bind 0.0.0.0
```

## Deployment

The site deploys automatically to GitHub Pages on every push to `main` via GitHub Actions (`.github/workflows/deploy.yml`). No build step — the repository is the deployable artifact.

To configure GitHub Pages: go to **Settings → Pages** and set the source to **GitHub Actions**.

If using a custom domain, add a `CNAME` file at the repository root containing the domain name.

## Standards

Engineering and design standards live in `standards/` (a git submodule from [3D-Intelligence/standards](https://github.com/3D-Intelligence/standards)). See `CLAUDE.md` for which standards apply to this project.
