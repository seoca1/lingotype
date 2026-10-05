/**
 * Keyboard Layout Detection Utility
 *
 * Detects the current OS keyboard layout (Korean, English, etc.)
 * Uses navigator.keyboard API when available, falls back to heuristics.
 */

export type KeyboardLayout = 'ko' | 'en' | 'jp' | 'es' | 'other';

const KOREAN_CONSONANTS = new Set([
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
]);

const KOREAN_VOWELS = new Set([
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
  'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ',
]);

export function isKoreanCharacter(char: string): boolean {
  return KOREAN_CONSONANTS.has(char) || KOREAN_VOWELS.has(char);
}

/**
 * Detect keyboard layout using navigator.keyboard API (Chrome 89+).
 * Returns null if API is not available.
 */
export async function detectKeyboardLayoutAsync(): Promise<KeyboardLayout | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const keyboard = (navigator as any).keyboard;
  if (!keyboard) {
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const layoutMap = await (keyboard as any).getKeyboardLayoutMap();
    const keyQ = layoutMap.get('KeyQ');
    const keyA = layoutMap.get('KeyA');

    if (keyQ === 'ㅂ' && keyA === 'ㅁ') {
      return 'ko';
    }
    if (keyQ === 'q' && keyA === 'a') {
      return 'en';
    }
    if (keyQ === 'q' && keyA === 'ぬ') {
      return 'jp';
    }

    return 'other';
  } catch {
    return null;
  }
}

/**
 * Korean 2-beol keyboard layout for display.
 * Maps QWERTY position to Korean character.
 */
export const KOREAN_KEYBOARD_LAYOUT = {
  row1: [
    { key: 'Q', ko: 'ㅂ', en: 'q' },
    { key: 'W', ko: 'ㅈ', en: 'w' },
    { key: 'E', ko: 'ㄷ', en: 'e' },
    { key: 'R', ko: 'ㄱ', en: 'r' },
    { key: 'T', ko: 'ㅅ', en: 't' },
    { key: 'Y', ko: 'ㅛ', en: 'y' },
    { key: 'U', ko: 'ㅕ', en: 'u' },
    { key: 'I', ko: 'ㅑ', en: 'i' },
    { key: 'O', ko: 'ㅐ', en: 'o' },
    { key: 'P', ko: 'ㅔ', en: 'p' },
  ],
  row2: [
    { key: 'A', ko: 'ㅁ', en: 'a' },
    { key: 'S', ko: 'ㄴ', en: 's' },
    { key: 'D', ko: 'ㅇ', en: 'd' },
    { key: 'F', ko: 'ㄹ', en: 'f' },
    { key: 'G', ko: 'ㅎ', en: 'g' },
    { key: 'H', ko: 'ㅗ', en: 'h' },
    { key: 'J', ko: 'ㅓ', en: 'j' },
    { key: 'K', ko: 'ㅏ', en: 'k' },
    { key: 'L', ko: 'ㅣ', en: 'l' },
  ],
  row3: [
    { key: 'Z', ko: 'ㅋ', en: 'z' },
    { key: 'X', ko: 'ㅌ', en: 'x' },
    { key: 'C', ko: 'ㅊ', en: 'c' },
    { key: 'V', ko: 'ㅍ', en: 'v' },
    { key: 'B', ko: 'ㅠ', en: 'b' },
    { key: 'N', ko: 'ㅜ', en: 'n' },
    { key: 'M', ko: 'ㅡ', en: 'm' },
  ],
};

export const ENGLISH_KEYBOARD_LAYOUT = {
  row1: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  row2: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  row3: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
};
