/**
 * French Input Handler
 *
 * 액센트 직접 입력 + ASCII 폴백 — Spanish 패턴 계승.
 * 자세한 내용: ../../../wiki/languages/french.md
 *
 * 모드:
 * - strict: 액센트 문자 정확히 입력 필요 (é, è, ê, ë, à, â, ù, û, ç, ï, î, ô)
 * - loose: ASCII 폴백 허용 (e → é/è/ê/ë, a → à/â, c → ç, u → ù/û, i → ï/î, o → ô, œ → oe)
 *
 * 프랑스 특이 사항:
 * - œ 합자(ligature) 처리: loose 모드에서 "oe" 입력 허용
 * - 어포스트로피 보존 (l', d', j', qu', n', jusqu')
 * - «guillemets» (선택적, 본 핸들러에서는 직접 매칭)
 */

import { BaseInputHandler } from './InputHandler.js';
import type { MatchResult } from '../types.js';

type AccentMode = 'strict' | 'loose';

export class FrenchHandler extends BaseInputHandler {
  readonly language = 'fr' as const;
  private mode: AccentMode = 'loose';

  setMode(mode: AccentMode): void {
    this.mode = mode;
  }

  /**
   * Loose 모드 정규화:
   * 1. NFD로 분해 후 결합 문양 제거 (é → e)
   * 2. œ → oe (French ligature 폴백)
   * 3. 대문자 동일 처리
   */
  private normalize(s: string): string {
    return s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/œ/g, 'oe')
      .replace(/Œ/g, 'Oe')
      .replace(/æ/g, 'ae')
      .replace(/Æ/g, 'Ae');
  }

  protected match(): MatchResult {
    if (!this.target) return this.emptyResult();

    const targetText = this.target.text;
    const buffer = this.buffer;

    if (this.mode === 'strict') {
      if (buffer === targetText) {
        return this.completedResult();
      }
    } else {
      // Loose: normalize both (accents + ligatures collapsed)
      if (this.normalize(buffer) === this.normalize(targetText)) {
        return this.completedResult();
      }
    }

    return this.currentResult();
  }

  protected expectedChar(): string {
    if (!this.target) return '';
    return this.target.text[this.buffer.length] ?? '';
  }

  private completedResult(): MatchResult {
    return {
      completed: true,
      accuracy: this.getAccuracy(),
      errors: this.errors,
      buffer: this.buffer,
    };
  }
}
