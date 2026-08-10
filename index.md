# Typing Language - Wiki Index

위키/디자인/결정/테스트 페이지 카탈로그. LLM Wiki 표준 패턴.

## 메타
- [README](README.md) - 프로젝트 개요
- [AGENTS](AGENTS.md) - AI 에이전트 가이드
- [[ROADMAP]] - 단계별 계획
- [[SETUP_LOG]] - 환경 구축 기록
- [log](log.md) - 활동 로그

## 파이프라인 (Pipeline)
- [Corpus Pipeline](wiki/corpus-pipeline.md) - **`Language/` 위키에서 게임으로 콘텐츠 흘러오는 흐름**
- [Language 측 파이프라인](../../Language/wiki/pipeline-to-game.md) - 다운스트림 컨슈머 계약

## 언어 (Languages)
- [English (EN)](wiki/languages/english.md) - 입력 방식, 단어/문장 코퍼스
- [Japanese (JP)](wiki/languages/japanese.md) - **로마자→한자 매핑** (ADR-0002)
- [Spanish (ES)](wiki/languages/spanish.md) - **액센트 직접 입력 + ASCII 폴백** (ADR-0003)
- [Korean (KR)](wiki/languages/korean.md) - **한글 키보드 자모 직접 입력** (ADR-0010 Accepted)
- [KR Romanization & Jamo Mapping Reference](wiki/languages/korean-romaji-mapping.md) - **canonical mapping reference** (jamo composition 표 + 발음 변동 + Revised Romanization 표준, ADR-0010 보완)
- [Input Method Comparison](wiki/input-method-comparison.md) - 언어별 입력 방식 비교

## 코퍼스 (Corpus)
- [EN Word List](raw/en_words.md) - 영어 단어 코퍼스 (출처 포함)
- [JP Word List](raw/jp_words.md) - 일본어 단어/문장 + romaji 매핑
- [ES Word List](raw/es_words.md) - 스페인어 단어/문장
- [KR Word List](raw/kr_words.md) - 한국어 단어/문장 (Language/wiki/Korean/vocabulary/ 인용)

## 디자인 (Design)
- [Pillars](design/pillars.md) - 디자인 기둥
- [Core Loop](design/core_loop.md) - 핵심 게임 루프
- [GDD](design/GDD.md) - Game Design Document
- [Glossary](design/glossary.md) - 게임 용어
- [Systems: Input Handler](design/systems/input-handler.md) - **언어별 입력 처리**
- [Systems: Combat](design/systems/combat.md) - **단어/문장 격파 시스템**
- [Systems: Stage](design/systems/stage.md) - **스테이지 진행 / 난이도 곡선**
- [Systems: Mission](design/systems/mission.md) - **미션 시스템**
- [Systems: Progression](design/systems/progression.md) - **플레이어 성장 / 메타 진행**
- [[KEYBOARD_INPUT_DESIGN]] - **PC + 모바일 OS 키보드 통합 설계 (단일 입력 경로)**



## 가이드 (Guides)

- [[GITHUB_SETUP_GUIDE]] - GitHub 저장소 설정 절차
- [[SPANISH_KEYBOARD_GUIDE]] - 스페인어 액센트/특수문자 입력 안내
- [[LANGUAGE_CONTENT_DOCUMENTATION]] - 게임 콘텐츠 출처/언어 카탈로그
- [[corpus-sync-plan]] - Language/ 위키 ↔ 게임 코퍼스 동기화 계획

## 기능 시스템 (Feature Systems)

- [[PROFILE_SYSTEM]] - 플레이어 프로필/통계
- [[SPRITE_SYSTEM_GUIDE]] - 스프라이트 시스템 사용 안내
- [[UI_SPRITE_GUIDE]] - UI 스프라이트 명명/사용 규칙

## 디자인 보조 (Design Supplements)

- [Stage Design Spec](design/StageDesignSpec.md) - 스테이지 카탈로그/난이도 곡선 상위 spec
- [Daily Lesson Culture Plan](design/daily-lesson-culture-plan.md) - 문화 페이지 계층화 개선 계획
- [Learning Pages Improvement Plan](design/learning-pages-improvement-plan.md) - 학습 페이지 개선 기획

## 결정 기록 (Decisions)
- [Index](decisions/README.md) - 모든 ADR 목록

## 도구 (Tools)

Corpus source citation validator (added 2026-07-30):

- [tools/verify_corpus_sources.py](tools/verify_corpus_sources.py) - **`raw/{lang}_words.md` 항목의 `source: [vocab-stem]` 필드가 `Language/wiki/{Lang}/vocabulary/{stem}.md`로 resolve되는지 검증**

**Status — 2026-07-30 first run → 2026-07-30 same-day fixes → 2026-08-08 verified clean**:
- ✅ English: 1002/1002 (100%)
- ✅ Spanish: 101/101 (100%)
- ✅ Japanese: 591/591 (100%)
- ✅ Korean: 1271/1271 (100%)

**2965/2965 corpus entries pass** (0 missing, 0 unresolved). All source citations resolve to `Language/wiki/{Lang}/vocabulary/{theme}.md`.

> **Resolution history (2026-07-30)**: 1,377 unresolved citations → 0 in a single session via 5 surgical fixes — ES animals-vocabulary (8), KR travel (41), KR body-vocabulary (84), ES travel (18), plus 2 new aggregator theme-files (JP `basic-vocabulary.md`, KR `basic-vocabulary.md`). Details: `log.md` 2026-07-30 carry-over entry.

## Round 2 — Index Reconciliation (2026-07-30)

> Orphan pages reconciled from filesystem (excludes 3rd-party `node_modules/` / `venv/` / `.venv/`). Descriptions from each file's first content line.

### 메타 / 상태 (Meta — added 8)
- [[DEPLOYMENT_READY]] — 프로젝트 배포 준비 체크리스트
- [[PROJECT_STATUS]] — 프로젝트 진행 상태 요약 (2026-06-24 최종 업데이트)
- [[TEST_GAME_RESTART]] — 게임 중단 후 재시작 불가 디버깅 가이드
- [[CLI_QUICKSTART]] — CLI 도구 5분 빠른 시작 가이드
- [[SESSION_STATUS]] — 현재 세션 상태 (2026-06-25)
- [[AUDIT]] — 프로젝트 감사 보고서 (2026-06-20)
- [[KNOWN_ISSUES]] — 알려진 버그/이슈 추적
- [[DEPLOYMENT_SUCCESS]] — 배포 성공 보고서

### 위키 (Wiki — added 1)
- [wiki/extensible-languages](wiki/extensible-languages.md) — 확장 가능 언어 시스템 명세 — Implemented 2026-06-18

### 캐릭터 (Characters — added 9)
- [characters/QUICKSTART](characters/QUICKSTART.md) — 캐릭터 이미지 30분 생성 가이드
- [characters/docs/AI_CHARACTER_PROMPTS](characters/docs/AI_CHARACTER_PROMPTS.md) — 캐릭터 AI 생성 프롬프트 모음
- [characters/docs/CHARACTER_IMAGE_GUIDE](characters/docs/CHARACTER_IMAGE_GUIDE.md) — 외부 이미지 캐릭터 사용법
- [characters/docs/GEMINI_IMAGE_GENERATION](characters/docs/GEMINI_IMAGE_GENERATION.md) — Gemini 캐릭터 이미지 생성 가이드
- [characters/docs/CHATGPT_IMAGE_GENERATION](characters/docs/CHATGPT_IMAGE_GENERATION.md) — ChatGPT/DALL-E 캐릭터 생성
- [characters/docs/FILE_NAMING_GUIDE](characters/docs/FILE_NAMING_GUIDE.md) — 이미지 파일 명명 규칙
- [characters/docs/CHARACTER_GENERATION](characters/docs/CHARACTER_GENERATION.md) — 12개 캐릭터 자동화 생성 시스템
- [characters/docs/STABLE_DIFFUSION_SETUP](characters/docs/STABLE_DIFFUSION_SETUP.md) — Stable Diffusion WebUI 설치/설정
- [characters/prompts/BACKGROUND_FIX](characters/prompts/BACKGROUND_FIX.md) — Emily 캐릭터 배경 일관성 수정

### 결정 기록 (Decisions — added 12)
- [decisions/0001-tech-stack](decisions/0001-tech-stack.md) — ADR-0001: 기술 스택 (TypeScript/React/Vite) — Accepted 2026-06-18
- [decisions/0002-jp-input](decisions/0002-jp-input.md) — ADR-0002: 일본어 로마자→한자 직접 매핑 — Accepted
- [decisions/0003-es-accents](decisions/0003-es-accents.md) — ADR-0003: 스페인어 액센트 + ASCII 폴백 — Accepted
- [decisions/0004-rendering](decisions/0004-rendering.md) — ADR-0004: Canvas 렌더링 — Accepted
- [decisions/0005-state-management](decisions/0005-state-management.md) — ADR-0005: 상태 관리 — Accepted
- [decisions/0006-data-format](decisions/0006-data-format.md) — ADR-0006: 데이터 포맷 — Accepted
- [decisions/0007-testing-strategy](decisions/0007-testing-strategy.md) — ADR-0007: 테스트 전략 — Accepted
- [decisions/0008-build-target](decisions/0008-build-target.md) — ADR-0008: 빌드 타겟 — Accepted
- [decisions/0009-kr-input](decisions/0009-kr-input.md) — ADR-0009: 한국어 입력 방식 (구버전)
- [decisions/0010-kr-input](decisions/0010-kr-input.md) — ADR-0010: 한국어 입력 방식 (현재) — Accepted
- [decisions/0011-extensible-languages](decisions/0011-extensible-languages.md) — ADR-0011: 확장 가능 언어 시스템 — Accepted
- [decisions/template](decisions/template.md) — ADR 작성 템플릿 (NNNN-short-title.md)

### 문서 (Docs — added 1)
- [docs/CHARACTER_DISPLAY_OPTIONS](docs/CHARACTER_DISPLAY_OPTIONS.md) — 캐릭터 표시 옵션 (Emily 잘림 문제 등)

### 프로토타입 (Prototype — added 4)
- [prototype/CLI_TOOLS](prototype/CLI_TOOLS.md) — CLI 도구 가이드
- [prototype/DEPLOYMENT](prototype/DEPLOYMENT.md) — 다중 플랫폼 배포 가이드
- [prototype/OLLAMA_GUIDE](prototype/OLLAMA_GUIDE.md) — Ollama LLM 연동 가이드
- [prototype/docs/daily-lessons-audit](prototype/docs/daily-lessons-audit.md) — Daily Lessons 데이터 감사 보고서 (45 lessons)

### 테스트 케이스 (Test Cases — added 3)
- [testcases/input-handler-en](testcases/input-handler-en.md) — EN 입력 핸들러 테스트 케이스 (ADR-0001)
- [testcases/input-handler-jp](testcases/input-handler-jp.md) — JP 입력 핸들러 테스트 케이스 (ADR-0002)
- [testcases/input-handler-es](testcases/input-handler-es.md) — ES 입력 핸들러 테스트 케이스 (ADR-0003)

## 테스트 케이스
- [Index](testcases/README.md) - 모든 테스트 시나리오
