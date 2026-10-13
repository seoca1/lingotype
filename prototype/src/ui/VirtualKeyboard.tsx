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
    ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],
    ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
    ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ'],
  ],
};

export function VirtualKeyboard({ language, onKeyPress, expectedChar }: VirtualKeyboardProps) {
  const [shift, setShift] = useState(false);
  const layout = LAYOUTS[language] || LAYOUTS.en;

  const handleKeyClick = (key: string) => {
    // Spanish: shift disabled (accent row handles accents directly)
    // Other languages: apply shift
    const finalKey = shift && language !== 'es' ? key.toUpperCase() : key;
    onKeyPress(finalKey);
    if (shift && language !== 'es') setShift(false); // Auto-unshift after key press
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

  const keyAriaLabel = (displayKey: string, isExpected: boolean): string => {
    const base = `key ${displayKey}`;
    return isExpected ? `${base}, expected next` : base;
  };

  return (
    <div className="virtual-keyboard" role="group" aria-label="Virtual keyboard">
      {layout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            const displayKey = shift ? key.toUpperCase() : key;
            const isExpected = expectedChar && displayKey.toLowerCase() === expectedChar.toLowerCase();
            
            return (
              <button
                key={key}
                className={`key ${isExpected ? 'key-expected' : ''}`}
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
        <button className="key key-shift" onClick={() => setShift(!shift)} aria-label={shift ? 'Shift, on' : 'Shift, off'} aria-pressed={shift}>
          {shift ? '⬆' : '⇧'}
        </button>
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
      <style>{`
        /* Phase 38: visible focus indicator for keyboard users tabbing
           through the virtual keys. */
        .virtual-keyboard .key:focus-visible {
          outline: 2px solid #00d9ff;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
