/**
 * Chinese Input Handler
 *
 * ADR-pattern: pinyin → Han characters mapping (mirrors JapaneseHandler).
 * 출처: ../../../wiki/languages/chinese.md (Phase 18)
 *
 * 기본 전략:
 * - 타겟의 display (한자, e.g., "你好")는 정답 텍스트.
 * - 사용자는 pinyin (e.g., "ni3 hao3" 또는 "nǐ hǎo")을 입력한다.
 * - WordEntry의 `romaji` 필드에 pinyin을 저장 (JapaneseHandler 패턴 계승).
 * - 입력 모드:
 *   - tone (default): ā á ǎ à ē é ě è ... 5성 표기 사용
 *   - ascii: 숫자 tone 표기 (ni3 hao3), 일부 키보드에서 입력 어려울 때
 *
 * 중국어 특이 사항:
 * - 음소 조합: zh, ch, sh (자음 + h), n, l + ü
 * - ü 처리: nu+umlaut (nǖ) / nu (ASCII 일반화) / nv (어색; 일부 입력기 전용)
 * - 성조 1~5 (5 = neutral): ē ē̄ ē̌ ē̄ → 마크로 표현
 * - 띄어쓰기: 중국어는 띄어쓰기 없음. 코퍼스에서만 단어 구분을 위해 공백 사용
 * - 공백 무시: 사용자가 공백 생략 가능 (선택)
 *
 * 입력 모드 (`setMode`):
 * - 'tone': ā á ǎ à ē é ě è ī í ǐ ì ō ó ǒ ò ū ú ǔ ù ǖ ǘ ǚ ǜ
 * - 'ascii': ni3 hao3 (번호로 성조 표기)
 * - 둘 다 동시에 매칭 지원 (permissive)
 */

import { BaseInputHandler } from './InputHandler.js';
import type { MatchResult } from '../types.js';

export type ChineseInputMode = 'tone' | 'ascii';

const TONE_MAP: Record<string, string> = {
  ā: 'a', á: 'a', ǎ: 'a', à: 'a',
  ē: 'e', é: 'e', ě: 'e', è: 'e',
  ī: 'i', í: 'i', ǐ: 'i', ì: 'i',
  ō: 'o', ó: 'o', ǒ: 'o', ò: 'o',
  ū: 'u', ú: 'u', ǔ: 'u', ù: 'u',
  ǖ: 'v', ǘ: 'v', ǚ: 'v', ǜ: 'v', ü: 'v',
};

/** Convert pinyin (tone-mark or ASCII-numbered) → letters-only canonical form.
 *  Spaces optional (Chinese has none); tone digits discarded for comparison.
 *
 * Examples:
 *  "nǐ hǎo"     → "nihao"      "zhōngguó" → "zhongguo"
 *  "ni3hao3"    → "nihao"      "zhong1guo2" → "zhongguo"
 *  "lǜ"         → "lv"         "lv4"  → "lv"
 *  "shuǐ"       → "shui"       "shui3" → "shui"
 *
 * Tone accuracy is tracked separately (see matchable pattern). Permissive
 * here: typing practice accepts matching letters regardless of where the
 * user puts tone marks/numbers.
 */
function toCanonical(pinyin: string): string {
  let out = '';
  for (const ch of pinyin) {
    if (ch === ' ' || ch === '\t') continue;
    const tone = TONE_MAP[ch];
    if (tone) {
      out += tone;
    } else if (/[a-zA-ZüÜv]/.test(ch)) {
      out += ch.toLowerCase();
    }
    // else: digits and punctuation dropped
  }
  return out;
}

export class ChineseHandler extends BaseInputHandler {
  readonly language = 'zh' as const;
  private mode: ChineseInputMode = 'tone';

  setMode(mode: ChineseInputMode): void {
    this.mode = mode;
  }

  getMode(): ChineseInputMode {
    return this.mode;
  }

  private getRomajiTarget(): string {
    if (!this.target) return '';
    // 컨벤션: WordEntry.romaji 필드에 pinyin이 저장됨 (Japanese 패턴 동일)
    return this.target.acceptedInputs[0] ?? this.target.text;
  }

  private getCanonicalTarget(): string {
    if (!this.target) return '';
    return toCanonical(this.getRomajiTarget());
  }

  protected match(): MatchResult {
    if (!this.target) return this.emptyResult();

    const targetCanonical = this.getCanonicalTarget();
    const bufferCanonical = toCanonical(this.buffer);
    const completed =
      targetCanonical.length > 0 && bufferCanonical === targetCanonical;

    if (completed) {
      return {
        completed: true,
        accuracy: this.getAccuracy(),
        errors: this.errors,
        buffer: this.buffer,
      };
    }

    return {
      completed: false,
      accuracy: this.getAccuracy(),
      errors: this.errors,
      buffer: this.buffer,
    };
  }

  protected expectedChar(): string {
    if (!this.target) return '';
    const pinyin = this.getRomajiTarget();
    if (this.buffer.length >= pinyin.length) return '';
    return pinyin[this.buffer.length] ?? '';
  }

  getHint(): string | undefined {
    if (!this.target) return undefined;
    const pinyin = this.getRomajiTarget();
    if (this.buffer.length >= pinyin.length) return undefined;
    return pinyin.slice(this.buffer.length, this.buffer.length + 2);
  }

  /**
   * 현재 buffer 가 정답까지 prefix 일치하는지 (힌트 표시용)
   * 공백·tone 차이 무시하고 canonical 형태의 prefix 검사.
   */
  isOnTrack(): boolean {
    if (!this.target) return false;
    const target = this.getCanonicalTarget();
    const buffer = toCanonical(this.buffer);
    if (buffer.length === 0) return true;
    return target.startsWith(buffer);
  }
}
