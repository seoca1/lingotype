# Activity Log — Typing Language

> Format: `[YYYY-MM-DD] 작업종류 | 제목`
> Per workspace `AGENTS.md` §5 (log 기록) and project `AGENTS.md` §3.1/§9.

## [2026-09-28] chore | log.md 생성 — 프로젝트 활동 로그 시작

**Status**: ✅ 완료

### 작업 내용

- `Game/lingotype/log.md` 신규 생성. `index.md` §메타의 `[log](log.md)` 링크 대상이 없던 상태를 해소.
- 프로젝트 `AGENTS.md` §3.1(워크플로우 5단계)·§9(작업 종료 체크리스트)의 `log.md` 갱신 규약을 이 파일에서 이어간다.
- 형식은 워크스페이스 `AGENTS.md` §5 및 `Language/log.md`·`Fiction/log.md` 헤더 컨벤션을 계승: `[YYYY-MM-DD] 작업종류 | 제목`.

## [2026-10-04] feat | origin divergence 화해 + Chinese/French/German 포팅

**Status**: ✅ 완료

### 배경
2026-06-21 merge-base 이후 local(38 commits) 과 origin/main(145 commits) history 분기. 양쪽 고유 기능 보유.

### 작업
- **화해**: `git merge -X ours` 는 type-check 실패(remote 구 코드·구 test 혼입) → 기각. `git merge -s ours origin/main` 채택 — local working tree 보존 + remote history merge 부모로 보존. push `1ba7d1c..8758b1e`.
- **포팅** (remote history 에서): `{Chinese,French,German}Handler` + language configs + `corpus.ts` FR/DE/ZH words+sentences + `input/index.ts`/`language/index.ts` 등록 + `LanguageSelection` flag/theme + `types.ts` `WordEntry.source?` + 6 test files.
- ADR-0012(kr-corpus-relocation)·ADR-0013(rename-lingotype) 복원.

### 검증
- `tsc --noEmit`: ✅ 0 errors
- `vitest`: ✅ 790 passed / 2 skipped (32 files)
- `cli:test`: ✅ 48 passed / 0 failed (fr/de/zh handler 포함)
- `vite build`: ✅
- `audit_vault.py` (workspace): ✅ CLEAN

### 잔여
- fr/de/zh **stages 포팅 완료** (`800099c`, 6 stages each, tiers 1-3). dailyLessons 는 remote 도 en/jp/es/kr 만 커버 → fr/de/zh 레슨 불필요.
- remote 고유 docs(AUDIT.md·design/*·SESSION_* 등)·OptionsScreen·키보드 경고·a11y tests 는 미반입.

## [2026-10-04] feat | NonKoreanKeyboardWarning 포팅

**Status**: ✅ 완료 (`95ea6d1`, push)

- remote history(`1ba7d1c`)에서 `utils/keyboardLayout.ts` (`isKoreanCharacter`·레이아웃) + `ui/NonKoreanKeyboardWarning.tsx` 반입.
- `App.tsx`: 비한국어 스테이지에서 한글 문자 2연속 입력 감지 → wrong-keyboard 경고 모달. dismiss/continue 핸들러 + 렌더.
- `style.css`: 키보드 경고 스타일(사용 선택자만) append.
- **보류**: `KoreanKeyboardWarning` — KR 스테이지 시작 UX 를 바꾸므로 사용자 결정 필요 (dead file 제거).

**검증**: `tsc` 0 · `vitest` 808 passed/2 skipped · `vite build` ok.

## [2026-10-04] feat | KoreanKeyboardWarning + OptionsScreen 포팅

**Status**: ✅ 완료 (`c8c7c32`, `0ec6135`, push)

- **KoreanKeyboardWarning** (`c8c7c32`): KR 스테이지 confirm 시 pre-start 경고 (`pendingKoreanWarning` state). onContinue = 시작, onDismiss = 취소.
- **OptionsScreen** (`0ec6135`): `Options`/`DifficultyPreference` types + `state/optionsStorage.ts` (load/save/clear, sanitized) + `ui/OptionsScreen.tsx` (자체 인라인 스타일) + Menu 🎛️ 버튼 + App 배선.
- **a11y tests (phase17–39)**: ⚠️ **반입 기각** — remote UI 구현 종속(`WeakWordModal`·`koreanInputMode`·`DailyLesson.difficulty` 등), 반입 시 tsc 12 err + vitest 245 fail. local UI 에 맞춘 재작성 필요. split corpus(`{en,es,jp,kr}_corpus.ts`)도 미반입 (local `corpus.ts` 통합본).

**검증**: `tsc` 0 · `vitest` 808 passed/2 skipped · `vite build` ok.

## [2026-10-13] chore | ESLint debt 해소 — flat-config lint script 수정 + 28 errors → 0

**Status**: ✅ 완료 (미커밋 — 사용자 승인 대기)

- **lint script** (`prototype/package.json`): `eslint . --ext .ts,.tsx` → `eslint .` (flat `eslint.config.js` 는 `--ext` 미지원). `npm run lint` 정상화.
- **`no-explicit-any` 20 → 0**: AudioManager `Window & { webkitAudioContext?: typeof AudioContext }` · CharacterRenderer `SpriteName` · cli `MatchResult` · translations `SentencesByLang` record · CharacterSelect `Language` · EnemyTooltip `Target & { pronunciation?: string }` · device `LegacyNavigatorGlobals` · handler/stageLock 테스트 `MatchResult`·`StageLockInfo` · invalid-input cast 는 `as unknown as <T>`.
- **`no-case-declarations` 8 → 0**: `CharacterRenderer.ts` pose switch 5 case + `gameReducer.ts` `BACK_TO_MENU` case → 블록 `{}` 스코프.
- **부수 버그**: CLI 진단 `result.currentBuffer` 는 `MatchResult` 에 없는 필드 → `result.buffer` 정정 (기존 `any` 로 가려져 `undefined` 출력).

**검증**: `npx eslint .` 0 problems · `npx tsc --noEmit` exit 0 · `npx vitest run` 808 passed/2 skipped · `npm run lint` ✓. 변경 = `prototype/` 15 파일 (lint script 1 + src 9 + tests 5). `raw/`·`decisions/` Accepted ADR 무변경.

## [2026-10-13] a11y | foundation — WeakWordModal export + koreanInputMode + settingsSaved keys

**Status**: ✅ 완료 (미커밋)

### 작업 내용

- a11y 테스트 포팅(원격 `1ba7d1c` 분기) 1차 slice 의 foundation:
  - `src/ui/ResultScreen.tsx`: inline weak-words 블록을 `export function WeakWordModal` + `export interface WeakWordEntry` 로 추출. 동작/마크업 무변경.
  - `src/data/koreanInputMode.ts` 신규: `KoreanInputMode = 'jamo' | 'romanized'`, `getKoreanInputMode` / `setKoreanInputMode`. `nativeLanguage.ts` 패턴 그대로 미러 (lazy localStorage check + in-memory fallback). 기본 `'jamo'`, invalid stored value → `'jamo'`.
  - `src/data/uiTranslations.ts`: `TranslationKey` 에 `'settingsSaved' | 'pressEscToClose' | 'footerHint' | 'languagesSupported'` 추가 + 4개 언어 번역 추가. `settingsSaved` ko = `설정 저장됨` (`저장` 포함), ja = `設定を保存しました` (`保存` 포함), es = `Ajustes guardados` (`guardados` 포함), en = `Settings saved`.
- `decisions/0014-korean-input-mode.md` 신규 (Draft) — options 비교 + 결정/이유 + 열린 질문. `decisions/README.md` 미해결 결정 표에 entry 추가.
- 기존 `SettingsScreen.tsx` 의 native/sound/volume 핸들러는 이번 slice 에서는 아직 wiring 하지 않음 (Part B.2 에서 saved indicator 와 함께 처리).

### 검증

- `npx tsc --noEmit` · `npx eslint .` · `npx vitest run` 모두 baseline(808/2) 유지 — Part B 의 테스트 포팅은 다음 단계.

## [2026-10-13] a11y | Phase 14/17–39 a11y suite 포팅 완료 — 22 파일, 1094 passed

**Status**: ✅ 완료 (미커밋 — 사용자 승인 대기)

### 작업 내용

- 원격 `1ba7d1c` 분기의 22-file a11y suite (`tests/ui/phase{17,19..39}-a11y.test.tsx`) 를 로컬 UI 에 맞게 포팅/적응.
- 마커(wiring) 추가 — 모두 additive (aria/role/id/aria-label + `:focus-visible` CSS, 동작 무변경):
  KeyboardWarning · SettingsScreen(saved indicator) · Tutorial(region/list + (Enter) aria-label) · Menu(kbd-hint + tier aria-labelledby + stage aria-current) · MarkdownView(table caption/scope + TtsButton aria-pressed) · ResultScreen(region + missions list/listitem + progressbar + `result-missions-heading`) · LearnScreen(filter aria-pressed + status) · ProfileSelector/CharacterSelect(radiogroup/radio) · CharacterTest · OllamaTest · DailyLessonCard(3 버튼 aria-label) · DailyLessonModal · VirtualKeyboard · OSKeyboardInput(BCP47 `getLangCode` map: jp→ja, kr→ko, zh→zh-CN, fallback en) · EnemyTooltip · StageScreen · LanguageSelection(grid/radiogroup + arrow-key focus + i18n footer + aria-describedby) · style.css(`:focus-visible` 규칙).
- foundation: `WeakWordModal` export, `src/data/koreanInputMode.ts`, `uiTranslations` 4 키, `decisions/0014`(Draft).

### 검증

- `npx tsc --noEmit` 0 · `npx eslint .` 0 errors · `npx vitest run` **1094 passed | 19 skipped (1113 total, 54 files)**.
- baseline 808 → **1094** (+286 active). 남은 skip 19 = 문서화된 feature-deferral (6-lang Tutorial, local `WeakWordModal` 이 remote 의 selected-word dialog API 와 상이, remote CharacterSelect cardRefs 미구현, mojibake n/a 등) — 각 항목에 `feature-deferred:` 근거 명시.
- `README.md` 테스트 카운트 갱신. `raw/`·Accepted ADR 무변경.
