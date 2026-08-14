/**
 * OptionsScreen — Phase 10 UX polish
 *
 * Accessible from the main menu between Settings and the language/stage
 * navigation. Persists via localStorage through optionsStorage.
 *
 * Options:
 * - Display: per-character highlighting in the stage screen
 * - Sound: BGM/SFX on/off (UI placeholder for future BGM; SFX already
 *   controlled by AudioManager and toggled through this screen)
 * - Difficulty: scoring/threshold preference
 */

import { useEffect, useRef, useState } from 'react';
import type { DifficultyPreference, Options } from '../types.js';
import {
  DEFAULT_OPTIONS,
  loadOptions,
  saveOptions,
} from '../state/optionsStorage.js';
import { getAudioManager } from '../audio/AudioManager.js';

interface OptionsScreenProps {
  onClose: () => void;
}

const DIFFICULTY_LABELS: Record<DifficultyPreference, string> = {
  easy: 'EASY',
  normal: 'NORMAL',
  hard: 'HARD',
};

export function OptionsScreen({ onClose }: OptionsScreenProps) {
  const [options, setOptions] = useState<Options>(() => loadOptions());
  // Phase 14: track the most recent save failure so the UI can surface it
  // without crashing. saveOptions already catches + logs; we mirror the
  // flag here so save state and UI feedback stay in sync.
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  // Phase 19: surface a transient "reset" toast so users know the silent
  // resetToDefaults() call actually ran. Auto-clears after 2s (matches the
  // saved-indicator pattern so feedback stays predictable).
  const [resetAt, setResetAt] = useState<number | null>(null);

  useEffect(() => {
    try {
      saveOptions(options);
      setSaveError(null);
      setLastSavedAt(Date.now());
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save options');
    }
    getAudioManager().setEnabled(options.sound);
  }, [options]);

  // Phase 19: auto-clear the reset indicator after 2s so it doesn't linger.
  // Uses a ref-backed timer so multiple rapid resets collapse correctly.
  const resetTimerRef = useRef<number | null>(null);
  useEffect(() => {
    if (resetAt === null) return;
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => {
      setResetAt(null);
      resetTimerRef.current = null;
    }, 2000);
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, [resetAt]);

  const toggleDisplay = () =>
    setOptions((o) => ({ ...o, displayHighlighting: !o.displayHighlighting }));

  const toggleSound = () => setOptions((o) => ({ ...o, sound: !o.sound }));

  const setDifficulty = (d: DifficultyPreference) =>
    setOptions((o) => ({ ...o, difficulty: d }));

  const resetToDefaults = () => {
    setOptions({ ...DEFAULT_OPTIONS });
    setResetAt(Date.now());
  };

  // Phase 14: focus management
  //   - Trap Tab focus inside the modal while it's open so keyboard users
  //     can't accidentally land on elements behind the dimmed backdrop.
  //   - On mount, focus the close button so screen-reader users land in a
  //     predictable spot (the modal's primary dismiss action).
  //   - On unmount, restore focus to whatever element opened the screen
  //     (typically the 🎛️ button on the menu).
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !containerRef.current) return;
      const focusable = containerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="options-screen"
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Options"
      data-testid="options-screen"
    >
      <header className="options-screen__header">
        <h1>🎛️ OPTIONS</h1>
        <button
          ref={closeButtonRef}
          className="options-screen__close"
          onClick={onClose}
          aria-label="Close (Escape)"
        >
          ✕
        </button>
      </header>

      <main className="options-screen__body">
        {saveError && (
          <div
            className="options-error"
            role="alert"
            data-testid="options-save-error"
          >
            ⚠️ Could not save settings: {saveError}
          </div>
        )}
        {!saveError && lastSavedAt !== null && (
          <div
            className="options-saved"
            role="status"
            aria-live="polite"
            data-testid="options-saved-indicator"
          >
            ✓ Settings auto-saved
          </div>
        )}
        {resetAt !== null && (
          <div
            className="options-saved options-saved--reset"
            role="status"
            aria-live="polite"
            data-testid="options-reset-indicator"
          >
            ↺ Reset to defaults
          </div>
        )}
        <section className="options-section">
          <h2 className="options-section__title">🖍️ Display</h2>
          <p className="options-section__desc">
            Highlight the typed character in the stage target text.
          </p>
          <label className="options-toggle">
            <input
              type="checkbox"
              checked={options.displayHighlighting}
              onChange={toggleDisplay}
              data-testid="options-display-toggle"
              aria-label="Display highlighting toggle"
            />
            <span>{options.displayHighlighting ? 'ON' : 'OFF'}</span>
          </label>
        </section>

        <section className="options-section">
          <h2 className="options-section__title">🔊 Sound</h2>
          <p className="options-section__desc">
            Enable keypress / combo / stage-clear sound effects.
          </p>
          <label className="options-toggle">
            <input
              type="checkbox"
              checked={options.sound}
              onChange={toggleSound}
              data-testid="options-sound-toggle"
              aria-label="Sound effects toggle"
            />
            <span>{options.sound ? 'ON' : 'OFF'}</span>
          </label>
        </section>

        <section className="options-section">
          <h2 className="options-section__title">🎯 Difficulty</h2>
          <p className="options-section__desc">
            Preferred scoring/threshold profile. Affects star thresholds and
            mission difficulty.
          </p>
          <div
            className="options-difficulty"
            role="group"
            aria-label="Difficulty selection"
          >
            {(Object.keys(DIFFICULTY_LABELS) as DifficultyPreference[]).map((d) => (
              <button
                key={d}
                className={`options-difficulty__btn ${
                  options.difficulty === d ? 'options-difficulty__btn--active' : ''
                }`}
                onClick={() => setDifficulty(d)}
                aria-label={`Difficulty ${DIFFICULTY_LABELS[d]}${options.difficulty === d ? ' (selected)' : ''}`}
                aria-pressed={options.difficulty === d}
                data-testid={`options-difficulty-${d}`}
              >
                {DIFFICULTY_LABELS[d]}
                {options.difficulty === d && (
                  <span className="options-difficulty__check">✓</span>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="options-section options-section--footer">
          <button
            className="options-reset"
            onClick={resetToDefaults}
            aria-label="Reset options to defaults"
          >
            ↺ Reset to defaults
          </button>
        </section>
      </main>

      <footer className="options-screen__footer">
        <small>Press Esc to close</small>
      </footer>

      <style>{`
        .options-screen {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: #06090f;
          color: #c5d4e3;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        .options-screen__header {
          padding: 16px 24px;
          border-bottom: 1px solid #1a2530;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #0d1420;
        }
        .options-screen__header h1 {
          font-size: 22px;
          color: #00d9ff;
          margin: 0;
        }
        .options-screen__close {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .options-screen__close:hover { background: rgba(255, 255, 255, 0.2); }
        .options-screen__close:focus-visible {
          outline: 2px solid #00d9ff;
          outline-offset: 2px;
        }
        .options-screen__body {
          flex: 1;
          padding: 24px;
          max-width: 720px;
          margin: 0 auto;
          width: 100%;
        }
        .options-section {
          background: #0d1420;
          border: 1px solid #1a2530;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
        }
        .options-section__title {
          font-size: 18px;
          color: #ffaa55;
          margin: 0 0 8px 0;
        }
        .options-section__desc {
          color: #b4d2fa;
          font-size: 13px;
          margin: 0 0 16px 0;
        }
        .options-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
        }
        .options-toggle input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        .options-toggle input:focus-visible {
          outline: 2px solid #00d9ff;
          outline-offset: 2px;
        }
        .options-difficulty {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .options-difficulty__btn {
          background: #1a2530;
          border: 2px solid transparent;
          border-radius: 8px;
          padding: 14px 12px;
          cursor: pointer;
          color: #c5d4e3;
          font-weight: 700;
          letter-spacing: 0.05em;
          font-size: 14px;
          font-family: inherit;
          position: relative;
          transition: all 0.15s;
        }
        .options-difficulty__btn:hover { background: #233040; }
        .options-difficulty__btn:focus-visible {
          outline: 2px solid #00d9ff;
          outline-offset: 2px;
        }
        .options-difficulty__btn--active {
          background: rgba(0, 217, 255, 0.15);
          border-color: #00d9ff;
          color: #fff;
        }
        .options-difficulty__check {
          position: absolute;
          top: 6px;
          right: 8px;
          color: #00d9ff;
          font-size: 14px;
          font-weight: 700;
        }
        .options-section--footer {
          background: transparent;
          border: none;
          text-align: center;
          padding: 12px;
        }
        .options-reset {
          background: transparent;
          border: 1px solid #1a2530;
          color: #6a7888;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
        }
        .options-reset:hover { color: #c5d4e3; border-color: #c5d4e3; }
        .options-reset:focus-visible {
          outline: 2px solid #00d9ff;
          outline-offset: 2px;
        }
        .options-error {
          background: rgba(255, 102, 102, 0.12);
          border: 1px solid #ff6666;
          color: #ffb3b3;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 13px;
        }
        .options-saved {
          background: rgba(102, 221, 102, 0.08);
          border: 1px solid rgba(102, 221, 102, 0.4);
          color: #aae0aa;
          padding: 8px 12px;
          border-radius: 8px;
          margin-bottom: 12px;
          font-size: 12px;
        }
        .options-saved--reset {
          background: rgba(255, 170, 85, 0.08);
          border-color: rgba(255, 170, 85, 0.4);
          color: #ffd9b3;
        }
        .options-screen__footer {
          padding: 12px 24px 20px;
          text-align: center;
          color: #6a7888;
          font-size: 12px;
          border-top: 1px solid #1a2530;
        }
      `}</style>
    </div>
  );
}
