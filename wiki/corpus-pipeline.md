# Corpus Pipeline: Language → Game

이 게임의 콘텐츠(코퍼스, 문화 컨텍스트, 미션 대사)는 `Language/` 위키에서 가져온다. 이 문서는 **업스트림(콘텐츠가 흘러나오는 쪽)** 관점에서 게임 에이전트가 따라야 할 절차다.

## 핵심 원칙

1. **`Language/`가 단일 진실 공급원이다.** 게임 코퍼스는 Language 위키에서 끌어와 큐레이션한 것이다.
2. **부족하면 Language에 먼저 추가하고 게임으로 반영한다.** 게임 자체에서 콘텐츠를 새로 짓지 않는다.
3. **모든 게임 코퍼스 항목은 Language 위키 페이지로 인용되어야 한다.** 인용 없는 항목은 lint에서 결함.
4. **Language 위키는 게임 없이도 독립적으로 성장한다.** 게임은 Language의 다운스트림 컨슈머일 뿐이다.

## 데이터 흐름

```
┌────────────────────────┐                ┌─────────────────────────────────┐
│ Language/raw/{Lang}/   │  ─ ingest ──▶  │ Language/wiki/{Lang}/           │
│ (소스 자료, immutable)  │                │  ├─ vocabulary/{theme}.md       │
└────────────────────────┘                │  │   (예: travel.md, food.md)    │
                                           │  ├─ expressions/{theme}.md      │
                                           │  ├─ culture/{topic}.md          │
                                           │  └─ sources/{source}.md         │
                                           └──────────────┬──────────────────┘
                                                          │ curate
                                                          ▼
                                           ┌─────────────────────────────────┐
                                           │ Game/typing_language/raw/       │
                                           │  └─ {lang}_words.md             │
                                           │      (source: [테마 stem])      │
                                           └──────────────┬──────────────────┘
                                                          │ build
                                                          ▼
                                           ┌─────────────────────────────────┐
                                           │ Game/typing_language/prototype/ │
                                           │  └─ src/data/{lang}_words.json  │
                                           └─────────────────────────────────┘
```

## 게임 측 위치 매핑

| 게임 측 | 언어 | Language 위키 (업스트림) |
| --- | --- | --- |
| `wiki/languages/english.md` | EN | `Language/wiki/English/` |
| `wiki/languages/spanish.md` | ES | `Language/wiki/Spanish/` |
| `wiki/languages/japanese.md` | JP | `Language/wiki/Japanese/` |
| `wiki/languages/korean.md` | KR | `Language/wiki/Korean/` |

| 게임 코퍼스 | Language 출처 (theme-file 컨벤션) |
| --- | --- |
| `raw/en_words.md` | `Language/wiki/English/vocabulary/{theme}.md` (예: `travel.md`, `food-vocabulary.md`) |
| `raw/es_words.md` | `Language/wiki/Spanish/vocabulary/{theme}.md` (예: `viajes.md`, `food-vocabulary.md`) |
| `raw/jp_words.md` | `Language/wiki/Japanese/vocabulary/{theme}.md` (예: `travel.md`, `food-vocabulary.md`) |
| `raw/kr_words.md` | `Language/wiki/Korean/vocabulary/` |

## 작업 흐름 (게임 콘텐츠가 필요할 때)

### 시나리오 A: 게임 신규 콘텐츠 필요

```
1. Game: "한국어 인사말 10개가 필요"
2. 에이전트: Language/wiki/Korean/vocabulary/ 점검
3. 케이스 A1 — 충분하면:
     → Game/typing_language/raw/kr_words.md 에 큐레이션 (source 필드에 인용)
     → wiki/languages/korean.md 갱신
     → log.md 기록
4. 케이스 A2 — 부족하면:
     → Language/raw/Korean/ 에 출처 추가 (사용자에게 권고)
     → 사용자가 출처 추가 후 인제스트 지시
     → Language/wiki/Korean/vocabulary/ 페이지 생성 (또는 신규 단어를 기존 `{theme}.md` 안 `### {word}` 섹션으로 추가)
     → Game/typing_language/raw/kr_words.md 에 큐레이션
     → 양쪽 log 기록

> 게임 측 코퍼스는 vocabulary 만이 아니라 `expressions/{theme}.md` (관용구) 도 동일한 5필드 + source anchor 패턴으로 큐레이션 가능하다 (2026-07-10 갱신). 예: `raw/jp_idioms.md`, `raw/es_idioms.md` 등을 별도 게임 코퍼스로 운영 가능.
```

### 시나리오 B: 게임 신규 언어 추가

```
1. Game: "한국어 지원 추가"
2. 에이전트: 
   - Language/wiki/Korean/ 존재 확인 (없으면 Language 먼저 시드)
   - Language/raw/Korean/ 에 최소 출처(예: TOPIK 1 단어장) 추가
   - Language/wiki/Korean/ 인제스트
   - Game/typing_language/decisions/0009-kr-input.md (Draft) 작성 — 입력 방식 ADR
   - 사용자 결정 대기
   - 결정 후 Game/typing_language/wiki/languages/korean.md 작성
   - Game/typing_language/raw/kr_words.md 골격 작성 (Language 위키 인용)
   - Game/typing_language/index.md, log.md 갱신
```

### 시나리오 C: 기존 언어 코퍼스 확장

```
1. Game: "스페인어 단어 30개 더 필요"
2. 에이전트:
   - Language/wiki/Spanish/vocabulary/ 에 미사용 페이지가 있는지 확인
   - 미사용이면 Language에 새 출처 추가 권고
   - 인제스트 후 게임 코퍼스 확장
```

## 게임 코퍼스 항목 스키마

`Game/typing_language/raw/{lang}_words.md` 의 각 항목은 다음 필드를 갖는다:

| 필드 | 필수 | 출처 (Language 위키) | 비고 |
| --- | --- | --- | --- |
| `id` | 필수 | 에이전트 부여 | `{lang}_{NNN}` |
| `display` | 필수 | `wiki/{Lang}/vocabulary/{theme}.md` 안 `### {word}` 섹션의 단어 (theme-file 컨벤션, 2026-07-10 갱신) | 화면 표시용 |
| `input` | 필수 | 동일 (또는 언어별 변환) | 사용자가 타이핑할 키 시퀀스 |
| `meaning` | 필수 | 동일 섹션의 정의 | 한국어 번역 또는 영어 |
| `level` | 필수 | vocabulary theme-file 머리 메타 (page-level `**Level:**` 필드) | CEFR/JLPT/TOPIK 등 |
| `category` | 필수 | vocabulary theme-file 머리 메타 (page-level `**Category:**` 필드) | 인사/숫자/색상 등 |
| `source` | **필수** | `[[{theme-filename}]]` (단일 theme anchor) | Language 위키 vocabulary theme-file 인용. per-word 페이지 없음. (없으면 lint 결함) |
| `note` | 선택 | 자유 | 게임 메카닉에 필요한 비고 (예: irregular, polysemy) |

> **컨벤션 정렬 (2026-07-10)**: 사용자 원칙 "단어나 문장 하나를 .md 로 만들지 않음"이
> Language/ 측 vocabulary 와 expressions 양쪽에 적용됨. 게임 코퍼스도 동일 컨벤션:
> vocabulary 와 expressions 모두 **theme-file** 단위로 인용 (`source: [테마 stem]`).
> 단어/표현 한 개당 .md 페이지를 만들지 않으므로, source 도 그에 맞춰 정규화.

## cite 규칙

```yaml
# GOOD — source 필드에 Language 위키 theme-file 링크
- { id: jp_001, display: こんにちは, input: konnichiwa, meaning: hello, level: 5, category: greeting, source: "[[travel]]" }

# BAD — source 없음 또는 일반 텍스트만
- { id: jp_001, display: こんにちは, input: konnichiwa, meaning: hello, level: 5, category: greeting }

# BAD — per-word stem 인용 (per-word 페이지 없으므로 깨짐)
- { id: jp_001, display: こんにちは, input: konnichiwa, meaning: hello, level: 5, category: greeting, source: "[[konnichiwa]]" }
```

`source` 가 `[[wikilink]]` 형식이 아니면 lint에서 경고한다. wikilink target 은
반드시 `wiki/{Lang}/{vocabulary,expressions}/{theme}.md` 의 stem 이어야 한다.

## 절대 규칙

1. **`raw/` 직접 수정 금지** — 모든 코퍼스 추가/수정은 `raw/` 의 YAML 리스트에 append 형태로만.
2. **인용 없는 신규 항목 금지** — `source: [[...]]` 가 없으면 인제스트 불가.
3. **Language에 없는 콘텐츠를 게임에서 새로 만들지 않는다** — 반드시 Language에 먼저 시드.
4. **Accept 된 ADR 위배 금지** — 입력 방식·로마자 표기 등은 ADR에 종속.

## 동기화 lint (주기 점검)

- [ ] `Game/typing_language/raw/{lang}_words.md` 의 모든 항목이 `source: [[...]]` 를 가지는가
- [ ] 인용된 Language 페이지가 실제로 존재하는가 (orphan citation 검출)
- [ ] Language 위키에 신규 vocabulary가 추가됐는데 게임 코퍼스에는 없는 항목이 있는가 (확장 후보)
- [ ] Language 위키의 메타 변경(예: 난이도 라벨)이 게임 코퍼스에 반영되었는가

## 관련 문서

- Language 측 파이프라인: `Language/wiki/pipeline-to-game.md`
- 언어별 게임 프로필: `Game/typing_language/wiki/languages/{lang}.md`
- 결정 기록: `Game/typing_language/decisions/`
- 언어 정확성 규칙: `Game/typing_language/AGENTS.md` §4

## Sources

- [[pipeline-to-game]] — Language 측 다운스트림 계약 (theme-file anchor 컨벤션 정의)
- [[AGENTS]] §1.5 — 코퍼스 citation 규약
- [[AGENTS]] §3.1 — 새 언어/코퍼스 추가 워크플로우
- [[AGENTS]] §4 — 언어 정확성 규칙 (EN/JP/ES/KR 입력 방식)