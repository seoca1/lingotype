/**
 * Virtual Keyboard for Mobile Devices
 */

import { useState } from 'react';
import type { Language } from '../types.js';

interface VirtualKeyboardProps {
  language: Language;
  onKeyPress: (key: string) => void;
  expectedChar?: string | null;
}

const LAYOUTS: Record<Language, string[][]> = {
  en: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ],
  jp: [
    ['a', 'i', 'u', 'e', 'o'],
    ['k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w'],
    ['g', 'z', 'd', 'b', 'p'],
  ],
  es: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    ['á', 'é', 'í', 'ó', 'ú', '¿', '¡'], // Accent row
  ],
  kr: [
    // 2-beol (두벌식) 자음 배열
    ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'],
    // 2-beol 모음 배열
    ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'],
    // 복합모음
    ['ㅐ', 'ㅒ', 'ㅔ', 'ㅖ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅢ'],
  ],
};

export function VirtualKeyboard({ language, onKeyPress, expectedChar }: VirtualKeyboardProps) {
  const [shift, setShift] = useState(false);
  const layout = LAYOUTS[language] || LAYOUTS.en;

  const handleKeyClick = (key: string) => {
    // Korean/ES: no shift (Korean has no case, ES uses accent row)
    // English/JP: apply shift for uppercase
    const finalKey = shift && language !== 'es' && language !== 'kr' ? key.toUpperCase() : key;
    onKeyPress(finalKey);
    if (shift && language !== 'es' && language !== 'kr') setShift(false);
  };

  const handleBackspace = () => {
    onKeyPress('Backspace');
  };

  const handleEnter = () => {
    onKeyPress('Enter');
  };

  const handleSpace = () => {
    onKeyPress(' ');
  };

  const isKorean = language === 'kr';

  // Phase 25: helper to build an accessible key label so SR users hear
  // "key K" rather than just "K", and the expected key announces itself.
  const keyAriaLabel = (displayKey: string, isExpected: boolean): string => {
    const base = `key ${displayKey}`;
    return isExpected ? `${base}, expected next` : base;
  };

  return (
    <div className="virtual-keyboard" role="group" aria-label="Virtual keyboard">
      {layout.map((row, rowIndex) => (
        <div key={rowIndex} className={`keyboard-row ${isKorean && rowIndex === 2 ? 'keyboard-row-kr-vowels' : ''}`}>
          {row.map((key) => {
            const displayKey = shift && language !== 'es' && language !== 'kr' ? key.toUpperCase() : key;
            const isExpected = expectedChar && displayKey.toLowerCase() === expectedChar.toLowerCase();

            return (
              <button
                key={key}
                className={`key ${isExpected ? 'key-expected' : ''} ${isKorean ? 'key-kr' : ''}`}
                onClick={() => handleKeyClick(key)}
                aria-label={keyAriaLabel(displayKey, !!isExpected)}
                aria-pressed={isExpected ? 'true' : undefined}
              >
                {displayKey}
              </button>
            );
          })}
        </div>
      ))}
      <div className="keyboard-row keyboard-controls">
        {!isKorean && (
          <button
            className="key key-shift"
            onClick={() => setShift(!shift)}
            aria-label={shift ? 'Shift, on' : 'Shift, off'}
            aria-pressed={shift}
          >
            {shift ? '⬆' : '⇧'}
          </button>
        )}
        <button className="key key-space" onClick={handleSpace} aria-label="Space">
          Space
        </button>
        <button className="key key-backspace" onClick={handleBackspace} aria-label="Backspace">
          ⌫
        </button>
        <button className="key key-enter" onClick={handleEnter} aria-label="Enter">
          Enter
        </button>
      </div>
    </div>
  );
}
