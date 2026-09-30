# Deployment Automation (Netlify)

This repo now includes a GitHub Actions workflow to automatically trigger Netlify deploys.

## What is automated
- On every push to `main` or `work`, GitHub Action triggers Netlify build hook.
- You can also run it manually from **Actions → Netlify Auto Deploy → Run workflow**.

Workflow file:
- `.github/workflows/netlify-auto-deploy.yml`

## One-time setup (important)
1. Open Netlify site dashboard.
2. Go to **Site settings → Build & deploy → Build hooks**.
3. Create a new build hook and copy the URL.
4. Open GitHub repo → **Settings → Secrets and variables → Actions**.
5. Add secret:
   - Name: `NETLIFY_BUILD_HOOK`
   - Value: your full Netlify build-hook URL.

## Why this fixes “update dikh nahi raha” issue
Even if branch linkage/manual deploy is missed, this workflow sends a deploy trigger automatically on push.
So latest code changes are published consistently.

## Note on email before deploy
Netlify deployment emails are managed in Netlify notifications:
- Netlify → Site settings → Notifications
You can enable/disable who gets “deploy started/deploy failed/deploy succeeded” emails there.
