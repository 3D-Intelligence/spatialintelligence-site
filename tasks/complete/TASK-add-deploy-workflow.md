# TASK-add-deploy-workflow

**Status**: Complete
**Branch**: feat/add-deploy-workflow
**Commit**: 193b933

## Problem

The site has no deployment pipeline. GitHub Pages cannot serve the site without either a
manual upload or a GitHub Actions workflow. The repository settings require the Pages
source to be set to GitHub Actions, and no `.github/workflows/deploy.yml` exists.

## Fix

Create `.github/workflows/deploy.yml` using the standard GitHub Pages Actions stack
(`actions/checkout@v4`, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3`,
`actions/deploy-pages@v5`). The workflow should trigger on push to `main` and support
manual dispatch. Upload the entire repository root as the artifact path (no build step).

Also create a `CNAME` file at the repository root containing the custom domain name,
once the domain is confirmed. Leave a placeholder comment in this task until then.

After merging, go to **Settings → Pages** and confirm the source is set to **GitHub Actions**.

## Files

- `.github/workflows/deploy.yml` — new file; deploys repo root to GitHub Pages on push to `main`
- `CNAME` — new file; custom domain (add once domain is confirmed)

## Verification

- [ ] Push to `main` triggers the `Deploy to GitHub Pages` workflow in the Actions tab
- [ ] Workflow completes without errors
- [ ] Site is reachable at the GitHub Pages URL (e.g. `https://<org>.github.io/<repo>`)
- [ ] If `CNAME` is present, site is reachable at the custom domain
