# Language Content Documentation

게임에서 사용되는 언어 콘텐츠와 학습 자료를 정리한 문서입니다.
대시보드에서 시각적으로 확인 가능합니다: `dashboard/index.html`

---

## 📋 목차

- [전체 개요](#-전체-개요)
- [언어별 현황](#-언어별-현황)
  - [🇺🇸 English (EN)](#-english-en)
  - [🇯🇵 日本語 (JP)](#-日本語-jp)
  - [🇪🇸 Español (ES)](#-español-es)
  - [🇰🇷 한국어 (KR)](#-한국어-kr)
- [스테이지 설계](#-스테이지-설계)
- [데이터 파이프라인](#-데이터-파이프라인)
- [확장 가이드](#-확장-가이드)
- [대시보드 사용법](#-대시보드-사용법)

---

## 🌍 전체 개요

### 지원 언어 (4개)

| 언어 | 코드 | 국기 | 게임 가능 | 학습 자료 | 원본 소스 |
|------|------|------|----------|----------|----------|
| English | en | 🇺🇸 | ✅ | ⏳ | ⏳ |
| 日本語 | jp | 🇯🇵 | ✅ | ⏳ | ⏳ |
| Español | es | 🇪🇸 | ✅ | ✅ 풍부 | ✅ |
| 한국어 | kr | 🇰🇷 | ✅ | ⏳ | ✅ |

### 콘텐츠 규모

```
총 스테이지:       40개 (6 티어 × 4 언어 + 변형)
게임 코퍼스:      279개 항목
위키 학습자료:     96개 페이지
원본 소스:         5개 파일
```

---

## 🇺🇸 English (EN)

### 게임 현황

**스테이지 (10개):**

| ID | Tier | 이름 | 단어수 | 코퍼스 |
|----|------|------|--------|--------|
| en_1_1 | 1 | Greetings & Basics | 8 | words |
| en_1_2 | 1 | Numbers & Colors | 12 | words |
| en_1_3 | 1 | Everyday Objects | 10 | words |
| en_2_1 | 2 | Phrases & Verbs | 12 | words |
| en_2_2 | 2 | Daily Life | 15 | words |
| en_3_1 | 3 | Short Sentences | 10 | sentences |
| en_3_2 | 3 | Travel Phrases | 8 | sentences |
| en_4_1 | 4 | News Headlines | 8 | news |
| en_4_2 | 4 | Movie Quotes | 6 | quotes |
| en_5_1 | 5 | Literature Excerpts | 5 | passages |

**코퍼스 분포:**
- 총: 69개 항목
- 레벨 1 (A1, 기초): 다수
- 레벨 2-3 (A2-B1): 중간
- 레벨 4-5 (B2-C1): 문장

**카테고리:**
- greeting, basic, number, color
- animal, object, food, time
- family, person, place
- question, restaurant
- news, quote

### 학습 자료 (Language/wiki/)

**현재 상태:**
- 📄 sources/ : 0 파일 (원본 자료 미정리)
- 📖 vocabulary/ : 0 파일
- 💬 expressions/ : 0 파일
- 🌏 culture/ : 0 파일

**확장 필요:**
- 일반 단어 빈도 목록 (OEC, SUBTLEX)
- CEFR 어휘 (Oxford 3000)
- BBC Learning English 문장
- 위키피디아 발췌

### 게임 콘텐츠 출처

- 일반 단어: Oxford English Corpus 빈도순
- CEFR 어휘: Oxford 3000, English Profile
- 문장: 위키피디아 (CC-BY-SA), BBC Learning English
- 빈도: SUBTLEX-US, COCA

---

## 🇯🇵 日本語 (JP)

### 게임 현황

**스테이지 (10개):**

| ID | Tier | 이름 | 코퍼스 |
|----|------|------|--------|
| jp_0_1 | 0 | あいうえお (히라가나) | chars |
| jp_0_2 | 0 | カタカナ | chars |
| jp_0_3 | 0 | 漢字 기초 | chars |
| jp_1_1 | 1 | 명사 · 일상어 | words |
| jp_2_1 | 2 | 동사 · 형용사 | words |
| jp_2_2 | 2 | 카운터 · 시간 | words |
| jp_3_1 | 3 | 짧은 문장 | sentences |
| jp_3_2 | 3 | 인사 · 자기소개 | sentences |
| jp_4_1 | 4 | 뉴스 헤드라인 | news |
| jp_4_2 | 4 | 라이센스 표현 | quotes |

**입력 방식 (ADR-0002):**
- **로마자 → 한자/히라가나 직접 타이핑**
- 표시: こんにちは (한자/히라가나)
- 입력: konnichiwa
- 매핑 테이블이 코퍼스와 함께 제공됨

**코퍼스 분포:**
- 총: 84개 항목 (가장 풍부!)
- 문자 (히라가나/가타카나/한자) 다수
- JLPT 빈도순 단어

### 학습 자료 (Language/wiki/)

**현재 상태:**
- 📄 sources/ : 0 파일
- 📖 vocabulary/ : 0 파일
- 💬 expressions/ : 0 파일
- 🌏 culture/ : 0 파일

**확장 필요:**
- JLPT 단어 목록 (N5-N1)
- 빈도순 어휘
- 한자 히라가나 표기 병기
- 문화 노트 (존댓말, 의식)

---

## 🇪🇸 Español (ES)

### 게임 현황

**스테이지 (10개):**

| ID | Tier | 이름 | 코퍼스 |
|----|------|------|--------|
| es_1_1 | 1 | Saludos · Básico | words |
| es_1_2 | 1 | Números · Colores | words |
| es_1_3 | 1 | Objetos Cotidianos | words |
| es_2_1 | 2 | Verbos Comunes | words |
| es_2_2 | 2 | Vida Diaria | words |
| es_3_1 | 3 | Frases Cortas | sentences |
| es_3_2 | 3 | Restaurante · Viaje | sentences |
| es_4_1 | 4 | Titulares · Cultura | news |
| es_4_2 | 4 | Citas de Cine | quotes |
| es_5_1 | 5 | Extractos Literarios | passages |

**입력 방식 (ADR-0003):**
- 액센트 문자 직접 입력 + ASCII 폴백
- á é í ó ú ñ ¿ ¡ 정확히 입력
- 또는 a → á, n → ñ 폴백

**코퍼스 분포:**
- 총: 69개 항목
- 액센트 문자 포함
- DLE (Diccionario de la lengua española) 참조

### 학습 자료 (Language/wiki/) ⭐ 가장 풍부!

**현재 상태:**

```
📄 sources/        : 4 파일 ✅
   ├── como-agua-para-chocolate-cap1.md (Esquivel 원작 발췌)
   ├── el-ahgado-mas-hermoso-del-mundo.md
   ├── notes-in-spanish-listening-log.md
   └── notes-in-spanish-planes-de-verano.md

📖 vocabulary/     : 36 파일 ✅ 풍부!
   acantilado, altivez, angarillas, anhelar, animarse...
   bochorno, botellon, cebolla, chapparon, currar...
   masa, matriarca, molcajete, ponerse-morado...
   siesta, solanera, sargazo, tapas, veranear...

💬 expressions/    : 22 파일 ✅ 풍부!
   a-fuego-lento, a-ver-si, ojala, que-fuerte...
   llorar-como-una-magdalena, pedir-la-mano...
   subjuntivo 관련 (cuando, antes-de-que, para-que)...

🌏 culture/        : 10 파일 ✅
   cocina-espacio-femenino, espana-vs-latinoamerica-registro
   mexico-patriarcado-tradicion, realismo-magico...
   siesta-tradicion-verano, subjuntivo-conversacional...

📅 study-plan/     : 2 파일 ✅
   weekly-plan.md
   blog-output.md
```

**총: 74개의 위키 페이지!** (가장 풍부한 자료)

---

## 🇰🇷 한국어 (KR)

### 게임 현황

**스테이지 (10개):**

| ID | Tier | 이름 | 코퍼스 |
|----|------|------|--------|
| kr_1_1 | 1 | 인사 · 기본 | words |
| kr_1_2 | 1 | 숫자 · 색상 | words |
| kr_1_3 | 1 | 일상 사물 | words |
| kr_2_1 | 2 | 어휘 확장 | words |
| kr_2_2 | 2 | 가족 · 장소 | words |
| kr_3_1 | 3 | 짧은 문장 | sentences |
| kr_3_2 | 3 | 일상 표현 | sentences |
| kr_4_1 | 4 | 뉴스 헤드라인 | news |
| kr_4_2 | 4 | 인용구 | quotes |
| kr_5_1 | 5 | 단락 발췌 | passages |

**입력 방식 (ADR-0010):**
- **2벌식 자모 직접 입력 + 클라이언트 합성**
- 자모 단위로 타이핑 → 자동으로 한글 음절 합성
- 표시: 안녕하세요
- 입력: ㅇㅏㄴㄴㅕㅇㅎㅏㅅㅔ요

**코퍼스 분포:**
- 총: 25개 항목 (가장 적음, 확장 필요)
- 인사말, 기본 단어 위주

### 학습 자료 (Language/wiki/)

**현재 상태:**
- 📄 sources/ : 0 파일
- 📖 vocabulary/ : 0 파일
- 💬 expressions/ : 0 파일
- 🌏 culture/ : 0 파일

**원본 소스 (Language/raw/):**
- topik1-starter.md (TOPIK 1급 자료)

**확장 필요:**
- TOPIK 1-6급 어휘
- 한국어 교재 발췌
- 한자어·외래어 정리
- 문화 노트 (존댓말, 의성어·의태어)

---

## 🎮 스테이지 설계

### 6 티어 시스템

| Tier | 이름 | 대상 | 코퍼스 타입 | 예시 |
|------|------|------|------------|------|
| 0 | 문자 | 언어의 문자 체계 | chars | あ, ア, 漢, a |
| 1 | 기초 단어 | A1-A2 어휘 | words | hello, hola, こんにちは |
| 2 | 확장 단어 | A2-B1 어휘 | words | vocabulary, phrase |
| 3 | 짧은 문장 | B1 회화 | sentences | "How are you?" |
| 4 | 긴 문장 | B2-C1 | news, quotes | 뉴스 헤드라인 |
| 5 | 단락 | C1-C2 | passages | 문학 발췌 |

### 미션 시스템

각 스테이지에는 미션이 자동 부여됩니다:
- **defeat_count**: N개의 적 격파
- **accuracy_threshold**: 정확도 X% 이상
- **wpm_threshold**: 분당 단어수 X 이상
- **category_focus**: 특정 카테고리 집중
- **combo_chain**: 연속 콤보 유지

---

## 📊 데이터 파이프라인

### 콘텐츠 흐름

```
[1] Language/raw/         (원본 자료, 출처 표기)
    ↓
[2] Language/wiki/        (인제스트, 인용 포함)
    ↓
[3] Game/raw/{lang}_words.md   (큐레이션, 코퍼스)
    ↓
[4] Game/lingotype/prototype/src/data/
    ↓
[5] 게임 런타임
```

### 생성 명령

```bash
# 1. 원본 자료 추가 (Language/raw/{Lang}/)
echo "..." > Language/raw/Japanese/tatoeba-sentences.md

# 2. 위키에 인제스트 (Language/wiki/{Lang}/)
# 수동 작성 또는 스크립트

# 3. 게임 코퍼스에 인용과 함께 추가
vim Game/raw/jp_words.md  # source: [[wikilink]]

# 4. 대시보드 데이터 갱신
cd Game/lingotype
python dashboard/generate_data.py

# 5. 대시보드 확인
open dashboard/index.html
```

---

## 🔧 확장 가이드

### 1. 새로운 언어 추가

**위치:**
```
Language/wiki/{NewLang}/
├── sources/
├── vocabulary/
├── expressions/
├── culture/
├── study-plan/
├── index.md
└── log.md

Language/raw/{NewLang}/
└── *.md (원본 자료)

Game/lingotype/raw/{newlang}_words.md
Game/lingotype/prototype/src/data/stages.ts
```

**단계:**
1. Language/wiki/ 에 새 언어 폴더 생성
2. raw/ 에 원본 자료 최소 1개 추가
3. Game/raw/ 에 코퍼스 YAML 작성
4. Game/lingotype/dashboard/generate_data.py 수정:
   ```python
   LANG_CODES = {
       ...
       "NewLang": "nl",  # 추가
   }
   LANG_META["nl"] = { ... }  # 메타 추가
   ```
5. `python dashboard/generate_data.py` 실행
6. 대시보드에서 자동 표시 확인

### 2. 기존 언어 확장

**새 단어 추가:**
```yaml
# Game/raw/en_words.md 에 추가
- { id: en_070, display: wonderful, meaning: 놀라운, level: 2, category: adjective }
```

**자동 반영:**
- 다음 생성 시 대시보드에 반영
- 스테이지에서 단어 부족 시 "Gaps" 경고 표시

**새 스테이지 추가:**
```typescript
// Game/lingotype/prototype/src/data/stages.ts
{
  id: 'en_2_3',
  language: 'en',
  tier: 2,
  name: 'Weather & Time',
  description: '날씨·시간 표현',
  difficulty: 2,
  wordCount: 10,
  corpusFilter: { minLevel: 2, maxLevel: 2, categories: ['weather', 'time'] },
  missions: defaultMissionsForTier(2),
},
```

### 3. 위키 자료 추가

**위치:** `Language/wiki/{Lang}/{folder}/{name}.md`

**구조:**
```markdown
# 제목

> 인용: [[source-document-name]]

## 정의 (Definition)
...

## 예문 (Examples)
...

## 문화적 맥락 (Cultural Context)
...
```

**자동 인덱싱:**
- 파일명 → ID
- 첫 번째 H1 → 제목
- 폴더 위치 → 카테고리

### 4. 대시보드에서 확장

**대시보드 기능:**
- 📖 전체 펼치기 버튼으로 모든 섹션 확장
- 🔍 스테이지 검색 (이름, 설명, ID)
- 🎚️ 티어 필터 (T0-T5)
- ⚠️ 코퍼스 부족 자동 감지

**확장 계획:**
- 스테이지 추가 → JSON 재생성 → 대시보드 자동 반영
- 학습자료 추가 → JSON 재생성 → 대시보드 자동 반영
- 커버리지 분석 자동 갱신

---

## 📊 대시보드 사용법

### 실행

```bash
cd Game/lingotype

# 1. 데이터 생성 (필수)
python dashboard/generate_data.py

# 2. 대시보드 열기
open dashboard/index.html
# 또는
python -m http.server -d dashboard 8000
# → http://localhost:8000
```

### 주요 기능

**Overview 탭:**
- 전체 통계 (언어/스테이지/코퍼스)
- 언어별 타일 (클릭하면 상세 진입)
- 티어별 분포

**언어별 상세 탭:**
- 📖 **코퍼스 vs 학습자료**: 좌우 비교
  - 게임 코퍼스 (레벨/카테고리별 분포, 샘플)
  - 위키 학습자료 (어휘/표현/문화)
- 🎮 **스테이지**: 검색/필터 가능한 테이블
- 📚 **위키 학습자료**: 펼침/접기 가능한 섹션
- 📄 **원본 소스**: Language/raw/ + Language/wiki/sources/

**인터랙션:**
- 클릭으로 언어 전환
- 검색으로 스테이지 찾기
- 펼치기로 전체 자료 확인
- 코퍼스 부족 자동 경고

### 데이터 갱신

```bash
# 콘텐츠 수정 후
python dashboard/generate_data.py

# 브라우저 새로고침
# 또는 새로고침 버튼 클릭
```

---

## 📈 다음 단계

### 우선순위 작업

1. **English 학습자료 확장** (현재 0개)
   - OEC 빈도 단어 200개
   - CEFR 어휘 500개
   - BBC Learning English 문장 100개

2. **日本語 학습자료 확장** (현재 0개)
   - JLPT N5-N1 어휘 1000개
   - 한자 히라가나 표기
   - 존댓말 가이드

3. **한국어 학습자료 확장** (현재 0개)
   - TOPIK 1-6급 어휘 500개
   - 한자어 정리
   - 문화 노트

4. **게임 코퍼스 확장**
   - Tier 4-5 (긴 문장/단락) 보강
   - 한국어 25개 → 200개로 확대
   - 모든 언어 Tier 5 단락 추가

### 대시보드 개선 사항

- [ ] 실시간 검색 자동완성
- [ ] 단어/문장 비교 뷰 (병렬)
- [ ] 커버리지 차트 (Chart.js)
- [ ] 진행 상황 추적 (각 언어별 %)
- [ ] 데이터 다운로드 (CSV/JSON)

---

**마지막 업데이트:** 2024-06-18
**대시보드 위치:** `Game/lingotype/dashboard/index.html`
**데이터 생성기:** `Game/lingotype/dashboard/generate_data.py`
