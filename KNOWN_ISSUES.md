# 🐛 알려진 이슈 (Known Issues)

게임의 알려진 버그와 문제점을 추적하는 문서입니다.

**최종 업데이트:** 2026-08-08

---

## 🔴 Critical Issues (치명적)

### Issue #1: 게임 중단 후 재시작 시 빈 화면

**상태:** ✅ Fixed (pre-render validation + RAF resilience)
**우선순위:** Critical
**발견일:** 2026-06-18
**마지막 수정:** 2026-06-25

#### **증상:**
게임 여러 번 왕복 후 새 스테이지 시작 시 빈 화면 표시

#### **근본 원인:**
- StageScreen mount/unmount 주기에 canvas ref가 stale 참조가 될 수 있음
- Renderer 생성 시점의 canvas context가 unmount 후 무효화될 수 있음
- 렌더 루프에서 stale closure(`renderer` 로컬 const)를 참조하여 유효하지 않은 canvas에 렌더링 시도

#### **해결책 (2026-06-24 → 2026-06-25):**

1. **App.tsx — render effect 가드 추가:**
   - `canvas.isConnected` + dimensions 0 체크로 StageScreen 미준비 상태 건너뛰기
   - 새 스테이지 시작 시 fresh Renderer 생성 보장

2. **App.tsx — tick 루프 방어:**
   - 매 프레임 `canvas.isConnected` + dimensions 체크
   - `Renderer.isCanvasValid()`로 context 유효성 검증
   - 유효하지 않으면 `Renderer.recreateFrom()`으로 컨텍스트 재생성

3. **Renderer.ts — 새 메서드:**
   - `isCanvasValid(canvas)`: canvas 연결 및 dimensions 유효성 검사
   - `recreateFrom(canvas)`: 컨텍스트 재생성 (dimensions 갱신 포함)

4. **App.tsx — pre-render validation (2026-06-25):**
   - **핵심 수정**: RAF 루프의 tick()에서 `r.render()` 직전에 `canvas.isConnected` + `isCanvasValid` 재검사
   - 기존 검사(líneas 213-228)는 RAF 시작 시점에만 수행 → 그 사이에 DOM이 변하면 race condition
   - pre-render 검사 추가로 모든 RAF 프레임에서 fresh canvas context 보장
   - render() 예외를 catch해도 RAF를 유지 (`rafId = requestAnimationFrame(tick)` 명시)
   - recreateFrom 실패 시에도 RAF 재개 (`rendererRef.current = null` 후 RAF 계속)

#### **관련 파일:**
- `src/ui/StageScreen.tsx` - Canvas 렌더링 컴포넌트
- `src/engine/Renderer.ts` - 렌더링 루프 (isCanvasValid, recreateFrom 추가)
- `src/App.tsx` - 컴포넌트 마운팅, render 호출 (방어 코드 추가)

---

## 🟡 Medium Issues (중간)

### Issue #3: Spin 효과 부자연스러움

**상태:** ✅ Improved
**우선순위:** Medium
**발견일:** 2026-06-18
**수정일:** 2026-06-23

#### **수정 내용:**
기존 sin 기반 scaleX에서 0이 되는 지점에서 이미지가 사라지는 문제 수정:
- scaleX가 0에 가까워지면 최소값(±0.15) 유지하여 이미지가 사라지지 않도록
- bounce 효과 개선: 이미지 좌우 뒤집힘과 동시에上下 movement 추가

#### **미해결 부분:**
아직 여러 프레임 이미지 미지원 (향후 이미지 생성 시 대응 가능)

---

### Issue #4: 설정 버튼 - Native Language 저장 안됨

**상태:** ✅ Partial Fix (Menu.tsx 다국어화 완료)
**우선순위:** Medium
**발견일:** 2026-06-23
**수정일:** 2026-06-23

#### **수정 내용:**
Menu.tsx에 `getNativeLanguage()` 및 `t()` 적용:
- `{n}개 스테이지` → `{n} {t('stages', nativeLanguage)}`
- `캐릭터 선택` → `t('selectCharacter', nativeLanguage)`
- `최고: {n}점` → `{t('bestScore', nativeLanguage)}: {n} {t('points', nativeLanguage)}`
- `시작 단계 — 바로 플레이할 수 있어요` → `t('startingStageReady', nativeLanguage)`

#### **미해결 부분:**
localStorage 자체의 문제는 없음 (테스트 통과 확인). 다만 localStorage 사용 불가 환경에서는 memory fallback만 사용.

#### **관련 파일:**
- `src/ui/SettingsScreen.tsx` - 설정 화면
- `src/ui/Menu.tsx` - 다국어화 완료
- `src/data/nativeLanguage.ts` - localStorage 영속성 (정상 동작)

---

### Issue #5: 캐릭터 이미지 — 선택화면可见但游戏画面不可见

**상태:** ✅ Fixed (pending GitHub Pages deploy verification)
**우선순위:** Critical
**발견일:** 2026-06-23
**수정일:** 2026-06-23
**커밋:** 7e517ad, d8709cd

#### **증상:**
- 캐릭터 선택화면: 이미지 정상 표시
- 게임 화면(Canvas): 이미지가 안보임
- Console 오류: `GET /lingotype/lingotype/characters/... 404`

#### **근본 원인:**
`ImageLoader.ts` URL construction 중복 prefix 문제:
1. `pathname.startsWith('/lingotype/')` — trailing slash 없을 때 실패
2. `config.src`가 이미 `/lingotype/` prefix 포함 → base 재부여로 이중 prefix

#### **해결책:**
```typescript
// Before: base doubling
const base = pathname.startsWith('/lingotype/') ? '/lingotype/' : '/';
const cleanSrc = config.src.startsWith('/') ? config.src.slice(1) : config.src;
finalUrl = base + cleanSrc;  // → /lingotype/lingotype/...

// After: prevent double prefix
const base = pathname.startsWith('/lingotype') ? '/lingotype/' : '/';
finalUrl = config.src.startsWith(base) ? config.src : base + config.src;
```

#### **관련 파일:**
- `prototype/src/sprites/ImageLoader.ts`

---

## 📊 이슈 통계

**현재 상태 (2026-08-08):**
- 🔴 Critical: 0개
- 🟡 Medium: 1개 (Issue #4 — Settings Native Language persistence, partial fix only)
- ✅ Fixed: 3개 (Issue #1 blank-screen, Issue #3 spin-effect, Issue #5 character-image)
- 🟡 Partial: 1개 (Issue #4 — Menu.tsx i18n done; localStorage fallback only)

**해결률:** 80% (4/5 — 3 fully fixed + 1 partial)

---

## 🎯 진행 중인 작업 (2026-06-26)

### 완료된 작업

1. **한글 입력 모드 선택** — jamo/romanized 토글
   - `koreanInputMode.ts`, `KoreanHandler.ts`, `SettingsScreen.tsx`
   - ADR-0010 업데이트

2. **성취도 시스템 개선 (Option A)**
   - Word mastery: `completeCount/attemptCount` 기반
   - Stars WPM: 언어별 차등 (JP/KR 30/20/10, EN/ES 60/40/20)
   - Menu에 언어별 stats 추가

3. **Daily Lesson 개선**
   - 난이도 표시 (★~★★★★★)
   - 진행도 바 + viewed/total

### 남은 작업

1. **Daily lesson display improvements (Today tab or modal)**
   - Menu에서 일일 학습 접근성 개선 가능

2. **Daily lesson progress persistence**
   - `getLessonProgress`에 total 파라미터 추가됨

3. **KR corpus 로마자 추가**
   - 현재 인사, 숫자, 음식만 로마자 포함
   - 나머지 entries에 로마자 추가 필요

4. **ADR-0010 로마자 매핑 테이블 문서화**
   - `decisions/0010-kr-input.md`에 로마자 매핑 표 추가 필요

---

**마지막 업데이트:** 2026-06-26 → 2026-08-08 (stale-note reconciliation)

---

## 🎯 진행 중인 작업 (2026-08-08)

### 2026-06-26 이후 해결된 항목

- **Issue #5 (EffectsSystem flaky test)** — `spawnFloatingWords` 분포 좌표를 deterministic spread로 수정 (2026-06-25 `fd16268` 커밋 계열). 격리 실행시 통과, 전체 실행에서도 안정화. 1 skip (의도적) 유지. 자세한 내용: `PROJECT_STATUS.md` §8 테스트 커버리지.
- **Corpus citation 1,377 unresolved → 0** (2026-07-30) — 5 surgical fixes (ES animals-vocabulary, KR travel, KR body-vocabulary, ES travel, plus JP/KR `basic-vocabulary.md` aggregator theme-files). 자세한 내용: `log.md` 2026-07-30 carry-over entry + `index.md` §Tools.
- **EN corpus expansion 95 → 1,002** (2026-07-30) — 4 batches, 904 new entries, all cited.
- **Issue #1 blank-screen race condition** — pre-render canvas validation + RAF resilience (2026-06-25 `fd16268`). 자세한 내용: `SESSION_STATUS.md` §4 Known Issues.
- **Build artifact hygiene** — `prototype/dist/index.html` hash drift reverted (2026-08-06).

### 현재 outstanding (2026-08-08)

1. **KR corpus 로마자 추가** — 일부 entry에 romaji 누락 (인사/숫자/음식 외)
2. **ADR-0010 로마자 매핑 테이블 문서화** — `decisions/0010-kr-input.md` 에 매핑 표 추가 필요
3. **Daily lesson display improvements** — Menu → Daily Lesson 접근성 (Today tab/modal)
4. **Daily lesson progress persistence** — `getLessonProgress` total 파라미터 활용
5. **Sound (BGM/SFX)** — optional
6. **Options menu** — key remapping, colorblind mode — optional

### Cross-reference

- Status snapshot: [`PROJECT_STATUS.md`](PROJECT_STATUS.md) §12 알려진 이슈 / 한계
- Session closure: [`SESSION_STATUS.md`](SESSION_STATUS.md) §4 Known Issues (md-doc, 2026-06-25 5-issue table)
- Index of doc changes: [`index.md`](index.md) §도구 (Tools) — corpus citation 2,965/2,965 ✓

---

---

## 🎯 진행 중인 작업 (2026-08-18)

### Badge 시스템 통합 마감 (c742caa → 55d63b8, 2 commits)

- **Badge 시스템 스켈레톤** (2026-08-18 `c742caa`) — `feat(badges): achievement / badge system skeleton with 10 badges + 37 tests`. 10개 배지 (first_run, stage_hunter/master/champion, perfectionist, sharp_eye, streak_3/7/30, polyglot) 추가 + BADGES[]. 37 tests 신규. 단, BadgesScreen.tsx + ResultScreen.tsx 통합이 half-wired 상태로 남음.
- **Badge 시스템 마감** (2026-08-18 `55d63b8` + `0a5a763`) — 2 commit 으로 half-wired 상태 마무리:
  - `feat(badges): wire types` — `PlayerProgress.languagesPlayed: string[]` 필드 추가, `TranslationKey` union에 `back`/`badges`/`badgeProgress` 추가, 3개 PlayerProgress literal (profileManager / gameReducer / ProgressionSystem) + 2 test literal (phase21 / phase28) 업데이트
  - `fix(badges): close runtime + type errors` — BadgesScreen.tsx 의 (a) 잘못된 import (`getDailyStreakState` → `getStreakState`), (b) `useState<Badge[]>([])` + useEffect 패턴을 lazy initializer (`() => getUnlockedBadges()`) 로 변경 (renderToStaticMarkup 환경에서 동기적으로 unlocked state 채움), (c) dead `tick`/`setTick` state 제거. ResultScreen.tsx 의 `BadgeEvalContext.languagesPlayed` 를 배열에서 카운트 (number) 로 정정.
  - side effect: `dailyLessons.json` 의 working-tree modification 을 c742caa HEAD 로 revert (94개 lessons 의 `difficulty`/`source`/`wikiOutput` 필드 제거 회귀였음 — schema 마이그레이션은 out-of-scope).

### 결과

| 지표 | before | after | delta |
|---|---:|---:|---:|
| **테스트** | 1,252 passed / 21 failed | **1,273 passed** / 1 skipped / **0 failed** | +21 tests, −21 failures |
| `tsc --noEmit` | 6 errors (× `PlayerProgress.languagesPlayed`, × TranslationKey union, × `BadgeEvalContext.languagesPlayed` type) | **0 errors** | −6 |
| `eslint src/ tests/` | clean | clean | — |
| `vite build` | n/a (TS error prevented) | **succeeds** (1,266 KB / gzip 356 KB) | build green |

### Cross-reference

- 통합 커밋: `0a5a763 feat(badges): wire types for badge system integration`, `55d63b8 fix(badges): close runtime + type errors in BadgesScreen + ResultScreen`
- C742aaa의 skeleton 은 types.ts / ResultScreen.tsx / 5개 module init / 2개 test file 을 의도적으로 부분 통합 — 본 두 커밋이 마감.
- Issue #5 (`dist/index.html` build artifact hash drift, 2026-08-06) 회귀 발생 — `c742caa` 가 `dist/` 를 commit tracking 하고 있으나 `.gitignore` 에도 등록된 모순 상태. build artifact 는 자동 재생성되므로 영향 없음, 단 추후 `git rm --cached prototype/dist/` 권장.

---

**마지막 업데이트:** 2026-08-18
