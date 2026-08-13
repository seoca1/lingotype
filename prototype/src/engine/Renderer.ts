/**
 * Canvas Renderer
 *
 * ADR-0004: Canvas 2D 렌더링.
 * 자세한 내용: ../../../decisions/0004-rendering.md
 */

import type { Enemy, Language } from '../types.js';
import type { EffectsState } from '../effects/EffectsSystem.js';
import {
  spawnFloatingWords,
  showSentencePreview,
} from '../effects/EffectsSystem.js';
import { Keyboard } from './Keyboard.js';
import type { CharacterState } from '../character/CharacterController.js';
import {
  renderBackground,
  renderCharacter,
  renderProps,
} from '../character/CharacterRenderer.js';
import { GraphicsConfig } from '../config/graphics.js';
import { SpriteLoader } from '../sprites/SpriteLoader.js';
import {
  findCrossLangTranslations,
  getSentenceEnglishTranslation,
  isSentence,
} from '../data/translations.js';
import { getHiraganaReading } from '../utils/japaneseReading.js';
import { calculateTypingProgress, calculateKanjiAlpha } from '../utils/typingProgress.js';

export interface RenderState {
  currentEnemy: Enemy | null;
  buffer: string;
  score: number;
  combo: number;
  wpm: number;
  accuracy: number;
  language: Language;
  romajiHint?: string;
  effects: EffectsState;
  lastHitCorrect: boolean;
  lastHitCharIndex: number;
  lastHitTime: number;
  character: CharacterState;
  /** Word entry for the current enemy (for translation lookup) */
  currentEntry?: { id: string; display: string; meaning?: string; category?: string };
  /** Caps Lock warning for Korean jamo mode */
  capsLockWarning?: boolean;
  /** Phase 10: per-character visual feedback. When false, suppress glow/scale pulse. */
  displayHighlighting?: boolean;
}

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  private keyboard: Keyboard | null = null;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D context');
    this.ctx = ctx;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  isCanvasValid(canvas: HTMLCanvasElement): boolean {
    return this.ctx.canvas === canvas && canvas.isConnected && canvas.width > 0 && canvas.height > 0;
  }

  recreateFrom(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D context');
    this.ctx = ctx;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  setKeyboard(keyboard: Keyboard): void {
    this.keyboard = keyboard;
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  render(state: RenderState): void {
    this.clear();
    this.applyShake(state.effects);

    this.drawBackground();
    renderBackground(this.ctx, state.character, this.width, this.height, performance.now());
    this.drawAmbient(state.effects);
    this.drawCharacter(state.character);
    this.drawHud(state);
    this.drawEnemy(state);
    this.drawInputBuffer(state);
    this.drawComboMeter(state);
    this.drawKeyboardSection(state);
    this.drawParticles(state.effects);
    this.drawRings(state.effects);
    this.drawFloatingTexts(state.effects);
    this.drawSentencePreview(state.effects);
    this.drawFloatingWords(state.effects);
    this.drawFlash(state.effects);

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  private drawCharacter(state: CharacterState): void {
    const cx = this.width - 130;
    const groundY = 540;
    const now = performance.now();
    renderProps(this.ctx, state, cx, groundY, now);
    renderCharacter(this.ctx, state, cx, groundY, now);
  }

  private applyShake(effects: EffectsState): void {
    if (!effects.shake) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      return;
    }
    this.ctx.setTransform(1, 0, 0, 1, effects.shake.offsetX, effects.shake.offsetY);
  }

  private clear(): void {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  private drawBackground(): void {
    const grad = this.ctx.createRadialGradient(
      this.width / 2,
      this.height / 2,
      50,
      this.width / 2,
      this.height / 2,
      Math.max(this.width, this.height) * 0.7,
    );
    grad.addColorStop(0, 'rgba(233, 69, 96, 0.08)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
  }

  private drawHud(state: RenderState): void {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 22px -apple-system, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(
      `WPM ${state.wpm.toFixed(0)}   ACC ${state.accuracy.toFixed(0)}%`,
      20,
      34,
    );

    this.ctx.fillStyle = '#00d9ff';
    this.ctx.font = 'bold 28px -apple-system, sans-serif';
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`${state.score}`, this.width - 20, 36);
    this.ctx.font = '14px -apple-system, sans-serif';
    this.ctx.fillStyle = '#aaa';
    this.ctx.fillText('SCORE', this.width - 20, 56);
  }

  private drawEnemy(state: RenderState): void {
    if (!state.currentEnemy) return;
    const enemy = state.currentEnemy;
    const text = enemy.target.text;
    const progress = Math.min(1, state.buffer.length / enemy.maxHp);

    const cx = this.width / 2;
    const cy = 290;

    // Determine max width for text wrapping
    const maxWidth = this.width - 80; // 40px padding on each side

    // Calculate font size: start large, shrink until single line fits OR multi-line possible
    let fontSize = 48;
    const minFontSize = 20;
    let lines: string[] = [];

    // Try different font sizes: largest that fits OR uses max 3 lines
    while (fontSize >= minFontSize) {
      this.ctx.font = `bold ${fontSize}px -apple-system, sans-serif`;
      lines = this.wrapText(text, maxWidth, state.language);
      if (lines.length <= 3) {
        break; // Good fit
      }
      fontSize -= 4;
    }

    // Center vertically based on line count
    const lineHeight = fontSize * 1.3;
    const totalHeight = lines.length * lineHeight;
    const startY = cy - totalHeight / 2 + lineHeight / 2;

    this.ctx.save();
    this.ctx.translate(cx, 0);

    const glowIntensity = 0.4 + progress * 0.6;
    this.ctx.shadowColor = '#e94560';
    this.ctx.shadowBlur = 20 * glowIntensity;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.textAlign = 'center';
    this.ctx.font = `bold ${fontSize}px -apple-system, sans-serif`;

    for (let i = 0; i < lines.length; i++) {
      const y = startY + i * lineHeight;
      this.ctx.fillText(lines[i], 0, y);
    }

    this.ctx.shadowBlur = 0;
    this.ctx.restore();

    if (state.romajiHint) {
      this.ctx.fillStyle = '#888888';
      this.ctx.font = '20px -apple-system, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(state.romajiHint, cx, cy + 40);
    }

    // Japanese reading aid: show hiragana + kanji side-by-side.
    // The player types romaji (Latin letters) which converts to hiragana,
    // and the kanji is the "answer" / target meaning.
    // Layout: "がっこう学校" (hiragana left dim, kanji right bright).
    // Only when the target contains kanji (i.e., the reading differs
    // from the displayed text).
    if (state.language === 'jp') {
      const hiragana = getHiraganaReading(enemy.target);
      if (hiragana && hiragana !== enemy.target.text && lines.length === 1) {
        // Single-line target only (multi-line would need wrapping logic)
        const yLine = startY + lineHeight / 2;

        // Typing progress: how much of the romaji has been typed?
        // Used to dim the kanji as the player types the hiragana.
        // 0% typed → kanji full opacity (1.0)
        // 100% typed → kanji dimmed (0.3)
        // Linear interpolation in between.
        const totalRomaji = enemy.target.acceptedInputs[0]?.length ?? 0;
        const progress = calculateTypingProgress(
          state.buffer.length,
          totalRomaji,
        );
        const kanjiAlpha = calculateKanjiAlpha(progress);

        this.ctx.save();
        this.ctx.font = `bold ${fontSize}px -apple-system, sans-serif`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';

        // Measure widths
        const hiraWidth = this.ctx.measureText(hiragana).width;
        const kanjiWidth = this.ctx.measureText(enemy.target.text).width;
        const gap = 12;
        const totalWidth = hiraWidth + gap + kanjiWidth;

        // Position centered as a group
        let x = cx - totalWidth / 2;

        // Draw hiragana (full opacity — this is the typing target)
        this.ctx.fillStyle = 'rgba(180, 210, 250, 0.85)';
        this.ctx.shadowColor = 'rgba(180, 210, 250, 0.6)';
        this.ctx.shadowBlur = 12;
        this.ctx.fillText(hiragana, x, yLine);
        x += hiraWidth + gap;

        // Draw kanji with progress-based dimming
        // (Fades as the player types — the "answer" becomes "achieved")
        this.ctx.globalAlpha = kanjiAlpha;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = '#e94560';
        this.ctx.shadowBlur = 20 * glowIntensity * kanjiAlpha;
        this.ctx.fillText(enemy.target.text, x, yLine);
        this.ctx.restore();
      }
    }

    const barWidth = 460;
    const barHeight = 14;
    const x = (this.width - barWidth) / 2;
    const y = cy + 80;

    if (GraphicsConfig.USE_SPRITES) {
      // Sprite-based HP bar
      const hpBarSprite = SpriteLoader.get('ui-hp-bar');
      if (hpBarSprite) {
        // Draw full sprite as background
        this.ctx.save();
        this.ctx.globalAlpha = 0.5;
        this.ctx.drawImage(hpBarSprite.image, x, y, barWidth, barHeight);
        this.ctx.restore();

        // Draw clipped progress
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(x, y, barWidth * progress, barHeight);
        this.ctx.clip();
        this.ctx.drawImage(hpBarSprite.image, x, y, barWidth, barHeight);
        this.ctx.restore();
      } else {
        // Fallback to primitive rendering
        this.drawHPBarPrimitive(x, y, barWidth, barHeight, progress);
      }
    } else {
      this.drawHPBarPrimitive(x, y, barWidth, barHeight, progress);
    }

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '12px -apple-system, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`${state.buffer.length} / ${enemy.maxHp}`, x + barWidth / 2, y - 6);
  }

  private drawHPBarPrimitive(x: number, y: number, width: number, height: number, progress: number): void {
    this.ctx.fillStyle = '#1f1f2e';
    this.ctx.fillRect(x - 2, y - 2, width + 4, height + 4);

    this.ctx.fillStyle = '#333333';
    this.ctx.fillRect(x, y, width, height);

    const hpGrad = this.ctx.createLinearGradient(x, y, x + width, y);
    hpGrad.addColorStop(0, '#00d9ff');
    hpGrad.addColorStop(1, '#00ff88');
    this.ctx.fillStyle = hpGrad;
    this.ctx.fillRect(x, y, width * progress, height);
  }

  private drawInputBuffer(state: RenderState): void {
    if (!state.currentEnemy) return;
    const targetText = state.currentEnemy.target.text;
    const buffer = state.buffer;

    const cx = this.width / 2;

    // ===== Trigger cross-language translation effects =====
    // Detect: first character typed (sentence preview) OR mid-typing (word floating)
    this.maybeTriggerTranslationEffects(state, targetText, buffer);

    // Match the same font size and wrapping as drawEnemy
    const maxWidth = this.width - 80;
    let fontSize = 48;
    const minFontSize = 20;
    let targetLines: string[] = [];

    while (fontSize >= minFontSize) {
      this.ctx.font = `bold ${fontSize}px -apple-system, sans-serif`;
      targetLines = this.wrapText(targetText, maxWidth, state.language);
      if (targetLines.length <= 3) break;
      fontSize -= 4;
    }

    const inputFontSize = Math.max(14, Math.floor(fontSize * 0.7));
    const lineHeight = fontSize * 1.3;
    const inputLineHeight = inputFontSize * 1.3;

    // Map each character in targetText to its (line, column) position
    // targetLines reconstruct the text with same line breaks
    const charPositions: Array<{ line: number; col: number; char: string }> = [];
    for (let lineIdx = 0; lineIdx < targetLines.length; lineIdx++) {
      const line = targetLines[lineIdx];
      for (let col = 0; col < line.length; col++) {
        charPositions.push({ line: lineIdx, col, char: line[col] });
      }
    }

    const now = Date.now();
    const recent = now - state.lastHitTime < 220;
    const highlightingEnabled = state.displayHighlighting !== false;

    // Render target text line by line (faded if not yet typed, bright if typed)
    this.ctx.save();
    this.ctx.translate(cx, 0);
    this.ctx.font = `bold ${fontSize}px -apple-system, sans-serif`;
    this.ctx.textAlign = 'center';

    for (let lineIdx = 0; lineIdx < targetLines.length; lineIdx++) {
      const line = targetLines[lineIdx];
      // Find global char index range for this line
      let lineStartGlobal = 0;
      for (let l = 0; l < lineIdx; l++) {
        lineStartGlobal += targetLines[l].length;
      }

      // Render each character
      const lineWidth = this.ctx.measureText(line).width;
      let xCursor = -lineWidth / 2;

      for (let col = 0; col < line.length; col++) {
        const char = line[col];
        const globalIdx = lineStartGlobal + col;
        const bufChar = buffer[globalIdx];

        const isLastHit = recent && globalIdx === state.lastHitCharIndex;
        const correct = bufChar !== undefined && bufChar === char;
        const wrong = bufChar !== undefined && bufChar !== char;

        let pulse = 0;
        if (highlightingEnabled && isLastHit && (correct || wrong)) {
          pulse = 1 - (now - state.lastHitTime) / 220;
        }

        const charW = this.ctx.measureText(char).width;
        const charY = 500 + lineIdx * lineHeight;
        const charX = xCursor + charW / 2;
        const scale = 1 + pulse * 0.3;
        const yOffset = wrong && isLastHit ? Math.sin(now / 30) * 3 : 0;

        this.ctx.save();
        this.ctx.translate(charX, charY + yOffset);
        this.ctx.scale(scale, scale);

        if (highlightingEnabled && correct && isLastHit) {
          this.ctx.shadowColor = '#00ff88';
          this.ctx.shadowBlur = 14;
          this.ctx.fillStyle = '#00ff88';
        } else if (highlightingEnabled && wrong && isLastHit) {
          this.ctx.shadowColor = '#ff4444';
          this.ctx.shadowBlur = 14;
          this.ctx.fillStyle = '#ff4444';
        } else if (correct) {
          this.ctx.fillStyle = highlightingEnabled ? '#aaffcc' : '#888';
        } else if (wrong) {
          this.ctx.fillStyle = highlightingEnabled ? '#ff7777' : '#888';
        } else {
          this.ctx.fillStyle = '#555';
        }

        this.ctx.fillText(char, 0, 0);
        this.ctx.restore();

        xCursor += charW;
      }
    }
    this.ctx.restore();

    // Render buffer (input) line by line BELOW target
    if (buffer.length > 0) {
      this.ctx.save();
      this.ctx.translate(cx, 0);
      this.ctx.font = `${inputFontSize}px ui-monospace, monospace`;
      this.ctx.textAlign = 'center';

      // Build buffer lines following target line breaks
      const bufferLines: string[] = [];
      let bufIdx = 0;
      for (let lineIdx = 0; lineIdx < targetLines.length; lineIdx++) {
        const targetLine = targetLines[lineIdx];
        const lineBuf = buffer.slice(bufIdx, bufIdx + targetLine.length);
        bufferLines.push(lineBuf);
        bufIdx += targetLine.length;
      }

      const inputStartY = 500 + targetLines.length * lineHeight + 20;

      for (let lineIdx = 0; lineIdx < bufferLines.length; lineIdx++) {
        const lineBuf = bufferLines[lineIdx];
        if (lineBuf.length === 0) continue;

        const y = inputStartY + lineIdx * inputLineHeight;

        // Color the input characters based on correctness
        const targetLine = targetLines[lineIdx];
        const lineWidth = this.ctx.measureText(lineBuf).width;
        let xCursor = -lineWidth / 2;

        for (let col = 0; col < lineBuf.length; col++) {
          const char = lineBuf[col];
          const targetChar = targetLine[col];
          const isCorrect = targetChar !== undefined && char === targetChar;
          const charW = this.ctx.measureText(char).width;

          this.ctx.fillStyle = isCorrect ? '#00ff88' : '#ff7777';
          this.ctx.fillText(char, xCursor + charW / 2, y);

          xCursor += charW;
        }
      }
      this.ctx.restore();
    }

    if (buffer.length > targetText.length) {
      this.ctx.fillStyle = '#ff4444';
      this.ctx.font = '14px -apple-system, sans-serif';
      this.ctx.textAlign = 'center';
      const lastY = 500 + targetLines.length * lineHeight + 20 + targetLines.length * inputLineHeight + 20;
      this.ctx.fillText('⚠ 글자 수 초과', this.width / 2, lastY);
    }
  }

  private drawKeyboardSection(state: RenderState): void {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    this.ctx.fillRect(0, 580, this.width, this.height - 580);
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, 580);
    this.ctx.lineTo(this.width, 580);
    this.ctx.stroke();

    this.ctx.fillStyle = '#666';
    this.ctx.font = '11px -apple-system, sans-serif';
    this.ctx.textAlign = 'left';
    let keyboardLabel = `⌨  ${state.language.toUpperCase()} keyboard · 노란색 = 다음 키`;
    if (state.capsLockWarning) {
      this.ctx.fillStyle = '#ff6b6b';
      keyboardLabel = '⌨  Caps Lock이 켜져 있습니다! Korean keyboard를 확인하세요.';
    }
    this.ctx.fillText(keyboardLabel, 32, 596);

    if (this.keyboard) {
      this.keyboard.update();
      this.keyboard.render(this.ctx);
    }
  }

  private drawComboMeter(state: RenderState): void {
    if (state.combo < 2) return;

    const baseSize = 28;
    const scaleBoost = Math.min(state.combo / 20, 1);
    const size = baseSize + scaleBoost * 24;
    const hue = (state.combo * 25) % 360;
    const color = `hsl(${hue}, 90%, 60%)`;

    const cx = this.width / 2;
    const cy = 110;
    const wobble = Math.sin(performance.now() / 150) * 3;

    if (GraphicsConfig.USE_SPRITES && state.combo >= 5) {
      // Draw combo badge sprite
      const badgeSprite = SpriteLoader.get('ui-combo-badge');
      if (badgeSprite) {
        this.ctx.save();
        this.ctx.translate(cx, cy + wobble);
        const scale = 1 + scaleBoost * 0.5;
        this.ctx.scale(scale, scale);
        this.ctx.globalAlpha = 0.9;
        this.ctx.drawImage(
          badgeSprite.image,
          -badgeSprite.width / 2,
          -badgeSprite.height / 2,
          badgeSprite.width,
          badgeSprite.height
        );
        this.ctx.restore();
      }
    }

    // Draw combo text
    this.ctx.save();
    this.ctx.translate(cx, cy + wobble);
    this.ctx.font = `bold ${size}px -apple-system, sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 20 + state.combo;
    this.ctx.fillStyle = color;
    this.ctx.fillText(`${state.combo} COMBO`, 0, 0);
    this.ctx.shadowBlur = 0;
    this.ctx.restore();

    if (state.combo >= 5) {
      this.ctx.font = 'bold 14px -apple-system, sans-serif';
      this.ctx.fillStyle = color;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this.getComboLabel(state.combo), cx, cy + 30);
    }
  }

  private getComboLabel(combo: number): string {
    if (combo >= 20) return 'LEGENDARY';
    if (combo >= 15) return 'UNSTOPPABLE';
    if (combo >= 10) return 'ON FIRE';
    if (combo >= 5) return 'GOOD';
    return '';
  }

  private drawParticles(effects: EffectsState): void {
    for (const p of effects.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'square') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else {
        this.drawStar(0, 0, p.size * 1.6, p.size * 0.7, 5);
      }
      this.ctx.restore();
    }
  }

  private drawAmbient(effects: EffectsState): void {
    for (const p of effects.ambient) {
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  private drawRings(effects: EffectsState): void {
    const rings: Array<{
      x: number; y: number; radius: number; color: string;
      life: number; maxLife: number; lineWidth: number;
    }> = (effects as any).rings || [];
    for (const ring of rings) {
      const alpha = Math.max(0, ring.life / ring.maxLife) * 0.8;
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.strokeStyle = ring.color;
      this.ctx.lineWidth = ring.lineWidth;
      this.ctx.shadowColor = ring.color;
      this.ctx.shadowBlur = 15;
      this.ctx.beginPath();
      this.ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  private drawStar(cx: number, cy: number, outer: number, inner: number, points: number): void {
    this.ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (Math.PI / points) * i - Math.PI / 2;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawFloatingTexts(effects: EffectsState): void {
    for (const t of effects.floatingTexts) {
      const alpha = Math.max(0, t.life / t.maxLife);
      const scale = 1 + (1 - alpha) * 0.5;
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.translate(t.x, t.y);
      this.ctx.scale(scale, scale);
      this.ctx.font = `bold ${t.fontSize}px -apple-system, sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.shadowColor = t.color;
      this.ctx.shadowBlur = 12;
      this.ctx.fillStyle = t.color;
      this.ctx.fillText(t.text, 0, 0);
      this.ctx.shadowBlur = 0;
      this.ctx.restore();
    }
  }

  private drawFlash(effects: EffectsState): void {
    if (!effects.flash) return;
    const alpha = (effects.flash.life / effects.flash.maxLife) * effects.flash.intensity;
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.globalAlpha = alpha;
    this.ctx.fillStyle = effects.flash.color;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();
  }

  /**
   * 떠다니는 단어 렌더링 (다른 언어 번역 효과)
   *
   * Words are now placed at canvas perimeter slots (corners + edges)
   * to avoid covering the target text and input buffer in the center.
   * Smaller, more transparent pills for less visual competition.
   */
  private drawFloatingWords(effects: EffectsState): void {
    for (const w of effects.floatingWords) {
      const lifeRatio = Math.max(0, w.life / w.maxLife);

      // Fade in (first 15%) then fade out (last 50%) — still semi-transparent
      let alpha = 0.92;
      if (lifeRatio < 0.15) {
        alpha = (lifeRatio / 0.15) * 0.92;
      } else if (lifeRatio < 0.5) {
        alpha = 0.92;
      } else {
        alpha = ((lifeRatio - 0.5) / 0.5) * 0.92;
      }

      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.translate(w.x, w.y);
      this.ctx.rotate((w.rotation * Math.PI) / 180);

      // Smaller background pill
      this.ctx.font = `bold ${w.fontSize}px -apple-system, sans-serif`;
      const textWidth = this.ctx.measureText(w.text).width;
      const padX = 8;
      const padY = 4;
      const pillW = textWidth + padX * 2;
      const pillH = w.fontSize + padY * 2;

      this.ctx.fillStyle = 'rgba(15, 20, 35, 0.7)';
      this.ctx.shadowColor = w.color;
      this.ctx.shadowBlur = 10;
      this.drawRoundRect(-pillW / 2, -pillH / 2, pillW, pillH, 6);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Language label (small flag-like)
      const langLabel = this.getLangFlag(w.lang);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      this.ctx.font = '8px -apple-system, sans-serif';
      this.ctx.textAlign = 'left';
      this.ctx.fillText(langLabel, -pillW / 2 + padX - 2, -pillH / 2 + 9);

      // Word text
      this.ctx.fillStyle = w.color;
      this.ctx.font = `bold ${w.fontSize}px -apple-system, sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(w.text, 0, padY - 1);

      this.ctx.restore();
    }
  }

  /**
   * 문장 영어 번역 미리보기 렌더링 (top-left 배치, 게임 텍스트 안 가림)
   *
   * p.x, p.y are the top-left corner of the box.
   * Smaller and more transparent than before.
   */
  private drawSentencePreview(effects: EffectsState): void {
    if (!effects.sentencePreview) return;
    const p = effects.sentencePreview;
    const lifeRatio = Math.max(0, p.life / p.maxLife);

    let alpha = 0.85;
    if (lifeRatio < 0.15) {
      alpha = (lifeRatio / 0.15) * 0.85;
    } else if (lifeRatio > 0.7) {
      alpha = ((1 - lifeRatio) / 0.3) * 0.85;
    }

    this.ctx.save();
    this.ctx.globalAlpha = alpha;

    // Smaller, italic — at top-left (out of game text area)
    this.ctx.font = 'italic 13px -apple-system, sans-serif';
    const textWidth = this.ctx.measureText(p.text).width;
    const padX = 10;
    const boxW = Math.min(textWidth + padX * 2 + 50, this.width - 320);
    const boxH = 24;
    const boxX = p.x;
    const boxY = p.y;

    // Subtle background
    this.ctx.fillStyle = 'rgba(15, 20, 35, 0.75)';
    this.ctx.strokeStyle = p.color;
    this.ctx.lineWidth = 1;
    this.ctx.shadowColor = p.color;
    this.ctx.shadowBlur = 6;
    this.drawRoundRect(boxX, boxY, boxW, boxH, 8);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    // EN flag label
    this.ctx.fillStyle = 'rgba(180, 220, 255, 0.7)';
    this.ctx.font = 'bold 8px -apple-system, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('🇺🇸 EN', boxX + 6, boxY + 10);

    // Translation text
    this.ctx.fillStyle = p.color;
    this.ctx.font = 'italic 13px -apple-system, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(p.text, boxX + 36, boxY + 16);

    this.ctx.restore();
  }

  private getLangFlag(lang: 'en' | 'jp' | 'es' | 'kr'): string {
    switch (lang) {
      case 'en':
        return '🇺🇸 EN';
      case 'jp':
        return '🇯🇵 JP';
      case 'es':
        return '🇪🇸 ES';
      case 'kr':
        return '🇰🇷 KR';
      default:
        return '';
    }
  }

  private drawRoundRect(x: number, y: number, w: number, h: number, r: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.lineTo(x + w - r, y);
    this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    this.ctx.lineTo(x + w, y + h - r);
    this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.ctx.lineTo(x + r, y + h);
    this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    this.ctx.lineTo(x, y + r);
    this.ctx.quadraticCurveTo(x, y, x + r, y);
    this.ctx.closePath();
  }

  /**
   * Wrap text into multiple lines based on max width.
   * - English/Spanish: word-based wrapping (breaks at spaces)
   * - Japanese/Korean: character-based wrapping (breaks between any chars)
   */
  private wrapText(text: string, maxWidth: number, language: string): string[] {
    const isWordBased = language === 'en' || language === 'es';

    if (!isWordBased) {
      // CJK: wrap by character
      const chars = Array.from(text);
      const lines: string[] = [];
      let currentLine = '';

      for (const char of chars) {
        const testLine = currentLine + char;
        const width = this.ctx.measureText(testLine).width;
        if (width > maxWidth && currentLine.length > 0) {
          lines.push(currentLine);
          currentLine = char;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    }

    // Word-based: split by spaces
    const words = text.split(/(\s+)/); // Keep separators
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + word;
      const width = this.ctx.measureText(testLine.trimEnd()).width;

      if (width > maxWidth && currentLine.trim().length > 0) {
        lines.push(currentLine.trimEnd());
        currentLine = word.trimStart();
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine.trim()) lines.push(currentLine.trimEnd());
    return lines;
  }

  // ===== Translation Effect Triggers =====

  private lastBufferLen = 0;
  private wordEffectsShownFor = new Set<string>();

  /**
   * Detect input events and trigger appropriate translation effects:
   * - Sentence: show English translation preview (briefly)
   * - Word: show 2 floating translations in other languages
   */
  private maybeTriggerTranslationEffects(
    state: RenderState,
    targetText: string,
    buffer: string,
  ): void {
    const effects = state.effects;

    // Reset tracking if target changed (new enemy)
    if (buffer.length === 0) {
      this.wordEffectsShownFor.clear();
      this.lastBufferLen = 0;
      return;
    }

    // Only trigger when buffer length increases (user typed a char)
    const isNewChar = buffer.length > this.lastBufferLen;
    if (!isNewChar) {
      this.lastBufferLen = buffer.length;
      return;
    }

    const justTypedChar = buffer[buffer.length - 1];
    if (!justTypedChar) return;

    const sentenceMode = isSentence(targetText);

    if (sentenceMode) {
      // For sentences: show English preview once at the start of typing.
      // Place at top-left (p.x, p.y = top-left corner of box) to avoid
      // covering the target text and input buffer in the center.
      if (buffer.length === 1 && state.language !== 'en') {
        const englishTranslation = getSentenceEnglishTranslation(state.language, targetText);
        if (englishTranslation) {
          showSentencePreview(
            effects,
            englishTranslation,
            300, // x = left edge of box
            18, // y = top edge of box (just below the top score)
            3500,
          );
        }
      }
    } else {
      // For words: show floating translations on each keystroke.
      // Words are spawned at canvas perimeter slots (corners/edges) by
      // EffectsSystem — centerX/centerY are ignored for positioning.
      const lookupDisplay = targetText;
      const lookupMeaning = state.currentEntry?.meaning;

      const translations = findCrossLangTranslations(
        state.language,
        lookupDisplay,
        lookupMeaning,
        3,
      );

      if (translations.length > 0) {
        spawnFloatingWords(
          effects,
          this.width / 2, // ignored — kept for API compat
          0, // ignored
          translations.map((t) => ({ text: t.display, lang: t.lang as 'en' | 'jp' | 'es' | 'kr' })),
          { width: this.width, height: this.height },
        );
      }
    }

    this.lastBufferLen = buffer.length;
  }
}