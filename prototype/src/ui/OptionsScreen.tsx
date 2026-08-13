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

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    saveOptions(options);
    getAudioManager().setEnabled(options.sound);
  }, [options]);

  const toggleDisplay = () =>
    setOptions((o) => ({ ...o, displayHighlighting: !o.displayHighlighting }));

  const toggleSound = () => setOptions((o) => ({ ...o, sound: !o.sound }));

  const setDifficulty = (d: DifficultyPreference) =>
    setOptions((o) => ({ ...o, difficulty: d }));

  const resetToDefaults = () => setOptions({ ...DEFAULT_OPTIONS });

  return (
    <div className="options-screen">
      <header className="options-screen__header">
        <h1>🎛️ OPTIONS</h1>
        <button
          className="options-screen__close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </header>

      <main className="options-screen__body">
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
          <div className="options-difficulty">
            {(Object.keys(DIFFICULTY_LABELS) as DifficultyPreference[]).map((d) => (
              <button
                key={d}
                className={`options-difficulty__btn ${
                  options.difficulty === d ? 'options-difficulty__btn--active' : ''
                }`}
                onClick={() => setDifficulty(d)}
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
          <button className="options-reset" onClick={resetToDefaults}>
            ↺ Reset to defaults
          </button>
        </section>
      </main>

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
      `}</style>
    </div>
  );
}
