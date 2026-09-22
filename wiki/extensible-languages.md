# Extensible Language System

> **Status**: ✅ Implemented (2026-06-18)  
> **Category**: Architecture · Language Support  
> **Related**: [[languages/english]], [[languages/japanese]], [[languages/spanish]], [[languages/korean]]

## Overview

게임이 **동적으로 확장 가능한 언어 시스템**으로 리팩토링되었습니다. 새로운 언어를 추가하려면 코드 수정 없이 **언어 설정 파일만 등록**하면 됩니다.

## Architecture

### Before (Hardcoded)
```typescript
// ❌ 하드코딩된 타입
export type Language = 'en' | 'jp' | 'es' | 'kr';

// ❌ App.tsx에서 언어별 분기
if (stage.language === 'en') { ... }
else if (stage.language === 'jp') { ... }
```

### After (Extensible)
```typescript
// ✅ 동적 타입
export type Language = string;

// ✅ 레지스트리에서 조회
const langConfig = getLanguage(stage.language);
const corpus = langConfig.corpus.words;
```

## Language Registry

### Core Interface

```typescript
interface LanguageConfig {
  code: string;                       // 'en', 'jp', 'es', 'kr', 'fr', 'zh'...
  name: string;                       // 'English', 'Japanese'...
  nativeName: string;                 // '日本語', 'Español'...
  inputDescription: string;           // 입력 방식 설명
  createHandler: () => InputHandler;  // InputHandler 생성자
  supportsTier0: boolean;             // 문자 단위 지원 여부
  corpus: {
    words: WordEntry[];
    sentences: WordEntry[];
    chars?: Record<string, WordEntry[]>;
  };
  icon?: string;                      // UI 아이콘
  themeColor?: string;                // 테마 색상
}
```

### Registration

```typescript
// src/language/languages/english.ts
export const ENGLISH_CONFIG: LanguageConfig = {
  code: 'en',
  name: 'English',
  nativeName: 'English',
  inputDescription: 'Standard QWERTY keyboard',
  createHandler: () => new EnglishHandler(),
  supportsTier0: false,
  corpus: {
    words: EN_WORDS,
    sentences: EN_SENTENCES,
  },
  themeColor: '#4A90E2',
};

// src/language/index.ts
import { registerLanguage } from './LanguageRegistry.js';
import { ENGLISH_CONFIG } from './languages/english.js';

registerLanguage(ENGLISH_CONFIG);
```

## Adding a New Language

### Step 1: Create Input Handler

```typescript
// src/input/FrenchHandler.ts
import { BaseInputHandler } from './InputHandler.js';

export class FrenchHandler extends BaseInputHandler {
  handleKey(event: KeyboardEvent): MatchResult {
    // 악센트 처리 로직
    const key = event.key;
    if (key === 'e' && this.target.includes('é')) {
      // ASCII fallback: e → é
      this.buffer += 'é';
    } else {
      this.buffer += key;
    }
    return this.match();
  }
}
```

### Step 2: Create Corpus Data

```typescript
// src/data/corpus.ts
export const FR_WORDS: WordEntry[] = [
  { id: 'fr_001', display: 'bonjour', meaning: 'hello', level: 1, category: 'greeting' },
  { id: 'fr_002', display: 'merci', meaning: 'thank you', level: 1, category: 'greeting' },
  // ...
];

export const FR_SENTENCES: WordEntry[] = [
  { id: 'frs_001', display: 'Comment allez-vous?', level: 3, category: 'greeting' },
  // ...
];
```

### Step 3: Create Language Config

```typescript
// src/language/languages/french.ts
import { FrenchHandler } from '../../input/FrenchHandler.js';
import { FR_WORDS, FR_SENTENCES } from '../../data/corpus.js';
import type { LanguageConfig } from '../LanguageRegistry.js';

export const FRENCH_CONFIG: LanguageConfig = {
  code: 'fr',
  name: 'French',
  nativeName: 'Français',
  inputDescription: 'Accented characters (é, è, ê, à) with fallback',
  createHandler: () => new FrenchHandler(),
  supportsTier0: false,
  corpus: {
    words: FR_WORDS,
    sentences: FR_SENTENCES,
  },
  themeColor: '#0055A4',
  icon: '🇫🇷',
};
```

### Step 4: Register Language

```typescript
// src/language/index.ts
import { FRENCH_CONFIG } from './languages/french.js';

registerLanguage(FRENCH_CONFIG);
```

### Step 5: Create Stages

```typescript
// src/data/stages.ts
const FR_STAGES: StageSpec[] = [
  {
    id: 'fr_1_1',
    language: 'fr',
    tier: 1,
    name: 'Premiers Mots',
    description: 'Basic French words',
    difficulty: 1,
    wordCount: 10,
    corpusFilter: { minLevel: 1, maxLevel: 1 },
    missions: defaultMissionsForTier(1),
  },
  // ...
];

const ALL_STAGE_SPECS = [
  ...EN_STAGES,
  ...JP_STAGES,
  ...ES_STAGES,
  ...KR_STAGES,
  ...FR_STAGES,  // ✅ Add here
];
```

### Step 6: (Optional) Add Character Appearance

```typescript
// src/character/CharacterData.ts
export const CULTURAL_APPEARANCES: Record<string, CulturalAppearance> = {
  // ...
  fr: {
    hairStyle: 'bob',
    hairColor: '#8b4513',
    skinColor: '#ffe4d6',
    outfitType: 'beret',
    outfitPrimary: '#0055A4',
    outfitSecondary: '#ffffff',
    outfitAccent: '#EF4135',
  },
};
```

## Benefits

### ✅ Extensibility
새로운 언어 추가 시 기존 코드 수정 불필요

### ✅ Consistency
모든 언어가 동일한 인터페이스 사용

### ✅ Type Safety
TypeScript 타입 시스템으로 런타임 오류 방지

### ✅ Testability
각 언어를 독립적으로 테스트 가능

### ✅ Maintainability
언어별 로직이 명확히 분리됨

## Example Languages to Add

### Priority 1 (Similar to existing)
- **French (fr)**: Accent characters, similar to Spanish
- **German (de)**: Umlauts (ä, ö, ü, ß)
- **Italian (it)**: Accent characters

### Priority 2 (Different script)
- **Chinese (zh)**: Pinyin → Hanzi (similar to Japanese romaji→kanji)
- **Russian (ru)**: Cyrillic keyboard layout
- **Arabic (ar)**: RTL (right-to-left) support needed

### Priority 3 (Complex)
- **Thai (th)**: Tonal marks, no spaces
- **Vietnamese (vi)**: Multiple diacritics per character
- **Hebrew (he)**: RTL, vowel points

## Migration Checklist

When adding a new language:

- [ ] Create InputHandler (`src/input/{Lang}Handler.ts`)
- [ ] Add corpus data (`src/data/corpus.ts` - `{LANG}_WORDS`, `{LANG}_SENTENCES`)
- [ ] Create LanguageConfig (`src/language/languages/{lang}.ts`)
- [ ] Register in `src/language/index.ts`
- [ ] Create stages (`src/data/stages.ts` - `{LANG}_STAGES`)
- [ ] Add to `ALL_STAGE_SPECS`
- [ ] (Optional) Add character appearance (`src/character/CharacterData.ts`)
- [ ] (Optional) Add tutorial content (`src/ui/Tutorial.tsx` - `TUTORIAL_STEPS`)
- [ ] Run `npm run typecheck`
- [ ] Run `npm run build`
- [ ] Run `npm test`
- [ ] Update `wiki/languages/{lang}.md`

## Files Modified (2026-06-18)

### New Files
- `src/language/LanguageRegistry.ts` - Core registry system
- `src/language/languages/english.ts` - English config
- `src/language/languages/japanese.ts` - Japanese config
- `src/language/languages/spanish.ts` - Spanish config
- `src/language/languages/korean.ts` - Korean config
- `src/language/languages/french.example.ts` - Example template
- `src/language/index.ts` - Entry point

### Modified Files
- `src/types.ts` - `Language` type changed to `string`
- `src/character/CharacterData.ts` - `LanguageKey` type changed to `string`
- `src/data/stages.ts` - `stagesByTier()` accepts `string`
- `src/ui/Menu.tsx` - Uses `getAllLanguages()` for dynamic rendering
- `src/App.tsx` - Uses `getLanguage()` for corpus selection

### Build Results
- ✅ Type check: Passed
- ✅ Build: 252.73 KB (gzip 77.28 KB)
- ✅ Tests: 99/100 passed + 1 skipped

## See Also

- [[languages/english]] - English language profile
- [[languages/japanese]] - Japanese language profile  
- [[languages/spanish]] - Spanish language profile
- [[languages/korean]] - Korean language profile
- `src/language/languages/french.example.ts` - New language template
- `decisions/0011-extensible-languages.md` - Architecture decision record
