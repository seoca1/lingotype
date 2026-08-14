/**
 * OS Keyboard Input Component
 *
 * Uses the OS-provided keyboard/IME instead of custom virtual keyboards.
 * Works on both PC (physical keyboard + IME) and mobile (OS virtual keyboard).
 *
 * Architecture:
 * - Hidden <input> element captures OS keyboard input via native keydown
 * - On mobile: focusing the input triggers the OS virtual keyboard
 * - On PC: physical keyboard events bubble to the input element
 * - IME languages (ja, zh) use OS IME for conversion
 * - lang attribute hints which OS keyboard to show (korean, japanese, etc.)
 *
 * Single input path:
 * - Native keydown → onChar/onBackspace/onEnter prop
 * - No window-level listener (prevents duplicate handling)
 *
 * Imperative handle (via forwardRef):
 * - focus(): refocus the hidden input. Required after clicks on other
 *   elements (e.g., the on-screen canvas keyboard) that may steal focus.
 *   Without this, physical keyboard input stops working until the page
 *   is clicked elsewhere and back.
 */

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { Language } from '../types.js';

interface OSKeyboardInputProps {
  /** Whether the input is enabled (e.g., during gameplay) */
  enabled: boolean;
  /** Game language — controls which OS keyboard layout to request */
  language: Language;
  /** Called when user types a character */
  onChar: (char: string) => void;
  /** Called when user presses Backspace */
  onBackspace: () => void;
  /** Called when user presses Enter */
  onEnter: () => void;
  /** Called when user presses Escape */
  onEscape?: () => void;
  /** Called when Caps Lock is detected during Korean jamo input */
  onCapsLock?: (isOn: boolean) => void;
}

export interface OSKeyboardInputHandle {
  /** Refocus the hidden input. Use after clicks on other elements. */
  focus: () => void;
}

/**
 * Map game language to inputMode for mobile keyboards.
 * 'text' is appropriate for all supported languages since the typing game
 * uses a hidden input with keydown interception — the OS keyboard layout
 * is selected by the physical/IME input, not inputMode.
 */
function getInputMode(_lang: Language): 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search' | undefined {
  return 'text';
}

/**
 * Map game language to BCP 47 language tag for the OS keyboard.
 * Used as the HTML `lang` attribute to hint which OS keyboard layout to show.
 */
function getLangCode(lang: Language): string {
  switch (lang) {
    case 'jp':
      return 'ja';
    case 'kr':
      return 'ko';
    case 'es':
      return 'es';
    case 'fr':
      return 'fr';
    case 'de':
      return 'de';
    case 'zh':
      // Phase 19: 'zh-CN' = Simplified Chinese (pinyin IME); 'zh-TW' = Bopomo.
      return 'zh-CN';
    case 'en':
    default:
      return 'en';
  }
}

export const OSKeyboardInput = forwardRef<OSKeyboardInputHandle, OSKeyboardInputProps>(function OSKeyboardInput({
  enabled,
  language,
  onChar,
  onBackspace,
  onEnter,
  onEscape,
  onCapsLock,
}, ref) {
  const inputRef = useRef<HTMLInputElement>(null);
  const valueResetTimeoutRef = useRef<number | null>(null);

  // Expose imperative focus() so parents can refocus after a click on
  // another element (e.g., the canvas-based virtual keyboard) steals focus
  // away from the hidden input. Without this, physical keyboard input would
  // stop working after the user clicks a special character on the canvas.
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }), []);

  // Focus / blur based on enabled state
  useEffect(() => {
    if (!enabled) {
      inputRef.current?.blur();
      return;
    }
    // Focus the input to trigger OS keyboard on mobile
    // Immediate focus when stage becomes active
    inputRef.current?.focus();
  }, [enabled]);

  // Also focus when component mounts (for LearnScreen and initial load)
  useEffect(() => {
    if (enabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Re-focus when language changes (so OS picks the right keyboard)
  useEffect(() => {
    if (enabled) {
      inputRef.current?.focus();
      // Clear value to avoid stale characters
      if (inputRef.current) inputRef.current.value = '';
    }
  }, [language, enabled]);

  // Handle keydown on the input element directly (no window listener)
  // This is the SINGLE source of truth for key input.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!enabled) return;

    // While IME composition is active, let the IME handle the input
    // (e.g., Japanese kana → kanji conversion)
    if ((e.nativeEvent as KeyboardEvent).isComposing) return;

    // Ignore modifier-only key combos (e.g., Ctrl+C)
    if (e.ctrlKey || e.metaKey || e.altKey) {
      // But still handle Escape even with modifiers
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
      }
      return;
    }

    // Detect Caps Lock for Korean jamo input mode
    if (language === 'kr' && onCapsLock) {
      const capsLockOn = e.getModifierState('CapsLock');
      onCapsLock(capsLockOn);
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      onBackspace();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter();
      return;
    }
    if (e.key === 'Escape' && onEscape) {
      e.preventDefault();
      onEscape();
      return;
    }

    // Single character keys
    if (e.key.length === 1) {
      e.preventDefault();
      onChar(e.key);
    }
  };

  // Handle IME composition end (Japanese, Chinese, etc.)
  // When composition ends, the final text is in e.data
  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    if (!enabled) return;
    const finalText = e.data || '';
    if (finalText) {
      // Each char of the final composed text
      for (const ch of finalText) {
        onChar(ch);
      }
    }
    // Clear the input value
    e.currentTarget.value = '';
  };

  // Reset input value after a key is processed (to avoid stale state)
  const resetInputValue = () => {
    if (inputRef.current) {
      // Clear value on next tick so the keydown has already been processed
      valueResetTimeoutRef.current = window.setTimeout(() => {
        if (inputRef.current) inputRef.current.value = '';
      }, 0);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (valueResetTimeoutRef.current !== null) {
        clearTimeout(valueResetTimeoutRef.current);
      }
    };
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck={false}
      inputMode={getInputMode(language)}
      lang={getLangCode(language)}
      aria-label={`${language} typing input`}
      onKeyDown={(e) => {
        handleKeyDown(e);
        // Clear value after key processing (deferred)
        resetInputValue();
      }}
      onCompositionEnd={handleCompositionEnd}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '1px',
        height: '1px',
        opacity: 0,
        pointerEvents: 'auto',
        zIndex: -1,
      }}
    />
  );
});
