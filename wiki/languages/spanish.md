# Spanish (ES) - 입력 방식과 코퍼스

> ADR-0003: 액센트 직접 입력 + ASCII 폴백

## 입력 방식

**전략**: 두 가지 모드 지원.

### Strict 모드

액센트 문자(`á`, `é`, `í`, `ó`, `ú`, `ñ`, `¿`, `¡`)를 정확히 입력.

### Loose 모드 (ASCII 폴백)

| 타겟 | 허용 입력 |
| --- | --- |
| `á` | `á`, `a` |
| `é` | `é`, `e` |
| `í` | `í`, `i` |
| `ó` | `ó`, `o` |
| `ú` | `ú`, `u` |
| `ñ` | `ñ`, `n` |
| `Á` | `Á`, `A` |
| `É` | `É`, `E` |
| `Í` | `Í`, `I` |
| `Ó` | `Ó`, `O` |
| `Ú` | `Ú`, `U` |
| `Ñ` | `Ñ`, `N` |
| `¿` | `¿`, `?` (선택적) |
| `¡` | `¡`, `!` (선택적) |

### 모드 선택

- 스테이지 설정에 따라 결정
- 기본값: Loose (초급자 친화)
- 후반 스테이지: Strict (실제 입력 학습)

## 키보드 환경별 액센트 입력

### macOS

- `Option + e` 후 모음 → 액센트 부호 생성 (`á`, `é`, `í`, `ó`, `ú`)
- `Option + n` 후 `n` → `ñ`
- 또는 미국 키보드 레이아웃에서 dead key 사용

### Windows (US International)

- `' + a` → `á` (작은따옴표 + 모음)
- `~ + n` → `ñ` (물결 + n)
- 또는 Alt 코드 (`Alt + 0225` → `á`)

### Linux

- Compose 키: `Compose + ' + a` → `á`
- IBus/Fcitx 등 IME 사용 가능

### 게임 정책

게임은 **두 입력 모두 정답 처리** (모드에 따라). OS 키보드 환경은 사용자가 책임.

## 코퍼스

### 출처

- **일반 단어**: Real Academia Española (RAE) 표준 어휘
- **빈도순**: Corpus del Español,頻度辞書
- **CEFR 레벨**: A1~C2 표준 어휘 (Instituto Cervantes)
- **문장**: El País, BBC Mundo, 문학 발췌

### 코퍼스 형식

```yaml
- id: es_001
  display: hola
  accentMode: any  # 'strict' | 'loose' | 'any'
  meaning: hello
  level: 1  # A1
  category: greeting
```

또는 액센트 포함:

```yaml
- id: es_010
  display: niño
  accentMode: any
  meaning: boy/child
  level: 1
  category: family
```

### 카테고리 (예시)

| 카테고리 | 예시 |
| --- | --- |
| greeting | hola, adiós, gracias, buenos días |
| number | uno, dos, tres, diez, cien |
| color | rojo, azul, verde, amarillo |
| time | hoy, ayer, mañana, mañana (오전/내일) |
| family | madre, padre, hermano, hijo |
| food | pan, agua, carne, fruta |
| common_verb | ser, estar, tener, ir, ver, hacer |
| accent_words | niño, año, señor, entonces, después |
| body | cabeza, ojo, boca, brazo, mano, espalda, estómago, pierna, pie, corazón |
| weather | frío, llueve, despejado, soleado |
| restaurant | mesa, carta, plato, cubiertos |
| culture | abrazo, milonga, lunfardo, cabeceo, mina |
| emotion | encantar (gustar-like) |
| ... | ... |

### 난이도 (CEFR)

| 레벨 | 정의 | 특징 |
| --- | --- | --- |
| 1 | A1 | 가장 흔한 단어 500, 액센트 일부 |
| 2 | A2 | 일상 어휘, 액센트 단어 증가 |
| 3 | B1 | 일반 어휘, 회화 문장 |
| 4 | B2 | 고급 어휘, 뉴스 |
| 5 | C1~C2 | 학술/문학, 복잡한 문법 |

## 액센트 표시

### Strict 모드 단어 우선순위

- 후반 스테이지: 액센트 단어 비율 증가
- ES_med_1 (난이도 2): 액센트 단어 50%
- ES_med_2 (난이도 3): 액센트 단어 80%
- ES_hard_1, 2: 액센트 단어 100%

### 액센트 부호 시각 표시

- 화면에서 액센트 글자는 **굵게** 또는 **색상 강조**
- Loose 모드일 때는 폴백 옵션 표시 (예: `(n → ñ)`)

## 게임 통합

### 스테이지

자세한 내용: `design/systems/stage.md` > "스페인어 (ES)" 섹션

- es_easy_1 (1): A1 단어 10개 (Loose)
- es_easy_2 (1): 인사 표현 12개
- es_med_1 (2): 액센트 단어 15개 (Strict 시작)
- es_med_2 (3): 회화 문장 12개
- es_hard_1 (4): 뉴스 문장 10개
- es_hard_2 (5): 문학 발췌 8개

## 미해결 질문

- [ ] ¿/¡의 폴백 (느낌표/물음표 매핑) — 학습 효과 vs 단순성
- [ ] 대소문자 액센트 정책 (`Á` vs `A`)
- [ ] 액센트 모드 변경 시 진행도 처리

## 다음 단계

- `raw/es_words.md` 코퍼스 작성 (Phase 6) — **현재 143 entries** (101 기존 + 42 신규, 2026-07-13 card-extraction sync)
- 핸들러 구현: `prototype/src/input/SpanishHandler.ts`
- 단위 테스트: `testcases/input-handler.md` > Spanish Tests

## 코퍼스 진화 (2026-07-13)

- **Card-Extraction sync (ADR-0062)**: Language/wiki/Spanish 신규 35 entries (이번 세션) 동기화
- **추가 카테고리**: body/weather/restaurant/culture/emotion (5 신규)
- **Source format**: theme-anchor (`[[theme-vocabulary]]`) 통일 (AGENTS.md §1.5)
- **남은 gap**: Language Spanish 370 entries 중 143 → 227 gap. 향후 세션에서 추가 sync.

## Sources

- [[0003-es-accents]] — ADR-0003 (액센트 직접 입력 + ASCII 폴백, Accepted)
- [[AGENTS]] §4.3 — 스페인어 입력 방식 (액센트 á é í ó ú ñ ¿ ¡ 지원, 스테이지별 모드 선택)
- Language 위키 업스트림: `Language/wiki/Spanish/index.md`
- 코퍼스: `Game/lingotype/raw/es_words.md` (theme-anchor citation, 96 cross-language citations resolvable via shared stem convention)