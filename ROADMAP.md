# Typing Language - 단계별 계획 (Roadmap)

## 전체 흐름

```
Phase 0: 문서 시스템 기반       [✅ 완료]
    ↓
Phase 1: 디자인 명세 작성       [✅ 완료]
    ↓
Phase 2: 핵심 기술 결정         [✅ 완료]
    ↓
Phase 3: 개발 환경 구축         [✅ 완료]
    ↓
Phase 4: 입력 시스템 프로토타입 [✅ 완료]
    ↓
Phase 5: 격파/미션 시스템       [✅ 완료]
    ↓
Phase 6: 코퍼스/콘텐츠 제작     [✅ 완료]
    ↓
Phase 7: 알파 빌드              [🔄 현재 진행]
```

각 단계는 직전 단계의 결과에 의존하지만, **사용자 결정**(Phase 2)은 어느 시점에서든 끼워넣을 수 있다. 디자인 명세(Phase 1)와 결정(Phase 2)은 병행 가능하다.

---

## Phase 0: 문서 시스템 기반

**목표**: 지속 가능한 문서 체계 구축. LLM과 사용자가 함께 진화시킬 수 있는 구조.

**완료 조건**:
- [x] 디렉토리 구조 (raw / wiki / design / testcases / decisions)
- [x] 메타 문서 (README, AGENTS, index, log, ROADMAP, SETUP_LOG)
- [x] 디자인 문서 골격 (Pillars, Core Loop, GDD, Glossary)
- [x] 시스템 명세 골격 (Input Handler, Combat, Stage, Mission, Progression)
- [x] 결정 기록 템플릿 (ADR)
- [x] 테스트 케이스 템플릿
- [x] 언어별 wiki 페이지 골격 (EN/JP/ES)
- [x] 코퍼스 골격 (EN/JP/ES)

**상태**: 완료 (2026-06-18)

---

## Phase 1: 디자인 명세 작성 (Game Design Spec)

**목표**: 게임의 디자인을 명문화. 사용자가 직접 수정 가능한 "활성 스펙".

**완료 조건**:
- [x] `design/pillars.md` - 디자인 기둥
- [x] `design/core_loop.md` - 핵심 게임 루프
- [x] `design/GDD.md` - GDD 골격
- [x] `design/glossary.md` - 게임 용어
- [x] `design/systems/input-handler.md` - 언어별 입력 처리
- [x] `design/systems/combat.md` - 단어/문장 격파
- [x] `design/systems/stage.md` - 스테이지 진행/난이도
- [x] `design/systems/mission.md` - 미션 시스템
- [x] `design/systems/progression.md` - 플레이어 성장
- [ ] 각 시스템의 수치/공식 (placeholder OK)
- [ ] `testcases/` 에 시스템별 시나리오 작성
- [ ] `wiki/languages/*.md` 보강 (실제 입력 매핑, 단어 예시)

### Phase 1 콘텐츠 우선순위
1. **Pillars & Core Loop** (필수) — 게임의 정체성
2. **Input Handler** (필수) — 게임의 핵심 차별점
3. **Stage & Combat** (필수) — 핵심 메카닉
4. **Mission & Progression** (보조) — 깊이/리플레이

---

## Phase 2: 핵심 기술 결정 (Tech Stack)

**목표**: 엔진/프레임워크/아키텍처 결정. `decisions/`의 ADR을 Accepted 상태로.

**결정 항목** (사용자 사전 결정 반영):
- [x] `0001-tech-stack.md` - **TypeScript + React + Canvas + Vite** (웹)
- [x] `0002-jp-input.md` - **로마자→한자 직접 매핑**
- [x] `0003-es-accents.md` - **액센트 직접 입력 + ASCII 폴백**
- [x] `0010-kr-input.md` - **한글 키보드 자모 직접 입력 + 클라이언트 합성**
- [x] `0011-extensible-languages.md` - **확장 가능한 언어 레지스트리 시스템**
- [x] Rendering: **Canvas 2D** (implemented)
- [x] State Management: **React useState + Reducer** (implemented)
- [x] Data Format: **TypeScript const** (implemented)
- [x] Testing: **Vitest + Playwright** (implemented)
- [x] Build Target: **SPA** (implemented)

**완료 조건**:
- [x] 모든 핵심 ADR Accepted
- [x] 선택된 기술 스택이 디자인 명세의 제약을 충족
- [x] 일관성 확인 (decisions/README.md)

**상태**: 완료 (2026-06-18)

---

## Phase 3: 개발 환경 구축 (Dev Environment)

**목표**: 실제 코드를 작성할 수 있는 환경 셋업.

**작업**:
- [x] `prototype/` 에 Vite + React + TS 스켈레톤
- [x] 디렉토리 구조 확정 (engine, input, stage, combat, mission, data, ui, language, character, effects, cli)
- [x] 빌드 시스템 (Vite)
- [x] 테스트 프레임워크 (Vitest)
- [x] 린트/포맷터 (ESLint)
- [x] 타입 체크 (tsc strict)
- [x] 에디터 설정
- [x] 첫 hello-world 실행 (빈 캔버스 + 키보드 입력)
- [x] `AGENTS.md` 갱신 (코딩 규칙 추가)

**완료 조건**:
- [x] 빈 프로젝트가 빌드/실행/테스트 가능
- [x] 단위 테스트 자동 실행 가능
- [ ] CI가 PR에서 자동 실행 (optional)

**상태**: 완료 (2026-06-18)

---

## Phase 4: 입력 시스템 프로토타입 (Vertical Slice #1)

**목표**: 각 언어의 입력이 실제로 동작하는 상태.

**프로토타입 범위**:
- [x] 키보드 이벤트 캡처 (composition events for IME)
- [x] EN 입력 핸들러 (plain text)
- [x] JP 입력 핸들러 (romaji → kanji 매핑)
- [x] ES 입력 핸들러 (accents + ASCII fallback)
- [x] KR 입력 핸들러 (romaji → hangul 매핑)
- [x] 화면에 표시: 타겟 문장 + 현재 입력 + 정확도 표시
- [x] 한 단어 완료 시 콜백
- [x] 언어별 loose/strict 모드 지원

**완료 조건**:
- [x] "Type a word in each language" 가능
- [x] 언어 전환 가능
- [x] 모든 핸들러에 단위 테스트 (673개)

**추가 구현**:
- [x] 확장 가능한 언어 레지스트리 시스템
- [x] CLI 테스트 도구 (cli:test, cli:verify, cli:interactive)
- [x] 언어별 LanguageConfig 분리

**상태**: 완료 (2026-06-18)

---

## Phase 5: 격파/미션 시스템 프로토타입 (Vertical Slice #2)

**목표**: 단어/문장을 격파하고 미션을 클리어하는 사이클.

**프로토타입 범위**:
- [x] 적(단어/문장) 생성 시스템
- [x] 타이핑 진행도 → 적 HP
- [x] 정확도/속도 → 데미지/점수
- [x] 미션 정의 (예: "EN 단어 10개 격파", "JP 문장 3개 정확히 입력")
- [x] 스테이지 140개 (4개 언어, Tier 0-5)
- [x] 결과 화면 (WPM, 정확도, 미션 클리어)

**완료 조건**:
- [x] "Play one stage" 가능
- [x] WPM/정확도 측정 가능
- [x] 미션 클리어/실패 분기

**추가 구현**:
- [x] 실시간 비주얼 피드백 (파티클, 플래시, 화면 흔들림)
- [x] 콤보 시스템 (연속 정타)
- [x] 점수 팝업 (PERFECT, COMBO 라벨)
- [x] 적 격파 이펙트 (언어별 색상 팔레트)
- [x] 가상 키보드 UI (누름/힌트 애니메이션)
- [x] 컴패니언 캐릭터 시스템 (상태 머신, 반응 애니메이션)
- [x] 언어별 문화 의상 (영미/기모노/플라멩코/한복)

**상태**: 완료 (2026-06-18)

---

## Phase 6: 콘텐츠 (Content Pipeline)

**목표**: 다양한 단어/문장/스테이지를 추가하여 replayability 확보.

**작업**:
- [x] EN 단어장 (50개 - 기본/일상/시간)
- [x] EN 문장 (20개 - 회화/질문/설명)
- [x] JP 단어장 (61개 - 인사/숫자/시간/장소/일상)
- [x] JP 문장 (22개 - 회화/질문/설명)
- [x] ES 단어장 (58개 - 인사/숫자/일상/감정 + 띄어쓰기 표현)
- [x] ES 문장 (21개 - 회화/질문/설명)
- [x] KR 단어장 (28개 - 인사/숫자/가족/음식/시간/학교)
- [x] KR 문장 (3개 - 기본 회화)
- [x] 스테이지 템플릿 140개 (언어별 Tier 0-5)
- [x] 미션 시스템 (단어 수, 정확도, 시간 제한)
- [x] Language 위키 파이프라인 (업스트림 콘텐츠 소스)

**완료 조건**:
- [x] 한 세션이 15~30분 분량 (Tier 1-3 완주 기준)
- [x] 언어별 다양한 스테이지 (140개)
- [x] 총 코퍼스: **4,038개 항목** (EN 1,054 + JP 502 + ES 1,246 + KR 1,236, auto-generated from Language wiki)

**확장 가능 (Tier 4-5)**:
- [ ] 추가 단어장 (각 언어 100+)
- [ ] 긴 문장/문단 (Tier 4-5)
- [ ] 보스 스테이지 (속도 제한, 특수 규칙)

**상태**: 완료 (2026-06-18)

---

## Phase 7: 알파 빌드 ✅

**목표**: 외부 테스트 가능한 빌드.

**작업**:
- [x] 튜토리얼/온보딩 (3단계 튜토리얼 + Skip 기능)
- [x] 비주얼 폴리시 (컴패니언 캐릭터, 파티클, 키보드 UI, 언어별 색상)
- [x] 세이브/로드 (localStorage - 진행도/스탯 저장)
- [x] 빌드/배포 파이프라인 (GitHub Pages)
- [x] SVG favicon + OG/Twitter meta tags
- [ ] 사운드 (BGM, SFX) - optional
- [ ] 옵션 메뉴 (키맵, 색맹 모드)
- [ ] 크래시 리포팅

**현재 상태**:
- ✅ 게임 코어 완성 (입력/격파/미션/스테이지/캐릭터)
- ✅ 4개 언어 지원 (EN/JP/ES/KR)
- ✅ 140 스테이지 (Tier 0-5, Romance/Travel 테마)
- ✅ **680개 테스트 통과** (1 skipped)
- ✅ 프로덕션 빌드 가능 (971KB gzip 298KB)
- ✅ GitHub Pages 자동 배포
- ✅ **Daily lessons 52/52** (100% topic-appropriate culture; EN 15 + JP 14 + ES 11 + KR 12)
- ✅ SVG favicon + OG/Twitter Card meta tags
- ✅ 4,038 코퍼스 항목 (EN 1,054 + JP 502 + ES 1,246 + KR 1,236)

**남은 작업**:
1. ⚠️ 이슈 #1 Fix: Blank screen after multiple restarts (mitigated)
2. ⚠️ 이슈 #4 Fix: Settings Native Language persistence (partial)
3. 사운드 (BGM, SFX) - optional
4. 옵션 메뉴 (키맵, 색맹 모드)

---

## 현재 위치

**현재 Phase**: **Phase 7 — 알파 빌드 완료** ✅

**완료된 Phase**:
- ✅ Phase 0: 문서 시스템 기반
- ✅ Phase 1: 디자인 명세 작성
- ✅ Phase 2: 핵심 기술 결정
- ✅ Phase 3: 개발 환경 구축
- ✅ Phase 4: 입력 시스템 프로토타입 (4개 언어)
- ✅ Phase 5: 격파/미션 시스템 (비주얼 포함)
- ✅ Phase 6: 콘텐츠 파이프라인 (197 단어 + 66 문장)

**다음 작업**:
1. ✅ GitHub Pages 배포 설정 (완료)
2. ✅ 메타 태그/OG 이미지 추가 (완료 — SVG favicon + OG/Twitter Card)
3. README 업데이트 (라이브 데모 링크)
4. 사운드 (BGM, SFX) — optional

**프로젝트 현황**:
- **코드베이스**: 15,000+ LOC
- **테스트**: 680 tests (1 skipped)
- **번들 크기**: 971KB (gzip 298KB)
- **언어**: 4개 (EN/JP/ES/KR)
- **스테이지**: 140
- **Daily Lessons**: 52 (100% culture coverage)
- **Corpus**: 4,038 entries (EN 1,054 + JP 502 + ES 1,246 + KR 1,236)
- **Daily Lessons**: 45
- **총 코퍼스**: EN 155 / JP 117 / ES 137 / KR 105
