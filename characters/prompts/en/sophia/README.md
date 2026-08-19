# Sophia - Tech-savvy Modern Girl

English character #3 for typing language game.

## Character Profile

**Name:** Sophia  
**Style:** Tech-savvy Modern Girl  
**Concept:** Cool, calm tech enthusiast with modern professional style  
**Personality:** Intelligent, composed, tech-savvy, modern, confident  

## Visual Design

**Appearance:**
- Hair: Purple, short bob cut
- Eyes: Gray, glasses (rectangular or round frames)
- Age: 16-18 years old
- Build: Well-proportioned, confident posture

**Outfit:**
- Modern tech jacket (gray or dark blue)
- T-shirt underneath
- Cargo pants (practical style)
- Boots (comfortable, modern)
- Glasses (key accessory)
- Overall: Tech-inspired, practical, modern

**Color Palette:**
- Primary: Purple, gray
- Secondary: Blue tones, dark colors
- Accent: Tech-inspired colors
- Overall: Modern, sleek, professional aesthetic

## Poses (7 Total)

All poses maintain Sophia's cool, tech-savvy character while showing different emotions and actions.

### 1. Idle (1-idle.png)
**Description:** Standing neutrally with professional posture  
**Expression:** Neutral, cool and calm  
**Key Features:**
- Professional stance
- Arms at sides or crossed casually
- Confident demeanor
- Cool and collected

**Prompt File:** `1-idle.txt`

---

### 2. Wave (2-wave.png)
**Description:** Casual friendly wave  
**Expression:** Slight smile, friendly but cool  
**Key Features:**
- One hand raised in wave
- Cool greeting
- Approachable but professional
- Relaxed confidence

**Prompt File:** `2-wave.txt`

---

### 3. Jump (3-jump.png)
**Description:** Jumping with victorious excitement  
**Expression:** Excited, victorious smile  
**Key Features:**
- Mid-air jump
- Arms raised in victory
- Hair and clothes flowing
- Cool even while excited

**Prompt File:** `3-jump.txt`

---

### 4. Clap (4-clap.png)
**Description:** Appreciative applause  
**Expression:** Pleased smile, appreciative  
**Key Features:**
- Hands clapping at chest level
- Professional appreciation
- Measured enthusiasm
- Cool approval

**Prompt File:** `4-clap.txt`

---

### 5. Spin (5-spin.png)
**Description:** Playful spinning motion  
**Expression:** Joyful smile, playful  
**Key Features:**
- Body spinning/rotating
- Jacket and bob cut swirling
- Playful but cool
- Motion effect on clothes

**Prompt File:** `5-spin.txt`

---

### 6. Dance (6-dance.png)
**Description:** Modern dance style  
**Expression:** Happy, energetic  
**Key Features:**
- One arm raised, one at hip
- Modern/hip-hop style movement
- Energetic but controlled
- Cool confidence

**Prompt File:** `6-dance.txt`

---

### 7. Pose (7-pose.png)
**Description:** Victory/confident pose  
**Expression:** Confident smile, victorious  
**Key Features:**
- Peace sign or thumbs up
- Hand on hip or adjusting glasses
- Tech-savvy victory
- Professional celebration

**Prompt File:** `7-pose.txt`

---

## Generation Instructions

### Quick Start

1. **Choose AI tool:**
   - ChatGPT (DALL-E) - Recommended
   - Grok (Flux)
   - Stable Diffusion WebUI

2. **Generate each pose:**
   ```bash
   cd characters/prompts/en/sophia
   cat 1-idle.txt   # Copy prompt
   # → Paste into AI tool
   # → Generate image
   # → Save as: ../../prototype/public/characters/en/sophia/1-idle.png
   ```

3. **Repeat for all 7 poses**

4. **Verify:**
   - All images are 1024×1536 PNG
   - Character looks consistent across poses
   - White/transparent background
   - High quality

### File Naming

```
1-idle.txt  → 1-idle.png
2-wave.txt  → 2-wave.png
3-jump.txt  → 3-jump.png
4-clap.txt  → 4-clap.png
5-spin.txt  → 5-spin.png
6-dance.txt  → 6-dance.png
7-pose.txt  → 7-pose.png
```

### Save Location

```
~/projects/Projects/Game/lingotype/prototype/public/characters/en/sophia/
```

## Character Consistency

When generating all 7 images, maintain:

**Consistent Features:**
- Purple hair, short bob cut
- Gray eyes, glasses
- Same facial features
- Same outfit (tech jacket, t-shirt, cargo pants, boots)
- Same art style
- Same color palette

**Variable Features:**
- Pose/stance
- Expression intensity
- Clothing flow (based on movement)
- Arm/leg positions
- Overall energy level

**Tech-savvy Character Maintained:**
- Always professional demeanor
- Never overly cute or childish
- Cool and composed
- Modern aesthetic
- Intelligent appearance

## Progress Tracking

See `ORDER.txt` for generation checklist.

## Notes

- Sophia represents modern tech-savvy youth
- All poses should feel professional, even when energetic
- Think: modern anime tech character, intelligent and cool
- Avoid overly cute or traditional elements
- Maintain glasses in all poses
- Reference: Tech-focused anime characters, modern professionals

## Integration

Once all 7 images are generated:

1. Place in: `prototype/public/characters/en/sophia/`
2. Update: `prototype/src/config/characterImages.ts`
3. Enable: `USE_EXTERNAL_IMAGES = true`
4. Test in game with English language selection

---

**Character designed for:** LingoType Game  
**Target:** English language learners  
**Style:** Modern tech aesthetics meets anime
