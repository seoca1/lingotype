# LingoType - AI Agent Guide

이 문서는 `Game/lingotype/`에서 작업하는 모든 AI 에이전트를 위한 작업 규약이다. 루트 `AGENTS.md`와 인접 프로젝트 `Game/roguelike_sprawl/AGENTS.md`의 컨벤션을 계승한다.

## 1. 프로젝트 개요

외국어 타자 연습 게임. 영어/일본어/스페인어를 우선 지원하며, 각 언어의 **실제 입력 방식**을 그대로 반영한다(일본어는 로마자→한자 직접 매핑, 스페인어는 액센트 문자 직접 입력 또는 ASCII 폴백 모두 지원). 단어·문장은 **격파 대상 적**이자 **미션 클리어 수단**이며, 스테이지 진행에 따라 난이도가 상승한다. 자세한 내용은 `README.md`와 `ROADMAP.md`를 참조.

## 1.5 콘텐츠 소스 (업스트림 파이프라인)

이 게임의 **모든 콘텐츠(코퍼스, 문화 컨텍스트, 미션 대사)는 `Language/` 위키에서 가져온다**. 게임 자체에서 콘텐츠를 새로 만들지 않는다.

```
Language/wiki/{Lang}/vocabulary/{theme}.md    ──(cite: [테마 stem])──▶  Game/raw/{lang}_words.md
Language/wiki/{Lang}/expressions/{theme}.md   ──(cite: [테마 stem])──▶  Game/raw/{lang}_words.md
Language/wiki/{Lang}/culture/{topic}.md       ──(cite: [[wikilink]])──▶  Game/wiki/languages/{lang}.md
```

> **컨벤션 정렬 (2026-07-10)**: 사용자 원칙 "단어나 문장 하나를 .md 로 만들지 않음"이
> Language/ 측에 적용됨. 게임 측 인용도 동일 컨벤션: vocabulary 와 expressions 모두
> **theme-file** 단위 (`source: [테마 stem]`). per-word 페이지 없음.

### 규칙

1. **게임에 필요한 콘텐츠가 Language 위키에 없으면, Language에 먼저 추가한다.**
   - `Language/raw/{Lang}/` 에 출처 추가
   - `Language/wiki/{Lang}/` 인제스트 (vocabulary 는 `{theme}.md` 안 `### {word}` 섹션 / expressions 는 `{theme}.md` 안 `## {expression}` 섹션)
   - 이후 게임 코퍼스에 인용과 함께 큐레이션
2. **`raw/{lang}_words.md` 의 모든 항목은 `source: [테마 stem]` 필드로 Language 위키 vocabulary theme-file 을 인용해야 한다.** 인용 없는 항목은 lint 결함. wikilink target 은 theme-file stem 이어야 함 (per-word 페이지 없음).
3. **Language 위키는 게임 없이도 독립 성장 가능** — 게임은 다운스트림 컨슈머일 뿐.

자세한 내용: `wiki/corpus-pipeline.md`, `wiki/pipeline-to-game.md` (Language 측)

## 2. 디렉토리별 규칙

| 디렉토리 | 에이전트의 역할 | 절대 규칙 |
| --- | --- | --- |
| `raw/` | **읽기 전용** (참고 자료, 단어/문장 출처 코퍼스) | 절대 수정 금지. 출처 표기 필수. |
| `wiki/` | 자유롭게 편집, 인덱스/로그 갱신 필수 | LLM Wiki 계층. 인용이 가능한 모든 페이지에 원문/출처 인용 포함. |
| `design/` | 자유롭게 편집, 사용자 검토 영역 | 활성 스펙. 사용자가 직접 수정할 수 있음을 인지. |
| `testcases/` | 자유롭게 편집, 템플릿 사용 | 디자인 변경 시 동기화 필요. |
| `decisions/` | Draft 상태는 자유, Accepted는 immutable | 결정된 사항 임의 변경 금지, 새 결정은 신규 ADR로. |
| `prototype/` | 자유롭게 편집 (TypeScript 코드) | Phase 4에서 확정. |
| 루트 메타 파일 | 신중히 수정 | README, AGENTS, index, log, ROADMAP, SETUP_LOG |

## 3. 작업 워크플로우

### 3.1 새 언어/코퍼스 추가
1. **Language 위키 확인**: `Language/wiki/{Lang}/` 가 존재하고 콘텐츠가 충분한지 확인. 부족하면 §3.1.1 먼저 수행.
2. `raw/{lang}_words.md` 에 Language 위키 인용과 함께 항목 추가 — `source: [테마 stem]` 형식 필수 (theme-file anchor; per-word 페이지 미사용)
3. `wiki/languages/{lang}.md` 작성 — 입력 방식, 로마자 매핑 표, 액센트 표기, 코퍼스 출처 (Language 위키 링크 포함)
4. 필요시 새 ADR 작성 (입력 방식 결정)
5. `wiki/` index 갱신, `log.md` 에 `[YYYY-MM-DD] ingest | 언어/주제` 형식으로 기록
6. 영향 받는 `design/systems/input-handler.md` 등에 인용 추가

#### 3.1.1 Language 위키에 콘텐츠가 없을 때

게임 측에서 신규 언어/단어를 요구받았는데 Language 위키가 비어 있으면:

1. `Language/raw/{Lang}/` 에 출처(교재·기사·원서) 추가
2. `Language/wiki/{Lang}/` 인제스트 — vocabulary 는 `{theme}.md` 안 `### {word}` 섹션으로, expressions 는 `{theme}.md` 안 `## {expression}` 섹션으로 (per-word .md 생성 금지)
3. 이후 §3.1 의 2~6 단계 진행

**Language 위키에 시드하기 전에는 게임 코퍼스에 신규 항목을 만들지 않는다.**

### 3.2 게임 디자인 변경
1. `decisions/` 에 새 ADR 작성 또는 기존 ADR Status 변경
2. 영향 받는 `design/systems/*.md` 갱신
3. `testcases/` 에 회귀 테스트 추가/갱신
4. `design/GDD.md` 의 본문 또는 Open Questions 갱신
5. `log.md` 에 기록

### 3.3 결정 요청
- `decisions/template.md` 사용
- 옵션 비교표 + 추천안 + 열린 질문 포함 필수
- 사용자가 결정하면 Status를 "Accepted"로 변경하고 결과(Consequences) 섹션 채우기

## 4. 언어 정확성 규칙

이 게임의 핵심 가치는 **실제 언어 입력 방식을 정확히 재현**하는 것이다.

### 4.1 영어 (EN)
- 표준 QWERTY 키보드 가정
- 대소문자 모두 허용 (단, 스테이지 설정에 따라 대소문자 강제 가능)
- 문장 부호: 마침표/쉼표/물음표/느낌표 직접 입력
- 출처: 일반 영어 단어 목록, 단어장 (예: wordlist, frequency list)

### 4.2 일본어 (JP)
- **로마자→한자 직접 타이핑 방식 채택 (ADR-0002)**
- 표시: `こんにちは` (한자/히라가나), 사용자는 `konnichiwa` 입력
- 입력 표기(romaji)→표시(kanji/hiragana) 매핑 테이블을 코퍼스와 함께 제공
- 장음(ー), 촉음(っ/ッ), 요음(ょ 등) 모두 romaji에 반영
- 출처: JLPT 단어 목록, 빈도순, 한자 히라가나 표기 병기

### 4.3 스페인어 (ES)
- **액센트 문자 직접 입력 + ASCII 폴백 모두 지원 (ADR-0003)**
- 액센트 모드: `á` `é` `í` `ó` `ú` `ñ` `¿` `¡`를 정확히 입력
- ASCII 폴백: `a`로 `á` 입력, `n`으로 `ñ` 입력 가능
- 스테이지별로 모드 선택 가능
- 출처: 일반 스페인어 단어 목록, DLE (Diccionario de la lengua española) 참조

### 4.4 추가 언어 (향후)
- 중국어(간체/번체), 프랑스어, 독일어, 러시아어, 아랍어 등
- 각 언어는 `wiki/languages/{lang}.md` + 코퍼스 + 입력 매핑 필요
- IME 의존성, 문자 인코딩(UTF-8) 호환성 확인 필수

## 5. LLM Wiki Operations (raw / wiki)

이 프로젝트도 표준 LLM Wiki 패턴을 따른다.

- **Ingest**: raw에 새 자료 → 관련 wiki 페이지 작성/갱신 → index 갱신 → log 기록
- **Query**: 사용자가 질문 → index로 관련 페이지 찾기 → 인용과 함께 답변 → 가치가 있으면 결과를 새 wiki 페이지로 file-back
- **Lint**: 주기적으로 wiki 건강 점검
  - orphan 페이지 (인바운드 링크 없음)
  - 모순 (여러 페이지의 동일 주제 다름)
  - 인용 누락 (사실 단언인데 출처 없음)
  - 갱신 필요한 페이지 (오래된 정보)

## 6. 코딩 규칙 (Accepted 결정 반영)

### 언어 및 의존성
- **언어**: TypeScript 5.x
- **프레임워크**: React 18 (UI), HTML5 Canvas (렌더링)
- **빌드**: Vite
- **테스트**: Vitest
- **린트 / 포맷**: ESLint + Prettier
- **타입 체크**: tsc (strict)
- **의존성 관리**: package.json + npm (또는 pnpm)

### 스타일
- 2-space indent
- 모든 public 함수 / 컴포넌트에 타입 명시
- 한 줄 100자
- 1인칭 표현 ("we"), 명령형 ("Add", "Run")
- 함수형 컴포넌트 우선, hooks 활용

### 디렉토리 (Phase 4에서 확정)
```
prototype/
├── src/
│   ├── engine/        # 게임 루프, 렌더링
│   ├── input/         # 키보드/IME 처리, 언어별 핸들러
│   ├── stage/         # 스테이지 진행, 난이도
│   ├── combat/        # 단어/문장 격파 시스템
│   ├── mission/       # 미션 정의/클리어
│   ├── data/          # 정적 데이터 (단어장, 문장, 스테이지)
│   └── ui/            # React 컴포넌트
├── tests/
└── package.json
```

### i18n (UI 번역) 가이드라인
- **1차**: 영어 (en) — UI 기본
- **보조**: 한국어 (ko) — 메뉴/도움말 번역
- **언어 콘텐츠(타자 대상)**: EN/JP/ES가 1차, 그 외 추후

## 7. 절대 하지 말 것

- `raw/` 수정
- 결정된 사항(`decisions/`의 Accepted 상태) 임의 변경
- 한 세션에 너무 많은 문서/파일 변경 (사용자 검토 부담)
- 언어 정확성에 대한 무성한 단언 (코퍼스/원문 인용 필수)
- 다른 타자 게임의 메카닉 단순 차용 (각주/근거 없는 경우)

## 8. 작업 시작 체크리스트

- [ ] `ROADMAP.md` 의 "Current Phase" 확인
- [ ] `decisions/README.md` 에서 미해결 결정 확인
- [ ] `index.md` 에서 관련 위키 페이지 찾기
- [ ] 작업 완료 후 `log.md` 갱신

## 9. 작업 종료 체크리스트

- [ ] `index.md` 가 새 페이지를 모두 가리키는가
- [ ] `log.md` 에 이번 세션 작업이 기록되었는가
- [ ] 영향 받는 `design/`/`testcases/`/`decisions/`가 동기화되었는가
- [ ] raw에서 읽은 자료는 모두 인용되었는가
