# Spatial Intelligence Site

[Spatial Intelligence](https://www.spatial-intelligence.co.uk) is a deeptech AI startup building AI that understands the structure, content and meaning of physical space — for machines that reason, build and operate in 3D. Unlocking new frontiers across gaming, architecture, and robotics.

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
