# Deployment Guide

This document describes how to deploy LingoType to various platforms.

## 📦 Build for Production

```bash
npm run build
```

**Build Output:**
- Location: `dist/`
- Size: ~253KB (gzip: ~77KB)
- Assets: HTML, CSS, JS

---

## 🚀 Deployment Options

### Option 1: GitHub Pages (Recommended)

**Automatic deployment with GitHub Actions:**

1. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: GitHub Actions

2. **Push to main/master:**
   ```bash
   git push origin main
   ```

3. **GitHub Actions will automatically:**
   - Install dependencies
   - Run tests (106 tests)
   - Build production bundle
   - Deploy to GitHub Pages

4. **Access your site:**
   ```
   https://yourusername.github.io/lingotype/
   ```

**Configuration:**
- Workflow: `.github/workflows/deploy.yml`
- Base URL: `./` (configured in `vite.config.ts`)

---

### Option 2: Vercel

**One-command deployment:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Configuration:**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

**Production URL:**
```
https://lingotype.vercel.app
```

---

### Option 3: Netlify

**Drag & Drop or CLI:**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**Configuration:**
- Build command: `npm run build`
- Publish directory: `dist`

**Production URL:**
```
https://lingotype.netlify.app
```

---

### Option 4: Custom Server (Nginx/Apache)

**Build and upload:**

```bash
# Build
npm run build

# Upload dist/ to your server
scp -r dist/* user@yourserver:/var/www/lingotype/
```

**Nginx configuration:**
```nginx
server {
    listen 80;
    server_name lingotype.yourdomain.com;
    root /var/www/lingotype;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript;
}
```

---

## 🔧 Environment Variables

Currently, the project does not use environment variables. If you add them:

```bash
# .env.production
VITE_API_URL=https://api.example.com
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## ✅ Pre-deployment Checklist

Before deploying to production:

- [ ] Run all tests: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Test locally: `npm run preview`
- [ ] Check bundle size (should be < 300KB)
- [ ] Update README with live demo URL
- [ ] Add meta tags for SEO/OG
- [ ] Test on mobile devices
- [ ] Check cross-browser compatibility

---

## 📊 Performance Tips

### 1. Enable Compression
- GitHub Pages: Automatic gzip
- Vercel/Netlify: Automatic Brotli + gzip
- Custom server: Configure Nginx/Apache

### 2. CDN
All platforms provide CDN by default:
- GitHub Pages: Fastly CDN
- Vercel: Edge Network (70+ locations)
- Netlify: Edge Network (100+ locations)

### 3. Caching
- Static assets are automatically cached
- HTML is not cached (for instant updates)

---

## 🐛 Troubleshooting

### Issue: 404 on refresh

**Solution:** Configure platform for SPA routing

**GitHub Pages:** (Already handled in workflow)

**Vercel:** Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify:** Create `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Issue: Assets not loading

**Check:**
1. `vite.config.ts` has `base: './'`
2. No hardcoded absolute paths in code
3. Assets are in `public/` or imported in JS

### Issue: Build fails

**Check:**
1. Node version: >= 18
2. All dependencies installed: `npm ci`
3. TypeScript errors: `npm run typecheck`
4. Tests passing: `npm test`

---

## 📈 Monitoring

### Analytics (Optional)

Add Google Analytics or Plausible:

```html
<!-- public/index.html -->
<script defer data-domain="yourdomain.com" 
  src="https://plausible.io/js/script.js"></script>
```

### Error Tracking (Optional)

Add Sentry:

```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});
```

---

## 🔐 Security

### Content Security Policy (Optional)

Add to `index.html`:

```html
<meta http-equiv="Content-Security-Policy" 
  content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

### HTTPS

All platforms provide free HTTPS:
- GitHub Pages: Automatic (via Let's Encrypt)
- Vercel: Automatic
- Netlify: Automatic

---

## 🌍 Custom Domain (Optional)

### GitHub Pages

1. Add CNAME file to `public/`:
   ```
   lingotype.yourdomain.com
   ```

2. Configure DNS:
   ```
   CNAME  lingotype  yourusername.github.io
   ```

### Vercel/Netlify

Add domain in dashboard → DNS auto-configured

---

## 📝 Update Deployment URL

After deployment, update URLs in:

1. **README.md:**
   ```markdown
   🎮 [Play Live Demo](https://your-actual-url.com)
   ```

2. **package.json:**
   ```json
   {
     "homepage": "https://your-actual-url.com"
   }
   ```

3. **Social Media:**
   - Twitter/Discord/Email links
   - OG meta tags in `index.html`

---

## ✨ Done!

Your LingoType game is now live! 🎉

**Share your deployment:**
- Twitter: #LingoType
- Reddit: r/gamedev
- Discord: Language learning communities

**Happy Typing!** ⌨️
