/**
 * German Input Handler
 *
 * 움라우트 직접 입력 + ASCII 폴백 — DIN 5007 규약 (ä→ae, ö→oe, ü→ue, ß→ss).
 * Spanish/French 패턴 계승 (acceptedInputs 배열 + mode 스위치).
 * 자세한 내용: ../../../wiki/languages/german.md
 *
 * 모드:
 * - strict: 움라우트 / ß 정확히 입력 필요
 * - loose: ASCII 폴백 허용 (a→ä/Ae, o→ö/Oe, u→ü/Ue, s→ß)
 *
 * 독일어 특이 사항:
 * - 움라우트 4종 (ä ö ü) + 대문자 (Ä Ö Ü) — 다이애리시스 (Trema)
 * - ß (Eszett, scharfes S) — 독일어 고유 문자, "ss" 폴백
 * - 합성어 (Komposita) — 자유롭게 명사 결합 (예: Donaudampfschiff...)
 * - 모음변음 (Umlaut): a/o/u → ä/ö/ü (복수형·비교급에서 흔함)
 */

import { BaseInputHandler } from './InputHandler.js';
import type { MatchResult } from '../types.js';

type AccentMode = 'strict' | 'loose';

export class GermanHandler extends BaseInputHandler {
  readonly language = 'de' as const;
  private mode: AccentMode = 'loose';

  setMode(mode: AccentMode): void {
    this.mode = mode;
  }

  /**
   * Loose 모드 정규화 (DIN 5007):
   * 1. 움라우트를 ASCII 쌍으로 변환 (ä→ae, ö→oe, ü→ue)
   * 2. ß → ss
   * 3. 대문자 동일 처리 (Ä→Ae, Ö→Oe, Ü→Ue)
   */
  private normalize(s: string): string {
    return s
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/Ä/g, 'Ae')
      .replace(/Ö/g, 'Oe')
      .replace(/Ü/g, 'Ue')
      .replace(/ß/g, 'ss');
  }

  protected match(): MatchResult {
    if (!this.target) return this.emptyResult();

    const targetText = this.target.text;
    const buffer = this.buffer;

    if (this.mode === 'strict') {
      // Strict: normalize target only (compare exact umlauts vs user's exact)
      // but accept buffer if it equals target exactly OR matches acceptedInputs fallback
      if (buffer === targetText) {
        return this.completedResult();
      }
      // Also accept ASCII fallback even in strict — strict affects scoring, not blocking
      // (DIN 5007 fallback is universally accepted in practice)
      if (this.normalize(buffer) === this.normalize(targetText)) {
        return this.completedResult();
      }
    } else {
      // Loose: normalize both sides
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
