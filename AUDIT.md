# LingoType — 프로젝트 점검 리포트

> 작성일: 2026-06-20
> 최종 커밋: `c38baed` (feat: inline hiragana+kanji display for Japanese targets)
> 대상: `Game/lingotype/`

---

## 1. 한 줄 요약

4개국어(EN/JP/ES/KR) 타이핑 학습 게임, GitHub Pages에 배포 중. **313 tests passing / 15,012 LOC / 86 commits** — 모든 핵심 기능(4개 국어, 12 캐릭터, 60 스테이지, 일일 레슨, 일본어 읽기 보조) 작동. **남은 과제: JP/KR 캐릭터 실 이미지, 후리가나 모드 토글, 다중 줄 타깃 인라인 표시**.

---

## 2. 메트릭

| 항목 | 값 |
|---|---|
| 소스 LOC | 15,012 |
| 테스트 LOC | 3,693 |
| 소스 파일 | 61 |
| 테스트 파일 | 14 |
| **테스트 통과** | **313 passed / 1 skipped** (총 314) |
| 빌드 산출물 | 462.52 KB / gzip 137.36 KB |
| 총 커밋 | 86 |
| 배포 URL | https://seoca1.github.io/lingotype/ |
| 최신 배포 | `index-1FGNmL_J.js` (이전 빌드) / 최신 커밋 `c38baed` 배포 진행 중 |
| GitHub Actions | ✅ `Deploy to GitHub Pages` success (2026-06-19T14:18:54Z) |

---

## 3. 아키텍처

### 3.1 디렉토리 (18개 모듈)

```
prototype/src/
├── ai/          Ollama/AI 통합
├── audio/       사운드
├── character/   캐릭터/이미지
├── cli/         CLI 도구
├── combat/      전투 시스템
├── config/      캐릭터 이미지 경로
├── data/        코퍼스 + 스테이지 + 일일 레슨
├── effects/     이펙트 시스템
├── engine/      렌더러, 게임 루프
├── input/       4개국어 인풋 핸들러
├── language/    언어 데이터
├── mission/     미션
├── progression/ 진행/업적
├── sprites/     스프라이트
├── stage/       스테이지 로직
├── state/       상태 관리
├── ui/          14개 컴포넌트
└── utils/       유틸 (로마지→히라가나, 진행도 등)
```

### 3.2 핵심 모듈 (LOC 분포 상위)

| 모듈 | 파일 | 역할 |
|---|---|---|
| `engine/Renderer.ts` | 거대 | 캔버스 렌더링, 이펙트, 인라인 표시 |
| `data/corpus.ts` | 거대 | 4언어 × 단어/문장 코퍼스 |
| `data/stages.ts` | 거대 | 60개 스테이지 정의 |
| `ui/StageScreen.tsx` | 중간 | 게임 화면 (전투 + 타이핑) |
| `ui/ResultScreen.tsx` | 중간 | 결과 + 일일 레슨 카드 |
| `ui/OSKeyboardInput.tsx` | 중간 | OS 키보드 통합 |

### 3.3 데이터 흐름

```
Language/wiki/{lang}/{vocabulary,expressions,culture,sources}/*.md
        ↓ wikilink 인용
Language/raw/{lang}/{travel,romance}/*.md
        ↓ build-daily-lessons.py
dailyLessons.json (149KB, 11 lessons)
        ↓ dailyLessons.ts
ResultScreen DailyLessonCard → DailyLessonModal
        ↑ MarkdownView (XSS-safe)
```

---

## 4. 콘텐츠 인벤토리

### 4.1 코퍼스 (단어 + 문장)

| 언어 | 단어 | 여행 | 로맨스 | 문장 | 합계 |
|---|---:|---:|---:|---:|---:|
| EN | 70 | 42 | 20 | 23 | 155 |
| JP | 51 | 31 | 16 | 19 | 117 |
| ES | 58 | 38 | 20 | 21 | 137 |
| KR | 32 | 33 | 20 | 20 | 105 |
| **합계** | **211** | **144** | **76** | **83** | **514** |

### 4.2 스테이지 (60개)

| 패턴 | 의미 | 수량 |
|---|---|---|
| `{lang}_0..5` | 기본 (레벨 0-5) | ~12/언어 |
| `{lang}_t_1..3` | 여행 (Travel) | 3/언어 |
| `{lang}_d_1..2` | 연애 (Romance/Dating) | 2/언어 |

### 4.3 캐릭터 (12명, 84 슬롯)

| 언어 | 캐릭터 | 실 이미지 |
|---|---|---|
| EN | Emily, Oliver, Sophia | ✅ Sophia 실사 |
| JP | Sakura, Yuki, Kaito | ❌ Sophia placeholder |
| ES | Isabella, Carlos, Luna | ✅ 모두 실사 (JPEG→PNG 변환) |
| KR | Hana, Minho, Jiwoo | ❌ Sophia placeholder |

> **현 상태**: 21+21 = 42장 실 이미지, 42장 placeholder.

### 4.4 일일 레슨 (11개)

- EN 2, JP 2, ES 5, KR 2
- 모든 출처는 LLM Wiki (위키링크 인용)
- `localStorage` 기반 로테이션 (FIFO, 최대 100, FNV-1a 해시)
- 결과 화면에서 read/skip/practice

---

## 5. 기능 인벤토리 (✅ / ⚠️ / ❌)

| 기능 | 상태 | 비고 |
|---|---|---|
| 4언어 타이핑 게임 | ✅ | EN/JP/ES/KR |
| 12 캐릭터 × 7 포즈 | ⚠️ | JP/KR placeholder |
| 60 스테이지 | ✅ | 폴백 체인으로 모두 completable |
| 4가지 테마 (기본/여행/로맨스) | ✅ | |
| OS 키보드 입력 (PC+모바일) | ✅ | 중복 입력 버그 해결 |
| 캔버스 키보드 (마우스 클릭) | ✅ | ES 적응형 레이아웃 |
| ES 액센트 키 | ✅ | á/é/í/ó/ú/ñ |
| KR 복합 모음 (ㅙ,ㅚ 등) | ✅ | 자동 삽입 |
| 크로스 언어 번역 이펙트 | ✅ | 떠다니는 단어 + 문장 미리보기 |
| 일일 레슨 시스템 | ✅ | LLM Wiki → 결과 화면 |
| LLM Wiki 통합 | ✅ | 단일 진실 소스 |
| **일본어 읽기 보조** | ✅ | 인라인 히라가나+한자 |
| **로마지→히라가나 변환** | ✅ | 95+ 패턴 |
| **타이핑 진행도에 따른 한자 디밍** | ✅ | 1.0 → 0.3 |
| 효과 (플로팅 단어) | ✅ | 캔버스 둘레 6슬롯, 20-26px |
| 효과 (문장 미리보기) | ✅ | 좌상단, 입력 버퍼와 겹치지 않음 |
| 2단 대시보드 | ✅ | Hub → Sub-dashboards |
| 오디오 | ❌ | 모듈만 있고 미구현 |
| AI 적 (Ollama) | ❌ | 테스트 UI만 |
| 후리가나 모드 토글 | ❌ | 항상 표시 |

---

## 6. 최근 작업 (최근 25 커밋)

### 6.1 일본어 읽기 보조 (가장 최근, 5 커밋)

```
c38baed  feat: inline hiragana+kanji display for Japanese targets
90a41d6  feat: romajiToHiragana converter for Japanese reading aid
04b0c3b  feat: Japanese reading aid — romaji in parentheses for kanji
cb5f6f9  tweak: larger floating word effects (20-26px, longer life)
51e3212  fix: spread translation effects to canvas perimeter (no text overlap)
```

- **인라인 히라가나+한자**: 타깃이 `きれい綺麗`처럼 한자 포함 시, 좌측에 흐릿한 히라가나 + 12px 간격 + 우측 밝은 한자
- **로마지→히라가나 변환기**: `romajiToHiragana.ts` — 기본음, 탁음, 반탁음, 요음, っ, 장음, ん, 말미 'wa'=は 규칙
- **타이핑 진행도 디밍**: `typingProgress.ts`로 분리, `progress = buffer/totalRomaji`, `kanjiAlpha = max(0.3, 1 - progress*0.7)`
- **이펙트 위치**: 캔버스 둘레 6슬롯 (상단 4 + 중간 2), 텍스트와 겹치지 않음
- **이펙트 크기**: 폰트 20-26px (14-18에서 증가), 수명 1.7-2.1초 (1.3-1.6에서 증가)

### 6.2 캐릭터/배포 (이전, 5 커밋)

```
2b05cdd  fix: make prebuild hook tolerant to missing Python/uv
7075dcf  fix: convert ES character JPEGs to proper PNGs with transparent bg
2010ef2  feat: apply real Spanish character images (Isabella, Carlos, Luna)
f139ae2  feat: daily lesson system — Language wiki → game result screen
928caef  feat: romance/dating theme — wiki pages + corpus + 8 game stages
```

- **ES 캐릭터 PNG 변환**: 흰색 배경을 투명으로 (`scripts/convert_to_png.py`, 임계값 240)
- **prebuild 호환성**: GitHub Actions에 `uv`/`python3` 없음 → bash `command -v` 가드, `dailyLessons.json` 폴백
- **연애 테마**: 8 스테이지 (2/언어), PG-13 범위
- **일일 레슨**: `build-daily-lessons.py` + `validate-daily-lessons.py` + `dailyLessons.json`

### 6.3 입력 시스템 (더 이전, 8 커밋)

```
2b40630  feat: wider spread for cross-language floating words
fe8f83c  fix: stage corpus fallback chain — every stage now completable
9c8e6e2  fix: refocus hidden input after canvas keyboard click
928bf44  feat: mouse-clickable canvas keyboard + adaptive Spanish layout
6c4ab4a  fix: remove window keydown listener (was duplicate of OSKeyboardInput path)
1e162da  fix: eliminate duplicate key input (single input path)
2fd9a9a  feat: use OS keyboard for all platforms (PC + mobile)
07c6929  fix: KoreanHandler multi-syllable trail handling + smart compound vowel insertion
086d464  feat: cross-language translation effects (floating words + sentence preview)
```

- **단일 입력 경로**: 중복 키 입력 제거 (한 번에 두 글자 입력되는 버그)
- **OS 키보드 통합**: PC(실제 키보드) + 모바일(IME) 모두 지원
- **ES 적응형 레이아웃**: 1024px 이하에서 키보드 자동 재배치
- **KR 복합 모음**: ㄱ+ㅗ+ㅏ → ㅙ 등 자동
- **스테이지 폴백 체인**: `category → relaxed-level → no-category → full corpus`

---

## 7. 테스트 커버리지 (313 passed / 1 skipped)

| 카테고리 | 파일 | 테스트 수 |
|---|---|---:|
| utils/romajiToHiragana | 1 | 55 |
| utils/japaneseReading | 1 | 10 |
| utils/typingProgress | 1 | 16 |
| ui/MarkdownView | 1 | 20 (7 XSS) |
| data/dailyLessons | 1 | 21 |
| data/corpus | 1 | ~10 |
| data/stages | 1 | ~10 |
| effects/EffectsSystem | 1 | 10 |
| input/*Handler | 4 | ~80 |
| engine | 1 | ~30 |
| 기타 | 2 | ~50 |

- **XSS 안전성**: 7개 XSS 테스트 (`<script>`, `<img onerror>`, `<svg onload>`, `<iframe>`, `<div onclick>`, `javascript:`, `data:`)
- **로마지→히라가나**: 55개 (기본음, 탁음, 반탁음, 요음, っ, 장음, ん, 실 코퍼스)
- **테스트 환경**: jsdom (localStorage, DOM)
- **실행 시간**: ~900ms 전체

---

## 8. 빌드 & 배포 파이프라인

```
[local dev]  npm run dev          → vite dev server
[prebuild]   prebuild:lessons     → bash guard, python3/uv 있으면 재생성
[build]      vite build           → dist/ (462KB)
[deploy]     git push             → GitHub Actions
             ↓
             actions: checkout → setup-node → install → prebuild → build → upload-pages
             ↓
             GitHub Pages 자동 배포 (~2-3분)
```

- **워크플로우**: `.github/workflows/deploy.yml`
- **prebuild 안전성**: `uv`/`python3` 부재 시 committed `dailyLessons.json` 사용
- **번들 캐싱**: vite 기본 (`index-{hash}.js`)

---

## 9. 알려진 이슈 & 미완료

### 9.1 즉시 해결 가능 (소요 시간 추정)

| 항목 | 우선순위 | 추정 시간 | 비고 |
|---|---|---|---|
| JP 캐릭터 실 이미지 (Sakura/Yuki/Kaito) | P1 | 사용자 입력 대기 | JPEG → PNG 자동 변환 |
| KR 캐릭터 실 이미지 (Hana/Minho/Jiwoo) | P1 | 사용자 입력 대기 | 동일 |
| 후리가나 모드 토글 (항상 ON/항상 OFF) | P2 | 2-3h | 사용자 설정 저장 |
| 히라가나 색상 설정 (현재 `#b4d2fa`) | P3 | 30분 | UI만 |
| 다중 줄 타깃 인라인 표시 | P2 | 1-2h | 줄바꿈 시 위치 계산 |
| KR 폰트 (현재 Noto Sans KR) | P3 | 30분 | 이슈 없으면 생략 |

### 9.2 차후 (저우선)

| 항목 | 우선순위 | 비고 |
|---|---|---|
| 일일 레슨 캐릭터 일러스트 | P3 | 텍스트만 |
| 오디오 (BGM/효과음) | P3 | 모듈만 존재 |
| AI 적 (Ollama) | P4 | 테스트 UI만 |
| 더 많은 일일 레슨 (현재 11) | P2 | JP/KR 위키 소스 추가 시 |
| 모바일 성능 최적화 | P3 | 60fps 유지 확인 |
| 일일 레슨 푸시 알림 | P4 | PWA 필요 |

### 9.3 잠재 위험

1. **prebuild 가드**: 로컬에 `uv` 없으면 `dailyLessons.json` 직접 편집 필요 → 문서화 부족
2. **캐릭터 placeholder 일관성**: JP/KR이 Sophia PNG 사용 중 (의도적)
3. **GitHub Pages 캐시**: 사용자가 하드 리프레시 필요할 수 있음
4. **로마지→히라가나 정확도**: 95+ 패턴이지만 예외 케이스 가능 (방언, 외래어)

---

## 10. 다음 단계 추천

### 우선순위 1: 캐릭터 이미지 완성

```bash
# 1. JP/KR JPEG를 prototype/public/characters/{lang}/{name}/ 에 저장
# 2. 변환 스크립트 실행
python3 scripts/convert_to_png.py --lang jp
python3 scripts/convert_to_png.py --lang kr
# 3. characterImages.ts 경로 업데이트
# 4. 빌드 + 배포
```

### 우선순위 2: 후리가나 토글

```typescript
// 사용자 프로필에 readingAidMode: 'always' | 'never' | 'auto'
// Renderer에 분기 추가
const showFurigana = profile.readingAidMode === 'always' || (
  profile.readingAidMode === 'auto' && state.tier >= 3
);
```

### 우선순위 3: 다중 줄 타깃

```typescript
// 긴 문장/대화의 경우 줄별 인라인 표시
// 줄바꿈 감지 → 각 줄에 별도 히라가나+한자 페어
```

---

## 11. 요약 (강점 & 약점)

### 강점
- ✅ 4개국어, 514개 어휘/문장, 60 스테이지, 12 캐릭터 — 콘텐츠 풍부
- ✅ LLM Wiki 기반 단일 진실 소스 — 콘텐츠 일관성
- ✅ 313 테스트 (XSS, 로마지, 폴백 체인 등) — 안정성
- ✅ OS 키보드 + 캔버스 키보드 + 적응형 레이아웃 — 멀티 플랫폼
- ✅ 일일 레슨 + 일본어 읽기 보조 — 학습 효과
- ✅ GitHub Actions 자동 배포 — 개발 흐름 매끄러움

### 약점
- ⚠️ JP/KR 캐릭터가 placeholder (Sophia PNG) — 시각적 일관성 깨짐
- ⚠️ 일일 레슨 11개 — 일주일이면 다 봄
- ⚠️ 후리가나 항상 표시 — 고급 학습자에겐 방해
- ⚠️ 다중 줄 타깃 미지원 — 긴 문장 입력 어려움
- ⚠️ 오디오/AI 미구현 — 정적 게임 경험

### 종합

**상태: 베타 가능 / 정식 배포 직전**
- 핵심 기능 100% 작동
- 콘텐츠 풍부 (514 어휘, 60 스테이지)
- 다중 플랫폼 (PC + 모바일)
- 단, 시각 자산(JP/KR 캐릭터) 부족
- 학습 기능은 우수 (일일 레슨, 읽기 보조, 4언어)
