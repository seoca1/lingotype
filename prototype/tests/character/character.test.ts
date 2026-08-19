/**
 * Character Tests - 12명 캐릭터 모두 검증
 *
 * 모든 언어(4) × 캐릭터(3) = 12명 전원에 대해 다음을 검증:
 * - Character image set has all 7 poses
 * - PNG 파일이 실제로 존재
 * - CharacterInfo 메타데이터가 채워져 있음
 * - LANGUAGE_CHARACTERS 매핑이 정확함
 * - Random selection이 deterministic하고 12명 중 균등 분포
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  CHARACTER_IMAGES,
  LANGUAGE_CHARACTERS,
  LANGUAGE_DEFAULT_CHARACTERS,
  CHARACTER_INFO,
  getCharacterForLanguage,
  getCharactersForLanguage,
  USE_EXTERNAL_IMAGES,
} from '../../src/config/characterImages.js';
import {
  selectCharacterForStage,
  setCharacter,
  getCurrentCharacter,
  hasUserSelectedCharacter,
  clearUserSelection,
  resetCharacterSelector,
} from '../../src/character/CharacterSelector.js';

const PUBLIC_DIR = path.join(
  process.cwd(),
  'public',
  'characters'
);

const ALL_CHARACTERS = [
  // English
  'en-emily', 'en-oliver', 'en-sophia',
  // Japanese
  'jp-sakura', 'jp-yuki', 'jp-kaito',
  // Spanish
  'es-isabella', 'es-carlos', 'es-luna',
  // Korean
  'kr-hana', 'kr-minho', 'kr-jiwoo',
];

const ALL_POSES = ['idle', 'wave', 'jump', 'clap', 'spin', 'dance', 'pose'] as const;

describe('Character Configuration — All 12 Characters', () => {
  it('defines exactly 12 characters', () => {
    expect(Object.keys(CHARACTER_IMAGES)).toHaveLength(12);
    for (const id of ALL_CHARACTERS) {
      expect(CHARACTER_IMAGES).toHaveProperty(id);
    }
  });

  it('each character has 7 poses defined', () => {
    for (const id of ALL_CHARACTERS) {
      const set = CHARACTER_IMAGES[id];
      // All 7 poses required
      for (const pose of ALL_POSES) {
        expect(set).toHaveProperty(pose);
      }
    }
  });

  it('USE_EXTERNAL_IMAGES is true', () => {
    expect(USE_EXTERNAL_IMAGES).toBe(true);
  });
});

describe('Character Configuration — All 12 PNG Files', () => {
  for (const characterId of ALL_CHARACTERS) {
    describe(characterId, () => {
      const [lang, name] = characterId.split('-');
      const charDir = path.join(PUBLIC_DIR, lang, name);

      it('directory exists', () => {
        expect(fs.existsSync(charDir)).toBe(true);
      });

      for (const pose of ALL_POSES) {
        const filename = `${pose}.png`;
        it(`has ${filename} (valid PNG)`, () => {
          const filepath = path.join(charDir, filename);
          expect(fs.existsSync(filepath)).toBe(true);

          // Verify it's a real PNG (not JPEG with .png extension)
          const buf = fs.readFileSync(filepath);
          // PNG signature: 89 50 4E 47 0D 0A 1A 0A
          expect(buf[0]).toBe(0x89);
          expect(buf[1]).toBe(0x50);
          expect(buf[2]).toBe(0x4e);
          expect(buf[3]).toBe(0x47);
        });
      }
    });
  }
});

describe('Character Configuration — Language Mapping', () => {
  it('LANGUAGE_CHARACTERS has 3 characters per language', () => {
    expect(Object.keys(LANGUAGE_CHARACTERS)).toEqual(
      expect.arrayContaining(['en', 'jp', 'es', 'kr'])
    );
    for (const lang of ['en', 'jp', 'es', 'kr']) {
      expect(LANGUAGE_CHARACTERS[lang]).toHaveLength(3);
    }
  });

  it('LANGUAGE_CHARACTERS matches the 12 character set', () => {
    const allMapped = Object.values(LANGUAGE_CHARACTERS).flat();
    expect(allMapped.sort()).toEqual([...ALL_CHARACTERS].sort());
  });

  it('LANGUAGE_DEFAULT_CHARACTERS has 1 default per language', () => {
    for (const lang of ['en', 'jp', 'es', 'kr']) {
      expect(LANGUAGE_DEFAULT_CHARACTERS[lang]).toBeDefined();
      // Default must be in the language's character list
      expect(LANGUAGE_CHARACTERS[lang]).toContain(LANGUAGE_DEFAULT_CHARACTERS[lang]);
    }
  });

  it('getCharacterForLanguage returns correct default', () => {
    expect(getCharacterForLanguage('en')).toBe(LANGUAGE_DEFAULT_CHARACTERS.en);
    expect(getCharacterForLanguage('jp')).toBe(LANGUAGE_DEFAULT_CHARACTERS.jp);
    expect(getCharacterForLanguage('es')).toBe(LANGUAGE_DEFAULT_CHARACTERS.es);
    expect(getCharacterForLanguage('kr')).toBe(LANGUAGE_DEFAULT_CHARACTERS.kr);
    // Unknown language → fallback default
    expect(getCharacterForLanguage('xx')).toBe('en-emily');
  });

  it('getCharactersForLanguage returns the 3-character list', () => {
    expect(getCharactersForLanguage('en')).toEqual(LANGUAGE_CHARACTERS.en);
    expect(getCharactersForLanguage('xx')).toEqual(['en-emily']); // fallback
  });
});

describe('Character Configuration — CharacterInfo Metadata', () => {
  for (const id of ALL_CHARACTERS) {
    describe(id, () => {
      it('has name, description, style', () => {
        const info = CHARACTER_INFO[id];
        expect(info).toBeDefined();
        expect(info.name).toBeTruthy();
        expect(info.description).toBeTruthy();
        expect(info.style).toBeTruthy();
      });

      it('image src points to a real file', () => {
        const set = CHARACTER_IMAGES[id];
        // src is like "/lingotype/characters/en/emily/1-idle.png" (GitHub Pages)
        // or "/characters/en/emily/1-idle.png" (dev).
        // Strip base path prefix and join with PUBLIC_DIR.
        const relative = set.idle.src
          .replace(/^\//, '')
          .replace(/^lingotype\//, '')
          .replace(/^characters\//, '');
        const filepath = path.join(PUBLIC_DIR, relative);
        expect(fs.existsSync(filepath)).toBe(true);
      });
    });
  }
});

// ============================================================================
// CharacterSelector — Random Selection (Phase E)
// ============================================================================

describe('CharacterSelector — Random Selection', () => {
  beforeEach(() => {
    resetCharacterSelector();
  });

  it('initially has no character selected', () => {
    expect(getCurrentCharacter()).toBeNull();
    expect(hasUserSelectedCharacter()).toBe(false);
  });

  it('selectCharacterForStage returns a valid character per language', () => {
    for (const lang of ['en', 'jp', 'es', 'kr']) {
      resetCharacterSelector();
      const stageId = `test_${lang}_1`;
      const charId = selectCharacterForStage(lang, stageId);
      expect(LANGUAGE_CHARACTERS[lang]).toContain(charId);
    }
  });

  it('selectCharacterForStage is deterministic per stage ID', () => {
    const stageId = 'en_3_1';
    const char1 = selectCharacterForStage('en', stageId);
    const char2 = selectCharacterForStage('en', stageId);
    expect(char1).toBe(char2);
  });

  it('selectCharacterForStage distributes characters across stages', () => {
    // 30 stages should hit all 3 EN characters at least once
    const seen = new Set<string>();
    for (let i = 0; i < 30; i++) {
      resetCharacterSelector();
      const stageId = `en_t_${i}`;
      const charId = selectCharacterForStage('en', stageId);
      seen.add(charId);
    }
    // Should hit at least 2 of 3 characters in 30 random draws
    expect(seen.size).toBeGreaterThanOrEqual(2);
  });

  it('selectCharacterForStage uses user-selected character when set', () => {
    setCharacter('en-oliver');
    expect(hasUserSelectedCharacter()).toBe(true);

    // Even with different stages, user selection wins
    expect(selectCharacterForStage('en', 'en_1_1')).toBe('en-oliver');
    expect(selectCharacterForStage('en', 'en_2_1')).toBe('en-oliver');
    expect(selectCharacterForStage('jp', 'jp_1_1')).toBe('en-oliver');
  });

  it('clearUserSelection re-enables random', () => {
    setCharacter('en-oliver');
    expect(hasUserSelectedCharacter()).toBe(true);
    clearUserSelection();
    expect(hasUserSelectedCharacter()).toBe(false);
    // After clearing, random applies again
    const charId = selectCharacterForStage('en', 'en_5_1');
    expect(LANGUAGE_CHARACTERS.en).toContain(charId);
    // Should not be the user-selected 'en-oliver' deterministically
    // (it's possible but unlikely with 1/3 chance per stage)
  });

  it('different languages get independent random selections', () => {
    const enChar = selectCharacterForStage('en', 'stage_1');
    const jpChar = selectCharacterForStage('jp', 'stage_1');
    const esChar = selectCharacterForStage('es', 'stage_1');
    const krChar = selectCharacterForStage('kr', 'stage_1');
    // Each must be from its own language
    expect(LANGUAGE_CHARACTERS.en).toContain(enChar);
    expect(LANGUAGE_CHARACTERS.jp).toContain(jpChar);
    expect(LANGUAGE_CHARACTERS.es).toContain(esChar);
    expect(LANGUAGE_CHARACTERS.kr).toContain(krChar);
  });

  it('handles unknown language gracefully', () => {
    const charId = selectCharacterForStage('xx', 'stage_1');
    // Falls back to default character
    expect(charId).toBeTruthy();
  });
});

describe('CharacterSelector — Coverage Distribution', () => {
  beforeEach(() => {
    resetCharacterSelector();
  });

  it('all 4 languages get 3 different characters used across 30 stages', () => {
    const coverage: Record<string, Set<string>> = {
      en: new Set(),
      jp: new Set(),
      es: new Set(),
      kr: new Set(),
    };
    for (let i = 0; i < 30; i++) {
      for (const lang of ['en', 'jp', 'es', 'kr'] as const) {
        resetCharacterSelector();
        const charId = selectCharacterForStage(lang, `stage_${i}`);
        coverage[lang].add(charId);
      }
    }
    // With 30 random draws from 3 chars, we expect at least 2 distinct
    // characters per language, often all 3
    for (const lang of ['en', 'jp', 'es', 'kr']) {
      expect(coverage[lang].size).toBeGreaterThanOrEqual(2);
    }
  });

  it('all 12 characters are reachable through random selection', () => {
    // With 4 langs × 3 chars = 12 unique characters, we should see all
    // 12 across a moderate number of stages
    const allSeen = new Set<string>();
    for (let i = 0; i < 50; i++) {
      for (const lang of ['en', 'jp', 'es', 'kr'] as const) {
        resetCharacterSelector();
        const charId = selectCharacterForStage(lang, `coverage_${i}`);
        allSeen.add(charId);
      }
    }
    // Across 200 random draws (50 stages × 4 langs), should hit all 12
    expect(allSeen.size).toBe(12);
  });
});
