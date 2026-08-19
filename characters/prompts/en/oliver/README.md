# Oliver - British Gentleman Style

English character #2 for typing language game.

## Character Profile

**Name:** Oliver  
**Style:** British Gentleman  
**Concept:** Elegant, refined young gentleman with classic British charm  
**Personality:** Polite, sophisticated, courteous, dignified  

## Visual Design

**Appearance:**
- Hair: Brown, short, neatly styled
- Eyes: Green
- Age: Young adult
- Build: Well-proportioned, dignified posture

**Outfit:**
- Formal British gentleman attire
- Vest (waistcoat) - classic style
- Dress shirt - well-pressed
- Tie - sophisticated color
- Slacks (dress pants) - tailored
- Dress shoes - polished
- Overall: Refined, classic, well-tailored

**Color Palette:**
- Primary: Browns, greens
- Secondary: Neutrals, earth tones
- Accent: Sophisticated complementary colors
- Overall: Elegant, classic British aesthetic

## Poses (7 Total)

All poses maintain Oliver's refined, gentlemanly character while showing different emotions and actions.

### 1. Idle (1-idle.png)
**Description:** Standing calmly with elegant posture  
**Expression:** Calm smile, gentle  
**Key Features:**
- Upright, dignified stance
- Hands relaxed (at sides or one in pocket)
- Refined appearance
- Confident but gentle

**Prompt File:** `1-idle.txt`

---

### 2. Wave (2-wave.png)
**Description:** Polite, courteous greeting gesture  
**Expression:** Polite smile, friendly  
**Key Features:**
- One hand raised in greeting
- Gentleman's wave (not wild)
- Courteous demeanor
- Warm but formal

**Prompt File:** `2-wave.txt`

---

### 3. Jump (3-jump.png)
**Description:** Jumping with refined joy  
**Expression:** Excited but refined smile  
**Key Features:**
- Mid-air jump
- Maintains composure while expressing joy
- Clothes slightly flowing
- Balanced, controlled movement

**Prompt File:** `3-jump.txt`

---

### 4. Clap (4-clap.png)
**Description:** Sophisticated applause  
**Expression:** Appreciative smile, pleased  
**Key Features:**
- Hands clapping at chest level
- Refined applause gesture
- Showing appreciation gracefully
- Elegant hand position

**Prompt File:** `4-clap.txt`

---

### 5. Spin (5-spin.png)
**Description:** Graceful spinning motion  
**Expression:** Joyful smile, pleased  
**Key Features:**
- Body rotating elegantly
- Vest and tie flowing
- One arm extended
- Maintains refinement while playful

**Prompt File:** `5-spin.txt`

---

### 6. Dance (6-dance.png)
**Description:** Ballroom/waltz-style dancing  
**Expression:** Happy, energetic but refined  
**Key Features:**
- Classical dance pose
- Arms positioned for ballroom dance
- Flowing movement
- Sophisticated, elegant

**Prompt File:** `6-dance.txt`

---

### 7. Pose (7-pose.png)
**Description:** Victory/confident pose  
**Expression:** Confident smile, triumphant  
**Key Features:**
- One hand on hip or adjusting tie
- Other hand in refined victory gesture
- Dignified celebration
- Gentleman's confidence

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
   cd characters/prompts/en/oliver
   cat 1-idle.txt   # Copy prompt
   # → Paste into AI tool
   # → Generate image
   # → Save as: ../../prototype/public/characters/en/oliver/1-idle.png
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
~/projects/Projects/Game/lingotype/prototype/public/characters/en/oliver/
```

## Character Consistency

When generating all 7 images, maintain:

**Consistent Features:**
- Brown hair, short neat style
- Green eyes
- Same facial features
- Same outfit (vest, shirt, tie, slacks, shoes)
- Same art style
- Same color palette

**Variable Features:**
- Pose/stance
- Expression intensity
- Clothing flow (based on movement)
- Arm/leg positions
- Overall energy level

**Refinement Maintained:**
- Always dignified posture
- Never wild or messy
- Sophisticated demeanor
- British gentleman aesthetic
- Elegant movement even in dynamic poses

## Progress Tracking

See `ORDER.txt` for generation checklist.

## Notes

- Oliver represents classic British elegance
- All poses should feel refined, even when energetic
- Think: modern anime interpretation of a young Victorian gentleman
- Avoid modern casual elements
- Maintain sophistication across all poses
- Reference: Elegant anime male characters, British period dramas

## Integration

Once all 7 images are generated:

1. Place in: `prototype/public/characters/en/oliver/`
2. Update: `prototype/src/config/characterImages.ts`
3. Enable: `USE_EXTERNAL_IMAGES = true`
4. Test in game with English language selection

---

**Character designed for:** LingoType Game  
**Target:** English language learners  
**Style:** British charm meets modern anime aesthetics
