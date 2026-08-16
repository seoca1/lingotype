import { useState, useCallback, useRef } from 'react';
import type { RefObject } from 'react';
import type { GameState } from '../state/gameReducer.js';
import type { StageConfig, Target } from '../types.js';
import { getAudioManager } from '../audio/AudioManager.js';
import { EnemyTooltip } from './EnemyTooltip.js';
import { getNativeLanguage } from '../data/nativeLanguage.js';
import { t } from '../data/uiTranslations.js';

interface StageScreenProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  state: GameState;
  stage: StageConfig | null;
  languageLabel: string;
  canvasWidth?: number;
  canvasHeight?: number;
  /** Called when the user clicks on the canvas — receives canvas-relative (x, y) */
  onCanvasClick?: (x: number, y: number) => void;
  /** Called when the user clicks the Back to Menu button */
  onBackToMenu?: () => void;
  /** Phase 33: Caps Lock detected during Korean jamo input. Triggers an
      aria-live announcement for SR users (canvas overlay is invisible to
      SR by default). Defaults to false so existing callers don't break. */
  capsLockWarning?: boolean;
}

export function StageScreen({
  canvasRef,
  state,
  stage,
  languageLabel,
  canvasWidth = 1024,
  canvasHeight = 880,
  onCanvasClick,
  onBackToMenu,
  capsLockWarning = false,
}: StageScreenProps) {
  const audio = getAudioManager();
  const [volume, setVolume] = useState(audio.getVolume());
  const [soundEnabled, setSoundEnabled] = useState(audio.isEnabled());

  // Phase B-3: hover tooltip state
  const [hoveredTarget, setHoveredTarget] = useState<{
    target: Target;
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const hideTooltipTimeoutRef = useRef<number | null>(null);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audio.setVolume(newVolume);
  };

  const toggleSound = () => {
    const newEnabled = !soundEnabled;
    setSoundEnabled(newEnabled);
    audio.setEnabled(newEnabled);
  };

  /**
   * Convert a click event on the canvas to canvas-relative coordinates.
   */
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onCanvasClick || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    onCanvasClick(x, y);
  };

  /**
   * Phase B-3: hover handler — show tooltip if mouse is over the current enemy.
   *
   * The enemy is drawn at the canvas center horizontally, around y=290.
   * We approximate the hit region as a box around the enemy text.
   */
  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || !state.currentEnemy) {
        if (hoveredTarget) setHoveredTarget(null);
        return;
      }

      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasRef.current.width / rect.width;
      const scaleY = canvasRef.current.height / rect.height;
      const canvasX = (e.clientX - rect.left) * scaleX;
      const canvasY = (e.clientY - rect.top) * scaleY;

      // Enemy is drawn centered at (cx, cy=290) with text spanning ~150-300 height
      // We use a generous hit box (320x150 around center)
      const enemyCx = canvasWidth / 2;
      const enemyCy = 290;
      const hitHalfW = 320;
      const hitHalfH = 100;

      const inEnemy =
        canvasX > enemyCx - hitHalfW &&
        canvasX < enemyCx + hitHalfW &&
        canvasY > enemyCy - hitHalfH &&
        canvasY < enemyCy + hitHalfH;

      // Clear any pending hide
      if (hideTooltipTimeoutRef.current !== null) {
        window.clearTimeout(hideTooltipTimeoutRef.current);
        hideTooltipTimeoutRef.current = null;
      }

      if (inEnemy) {
        setHoveredTarget({
          target: state.currentEnemy.target,
          mouseX: e.clientX,
          mouseY: e.clientY,
        });
      } else if (hoveredTarget) {
        // Debounce hiding to allow mouse to move between canvas and tooltip
        hideTooltipTimeoutRef.current = window.setTimeout(() => {
          setHoveredTarget(null);
        }, 200);
      }
    },
    [canvasRef, canvasWidth, state.currentEnemy, hoveredTarget]
  );

  const handleCanvasMouseLeave = useCallback(() => {
    if (hideTooltipTimeoutRef.current !== null) {
      window.clearTimeout(hideTooltipTimeoutRef.current);
    }
    hideTooltipTimeoutRef.current = window.setTimeout(() => {
      setHoveredTarget(null);
    }, 200);
  }, []);

  const playTts = useCallback((text: string, lang: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }, []);

  // Phase 23: canvas a11y — expose target text + language to screen readers.
  const canvasAriaLabel = state.currentEnemy
    ? (() => {
        const target = state.currentEnemy.target;
        const meaning = target.meaning ? `, meaning ${target.meaning}` : '';
        const category = target.category ? `, category ${target.category}` : '';
        return `Game canvas. Type ${target.text} in ${languageLabel}${meaning}${category}. Typed so far: ${state.buffer || 'nothing'}.`;
      })()
    : `Game canvas for ${languageLabel}. ${stage?.name ?? 'Stage ready.'}`;

  return (
    <div className="stage-screen">
      {/* Phase 33: aria-live announcement for the Caps Lock warning.
          The Renderer draws the "⌨ Caps Lock이 켜져 있습니다!" overlay
          onto the 2D canvas — invisible to screen readers by default.
          Previously SR users with Caps Lock accidentally on during a
          Korean jamo stage heard nothing, even though the canvas aria-
          label told them to type the target word. Now the live region
          announces "Caps Lock is on. Korean jamo input may behave
          unexpectedly. Turn off Caps Lock." the moment the warning
          flips on, with role="alert" so the SR interrupts the current
          utterance (mirrors the Phase 25 NonKoreanKeyboardWarning
          mismatch-alert pattern). Stays empty when the warning is off
          so SR users don't hear a phantom empty announcement on every
          render. */}
      <div
        className="caps-lock-warning-sr"
        role={capsLockWarning ? 'alert' : undefined}
        aria-live={capsLockWarning ? 'assertive' : undefined}
        data-testid="caps-lock-warning-sr"
      >
        {capsLockWarning
          ? 'Caps Lock is on. Korean jamo input may behave unexpectedly. Turn off Caps Lock.'
          : ''}
      </div>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="game-canvas"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={handleCanvasMouseLeave}
        style={{ cursor: onCanvasClick ? 'pointer' : 'default' }}
        role="img"
        aria-label={canvasAriaLabel}
      />
      <aside className="stage-info">
        <h2>
          <span className="lang-badge">{languageLabel}</span> {stage?.name}
          {stage?.language === 'es' && stage.accentMode && (
            <span className={`mode-badge mode-${stage.accentMode}`}>
              {stage.accentMode === 'strict' ? '⌨️ Strict' : '⌨️ Loose'}
            </span>
          )}
        </h2>
        <p>{stage?.description}</p>
        {stage?.language === 'es' && stage.accentMode && (
          <div className="keyboard-mode-info">
            {stage.accentMode === 'strict' ? (
              <small>⚠️ 스페인어 키보드 필요: á, é, í, ó, ú, ñ 직접 입력</small>
            ) : (
              <small>✓ 영어 키보드 가능: a→á, e→é 자동 인식</small>
            )}
          </div>
        )}
        <div
          className="missions"
          role="list"
          aria-label={`Stage missions for ${stage?.name ?? 'this stage'}`}
        >
          <h3 id="stage-missions-heading">Missions</h3>
          {stage?.missions.map((m) => (
            <div key={m.id} className="mission" role="listitem">
              <strong>{m.name}</strong>
              <p>{m.description}</p>
            </div>
          ))}
        </div>
        {/* Phase 35: removed `aria-live="polite"` + the `aria-label=` that
            overrode the visible text. The re-rendering HUD polled every
            frame (~60Hz) with a `role="status" aria-live="polite"` that
            fired a polite SR announcement on every score/combo/WPM
            change — a real SR-spam bug that drowned out the canvas
            aria-label in Phase 23. Now the HUD is exposed once as a
            labelled region (so SR users can navigate into the stats
            via a heading landmark), with no live region. The canvas
            itself (Phase 23) already announces the typed-so-far count
            and the target word, so the live score is not needed.
            Phase 35 mirrors the Phase 32/34 kbd-hint + Phase 33
            caps-lock patterns: keep visible text, expose structure via
            aria-labelledby, never override readable text with an
            aria-label. */}
        <div
          className="hud-info"
          role="region"
          aria-labelledby="hud-heading"
        >
          <h3 id="hud-heading" className="visually-hidden">
            Game stats
          </h3>
          <p aria-hidden="true">Score: {state.score}</p>
          <p aria-hidden="true">Defeated: {state.enemiesDefeated}</p>
          <p aria-hidden="true">Combo: {state.combo} (max: {state.comboMax})</p>
          <p aria-hidden="true">WPM: {state.wpm.toFixed(0)}</p>
          <p aria-hidden="true">ACC: {state.accuracy.toFixed(0)}%</p>
        </div>
        <div className="hover-hint">
          <small>{t('tipHoverForMeaning', getNativeLanguage())}</small>
        </div>
        <div className="audio-controls">
          <h3>Audio</h3>
          <div className="audio-toggle">
            <button
              onClick={toggleSound}
              className="toggle-btn"
              aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              aria-pressed={soundEnabled}
            >
              {soundEnabled ? '🔊' : '🔇'} {soundEnabled ? 'On' : 'Off'}
            </button>
          </div>
          {soundEnabled && (
            <div className="volume-slider">
              <label htmlFor="stage-volume-slider">
                Volume: {Math.round(volume * 100)}%
              </label>
              <input
                id="stage-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                aria-label="Sound effects volume"
                aria-valuetext={`${Math.round(volume * 100)} percent`}
              />
            </div>
          )}
        </div>
        <button
          onClick={onBackToMenu}
          aria-label="Back to menu (Escape)"
          className="stage-back-btn"
        >
          Back to Menu (Esc)
        </button>
      </aside>

      {hoveredTarget && stage && (
        <EnemyTooltip
          target={hoveredTarget.target}
          x={hoveredTarget.mouseX}
          y={hoveredTarget.mouseY}
          language={stage.language}
          onTtsPlay={playTts}
          onClose={() => setHoveredTarget(null)}
        />
      )}
    </div>
  );
}