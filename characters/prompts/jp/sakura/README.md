# Sakura - Traditional Japanese Girl

Japanese character #1 for typing language game.

## Character Profile

**Name:** Sakura (桜)  
**Style:** Traditional Japanese Girl  
**Concept:** Gentle, serene beauty in traditional kimono  
**Personality:** Graceful, traditional, modest, serene, elegant  

## Visual Design

**Appearance:**
- Hair: Black, long straight with hair ornament (kanzashi)
- Eyes: Brown
- Age: 16-18 years old
- Build: Well-proportioned, graceful posture

**Outfit:**
- Pink kimono with floral pattern (cherry blossom motif)
- Traditional Japanese clothing (properly worn kimono)
- Obi (sash) properly tied
- Traditional Japanese footwear (zōri or geta)
- Hair ornament (kanzashi - decorative hairpin)
- Overall: Traditional, elegant, refined

**Color Palette:**
- Primary: Pink, white
- Secondary: Soft pastels, gentle tones
- Accent: Cherry blossom motifs
- Overall: Traditional Japanese aesthetic, serene and gentle

## Poses (7 Total)

All poses maintain Sakura's traditional, graceful character.

### 1. Idle (1-idle.png)
**Description:** Standing neutrally with graceful posture  
**Expression:** Gentle smile, serene  
**Key Features:**
- Traditional Japanese stance
- Hands folded gently
- Refined appearance
- Peaceful demeanor

**Prompt File:** `1-idle.txt`

---

### 2. Wave (2-wave.png)
**Description:** Gentle, modest wave  
**Expression:** Shy smile, gentle  
**Key Features:**
- Delicate waving gesture
- Traditional Japanese politeness
- Kimono sleeves flowing
- Graceful and modest

**Prompt File:** `2-wave.txt`

---

### 3. Jump (3-jump.png)
**Description:** Graceful jump with flowing kimono  
**Expression:** Joyful smile, delighted  
**Key Features:**
- Mid-air graceful jump
- Kimono and hair flowing
- Cherry blossom petals
- Elegant even in motion

**Prompt File:** `3-jump.txt`

---

### 4. Clap (4-clap.png)
**Description:** Traditional Japanese applause  
**Expression:** Joyful, happy  
**Key Features:**
- Gentle clapping
- Traditional celebration
- Refined happiness
- Graceful hand movement

**Prompt File:** `4-clap.txt`

---

### 5. Spin (5-spin.png)
**Description:** Elegant spinning motion  
**Expression:** Joyful, serene happiness  
**Key Features:**
- Graceful spinning
- Kimono swirling beautifully
- Cherry blossom petals
- Dance-like movement

**Prompt File:** `5-spin.txt`

---

### 6. Dance (6-dance.png)
**Description:** Traditional Japanese dance  
**Expression:** Serene smile, graceful  
**Key Features:**
- Traditional choreography
- Flowing kimono sleeves
- Elegant arm positions
- Fan dance (optional)

**Prompt File:** `6-dance.txt`

---

### 7. Pose (7-pose.png)
**Description:** Victory pose with traditional grace  
**Expression:** Proud smile, happy  
**Key Features:**
- Peace sign (Japanese style)
- Modest celebration
- Traditional elegance maintained
- Refined victory

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
   cd characters/prompts/jp/sakura
   cat 1-idle.txt   # Copy prompt
   # → Paste into AI tool
   # → Generate image
   # → Save as: ../../prototype/public/characters/jp/sakura/1-idle.png
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
~/projects/Projects/Game/lingotype/prototype/public/characters/jp/sakura/
```

## Character Consistency

When generating all 7 images, maintain:

**Consistent Features:**
- Black hair, long straight style
- Brown eyes
- Same facial features
- Same kimono (pink with cherry blossom pattern)
- Hair ornament (kanzashi)
- Same art style
- Same color palette

**Variable Features:**
- Pose/stance
- Expression intensity
- Kimono flow (based on movement)
- Arm/leg positions
- Overall energy level

**Traditional Character Maintained:**
- Always graceful and refined
- Never wild or uncontrolled
- Traditional Japanese etiquette
- Modest and elegant
- Serene demeanor

## Progress Tracking

See `ORDER.txt` for generation checklist.

## Notes

- Sakura represents traditional Japanese beauty
- All poses should feel refined and graceful
- Think: traditional Japanese character, gentle and serene
- Cherry blossom (sakura) motifs throughout
- Maintain traditional kimono accuracy
- Reference: Traditional Japanese art, kimono references

## Integration

Once all 7 images are generated:

1. Place in: `prototype/public/characters/jp/sakura/`
2. Update: `prototype/src/config/characterImages.ts`
3. Enable: `USE_EXTERNAL_IMAGES = true`
4. Test in game with Japanese language selection

---

**Character designed for:** LingoType Game  
**Target:** Japanese language learners  
**Style:** Traditional Japanese aesthetics meets anime
