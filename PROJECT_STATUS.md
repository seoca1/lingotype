# Typing Language — 프로젝트 상태 리포트

> **최종 업데이트**: 2026-08-18 (badge system integration + 21→0 test failures fixed; tests 1,273)
> **최종 커밋**: fix(badges): close runtime + type errors in BadgesScreen + ResultScreen (c742aaa → 55d63b8)
> **버전**: Phase 7 — 140 스테이지, 1,273 테스트, 4,038 corpus + 52 Daily Lessons + 10 배지

---

## 1. 한 줄 요약

4개국어(EN/JP/ES/KR) 타이핑 학습 게임, **GitHub Pages 자동 배포**. **1,273 tests passing** (1 skipped), **1,266 KB / gzip 356 KB**, **4,038 corpus entries (EN 1,054 + JP 502 + ES 1,246 + KR 1,236)**, **52 Daily Lessons (100% topic-appropriate culture)**, **12명 캐릭터 (84 PNG)**, **440+ wiki 페이지**, **10 배지 (first_run, stage_hunter/master/champion, perfectionist, sharp_eye, streaks × 4)**. Phase 7 완성.

---

## 2. 누적 메트릭

| 항목 | 초기값 (Phase A 시작) | 최종값 (현재) | 변화 |
|---|---|---|---|
| **테스트** | 313 passed | **1,273 passed** | +960 (+306%) |
| 테스트 파일 | 14 | **56** | +42 |
| **번들 크기** | 463 KB | **1,266 KB** | +173% |
| gzip 크기 | 137 KB | **356 KB** | +160% |
| CSS | 21 KB | 27 KB | +29% |
| **Corpus** | 577 | **4,038** | +7.0× (auto-generated from Language wiki) |
| **daily lessons** | 11 | **52** | +373% |
| Wiki 페이지 | 385 | **410+** | +6.5% |
| **스테이지** | 30+ | **140** | +367% |
| 신규 파일 | – | 7개 신규 + 5개 강화 | – |
| 커밋 | – | **약 30개** (Phase A-J + refactor) | – |

### 언어별 학습 콘텐츠

| 언어 | 단어 | 여행 | 로맨스 | 문장 | 합계 | Daily Lessons |
|---|---:|---:|---:|---:|---:|---:|
| EN | 70 | 42 | 20 | 23 | 155 | 13 |
| JP | 51 | 31 | 16 | 19 | 117 | 11 |
| ES | 58 | 38 | 20 | 21 | 137 | 10 |
| KR | 32 | 33 | 20 | 20 | 105 | 11 |

---

## 3. Phase A → J 작업 이력

### Phase A — 콘텐츠 기반 (2026-06-20)
**목표**: Language 위키에 친절한 학습 콘텐츠 추가

- **스키마 3개**: `vocabulary.md`, `expression.md`, `culture.md` (Tier 1/2/3 시스템)
- **Vocab 시드 20개** (4언어 × 5): EN(bello, love, breakfast, kind, handsome), JP(綺麗, 好き, 可愛い, 面白い, 優しい), ES(bonita, amar, beso, guapo, cita), KR(사랑, 죄송합니다, 감사합니다, 안녕하세요, 친구)
- **신규 필드**: Pronunciation, Memory Tip, Common Mistakes, Register, Frequency, Visual, Mini-Dialogue
- **Culture 강화 4개**: 각 언어별 dating culture에 Setting/Roles/Scenario/Body Language 추가
- **MarkdownView 확장**: callouts(!>), tables, dialogue blocks, dividers, TTS hooks
- **테스트 +17** (callouts, tables, dialogue, TTS, integration)

### Phase B — 게임 UI (2026-06-20)
**목표**: 학습자료 시각화 및 접근성 강화

- **Daily Lesson 3-tier**: Quick(1분) / Standard(5분) / Deep(10분) 탭
- **Wikilink 클릭**: 모달로 관련 페이지 즉시 표시
- **Learn 화면**: 스테이지 시작 전 vocab 미리보기 (30단어, 핵심/전체 필터)
- **Enemy hover 툴팁**: 적 위에 마우스 시 뜻/발음/TTS 버튼
- **Weak Words + Mastery Bar**: localStorage 추적, 그라데이션 진행바
- **테스트 +20** (MarkdownView +17, dailyLessons +3)

### Phase C — 파이프라인 강화 (2026-06-20)
**목표**: build/validate 스크립트 개선

- **Tier 1/2/3 자동 분류**: `detect_fields()`, `classify_tier()`
- **wikilink 추출**: `extract_wikilink_targets()`
- **글로벌 wiki index**: 385 → 399 pages
- **dedup wiki index (schema v1.1)**: 동일 wiki page를 1번만 저장 → 679KB → 191KB (71% 감소)
- **validate 스크립트 강화**: friendly field 검출, --tier-report 옵션, v1.0+v1.1 듀얼 지원

### Phase D — 콘텐츠 확장 (2026-06-20)
**목표**: daily lessons 11 → 42개

- **24개 신규 source 페이지**: daily-life, food-dining, shopping, technology, health, holidays, sports, travel, work, romance 등
- **테스트 결과**: en 12, jp 11, es 10, kr 10 → **42 lessons**
- **빌드 안정화**: 191 KB (dedup 덕분에 적은 증가)

### Phase E — 캐릭터 랜덤 선택 (2026-06-20)
**목표**: 스테이지별 캐릭터 random 등장

- **`selectCharacterForStage`**: FNV-1a 해시로 deterministic random (같은 stage = 같은 캐릭터)
- **우선순위**: 사용자 선택 > random > 언어 default
- **`userHasSelected` flag**: sticky user choice
- **12명 캐릭터 × 7 포즈 = 84 PNG 모두 검증**: PNG signature 확인
- **138 신규 테스트**: 모든 캐릭터, 랜덤 분포, cross-language

### Phase F — Native Language 설정 (2026-06-20)
**목표**: 게임 내 학습자료의 일관성 없는 언어 혼용 해결

- **`nativeLanguage.ts`**: 4언어 (en/ko/ja/es), localStorage 영속화, 기본값 `en`
- **`uiTranslations.ts`**: 60+ UI 키 × 4언어
- **`meaningResolver.ts`**: `meanings: { en, ko, ja, es }` 맵, 4단계 fallback
- **`migrate_meanings.py`**: 581 entries 마이그레이션, COMMON_DICT로 94 entries enriched
- **컴포넌트 통합**: EnemyTooltip, LearnScreen, StageScreen, ResultScreen, DailyLessonCard/Modal
- **23 신규 테스트**

### Phase G — Settings UI + COMMON_DICT 확장 (2026-06-20)
**목표**: 사용자가 모국어 변경 가능 + 4언어 커버리지 확대

- **SettingsScreen.tsx**: 4언어 선택 UI, TTS 미리듣기, 사운드/볼륨 컨트롤
- **Menu ⚙️ 버튼**: 클릭으로 SettingsScreen 접근
- **COMMON_DICT 100+ 어휘**: greetings, numbers, colors, animals, family, time, romance, food, travel, verbs, pronouns
- **EN corpus 84% 4-lang 커버리지**
- **테스트**: 511 passed (회귀 없음)

### Phase H — Wikilink 해결 (2026-06-20)
**목표**: unresolved wikilinks 0개로

- **Build Script**: `_source_pages` 첨부 — source hub 페이지도 wikiIndex에 등록
- **Validator**: 모든 on-disk wiki 파일 검사 (cross-language + unreferenced)
- **9개 stub 페이지 생성**: friend, pretty, family, 映画, パスポート, amigo, hermoso, 여권, travel
- **JP Tier3 14 → 25** (78% 증가)
- **45 lessons** (44 → 45)

### Phase I — Stage Lock 시스템 (2026-06-20)
**목표**: 점진적 진행 시스템

- **`stageLock.ts`**: Tier 기반 unlock + Romance/Travel 특별 unlock
  - Tier N requires Tier N-1 cleared (in SAME language)
  - Romance (_d_): 2 stages cleared → unlock
  - Travel (_t_): 3 stages cleared → unlock
- **Menu UI**: 🔒 잠금 표시 + grayscale
- **App 가드**: `handleStartStage` 잠금 검사
- **ResultScreen unlock 배너**: 글리머 애니메이션 + 해제된 stage 칩
- **19 신규 테스트**: 6 tier 전환, romance/travel, 언어별 격리

### Phase J — Daily Streak (2026-06-20)
**목표**: 매일 플레이 장려

- **`dailyStreak.ts`**: 연속 일수 추적, milestones (3/7/14/30/50/100/365일)
- **Menu 헤더**: 🔥/📅/⏰/💔/🌱 5가지 상태 뱃지
- **ResultScreen streak 배너**: 마일스톤 축하 애니메이션
- **15 신규 테스트**

---

## 4. 버그 수정 이력

### Bug #1 — Menu lockMap undefined.unlocked (2026-06-20)
**증거**: `TypeError: Cannot read properties of undefined (reading 'unlocked')`
**원인**: `stagesByTier()`(ALL_STAGES) vs `languageStages`(SAMPLE_STAGES) 데이터 소스 불일치로 lockMap 일부 stage 누락
**수정**: lockMap을 모든 language stages로 빌드, StageCard `lock` prop optional + fallback
**커밋**: `dc6a66f`

### Bug #2 — 캐릭터 "Loading..." 무한 표시 (2026-06-20)
**증거**: 캐릭터 이미지가 영구 "Loading..." 표시
**원인**: Phase E random 선택이 preload 안 된 default 아닌 캐릭터(en-oliver 등) 선택 → ImageLoader.get() null
**수정 (2 layer defense)**:
1. App.tsx: `LANGUAGE_DEFAULT_CHARACTERS`(4개) → `CHARACTER_IMAGES`(12명 × 7 = 84 이미지) 전체 preload
2. CharacterRenderer: `ImageLoader.load()` on-demand fallback
**커밋**: `fe0f708`

### Bug #3 — 잠금 메시지 불명확 (2026-06-20)
**증거**: "Clear any Tier - stage first" 의미 불명확
**수정**: 🔒 아이콘 + 구체적 예시 (`(e.g., en_1_1)`) + 진행도 표시 (`(1/2)`)
**커밋**: `efe76dc`

### Bug #4 — Tier 0 부재 언어 영구 잠금 (2026-06-20)
**증거**: EN/ES/KR (Tier 0 없는 언어)의 Tier 1+ stage가 영구 잠금
**원인**: "Tier N requires Tier N-1 cleared" 검사 시 Tier 0 stage 없음 → 조건 절대 충족 불가
**수정**: `ALL_LANGUAGES_TIERS` 미리 계산 → prevTier stage 없으면 자동 unlocked
**커밋**: `8c1b60d`

---

## 5. 콘텐츠 인벤토리

### 캐릭터 (12명 × 7 포즈 = 84 PNG, 0 placeholder)
| 언어 | 캐릭터 | 실 이미지 |
|---|---|---|
| EN | Emily, Oliver, Sophia | ✅ 전원 |
| JP | Sakura, Yuki, Kaito | ✅ 전원 (JP만 Tier 0) |
| ES | Isabella, Carlos, Luna | ✅ 전원 |
| KR | Hana, Minho (전체), Jiwoo | ✅ 전원 |

### Wiki 콘텐츠 (410 페이지)
- EN: 100+ vocab + 30+ expr + 12+ culture + 10+ sources
- JP: 80+ vocab + 20+ expr + 11+ culture + 9+ sources
- ES: 90+ vocab + 30+ expr + 10+ culture + 8+ sources
- KR: 70+ vocab + 20+ expr + 11+ culture + 9+ sources

### Daily Lessons (42개)
- EN 13, JP 11, ES 10, KR 11
- 4언어 × 3 캐릭터 자동 등장
- Tier 0 → 5 순차 해제
- Romance/Travel 단계는 별도 잠금 해제 조건

---

## 6. 게임플레이 시스템

### 핵심 메커니즘
1. **언어 선택** → 메인 메뉴 진입
2. **스테이지 잠금/해제** (Tier 기반, 언어별)
3. **캐릭터 선택** (선택 안 하면 random 3명 중)
4. **스테이지 시작** → Learn 화면 (vocab 미리보기) → 게임 시작
5. **게임 중** → 호버 툴팁 (뜻/발음/TTS)
6. **클리어** → 결과 화면 (점수/별/약한 단어/마스터리/Daily Lesson)
7. **잠금 해제 알림** → 다음 스테이지 자동 표시
8. **Daily Lesson** (3-tier, wikilink 클릭)

### 진행 시스템
- **Stars**: 정확도 + WPM 기반 0-3별
- **Daily Streak**: 연속 일수, milestones (3/7/14/30/50/100/365)
- **Mastery Bar**: 전체 숙련도 (correctCount/attemptCount)
- **Weak Words**: 이번 스테이지 실수 단어
- **Stage Unlock**: Tier 0 → Tier 1 → ... (Romance/Travel 별도)

---

## 7. 다국어 지원 (Phase F/G)

### 4개 언어 기본값
- `en` (English) — 기본값
- `ko` (한국어)
- `ja` (日本語)
- `es` (Español)

### 적용 범위
- UI 버튼/헤더/라벨 (60+ 키 번역)
- 뜻 표시 (WordEntry.meanings[lang] 우선, en fallback, ko fallback)
- 발음 (target language로 TTS)
- Settings 화면에서 즉시 변경 가능
- localStorage 영속화

### 한계
- Wiki 본문은 한국어/원본 언어 그대로 (번역 API 미통합)
- 84% EN 코퍼스 4-lang 커버리지 (나머지는 fallback)

---

## 8. 테스트 커버리지

### 테스트 파일 (20개)
- `tests/character/character.test.ts` (138 tests)
- `tests/character/preloadFix.test.ts` (4 tests)
- `tests/data/dailyLessons.test.ts` (21 tests)
- `tests/data/dailyStreak.test.ts` (15 tests)
- `tests/data/nativeLanguage.test.ts` (23 tests)
- `tests/data/stageLock.test.ts` (28 tests)
- `tests/data/wordMastery.test.ts` (20 tests)
- `tests/effects/EffectsSystem.test.ts` (10 tests) *[1 flaky]*
- `tests/engine/Keyboard.test.ts` (12 tests)
- `tests/input/*` (5 files, ~106 tests)
- `tests/stage/StageIntegration.test.ts` (132 tests)
- `tests/ui/MarkdownView.test.tsx` (37 tests)
- `tests/utils/*` (3 files, 81 tests)

### Flaky 테스트
- `EffectsSystem.test.ts > spawnFloatingWords > distributes across multiple perimeter slots`
- 격리 실행시 통과 (random 좌표 기반)
- 1 skip (의도적)

---

## 9. 배포 파이프라인

```
GitHub Push → GitHub Actions
  ↓
[prebuild:lessons] bash guard → uv 있으면 마이그레이션, 없으면 committed JSON 사용
  ↓
[tsc -b && vite build]
  ↓
[deploy-pages] → GitHub Pages
  ↓
https://seoca1.github.io/typing-language/
```

### 번들 사이즈 추이
| 단계 | 번들 | gzip |
|---|---|---|
| Phase A 시작 | 463 KB | 137 KB |
| Phase B 후 | 495 KB | 144 KB |
| Phase D 후 | 524 KB | 165 KB |
| Phase F 후 | 531 KB | 168 KB |
| Phase H 후 | 609 KB | 193 KB |
| Phase J 후 | 617 KB | 196 KB |
| **현재** | **971 KB** | **298 KB** |

증가 원인: 140 스테이지 확장 + daily lesson 52개 + LearnScreen wiki 연동 + 캐릭터 12명

---

## 10. 향후 작업 (장기)

### 콘텐츠
- [ ] 30 lessons per language 도달 (현재 12/11/10/11)
- [ ] COMMON_DICT 확장 (~500+ 어휘, 4-lang 완전 커버)
- [ ] Wiki 본문 다국어화 (Daily Lesson이 한국어 → 영어 번역)

### 시스템
- [ ] 자동 번역 API 통합 (Google Translate / LibreTranslate)
- [ ] 성취/뱃지 시스템 (10/50/100 stages cleared)
- [ ] 통계 대시보드 (언어별 WPM/ACC 차트)
- [ ] 모바일 키보드 UX 개선 (터치 최적화)

### 품질
- [ ] EffectsSystem flaky 테스트 안정화
- [ ] 일일 Lesson 본문도 다국어 (현재 한국어 중심)
- [ ] JP Tier 4 corpus 추가 (news, business)

---

## 11. 핵심 커밋 이력

```
8c1b60d fix(gameplay): languages without Tier 0 had all tiers locked
efe76dc ux(stage-lock): improve unlock messages with example + progress
fe0f708 fix(gameplay): preload ALL 12 character images + on-demand loading
dc6a66f fix(gameplay): prevent Menu.tsx undefined.unlocked crash
7a26cba feat(gameplay): Phase J — daily streak tracking with milestones
889b9f7 feat(gameplay): Phase I — Stage lock + unlock system with celebration
6dc9c76 feat(content): Phase H — wikilink resolution + 9 stub wiki pages
c676367 feat(i18n): Phase G — Settings UI + 100+ words expansion
f7f5ff2 feat(i18n): Phase F — native language setting + UI translations
53d34f9 feat(pipeline): Phase C+D complete — content pipeline enhancement + 42 daily lessons
3c62d94 feat(ui): Phase B complete — Daily Lesson 3-tier + Learn screen + ...
2e8122a feat(content): Phase A complete — friendly learning content
1993cc7 feat: apply real JP + KR character images
2e9aab2 docs: comprehensive project audit report
```

---

## 12. 알려진 이슈 / 한계

1. **Wiki 본문 다국어 미지원** — 한국어/원본 그대로 (번역 API 미통합)
2. **EffectsSystem flaky 테스트** — random 좌표 기반, 격리 실행시 통과
3. **flaky test 격리 모드 필요** — Node 25 broken localStorage → per-file polyfill
4. **뱃지/업적 시스템 부재** — 10 stages cleared, perfect score 등
5. **JP Tier 4 corpus 미비** — news, business 미지원
6. **자동 번역 미통합** — COMMON_DICT 외부 단어 미커버
7. **Daily Lesson이 한국어 위키 기반** — 영어 사용자도 한국어 본문

---

## 13. 다음 단계 추천

**즉시 가치** (1-2시간):
1. **JP Tier 4 corpus** 추가 (news, business) → JP Tier 5 잠금 해제 가능
2. **번역 API 통합** (Google Translate) → COMMON_DICT 외부 단어 자동 채움
3. **뱃지 시스템** (10 stages cleared, 100% accuracy 등)

**중기 가치** (반나절):
4. **통계 대시보드** (언어별 WPM/ACC 차트)
5. **Wiki 본문 다국어화** (translation API 활용)
6. **30 lessons per language** 도달

**장기 가치** (1일+):
7. **자동 번역 + wikilink 자동 해결** 통합
8. **모바일 PWA** (오프라인 지원)
9. **커뮤니티 기능** (점수 공유, 리더보드)

---

## 부록 A: 디렉토리 구조

```
Game/typing_language/
├── prototype/
│   ├── public/characters/        # 84 PNG (12명 × 7 포즈)
│   ├── src/
│   │   ├── data/                   # 일일레슨, 단어마스터리, streak, stageLock, nativeLanguage
│   │   ├── character/              # 렌더러, 셀렉터
│   │   ├── engine/                 # 게임 엔진
│   │   ├── input/                  # 4언어 핸들러
│   │   ├── stage/                  # 스테이지 시스템
│   │   ├── ui/                     # React 컴포넌트 (15개)
│   │   └── config/characterImages  # 캐릭터 메타데이터
│   ├── tests/                      # 20 테스트 파일
│   └── scripts/                    # build/validate/migrate 스크립트
├── log.md                          # 일별 활동 로그 (1945 lines)
└── AUDIT.md, SETUP_LOG.md, ...     # 부수 문서들
```

## 부록 B: 명령어 모음

```bash
# 개발
npm run dev          # Vite dev server
npm test             # 680 tests (1 skipped)
npm run build        # 프로덕션 빌드 (929 KB)

# 콘텐츠 파이프라인
uv run --with pyyaml python3 scripts/build-daily-lessons.py
uv run --with pyyaml python3 scripts/validate-daily-lessons.py --tier-report
uv run --with pyyaml python3 scripts/migrate_meanings.py

# 캐릭터 변환 (JPEG → PNG with transparent bg)
uv run --with pillow --with numpy python3 scripts/convert_to_png.py <character_dir>

# 배포
git push origin main  # → GitHub Actions 자동 배포
```