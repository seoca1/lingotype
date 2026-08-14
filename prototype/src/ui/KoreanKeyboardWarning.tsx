import { useState, useEffect, useCallback, useRef } from 'react';
import { KOREAN_KEYBOARD_LAYOUT } from '../utils/keyboardLayout.js';

interface KoreanKeyboardWarningProps {
  onDismiss: () => void;
  onContinue: () => void;
}

export function KoreanKeyboardWarning({ onDismiss, onContinue }: KoreanKeyboardWarningProps) {
  const [detectedEnglish, setDetectedEnglish] = useState(false);
  const [typedKeys, setTypedKeys] = useState<string[]>([]);
  // Phase 25: focus management — auto-focus the dismiss button on mount,
  // restore prior focus on unmount. Mirrors the WeakWordModal (Phase 17)
  // and OptionsScreen (Phase 14) dialog pattern.
  const dismissButtonRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const char = e.key.toLowerCase();
      setTypedKeys(prev => {
        const next = [...prev, char].slice(-5);
        return next;
      });
    } else if (e.key === 'Enter' || e.key === ' ') {
      onContinue();
    }
  }, [onContinue]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    // Phase 25: remember the previously focused element so we can restore it
    // when this blocking modal closes.
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    // Phase 25: land focus on the dismiss button — gives keyboard users an
    // obvious starting point and matches the WeakWordModal / OptionsScreen
    // dialog pattern. SR users hear the modal label first, then the focused
    // button label.
    dismissButtonRef.current?.focus();

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        e.preventDefault();
        onDismiss();
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const char = e.key.toLowerCase();
        setTypedKeys(prev => {
          const next = [...prev, char].slice(-5);
          return next;
        });
      } else if (e.key === 'Enter' || e.key === ' ') {
        onContinue();
      } else if (e.key === 'Tab' && containerRef.current) {
        // Phase 25: Tab focus trap — keep Tab cycling between the dismiss and
        // continue buttons so keyboard users can't escape the blocking modal.
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
    };

    document.addEventListener('keydown', handler, true);
    return () => {
      document.removeEventListener('keydown', handler, true);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [handleKeyDown, onDismiss, onContinue]);

  useEffect(() => {
    const recentKeys = typedKeys.slice(-3);
    const isEnglish = recentKeys.every(c => /^[a-z]$/.test(c));
    setDetectedEnglish(isEnglish && recentKeys.length >= 2);
  }, [typedKeys]);

  return (
    <div
      className="keyboard-warning-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kr-keyboard-warning-title"
    >
      <div className="keyboard-warning-modal" ref={containerRef}>
        <div className="keyboard-warning-header">
          <span className="warning-icon" aria-hidden="true">⌨️</span>
          <h2 id="kr-keyboard-warning-title">한국어 키보드 필요</h2>
        </div>

        {detectedEnglish && (
          <div
            className="keyboard-warning-alert"
            role="alert"
            aria-label="English keyboard detected, please switch to Korean keyboard"
          >
            ⚠️ 영어 키보드로 감지됨. 한글 키보드로 전환하세요.
          </div>
        )}

        <p className="keyboard-warning-desc">
          이 스테이지를 플레이하려면 <strong>한국어(한글) 키보드</strong>가 필요합니다.
          한글 2벌식 키보드에서 자모를 직접 입력하세요.
        </p>

        <div className="keyboard-layout-preview" aria-hidden="true">
          <h3>한글 키보드 자판</h3>
          <div className="keyboard-row">
            {KOREAN_KEYBOARD_LAYOUT.row1.map(k => (
              <div key={k.key} className="keyboard-key">
                <span className="key-en">{k.en}</span>
                <span className="key-ko">{k.ko}</span>
              </div>
            ))}
          </div>
          <div className="keyboard-row">
            {KOREAN_KEYBOARD_LAYOUT.row2.map(k => (
              <div key={k.key} className="keyboard-key">
                <span className="key-en">{k.en}</span>
                <span className="key-ko">{k.ko}</span>
              </div>
            ))}
          </div>
          <div className="keyboard-row">
            {KOREAN_KEYBOARD_LAYOUT.row3.map(k => (
              <div key={k.key} className="keyboard-key">
                <span className="key-en">{k.en}</span>
                <span className="key-ko">{k.ko}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="keyboard-warning-example" aria-hidden="true">
          <h3>예시</h3>
          <div className="example-row">
            <span className="example-expected">한</span>
            <span className="example-keys">ㅎ + ㅏ + ㄴ</span>
            <span className="example-physical">HJK (영문)</span>
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

        <p className="keyboard-warning-hint">
          Mac: 시스템 설정 → 키보드 → 입력 소스에서 한국어 추가<br/>
          Windows: 설정 → 시간 및 언어 → 언어에서 한국어 추가
        </p>
      </div>
    </div>
  );
}
