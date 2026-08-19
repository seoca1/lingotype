# Setup Log - LingoType

## 2026-06-18 — 환경 구축 시작

### 디렉토리 구조 생성
- `Game/lingotype/` 아래 표준 하위 디렉토리 생성
  - `design/`, `decisions/`, `wiki/`, `prototype/`, `raw/`, `testcases/`, `log/`
- `Game/roguelike_sprawl/` 컨벤션 계승 (LLM Wiki + ADR 패턴)

### 메타 문서 작성
- `AGENTS.md` — AI 에이전트 작업 규약 (언어 정확성 규칙 포함)
- `README.md` — 프로젝트 개요 및 디렉토리 안내
- `index.md` — 위키/디자인/결정/테스트 인덱스
- `ROADMAP.md` — Phase 0~7 단계별 계획 (Phase 0 완료, Phase 1 진행 중)
- `SETUP_LOG.md` — 본 문서

### 사용자 결정 (Phase 0~2 일부)
- **플랫폼**: 웹 (TypeScript + React + Canvas)
- **일본어 입력**: 로마자→한자 직접 매핑
- **스페인어 입력**: 액센트 직접 입력 + ASCII 폴백 모두 지원
- **문서 구조**: roguelike_sprawl 스타일 모방

### 다음 작업
- Phase 1 디자인 명세 보강
- 미해결 기술 결정 (rendering, state mgmt, data format, testing, build target)
- `prototype/` 에 Vite + React + TS 스켈레톤 (Phase 3)
