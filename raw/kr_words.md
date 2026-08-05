# Korean Word/Sentence Corpus

> **상태**: 골격. Phase 6에서 본격 확장.
> **ADR-0009**: 한국어 입력 방식 — Draft (사용자 결정 대기).
> **업스트림**: `Language/wiki/Korean/` 에서 인용. 인제스트 후 채워짐.

## 파이프라인

이 코퍼스의 모든 항목은 `Language/wiki/Korean/vocabulary/{word}.md` 페이지를 **반드시** 인용해야 한다.

```
Language/raw/Korean/         (소스 자료, immutable)
  └─ ingest
Language/wiki/Korean/vocabulary/
  └─ curate (source: [[basic-vocabulary]])
Game/typing_language/raw/kr_words.md  ← 이 파일
  └─ build
Game/typing_language/prototype/src/data/kr_words.json
```

자세한 내용: `wiki/corpus-pipeline.md`, `wiki/languages/korean.md`

## 코퍼스 형식

```yaml
- id: kr_001
  display: 안녕하세요          # 화면 표시 (한글 완성형)
  input: annyeonghaseyo       # 사용자가 타이핑 (로마자)
  meaning: hello (polite)     # 영어 정의 또는 한국어 뜻
  level: 1                    # TOPIK 1~6 (1=기초, 6=최고)
  category: greeting
  source: "[[annyeonghaseyo]]"   # Language/wiki/Korean/vocabulary/ 페이지 인용 (필수)
  note: ""                    # 선택. irregular, 발음 변동 등 게임 메카닉 비고
```

> **`source` 필드는 필수**. 누락 시 lint 결함.

## Level 1 (TOPIK 1, 기초)

### 인사 (Greeting)

> Language 위키 인제스트 후 채워질 골격. 현재 `Language/wiki/Korean/vocabulary/` 비어 있음 — 인제스트가 선행되어야 한다.

```yaml
# (예정 — Language 위키 시드 후 추가)
# - { id: kr_001, display: 안녕하세요, input: annyeonghaseyo, meaning: hello (polite), level: 1, category: greeting, source: "[[annyeonghaseyo]]" }
# - { id: kr_002, display: 안녕히 가세요, input: annyeonghi gaseyo, meaning: goodbye (to person leaving), level: 1, category: greeting, source: "[[annyeonghi-gaseyo]]" }
# - { id: kr_003, display: 감사합니다, input: gamsahamnida, meaning: thank you, level: 1, category: greeting, source: "[[gamsahamnida]]" }
# - { id: kr_004, display: 죄송합니다, input: joesonghamnida, meaning: I'm sorry, level: 1, category: greeting, source: "[[joesonghamnida]]" }
```

### 숫자 (Number)

```yaml
# (예정 — Language 위키 시드 후 추가)
# - { id: kr_010, display: 하나, input: hana, meaning: one, level: 1, category: number, source: "[[hana]]" }
# - { id: kr_011, display: 둘, input: dul, meaning: two, level: 1, category: number, source: "[[dul]]" }
# - { id: kr_012, display: 셋, input: set, meaning: three, level: 1, category: number, source: "[[set]]" }
# - { id: kr_013, display: 열, input: yeol, meaning: ten, level: 1, category: number, source: "[[yeol]]" }
# - { id: kr_014, display: 백, input: baek, meaning: hundred, level: 1, category: number, source: "[[baek]]" }
```

### 색상 (Color)

```yaml
# (예정)
```

### 가족 (Family)

```yaml
# (예정)
```

### 음식 (Food)

```yaml
# (예정)
```

## 여행 (Travel) — Level 1

> **출처**: [[first-travel-japan]] (raw/Korean/first-travel-japan.md)
> **위키 페이지**: 테마 파일 기준 (예: [[travel]])
> **카테고리**: travel (여행)

### 공항 & 비행기

```yaml
- { id: kr_t_001, display: 공항, jamo: ㄱㅗㅎㅏㅇ, meaning: 공항, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_002, display: 여권, jamo: ㅇㅕㄱㅝㄴ, meaning: 여권, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_003, display: 입국심사, jamo: ㅇㅣㅂㄱㅜㄱㅅㅣㅁㅅㅏ, meaning: 입국심사, level: 2, category: travel, source: [[여행]] }
- { id: kr_t_004, display: 짐, jamo: ㅈㅣㅁ, meaning: 짐, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_005, display: 출구, jamo: ㅊㅜㄹㄱㅜ, meaning: 출구, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_006, display: 입구, jamo: ㅇㅣㅂㄱㅜ, meaning: 입구, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_007, display: 환전, jamo: ㅎㅘㄴㅈㅓㄴ, meaning: 환전, level: 2, category: travel, source: [[여행]] }
```

### 호텔

```yaml
- { id: kr_t_010, display: 호텔, jamo: ㅎㅗㅌㅔㄹ, meaning: 호텔, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_011, display: 방, jamo: ㅂㅏㅇ, meaning: 방, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_012, display: 예약, jamo: ㅇㅖㅇㅏㄱ, meaning: 예약, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_013, display: 아침 식사, jamo: ㅇㅏㅊㅣㅁ ㅅㅣㄱㅅㅏ, meaning: 아침 식사, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_014, display: 묵다, jamo: ㅁㅜㄱㄷㅏ, meaning: 묵다, level: 1, category: travel, source: [[여행]] }
```

### 식당

```yaml
- { id: kr_t_020, display: 메뉴, jamo: ㅁㅔㄴㅠ, meaning: 메뉴, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_021, display: 주문, jamo: ㅈㅜㅁㅜㄴ, meaning: 주문, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_022, display: 계산, jamo: ㄱㅖㅅㅏㄴ, meaning: 계산, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_023, display: 맛있다, jamo: ㅁㅏㅅㅇㅣㅆㄷㅏ, meaning: 맛있다, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_024, display: 맵다, jamo: ㅁㅐㄷㅏ, meaning: 맵다, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_025, display: 팁, jamo: ㅌㅣㅍ, meaning: 팁, level: 1, category: travel, source: [[여행]] }
```

### 교통

```yaml
- { id: kr_t_030, display: 지하철, jamo: ㅈㅣㅎㅏㅊㅓㄹ, meaning: 지하철, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_031, display: 버스, jamo: ㅂㅓㅅㅡ, meaning: 버스, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_032, display: 택시, jamo: ㅌㅐㄱㅅㅣ, meaning: 택시, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_033, display: 기차, jamo: ㄱㅣㅊㅏ, meaning: 기차, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_034, display: 역, jamo: ㅇㅕㄱ, meaning: 역, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_035, display: 신칸센, jamo: ㅅㅣㄴㅋㅏㄴㅅㅔㄴ, meaning: 신칸센, level: 2, category: travel, source: [[여행]] }
- { id: kr_t_036, display: 표, jamo: ㅍㅛ, meaning: 표, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_037, display: 왼쪽, jamo: ㅇㅗㄴㄱㅗㄱ, meaning: 왼쪽, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_038, display: 오른쪽, jamo: ㅇㅗㄹㅡㄴㄲㅗㄱ, meaning: 오른쪽, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_039, display: 직진, jamo: ㅈㅣㄱㅈㅣㄴ, meaning: 직진, level: 2, category: travel, source: [[여행]] }
```

### 관광

```yaml
- { id: kr_t_040, display: 절, jamo: ㅈㅓㄹ, meaning: 절, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_041, display: 신사, jamo: ㅅㅣㄴㅅㅏ, meaning: 신사, level: 2, category: travel, source: [[여행]] }
- { id: kr_t_042, display: 박물관, jamo: ㅂㅏㄱㅁㅜㄹㄱㅘㄴ, meaning: 박물관, level: 2, category: travel, source: [[여행]] }
- { id: kr_t_043, display: 공원, jamo: ㄱㅗㅇㄱㅜㄱ, meaning: 공원, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_044, display: 산, jamo: ㅅㅏㄴ, meaning: 산, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_045, display: 바다, jamo: ㅂㅏㄷㅏ, meaning: 바다, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_046, display: 사진, jamo: ㅅㅏㅈㅣㄴ, meaning: 사진, level: 1, category: travel, source: [[여행]] }
- { id: kr_t_047, display: 지도, jamo: ㅈㅣㄷㅗ, meaning: 지도, level: 1, category: travel, source: [[여행]] }
```

### 여행 표현 (Travel Expressions) — Level 3

```yaml
- id: kr_t_s_001
  display: 화장실 어디예요?
  jamo: ㅎㅘㅈㅏㅇㅅㅣㄹ ㅇㅓㄷㅣㅇㅖㅛ?
  meaning: 화장실 어디예요?
  level: 1
  category: travel
  source: [[여행]]

- id: kr_t_s_002
  display: 얼마예요?
  jamo: ㅇㅓㄹㅁㅏㅇㅖㅛ?
  meaning: 얼마예요?
  level: 1
  category: travel
  source: [[여행]]

- id: kr_t_s_003
  display: 감사합니다
  jamo: ㄱㅏㅁㅅㅏㅎㅏㅂㄴㅣㄷㅏ
  meaning: 감사합니다
  level: 1
  category: travel
  source: [[여행]]

- id: kr_t_s_004
  display: 도와주세요
  jamo: ㄷㅗㅇㅘㅈㅜㅅㅔㅇㅛ
  meaning: 도와주세요
  level: 1
  category: travel
  source: [[여행]]

- id: kr_t_s_005
  display: 호텔은 어디예요?
  jamo: ㅎㅗㅌㅔㄹㅇㅡㄴ ㅇㅓㄷㅣㅇㅖㅛ?
  meaning: 호텔은 어디예요?
  level: 1
  category: travel
  source: [[여행]]
```

## Level 2 (TOPIK 2, 일상)

(예정 — Language 위키 인제스트 후)

## Level 3~6

(예정)

## 문장 (Sentences)

(예정)

## 카테고리

- greeting (인사)
- number (숫자)
- color (색상)
- time (시간)
- family (가족)
- animal (동물)
- food (음식)
- place (장소)
- person (사람)
- object (사물)
- common_verb (기본 동사)
- adjective (형용사)
- feeling (감정)
- question (질문)
- travel (여행)

## 발음 변동 메모 (게임 핸들러 참고)

ADR-0009 결정 후 정식 매핑. 자주 쓰는 변동:

| 패턴 | 예시 | 입력 노트 |
| --- | --- | --- |
| ㄷ + ㅣ → ㅊ | 같이 (gachi) | dat → cha 음변 |
| ㅂ + ㅅ → ㅆ | 있습니다 (isseumnida) | b + s → ss |
| ㅂ + ㄴ → ㅁ | 않습니다 (animnida) | b + n → m |
| ㄴ + ㅇ → ㄴㄴ | 한국어 (hangug-eo) | 연음 방지 |

자세한 내용: `wiki/languages/korean.md` > 받침 규칙, 발음 변동 예시

## 라이선스

- 단어 자체는 저작권 없음
- 문장은 출처 명시 + 라이선스 확인 필수
- 교재 인용은 학습 목적 fair use 범위 내에서

## 확장 계획

1. `Language/raw/Korean/` 에 TOPIK 1 단어장 PDF/웹클립 추가
2. `Language/wiki/Korean/` 인제스트 → vocabulary 페이지 30~50개 생성
3. `Game/typing_language/raw/kr_words.md` 에 인용과 함께 큐레이션
4. 발음 변동 매핑 단어 단위 추가
5. Level 2~6 순차 확장

## 다음 단계

- ADR-0009 사용자 결정
- `Language/raw/Korean/` 첫 출처 추가 (TOPIK 1 또는 Yonsei Korean 1-1)
- Language 위키 인제스트 (vocabulary 페이지 시드)
- 본 코퍼스 파일에 실제 항목 추가 (인용 필수)
- JSON 변환: `prototype/src/data/kr_words.json`
- 핸들러 구현: `prototype/src/input/KoreanHandler.ts`
- 단위 테스트

## Wiki-driven entries (auto-generated, 2026-07-03)

```yaml
- { id: kr_200, display: KTX, meaning: KTX (Korea Train eXpress, high-speed train)., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_201, display: Korean food culture, meaning: Korean food culture., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_202, display: Korean-dating-culture, meaning: Korean dating culture., level: 1, source: [[basic-vocabulary]] }
- { id: kr_203, display: SRT, meaning: SRT (Super Rapid Train, Korean high-speed train)., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_204, display: 아침밥, meaning: Breakfast., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_205, display: 안녕하세요, meaning: Standard polite greeting, equivalent to "hello" in English. , level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: kr_206, display: 바다, meaning: Sea / ocean., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_207, display: 방, meaning: Room., level: 1, source: [[basic-vocabulary]] }
- { id: kr_208, display: 박물관, meaning: Museum — 유물/예술품 등을 전시하고 교육하는 시설., level: 1, source: [[basic-vocabulary]] }
- { id: kr_209, display: 밥, meaning: Rice; meal (cooked rice as staple food)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_210, display: 버스, meaning: Bus — 다수의 승객을 수송하는 대형 차량., level: 1, category: family, source: [[여행]] }
- { id: kr_211, display: 비싸다, meaning: Expensive / costly., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_212, display: 책, meaning: Book., level: 1, source: [[basic-vocabulary]] }
- { id: kr_213, display: 차가운, meaning: Cold (to touch) / iced., level: 1, source: [[basic-vocabulary]] }
- { id: kr_214, display: 친구, meaning: Friend. A person you have a non-romantic, non-familial close, level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_215, display: 출구, meaning: Exit — 건물이나 역에서 밖으로 나가는 문/통로., level: 1, category: place, source: [[여행]] }
- { id: kr_216, display: 춥다, meaning: Cold (temperature)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_217, display: 달다, meaning: Sweet., level: 1, source: [[basic-vocabulary]] }
- { id: kr_218, display: 다섯, meaning: Five (native Korean)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_219, display: 덥다, meaning: Hot (weather) / warm., level: 1, category: body, source: [[body-family]] }
- { id: kr_220, display: 둘, meaning: Two (native Korean)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_221, display: 가격, meaning: Price / cost., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_222, display: 가족, meaning: Family., level: 1, source: [[basic-vocabulary]] }
- { id: kr_223, display: 가까이, meaning: Near / close by., level: 1, category: body, source: [[body-family]] }
- { id: kr_224, display: 감사합니다, meaning: Standard polite "thank you." Used universally in formal and , level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: kr_225, display: 기차, meaning: Train — 철도 위를 달리는 교통수단., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_226, display: 공부, meaning: Study; to study., level: 1, source: [[basic-vocabulary]] }
- { id: kr_227, display: 공항, meaning: Airport — 항공기 이착륙 및 여객 처리 시설., level: 1, category: place, source: [[여행]] }
- { id: kr_228, display: 공원, meaning: Park — 시민의 휴식과 오락을 위한 녹지 공간., level: 1, category: place, source: [[여행]] }
- { id: kr_229, display: 계산, meaning: Check (bill) / to calculate., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_230, display: 교차로, meaning: Intersection / crossroads., level: 1, source: [[basic-vocabulary]] }
- { id: kr_231, display: 학교, meaning: School., level: 1, category: place, source: [[여행]] }
- { id: kr_232, display: 하나, meaning: One (native Korean, used standalone or for hours)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_233, display: 한국, meaning: Korea (the country, South Korea)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_234, display: 호텔, meaning: Hotel — 유료로 숙박을 제공하는 시설., level: 1, category: place, source: [[여행]] }
- { id: kr_235, display: 환전, meaning: Currency exchange / to exchange money., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_236, display: 입구, meaning: Entrance — 건물이나 시설에 들어가는 문/통로., level: 1, category: body, source: [[body-family]] }
- { id: kr_237, display: 입국심사, meaning: Immigration (inspection at airport/border)., level: 1, category: body, source: [[body-family]] }
- { id: kr_238, display: 절, meaning: Temple — 한국의 불교 사찰., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_239, display: 지도, meaning: Map., level: 1, source: [[basic-vocabulary]] }
- { id: kr_240, display: 지하철, meaning: Subway — 도심 지하를 달리는 철도 교통수단., level: 1, source: [[basic-vocabulary]] }
- { id: kr_241, display: 직진, meaning: Straight ahead., level: 1, category: body, source: [[body-family]] }
- { id: kr_242, display: 짐, meaning: Luggage / baggage., level: 1, source: [[basic-vocabulary]] }
- { id: kr_243, display: 죄송합니다, meaning: Polite "I'm sorry" or "I apologize." Standard formal apology, level: 1, category: family, source: [[여행]] }
- { id: kr_244, display: 주문, meaning: Order (food/services)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_245, display: 맵다, meaning: Spicy / hot (in flavor)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_246, display: 만나서 반갑습니다, meaning: Nice to meet you (formal first-meeting greeting)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_247, display: 맛있다, meaning: Delicious / tasty., level: 1, source: [[basic-vocabulary]] }
- { id: kr_248, display: 멀리, meaning: Far / far away., level: 1, source: [[basic-vocabulary]] }
- { id: kr_249, display: 물, meaning: Water., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_250, display: 내일, meaning: Tomorrow., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_251, display: 넷, meaning: Four (native Korean)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_252, display: 왼쪽, meaning: Left side / to the left., level: 1, source: [[basic-vocabulary]] }
- { id: kr_253, display: 오늘 날씨가 좋아요, meaning: The weather is good today., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_254, display: 오늘, meaning: Today., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_255, display: 오른쪽, meaning: Right side / to the right., level: 1, source: [[basic-vocabulary]] }
- { id: kr_256, display: 표, meaning: Ticket., level: 1, category: travel, source: [[여행]] }
- { id: kr_257, display: resignation, meaning: resignation; quitting., level: 1, source: [[basic-vocabulary]] }
- { id: kr_258, display: retirement, meaning: retirement., level: 1, source: [[basic-vocabulary]] }
- { id: kr_259, display: 사진, meaning: Photo / picture., level: 1, source: [[basic-vocabulary]] }
- { id: kr_260, display: 산, meaning: Mountain., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_261, display: 사랑, meaning: Love. Deep affection. Used for romantic, family, occasional , level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_262, display: 세관, meaning: Customs — 세무/수출입 검사 기관., level: 1, category: body, source: [[body-family]] }
- { id: kr_263, display: 셋, meaning: Three (native Korean)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_264, display: 신호등, meaning: Traffic light., level: 1, source: [[basic-vocabulary]] }
- { id: kr_265, display: 신사, meaning: Shrine — 일본의 전통 신앙 시설., level: 1, source: [[basic-vocabulary]] }
- { id: kr_266, display: 싸다, meaning: Cheap / inexpensive., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_267, display: 택시, meaning: Taxi — 유료로 승객을 운송하는 자동차., level: 1, source: [[basic-vocabulary]] }
- { id: kr_269, display: 역, meaning: Station — 열차/지하철이 정차하는 장소., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_270, display: 열, meaning: Ten (native Korean)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_271, display: 예약, meaning: Reservation / to reserve., level: 1, source: [[basic-vocabulary]] }
- { id: kr_272, display: 가, meaning: subject marker., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_273, display: 가게, meaning: store; shop., level: 1, category: place, source: [[여행]] }
- { id: kr_274, display: 가격, meaning: price., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_275, display: 가까이, meaning: closely; near., level: 1, category: body, source: [[body-family]] }
- { id: kr_276, display: 가깝다, meaning: to be close; to be near., level: 1, category: body, source: [[body-family]] }
- { id: kr_277, display: 가다, meaning: to go., level: 1, source: [[basic-vocabulary]] }
- { id: kr_278, display: 가디건, meaning: cardigan., level: 1, source: [[basic-vocabulary]] }
- { id: kr_279, display: 가슴, meaning: chest; heart (emotion)., level: 1, category: body, source: [[body-family]] }
- { id: kr_280, display: 가슴이 벅차다, meaning: to be overwhelmed with emotion., level: 1, source: [[basic-vocabulary]] }
- { id: kr_281, display: 가을, meaning: autumn; fall., level: 1, category: time, source: [[자연・날씨 어휘]] }
- { id: kr_282, display: 가정, meaning: home; family; household., level: 1, category: place, source: [[여행]] }
- { id: kr_283, display: 가족, meaning: family., level: 1, source: [[basic-vocabulary]] }
- { id: kr_284, display: 가죽, meaning: leather., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_285, display: 각, meaning: angle; each., level: 1, source: [[basic-vocabulary]] }
- { id: kr_286, display: 간, meaning: liver; gap; salt., level: 1, source: [[basic-vocabulary]] }
- { id: kr_287, display: 간장, meaning: soy sauce., level: 1, source: [[basic-vocabulary]] }
- { id: kr_288, display: 감격, meaning: overwhelming emotion; being deeply moved., level: 1, source: [[basic-vocabulary]] }
- { id: kr_289, display: 감격하다, meaning: to be deeply moved., level: 1, source: [[basic-vocabulary]] }
- { id: kr_290, display: 감기, meaning: Cold (illness) — 호흡기 감염 질환., level: 1, source: [[basic-vocabulary]] }
- { id: kr_291, display: 감동, meaning: deep emotion; being touched., level: 1, source: [[basic-vocabulary]] }
- { id: kr_292, display: 감동하다, meaning: to be moved; to be touched., level: 1, source: [[basic-vocabulary]] }
- { id: kr_293, display: 감사하다, meaning: to thank; to be grateful., level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: kr_294, display: 감사합니다, meaning: thank you (formal)., level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: kr_295, display: 감정, meaning: emotion; feeling., level: 1, source: [[basic-vocabulary]] }
- { id: kr_296, display: 갑갑, meaning: frustrating; suffocating., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_297, display: 갑갑하다, meaning: to be frustrated; to be suffocating., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_298, display: 값, meaning: price; value., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_299, display: 강, meaning: river., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_300, display: 강아지, meaning: puppy; small dog., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_301, display: 강의, meaning: lecture; to lecture., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_302, display: 같이 먹어요, meaning: Let's eat together., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_303, display: 개, meaning: dog., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_304, display: 개구리, meaning: frog., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_305, display: 개미, meaning: ant., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_306, display: 갤러리, meaning: gallery., level: 1, source: [[basic-vocabulary]] }
- { id: kr_307, display: 갤럭시, meaning: Galaxy (Samsung smartphone)., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_308, display: 거, meaning: thing (casual); place., level: 1, source: [[basic-vocabulary]] }
- { id: kr_309, display: 거리, meaning: street; distance., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_310, display: 거북이, meaning: turtle., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_311, display: 거절, meaning: refusal; rejection., level: 1, source: [[basic-vocabulary]] }
- { id: kr_312, display: 거절하다, meaning: to refuse; to reject., level: 1, source: [[basic-vocabulary]] }
- { id: kr_313, display: 거짓말, meaning: lie; falsehood., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_314, display: 거짓말쟁이, meaning: liar., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_315, display: 걱정, meaning: worry; concern., level: 1, source: [[basic-vocabulary]] }
- { id: kr_316, display: 걱정하다, meaning: to worry., level: 1, source: [[basic-vocabulary]] }
- { id: kr_317, display: 건, meaning: thing (counter, casual); matter., level: 1, source: [[basic-vocabulary]] }
- { id: kr_318, display: 건강, meaning: health., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_319, display: 건반, meaning: keyboard (instrument)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_320, display: 건조, meaning: dry; dryness., level: 1, source: [[basic-vocabulary]] }
- { id: kr_321, display: 걷기, meaning: walking; gait., level: 1, source: [[basic-vocabulary]] }
- { id: kr_322, display: 걷다, meaning: to walk., level: 1, source: [[basic-vocabulary]] }
- { id: kr_323, display: 걸, meaning: thing (colloquial); walking., level: 1, source: [[basic-vocabulary]] }
- { id: kr_324, display: 검은 구두, meaning: black shoes., level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_325, display: 검정, meaning: black (noun form)., level: 1, category: color, source: [[basic-vocabulary]] }
- { id: kr_326, display: 검토, meaning: review; examination., level: 1, source: [[basic-vocabulary]] }
- { id: kr_327, display: 겁 많다, meaning: to be cowardly; to be timid., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_328, display: 것, meaning: thing (that which); nominalizer., level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_329, display: 게으르다, meaning: lazy., level: 1, source: [[basic-vocabulary]] }
- { id: kr_330, display: 겨울, meaning: winter., level: 1, category: time, source: [[자연・날씨 어휘]] }
- { id: kr_331, display: 결론, meaning: conclusion., level: 1, source: [[basic-vocabulary]] }
- { id: kr_332, display: 결정, meaning: decision., level: 1, source: [[basic-vocabulary]] }
- { id: kr_333, display: 결혼식, meaning: Wedding ceremony., level: 1, source: [[basic-vocabulary]] }
- { id: kr_334, display: 경사, meaning: joyful event; slope (geography)., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_335, display: 경치, meaning: scenery; landscape; view., level: 1, source: [[basic-vocabulary]] }
- { id: kr_336, display: 계, meaning: system; season; chicken., level: 1, category: family, source: [[여행]] }
- { id: kr_337, display: 계곡, meaning: valley (with stream)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_338, display: 계산, meaning: calculation; to calculate; to pay (the bill)., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_339, display: 계산기, meaning: calculator., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_340, display: 계산서, meaning: bill; check (restaurant)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_341, display: 계산하다, meaning: to pay (the bill)., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_342, display: 계약, meaning: contract., level: 1, source: [[basic-vocabulary]] }
- { id: kr_343, display: 계약금, meaning: deposit; down payment., level: 1, source: [[basic-vocabulary]] }
- { id: kr_344, display: 계정, meaning: account; system., level: 1, source: [[basic-vocabulary]] }
- { id: kr_345, display: 계좌, meaning: account (bank account)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_346, display: 고, meaning: and (connective); quote., level: 1, source: [[basic-vocabulary]] }
- { id: kr_347, display: 고기, meaning: meat., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_348, display: 고등학교, meaning: high school., level: 1, category: place, source: [[여행]] }
- { id: kr_349, display: 고래, meaning: whale., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_350, display: 고마워요, meaning: thanks (polite casual)., level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: kr_351, display: 고맙다, meaning: to be grateful; thank you (casual)., level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: kr_352, display: 고맙습니다, meaning: thank you (casual formal)., level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: kr_353, display: 고모, meaning: aunt (paternal)., level: 1, category: family, source: [[여행]] }
- { id: kr_354, display: 고백, meaning: 고백 — Confession (romantic)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_355, display: 고양이, meaning: cat., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_356, display: 고춧가루, meaning: red pepper powder (Korean gochugaru)., level: 1, category: color, source: [[basic-vocabulary]] }
- { id: kr_357, display: 고통스럽다, meaning: to be painful; to be agonizing., level: 1, source: [[basic-vocabulary]] }
- { id: kr_358, display: 고프다, meaning: hungry., level: 1, source: [[basic-vocabulary]] }
- { id: kr_359, display: 곤란, meaning: to be difficult; to be in trouble., level: 1, source: [[basic-vocabulary]] }
- { id: kr_360, display: 곤충, meaning: insect., level: 1, source: [[basic-vocabulary]] }
- { id: kr_361, display: 곰, meaning: bear., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_362, display: 공, meaning: ball; zero., level: 1, source: [[basic-vocabulary]] }
- { id: kr_363, display: 공동체, meaning: community., level: 1, source: [[basic-vocabulary]] }
- { id: kr_364, display: 공부, meaning: study; to study., level: 1, source: [[basic-vocabulary]] }
- { id: kr_365, display: 공부하다, meaning: to study., level: 1, source: [[basic-vocabulary]] }
- { id: kr_366, display: 공원, meaning: park., level: 1, category: place, source: [[여행]] }
- { id: kr_367, display: 공포, meaning: terror; horror., level: 1, source: [[basic-vocabulary]] }
- { id: kr_368, display: 공학, meaning: engineering., level: 1, source: [[basic-vocabulary]] }
- { id: kr_369, display: 공항, meaning: airport., level: 1, category: place, source: [[여행]] }
- { id: kr_370, display: 과, meaning: and (with); with., level: 1, source: [[basic-vocabulary]] }
- { id: kr_371, display: 과일, meaning: fruit., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_372, display: 과학, meaning: science., level: 1, source: [[basic-vocabulary]] }
- { id: kr_373, display: 관광, meaning: tourism; to sightsee., level: 1, category: travel, source: [[여행]] }
- { id: kr_374, display: 관심, meaning: interest; concern., level: 1, source: [[basic-vocabulary]] }
- { id: kr_375, display: 괜찮다, meaning: to be okay; to be fine., level: 1, source: [[basic-vocabulary]] }
- { id: kr_376, display: 괜찮아요, meaning: it's okay; I'm fine., level: 1, source: [[basic-vocabulary]] }
- { id: kr_377, display: 괴롭다, meaning: to be painful; to be distressing., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_378, display: 교사, meaning: teacher (formal)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_379, display: 교수, meaning: professor., level: 1, source: [[basic-vocabulary]] }
- { id: kr_380, display: 교육, meaning: education; to educate., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_381, display: 교환, meaning: exchange; swap; to exchange., level: 1, source: [[basic-vocabulary]] }
- { id: kr_382, display: 구두, meaning: dress shoes; leather shoes., level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_383, display: 구름, meaning: cloud., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_384, display: 구매, meaning: purchase; to buy., level: 1, source: [[basic-vocabulary]] }
- { id: kr_385, display: 구이, meaning: grilled dish., level: 1, source: [[basic-vocabulary]] }
- { id: kr_386, display: 국, meaning: soup., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_387, display: 국가, meaning: country; state (formal)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_388, display: 국민, meaning: citizen; people (of a country)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_389, display: 국밥, meaning: rice in soup (Korean soupy dish)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_390, display: 궁금, meaning: curious; wanting to know., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_391, display: 귀, meaning: ear; return; precious., level: 1, category: body, source: [[body-family]] }
- { id: kr_392, display: 귀엽다, meaning: 귀엽다 — Cute; adorable., level: 1, category: body, source: [[body-family]] }
- { id: kr_393, display: 규정, meaning: regulation; to regulate., level: 1, source: [[basic-vocabulary]] }
- { id: kr_394, display: 규칙, meaning: rule; regulation., level: 1, source: [[basic-vocabulary]] }
- { id: kr_395, display: 그, meaning: that (near listener)., level: 1, category: body, source: [[body-family]] }
- { id: kr_396, display: 그래, meaning: yes (casual); okay., level: 1, source: [[basic-vocabulary]] }
- { id: kr_397, display: 그래프, meaning: graph., level: 1, source: [[basic-vocabulary]] }
- { id: kr_398, display: 그리다, meaning: 그리워하다 — To miss (someone)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_399, display: 그리움, meaning: longing; missing., level: 1, source: [[basic-vocabulary]] }
- { id: kr_400, display: 그림, meaning: picture; drawing; painting., level: 1, source: [[basic-vocabulary]] }
- { id: kr_401, display: 그립다, meaning: to miss (someone/something)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_402, display: 근처, meaning: vicinity; nearby., level: 1, category: body, source: [[body-family]] }
- { id: kr_403, display: 금융, meaning: finance; financial., level: 1, source: [[basic-vocabulary]] }
- { id: kr_404, display: 기대, meaning: expectation., level: 1, source: [[basic-vocabulary]] }
- { id: kr_405, display: 기록, meaning: record; minutes., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_406, display: 기름, meaning: oil., level: 1, source: [[basic-vocabulary]] }
- { id: kr_407, display: 기분, meaning: mood; feeling., level: 1, source: [[basic-vocabulary]] }
- { id: kr_408, display: 기뻐하다, meaning: to be happy., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_409, display: 기쁘다, meaning: to be joyful; to be happy., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_410, display: 기쁨, meaning: joy; happiness., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_411, display: 기상, meaning: weather (meteorology); to wake up., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_412, display: 기술, meaning: technology; technique; skill., level: 1, source: [[basic-vocabulary]] }
- { id: kr_413, display: 기억, meaning: memory; to remember., level: 1, source: [[basic-vocabulary]] }
- { id: kr_414, display: 기억력, meaning: memory capacity., level: 1, category: place, source: [[여행]] }
- { id: kr_415, display: 기차, meaning: train., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_416, display: 기타, meaning: etc.; other; guitar., level: 1, source: [[basic-vocabulary]] }
- { id: kr_417, display: 기후, meaning: climate., level: 1, source: [[basic-vocabulary]] }
- { id: kr_418, display: 긴, meaning: long (modifier form)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_419, display: 긴소매, meaning: long sleeves., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_420, display: 긴장하다, meaning: to be tense; to be nervous., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_421, display: 길, meaning: road; way; street., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_422, display: 길다, meaning: to be long (in length)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_423, display: 김치, meaning: kimchi (fermented cabbage)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_424, display: 김치찌개, meaning: kimchi stew., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_425, display: 까지, meaning: until; to; as far as., level: 1, source: [[basic-vocabulary]] }
- { id: kr_426, display: 깨, meaning: sesame seed., level: 1, source: [[basic-vocabulary]] }
- { id: kr_427, display: 꼬이다, meaning: to get twisted; to become tangled., level: 1, source: [[basic-vocabulary]] }
- { id: kr_428, display: 꼬인, meaning: twisted (modifier)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_429, display: 꽃, meaning: flower., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_430, display: 꿈, meaning: dream (sleep); dream (aspiration)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_431, display: 끊다, meaning: to cut; to hang up (phone)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_432, display: 나, meaning: I (casual); my., level: 1, source: [[basic-vocabulary]] }
- { id: kr_433, display: 나가다, meaning: to go out; to leave., level: 1, source: [[basic-vocabulary]] }
- { id: kr_434, display: 나들이, meaning: outing; day trip., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_435, display: 나라, meaning: country; nation., level: 1, category: place, source: [[여행]] }
- { id: kr_436, display: 나무, meaning: tree; wood., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_437, display: 나물, meaning: seasoned vegetable side dish., level: 1, category: family, source: [[여행]] }
- { id: kr_438, display: 나비, meaning: butterfly., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_439, display: 나쁘다, meaning: bad., level: 1, source: [[basic-vocabulary]] }
- { id: kr_440, display: 날, meaning: day (casual)., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_441, display: 날다, meaning: to fly., level: 1, source: [[basic-vocabulary]] }
- { id: kr_442, display: 날씨, meaning: weather., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_443, display: 날짜, meaning: date (calendar day)., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_444, display: 남녀, meaning: men and women; male and female., level: 1, source: [[basic-vocabulary]] }
- { id: kr_445, display: 남성, meaning: man (formal)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_446, display: 남자, meaning: man; male., level: 1, source: [[basic-vocabulary]] }
- { id: kr_447, display: 남자친구, meaning: boyfriend., level: 1, source: [[basic-vocabulary]] }
- { id: kr_448, display: 낮, meaning: daytime; day., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_449, display: 낮다, meaning: to be low., level: 1, source: [[basic-vocabulary]] }
- { id: kr_450, display: 낮은, meaning: low (modifier form)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_451, display: 내리다, meaning: to get off; to alight; to come down (rain)., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_452, display: 내부, meaning: interior; inside (formal)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_453, display: 내일, meaning: tomorrow., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_454, display: 냉면, meaning: cold noodles., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_455, display: 냉정하다, meaning: to be cool-headed; to be rational., level: 1, category: body, source: [[body-family]] }
- { id: kr_456, display: 너그럽다, meaning: to be generous; to be magnanimous., level: 1, source: [[basic-vocabulary]] }
- { id: kr_457, display: 넓다, meaning: to be wide; to be spacious., level: 1, source: [[basic-vocabulary]] }
- { id: kr_458, display: 넓은, meaning: wide; spacious (modifier form)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_459, display: 네, meaning: yes., level: 1, source: [[basic-vocabulary]] }
- { id: kr_460, display: 네번째, meaning: fourth., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_461, display: 넷, meaning: four (native Korean)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_462, display: 년, meaning: year., level: 1, category: body, source: [[body-family]] }
- { id: kr_463, display: 노동, meaning: labor; to labor., level: 1, source: [[basic-vocabulary]] }
- { id: kr_464, display: 노력, meaning: effort; endeavor., level: 1, source: [[basic-vocabulary]] }
- { id: kr_465, display: 노트북, meaning: laptop computer., level: 1, source: [[basic-vocabulary]] }
- { id: kr_466, display: 녹다, meaning: to melt; to thaw., level: 1, source: [[basic-vocabulary]] }
- { id: kr_467, display: 녹이다, meaning: to melt (causative); to dissolve., level: 1, source: [[basic-vocabulary]] }
- { id: kr_468, display: 녹차, meaning: green tea., level: 1, category: color, source: [[basic-vocabulary]] }
- { id: kr_469, display: 논, meaning: rice paddy., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_470, display: 놀라다, meaning: to be surprised., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_471, display: 놀람, meaning: surprise; astonishment., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_472, display: 놀랍다, meaning: to be surprising., level: 1, source: [[basic-vocabulary]] }
- { id: kr_473, display: 농구, meaning: Basketball., level: 1, source: [[basic-vocabulary]] }
- { id: kr_474, display: 높다, meaning: to be high; to be tall., level: 1, source: [[basic-vocabulary]] }
- { id: kr_475, display: 높은, meaning: high; tall (modifier form)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_476, display: 눈, meaning: snow., level: 1, category: body, source: [[body-family]] }
- { id: kr_477, display: 눈물이 나다, meaning: to tear up; tears come., level: 1, category: body, source: [[body-family]] }
- { id: kr_478, display: 느긋하다, meaning: to be relaxed., level: 1, source: [[basic-vocabulary]] }
- { id: kr_479, display: 느린, meaning: slow (modifier form)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_480, display: 늑대, meaning: wolf., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_481, display: 는, meaning: topic marker (after vowel); not (in negative)., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_482, display: 니트, meaning: knit; knitwear., level: 1, category: body, source: [[body-family]] }
- { id: kr_483, display: 다, meaning: all; statement end., level: 1, source: [[basic-vocabulary]] }
- { id: kr_484, display: 다리, meaning: leg; bridge., level: 1, category: body, source: [[body-family]] }
- { id: kr_485, display: 다섯, meaning: five (native Korean)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_486, display: 다섯번째, meaning: fifth., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_487, display: 다수, meaning: many; majority., level: 1, source: [[basic-vocabulary]] }
- { id: kr_488, display: 다정하다, meaning: affectionate; kind-hearted., level: 1, category: body, source: [[body-family]] }
- { id: kr_489, display: 달, meaning: moon., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_490, display: 달걀, meaning: egg., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_491, display: 달다, meaning: sweet., level: 1, source: [[basic-vocabulary]] }
- { id: kr_492, display: 달리다, meaning: to run., level: 1, source: [[basic-vocabulary]] }
- { id: kr_493, display: 달성, meaning: achievement; accomplishment., level: 1, source: [[basic-vocabulary]] }
- { id: kr_494, display: 닭, meaning: chicken; fowl., level: 1, source: [[basic-vocabulary]] }
- { id: kr_495, display: 답답하다, meaning: to feel frustrated; to feel stuffy., level: 1, source: [[basic-vocabulary]] }
- { id: kr_496, display: 답변, meaning: answer; reply., level: 1, source: [[basic-vocabulary]] }
- { id: kr_497, display: 답장, meaning: reply (message)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_498, display: 당나귀, meaning: donkey., level: 1, category: body, source: [[body-family]] }
- { id: kr_499, display: 당장, meaning: right now; immediately., level: 1, source: [[basic-vocabulary]] }
- { id: kr_500, display: 당황, meaning: embarrassment; confusion., level: 1, source: [[basic-vocabulary]] }
- { id: kr_501, display: 당황하다, meaning: to be embarrassed., level: 1, source: [[basic-vocabulary]] }
- { id: kr_502, display: 대단하다, meaning: great; amazing., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_503, display: 대추차, meaning: jujube tea (Korean traditional)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_504, display: 대표, meaning: CEO; representative., level: 1, category: travel, source: [[여행]] }
- { id: kr_505, display: 대학, meaning: university; college., level: 1, category: body, source: [[body-family]] }
- { id: kr_506, display: 대학교, meaning: university; college., level: 1, category: body, source: [[body-family]] }
- { id: kr_507, display: 대학원, meaning: graduate school., level: 1, category: place, source: [[여행]] }
- { id: kr_508, display: 대한민국, meaning: Republic of Korea (formal)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_509, display: 더운, meaning: hot (weather, modifier)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_510, display: 더치페이, meaning: Dutch pay; splitting the bill., level: 1, source: [[basic-vocabulary]] }
- { id: kr_511, display: 덥다, meaning: to be hot (weather)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_512, display: 덮밥, meaning: rice bowl (with toppings)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_513, display: 데이트, meaning: date (romantic)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_514, display: 도, meaning: also; too; even; degree., level: 1, source: [[basic-vocabulary]] }
- { id: kr_515, display: 도량 있다, meaning: to be magnanimous; to have broad mind., level: 1, source: [[basic-vocabulary]] }
- { id: kr_516, display: 도로, meaning: road (formal)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_517, display: 도서, meaning: book (literary); library., level: 1, source: [[basic-vocabulary]] }
- { id: kr_518, display: 도서관, meaning: library., level: 1, source: [[basic-vocabulary]] }
- { id: kr_519, display: 도시, meaning: city., level: 1, category: place, source: [[여행]] }
- { id: kr_520, display: 도와주세요, meaning: please help me (도와주세요), level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: kr_521, display: 도움, meaning: help; assistance., level: 1, source: [[basic-vocabulary]] }
- { id: kr_522, display: 도착, meaning: arrival; to arrive., level: 1, source: [[basic-vocabulary]] }
- { id: kr_523, display: 도착하다, meaning: to arrive; to reach (destination)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_524, display: 독서, meaning: Reading — 책을 읽는 활동., level: 1, source: [[basic-vocabulary]] }
- { id: kr_525, display: 독특하다, meaning: to be unique., level: 1, source: [[basic-vocabulary]] }
- { id: kr_526, display: 돈, meaning: money., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_527, display: 돋, meaning: sharp; bright (modifier, archaic)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_528, display: 돋보기, meaning: magnifying glass; reading glasses., level: 1, source: [[basic-vocabulary]] }
- { id: kr_529, display: 돌, meaning: stone; turn (counter); age (counter)., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_530, display: 돌고래, meaning: dolphin., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_531, display: 돌보다, meaning: to take care of., level: 1, source: [[basic-vocabulary]] }
- { id: kr_532, display: 동료, meaning: colleague., level: 1, source: [[basic-vocabulary]] }
- { id: kr_533, display: 동물, meaning: animal., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_534, display: 동물원, meaning: zoo., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_535, display: 동전, meaning: coin; small change., level: 1, source: [[basic-vocabulary]] }
- { id: kr_536, display: 돼지, meaning: pig., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_537, display: 되, meaning: become (root)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_538, display: 된장찌개, meaning: soybean paste stew., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_539, display: 두근거리다, meaning: to throb (heart)., level: 1, category: body, source: [[body-family]] }
- { id: kr_540, display: 두려움, meaning: fear; dread., level: 1, category: body, source: [[body-family]] }
- { id: kr_541, display: 두려워하다, meaning: to be afraid., level: 1, source: [[basic-vocabulary]] }
- { id: kr_542, display: 두렵다, meaning: to be afraid., level: 1, source: [[basic-vocabulary]] }
- { id: kr_543, display: 두번째, meaning: second., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_544, display: 둘, meaning: two (native Korean)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_545, display: 드레스, meaning: dress., level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_546, display: 들, meaning: field; plain., level: 1, source: [[basic-vocabulary]] }
- { id: kr_547, display: 들다, meaning: to enter; to put in; to lift., level: 1, source: [[basic-vocabulary]] }
- { id: kr_548, display: 들어가다, meaning: to go in; to enter., level: 1, source: [[basic-vocabulary]] }
- { id: kr_549, display: 따뜻하다, meaning: warm (personality)., level: 1, category: body, source: [[body-family]] }
- { id: kr_550, display: 땅, meaning: land; ground; earth., level: 1, category: body, source: [[body-family]] }
- { id: kr_551, display: 떡, meaning: rice cake., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_552, display: 떡국, meaning: rice cake soup (New Year dish)., level: 1, category: body, source: [[body-family]] }
- { id: kr_553, display: 떡볶이, meaning: spicy rice cake (Korean street food)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_554, display: 떨다, meaning: to shake; to tremble; to shiver., level: 1, source: [[basic-vocabulary]] }
- { id: kr_555, display: 떨어지다, meaning: to fall; to drop; to separate., level: 1, source: [[basic-vocabulary]] }
- { id: kr_556, display: 뛰다, meaning: to jump; to run; to skip., level: 1, source: [[basic-vocabulary]] }
- { id: kr_557, display: 라, meaning: vocative (after vowel); quote., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_558, display: 라면, meaning: instant ramen noodles., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_559, display: 랑, meaning: and (with, casual); with., level: 1, source: [[basic-vocabulary]] }
- { id: kr_560, display: 래, meaning: ah (I heard); said., level: 1, category: body, source: [[body-family]] }
- { id: kr_561, display: 렌즈, meaning: lens., level: 1, source: [[basic-vocabulary]] }
- { id: kr_562, display: 로, meaning: to (direction particle); by (means)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_563, display: 를, meaning: object marker (after vowel)., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_564, display: 리허설, meaning: rehearsal., level: 1, category: body, source: [[body-family]] }
- { id: kr_565, display: 마, meaning: hemp., level: 1, source: [[basic-vocabulary]] }
- { id: kr_566, display: 마당, meaning: yard; courtyard., level: 1, source: [[basic-vocabulary]] }
- { id: kr_567, display: 마음, meaning: heart; mind; intention., level: 1, category: body, source: [[body-family]] }
- { id: kr_568, display: 마음이 아프다, meaning: to feel heartache., level: 1, category: body, source: [[body-family]] }
- { id: kr_569, display: 마트, meaning: mart; supermarket., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_570, display: 막걸리, meaning: makgeolli (Korean traditional rice wine)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_571, display: 만, meaning: only; just; as much as., level: 1, source: [[basic-vocabulary]] }
- { id: kr_572, display: 만나다, meaning: to meet; to encounter., level: 1, source: [[basic-vocabulary]] }
- { id: kr_573, display: 만나서 반갑습니다, meaning: Nice to meet you (formal first meeting)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_574, display: 만남, meaning: meeting; encounter., level: 1, source: [[basic-vocabulary]] }
- { id: kr_575, display: 만두, meaning: dumpling., level: 1, source: [[basic-vocabulary]] }
- { id: kr_576, display: 만족, meaning: satisfaction., level: 1, source: [[basic-vocabulary]] }
- { id: kr_577, display: 만족하다, meaning: to be satisfied., level: 1, source: [[basic-vocabulary]] }
- { id: kr_578, display: 많다, meaning: to be many; to be much., level: 1, source: [[basic-vocabulary]] }
- { id: kr_579, display: 말, meaning: horse., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_580, display: 말벌, meaning: wasp; hornet., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_581, display: 맛없다, meaning: not delicious; tasteless., level: 1, source: [[basic-vocabulary]] }
- { id: kr_582, display: 맛있다, meaning: delicious., level: 1, source: [[basic-vocabulary]] }
- { id: kr_583, display: 맛집, meaning: famous delicious restaurant., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_584, display: 맞다, meaning: to fit; to be correct., level: 1, source: [[basic-vocabulary]] }
- { id: kr_585, display: 매워요, meaning: spicy (polite form)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_586, display: 매일, meaning: every day; daily., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_587, display: 매출, meaning: sales revenue., level: 1, source: [[basic-vocabulary]] }
- { id: kr_588, display: 맥주, meaning: beer., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_589, display: 맵다, meaning: to be spicy., level: 1, source: [[basic-vocabulary]] }
- { id: kr_590, display: 맹세, meaning: vow; oath; to swear., level: 1, category: body, source: [[body-family]] }
- { id: kr_591, display: 머리, meaning: Head — 사람이나 동물의 신체 일부., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_592, display: 멀다, meaning: to be far; to be distant., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_593, display: 멀리, meaning: far away., level: 1, source: [[basic-vocabulary]] }
- { id: kr_594, display: 멋있다, meaning: 멋있다 — Cool; stylish; impressive., level: 1, source: [[basic-vocabulary]] }
- { id: kr_595, display: 메뉴, meaning: menu., level: 1, source: [[basic-vocabulary]] }
- { id: kr_596, display: 메시지, meaning: message., level: 1, source: [[basic-vocabulary]] }
- { id: kr_597, display: 며, meaning: and (connective); while (concurrent)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_598, display: 면, meaning: noodles., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_599, display: 명상, meaning: meditation., level: 1, source: [[basic-vocabulary]] }
- { id: kr_600, display: 명상가, meaning: meditator; one who meditates., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_601, display: 명절, meaning: Major holiday — 설날/추석 같은 큰 명절., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_602, display: 명주, meaning: silk (traditional Korean term)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_603, display: 모, meaning: radish (Korean); sprout., level: 1, source: [[basic-vocabulary]] }
- { id: kr_604, display: 모두, meaning: all; entirely., level: 1, source: [[basic-vocabulary]] }
- { id: kr_605, display: 모래, meaning: sand., level: 1, source: [[basic-vocabulary]] }
- { id: kr_606, display: 모자, meaning: hat; cap., level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_607, display: 모자라다, meaning: to be insufficient; to be lacking., level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_608, display: 모직물, meaning: wool fabric., level: 1, source: [[basic-vocabulary]] }
- { id: kr_609, display: 모텔, meaning: motel., level: 1, source: [[basic-vocabulary]] }
- { id: kr_610, display: 목도리, meaning: scarf; muffler., level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_611, display: 목이 말라요, meaning: I'm thirsty (polite)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_612, display: 목표, meaning: goal; target., level: 1, category: travel, source: [[여행]] }
- { id: kr_613, display: 몸, meaning: body., level: 1, category: body, source: [[body-family]] }
- { id: kr_614, display: 못, meaning: cannot; unable to., level: 1, source: [[basic-vocabulary]] }
- { id: kr_615, display: 못생겼다, meaning: ugly., level: 1, source: [[basic-vocabulary]] }
- { id: kr_616, display: 무, meaning: radish (Korean)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_617, display: 무례하다, meaning: rude; disrespectful., level: 1, source: [[basic-vocabulary]] }
- { id: kr_618, display: 무서움, meaning: scariness; fearfulness., level: 1, category: body, source: [[body-family]] }
- { id: kr_619, display: 무섭다, meaning: to be scary; to be afraid., level: 1, source: [[basic-vocabulary]] }
- { id: kr_620, display: 무지개, meaning: rainbow., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_621, display: 무책임하다, meaning: irresponsible., level: 1, source: [[basic-vocabulary]] }
- { id: kr_622, display: 묵다, meaning: to stay; to remain; to be tough (묵다), level: 1, source: [[basic-vocabulary]] }
- { id: kr_623, display: 문, meaning: door; gate., level: 1, source: [[basic-vocabulary]] }
- { id: kr_624, display: 문서, meaning: document., level: 1, source: [[basic-vocabulary]] }
- { id: kr_625, display: 문자, meaning: text message (SMS)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_626, display: 문제, meaning: problem; question., level: 1, source: [[basic-vocabulary]] }
- { id: kr_627, display: 문학, meaning: literature., level: 1, source: [[basic-vocabulary]] }
- { id: kr_628, display: 문화, meaning: culture; civilization., level: 1, source: [[basic-vocabulary]] }
- { id: kr_629, display: 물, meaning: water., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_630, display: 물고기, meaning: fish., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_631, display: 미, meaning: beauty; rice; not yet., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_632, display: 미디어, meaning: media., level: 1, source: [[basic-vocabulary]] }
- { id: kr_633, display: 미술, meaning: fine arts; art., level: 1, source: [[basic-vocabulary]] }
- { id: kr_634, display: 미술관, meaning: art museum; art gallery., level: 1, source: [[basic-vocabulary]] }
- { id: kr_635, display: 미안하다, meaning: to be sorry; to feel apologetic., level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: kr_636, display: 미워하다, meaning: to hate., level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_637, display: 미음, meaning: thin rice porridge (for sick/infant)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_638, display: 민담, meaning: folktale; folk story., level: 1, source: [[basic-vocabulary]] }
- { id: kr_639, display: 민요, meaning: folk song., level: 1, category: family, source: [[여행]] }
- { id: kr_640, display: 밀가루, meaning: flour; wheat flour., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_641, display: 밀크티, meaning: milk tea., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_642, display: 밑, meaning: bottom; base., level: 1, source: [[basic-vocabulary]] }
- { id: kr_643, display: 바, meaning: bar; target; wheel (archaic)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_644, display: 바늘, meaning: needle., level: 1, source: [[basic-vocabulary]] }
- { id: kr_645, display: 바다, meaning: sea; ocean., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_646, display: 바람, meaning: wind., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_647, display: 바로, meaning: right away; right (next to); exactly., level: 1, source: [[basic-vocabulary]] }
- { id: kr_648, display: 바빠요, meaning: busy (polite)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_649, display: 바쁘다, meaning: to be busy., level: 1, source: [[basic-vocabulary]] }
- { id: kr_650, display: 바지, meaning: pants; trousers., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_651, display: 박물관, meaning: museum., level: 1, source: [[basic-vocabulary]] }
- { id: kr_652, display: 박사, meaning: doctorate (PhD)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_653, display: 박수, meaning: applause; clapping., level: 1, source: [[basic-vocabulary]] }
- { id: kr_654, display: 박수치다, meaning: to applaud; to clap., level: 1, source: [[basic-vocabulary]] }
- { id: kr_655, display: 밖, meaning: outside; outdoors., level: 1, source: [[basic-vocabulary]] }
- { id: kr_656, display: 반가워요, meaning: glad to meet (polite casual)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_657, display: 반갑다, meaning: to be glad; to be happy to meet., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_658, display: 반갑습니다, meaning: glad to meet (formal)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_659, display: 반대, meaning: opposition; against., level: 1, source: [[basic-vocabulary]] }
- { id: kr_660, display: 반려동물, meaning: pet; companion animal., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_661, display: 반바지, meaning: shorts; short pants., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_662, display: 반성, meaning: reflection; self-examination., level: 1, source: [[basic-vocabulary]] }
- { id: kr_663, display: 반소매, meaning: short sleeves., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_664, display: 반죽, meaning: dough; batter., level: 1, source: [[basic-vocabulary]] }
- { id: kr_665, display: 반짝이다, meaning: to sparkle; to twinkle., level: 1, category: place, source: [[여행]] }
- { id: kr_666, display: 반찬, meaning: side dish (Korean)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_667, display: 반품, meaning: return (of product); to return a product., level: 1, source: [[basic-vocabulary]] }
- { id: kr_668, display: 받는 사람, meaning: recipient., level: 1, category: body, source: [[body-family]] }
- { id: kr_669, display: 받다, meaning: to receive., level: 1, source: [[basic-vocabulary]] }
- { id: kr_670, display: 발, meaning: Foot — 다리의 끝부분., level: 1, category: body, source: [[body-family]] }
- { id: kr_671, display: 발言, meaning: speech; statement (in meeting)., level: 1, category: body, source: [[body-family]] }
- { id: kr_672, display: 발표, meaning: presentation., level: 1, category: body, source: [[body-family]] }
- { id: kr_673, display: 발표자, meaning: presenter., level: 1, category: body, source: [[body-family]] }
- { id: kr_674, display: 밝다, meaning: bright; cheerful (personality)., level: 1, category: family, source: [[여행]] }
- { id: kr_675, display: 밝은, meaning: bright (modifier)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_676, display: 밤, meaning: night; chestnut., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_677, display: 밥 먹었어요?, meaning: Have you eaten? (common Korean greeting)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_678, display: 밥, meaning: rice (cooked); meal., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_679, display: 방, meaning: room; side; method; square., level: 1, source: [[basic-vocabulary]] }
- { id: kr_680, display: 방문, meaning: visit; to visit., level: 1, source: [[basic-vocabulary]] }
- { id: kr_681, display: 방송, meaning: broadcast; to broadcast., level: 1, source: [[basic-vocabulary]] }
- { id: kr_682, display: 밭, meaning: field (cultivated)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_683, display: 배, meaning: Stomach / belly — 복부., level: 1, source: [[basic-vocabulary]] }
- { id: kr_684, display: 배고파요, meaning: I'm hungry (polite)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_685, display: 배달, meaning: delivery., level: 1, source: [[basic-vocabulary]] }
- { id: kr_686, display: 배부르다, meaning: full (from eating)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_687, display: 배우다, meaning: to learn; to act (in a play)., level: 1, category: body, source: [[body-family]] }
- { id: kr_688, display: 배짱이 두둡다, meaning: thick-skinned; bold., level: 1, category: body, source: [[body-family]] }
- { id: kr_689, display: 백, meaning: hundred (100), level: 1, category: color, source: [[basic-vocabulary]] }
- { id: kr_690, display: 백화점, meaning: department store., level: 1, category: place, source: [[여행]] }
- { id: kr_691, display: 뱀, meaning: snake., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_692, display: 버스, meaning: bus., level: 1, source: [[basic-vocabulary]] }
- { id: kr_693, display: 버터, meaning: butter., level: 1, source: [[basic-vocabulary]] }
- { id: kr_694, display: 벅찰, meaning: overwhelmed (emotionally)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_695, display: 번, meaning: time(s); turn; number., level: 1, source: [[basic-vocabulary]] }
- { id: kr_696, display: 벌, meaning: bee., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_697, display: 법, meaning: law; method; rule., level: 1, source: [[basic-vocabulary]] }
- { id: kr_698, display: 법률, meaning: law (formal)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_699, display: 벗, meaning: friend (literary/classical)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_700, display: 벗다, meaning: to take off (clothes/shoes)., level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_701, display: 베개, meaning: pillow., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_702, display: 벼, meaning: rice plant; unhusked rice., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_703, display: 변, meaning: change; convenience; side., level: 1, source: [[basic-vocabulary]] }
- { id: kr_704, display: 변덕스럽다, meaning: fickle; capricious., level: 1, source: [[basic-vocabulary]] }
- { id: kr_705, display: 별, meaning: star., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_706, display: 병원, meaning: Hospital — 의료 시설., level: 1, source: [[basic-vocabulary]] }
- { id: kr_707, display: 보고 싶다, meaning: I miss you (want to see)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_708, display: 보고서, meaning: report (document)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_709, display: 보내다, meaning: to send., level: 1, source: [[basic-vocabulary]] }
- { id: kr_710, display: 보낸 사람, meaning: sender., level: 1, source: [[basic-vocabulary]] }
- { id: kr_711, display: 보도, meaning: sidewalk; report; press., level: 1, source: [[basic-vocabulary]] }
- { id: kr_712, display: 보리차, meaning: barley tea., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_713, display: 보육원, meaning: childcare center., level: 1, category: family, source: [[여행]] }
- { id: kr_714, display: 보통, meaning: usual; ordinary; typically., level: 1, source: [[basic-vocabulary]] }
- { id: kr_715, display: 볶음밥, meaning: fried rice., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_716, display: 본문, meaning: body (of email/document)., level: 1, category: body, source: [[body-family]] }
- { id: kr_717, display: 봄, meaning: spring., level: 1, category: time, source: [[자연・날씨 어휘]] }
- { id: kr_718, display: 부동산, meaning: real estate., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_719, display: 부러움, meaning: envy; jealousy (mild)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_720, display: 부러워하다, meaning: to envy., level: 1, source: [[basic-vocabulary]] }
- { id: kr_721, display: 부럽다, meaning: to be envious., level: 1, source: [[basic-vocabulary]] }
- { id: kr_722, display: 부산, meaning: Busan (Korean city)., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_723, display: 부엌, meaning: kitchen., level: 1, source: [[basic-vocabulary]] }
- { id: kr_724, display: 부족, meaning: tribe; insufficient; to lack., level: 1, source: [[basic-vocabulary]] }
- { id: kr_725, display: 부지런하다, meaning: to be diligent., level: 1, source: [[basic-vocabulary]] }
- { id: kr_726, display: 부터, meaning: from; since; starting from., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_727, display: 부하, meaning: subordinate., level: 1, source: [[basic-vocabulary]] }
- { id: kr_728, display: 북한, meaning: North Korea., level: 1, source: [[basic-vocabulary]] }
- { id: kr_729, display: 분노, meaning: rage; indignation., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_730, display: 분리되다, meaning: to be separated; to be divided., level: 1, source: [[basic-vocabulary]] }
- { id: kr_731, display: 분식, meaning: Korean snack food; snack bar., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_732, display: 분하다, meaning: to be indignant; to feel wronged., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_733, display: 분할 납부, meaning: installment payment., level: 1, source: [[basic-vocabulary]] }
- { id: kr_734, display: 불고기, meaning: bulgogi (Korean grilled beef)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_735, display: 불만, meaning: dissatisfaction; complaint., level: 1, source: [[basic-vocabulary]] }
- { id: kr_736, display: 불안, meaning: anxiety; uneasiness., level: 1, source: [[basic-vocabulary]] }
- { id: kr_737, display: 불안해하다, meaning: to feel anxious., level: 1, source: [[basic-vocabulary]] }
- { id: kr_738, display: 불친절하다, meaning: unkind., level: 1, source: [[basic-vocabulary]] }
- { id: kr_739, display: 불편하다, meaning: to be uncomfortable., level: 1, source: [[basic-vocabulary]] }
- { id: kr_740, display: 불행하다, meaning: to be unhappy; to be miserable., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_741, display: 비, meaning: rain., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_742, display: 비단, meaning: silk (traditional Korean)., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_743, display: 비밀번호, meaning: Password — 시스템 접근을 위한 인증 코드., level: 1, category: body, source: [[body-family]] }
- { id: kr_744, display: 비빔밥, meaning: bibimbap (mixed rice)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_745, display: 비싸다, meaning: to be expensive., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_746, display: 비싼, meaning: expensive (modifier)., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_747, display: 비용, meaning: cost; expense., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_748, display: 비자, meaning: visa., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_749, display: 비즈니스, meaning: business., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_750, display: 비참하다, meaning: miserable; wretched., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_751, display: 비행기, meaning: airplane., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_752, display: 비행하다, meaning: to fly (formal)., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_753, display: 빈대떡, meaning: mung bean pancake (Korean)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_754, display: 빛, meaning: light; ray., level: 1, source: [[basic-vocabulary]] }
- { id: kr_755, display: 빛나다, meaning: to shine; to be brilliant., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_756, display: 빠른, meaning: fast; quick (modifier form)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_757, display: 빨간 드레스, meaning: red dress., level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_758, display: 빨간, meaning: red (modifier form)., level: 1, category: color, source: [[basic-vocabulary]] }
- { id: kr_759, display: 빨강, meaning: red (noun form)., level: 1, category: color, source: [[basic-vocabulary]] }
- { id: kr_760, display: 빨다, meaning: to wash (laundry); to suck., level: 1, source: [[basic-vocabulary]] }
- { id: kr_761, display: 빨래, meaning: laundry (to wash)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_762, display: 빨래방, meaning: laundromat., level: 1, source: [[basic-vocabulary]] }
- { id: kr_763, display: 빵, meaning: bread., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_764, display: 뿌리, meaning: root., level: 1, source: [[basic-vocabulary]] }
- { id: kr_765, display: 사과하다, meaning: to apologize., level: 1, source: [[basic-vocabulary]] }
- { id: kr_766, display: 사귀다, meaning: 사귀다 — To date; to go out with (romantic)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_767, display: 사냥꾼, meaning: hunter., level: 1, source: [[basic-vocabulary]] }
- { id: kr_768, display: 사냥하다, meaning: to hunt., level: 1, source: [[basic-vocabulary]] }
- { id: kr_769, display: 사다, meaning: to buy., level: 1, source: [[basic-vocabulary]] }
- { id: kr_770, display: 사람, meaning: person; people., level: 1, category: family, source: [[여행]] }
- { id: kr_771, display: 사람들, meaning: people (plural)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_772, display: 사랑, meaning: love., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_773, display: 사랑하다, meaning: 사랑하다 — To love., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_774, display: 사막, meaning: desert., level: 1, source: [[basic-vocabulary]] }
- { id: kr_775, display: 사무실, meaning: office., level: 1, source: [[basic-vocabulary]] }
- { id: kr_776, display: 사상, meaning: thought; ideology., level: 1, source: [[basic-vocabulary]] }
- { id: kr_777, display: 사색, meaning: contemplation; meditation., level: 1, source: [[basic-vocabulary]] }
- { id: kr_778, display: 사슴, meaning: deer., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_779, display: 사업, meaning: business; enterprise., level: 1, source: [[basic-vocabulary]] }
- { id: kr_780, display: 사이다, meaning: cider (Korean soda)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_781, display: 사자, meaning: lion., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_782, display: 사정, meaning: circumstances; situation., level: 1, source: [[basic-vocabulary]] }
- { id: kr_783, display: 사진, meaning: photo; picture., level: 1, source: [[basic-vocabulary]] }
- { id: kr_784, display: 사찰, meaning: Buddhist temple., level: 1, source: [[basic-vocabulary]] }
- { id: kr_785, display: 사회, meaning: society; social., level: 1, source: [[basic-vocabulary]] }
- { id: kr_786, display: 삭제, meaning: delete; erase., level: 1, source: [[basic-vocabulary]] }
- { id: kr_787, display: 산, meaning: mountain., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_788, display: 산림, meaning: forest; forestry (formal)., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_789, display: 산책, meaning: walk; stroll; to take a walk., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_790, display: 삼겹살, meaning: pork belly (grilled)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_791, display: 삼성, meaning: Samsung (company)., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_792, display: 상사, meaning: superior; boss., level: 1, source: [[basic-vocabulary]] }
- { id: kr_793, display: 상어, meaning: shark., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_794, display: 상점, meaning: store (formal)., level: 1, category: place, source: [[여행]] }
- { id: kr_795, display: 상황, meaning: situation; circumstances., level: 1, source: [[basic-vocabulary]] }
- { id: kr_796, display: 새, meaning: bird., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_797, display: 새로운, meaning: new (modifier)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_798, display: 새롭다, meaning: to be new., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_799, display: 샘, meaning: spring (water source); sample., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_800, display: 생, meaning: life; student; raw., level: 1, source: [[basic-vocabulary]] }
- { id: kr_801, display: 생각, meaning: thought; idea; to think., level: 1, source: [[basic-vocabulary]] }
- { id: kr_802, display: 생선, meaning: fish., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_803, display: 생일, meaning: Birthday — 태어난 날의 기념일., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_804, display: 생태, meaning: ecology; ecosystem., level: 1, source: [[basic-vocabulary]] }
- { id: kr_805, display: 생활, meaning: life; living; daily life., level: 1, source: [[basic-vocabulary]] }
- { id: kr_806, display: 서, meaning: at (location of action); from., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_807, display: 서글프다, meaning: slightly sad; sorrowful., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_808, display: 서다, meaning: to stand; to stop., level: 1, source: [[basic-vocabulary]] }
- { id: kr_809, display: 서비스, meaning: service (extra)., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_810, display: 서울, meaning: Seoul (capital of Korea)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_811, display: 서적, meaning: books; publications (literary)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_812, display: 석, meaning: stone; limit; calculation., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_813, display: 석사, meaning: master's degree., level: 1, source: [[basic-vocabulary]] }
- { id: kr_814, display: 선물, meaning: Gift / present., level: 1, source: [[basic-vocabulary]] }
- { id: kr_815, display: 선생님, meaning: teacher (honorific); doctor., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_816, display: 설날, meaning: Lunar New Year — 음력 1월 1일 한국 명절., level: 1, category: body, source: [[body-family]] }
- { id: kr_817, display: 설레다, meaning: to flutter; to feel excited., level: 1, source: [[basic-vocabulary]] }
- { id: kr_818, display: 설렘, meaning: flutter; excitement (anticipation)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_819, display: 설명, meaning: explanation., level: 1, source: [[basic-vocabulary]] }
- { id: kr_820, display: 설명하다, meaning: to explain., level: 1, source: [[basic-vocabulary]] }
- { id: kr_821, display: 설탕, meaning: sugar., level: 1, source: [[basic-vocabulary]] }
- { id: kr_822, display: 섬, meaning: island., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_823, display: 섭섭하다, meaning: to feel hurt., level: 1, source: [[basic-vocabulary]] }
- { id: kr_824, display: 섭섭함, meaning: hurt feeling; sense of disappointment., level: 1, source: [[basic-vocabulary]] }
- { id: kr_825, display: 성과, meaning: performance; result., level: 1, source: [[basic-vocabulary]] }
- { id: kr_826, display: 성급하다, meaning: hasty; impatient., level: 1, source: [[basic-vocabulary]] }
- { id: kr_827, display: 성실하다, meaning: diligent; sincere., level: 1, source: [[basic-vocabulary]] }
- { id: kr_828, display: 성장하다, meaning: to grow; to develop., level: 1, source: [[basic-vocabulary]] }
- { id: kr_829, display: 성찰, meaning: introspection; reflection., level: 1, source: [[basic-vocabulary]] }
- { id: kr_830, display: 세, meaning: three (native Korean); world., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_831, display: 세계, meaning: world., level: 1, source: [[basic-vocabulary]] }
- { id: kr_832, display: 세관, meaning: customs., level: 1, source: [[basic-vocabulary]] }
- { id: kr_833, display: 세금, meaning: tax., level: 1, source: [[basic-vocabulary]] }
- { id: kr_834, display: 세배, meaning: Sebae — 설날에 어른에게 하는 인사., level: 1, source: [[basic-vocabulary]] }
- { id: kr_835, display: 세번째, meaning: third., level: 1, source: [[basic-vocabulary]] }
- { id: kr_836, display: 세탁소, meaning: dry cleaner., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_837, display: 세탁하다, meaning: to wash (laundry)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_838, display: 셋, meaning: three (native Korean)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_839, display: 셔츠, meaning: shirt., level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_840, display: 소, meaning: cow; cattle; ox., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_841, display: 소금, meaning: salt., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_842, display: 소문춘당, meaning: Sowon Chundang (Han Seung-joon short story)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_843, display: 소설, meaning: novel; fiction., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_844, display: 소설가, meaning: novelist., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_845, display: 소수, meaning: minority; small number., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_846, display: 소주, meaning: soju (Korean spirits)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_847, display: 소풍, meaning: leisure trip; outing., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_848, display: 속, meaning: inside; interior., level: 1, source: [[basic-vocabulary]] }
- { id: kr_849, display: 속상하다, meaning: to be hurt (feelings)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_850, display: 손, meaning: Hand — 팔의 끝부분., level: 1, category: body, source: [[body-family]] }
- { id: kr_851, display: 손실, meaning: loss; damage., level: 1, category: body, source: [[body-family]] }
- { id: kr_852, display: 송편, meaning: songpyeon (half-moon rice cake)., level: 1, category: family, source: [[여행]] }
- { id: kr_853, display: 쇼핑, meaning: shopping; to shop., level: 1, category: place, source: [[여행]] }
- { id: kr_854, display: 쇼핑몰, meaning: shopping mall., level: 1, category: place, source: [[여행]] }
- { id: kr_855, display: 수, meaning: number; hand; water; tree., level: 1, category: body, source: [[body-family]] }
- { id: kr_856, display: 수고하세요, meaning: You have worked hard (greeting, casual)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_857, display: 수돗물, meaning: tap water., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_858, display: 수면, meaning: sleep (formal); water surface., level: 1, category: body, source: [[body-family]] }
- { id: kr_859, display: 수업, meaning: class; lesson., level: 1, category: family, source: [[여행]] }
- { id: kr_860, display: 수영, meaning: Swimming — 물에서 하는 운동., level: 1, source: [[basic-vocabulary]] }
- { id: kr_861, display: 수익, meaning: revenue; earnings., level: 1, category: body, source: [[body-family]] }
- { id: kr_862, display: 수입, meaning: income; revenue., level: 1, category: body, source: [[body-family]] }
- { id: kr_863, display: 수학, meaning: mathematics; math., level: 1, source: [[basic-vocabulary]] }
- { id: kr_864, display: 숙모, meaning: aunt (general, married)., level: 1, category: family, source: [[여행]] }
- { id: kr_865, display: 숙박, meaning: lodging; to lodge., level: 1, source: [[basic-vocabulary]] }
- { id: kr_866, display: 순대, meaning: Korean blood sausage., level: 1, source: [[basic-vocabulary]] }
- { id: kr_867, display: 순두부찌개, meaning: soft tofu stew., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_868, display: 순수, meaning: purity., level: 1, source: [[basic-vocabulary]] }
- { id: kr_869, display: 순수하다, meaning: pure; innocent., level: 1, source: [[basic-vocabulary]] }
- { id: kr_870, display: 순진하다, meaning: to be naive; to be innocent., level: 1, source: [[basic-vocabulary]] }
- { id: kr_871, display: 숫자, meaning: digit; numeral., level: 1, source: [[basic-vocabulary]] }
- { id: kr_872, display: 숲, meaning: forest; woods., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_873, display: 쉬다, meaning: to rest; to take a break., level: 1, source: [[basic-vocabulary]] }
- { id: kr_874, display: 스님, meaning: Buddhist monk (honorific)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_875, display: 스마트폰, meaning: Smartphone — 휴대 가능한 다기능 컴퓨터., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_876, display: 스커트, meaning: skirt., level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_877, display: 스포츠, meaning: Sports — 운동 경기., level: 1, source: [[basic-vocabulary]] }
- { id: kr_878, display: 슬라이드, meaning: slide., level: 1, source: [[basic-vocabulary]] }
- { id: kr_879, display: 슬프다, meaning: to be sad., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_880, display: 슬픔, meaning: sadness., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_881, display: 습하다, meaning: to be humid., level: 1, source: [[basic-vocabulary]] }
- { id: kr_882, display: 승려, meaning: Buddhist monk (formal)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_883, display: 승인, meaning: approval., level: 1, source: [[basic-vocabulary]] }
- { id: kr_884, display: 승인하다, meaning: to approve., level: 1, source: [[basic-vocabulary]] }
- { id: kr_885, display: 승차, meaning: boarding (vehicle, formal); to board a vehicle., level: 1, source: [[basic-vocabulary]] }
- { id: kr_886, display: 시, meaning: city (poetic/literary); poem., level: 1, category: place, source: [[여행]] }
- { id: kr_887, display: 시간, meaning: time., level: 1, source: [[basic-vocabulary]] }
- { id: kr_888, display: 시골, meaning: countryside; rural area., level: 1, category: place, source: [[여행]] }
- { id: kr_889, display: 시기하다, meaning: to be jealous (formal)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_890, display: 시다, meaning: sour., level: 1, source: [[basic-vocabulary]] }
- { id: kr_891, display: 시들다, meaning: to wilt; to wither., level: 1, source: [[basic-vocabulary]] }
- { id: kr_892, display: 시민, meaning: citizen (of a city)., level: 1, category: place, source: [[여행]] }
- { id: kr_893, display: 시장, meaning: market; marketplace., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_894, display: 시험, meaning: test; exam., level: 1, source: [[basic-vocabulary]] }
- { id: kr_895, display: 식당, meaning: restaurant; eatery., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_896, display: 식물원, meaning: botanical garden., level: 1, source: [[basic-vocabulary]] }
- { id: kr_897, display: 식사, meaning: meal (formal)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_898, display: 식수, meaning: drinking water (formal)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_899, display: 식용, meaning: edible; for food., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_900, display: 식초, meaning: vinegar., level: 1, source: [[basic-vocabulary]] }
- { id: kr_901, display: 신고, meaning: report; filing., level: 1, source: [[basic-vocabulary]] }
- { id: kr_902, display: 신고하다, meaning: to file; to report (officially)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_903, display: 신문, meaning: newspaper., level: 1, source: [[basic-vocabulary]] }
- { id: kr_904, display: 신분증, meaning: ID; identification., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_905, display: 신사, meaning: gentleman; shrine (신사), level: 1, source: [[basic-vocabulary]] }
- { id: kr_906, display: 신속하다, meaning: to be rapid; to be swift., level: 1, source: [[basic-vocabulary]] }
- { id: kr_907, display: 신청, meaning: application; request., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_908, display: 신체, meaning: body (physical, formal)., level: 1, category: body, source: [[body-family]] }
- { id: kr_909, display: 신칸센, meaning: Shinkansen (신칸센), level: 1, source: [[basic-vocabulary]] }
- { id: kr_910, display: 신화, meaning: myth; mythology., level: 1, source: [[basic-vocabulary]] }
- { id: kr_911, display: 실, meaning: thread; string., level: 1, source: [[basic-vocabulary]] }
- { id: kr_912, display: 실크, meaning: silk., level: 1, source: [[basic-vocabulary]] }
- { id: kr_913, display: 싫다, meaning: to dislike., level: 1, source: [[basic-vocabulary]] }
- { id: kr_914, display: 싫어, meaning: dislike; no (casual)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_915, display: 싫어하다, meaning: to dislike; to hate., level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_916, display: 싫어해요, meaning: I dislike it (polite)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_917, display: 싫음, meaning: dislike; aversion., level: 1, source: [[basic-vocabulary]] }
- { id: kr_918, display: 심장, meaning: heart (organ)., level: 1, category: body, source: [[body-family]] }
- { id: kr_919, display: 싸다, meaning: to be cheap., level: 1, source: [[basic-vocabulary]] }
- { id: kr_920, display: 쌀, meaning: rice (uncooked)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_921, display: 썸 문화, meaning: some (dating) culture., level: 1, source: [[basic-vocabulary]] }
- { id: kr_922, display: 썸, meaning: 썸 (some) — Pre-relationship flirting; the "are we dating?" s, level: 1, source: [[basic-vocabulary]] }
- { id: kr_923, display: 쓰다, meaning: bitter., level: 1, source: [[basic-vocabulary]] }
- { id: kr_924, display: 아, meaning: hey (vocative, after consonant); informal ending., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_925, display: 아기, meaning: baby; infant., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_926, display: 아니, meaning: no (casual)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_927, display: 아니오, meaning: no (formal written)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_928, display: 아니요, meaning: no., level: 1, source: [[basic-vocabulary]] }
- { id: kr_929, display: 아래, meaning: below; lower; bottom., level: 1, source: [[basic-vocabulary]] }
- { id: kr_930, display: 아름다운, meaning: beautiful (modifier)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_931, display: 아름다움, meaning: beauty., level: 1, source: [[basic-vocabulary]] }
- { id: kr_932, display: 아름답다, meaning: to be beautiful., level: 1, source: [[basic-vocabulary]] }
- { id: kr_933, display: 아이, meaning: child; kid., level: 1, category: family, source: [[여행]] }
- { id: kr_934, display: 아이폰, meaning: iPhone (Apple)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_935, display: 아침, meaning: morning; breakfast., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_936, display: 아파트, meaning: apartment., level: 1, source: [[basic-vocabulary]] }
- { id: kr_937, display: 아프다, meaning: to hurt; to be painful., level: 1, source: [[basic-vocabulary]] }
- { id: kr_938, display: 아홉, meaning: nine (native Korean)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_939, display: 아홉번째, meaning: ninth., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_940, display: 악기, meaning: musical instrument., level: 1, source: [[basic-vocabulary]] }
- { id: kr_941, display: 안 맞다, meaning: to not fit; to be incorrect., level: 1, source: [[basic-vocabulary]] }
- { id: kr_942, display: 안, meaning: inside (basic); not (negator)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_943, display: 안_1, meaning: inside; not., level: 1, source: [[basic-vocabulary]] }
- { id: kr_944, display: 안_2, meaning: peace; safety., level: 1, source: [[basic-vocabulary]] }
- { id: kr_945, display: 안개, meaning: fog; mist., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_946, display: 안건, meaning: agenda., level: 1, source: [[basic-vocabulary]] }
- { id: kr_947, display: 안경, meaning: glasses; spectacles., level: 1, source: [[basic-vocabulary]] }
- { id: kr_948, display: 안내, meaning: guidance; information., level: 1, source: [[basic-vocabulary]] }
- { id: kr_949, display: 안내하다, meaning: to guide; to inform., level: 1, source: [[basic-vocabulary]] }
- { id: kr_950, display: 안녕, meaning: hi; hello; goodbye (casual)., level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: kr_951, display: 안녕하다, meaning: to be peaceful; to be well., level: 1, source: [[basic-vocabulary]] }
- { id: kr_952, display: 안녕하세요, meaning: hello (polite)., level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: kr_953, display: 안됐다, meaning: too bad; that's unfortunate., level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_954, display: 안드로이드, meaning: Android (operating system)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_955, display: 안부, meaning: well-being; regards., level: 1, source: [[basic-vocabulary]] }
- { id: kr_956, display: 안심, meaning: relief; peace of mind., level: 1, source: [[basic-vocabulary]] }
- { id: kr_957, display: 안전, meaning: safety., level: 1, source: [[basic-vocabulary]] }
- { id: kr_958, display: 안전하다, meaning: to be safe., level: 1, source: [[basic-vocabulary]] }
- { id: kr_959, display: 안정, meaning: stability., level: 1, source: [[basic-vocabulary]] }
- { id: kr_960, display: 안정되다, meaning: to be stable., level: 1, source: [[basic-vocabulary]] }
- { id: kr_961, display: 앉다, meaning: to sit; to sit down., level: 1, source: [[basic-vocabulary]] }
- { id: kr_962, display: 알았어, meaning: got it (casual)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_963, display: 애, meaning: baby; child (affectionate)., level: 1, category: family, source: [[여행]] }
- { id: kr_964, display: 애완동물, meaning: pet (traditional term)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_965, display: 앱, meaning: App — 모바일 애플리케이션., level: 1, source: [[basic-vocabulary]] }
- { id: kr_966, display: 야, meaning: vocative; hey; as for (casual)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_967, display: 야구, meaning: Baseball., level: 1, source: [[basic-vocabulary]] }
- { id: kr_968, display: 야생, meaning: wild (nature)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_969, display: 야생의, meaning: wild (as in nature)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_970, display: 야속하다, meaning: cold/heartless; disappointing., level: 1, category: body, source: [[body-family]] }
- { id: kr_971, display: 야수, meaning: wild beast; monster (figurative)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_972, display: 야옹, meaning: meow (cat sound)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_973, display: 야채, meaning: vegetables., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_974, display: 약, meaning: Medicine / drug — 질병 치료 물질., level: 1, source: [[basic-vocabulary]] }
- { id: kr_975, display: 약도, meaning: rough map; sketch., level: 1, source: [[basic-vocabulary]] }
- { id: kr_976, display: 약속, meaning: appointment; promise., level: 1, source: [[basic-vocabulary]] }
- { id: kr_977, display: 얄미워하다, meaning: to be annoying; to find repulsive., level: 1, source: [[basic-vocabulary]] }
- { id: kr_978, display: 양, meaning: sheep., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_979, display: 양말, meaning: socks., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_980, display: 양모, meaning: wool., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_981, display: 양산, meaning: parasol., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_982, display: 양육, meaning: nurturing; childcare., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_983, display: 어, meaning: fish; fishing; (prefix)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_984, display: 어두운, meaning: dark (modifier)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_985, display: 어둡다, meaning: to be dark., level: 1, source: [[basic-vocabulary]] }
- { id: kr_986, display: 어렵다, meaning: to be difficult., level: 1, source: [[basic-vocabulary]] }
- { id: kr_987, display: 어린이집, meaning: daycare center., level: 1, category: place, source: [[여행]] }
- { id: kr_988, display: 어묵, meaning: fish cake., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_989, display: 어색하다, meaning: to be awkward., level: 1, source: [[basic-vocabulary]] }
- { id: kr_990, display: 어색함, meaning: awkwardness., level: 1, source: [[basic-vocabulary]] }
- { id: kr_991, display: 어울리다, meaning: to fit; to get along., level: 1, source: [[basic-vocabulary]] }
- { id: kr_992, display: 어울리지 않다, meaning: to not get along; to not fit., level: 1, source: [[basic-vocabulary]] }
- { id: kr_993, display: 어제, meaning: yesterday., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_994, display: 억울하다, meaning: to feel wronged; to feel unjust., level: 1, source: [[basic-vocabulary]] }
- { id: kr_995, display: 언덕, meaning: hill; slope., level: 1, source: [[basic-vocabulary]] }
- { id: kr_996, display: 언론, meaning: press; journalism., level: 1, source: [[basic-vocabulary]] }
- { id: kr_997, display: 얼굴, meaning: face., level: 1, category: body, source: [[body-family]] }
- { id: kr_998, display: 얼다, meaning: to freeze; to be frozen., level: 1, source: [[basic-vocabulary]] }
- { id: kr_999, display: 얼음, meaning: ice., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1000, display: 업무, meaning: work; tasks; business., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1001, display: 에, meaning: to (location particle); at., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1002, display: 에게, meaning: to (person); for., level: 1, category: family, source: [[여행]] }
- { id: kr_1003, display: 에서, meaning: at; in (static location)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1004, display: 엘지, meaning: LG (company)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1005, display: 여, meaning: informal polite ending (after vowel)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1006, display: 여가, meaning: leisure time; hobby activities., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1007, display: 여관, meaning: inn; guesthouse., level: 1, category: place, source: [[여행]] }
- { id: kr_1008, display: 여권 발급, meaning: passport issuance., level: 1, category: body, source: [[body-family]] }
- { id: kr_1009, display: 여권, meaning: A government-issued document that identifies you as a citize, level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_1010, display: 여덟, meaning: eight (native Korean)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1011, display: 여덟번째, meaning: eighth., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1012, display: 여름, meaning: summer., level: 1, category: time, source: [[자연・날씨 어휘]] }
- { id: kr_1013, display: 여섯, meaning: six (native Korean)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1014, display: 여섯번째, meaning: sixth., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1015, display: 여성, meaning: woman (formal)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1016, display: 여우, meaning: fox., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1017, display: 여유, meaning: leisure; margin;余裕., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_1018, display: 여자, meaning: woman; female., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1019, display: 여자친구, meaning: girlfriend., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1020, display: 여행, meaning: travel; trip; to travel., level: 1, category: travel, source: [[여행]] }
- { id: kr_1021, display: 역, meaning: station., level: 1, category: place, source: [[여행]] }
- { id: kr_1022, display: 연결, meaning: connection (phone)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1023, display: 연기, meaning: postponement; delay., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1024, display: 연도, meaning: year (specific)., level: 1, category: body, source: [[body-family]] }
- { id: kr_1025, display: 연습, meaning: practice., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1026, display: 연애, meaning: romantic love; dating., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1027, display: 연인, meaning: 연인 — Romantic partner; lover., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1028, display: 열, meaning: Fever / heat — 체온 상승., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1029, display: 열공, meaning: hard study/work., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1030, display: 열공하세요, meaning: Keep studying hard (encouraging)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1031, display: 열두번째, meaning: twelfth (ordinal)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1032, display: 열번째, meaning: tenth., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1033, display: 열세번째, meaning: thirteenth (ordinal)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1034, display: 열한번째, meaning: eleventh., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1035, display: 염려하다, meaning: to be concerned; to worry., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1036, display: 염소, meaning: goat., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1037, display: 영, meaning: zero (archaic); spirit; glory., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1038, display: 영수증, meaning: receipt., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1039, display: 영화, meaning: Movie / film., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1040, display: 옆, meaning: side; next to., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1041, display: 예매, meaning: advance booking; to book in advance., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1042, display: 예쁘다, meaning: 예쁘다 — Pretty; beautiful., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1043, display: 예산, meaning: budget., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_1044, display: 예술, meaning: art., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1045, display: 예약, meaning: reservation; to reserve., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1046, display: 예의 바르다, meaning: to be well-mannered., level: 1, category: color, source: [[basic-vocabulary]] }
- { id: kr_1047, display: 예의 없다, meaning: to be impolite., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1048, display: 오늘 날씨가 좋아요, meaning: The weather is good today., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1049, display: 오늘 잘 부탁드립니다, meaning: Please take care of me today (first meeting)., level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: kr_1050, display: 오늘, meaning: today., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_1051, display: 오다, meaning: to come., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1052, display: 오래된, meaning: old; long-time (modifier)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1053, display: 오른쪽, meaning: right (direction)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1054, display: 오리, meaning: duck., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1055, display: 옥수수차, meaning: corn tea (Korean roasted corn tea)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1056, display: 옹졸하다, meaning: petty; narrow-minded., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1057, display: 와, meaning: and (with); with., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1058, display: 와이파이, meaning: WiFi — 무선 인터넷 연결., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1059, display: 왼쪽, meaning: left (direction)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1060, display: 요, meaning: polite sentence ending., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1061, display: 요가, meaning: Yoga — 몸과 마음을 단련하는 운동., level: 1, category: body, source: [[body-family]] }
- { id: kr_1062, display: 요금, meaning: fee; charge., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1063, display: 요리, meaning: cooking; cuisine; dish., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1064, display: 요약, meaning: summary., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_1065, display: 요일, meaning: day of the week., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_1066, display: 욕심 많다, meaning: greedy., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1067, display: 욕심, meaning: greed; desire., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1068, display: 용감하다, meaning: to be courageous; to be brave., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1069, display: 우산, meaning: umbrella., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_1070, display: 우울증, meaning: depression (clinical)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1071, display: 우울하다, meaning: to be depressed., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1072, display: 우유, meaning: milk., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1073, display: 우주, meaning: space; universe., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1074, display: 우회전, meaning: right turn., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1075, display: 운동, meaning: exercise; to exercise., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1076, display: 운동화, meaning: sneakers; athletic shoes., level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_1077, display: 울다, meaning: to cry; to weep., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_1078, display: 울적하다, meaning: melancholic; depressed., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1079, display: 원룸, meaning: studio apartment (one-room)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1080, display: 원숭이, meaning: monkey., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1081, display: 웹사이트, meaning: Website — 인터넷에서 제공하는 정보 페이지., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1082, display: 위, meaning: stomach., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1083, display: 위_0, meaning: top; above., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1084, display: 위쪽, meaning: top; upper side., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1085, display: 위치, meaning: location; position., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1086, display: 위험, meaning: danger; risk., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1087, display: 위험하다, meaning: to be dangerous., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1088, display: 윗, meaning: upper; above (modifier)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1089, display: 유감스럽다, meaning: to be regrettable., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1090, display: 유자차, meaning: citron tea., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1091, display: 유치원, meaning: kindergarten., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1092, display: 으로, meaning: to (direction); by (means)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1093, display: 은, meaning: topic marker (after consonant); silver., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1094, display: 은하, meaning: galaxy; Milky Way., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1095, display: 은행, meaning: bank., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1096, display: 은혜, meaning: grace; blessing., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1097, display: 을, meaning: object marker (after consonant)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1098, display: 음료, meaning: beverage; drink., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1099, display: 음식, meaning: food; cuisine., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1100, display: 음악, meaning: Music., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1101, display: 응원, meaning: cheering; support., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1102, display: 의, meaning: of; 's (genitive marker)., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_1103, display: 의견, meaning: opinion., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1104, display: 의문, meaning: question; doubt., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1105, display: 의사, meaning: Doctor — 의학 전문가., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1106, display: 이, meaning: subject marker; this., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_1107, display: 이기주의, meaning: egoism; selfishness., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1108, display: 이랑, meaning: and (with, casual); with., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1109, display: 이름, meaning: 이름 — A word by which a person is known., level: 1, category: family, source: [[여행]] }
- { id: kr_1110, display: 이메일, meaning: Email — 전자 우편., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1111, display: 이모, meaning: aunt (maternal)., level: 1, category: family, source: [[여행]] }
- { id: kr_1112, display: 이민, meaning: immigration; to immigrate., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1113, display: 이별, meaning: parting; farewell., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1114, display: 이쁘다, meaning: 예쁘다 (구어체) — Pretty (colloquial spelling)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1115, display: 이익, meaning: profit; benefit., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1116, display: 이자, meaning: interest (financial)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1117, display: 이타심, meaning: altruism; selfless mind., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1118, display: 이타적이다, meaning: to be altruistic., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1119, display: 이해하다, meaning: to understand; to comprehend., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1120, display: 인간, meaning: human being (literary)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1121, display: 인류, meaning: humanity; humankind., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1122, display: 인사, meaning: greeting; salutation., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1123, display: 인생, meaning: life (entire)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1124, display: 인터넷, meaning: Internet — 전 세계 컴퓨터 네트워크., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1125, display: 일, meaning: day; work; matter., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_1126, display: 일곱, meaning: seven (native Korean)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1127, display: 일곱번째, meaning: seventh., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1128, display: 일관성 있다, meaning: to be consistent., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1129, display: 일상, meaning: everyday; daily life., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_1130, display: 일생, meaning: lifetime; entire life., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1131, display: 일어, meaning: standing (up); rise., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1132, display: 일어나다, meaning: to wake up; to happen., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1133, display: 일정, meaning: schedule; itinerary., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1134, display: 일하다, meaning: to work., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1135, display: 읽다, meaning: to read., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1136, display: 읽음, meaning: read (status indicator)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1137, display: 입, meaning: mouth; entrance (archaic)., level: 1, category: body, source: [[body-family]] }
- { id: kr_1138, display: 입구, meaning: entrance., level: 1, category: body, source: [[body-family]] }
- { id: kr_1139, display: 입국, meaning: entry to country., level: 1, category: body, source: [[body-family]] }
- { id: kr_1140, display: 입국심사, meaning: immigration inspection., level: 1, category: body, source: [[body-family]] }
- { id: kr_1141, display: 입다, meaning: to wear (clothes); to suffer., level: 1, category: body, source: [[body-family]] }
- { id: kr_1142, display: 입장, meaning: entrance; position., level: 1, category: body, source: [[body-family]] }
- { id: kr_1143, display: 잊다, meaning: to forget., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1144, display: 잎, meaning: leaf (of a plant), level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1145, display: 자, meaning: let's (suggestion); how about., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1146, display: 자다, meaning: to sleep., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1147, display: 자라다, meaning: to grow (up)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1148, display: 자료, meaning: materials; data., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1149, display: 자산, meaning: asset., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_1150, display: 자연, meaning: nature., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1151, display: 작업, meaning: work; task; operation., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1152, display: 작은, meaning: small (modifier)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1153, display: 잔디, meaning: lawn; grass (manicured)., level: 1, category: color, source: [[basic-vocabulary]] }
- { id: kr_1154, display: 잘 먹겠습니다, meaning: I will eat well (before-meal greeting)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1155, display: 잘 먹었습니다, meaning: I ate well (after-meal greeting)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1156, display: 잘 지내다, meaning: to be doing well; to get along., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1157, display: 잘, meaning: well., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1158, display: 잘생겼다, meaning: 잘생기다 — Handsome; good-looking (for men)., level: 1, category: body, source: [[body-family]] }
- { id: kr_1159, display: 잠, meaning: sleep; nap., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1160, display: 잡, meaning: miscellaneous; mixed., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1161, display: 잡지, meaning: magazine., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1162, display: 장, meaning: chapter; tool; place; long; chief., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1163, display: 장갑, meaning: gloves., level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_1164, display: 장미, meaning: rose., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1165, display: 장소, meaning: location; place., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1166, display: 장아찌, meaning: pickled vegetables (in soy sauce)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1167, display: 재미있다, meaning: 재미있다 — Funny; fun; interesting., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1168, display: 재통화, meaning: callback; return call., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1169, display: 재화, meaning: goods; assets; wealth., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1170, display: 저널, meaning: journal., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1171, display: 저녁, meaning: evening; dinner., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1172, display: 저렴한, meaning: cheap (modifier)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1173, display: 저장, meaning: save (storage)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1174, display: 적다, meaning: to be few; to be little., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1175, display: 전, meaning: Korean savory pancake., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1176, display: 전달, meaning: delivery; forwarding., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1177, display: 전병, meaning: rice paper (Korean traditional)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1178, display: 전설, meaning: legend., level: 1, category: body, source: [[body-family]] }
- { id: kr_1179, display: 전송, meaning: transmission; transmission., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1180, display: 전시, meaning: exhibition; display; to exhibit., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1181, display: 전통, meaning: tradition., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1182, display: 전화, meaning: telephone; phone call., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1183, display: 전화번호, meaning: phone number., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1184, display: 전화하다, meaning: to call (by phone)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1185, display: 절, meaning: temple (casual)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1186, display: 점심, meaning: lunch; noon., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_1187, display: 점퍼, meaning: jumper; jacket., level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_1188, display: 접수, meaning: receipt (of submission)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1189, display: 젓갈, meaning: salted seafood (Korean condiment)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1190, display: 정류장, meaning: bus stop., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1191, display: 정문, meaning: main gate., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1192, display: 정보, meaning: information., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1193, display: 정부, meaning: government., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1194, display: 정원, meaning: garden; capacity., level: 1, category: place, source: [[여행]] }
- { id: kr_1195, display: 정직하다, meaning: honest., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1196, display: 제, meaning: I (honorific); top., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1197, display: 제목, meaning: subject; title., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1198, display: 제주도, meaning: Jeju Island., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_1199, display: 제출, meaning: submission., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1200, display: 제출하다, meaning: to submit., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1201, display: 조, meaning: early morning; grain; ancestor., level: 1, category: body, source: [[body-family]] }
- { id: kr_1202, display: 조깅, meaning: Jogging — 천천히 뛰는 운동., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1203, display: 조선, meaning: Joseon (Korean dynasty, 1392-1910)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1204, display: 좁다, meaning: to be narrow., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1205, display: 좁은, meaning: narrow (modifier form)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1206, display: 좋다, meaning: to be good; to like., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1207, display: 좋아요, meaning: to be good (polite)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1208, display: 좋아하다, meaning: 좋아하다 — To like., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1209, display: 좋아해요, meaning: I like it (polite)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1210, display: 좌회전, meaning: left turn., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1211, display: 죄송합니다, meaning: I'm sorry (formal)., level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: kr_1212, display: 죄책감, meaning: guilt; guilty conscience., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1213, display: 주, meaning: week; main; between; wine., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_1214, display: 주거, meaning: residence; dwelling., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1215, display: 주문, meaning: order; to order., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1216, display: 주문하다, meaning: to order (food/drinks)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1217, display: 주방, meaning: kitchen., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1218, display: 주변, meaning: surroundings; vicinity., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1219, display: 주소, meaning: address., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1220, display: 주스, meaning: juice., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1221, display: 죽, meaning: porridge; congee., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1222, display: 줄기, meaning: stem; stalk., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1223, display: 중국집, meaning: Chinese restaurant (Korean style)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1224, display: 중학교, meaning: middle school., level: 1, category: place, source: [[여행]] }
- { id: kr_1225, display: 즉시, meaning: immediately; right away., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1226, display: 증명서, meaning: certificate; proof document., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1227, display: 증오하다, meaning: to detest; to loathe., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1228, display: 지갑, meaning: wallet., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1229, display: 지구, meaning: earth (planet); region., level: 1, category: body, source: [[body-family]] }
- { id: kr_1230, display: 지급, meaning: payment; to pay., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1231, display: 지도, meaning: map; guidance., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1232, display: 지불, meaning: payment; to pay., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1233, display: 지원, meaning: support; application., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1234, display: 지인, meaning: acquaintance., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1235, display: 지출, meaning: expenditure; spending., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1236, display: 지치다, meaning: to get exhausted; to be worn out., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1237, display: 지폐, meaning: banknote; paper money., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1238, display: 지하철, meaning: subway; metro., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1239, display: 직원, meaning: employee; staff., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1240, display: 직장, meaning: workplace., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1241, display: 직진, meaning: going straight; to go straight., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1242, display: 질문, meaning: question., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1243, display: 질투하다, meaning: to be jealous., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1244, display: 짐, meaning: luggage; baggage., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1245, display: 짐승, meaning: beast (literary)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1246, display: 집, meaning: house; home., level: 1, category: place, source: [[여행]] }
- { id: kr_1247, display: 집안, meaning: household; family lineage., level: 1, category: place, source: [[여행]] }
- { id: kr_1248, display: 짖다, meaning: to bark; to howl., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1249, display: 짜다, meaning: salty., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1250, display: 짧다, meaning: to be short (in length)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1251, display: 짧은, meaning: short (modifier form)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1252, display: 짬뽕, meaning: spicy seafood noodle soup., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1253, display: 쪽, meaning: side; direction; counter., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1254, display: 찌개, meaning: stew., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1255, display: 차분하다, meaning: to be calm; to be composed., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1256, display: 차트, meaning: chart., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1257, display: 착하다, meaning: 착하다 — Kind; good-hearted., level: 1, category: body, source: [[body-family]] }
- { id: kr_1258, display: 찬성, meaning: approval; support., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1259, display: 참기름, meaning: sesame oil., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1260, display: 참석자, meaning: attendee; participant., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1261, display: 참석하다, meaning: to attend; to participate., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1262, display: 책, meaning: book., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1263, display: 책임감 있다, meaning: responsible., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1264, display: 처리, meaning: processing; handling., level: 1, category: body, source: [[body-family]] }
- { id: kr_1265, display: 처리하다, meaning: to process; to handle., level: 1, category: body, source: [[body-family]] }
- { id: kr_1266, display: 처음 뵙겠습니다, meaning: First time meeting you (formal)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1267, display: 처음, meaning: first; beginning; for the first time., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1268, display: 천둥, meaning: thunder., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1269, display: 천문학, meaning: astronomy., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1270, display: 철학, meaning: philosophy., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1271, display: 첨부, meaning: attachment., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1272, display: 첫번째, meaning: first., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1273, display: 첫사랑, meaning: first love., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_1274, display: 청바지, meaning: jeans., level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_1275, display: 청순, meaning: pure and innocent; maidenly., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1276, display: 체결, meaning: signing (contract)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1277, display: 체결하다, meaning: to sign (a contract)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1278, display: 체육, meaning: physical education; physical training., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1279, display: 체크인, meaning: check-in., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1280, display: 쳐, meaning: to hit (informal); to play (instrument)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1281, display: 초, meaning: candle; second; beginning; grass., level: 1, category: time, source: [[topik1-starter]] }
- { id: kr_1282, display: 초등학교, meaning: elementary school., level: 1, category: place, source: [[여행]] }
- { id: kr_1283, display: 추석, meaning: Chuseok — 음력 8월 15일 한국 명절., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1284, display: 추운, meaning: cold (modifier)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1285, display: 축구, meaning: Soccer / football., level: 1, category: body, source: [[body-family]] }
- { id: kr_1286, display: 축복, meaning: blessing., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1287, display: 축하, meaning: celebration; to congratulate., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1288, display: 축하합니다, meaning: congratulations (formal)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1289, display: 춘향전, meaning: Chunhyangjeon (Korean classical story)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1290, display: 출구, meaning: exit., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1291, display: 출국, meaning: leaving country., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1292, display: 출발, meaning: departure; to depart., level: 1, category: body, source: [[body-family]] }
- { id: kr_1293, display: 출발하다, meaning: to depart; to leave (for a destination)., level: 1, category: body, source: [[body-family]] }
- { id: kr_1294, display: 출입문, meaning: entrance door; entry., level: 1, category: body, source: [[body-family]] }
- { id: kr_1295, display: 춥다, meaning: to be cold., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1296, display: 취미, meaning: 취미 — Hobby; pastime., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1297, display: 취소, meaning: cancel; cancellation., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1298, display: 치, meaning: tooth; index finger., level: 1, category: body, source: [[body-family]] }
- { id: kr_1299, display: 치우다, meaning: to clean up; to put away., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1300, display: 치즈, meaning: cheese., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1301, display: 치킨, meaning: fried chicken (Korean style)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1302, display: 친구, meaning: friend., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1303, display: 친근하다, meaning: familiar; approachable., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1304, display: 친절하다, meaning: kind; considerate., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1305, display: 친척, meaning: relatives; kin., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1306, display: 칠전八기, meaning: Chiljeon Palgi (folk tale)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1307, display: 침대, meaning: bed., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1308, display: 침착하다, meaning: calm; composed., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1309, display: 카드, meaning: card., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1310, display: 카레라이스, meaning: curry rice (Korean style)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1311, display: 카메라, meaning: camera., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1312, display: 카페, meaning: 카페 — Café; coffee shop., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1313, display: 커피, meaning: coffee., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1314, display: 컴퓨터, meaning: Computer — 전자 계산을 수행하는 기계., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_1315, display: 케이크, meaning: Cake., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1316, display: 코끼리, meaning: elephant., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1317, display: 코트, meaning: coat., level: 1, category: body, source: [[body-family]] }
- { id: kr_1318, display: 콘택트 렌즈, meaning: contact lens., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1319, display: 콜라, meaning: cola (Coke/Pepsi)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1320, display: 크리스마스, meaning: Christmas — 12월 25일 기념일., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1321, display: 큰, meaning: big; large (modifier)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1322, display: 키보드, meaning: Keyboard — 타이핑하는 입력 장치., level: 1, category: body, source: [[body-family]] }
- { id: kr_1323, display: 키우다, meaning: to raise (child/plant/animal)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1324, display: 타다, meaning: to ride (vehicle); to take; to burn (fire); to catch (cold)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1325, display: 타이핑, meaning: typing., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1326, display: 탐욕, meaning: greed (formal)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1327, display: 탑승, meaning: boarding., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1328, display: 탕, meaning: Korean soup/broth (large portion)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1329, display: 태양, meaning: sun., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1330, display: 택시, meaning: taxi., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1331, display: 텔레비전, meaning: television; TV., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_1332, display: 토끼, meaning: rabbit., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1333, display: 토론, meaning: discussion; debate., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1334, display: 통증, meaning: Pain — 신체적 고통., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1335, display: 통화 중, meaning: busy (phone line)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1336, display: 통화, meaning: phone call; phone conversation., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1337, display: 투자, meaning: investment., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1338, display: 특별하다, meaning: special., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1339, display: 틀리다, meaning: to be wrong; to be incorrect., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1340, display: 팀장, meaning: team leader., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1341, display: 팁, meaning: tip (gratuity)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1342, display: 파란 셔츠, meaning: blue shirt., level: 1, category: clothing, source: [[의류・패션 어휘]] }
- { id: kr_1343, display: 파란, meaning: blue (modifier form)., level: 1, category: color, source: [[basic-vocabulary]] }
- { id: kr_1344, display: 파랑, meaning: blue (noun form)., level: 1, category: color, source: [[basic-vocabulary]] }
- { id: kr_1345, display: 파일, meaning: file (document/computer)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1346, display: 파트너, meaning: partner., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1347, display: 파티, meaning: Party — 축하 모임., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1348, display: 판소리, meaning: pansori (Korean traditional storytelling)., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1349, display: 팔, meaning: arm; 8 (counter)., level: 1, category: body, source: [[body-family]] }
- { id: kr_1350, display: 팔다, meaning: to sell., level: 1, category: body, source: [[body-family]] }
- { id: kr_1351, display: 편안하다, meaning: to be comfortable., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1352, display: 평범하다, meaning: to be ordinary; to be normal., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1353, display: 평생, meaning: entire life; lifetime., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1354, display: 평안, meaning: peace., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1355, display: 평안하다, meaning: to be peaceful; to be tranquil., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1356, display: 포장, meaning: takeout; packaging., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1357, display: 폭풍, meaning: storm; tempest., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1358, display: 표, meaning: table; form., level: 1, category: travel, source: [[여행]] }
- { id: kr_1359, display: 표정, meaning: facial expression; expression., level: 1, category: travel, source: [[여행]] }
- { id: kr_1360, display: 풀, meaning: grass; glue., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1361, display: 풀다, meaning: to untangle; to solve., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1362, display: 풀리다, meaning: to get untangled; to be solved., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1363, display: 풀숲, meaning: grassland; bush., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_1364, display: 프로젝트, meaning: project., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1365, display: 피곤하다, meaning: to be tired., level: 1, category: color, source: [[basic-vocabulary]] }
- { id: kr_1366, display: 피다, meaning: to bloom; to blossom., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1367, display: 피아노, meaning: piano., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1368, display: 피자, meaning: pizza., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1369, display: 하나, meaning: one (native Korean)., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1370, display: 하늘, meaning: sky., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_1371, display: 하루, meaning: one day; a day., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1372, display: 하얀 바지, meaning: white pants., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1373, display: 하차, meaning: alighting; getting off (vehicle); to alight., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1374, display: 학교, meaning: school., level: 1, category: place, source: [[여행]] }
- { id: kr_1375, display: 학생, meaning: student., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1376, display: 학습, meaning: learning (formal)., level: 1, category: body, source: [[body-family]] }
- { id: kr_1377, display: 학원, meaning: private academy (cram school); institute., level: 1, category: place, source: [[여행]] }
- { id: kr_1378, display: 한, meaning: one; big; great (한자 韓 = Korean, 限 = limit)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1379, display: 한가하다, meaning: to be free; to be at leisure., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1380, display: 저는 한국 사람입니다, meaning: I am Korean (formal self-introduction)., level: 1, category: body, source: [[body-family]] }
- { id: kr_1381, display: 한국, meaning: South Korea; Korea (the country)., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1382, display: 한국어, meaning: Korean language., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1383, display: 한승훈, meaning: Han Seung-hoon (Korean author, 1899-1940)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1384, display: 한심하다, meaning: pathetic; shameful., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1385, display: 한테, meaning: to (person, casual)., level: 1, category: family, source: [[여행]] }
- { id: kr_1386, display: 할인, meaning: discount; sale., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1387, display: 합의, meaning: agreement; consensus., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1388, display: 합치다, meaning: to combine; to put together., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1389, display: 해, meaning: year (counter for past years)., level: 1, category: body, source: [[body-family]] }
- { id: kr_1390, display: 해변, meaning: beach; seaside., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_1391, display: 해안, meaning: coast; shore., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1392, display: 햄버거, meaning: hamburger., level: 1, category: food, source: [[food-vocabulary]] }
- { id: kr_1393, display: 행복하다, meaning: to be happy; to be happy., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_1394, display: 헤어지다, meaning: to part; to break up; to separate., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1395, display: 헤엄치다, meaning: to swim., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1396, display: 현금, meaning: cash., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1397, display: 현대, meaning: Hyundai (company); modern., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1398, display: 협력, meaning: cooperation; collaboration., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1399, display: 협조, meaning: cooperation; support., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1400, display: 형편, meaning: circumstances; state; condition., level: 1, category: family, source: [[여행]] }
- { id: kr_1401, display: 호기심, meaning: curiosity., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1402, display: 호랑이, meaning: tiger., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1403, display: 호수, meaning: lake., level: 1, category: nature, source: [[자연・날씨 어휘]] }
- { id: kr_1404, display: 호칭 관계, meaning: titles and relationships., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1405, display: 호텔, meaning: hotel., level: 1, category: place, source: [[여행]] }
- { id: kr_1406, display: 홍차, meaning: black tea (Korean style)., level: 1, category: color, source: [[basic-vocabulary]] }
- { id: kr_1407, display: 화, meaning: painting; picture., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1408, display: 화나다, meaning: to become angry., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_1409, display: 화나하다, meaning: to be angry., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_1410, display: 화남, meaning: anger (colloquial)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1411, display: 화면, meaning: Screen — 디스플레이 장치., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1412, display: 화이팅, meaning: hwaiting! (fighting spirit)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1413, display: 확인, meaning: confirmation; check., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1414, display: 확인하다, meaning: to confirm; to check., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1415, display: 환경, meaning: environment; surroundings., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1416, display: 환불, meaning: refund; to refund., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1417, display: 환율, meaning: exchange rate., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1418, display: 환전, meaning: currency exchange (환전), level: 1, source: [[basic-vocabulary]] }
- { id: kr_1419, display: 활발하다, meaning: lively; active., level: 1, category: body, source: [[body-family]] }
- { id: kr_1420, display: 회사, meaning: company; corporation., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1421, display: 회신, meaning: reply (formal)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1422, display: 회의, meaning: meeting; conference., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1423, display: 횡단보도, meaning: crosswalk; pedestrian crossing., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1424, display: 후추, meaning: pepper (spice)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1425, display: 후회, meaning: regret; remorse., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1426, display: 후회하다, meaning: to regret., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1427, display: 훌륭하다, meaning: splendid; excellent., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1428, display: 휴대폰, meaning: mobile phone., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1429, display: 흐뭇, meaning: slightly sad; melancholy., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_1430, display: 흡족, meaning: satisfied; content., level: 1, category: number, source: [[topik1-starter]] }
- { id: kr_1431, display: 흡족하다, meaning: to be satisfied (formal)., level: 1, source: [[basic-vocabulary]] }
- { id: kr_1432, display: 희망, meaning: hope; wish., level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: kr_1433, display: 희소, meaning: scarce; rare., level: 1, category: animal, source: [[동물 어휘]] }
- { id: kr_1434, display: 흰색, meaning: white (noun form)., level: 1, category: color, source: [[basic-vocabulary]] }
- { id: kr_1435, display: 힘들다, meaning: to be difficult; to be hard., level: 1, source: [[basic-vocabulary]] }
```
