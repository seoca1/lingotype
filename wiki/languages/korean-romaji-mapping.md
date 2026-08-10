# Korean (KR) — Romanization & Jamo Mapping Reference

> **상태**: Reference doc for [ADR-0010](../../decisions/0010-kr-input.md) (Accepted 2026-06-18 / hybrid mode 2026-06-25). ADR-0010은 immutable — 이 문서는 그 매핑 표를 보완하는 **참조 문서**.
>
> **대상 독자**:
> - `prototype/src/input/KoreanHandler.ts` 구현자 / 유지보수자
> - `raw/kr_words.md` 큐레이터 (entry `romaji` 필드 검증)
> - 발음 변동 매핑이 필요한 신규 단어 추가자

---

## 1. 개요

ADR-0010은 한국어 입력 방식으로 **하이브리드** 두 모드를 정의한다:

- **jamo 모드 (기본)** — 한글 2벌식 키보드로 자모 직접 입력 + 클라이언트 합성
- **romanized 모드** — QWERTY 키보드로 Revised Romanization 로마자 입력

이 문서의 범위:
1. **romanized 모드의 매핑** — 한글 음절 ↔ Revised Romanization (canonical)
2. **jamo composition 표** — `KoreanHandler` 가 사용하는 초성/중성/종성 + 복합 모음
3. **발음 변동 규칙** — 받침 + 다음 글자 조합 (코퍼스 큐레이션 시 필수)
4. **구현 디테일** — 자동 모음 삽입, �받침 결합, QWERTY 키 매핑
5. **Romanization 표준 선택 근거**

---

## 2. Unicode Hangul Composition

한글 음절 코드포인트 = `0xAC00 + (초성 × 21 × 28) + (중성 × 28) + 종성`

- 초성 19개 (ㄱ~ㅎ, 쌍자음 �ㄸㅃㅆㅉ 포함)
- 중성 21개 (ㅏ~ㅣ, 복합 모음 11개 포함)
- 종성 28개 (없음 + ㄱ~ㅎ, 겹받침 11개 포함)

> 분해 헬퍼: `prototype/src/input/KoreanHandler.ts` 의 `decomposeSyllable(syllable: string): string[]` 가 단일 음절을 자모 시퀀스로 분해. 힌트 계산에 사용.

---

## 3. Jamo Set Reference (KoreanHandler 구현 기준)

### 3.1 Lead Consonants (초성) — 19

| Idx | Jamo | Romanization | 비고 |
|---:|:---:|:---:|---|
| 0 | � | g | |
| 1 | ㄲ | kk | 쌍자음 |
| 2 | ㄴ | n | |
| 3 | ㄷ | d | |
| 4 | ㄸ | tt | 쌍자음 |
| 5 | ㄹ | r / l | 초성 r, 종성 l |
| 6 | ㅁ | m | |
| 7 | ㅂ | b | |
| 8 | ㅃ | pp | 쌍자음 |
| 9 | ㅅ | s | |
| 10 | ㅆ | ss | 쌍자음 |
| 11 | ㅇ | (silent) | 초성 무성 — 종성은 ng |
| 12 | ㅈ | j | |
| 13 | ㅉ | jj | 쌍자음 |
| 14 | � | ch | |
| 15 | ㅋ | k | |
| 16 | � | t | |
| 17 | ㅍ | p | |
| 18 | � | h | |

### 3.2 Vowels (중성) — 21

| Idx | Jamo | Romanization | 비고 |
|---:|:---:|:---:|---|
| 0 | ㅏ | a | |
| 1 | ㅐ | ae | |
| 2 | ㅑ | ya | |
| 3 | ㅒ | yae | |
| 4 | ㅓ | eo | |
| 5 | ㅔ | e | |
| 6 | ㅕ | yeo | |
| 7 | � | ye | |
| 8 | ㅗ | o | |
| 9 | � | wa | ㅗ + ㅏ |
| 10 | ㅙ | wae | ㅗ + ㅐ |
| 11 | ㅚ | oe | ㅗ + ㅣ |
| 12 | ㅛ | yo | |
| 13 | ㅜ | u | |
| 14 | ㅝ | wo | ㅜ + ㅓ |
| 15 | ㅞ | we | ㅜ + ㅔ |
| 16 | ㅟ | wi | ㅜ + ㅣ |
| 17 | ㅠ | yu | |
| 18 | ㅡ | eu | |
| 19 | ㅢ | ui | ㅡ + ㅣ |
| 20 | ㅣ | i | |

### 3.3 Trailing Consonants (종성) — 28

| Idx | Jamo | Romanization | 비고 |
|---:|:---:|:---:|---|
| 0 | (없음) | — | 종성 없음 |
| 1 | ㄱ | k | |
| 2 | ㄲ | kk | |
| 3 | ㄳ | ks | 겹받침 |
| 4 | ㄴ | n | |
| 5 | ㄵ | nj | 겹받침 |
| 6 | ㄶ | nh | 겹받침 |
| 7 | ㄷ | t | |
| 8 | ㄹ | l | |
| 9 | ㄺ | lg | 겹받침 |
| 10 | ㄻ | lm | 겹받침 |
| 11 | ㄼ | lb | 겹받침 |
| 12 | ㄽ | ls | 겹받침 |
| 13 | ㄾ | lt | 겹받침 |
| 14 | ㄿ | lp | 겹받침 |
| 15 | ㅀ | lh | 겹받침 |
| 16 | ㅁ | m | |
| 17 | ㅂ | p | |
| 18 | ㅄ | ps | 겹받침 |
| 19 | ㅅ | s | |
| 20 | ㅆ | ss | |
| 21 | ㅇ | ng | |
| 22 | ㅈ | j | |
| 23 | ㅊ | ch | |
| 24 | ㅋ | k | |
| 25 | ㅌ | t | |
| 26 | ㅍ | p | |
| 27 | ㅎ | h | |

---

## 4. Compound Vowel Auto-Insertion

`KoreanHandler.tryCompoundVowelInsertion` 이 target text 의 lookahead 으로 자동 변환하는 케이스:

| Base 모음 | + 종성 consonant | → Compound | 예시 |
|:---:|---|---|---|
| ㅗ | + ㄴ | → ㅘ + � | ㄱ+ㅗ+ㄴ → **관**, 단, 안 |
| ㅜ | + ㄴ | → ㅝ + ㄴ | ㄱ+ㅜ+ㄴ → **권**, 둔, 문 |
| ㅡ | + ㄴ | → ㅢ + ㄴ | ㄱ+ㅡ+ㄴ → **슨**, 근, 늘 |
| ㅚ | + ㅣ | → ㅚ (no change) | |
| ㅟ | + ㅣ | → ㅟ (no change) | |

> 구현 디테일: `KoreanHandler.ts` L401-437 `tryCompoundVowelInsertion()`. target 의 다음 음절과 일치할 때만 변환 적용 — 그렇지 않으면 종성으로 떨어짐.

---

## 5. 발음 변동 (Pronunciation Variation)

받침 + 다음 글자 조합에 따라 발음이 변하는 경우. **romanized 입력은 발음 기준** 으로 매핑 (표기 기준이 아님).

### 5.1 대표음 (Representative sound)

종성 자음이 다음 음절 모음 앞에서 대표음으로 발음되는 현상:

| 받침 | 다음 | 발음 변화 | 예시 (표시 → 발음 → romanized) |
|:---:|---|---|---|
| ㄱ, ㄷ, ㅂ | 모음 | 무성화 → ㄱ→ㅋ, ㄷ→ㅌ, ㅂ→ㅍ | 국어 → 구거 → **gugeo** |
| ㄷ + ㅣ | � | → ㅊ (구개음화) | 같이 → 가치 → **gachi** |
| � + ㅅ | ㅅ | → ㅆ (경음화) | 있어요 → 이써요 → **isseoyo** |

### 5.2 연음 (Liaison)

받침이 다음 음절 초성으로 넘어가는 현상:

| 받침 | 다음 초성 | 발음 | 예시 |
|:---:|:---:|---|---|
| ㅂ | ㄴ | → ㅁ + ㄴ | 않습니다 → 안므니다 → **animnida** |
| ㅂ | ㅇ | → ㅁ + ㅇ | 십이 → 시미 → **sibi** |

### 5.3 비음화 (Nasalization)

| 받침 | 다음 초성 | 발음 | 예시 |
|:---:|:---:|---|---|
| ㄱ | ㄴ / ㅁ | → ㅇ + ㄴ / ㅇ + ㅁ | 막내 → 망내 → **mangnae** |
| ㄷ | ㄴ / ㅁ | → ㄴ + ㄴ / ㄴ + ㅁ | 닭나 → �나 → **langna** |
| ㅂ | ㄴ / ㅁ | → ㅁ + ㄴ / ㅁ + ㅁ | 밥물 → 밤물 → **bammul** |

### 5.4 구개음화 (Palatalization)

| 받침 + 모음 | 발음 | 예시 |
|---|---|---|
| ㄷ + ㅣ | → ㅊ | 같이 → 가치 → **gachi** |
| ㅌ + ㅣ | → ㅊ | 굳이 → 구지 → **guji** (ㅌ+ㅣ → ㅊ) |

### 5.5 경음화 (Fortification)

| 받침 | 다음 초성 (격음) | 발음 | 예시 |
|:---:|:---:|---|---|
| ㄱ | ㄱ / ㄷ / ㅂ / ㅅ / ㅈ | → ㄲ / ㄸ / � / ㅆ / ㅉ | 학교 → 학꾜 → **hakkyo** |
| ㄷ / ㅂ / ㅅ / ㅈ | ㄱ / ㄷ / � / ㅅ / ㅈ | → ㄲ / ㄸ / ㅃ / ㅆ / ㅉ | (위와 동일) |

> **노트**: 발음 변동 매핑 깊이 (전부 / 자주 쓰는 것만) 는 ADR-0010 §미해결 질문 1 에서 결정 대기. **현재는 자주 쓰는 것만** 매핑. corpus 추가 시 자주 쓰이는 변동 (가치/같이, animnida/습니다, bammul/밥물 등) 은 반드시 매핑할 것.

---

## 6. Romanization Standard — Revised Romanization 채택

이 프로젝트는 **국립국어원 로마자 표기법 (Revised Romanization of Korean)** 를 canonical 표준으로 채택.

### 6.1 핵심 매핑 (받침 위치별)

| 자음 | 초성 | 종성 |
|:---:|:---:|:---:|
| ㄱ | g | k |
| ㄴ | n | n |
| ㄷ | d | t |
| ㄹ | r | l |
| ㅁ | m | m |
| ㅂ | b | p |
| ㅅ | s | t |
| ㅇ | (silent) | ng |
| ㅈ | j | t |
| ㅊ | ch | t |
| ㅋ | k | k |
| ㅌ | t | t |
| ㅍ | p | p |
| ㅎ | h | t |

### 6.2 대안 비교

| 표준 | 장점 | 단점 | 이 프로젝트 채택 여부 |
|---|---|---|---|
| **Revised Romanization** (국립국어원) | 표준화 + QWERTY 친화 (ASCII) | 발음 일부 손실 | ✅ 채택 |
| **Yale** | 학계/언어학 친화 | ㅓ → e (혼동), 특수문자 | ❌ |
| **McCune-Reischauer** | 1970년대 표준 | 다이어크리틱 (ŏ, ŭ, ŭ) 필요 | ❌ |

**선택 이유**: Revised 가 가장 표준화 + ASCII (QWERTY 키보드 입력 가능) + foreigner 친화. 게임 입력은 발음 변동 적용 후 QWERTY 키로 직접 타이핑해야 하므로 diacritic-free 가 필수.

---

## 7. Input Key Mapping (event.key, 한글 2벌식)

`KoreanHandler` 의 `CONSONANTS` + `VOWELS` Set 기준. 브라우저 `event.key` 와의 매핑:

| 물리 키 | event.key | 분류 | Romanization |
|:---:|:---:|---|:---:|
| Q | ㅂ | 자음 | b |
| W | ㅈ | 자음 | j |
| E | ㄷ | 자음 | d |
| R | � | 자음 | g |
| T | ㅅ | 자음 | s |
| A | ㅁ | 자음 | m |
| S | ㄴ | 자음 | n |
| D | ㅇ | 자음 | (silent) |
| F | ㄹ | 자음 | r |
| G | ㅎ | 자음 | h |
| Z | ㅋ | 자음 | k |
| X | ㅌ | 자음 | t |
| C | ㅊ | 자음 | ch |
| V | ㅍ | 자음 | p |
| H | ㅗ | 모음 | o |
| J | ㅓ | 모음 | eo |
| K | ㅏ | 모음 | a |
| L | ㅣ | 모음 | i |
| B | ㅠ | 모음 | yu |
| N | ㅜ | 모음 | u |
| M | ㅡ | 모음 | eu |

> **주의**: macOS Caps Lock ON 시 `event.key` 가 영문자로 변환 → 자모 입력 안 됨. ADR-0010 §미해결 질문 3 — UI 경고는 미구현.

---

## 8. 겹받침 (Compound Trailing) 자동 결합 로직

`KoreanHandler.inputConsonant` + `shouldStartNewSyllable` 가 target text 와의 prefix match 으로 결정:

1. 종성 + 새 자음 입력
2. 종성으로 결합했을 때 (`composeSyllable(lead, vowel, newCons)`) 가 target 의 prefix 면 종성 채택
3. 종성 없이 현재 음절을 닫았을 때가 target 의 prefix 면 새 초성으로 분리
4. 둘 다 안 맞으면 (defensive) 종성 채택
5. 종성 결합 후 또 새 자음 → `COMPOUND_TRAILING` 겹받침 테이블 시도

### 예시

| 단어 | 입력 시퀀스 | 결합 결과 | 설명 |
|---|---|---|---|
| 박물관 | ㄱ + ㅏ + ㅂ + ㄹ + ㄱ | 박, 물(ㅂ+�+ㄹ), 관(ㄱ+ㅗ+ㄴ) | "물관" 의 ㄹ 종성 + ㄱ → 새 초성 ㄱ (ㄺ 결합 안 함) |
| 넓다 | ㄴ + ㅓ + ㄹ + ㄷ + ㅏ | 널(ㄴ+ㅓ+ㄹ), 다(ㄷ+ㅏ) | "넓" 의 � 종성 + ㄷ → ㄼ 겹받침 결합 |

> 구현 디테일: `KoreanHandler.ts` L261-323 `inputConsonant()` + L334-387 `shouldStartNewSyllable()`.

---

## 9. 코퍼스 큐레이션 가이드 (`raw/kr_words.md`)

각 entry 의 권장 YAML:

```yaml
- id: kr_001
  display: 안녕하세요       # 완성형 한글 (jamo 모드 타겟)
  romaji: annyeonghaseyo    # romanized 모드 정답 (= target.acceptedInputs[0])
  meaning: hello (polite)   # 영어 정의 (또는 한국어 뜻)
  level: 1                  # TOPIK 1~6 (낮을수록 쉬움)
  category: greeting
  source: '[[travel]]'      # Language 위키 인용 (theme-file anchor)
```

### 검증 체크리스트

- [ ] `display` 가 U+AC00 ~ U+D7A3 범위 (한글 완성형 음절)
- [ ] `display` 길이 ≥ `romaji` 길이 (한글 1음절 ≈ romaji 2~5자)
- [ ] `romaji` 가 Revised Romanization + §5 발음 변동 적용
- [ ] `display` ↔ `romaji` 양방향 검증 (`decomposeSyllable` → romanize → 비교)
- [ ] `source` 가 `Language/wiki/Korean/vocabulary/{theme}.md` 로 resolve (`verify_corpus_sources.py`)

---

## 10. Cross-references

### 구현
- `prototype/src/input/KoreanHandler.ts` — 자모 composition + romanized 매칭 (575 lines)
  - `composeSyllable()` L78-84
  - `decomposeSyllable()` L87-129
  - `inputConsonant()` L261-323
  - `inputVowel()` L439-475
  - `shouldStartNewSyllable()` L334-387
  - `tryCompoundVowelInsertion()` L401-437
- `prototype/src/data/koreanInputMode.ts` — 모드 설정 persistence (localStorage)
- `prototype/src/engine/Keyboard.ts` — `korean2set` 레이아웃

### 결정 / 명세
- [ADR-0010](../../decisions/0010-kr-input.md) (Accepted) — 하이브리드 입력 방식
- [wiki/languages/korean.md](korean.md) — 입력 방식 overview + 예시
- `design/systems/input-handler.md` — 입력 시스템 명세

### 테스트
- `prototype/tests/input/KoreanHandler.test.ts` — 자모 + romanized 매칭 테스트 (27 tests)

---

## 11. Open Questions (ADR-0010 §미해결 인용)

| # | 질문 | 상태 |
|---|---|---|
| 1 | 발음 변동 매핑 깊이 (전부 / 자주 쓰는 것만) | §5 노트 — 현재 "자주 쓰는 것만" |
| 2 | 받침 표기 통일 (표준어 vs. 실제 발음) | 미결정 |
| 3 | 한글 3벌식 지원 여부 | 미결정 |
| 4 | macOS Caps Lock 경고 UI | 미구현 |

---

## Sources

- [ADR-0010](../../decisions/0010-kr-input.md) — 한글 키보드 자모 직접 입력 + 클라이언트 합성 (Accepted 2026-06-18 / hybrid mode 2026-06-25)
- [AGENTS](../../AGENTS.md) §4.4 — 한국어 입력 방식 (코딩 규칙 + 정확성 규칙)
- `Language/wiki/Korean/` — 한국어 어휘 코퍼스 (upstream source, AGENTS.md §1.5 콘텐츠 소스 파이프라인)
- 국립국어원 로마자 표기법 — [Korean Language Standardization](https://www.korean.go.kr) (Revised Romanization 표준)
- `prototype/src/input/KoreanHandler.ts` — jamo composition + romanized matching 구현 (canonical reference for §3-§8 tables)
