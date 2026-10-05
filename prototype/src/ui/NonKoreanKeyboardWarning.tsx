import { useEffect, useCallback, useRef } from 'react';
import { ENGLISH_KEYBOARD_LAYOUT } from '../utils/keyboardLayout.js';

interface NonKoreanKeyboardWarningProps {
  onDismiss: () => void;
  onContinue: () => void;
}

export function NonKoreanKeyboardWarning({ onDismiss, onContinue }: NonKoreanKeyboardWarningProps) {
  // Phase 25: focus management — auto-focus the dismiss button on mount,
  // restore prior focus on unmount. Mirrors the WeakWordModal (Phase 17),
  // OptionsScreen (Phase 14), and KoreanKeyboardWarning (Phase 25) pattern.
  const dismissButtonRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onDismiss();
    } else if (e.key === 'Enter' || e.key === ' ') {
      onContinue();
    } else if (e.key === 'Tab' && containerRef.current) {
      // Phase 25: Tab focus trap — keep Tab cycling between dismiss/continue.
      const focusable = containerRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onDismiss, onContinue]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    // Phase 25: remember previously-focused element for restoration on close.
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    dismissButtonRef.current?.focus();

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [handleKeyDown]);

  return (
    <div
      className="keyboard-warning-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nonkr-keyboard-warning-title"
    >
      <div className="keyboard-warning-modal" ref={containerRef}>
        <div className="keyboard-warning-header">
          <span className="warning-icon" aria-hidden="true">⌨️</span>
          <h2 id="nonkr-keyboard-warning-title">키보드 입력 불일치</h2>
        </div>

        <div
          className="keyboard-warning-alert"
          role="alert"
          aria-label="Korean keyboard input detected on a non-Korean stage"
        >
          ⚠️ 한국어 키보드 입력이 감지되었습니다.
        </div>

        <p className="keyboard-warning-desc">
          이 언어(<strong>EN/JP/ES</strong>)는 <strong>영문 키보드</strong>로 입력해야 합니다.
          영어/일본어/스페인어 문자를 직접 타이핑하세요.
        </p>

        <div className="keyboard-layout-preview" aria-hidden="true">
          <h3>영문 키보드 자판</h3>
          <div className="keyboard-row">
            {ENGLISH_KEYBOARD_LAYOUT.row1.map(k => (
              <div key={k} className="keyboard-key">
                <span className="key-en">{k.toUpperCase()}</span>
              </div>
            ))}
          </div>
          <div className="keyboard-row">
            {ENGLISH_KEYBOARD_LAYOUT.row2.map(k => (
              <div key={k} className="keyboard-key">
                <span className="key-en">{k.toUpperCase()}</span>
              </div>
            ))}
          </div>
          <div className="keyboard-row">
            {ENGLISH_KEYBOARD_LAYOUT.row3.map(k => (
              <div key={k} className="keyboard-key">
                <span className="key-en">{k.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="keyboard-warning-example" aria-hidden="true">
          <h3>일본어 예시</h3>
          <div className="example-row">
            <span className="example-expected">konnichiwa</span>
            <span className="example-keys">영문 키보드</span>
            <span className="example-physical">k-o-n-n-i-c-h-i-w-a</span>
          </div>
        </div>

        <div className="keyboard-warning-actions">
          <button
            ref={dismissButtonRef}
            onClick={onDismiss}
            className="warning-btn warning-btn-secondary"
            aria-label="Back to menu (Escape)"
          >
            메뉴로 돌아가기 (Esc)
          </button>
          <button
            onClick={onContinue}
            className="warning-btn warning-btn-primary"
            aria-label="Continue to stage (Enter)"
          >
            계속 진행 (Enter)
          </button>
        </div>
      </div>
    </div>
  );
}
