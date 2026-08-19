# Character Generation Quick Start

**Goal:** Generate AI character images for LingoType in 30 minutes.

## Prerequisites

- Python 3.10.x installed
- Git installed
- 10GB+ free disk space
- GPU recommended (can use CPU but slower)

---

## 5-Minute Setup

### Step 1: Install Stable Diffusion WebUI

**Windows:**
```powershell
cd C:\
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui
notepad webui-user.bat
```

Add to `webui-user.bat`:
```batch
set COMMANDLINE_ARGS=--api --listen
```

Run:
```powershell
webui-user.bat
```

**macOS:**
```bash
cd ~
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui
nano webui-user.sh
```

Add to `webui-user.sh`:
```bash
export COMMANDLINE_ARGS="--api --listen --skip-torch-cuda-test --no-half"
```

Run:
```bash
chmod +x webui-user.sh
./webui-user.sh
```

**Linux:**
```bash
cd ~
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui
nano webui-user.sh
```

Add:
```bash
export COMMANDLINE_ARGS="--api --listen"
```

Run:
```bash
chmod +x webui-user.sh
./webui-user.sh
```

---

### Step 2: Wait for Installation

First run takes 10-30 minutes (downloads models and dependencies).

Watch for:
```
Running on local URL:  http://127.0.0.1:7860
```

Leave this terminal open!

---

### Step 3: Test Connection

**New terminal:**

```bash
cd lingotype/characters/scripts
python3 test_api.py --backend webui
```

**Expected:**
```
[WebUI] Testing connection to http://127.0.0.1:7860
✓ WebUI API is accessible
✓ Models loaded: 1
```

✅ If you see this, you're ready!

❌ If errors, see [Troubleshooting](#troubleshooting)

---

## Generate Characters

### Option 1: Generate All (Recommended)

```bash
cd lingotype/characters/scripts
python3 generate_characters.py --backend webui --all
```

- Generates 84 images (12 characters × 7 poses)
- Takes 15-30 minutes
- Progress shown for each image

---

### Option 2: Generate One Language

**English:**
```bash
python3 generate_characters.py --backend webui --language en
```

**Japanese:**
```bash
python3 generate_characters.py --backend webui --language jp
```

**Spanish:**
```bash
python3 generate_characters.py --backend webui --language es
```

**Korean:**
```bash
python3 generate_characters.py --backend webui --language kr
```

---

### Option 3: Generate One Character

```bash
# Just Emily
python3 generate_characters.py --backend webui --character en-emily

# Just Sakura
python3 generate_characters.py --backend webui --character jp-sakura
```

---

## Enable in Game

### Step 1: Verify Images Generated

```bash
ls ../../prototype/public/characters/en/emily/
```

Should show:
```
idle.png  wave.png  jump.png  dance.png  (etc.)
```

---

### Step 2: Enable External Images

```typescript
// lingotype/prototype/src/config/characterImages.ts

// Change this line:
export const USE_EXTERNAL_IMAGES = true; // ← Change false to true
```

---

### Step 3: Rebuild Game

```bash
cd ../../prototype
npm run build
```

---

### Step 4: Test Locally

```bash
npm run dev
```

Open http://localhost:5173

- Go to character selection
- See AI-generated character images!

---

### Step 5: Deploy

```bash
cd ..
git add -A
git commit -m "feat: add AI-generated character images"
git push
git subtree push --prefix prototype/dist origin gh-pages
```

---

## Troubleshooting

### Problem: WebUI won't start

**Solution:**
```bash
cd stable-diffusion-webui
python -m pip install --upgrade pip
pip install torch torchvision
```

Restart WebUI.

---

### Problem: Connection refused

**Check WebUI is running:**

Open browser: http://127.0.0.1:7860

If page loads, WebUI is running.

If not, restart WebUI with `--api --listen` flags.

---

### Problem: Out of memory

**Reduce image size:**

Edit `generate_characters.py`:
```python
DEFAULT_WIDTH = 384   # Was 512
DEFAULT_HEIGHT = 576  # Was 768
```

Or use CPU (slower):
```bash
# In webui-user.bat / .sh
COMMANDLINE_ARGS=--api --listen --use-cpu all
```

---

### Problem: Images look bad

**Increase quality:**

Edit `generate_characters.py`:
```python
"steps": 30,        # Was 20
"cfg_scale": 9,     # Was 7
```

Re-generate.

---

## Advanced Options

### Use Better Model

1. Download Anything V5 from Civitai
2. Place in `stable-diffusion-webui/models/Stable-diffusion/`
3. Restart WebUI
4. Select model in top-left dropdown
5. Re-generate characters

---

### Customize Prompts

Edit `AI_CHARACTER_PROMPTS.md` to change character appearance.

Then re-generate:
```bash
python3 generate_characters.py --backend webui --character en-emily
```

---

## What's Next?

After generation completes:

1. ✅ **Test in game** - See characters in action
2. ✅ **Customize** - Tweak prompts and re-generate
3. ✅ **Share** - Deploy to GitHub Pages
4. 🎨 **Create more** - Add new characters or poses

---

## Quick Reference

### Generate Commands

```bash
# All characters
python3 generate_characters.py --backend webui --all

# One language
python3 generate_characters.py --backend webui --language jp

# One character
python3 generate_characters.py --backend webui --character kr-hana

# One pose
python3 generate_characters.py --backend webui --character en-emily --pose idle
```

### Test Commands

```bash
# Test WebUI
python3 test_api.py --backend webui

# Test Replicate (if you have API key)
python3 test_api.py --backend replicate --token YOUR_TOKEN

# Test Hugging Face (if you have token)
python3 test_api.py --backend huggingface --token YOUR_TOKEN
```

---

## File Locations

**Generated Images:**
```
lingotype/prototype/public/characters/
  ├── en/
  │   ├── emily/
  │   │   ├── idle.png
  │   │   ├── wave.png
  │   │   └── ...
  │   ├── oliver/
  │   └── sophia/
  ├── jp/
  ├── es/
  └── kr/
```

**Configuration:**
```
lingotype/
  ├── characters/
  │   ├── docs/
  │   │   ├── AI_CHARACTER_PROMPTS.md      ← Edit prompts here
  │   │   ├── STABLE_DIFFUSION_SETUP.md    ← Full setup guide
  │   │   └── CHARACTER_IMAGE_GUIDE.md     ← Usage guide
  │   └── scripts/
  │       ├── generate_characters.py       ← Generation script
  │       └── test_api.py                  ← Test script
  └── prototype/
      └── src/
          └── config/
              └── characterImages.ts         ← Enable images here
```

---

## Support

**Documentation:**
- Full Setup: `docs/STABLE_DIFFUSION_SETUP.md`
- Character Prompts: `docs/AI_CHARACTER_PROMPTS.md`
- Script Guide: `scripts/README.md`

**Common Issues:**
- WebUI GitHub: https://github.com/AUTOMATIC1111/stable-diffusion-webui/issues
- Our Docs: See `STABLE_DIFFUSION_SETUP.md` → Troubleshooting

---

## Success Checklist

- [ ] WebUI installed and running
- [ ] API test passed (`test_api.py`)
- [ ] Generated at least one character
- [ ] Images visible in `public/characters/`
- [ ] `USE_EXTERNAL_IMAGES = true` set
- [ ] Game rebuilt (`npm run build`)
- [ ] Characters visible in game
- [ ] Deployed to production

**Done?** Congratulations! You've successfully added AI-generated characters to your typing game! 🎉

---

**Total Time:** 30-60 minutes (first time)

**Next Generation:** 15-30 minutes (once setup)

**Result:** Beautiful AI-generated character images in your game! ✨
