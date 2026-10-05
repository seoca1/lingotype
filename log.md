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
