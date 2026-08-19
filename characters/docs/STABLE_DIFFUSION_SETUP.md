# Stable Diffusion WebUI Setup Guide

Complete guide for installing and configuring Stable Diffusion WebUI to generate character images for LingoType game.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Testing](#testing)
5. [Usage with Game](#usage-with-game)
6. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Hardware

**Minimum:**
- GPU: NVIDIA GTX 1060 6GB or AMD equivalent
- RAM: 8GB
- Storage: 20GB free space

**Recommended:**
- GPU: NVIDIA RTX 3060 12GB or better
- RAM: 16GB+
- Storage: 50GB+ SSD

**Apple Silicon (M1/M2/M3):**
- Any Mac with M1 or later
- macOS 12.3 or later
- 16GB+ unified memory recommended

### Software

- Python 3.10.x (NOT 3.11+ or 3.9-)
- Git
- pip

---

## Installation

### Option 1: Windows (NVIDIA GPU)

1. **Install Python 3.10.11**
   ```powershell
   # Download from python.org
   # https://www.python.org/downloads/release/python-31011/
   
   # Verify installation
   python --version  # Should show: Python 3.10.11
   ```

2. **Install Git**
   ```powershell
   # Download from git-scm.com
   # https://git-scm.com/download/win
   
   git --version  # Verify
   ```

3. **Clone Stable Diffusion WebUI**
   ```powershell
   cd C:\
   git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
   cd stable-diffusion-webui
   ```

4. **Download Model (Optional - Will auto-download on first run)**
   ```powershell
   # Download Stable Diffusion 1.5 (4GB)
   # https://huggingface.co/runwayml/stable-diffusion-v1-5
   
   # Place in: stable-diffusion-webui/models/Stable-diffusion/
   ```

5. **Run WebUI**
   ```powershell
   webui-user.bat
   
   # First run will download dependencies (takes 10-30 mins)
   # Watch for: "Running on local URL:  http://127.0.0.1:7860"
   ```

6. **Enable API**
   
   Edit `webui-user.bat`:
   ```batch
   @echo off

   set PYTHON=
   set GIT=
   set VENV_DIR=
   set COMMANDLINE_ARGS=--api --listen

   call webui.bat
   ```

7. **Restart WebUI**
   ```powershell
   # Close and restart
   webui-user.bat
   
   # Verify API at: http://127.0.0.1:7860/docs
   ```

---

### Option 2: macOS (Apple Silicon)

1. **Install Homebrew (if not installed)**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Dependencies**
   ```bash
   brew install cmake protobuf rust python@3.10 git wget
   ```

3. **Clone Stable Diffusion WebUI**
   ```bash
   cd ~
   git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
   cd stable-diffusion-webui
   ```

4. **Configure for Apple Silicon**
   
   Edit `webui-user.sh`:
   ```bash
   #!/bin/bash

   export COMMANDLINE_ARGS="--api --listen --skip-torch-cuda-test --no-half --use-cpu interrogate"
   
   # If you have issues, add:
   # export PYTORCH_ENABLE_MPS_FALLBACK=1
   
   ./webui.sh
   ```

5. **Make Executable and Run**
   ```bash
   chmod +x webui-user.sh
   ./webui-user.sh
   
   # First run downloads dependencies (10-30 mins)
   # Watch for: "Running on local URL:  http://127.0.0.1:7860"
   ```

6. **Verify API**
   ```bash
   # Open in browser:
   open http://127.0.0.1:7860/docs
   
   # You should see Swagger UI with API endpoints
   ```

---

### Option 3: Linux (NVIDIA GPU)

1. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install wget git python3 python3-venv
   ```

2. **Install CUDA Toolkit** (if not installed)
   ```bash
   # Follow NVIDIA instructions for your distro
   # https://developer.nvidia.com/cuda-downloads
   ```

3. **Clone Stable Diffusion WebUI**
   ```bash
   cd ~
   git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
   cd stable-diffusion-webui
   ```

4. **Configure for API**
   
   Edit `webui-user.sh`:
   ```bash
   #!/bin/bash
   
   export COMMANDLINE_ARGS="--api --listen"
   
   ./webui.sh
   ```

5. **Make Executable and Run**
   ```bash
   chmod +x webui-user.sh
   ./webui-user.sh
   
   # First run installs everything (10-30 mins)
   ```

6. **Verify API**
   ```bash
   curl http://127.0.0.1:7860/docs
   # Should return HTML
   ```

---

## Configuration

### Recommended Settings

1. **Open WebUI**
   ```
   http://127.0.0.1:7860
   ```

2. **Settings Tab → User Interface**
   - ✅ Enable API
   - ✅ Enable CORS (for external scripts)

3. **Settings Tab → System**
   - VRAM: Auto (or set based on your GPU)
   - Batch size: 1 (for consistency)

4. **Settings Tab → Stable Diffusion**
   - Sampler: Euler a (fast and good quality)
   - Steps: 20-30 (balance quality/speed)
   - CFG Scale: 7 (follow prompts well)

5. **Apply Settings** (bottom of page)

6. **Restart WebUI**

---

### Install Additional Models (Optional)

**Anime Models (Better for character generation):**

1. **Download Model:**
   - Anything V3: https://huggingface.co/Linaqruf/anything-v3.0
   - Anything V5: https://civitai.com/models/9409/anything-v5

2. **Place Model:**
   ```
   stable-diffusion-webui/models/Stable-diffusion/
   ```

3. **Restart WebUI**

4. **Select Model:**
   - Top-left dropdown in WebUI
   - Choose your model

---

## Testing

### Test API Connection

```bash
cd lingotype/characters/scripts

# Test WebUI connection
python3 test_api.py --backend webui

# Expected output:
# [WebUI] Testing connection to http://127.0.0.1:7860
# ✓ WebUI API is accessible
# ✓ Models loaded: 1
# ✓ Current model: v1-5-pruned-emaonly.safetensors [...]
```

### Generate Test Image

```bash
# Generate single character image
python3 generate_characters.py --backend webui --character en-emily --pose idle

# Expected output:
# [WebUI] Generating Emily idle...
# [WebUI] Prompt: portrait of Emily, modern American girl...
# [WebUI] Image saved: ../../prototype/public/characters/en/emily/idle.png
# ✓ Generated 1 image in 12.3s
```

### Verify Output

```bash
# Check generated image
ls ../../prototype/public/characters/en/emily/

# Should show:
# idle.png
```

---

## Usage with Game

### Generate All Characters

```bash
cd lingotype/characters/scripts

# Generate all 12 characters × 7 poses = 84 images
python3 generate_characters.py --backend webui --all

# This will take 15-30 minutes depending on your GPU
# Progress is shown for each image
```

### Generate Specific Language

```bash
# Generate all English characters
python3 generate_characters.py --backend webui --language en

# Generate all Japanese characters
python3 generate_characters.py --backend webui --language jp
```

### Generate Specific Character

```bash
# Generate all poses for one character
python3 generate_characters.py --backend webui --character jp-sakura
```

### Monitor Progress

The script shows real-time progress:

```
[1/84] Generating en-emily idle...
  Prompt: portrait of Emily, modern American girl...
  Size: 512×768
  ✓ Saved: ../../prototype/public/characters/en/emily/idle.png
  Time: 8.2s

[2/84] Generating en-emily wave...
  ...
```

### Enable in Game

After generation completes:

```typescript
// lingotype/prototype/src/config/characterImages.ts

export const USE_EXTERNAL_IMAGES = true; // ← Change to true
```

Rebuild and deploy:

```bash
cd lingotype/prototype
npm run build
# Deploy to GitHub Pages
```

---

## Troubleshooting

### Issue: WebUI won't start

**Symptoms:**
```
Error: No module named 'torch'
```

**Solution:**
```bash
# Reinstall dependencies
cd stable-diffusion-webui
python -m pip install --upgrade pip
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

---

### Issue: API not accessible

**Symptoms:**
```
[test_api.py] Error: Connection refused
```

**Solution:**

1. Check WebUI is running:
   ```
   http://127.0.0.1:7860
   ```

2. Verify API enabled in `webui-user.bat` / `webui-user.sh`:
   ```
   COMMANDLINE_ARGS=--api --listen
   ```

3. Restart WebUI

---

### Issue: Out of memory

**Symptoms:**
```
RuntimeError: CUDA out of memory
```

**Solution:**

Option 1: Reduce image size (edit `generate_characters.py`):
```python
DEFAULT_WIDTH = 384   # Was 512
DEFAULT_HEIGHT = 576  # Was 768
```

Option 2: Enable low VRAM mode:
```bash
# Edit webui-user.bat / .sh
COMMANDLINE_ARGS=--api --listen --medvram
```

Option 3: Use CPU (slow but works):
```bash
COMMANDLINE_ARGS=--api --listen --use-cpu all
```

---

### Issue: Images look bad

**Symptoms:**
- Blurry images
- Wrong proportions
- Missing details

**Solution:**

1. **Increase steps:**
   ```python
   # In generate_characters.py
   "steps": 30  # Was 20
   ```

2. **Try better model:**
   - Download Anything V5
   - Select in WebUI dropdown

3. **Adjust CFG scale:**
   ```python
   "cfg_scale": 9  # Was 7 (higher = more prompt adherence)
   ```

4. **Add negative prompt:**
   ```python
   negative_prompt = "blurry, low quality, distorted, bad anatomy"
   ```

---

### Issue: API timeout

**Symptoms:**
```
ReadTimeout: The read operation timed out
```

**Solution:**

1. **Increase timeout in script:**
   ```python
   # In generate_characters.py
   TIMEOUT = 300  # Was 180 (5 minutes)
   ```

2. **Reduce image count:**
   ```bash
   # Generate one at a time
   python3 generate_characters.py --backend webui --character en-emily
   ```

---

### Issue: Wrong character in image

**Symptoms:**
- Generated male instead of female
- Wrong clothing style
- Wrong ethnicity

**Solution:**

1. **Check prompts in `AI_CHARACTER_PROMPTS.md`**

2. **Strengthen character traits:**
   ```
   # In prompts, add:
   BREAK, definitely female, BREAK
   ```

3. **Use character LoRA** (advanced):
   - Download character-specific LoRA
   - Place in `stable-diffusion-webui/models/Lora/`
   - Add to prompt: `<lora:japanese_girl:0.8>`

---

## Advanced Configuration

### Batch Generation

Generate multiple images per prompt and pick best:

```python
# In generate_characters.py, modify request:
payload = {
    # ...
    "batch_size": 4,  # Generate 4 images
    # ...
}
```

### Custom Samplers

Try different samplers for better quality:

```python
# Recommended samplers:
"sampler_name": "DPM++ 2M Karras"  # Good quality, slower
"sampler_name": "Euler a"           # Fast, good default
"sampler_name": "DDIM"              # Deterministic
```

### Seed Control

For reproducible results:

```python
payload = {
    # ...
    "seed": 12345,  # Fixed seed
    # ...
}
```

### ControlNet (Advanced)

For pose control:

1. Install ControlNet extension in WebUI
2. Use pose references
3. Generate consistent character poses

---

## Performance Tips

### Speed Up Generation

1. **Use smaller images:**
   - 384×576 instead of 512×768
   - 50% faster, still good quality

2. **Reduce steps:**
   - 15-20 steps instead of 30
   - Faster but slightly lower quality

3. **Use faster sampler:**
   - Euler a (fastest)
   - DPM++ SDE (good balance)

4. **Enable xformers:**
   ```bash
   # In webui-user.bat / .sh
   COMMANDLINE_ARGS=--api --listen --xformers
   ```

### Improve Quality

1. **Increase steps:**
   - 30-40 steps

2. **Higher resolution:**
   - 640×960 (slower but better)

3. **Use highres fix:**
   ```python
   payload = {
       # ...
       "enable_hr": True,
       "hr_scale": 1.5,
       # ...
   }
   ```

---

## Next Steps

After successful setup:

1. ✅ Generate all character images
2. ✅ Enable USE_EXTERNAL_IMAGES in game
3. ✅ Test character selection in game
4. ✅ Deploy to production

For detailed prompts and character specifications, see:
- `AI_CHARACTER_PROMPTS.md` - Full prompt library
- `CHARACTER_IMAGE_GUIDE.md` - Usage guide
- `../scripts/README.md` - Script documentation

---

## Resources

**Official Documentation:**
- Stable Diffusion WebUI: https://github.com/AUTOMATIC1111/stable-diffusion-webui
- Wiki: https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki

**Models:**
- Hugging Face: https://huggingface.co/models?other=stable-diffusion
- Civitai: https://civitai.com/

**Community:**
- Reddit r/StableDiffusion: https://reddit.com/r/StableDiffusion
- Discord: https://discord.gg/stablediffusion

---

## Support

If you encounter issues not covered here:

1. Check WebUI console output for errors
2. Search GitHub Issues: https://github.com/AUTOMATIC1111/stable-diffusion-webui/issues
3. Review script logs in `characters/scripts/`
4. Test with simpler prompts first

Generated images will appear in:
```
lingotype/prototype/public/characters/{lang}/{name}/{pose}.png
```

Good luck with your character generation! 🎨✨
