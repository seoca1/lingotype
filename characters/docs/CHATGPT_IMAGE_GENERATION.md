# ChatGPT / Grok Image Generation Guide

**Easy Method:** Use ChatGPT (DALL-E) or Grok (Flux) to generate character images.

No installation required! Just use the AI chat interface.

---

## 🎨 Method 1: ChatGPT (DALL-E 3)

### Requirements

- ChatGPT Plus subscription ($20/month)
- Access to DALL-E 3 image generation

### Step-by-Step

#### 1. Open ChatGPT

https://chat.openai.com/

#### 2. Use Our Prompts

We've already written detailed prompts in `AI_CHARACTER_PROMPTS.md`.

**Example for Emily (idle pose):**

Copy this to ChatGPT:

```
Create an anime-style portrait illustration of Emily, a modern American teenage girl:

Character Design:
- Age: 16-18 years old
- Hair: Shoulder-length brown hair with natural waves
- Eyes: Bright hazel eyes, friendly expression
- Outfit: Casual hoodie (light gray or pink) with jeans
- Accessories: Simple backpack straps visible

Pose: Standing idle/neutral
- Relaxed standing pose
- Arms at sides or one hand in pocket
- Friendly, approachable expression
- Looking at viewer with a slight smile

Art Style:
- Anime/manga aesthetic (semi-realistic)
- Clean linework with soft shading
- Warm color palette
- White or transparent background
- Portrait orientation (taller than wide)
- High quality, detailed rendering

Image size: Portrait orientation, 512×768 pixels equivalent
Focus: Upper body and face clearly visible
Mood: Friendly, casual, modern American teenager
```

#### 3. Download Image

- Click image to enlarge
- Right-click → Save Image As
- Save to: `lingotype/prototype/public/characters/en/emily/idle.png`

#### 4. Repeat for All Characters

**12 characters × 7 poses = 84 images**

See full prompts in: `AI_CHARACTER_PROMPTS.md`

---

## 🤖 Method 2: Grok (Flux)

### Requirements

- X Premium+ subscription ($16/month)
- Access to Grok with Flux image generation

### Step-by-Step

#### 1. Open Grok

https://x.com/i/grok

#### 2. Use Same Prompts

Copy prompts from `AI_CHARACTER_PROMPTS.md` to Grok.

Example:
```
Generate: Anime portrait of Emily, modern American teenage girl...
[same prompt as above]
```

#### 3. Download Images

- Click generated image
- Save to: `lingotype/prototype/public/characters/en/emily/idle.png`

---

## 📂 File Organization

### Directory Structure

```
lingotype/prototype/public/characters/
├── en/
│   ├── emily/
│   │   ├── idle.png
│   │   ├── wave.png
│   │   ├── jump.png
│   │   ├── clap.png
│   │   ├── spin.png
│   │   ├── dance.png
│   │   └── pose.png
│   ├── oliver/
│   │   └── [same 7 poses]
│   └── sophia/
│       └── [same 7 poses]
├── jp/
│   ├── sakura/
│   ├── yuki/
│   └── kaito/
├── es/
│   ├── isabella/
│   ├── carlos/
│   └── luna/
└── kr/
    ├── hana/
    ├── minho/
    └── jiwoo/
```

### Create Directories

```bash
cd ~/projects/Projects/Game/lingotype/prototype/public

# Create all directories
mkdir -p characters/{en,jp,es,kr}/{emily,oliver,sophia,sakura,yuki,kaito,isabella,carlos,luna,hana,minho,jiwoo}

# For English characters
mkdir -p characters/en/{emily,oliver,sophia}

# For Japanese characters
mkdir -p characters/jp/{sakura,yuki,kaito}

# For Spanish characters
mkdir -p characters/es/{isabella,carlos,luna}

# For Korean characters
mkdir -p characters/kr/{hana,minho,jiwoo}
```

---

## 📝 Prompt Templates

### Quick Reference

**For each character, generate 7 poses:**

1. **idle** - Standing neutral/relaxed
2. **wave** - Waving hand cheerfully
3. **jump** - Jumping with excitement
4. **clap** - Clapping hands happily
5. **spin** - Spinning/twirling motion
6. **dance** - Dancing energetically
7. **pose** - Victory/confident pose

### Template Structure

```
Create an anime-style portrait illustration of [CHARACTER NAME], a [DESCRIPTION]:

Character Design:
- [Physical features]
- [Clothing]
- [Accessories]

Pose: [POSE NAME]
- [Pose details]
- [Expression]

Art Style:
- Anime/manga aesthetic
- Clean linework
- Portrait orientation
- White or transparent background
```

---

## 🎯 Character List

### English Characters

**Emily** - Modern American Girl
- Casual hoodie, jeans
- Friendly, approachable

**Oliver** - British Gentleman  
- Button-up shirt, vest
- Polite, sophisticated

**Sophia** - Tech Expert
- Tech outfit, glasses
- Smart, modern

### Japanese Characters

**Sakura** - Traditional Girl
- Pink kimono with floral patterns
- Traditional, elegant

**Yuki** - School Girl
- School uniform (sailor style)
- Cheerful, energetic

**Kaito** - Cool Boy
- School uniform (gakuran)
- Cool, composed

### Spanish Characters

**Isabella** - Flamenco Dancer
- Flamenco dress (red/black)
- Passionate, energetic

**Carlos** - Spanish Youth
- Sporty casual wear
- Athletic, friendly

**Luna** - Barcelona Artist
- Artistic bohemian style
- Creative, free-spirited

### Korean Characters

**Hana** - Traditional Hanbok Girl
- Traditional hanbok (pastel colors)
- Graceful, elegant

**Minho** - K-pop Idol
- Modern K-pop fashion
- Stylish, confident

**Jiwoo** - Gamer Girl
- Gamer outfit with headphones
- Cute, playful

---

## ⚡ Quick Generation Workflow

### For One Character (7 images)

**Time: ~10-15 minutes**

1. Open ChatGPT/Grok
2. Find character in `AI_CHARACTER_PROMPTS.md`
3. Copy idle pose prompt
4. Generate → Download → Save as `idle.png`
5. Repeat for wave, jump, clap, spin, dance, pose
6. Move to next character

### For All Characters (84 images)

**Time: ~2-3 hours**

1. Create all directories first
2. Work through one character at a time
3. Save images immediately after generation
4. Check each image before moving on

---

## 🎨 Image Requirements

### Specifications

- **Format:** PNG (preferred) or JPG
- **Size:** 512×768 pixels ideal (portrait orientation)
- **Background:** White or transparent
- **Style:** Anime/manga aesthetic
- **Quality:** High detail, clean lines

### Post-Processing (Optional)

If images need adjustment:

```bash
# Resize image (macOS)
sips -z 768 512 input.png --out output.png

# Remove background (online tool)
# https://remove.bg
```

---

## ✅ Enable in Game

### After Generating Images

1. **Verify images exist:**
   ```bash
   find ~/projects/Projects/Game/lingotype/prototype/public/characters -name "*.png" | wc -l
   # Should show: 84 (or at least some images)
   ```

2. **Enable external images:**
   ```typescript
   // lingotype/prototype/src/config/characterImages.ts
   export const USE_EXTERNAL_IMAGES = true;
   ```

3. **Rebuild game:**
   ```bash
   cd ~/projects/Projects/Game/lingotype/prototype
   npm run build
   ```

4. **Test locally:**
   ```bash
   npm run dev
   # Open http://localhost:5173
   ```

5. **Deploy:**
   ```bash
   cd ..
   git add -A
   git commit -m "feat: add character images from ChatGPT/Grok"
   git push
   git subtree push --prefix prototype/dist origin gh-pages
   ```

---

## 💡 Tips

### Quality Tips

1. **Be specific:** Use detailed character descriptions
2. **Consistent style:** Mention "anime-style" each time
3. **Background:** Request white or transparent
4. **Orientation:** Specify portrait (taller than wide)

### Time-Saving Tips

1. **Batch by character:** Do all 7 poses for one character at once
2. **Save as you go:** Don't wait until all are generated
3. **Keep prompts open:** Have `AI_CHARACTER_PROMPTS.md` in another window
4. **Use clipboard:** Copy-paste prompts efficiently

### Organization Tips

1. **Name files correctly:** `idle.png` not `Idle.PNG`
2. **Check locations:** Save to correct character folder
3. **Preview before saving:** Make sure image looks good
4. **Keep backups:** Save originals before any editing

---

## 🆘 Troubleshooting

### Image looks wrong

**Problem:** Generated image doesn't match prompt

**Solution:** 
- Regenerate with more specific prompt
- Add "NOT [unwanted feature]" to prompt
- Try multiple times until satisfied

### Wrong size

**Problem:** Image is square or wrong orientation

**Solution:**
- Request "portrait orientation, taller than wide"
- Resize after generation with sips command
- Or use online image resizer

### Background not white

**Problem:** Image has colored or complex background

**Solution:**
- Use remove.bg to remove background
- Or regenerate requesting "white background"
- Transparent PNG is also acceptable

### File too large

**Problem:** PNG file is very large (>5MB)

**Solution:**
```bash
# Compress image (macOS)
pngquant image.png --output image-compressed.png
```

---

## 📊 Progress Tracker

Use this checklist:

### English
- [ ] Emily (7 poses)
- [ ] Oliver (7 poses)
- [ ] Sophia (7 poses)

### Japanese
- [ ] Sakura (7 poses)
- [ ] Yuki (7 poses)
- [ ] Kaito (7 poses)

### Spanish
- [ ] Isabella (7 poses)
- [ ] Carlos (7 poses)
- [ ] Luna (7 poses)

### Korean
- [ ] Hana (7 poses)
- [ ] Minho (7 poses)
- [ ] Jiwoo (7 poses)

**Total: 84 images**

---

## 🎉 Alternative: Partial Implementation

Don't want to generate all 84 images?

**Option 1: One language only**
- Generate just English characters (21 images)
- Game will show primitives for other languages

**Option 2: Idle poses only**
- Generate just idle pose for all 12 characters
- Game will use idle for all poses
- Only 12 images needed!

**Option 3: One character per language**
- Emily, Sakura, Isabella, Hana (28 images total)
- Other characters use primitives

---

## 📚 See Also

- **Full Prompts:** `AI_CHARACTER_PROMPTS.md`
- **Character Guide:** `CHARACTER_IMAGE_GUIDE.md`
- **Setup Guide:** `STABLE_DIFFUSION_SETUP.md`
- **Quick Start:** `../QUICKSTART.md`

---

**Ready to start?**

1. Create directories
2. Open ChatGPT or Grok
3. Start with one character (Emily recommended)
4. Generate 7 poses
5. Test in game
6. Continue with remaining characters

**Good luck! 🎨✨**
