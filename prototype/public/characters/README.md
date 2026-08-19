# Character Images

Save your generated character images here.

## 📁 Directory Structure

```
characters/
├── en/           # English Characters
│   ├── emily/    # Emily - Modern American Girl
│   ├── oliver/   # Oliver - British Gentleman
│   └── sophia/   # Sophia - Tech Expert
├── jp/           # Japanese Characters
│   ├── sakura/   # Sakura - Traditional Girl
│   ├── yuki/     # Yuki - School Girl
│   └── kaito/    # Kaito - Cool Boy
├── es/           # Spanish Characters
│   ├── isabella/ # Isabella - Flamenco Dancer
│   ├── carlos/   # Carlos - Spanish Youth
│   └── luna/     # Luna - Barcelona Artist
└── kr/           # Korean Characters
    ├── hana/     # Hana - Traditional Hanbok Girl
    ├── minho/    # Minho - K-pop Idol
    └── jiwoo/    # Jiwoo - Gamer Girl
```

## 💾 Save Order (Recommended)

### 1. Emily (English) - Start Here! ⭐

**Save to:** `en/emily/`

```
idle.png   - Standing neutral
wave.png   - Waving hello
jump.png   - Jumping excited
clap.png   - Clapping happy
spin.png   - Spinning/twirling
dance.png  - Dancing energetic
pose.png   - Victory pose
```

**Full paths:**
```
en/emily/idle.png
en/emily/wave.png
en/emily/jump.png
en/emily/clap.png
en/emily/spin.png
en/emily/dance.png
en/emily/pose.png
```

### 2. Oliver (English)

**Save to:** `en/oliver/`
- Same 7 poses: idle, wave, jump, clap, spin, dance, pose

### 3. Sophia (English)

**Save to:** `en/sophia/`
- Same 7 poses: idle, wave, jump, clap, spin, dance, pose

### 4. Sakura (Japanese)

**Save to:** `jp/sakura/`
- Same 7 poses: idle, wave, jump, clap, spin, dance, pose

### 5. Yuki (Japanese)

**Save to:** `jp/yuki/`
- Same 7 poses: idle, wave, jump, clap, spin, dance, pose

### 6. Kaito (Japanese)

**Save to:** `jp/kaito/`
- Same 7 poses: idle, wave, jump, clap, spin, dance, pose

### 7. Isabella (Spanish)

**Save to:** `es/isabella/`
- Same 7 poses: idle, wave, jump, clap, spin, dance, pose

### 8. Carlos (Spanish)

**Save to:** `es/carlos/`
- Same 7 poses: idle, wave, jump, clap, spin, dance, pose

### 9. Luna (Spanish)

**Save to:** `es/luna/`
- Same 7 poses: idle, wave, jump, clap, spin, dance, pose

### 10. Hana (Korean)

**Save to:** `kr/hana/`
- Same 7 poses: idle, wave, jump, clap, spin, dance, pose

### 11. Minho (Korean)

**Save to:** `kr/minho/`
- Same 7 poses: idle, wave, jump, clap, spin, dance, pose

### 12. Jiwoo (Korean)

**Save to:** `kr/jiwoo/`
- Same 7 poses: idle, wave, jump, clap, spin, dance, pose

## ✅ Progress Tracker

Copy and check off as you complete:

```
English (EN):
[ ] Emily   - 7 poses
[ ] Oliver  - 7 poses
[ ] Sophia  - 7 poses

Japanese (JP):
[ ] Sakura  - 7 poses
[ ] Yuki    - 7 poses
[ ] Kaito   - 7 poses

Spanish (ES):
[ ] Isabella - 7 poses
[ ] Carlos   - 7 poses
[ ] Luna     - 7 poses

Korean (KR):
[ ] Hana    - 7 poses
[ ] Minho   - 7 poses
[ ] Jiwoo   - 7 poses

Total: ___ / 84 images
```

## 📊 Check Progress

```bash
# Count images
find . -name "*.png" | wc -l

# List all images
find . -name "*.png" | sort

# Check Emily's images
ls -la en/emily/
```

## ⚠️ Important Notes

### File Names (Exact!)

- **Correct:** `idle.png` ✓
- **Wrong:** `Idle.PNG` ✗
- **Wrong:** `emily_idle.png` ✗
- **Wrong:** `idle (1).png` ✗

**All lowercase, exact names:**
- idle.png
- wave.png
- jump.png
- clap.png
- spin.png
- dance.png
- pose.png

### File Format

- **Preferred:** PNG with transparent background
- **Acceptable:** PNG with white background
- **Also OK:** JPG (will work but PNG is better)

### Image Size

- **Ideal:** 512×768 pixels (portrait)
- **Also OK:** Any portrait orientation
- **Minimum:** 256×384 pixels
- **Maximum:** 1024×1536 pixels

## 🎨 Generation Sources

**Get prompts from:**
```bash
# Quick prompts (Emily ready)
cat ~/CHATGPT_PROMPTS_READY.md

# All character prompts
cat ~/projects/Projects/Game/lingotype/characters/docs/AI_CHARACTER_PROMPTS.md

# Full guide
cat ~/projects/Projects/Game/lingotype/characters/docs/CHATGPT_IMAGE_GENERATION.md
```

## 🚀 After Saving Images

### Test with Emily First

```bash
# Check Emily's images exist
ls -la en/emily/

# Should show 7 PNG files
# If yes, enable in game:
cd ~/projects/Projects/Game/lingotype/prototype

# Edit src/config/characterImages.ts
# Change: USE_EXTERNAL_IMAGES = true

# Build and test
npm run build
npm run dev
# Open http://localhost:5173
```

### Continue if Test Passes

- If Emily looks good in game, continue with other characters
- If not, check file names and locations

## 📍 You Are Here

**Current location:**
```
/Users/emilio/projects/Projects/Game/lingotype/prototype/public/characters/
```

**Save files relative to this folder:**
```
en/emily/idle.png      ✓
en/emily/wave.png      ✓
jp/sakura/idle.png     ✓
...
```

**Or use full path:**
```
/Users/emilio/projects/Projects/Game/lingotype/prototype/public/characters/en/emily/idle.png
```

## 🎉 Ready to Save!

**Start with Emily:**

1. Generate image with ChatGPT/Grok
2. Download image
3. Save to: `en/emily/idle.png`
4. Repeat for 6 more Emily poses
5. Test in game
6. Continue with other characters

**Good luck! 🎨✨**
