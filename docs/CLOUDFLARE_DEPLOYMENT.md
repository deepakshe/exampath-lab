# ExamPath Lab — Cloudflare Pages Free Deployment Guide

**Target Spend:** ₹0  
**Hosting Provider:** Cloudflare Pages Free  
**Repository Provider:** GitHub Free  
**Build System:** Astro Static Output (`dist/`)

---

## 1. Prerequisites

1. A free [GitHub Account](https://github.com/).
2. A free [Cloudflare Account](https://dash.cloudflare.com/).
3. Git installed on your development machine.

---

## 2. Step 1: Push Code to GitHub

Open terminal in the project directory (`C:\Users\admin\Desktop\Experiment`):

```bash
# Initialize git if not already done
git init

# Stage all files
git add .

# Create initial commit
git commit -m "feat: complete ExamPath Lab production MVP build"

# Link your GitHub repository (replace with your repo URL)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/exampath-lab.git

# Push to GitHub
git push -u origin main
```

---

## 3. Step 2: Connect Cloudflare Pages

1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation, click **Workers & Pages**.
3. Click **Create Application** → Select the **Pages** tab.
4. Click **Connect to Git**.
5. Select your GitHub account and choose the `exampath-lab` repository.
6. Click **Begin setup**.

---

## 4. Step 3: Configure Build Settings

Enter the following exact configuration:

| Setting | Value |
| :--- | :--- |
| **Project Name** | `exampath-lab` (or your preferred subdomain) |
| **Production Branch** | `main` |
| **Framework Preset** | `Astro` |
| **Build Command** | `npm run build` |
| **Build Output Directory** | `dist` |
| **Node.js Version** | `20` or higher (Set `NODE_VERSION=20.10.0` in Environment Variables) |

### Environment Variables (Optional):
Under **Environment Variables**, add:
- `NODE_VERSION`: `20.10.0`

Click **Save and Deploy**.

---

## 5. Step 4: Verification & Live URL

Within 60–90 seconds, Cloudflare Pages will execute the Astro build and output your production static assets.
Your website will be live at:
`https://exampath-lab.pages.dev`

Every future push to `main` on GitHub will automatically trigger a clean static build and instant global deployment across Cloudflare's edge CDN with zero downtime and ₹0 hosting cost!
