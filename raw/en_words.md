# English Word/Sentence Corpus

> **상태**: 골격. Phase 6에서 본격 확장.

## 출처

- 일반 단어: OEC (Oxford English Corpus) 빈도순
- CEFR 어휘: Oxford 3000, English Profile
- 문장: 위키피디아 (CC-BY-SA), BBC Learning English
- 빈도: SUBTLEX-US, COCA

## 코퍼스 형식

각 단어/문장은 다음 형식을 따름 (YAML):

```yaml
- id: en_001
  display: hello
  meaning: 인사
  level: 1        # 1=A1, 2=A2, 3=B1, 4=B2, 5=C1/C2
  category: greeting
  # sentences only:
  # source: Wikipedia
  # license: CC-BY-SA
```

## 단어 (Words) — Level 1 (A1, 가장 흔함)

```yaml
- { id: en_001, display: hello, meaning: 안녕, level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: en_002, display: hi, meaning: 안녕, level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: en_003, display: goodbye, meaning: 안녕히, level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: en_004, display: thanks, meaning: 고마워, level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: en_005, display: please, meaning: 부디, level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: en_006, display: yes, meaning: 네, level: 1, category: basic, source: [[basic-vocabulary]] }
- { id: en_007, display: no, meaning: 아니오, level: 1, category: basic, source: [[basic-vocabulary]] }
- { id: en_008, display: sorry, meaning: 미안, level: 1, category: basic, source: [[basic-vocabulary]] }
- { id: en_009, display: one, meaning: 하나, level: 1, category: number, source: [[basic-vocabulary]] }
- { id: en_010, display: two, meaning: 둘, level: 1, category: number, source: [[basic-vocabulary]] }
- { id: en_011, display: three, meaning: 셋, level: 1, category: number, source: [[basic-vocabulary]] }
- { id: en_012, display: ten, meaning: 열, level: 1, category: number, source: [[basic-vocabulary]] }
- { id: en_013, display: red, meaning: 빨강, level: 1, category: color, source: [[basic-vocabulary]] }
- { id: en_014, display: blue, meaning: 파랑, level: 1, category: color, source: [[basic-vocabulary]] }
- { id: en_015, display: green, meaning: 초록, level: 1, category: color, source: [[basic-vocabulary]] }
- { id: en_016, display: cat, meaning: 고양이, level: 1, category: animal, source: [[animals-vocabulary]] }
- { id: en_017, display: dog, meaning: 개, level: 1, category: animal, source: [[animals-vocabulary]] }
- { id: en_018, display: book, meaning: 책, level: 1, category: object, source: [[basic-vocabulary]] }
- { id: en_019, display: water, meaning: 물, level: 1, category: food, source: [[food-vocabulary]] }
- { id: en_020, display: bread, meaning: 빵, level: 1, category: food, source: [[food-vocabulary]] }
- { id: en_021, display: today, meaning: 오늘, level: 1, category: time, source: [[basic-vocabulary]] }
- { id: en_022, display: tomorrow, meaning: 내일, level: 1, category: time, source: [[basic-vocabulary]] }
- { id: en_023, display: morning, meaning: 아침, level: 1, category: time, source: [[basic-vocabulary]] }
- { id: en_024, display: mother, meaning: 어머니, level: 1, category: family, source: [[basic-vocabulary]] }
- { id: en_025, display: father, meaning: 아버지, level: 1, category: family, source: [[basic-vocabulary]] }
- { id: en_036, display: face, meaning: 얼굴, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_037, display: chest, meaning: 가슴, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_038, display: aunt, meaning: 이모, level: 1, category: family, source: [[basic-vocabulary]] }
- { id: en_039, display: baby, meaning: 아기, level: 1, category: family, source: [[basic-vocabulary]] }
- { id: en_040, display: cola, meaning: 콜라, level: 1, category: food, source: [[food-vocabulary]] }
- { id: en_041, display: pepper, meaning: 후추, level: 1, category: food, source: [[food-vocabulary]] }
- { id: en_042, display: vinegar, meaning: 식초, level: 1, category: food, source: [[food-vocabulary]] }
```

## 단어 — Level 2 (A2)

```yaml
- { id: en_026, display: morning, meaning: 아침, level: 2, category: time, source: [[basic-vocabulary]] }
- { id: en_027, display: hungry, meaning: 배고픈, level: 2, category: feeling, source: [[emotions-personality-vocabulary]] }
- { id: en_028, display: together, meaning: 함께, level: 2, category: basic, source: [[basic-vocabulary]] }
- { id: en_029, display: beautiful, meaning: 아름다운, level: 2, category: adjective, source: [[basic-vocabulary]] }
- { id: en_030, display: restaurant, meaning: 식당, level: 2, category: place, source: [[travel]] }
- { id: en_031, display: hospital, meaning: 병원, level: 2, category: place, source: [[basic-vocabulary]] }
- { id: en_032, display: expensive, meaning: 비싼, level: 2, category: adjective, source: [[basic-vocabulary]] }
- { id: en_033, display: important, meaning: 중요한, level: 2, category: adjective, source: [[basic-vocabulary]] }
- { id: en_034, display: difficult, meaning: 어려운, level: 2, category: adjective, source: [[basic-vocabulary]] }
- { id: en_035, display: favorite, meaning: 좋아하는, level: 2, category: adjective, source: [[basic-vocabulary]] }
```

## 단어 — Level 3~5

(추가 예정)

## 문장 (Sentences) — Level 1~2

```yaml
- { id: ens_001, display: Hello, how are you?, level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: ens_002, display: I am happy today., level: 1, category: basic, source: [[basic-vocabulary]] }
- { id: ens_003, display: Where is the bathroom?, level: 2, category: question, source: [[basic-vocabulary]] }
- { id: ens_004, display: I would like some water., level: 2, category: restaurant, source: [[basic-vocabulary]] }
- { id: ens_005, display: Thank you very much., level: 1, category: greeting, source: [[basic-vocabulary]] }
```

## 문장 — Level 3~5

(추가 예정)

## 여행 어휘 (Travel) — Level 1~2

> **출처**: [[first-travel-japan]] (raw/English/first-travel-japan.md)
> **위키 페이지**: 테마 파일 기준 (예: [[travel]])
> **카테고리**: travel (여행)

### 공항 & 비행기 (Airport)

```yaml
- { id: en_t_001, display: airport, meaning: 공항, level: 1, category: travel, source: [[travel]], romaji: airport }
- { id: en_t_002, display: passport, meaning: 여권, level: 1, category: travel, source: [[travel]], romaji: passport }
- { id: en_t_003, display: immigration, meaning: 입국심사, level: 2, category: travel, source: [[travel]], romaji: immigration }
- { id: en_t_004, display: customs, meaning: 세관, level: 2, category: travel, source: [[travel]], romaji: customs }
- { id: en_t_005, display: luggage, meaning: 짐, level: 2, category: travel, source: [[travel]], romaji: luggage }
- { id: en_t_006, display: exit, meaning: 출구, level: 1, category: travel, source: [[travel]], romaji: exit }
- { id: en_t_007, display: entrance, meaning: 입구, level: 2, category: travel, source: [[travel]], romaji: entrance }
```

### 호텔 & 숙소 (Hotel)

```yaml
- { id: en_t_010, display: hotel, meaning: 호텔, level: 1, category: travel, source: [[travel]], romaji: hotel }
- { id: en_t_011, display: reservation, meaning: 예약, level: 2, category: travel, source: [[travel]], romaji: reservation }
- { id: en_t_012, display: room, meaning: 방, level: 1, category: travel, source: [[travel]], romaji: room }
- { id: en_t_013, display: breakfast, meaning: 아침 식사, level: 2, category: travel, source: [[travel]], romaji: breakfast }
- { id: en_t_014, display: key, meaning: 열쇠, level: 1, category: travel, source: [[travel]], romaji: key }
```

### 식당 & 음식 (Restaurant)

```yaml
- { id: en_t_020, display: restaurant, meaning: 식당, level: 1, category: travel, source: [[travel]], romaji: restaurant }
- { id: en_t_021, display: menu, meaning: 메뉴, level: 1, category: travel, source: [[travel]], romaji: menu }
- { id: en_t_022, display: order, meaning: 주문하다, level: 1, category: travel, source: [[travel]], romaji: order }
- { id: en_t_023, display: bill, meaning: 계산서, level: 2, category: travel, source: [[travel]], romaji: bill }
- { id: en_t_024, display: tip, meaning: 팁, level: 2, category: travel, source: [[travel]], romaji: tip }
- { id: en_t_025, display: delicious, meaning: 맛있다, level: 1, category: travel, source: [[travel]], romaji: delicious }
- { id: en_t_026, display: spicy, meaning: 맵다, level: 2, category: travel, source: [[travel]], romaji: spicy }
```

### 교통 (Transport)

```yaml
- { id: en_t_030, display: station, meaning: 역, level: 1, category: travel, source: [[travel]], romaji: station }
- { id: en_t_031, display: subway, meaning: 지하철, level: 2, category: travel, source: [[travel]], romaji: subway }
- { id: en_t_032, display: train, meaning: 기차, level: 2, category: travel, source: [[travel]], romaji: train }
- { id: en_t_033, display: bus, meaning: 버스, level: 1, category: travel, source: [[travel]], romaji: bus }
- { id: en_t_034, display: taxi, meaning: 택시, level: 1, category: travel, source: [[travel]], romaji: taxi }
- { id: en_t_035, display: ticket, meaning: 표, level: 1, category: travel, source: [[travel]], romaji: ticket }
- { id: en_t_036, display: left, meaning: 왼쪽, level: 1, category: travel, source: [[travel]], romaji: left }
- { id: en_t_037, display: right, meaning: 오른쪽, level: 1, category: travel, source: [[travel]], romaji: right }
- { id: en_t_038, display: straight, meaning: 직진, level: 2, category: travel, source: [[travel]], romaji: straight }
- { id: en_t_039, display: near, meaning: 가까이, level: 1, category: travel, source: [[travel]], romaji: near }
- { id: en_t_040, display: far, meaning: 멀리, level: 1, category: travel, source: [[travel]], romaji: far }
```

### 관광 (Sightseeing)

```yaml
- { id: en_t_050, display: temple, meaning: 절, level: 2, category: travel, source: [[travel]], romaji: temple }
- { id: en_t_051, display: shrine, meaning: 신사, level: 2, category: travel, source: [[travel]], romaji: shrine }
- { id: en_t_052, display: museum, meaning: 박물관, level: 1, category: travel, source: [[travel]], romaji: museum }
- { id: en_t_053, display: park, meaning: 공원, level: 1, category: travel, source: [[travel]], romaji: park }
- { id: en_t_054, display: mountain, meaning: 산, level: 1, category: travel, source: [[travel]], romaji: mountain }
- { id: en_t_055, display: sea, meaning: 바다, level: 1, category: travel, source: [[travel]], romaji: sea }
- { id: en_t_056, display: photo, meaning: 사진, level: 1, category: travel, source: [[travel]], romaji: photo }
- { id: en_t_057, display: map, meaning: 지도, level: 1, category: travel, source: [[travel]], romaji: map }
- { id: en_t_058, display: guide, meaning: 가이드, level: 2, category: travel, source: [[travel]], romaji: guide }
- { id: en_t_059, display: cheap, meaning: 싸다, level: 2, category: travel, source: [[travel]], romaji: cheap }
- { id: en_t_060, display: expensive, meaning: 비싸다, level: 2, category: travel, source: [[travel]], romaji: expensive }
```

### 여행 표현 (Travel Expressions) — Level 3

```yaml
- id: en_t_s_001
  display: Where is the hotel?
  meaning: 호텔은 어디에 있나요?
  level: 3
  category: travel
  source: [[basic-vocabulary]]
  romaji: where-is-the-hotel

- id: en_t_s_002
  display: How much is it?
  meaning: 얼마예요?
  level: 3
  category: travel
  source: [[basic-vocabulary]]
  romaji: how-much-is-it

- id: en_t_s_003
  display: I would like to check in.
  meaning: 체크인하고 싶습니다.
  level: 3
  category: travel
  source: [[basic-vocabulary]]
  romaji: i-would-like-to-check-in

- id: en_t_s_004
  display: Where is the bathroom?
  meaning: 화장실 어디예요?
  level: 3
  category: travel
  source: [[basic-vocabulary]]
  romaji: where-is-the-bathroom

- id: en_t_s_005
  display: May I see the menu?
  meaning: 메뉴판 좀 볼 수 있을까요?
  level: 3
  category: travel
  source: [[basic-vocabulary]]
  romaji: may-i-see-the-menu

- id: en_t_s_006
  display: Thank you very much.
  meaning: 정말 감사합니다.
  level: 1
  category: travel
  source: [[basic-vocabulary]]
  romaji: thank-you-very-much
```

## 카테고리 목록

- greeting (인사)
- basic (기본)
- number (숫자)
- color (색상)
- time (시간)
- family (가족)
- animal (동물)
- food (음식)
- object (사물)
- place (장소)
- adjective (형용사)
- feeling (감정)
- question (질문)
- travel (여행)

## 라이선스

- 단어 자체는 저작권 없음 (사실/언어)
- 문장은 출처 명시 + 라이선스 확인 필수
- 현재 골격의 문장은 학습용 일반 표현 (출처 불명확한 경우 추후 교체)

## 확장 계획 (Phase 6)

- [ ] Level 1 단어 100개 확장
- [ ] Level 2~5 단어 각 200개
- [ ] 일상 회화 문장 50개
- [ ] 뉴스 헤드라인 30개
- [ ] 문학 발췌 10개

## 다음 단계

- JSON 형식 변환: `prototype/src/data/en_words.json`
- 단어 검증 (오타, 중복)
- 라이선스 명시

## 추가 어휘 (Expanded 2026-07-30) — 603 entries

```yaml
- { id: en_100, display: maybe, meaning: 아마, level: 1, category: basic, source: [[basic-vocabulary]] }
- { id: en_101, display: okay, meaning: 괜찮아, level: 1, category: basic, source: [[basic-vocabulary]] }
- { id: en_102, display: sure, meaning: 확실히, level: 1, category: basic, source: [[basic-vocabulary]] }
- { id: en_103, display: really, meaning: 정말, level: 1, category: basic, source: [[basic-vocabulary]] }
- { id: en_104, display: I, meaning: 나, level: 1, category: pronoun, source: [[basic-vocabulary]] }
- { id: en_105, display: you, meaning: 당신, level: 1, category: pronoun, source: [[basic-vocabulary]] }
- { id: en_106, display: he, meaning: 그, level: 1, category: pronoun, source: [[basic-vocabulary]] }
- { id: en_107, display: she, meaning: 그녀, level: 1, category: pronoun, source: [[basic-vocabulary]] }
- { id: en_108, display: we, meaning: 우리, level: 1, category: pronoun, source: [[basic-vocabulary]] }
- { id: en_109, display: they, meaning: 그들, level: 1, category: pronoun, source: [[basic-vocabulary]] }
- { id: en_110, display: me, meaning: 나를, level: 1, category: pronoun, source: [[basic-vocabulary]] }
- { id: en_111, display: him, meaning: 그를, level: 1, category: pronoun, source: [[basic-vocabulary]] }
- { id: en_112, display: her, meaning: 그녀를, level: 1, category: pronoun, source: [[basic-vocabulary]] }
- { id: en_113, display: us, meaning: 우리들, level: 1, category: pronoun, source: [[basic-vocabulary]] }
- { id: en_114, display: them, meaning: 그들을, level: 1, category: pronoun, source: [[basic-vocabulary]] }
- { id: en_115, display: my, meaning: 나의, level: 1, category: pronoun, source: [[basic-vocabulary]] }
- { id: en_116, display: your, meaning: 당신의, level: 1, category: pronoun, source: [[basic-vocabulary]] }
- { id: en_117, display: his, meaning: 그의, level: 1, category: pronoun, source: [[basic-vocabulary]] }
- { id: en_118, display: this, meaning: 이것, level: 1, category: pronoun, source: [[basic-vocabulary]] }
- { id: en_119, display: that, meaning: 저것, level: 1, category: pronoun, source: [[basic-vocabulary]] }
- { id: en_120, display: these, meaning: 이것들, level: 2, category: pronoun, source: [[basic-vocabulary]] }
- { id: en_121, display: those, meaning: 저것들, level: 2, category: pronoun, source: [[basic-vocabulary]] }
- { id: en_122, display: be, meaning: ~이다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_123, display: have, meaning: 가지다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_124, display: do, meaning: 하다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_125, display: say, meaning: 말하다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_126, display: get, meaning: 얻다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_127, display: make, meaning: 만들다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_128, display: go, meaning: 가다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_129, display: know, meaning: 알다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_130, display: take, meaning: 가져가다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_131, display: see, meaning: 보다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_132, display: come, meaning: 오다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_133, display: think, meaning: 생각하다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_134, display: look, meaning: 보다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_135, display: want, meaning: 원하다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_136, display: give, meaning: 주다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_137, display: use, meaning: 사용하다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_138, display: find, meaning: 찾다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_139, display: tell, meaning: 알리다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_140, display: ask, meaning: 묻다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_141, display: work, meaning: 일하다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_142, display: seem, meaning: ~처럼 보이다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_143, display: feel, meaning: 느끼다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_144, display: try, meaning: 시도하다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_145, display: leave, meaning: 떠나다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_146, display: call, meaning: 부르다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_147, display: move, meaning: 움직이다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_148, display: live, meaning: 살다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_149, display: believe, meaning: 믿다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_150, display: bring, meaning: 가져오다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_151, display: happen, meaning: 일어나다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_152, display: write, meaning: 쓰다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_153, display: sit, meaning: 앉다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_154, display: stand, meaning: 서다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_155, display: lose, meaning: 잃다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_156, display: pay, meaning: 지불하다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_157, display: meet, meaning: 만나다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_158, display: include, meaning: 포함하다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_159, display: continue, meaning: 계속하다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_160, display: set, meaning: 설정하다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_161, display: learn, meaning: 배우다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_162, display: change, meaning: 변하다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_163, display: lead, meaning: 이끌다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_164, display: understand, meaning: 이해하다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_165, display: watch, meaning: 보다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_166, display: follow, meaning: 따라가다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_167, display: stop, meaning: 멈추다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_168, display: create, meaning: 창작하다, level: 3, category: verb, source: [[basic-vocabulary]] }
- { id: en_169, display: speak, meaning: 말하다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_170, display: read, meaning: 읽다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_171, display: allow, meaning: 허락하다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_172, display: add, meaning: 더하다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_173, display: spend, meaning: 쓰다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_174, display: grow, meaning: 자라다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_175, display: open, meaning: 열다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_176, display: walk, meaning: 걷다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_177, display: win, meaning: 이기다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_178, display: offer, meaning: 제공하다, level: 3, category: verb, source: [[basic-vocabulary]] }
- { id: en_179, display: remember, meaning: 기억하다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_180, display: love, meaning: 사랑하다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_181, display: consider, meaning: 고려하다, level: 3, category: verb, source: [[basic-vocabulary]] }
- { id: en_182, display: appear, meaning: 나타나다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_183, display: buy, meaning: 사다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_184, display: wait, meaning: 기다리다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_185, display: serve, meaning: 섬기다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_186, display: die, meaning: 죽다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_187, display: send, meaning: 보내다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_188, display: expect, meaning: 기대하다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_189, display: build, meaning: 짓다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_190, display: stay, meaning: 머무르다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_191, display: fall, meaning: 떨어지다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_192, display: cut, meaning: 자르다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_193, display: reach, meaning: 도달하다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_194, display: kill, meaning: 죽이다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_195, display: remain, meaning: 남다, level: 3, category: verb, source: [[basic-vocabulary]] }
- { id: en_196, display: suggest, meaning: 제안하다, level: 3, category: verb, source: [[basic-vocabulary]] }
- { id: en_197, display: raise, meaning: 올리다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_198, display: pass, meaning: 지나가다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_199, display: sell, meaning: 팔다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_200, display: require, meaning: 요구하다, level: 3, category: verb, source: [[basic-vocabulary]] }
- { id: en_201, display: decide, meaning: 결정하다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_202, display: pull, meaning: 당기다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_203, display: develop, meaning: 발전하다, level: 3, category: verb, source: [[basic-vocabulary]] }
- { id: en_204, display: hear, meaning: 듣다, level: 1, category: verb, source: [[basic-vocabulary]] }
- { id: en_205, display: choose, meaning: 선택하다, level: 2, category: verb, source: [[basic-vocabulary]] }
- { id: en_206, display: good, meaning: 좋은, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_207, display: new, meaning: 새로운, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_208, display: first, meaning: 첫 번째, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_209, display: last, meaning: 마지막, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_210, display: long, meaning: 긴, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_211, display: great, meaning: 위대한, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_212, display: little, meaning: 작은, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_213, display: own, meaning: 자신의, level: 2, category: adjective, source: [[basic-vocabulary]] }
- { id: en_214, display: other, meaning: 다른, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_215, display: old, meaning: 오래된, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_216, display: big, meaning: 큰, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_217, display: high, meaning: 높은, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_218, display: low, meaning: 낮은, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_219, display: different, meaning: 다른, level: 2, category: adjective, source: [[basic-vocabulary]] }
- { id: en_220, display: small, meaning: 작은, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_221, display: large, meaning: 큰, level: 2, category: adjective, source: [[basic-vocabulary]] }
- { id: en_222, display: next, meaning: 다음, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_223, display: early, meaning: 이른, level: 2, category: adjective, source: [[basic-vocabulary]] }
- { id: en_224, display: young, meaning: 어린, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_225, display: few, meaning: 적은, level: 2, category: adjective, source: [[basic-vocabulary]] }
- { id: en_226, display: public, meaning: 공공의, level: 2, category: adjective, source: [[basic-vocabulary]] }
- { id: en_227, display: bad, meaning: 나쁜, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_228, display: same, meaning: 같은, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_229, display: able, meaning: ~할 수 있는, level: 2, category: adjective, source: [[basic-vocabulary]] }
- { id: en_230, display: happy, meaning: 행복한, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_231, display: easy, meaning: 쉬운, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_232, display: strong, meaning: 강한, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_233, display: clear, meaning: 맑은, level: 2, category: adjective, source: [[basic-vocabulary]] }
- { id: en_234, display: cold, meaning: 차가운, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_235, display: hot, meaning: 뜨거운, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_236, display: fast, meaning: 빠른, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_237, display: slow, meaning: 느린, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_238, display: tall, meaning: 키 큰, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_239, display: short, meaning: 짧은, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_240, display: full, meaning: 가득한, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_241, display: empty, meaning: 빈, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_242, display: heavy, meaning: 무거운, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_243, display: light, meaning: 가벼운, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_244, display: dirty, meaning: 더러운, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_245, display: clean, meaning: 깨끗한, level: 1, category: adjective, source: [[basic-vocabulary]] }
- { id: en_246, display: also, meaning: 또한, level: 2, category: adverb, source: [[basic-vocabulary]] }
- { id: en_247, display: very, meaning: 매우, level: 1, category: adverb, source: [[basic-vocabulary]] }
- { id: en_248, display: often, meaning: 자주, level: 2, category: adverb, source: [[basic-vocabulary]] }
- { id: en_249, display: however, meaning: 그러나, level: 2, category: adverb, source: [[basic-vocabulary]] }
- { id: en_250, display: too, meaning: 너무, level: 1, category: adverb, source: [[basic-vocabulary]] }
- { id: en_251, display: more, meaning: 더, level: 1, category: adverb, source: [[basic-vocabulary]] }
- { id: en_252, display: most, meaning: 가장, level: 1, category: adverb, source: [[basic-vocabulary]] }
- { id: en_253, display: now, meaning: 지금, level: 1, category: adverb, source: [[basic-vocabulary]] }
- { id: en_254, display: then, meaning: 그때, level: 1, category: adverb, source: [[basic-vocabulary]] }
- { id: en_255, display: here, meaning: 여기, level: 1, category: adverb, source: [[basic-vocabulary]] }
- { id: en_256, display: there, meaning: 저기, level: 1, category: adverb, source: [[basic-vocabulary]] }
- { id: en_257, display: always, meaning: 항상, level: 2, category: adverb, source: [[basic-vocabulary]] }
- { id: en_258, display: never, meaning: 결코, level: 2, category: adverb, source: [[basic-vocabulary]] }
- { id: en_259, display: sometimes, meaning: 가끔, level: 2, category: adverb, source: [[basic-vocabulary]] }
- { id: en_260, display: usually, meaning: 보통, level: 2, category: adverb, source: [[basic-vocabulary]] }
- { id: en_261, display: ago, meaning: 전에, level: 2, category: adverb, source: [[basic-vocabulary]] }
- { id: en_262, display: later, meaning: 나중에, level: 1, category: adverb, source: [[basic-vocabulary]] }
- { id: en_263, display: already, meaning: 이미, level: 2, category: adverb, source: [[basic-vocabulary]] }
- { id: en_264, display: yet, meaning: 아직, level: 2, category: adverb, source: [[basic-vocabulary]] }
- { id: en_265, display: still, meaning: 여전히, level: 2, category: adverb, source: [[basic-vocabulary]] }
- { id: en_266, display: again, meaning: 다시, level: 1, category: adverb, source: [[basic-vocabulary]] }
- { id: en_267, display: once, meaning: 한 번, level: 1, category: adverb, source: [[basic-vocabulary]] }
- { id: en_268, display: almost, meaning: 거의, level: 2, category: adverb, source: [[basic-vocabulary]] }
- { id: en_269, display: just, meaning: 그냥, level: 1, category: adverb, source: [[basic-vocabulary]] }
- { id: en_270, display: only, meaning: 오직, level: 2, category: adverb, source: [[basic-vocabulary]] }
- { id: en_271, display: even, meaning: 심지어, level: 2, category: adverb, source: [[basic-vocabulary]] }
- { id: en_272, display: quite, meaning: 꽤, level: 2, category: adverb, source: [[basic-vocabulary]] }
- { id: en_273, display: in, meaning: ~안에, level: 1, category: preposition, source: [[basic-vocabulary]] }
- { id: en_274, display: on, meaning: ~위에, level: 1, category: preposition, source: [[basic-vocabulary]] }
- { id: en_275, display: at, meaning: ~에, level: 1, category: preposition, source: [[basic-vocabulary]] }
- { id: en_276, display: by, meaning: ~에 의해, level: 1, category: preposition, source: [[basic-vocabulary]] }
- { id: en_277, display: for, meaning: ~위해, level: 1, category: preposition, source: [[basic-vocabulary]] }
- { id: en_278, display: with, meaning: ~와 함께, level: 1, category: preposition, source: [[basic-vocabulary]] }
- { id: en_279, display: about, meaning: ~에 대해, level: 1, category: preposition, source: [[basic-vocabulary]] }
- { id: en_280, display: against, meaning: ~에 반하여, level: 2, category: preposition, source: [[basic-vocabulary]] }
- { id: en_281, display: between, meaning: ~사이에, level: 2, category: preposition, source: [[basic-vocabulary]] }
- { id: en_282, display: into, meaning: ~안으로, level: 2, category: preposition, source: [[basic-vocabulary]] }
- { id: en_283, display: through, meaning: ~을 통해, level: 2, category: preposition, source: [[basic-vocabulary]] }
- { id: en_284, display: during, meaning: ~동안, level: 2, category: preposition, source: [[basic-vocabulary]] }
- { id: en_285, display: before, meaning: ~전에, level: 1, category: preposition, source: [[basic-vocabulary]] }
- { id: en_286, display: after, meaning: ~후에, level: 1, category: preposition, source: [[basic-vocabulary]] }
- { id: en_287, display: above, meaning: ~위에, level: 2, category: preposition, source: [[basic-vocabulary]] }
- { id: en_288, display: below, meaning: ~아래에, level: 2, category: preposition, source: [[basic-vocabulary]] }
- { id: en_289, display: from, meaning: ~로부터, level: 1, category: preposition, source: [[basic-vocabulary]] }
- { id: en_290, display: to, meaning: ~에, level: 1, category: preposition, source: [[basic-vocabulary]] }
- { id: en_291, display: and, meaning: 그리고, level: 1, category: conjunction, source: [[basic-vocabulary]] }
- { id: en_292, display: or, meaning: 또는, level: 1, category: conjunction, source: [[basic-vocabulary]] }
- { id: en_293, display: but, meaning: 그러나, level: 1, category: conjunction, source: [[basic-vocabulary]] }
- { id: en_294, display: because, meaning: 때문에, level: 1, category: conjunction, source: [[basic-vocabulary]] }
- { id: en_295, display: if, meaning: 만약, level: 1, category: conjunction, source: [[basic-vocabulary]] }
- { id: en_296, display: when, meaning: ~할 때, level: 1, category: conjunction, source: [[basic-vocabulary]] }
- { id: en_297, display: while, meaning: ~하는 동안, level: 2, category: conjunction, source: [[basic-vocabulary]] }
- { id: en_298, display: although, meaning: ~비록, level: 2, category: conjunction, source: [[basic-vocabulary]] }
- { id: en_299, display: since, meaning: ~이후, level: 2, category: conjunction, source: [[basic-vocabulary]] }
- { id: en_300, display: unless, meaning: ~하지 않는 한, level: 2, category: conjunction, source: [[basic-vocabulary]] }
- { id: en_301, display: some, meaning: 약간의, level: 1, category: determiner, source: [[basic-vocabulary]] }
- { id: en_302, display: any, meaning: 어떤, level: 1, category: determiner, source: [[basic-vocabulary]] }
- { id: en_303, display: every, meaning: 모든, level: 1, category: determiner, source: [[basic-vocabulary]] }
- { id: en_304, display: each, meaning: 각, level: 2, category: determiner, source: [[basic-vocabulary]] }
- { id: en_305, display: much, meaning: 많은, level: 1, category: determiner, source: [[basic-vocabulary]] }
- { id: en_306, display: many, meaning: 많은, level: 1, category: determiner, source: [[basic-vocabulary]] }
- { id: en_307, display: zero, meaning: 영, level: 1, category: number, source: [[numbers-vocabulary]] }
- { id: en_308, display: four, meaning: 넷, level: 1, category: number, source: [[numbers-vocabulary]] }
- { id: en_309, display: five, meaning: 다섯, level: 1, category: number, source: [[numbers-vocabulary]] }
- { id: en_310, display: six, meaning: 여섯, level: 1, category: number, source: [[numbers-vocabulary]] }
- { id: en_311, display: seven, meaning: 일곱, level: 1, category: number, source: [[numbers-vocabulary]] }
- { id: en_312, display: eight, meaning: 여덟, level: 1, category: number, source: [[numbers-vocabulary]] }
- { id: en_313, display: nine, meaning: 아홉, level: 1, category: number, source: [[numbers-vocabulary]] }
- { id: en_314, display: eleven, meaning: 열하나, level: 2, category: number, source: [[numbers-vocabulary]] }
- { id: en_315, display: twelve, meaning: 열둘, level: 2, category: number, source: [[numbers-vocabulary]] }
- { id: en_316, display: thirteen, meaning: 열셋, level: 2, category: number, source: [[numbers-vocabulary]] }
- { id: en_317, display: fourteen, meaning: 열넷, level: 2, category: number, source: [[numbers-vocabulary]] }
- { id: en_318, display: fifteen, meaning: 열다섯, level: 2, category: number, source: [[numbers-vocabulary]] }
- { id: en_319, display: sixteen, meaning: 열여섯, level: 2, category: number, source: [[numbers-vocabulary]] }
- { id: en_320, display: seventeen, meaning: 열일곱, level: 2, category: number, source: [[numbers-vocabulary]] }
- { id: en_321, display: eighteen, meaning: 열여덟, level: 2, category: number, source: [[numbers-vocabulary]] }
- { id: en_322, display: nineteen, meaning: 열아홉, level: 2, category: number, source: [[numbers-vocabulary]] }
- { id: en_323, display: twenty, meaning: 스물, level: 1, category: number, source: [[numbers-vocabulary]] }
- { id: en_324, display: thirty, meaning: 서른, level: 2, category: number, source: [[numbers-vocabulary]] }
- { id: en_325, display: forty, meaning: 마흔, level: 2, category: number, source: [[numbers-vocabulary]] }
- { id: en_326, display: fifty, meaning: 쉰, level: 2, category: number, source: [[numbers-vocabulary]] }
- { id: en_327, display: sixty, meaning: 예순, level: 2, category: number, source: [[numbers-vocabulary]] }
- { id: en_328, display: seventy, meaning: 일흔, level: 2, category: number, source: [[numbers-vocabulary]] }
- { id: en_329, display: eighty, meaning: 여든, level: 2, category: number, source: [[numbers-vocabulary]] }
- { id: en_330, display: ninety, meaning: 아흔, level: 2, category: number, source: [[numbers-vocabulary]] }
- { id: en_331, display: hundred, meaning: 백, level: 1, category: number, source: [[numbers-vocabulary]] }
- { id: en_332, display: thousand, meaning: 천, level: 1, category: number, source: [[numbers-vocabulary]] }
- { id: en_333, display: million, meaning: 백만, level: 1, category: number, source: [[numbers-vocabulary]] }
- { id: en_334, display: billion, meaning: 십억, level: 1, category: number, source: [[numbers-vocabulary]] }
- { id: en_335, display: second, meaning: 둘째, level: 1, category: ordinal, source: [[ordinal-numbers-vocabulary]] }
- { id: en_336, display: third, meaning: 셋째, level: 1, category: ordinal, source: [[ordinal-numbers-vocabulary]] }
- { id: en_337, display: fourth, meaning: 넷째, level: 2, category: ordinal, source: [[ordinal-numbers-vocabulary]] }
- { id: en_338, display: fifth, meaning: 다섯째, level: 2, category: ordinal, source: [[ordinal-numbers-vocabulary]] }
- { id: en_339, display: sixth, meaning: 여섯째, level: 2, category: ordinal, source: [[ordinal-numbers-vocabulary]] }
- { id: en_340, display: seventh, meaning: 일곱째, level: 2, category: ordinal, source: [[ordinal-numbers-vocabulary]] }
- { id: en_341, display: eighth, meaning: 여덟째, level: 2, category: ordinal, source: [[ordinal-numbers-vocabulary]] }
- { id: en_342, display: ninth, meaning: 아홉째, level: 2, category: ordinal, source: [[ordinal-numbers-vocabulary]] }
- { id: en_343, display: tenth, meaning: 열째, level: 2, category: ordinal, source: [[ordinal-numbers-vocabulary]] }
- { id: en_344, display: eleventh, meaning: 열한째, level: 2, category: ordinal, source: [[ordinal-numbers-vocabulary]] }
- { id: en_345, display: twelfth, meaning: 열두째, level: 2, category: ordinal, source: [[ordinal-numbers-vocabulary]] }
- { id: en_346, display: thirteenth, meaning: 열세째, level: 3, category: ordinal, source: [[ordinal-numbers-vocabulary]] }
- { id: en_347, display: twentieth, meaning: 스무째, level: 2, category: ordinal, source: [[ordinal-numbers-vocabulary]] }
- { id: en_348, display: thirtieth, meaning: 서른째, level: 3, category: ordinal, source: [[ordinal-numbers-vocabulary]] }
- { id: en_349, display: fortieth, meaning: 마흔째, level: 3, category: ordinal, source: [[ordinal-numbers-vocabulary]] }
- { id: en_350, display: fiftieth, meaning: 쉰째, level: 3, category: ordinal, source: [[ordinal-numbers-vocabulary]] }
- { id: en_351, display: hundredth, meaning: 백째, level: 3, category: ordinal, source: [[ordinal-numbers-vocabulary]] }
- { id: en_352, display: Monday, meaning: 월요일, level: 1, category: day, source: [[time-vocabulary]] }
- { id: en_353, display: Tuesday, meaning: 화요일, level: 1, category: day, source: [[time-vocabulary]] }
- { id: en_354, display: Wednesday, meaning: 수요일, level: 1, category: day, source: [[time-vocabulary]] }
- { id: en_355, display: Thursday, meaning: 목요일, level: 1, category: day, source: [[time-vocabulary]] }
- { id: en_356, display: Friday, meaning: 금요일, level: 1, category: day, source: [[time-vocabulary]] }
- { id: en_357, display: Saturday, meaning: 토요일, level: 1, category: day, source: [[time-vocabulary]] }
- { id: en_358, display: Sunday, meaning: 일요일, level: 1, category: day, source: [[time-vocabulary]] }
- { id: en_359, display: January, meaning: 1월, level: 1, category: month, source: [[time-vocabulary]] }
- { id: en_360, display: February, meaning: 2월, level: 1, category: month, source: [[time-vocabulary]] }
- { id: en_361, display: March, meaning: 3월, level: 1, category: month, source: [[time-vocabulary]] }
- { id: en_362, display: April, meaning: 4월, level: 1, category: month, source: [[time-vocabulary]] }
- { id: en_363, display: May, meaning: 5월, level: 1, category: month, source: [[time-vocabulary]] }
- { id: en_364, display: June, meaning: 6월, level: 1, category: month, source: [[time-vocabulary]] }
- { id: en_365, display: July, meaning: 7월, level: 1, category: month, source: [[time-vocabulary]] }
- { id: en_366, display: August, meaning: 8월, level: 1, category: month, source: [[time-vocabulary]] }
- { id: en_367, display: September, meaning: 9월, level: 1, category: month, source: [[time-vocabulary]] }
- { id: en_368, display: October, meaning: 10월, level: 1, category: month, source: [[time-vocabulary]] }
- { id: en_369, display: November, meaning: 11월, level: 1, category: month, source: [[time-vocabulary]] }
- { id: en_370, display: December, meaning: 12월, level: 1, category: month, source: [[time-vocabulary]] }
- { id: en_371, display: yesterday, meaning: 어제, level: 1, category: time, source: [[time-vocabulary]] }
- { id: en_372, display: afternoon, meaning: 오후, level: 1, category: time, source: [[time-vocabulary]] }
- { id: en_373, display: evening, meaning: 저녁, level: 1, category: time, source: [[time-vocabulary]] }
- { id: en_374, display: night, meaning: 밤, level: 1, category: time, source: [[time-vocabulary]] }
- { id: en_375, display: dawn, meaning: 새벽, level: 2, category: time, source: [[time-vocabulary]] }
- { id: en_376, display: dusk, meaning: 황혼, level: 2, category: time, source: [[time-vocabulary]] }
- { id: en_377, display: noon, meaning: 정오, level: 1, category: time, source: [[time-vocabulary]] }
- { id: en_378, display: midnight, meaning: 자정, level: 2, category: time, source: [[time-vocabulary]] }
- { id: en_379, display: hour, meaning: 시간, level: 1, category: time, source: [[time-vocabulary]] }
- { id: en_380, display: minute, meaning: 분, level: 1, category: time, source: [[time-vocabulary]] }
- { id: en_381, display: day, meaning: 날, level: 1, category: time, source: [[time-vocabulary]] }
- { id: en_382, display: week, meaning: 주, level: 1, category: time, source: [[time-vocabulary]] }
- { id: en_383, display: month, meaning: 달, level: 1, category: time, source: [[time-vocabulary]] }
- { id: en_384, display: year, meaning: 년, level: 1, category: time, source: [[time-vocabulary]] }
- { id: en_385, display: century, meaning: 세기, level: 2, category: time, source: [[time-vocabulary]] }
- { id: en_386, display: decade, meaning: 10년, level: 2, category: time, source: [[time-vocabulary]] }
- { id: en_387, display: moment, meaning: 순간, level: 1, category: time, source: [[time-vocabulary]] }
- { id: en_388, display: season, meaning: 계절, level: 2, category: time, source: [[time-vocabulary]] }
- { id: en_389, display: spring, meaning: 봄, level: 1, category: time, source: [[time-vocabulary]] }
- { id: en_390, display: summer, meaning: 여름, level: 1, category: time, source: [[time-vocabulary]] }
- { id: en_391, display: autumn, meaning: 가을, level: 1, category: time, source: [[time-vocabulary]] }
- { id: en_392, display: winter, meaning: 겨울, level: 1, category: time, source: [[time-vocabulary]] }
- { id: en_393, display: lion, meaning: 사자, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_394, display: tiger, meaning: 호랑이, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_395, display: elephant, meaning: 코끼리, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_396, display: bear, meaning: 곰, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_397, display: wolf, meaning: 늑대, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_398, display: fox, meaning: 여우, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_399, display: rabbit, meaning: 토끼, level: 1, category: animal, source: [[animals-vocabulary]] }
- { id: en_400, display: mouse, meaning: 쥐, level: 1, category: animal, source: [[animals-vocabulary]] }
- { id: en_401, display: horse, meaning: 말, level: 1, category: animal, source: [[animals-vocabulary]] }
- { id: en_402, display: cow, meaning: 소, level: 1, category: animal, source: [[animals-vocabulary]] }
- { id: en_403, display: pig, meaning: 돼지, level: 1, category: animal, source: [[animals-vocabulary]] }
- { id: en_404, display: sheep, meaning: 양, level: 1, category: animal, source: [[animals-vocabulary]] }
- { id: en_405, display: chicken, meaning: 닭, level: 1, category: animal, source: [[animals-vocabulary]] }
- { id: en_406, display: duck, meaning: 오리, level: 1, category: animal, source: [[animals-vocabulary]] }
- { id: en_407, display: bird, meaning: 새, level: 1, category: animal, source: [[animals-vocabulary]] }
- { id: en_408, display: fish, meaning: 물고기, level: 1, category: animal, source: [[animals-vocabulary]] }
- { id: en_409, display: snake, meaning: 뱀, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_410, display: turtle, meaning: 거북이, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_411, display: frog, meaning: 개구리, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_412, display: butterfly, meaning: 나비, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_413, display: bee, meaning: 벌, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_414, display: ant, meaning: 개미, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_415, display: spider, meaning: 거미, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_416, display: whale, meaning: 고래, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_417, display: dolphin, meaning: 돌고래, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_418, display: shark, meaning: 상어, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_419, display: octopus, meaning: 문어, level: 3, category: animal, source: [[animals-vocabulary]] }
- { id: en_420, display: crab, meaning: 게, level: 3, category: animal, source: [[animals-vocabulary]] }
- { id: en_421, display: eagle, meaning: 독수리, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_422, display: parrot, meaning: 앵무새, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_423, display: penguin, meaning: 펭귄, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_424, display: owl, meaning: 올빼미, level: 3, category: animal, source: [[animals-vocabulary]] }
- { id: en_425, display: crow, meaning: 까마귀, level: 3, category: animal, source: [[animals-vocabulary]] }
- { id: en_426, display: sparrow, meaning: 참새, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_427, display: pigeon, meaning: 비둘기, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_428, display: goat, meaning: 염소, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_429, display: deer, meaning: 사슴, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_430, display: monkey, meaning: 원숭이, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_431, display: panda, meaning: 판다, level: 2, category: animal, source: [[animals-vocabulary]] }
- { id: en_432, display: rice, meaning: 밥, level: 1, category: food, source: [[food-vocabulary]] }
- { id: en_433, display: meat, meaning: 고기, level: 1, category: food, source: [[food-vocabulary]] }
- { id: en_434, display: beef, meaning: 소고기, level: 2, category: food, source: [[food-vocabulary]] }
- { id: en_435, display: pork, meaning: 돼지고기, level: 2, category: food, source: [[food-vocabulary]] }
- { id: en_436, display: egg, meaning: 계란, level: 1, category: food, source: [[food-vocabulary]] }
- { id: en_437, display: cheese, meaning: 치즈, level: 2, category: food, source: [[food-vocabulary]] }
- { id: en_438, display: milk, meaning: 우유, level: 1, category: food, source: [[food-vocabulary]] }
- { id: en_439, display: butter, meaning: 버터, level: 2, category: food, source: [[food-vocabulary]] }
- { id: en_440, display: yogurt, meaning: 요거트, level: 2, category: food, source: [[food-vocabulary]] }
- { id: en_441, display: cream, meaning: 크림, level: 2, category: food, source: [[food-vocabulary]] }
- { id: en_442, display: sugar, meaning: 설탕, level: 1, category: food, source: [[food-vocabulary]] }
- { id: en_443, display: salt, meaning: 소금, level: 1, category: food, source: [[food-vocabulary]] }
- { id: en_444, display: oil, meaning: 기름, level: 1, category: food, source: [[food-vocabulary]] }
- { id: en_445, display: sauce, meaning: 소스, level: 2, category: food, source: [[food-vocabulary]] }
- { id: en_446, display: ketchup, meaning: 케첩, level: 2, category: food, source: [[food-vocabulary]] }
- { id: en_447, display: mustard, meaning: 겨자, level: 2, category: food, source: [[food-vocabulary]] }
- { id: en_448, display: mayonnaise, meaning: 마요네즈, level: 3, category: food, source: [[food-vocabulary]] }
- { id: en_449, display: apple, meaning: 사과, level: 1, category: fruit, source: [[food-vocabulary]] }
- { id: en_450, display: banana, meaning: 바나나, level: 1, category: fruit, source: [[food-vocabulary]] }
- { id: en_451, display: orange, meaning: 오렌지, level: 1, category: fruit, source: [[food-vocabulary]] }
- { id: en_452, display: grape, meaning: 포도, level: 1, category: fruit, source: [[food-vocabulary]] }
- { id: en_453, display: strawberry, meaning: 딸기, level: 2, category: fruit, source: [[food-vocabulary]] }
- { id: en_454, display: watermelon, meaning: 수박, level: 2, category: fruit, source: [[food-vocabulary]] }
- { id: en_455, display: peach, meaning: 복숭아, level: 2, category: fruit, source: [[food-vocabulary]] }
- { id: en_456, display: pear, meaning: 배, level: 1, category: fruit, source: [[food-vocabulary]] }
- { id: en_457, display: pineapple, meaning: 파인애플, level: 3, category: fruit, source: [[food-vocabulary]] }
- { id: en_458, display: mango, meaning: 망고, level: 2, category: fruit, source: [[food-vocabulary]] }
- { id: en_459, display: cherry, meaning: 체리, level: 2, category: fruit, source: [[food-vocabulary]] }
- { id: en_460, display: lemon, meaning: 레몬, level: 2, category: fruit, source: [[food-vocabulary]] }
- { id: en_461, display: lime, meaning: 라임, level: 2, category: fruit, source: [[food-vocabulary]] }
- { id: en_462, display: grapefruit, meaning: 자몽, level: 3, category: fruit, source: [[food-vocabulary]] }
- { id: en_463, display: melon, meaning: 멜론, level: 2, category: fruit, source: [[food-vocabulary]] }
- { id: en_464, display: kiwi, meaning: 키위, level: 2, category: fruit, source: [[food-vocabulary]] }
- { id: en_465, display: carrot, meaning: 당근, level: 2, category: vegetable, source: [[food-vocabulary]] }
- { id: en_466, display: potato, meaning: 감자, level: 1, category: vegetable, source: [[food-vocabulary]] }
- { id: en_467, display: tomato, meaning: 토마토, level: 1, category: vegetable, source: [[food-vocabulary]] }
- { id: en_468, display: onion, meaning: 양파, level: 1, category: vegetable, source: [[food-vocabulary]] }
- { id: en_469, display: garlic, meaning: 마늘, level: 1, category: vegetable, source: [[food-vocabulary]] }
- { id: en_470, display: cucumber, meaning: 오이, level: 2, category: vegetable, source: [[food-vocabulary]] }
- { id: en_471, display: lettuce, meaning: 상추, level: 2, category: vegetable, source: [[food-vocabulary]] }
- { id: en_472, display: cabbage, meaning: 양배추, level: 2, category: vegetable, source: [[food-vocabulary]] }
- { id: en_473, display: broccoli, meaning: 브로콜리, level: 2, category: vegetable, source: [[food-vocabulary]] }
- { id: en_474, display: spinach, meaning: 시금치, level: 2, category: vegetable, source: [[food-vocabulary]] }
- { id: en_475, display: mushroom, meaning: 버섯, level: 2, category: vegetable, source: [[food-vocabulary]] }
- { id: en_476, display: eggplant, meaning: 가지, level: 2, category: vegetable, source: [[food-vocabulary]] }
- { id: en_477, display: corn, meaning: 옥수수, level: 1, category: vegetable, source: [[food-vocabulary]] }
- { id: en_478, display: coffee, meaning: 커피, level: 1, category: drink, source: [[food-vocabulary]] }
- { id: en_479, display: tea, meaning: 차, level: 1, category: drink, source: [[food-vocabulary]] }
- { id: en_480, display: juice, meaning: 주스, level: 1, category: drink, source: [[food-vocabulary]] }
- { id: en_481, display: beer, meaning: 맥주, level: 1, category: drink, source: [[food-vocabulary]] }
- { id: en_482, display: wine, meaning: 와인, level: 2, category: drink, source: [[food-vocabulary]] }
- { id: en_483, display: soda, meaning: 탄산음료, level: 1, category: drink, source: [[food-vocabulary]] }
- { id: en_484, display: smoothie, meaning: 스무디, level: 3, category: drink, source: [[food-vocabulary]] }
- { id: en_485, display: lunch, meaning: 점심식사, level: 1, category: meal, source: [[food-vocabulary]] }
- { id: en_486, display: dinner, meaning: 저녁식사, level: 1, category: meal, source: [[food-vocabulary]] }
- { id: en_487, display: snack, meaning: 간식, level: 1, category: meal, source: [[food-vocabulary]] }
- { id: en_488, display: dessert, meaning: 디저트, level: 2, category: meal, source: [[food-vocabulary]] }
- { id: en_489, display: head, meaning: 머리, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_490, display: hair, meaning: 머리카락, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_491, display: forehead, meaning: 이마, level: 2, category: body, source: [[body-vocabulary]] }
- { id: en_492, display: eye, meaning: 눈, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_493, display: eyebrow, meaning: 눈썹, level: 2, category: body, source: [[body-vocabulary]] }
- { id: en_494, display: nose, meaning: 코, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_495, display: mouth, meaning: 입, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_496, display: lip, meaning: 입술, level: 2, category: body, source: [[body-vocabulary]] }
- { id: en_497, display: tooth, meaning: 이, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_498, display: tongue, meaning: 혀, level: 2, category: body, source: [[body-vocabulary]] }
- { id: en_499, display: ear, meaning: 귀, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_500, display: neck, meaning: 목, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_501, display: shoulder, meaning: 어깨, level: 2, category: body, source: [[body-vocabulary]] }
- { id: en_502, display: arm, meaning: 팔, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_503, display: elbow, meaning: 팔꿈치, level: 2, category: body, source: [[body-vocabulary]] }
- { id: en_504, display: wrist, meaning: 손목, level: 2, category: body, source: [[body-vocabulary]] }
- { id: en_505, display: hand, meaning: 손, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_506, display: finger, meaning: 손가락, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_507, display: thumb, meaning: 엄지, level: 2, category: body, source: [[body-vocabulary]] }
- { id: en_508, display: palm, meaning: 손바닥, level: 2, category: body, source: [[body-vocabulary]] }
- { id: en_509, display: back, meaning: 등, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_510, display: stomach, meaning: 배, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_511, display: waist, meaning: 허리, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_512, display: hip, meaning: 엉덩이, level: 2, category: body, source: [[body-vocabulary]] }
- { id: en_513, display: leg, meaning: 다리, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_514, display: thigh, meaning: 허벅지, level: 2, category: body, source: [[body-vocabulary]] }
- { id: en_515, display: knee, meaning: 무릎, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_516, display: calf, meaning: 종아리, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_517, display: ankle, meaning: 발목, level: 2, category: body, source: [[body-vocabulary]] }
- { id: en_518, display: foot, meaning: 발, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_519, display: toe, meaning: 발가락, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_520, display: skin, meaning: 피부, level: 2, category: body, source: [[body-vocabulary]] }
- { id: en_521, display: bone, meaning: 뼈, level: 2, category: body, source: [[body-vocabulary]] }
- { id: en_522, display: blood, meaning: 피, level: 2, category: body, source: [[body-vocabulary]] }
- { id: en_523, display: heart, meaning: 심장, level: 2, category: body, source: [[body-vocabulary]] }
- { id: en_524, display: lung, meaning: 폐, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_525, display: family, meaning: 가족, level: 1, category: family, source: [[family-vocabulary]] }
- { id: en_526, display: parent, meaning: 부모, level: 1, category: family, source: [[family-vocabulary]] }
- { id: en_527, display: parents, meaning: 부모님, level: 1, category: family, source: [[family-vocabulary]] }
- { id: en_528, display: grandparent, meaning: 조부모, level: 2, category: family, source: [[family-vocabulary]] }
- { id: en_529, display: grandfather, meaning: 할아버지, level: 2, category: family, source: [[family-vocabulary]] }
- { id: en_530, display: grandmother, meaning: 할머니, level: 2, category: family, source: [[family-vocabulary]] }
- { id: en_531, display: uncle, meaning: 삼촌, level: 2, category: family, source: [[family-vocabulary]] }
- { id: en_532, display: cousin, meaning: 사촌, level: 2, category: family, source: [[family-vocabulary]] }
- { id: en_533, display: nephew, meaning: 조카, level: 3, category: family, source: [[family-vocabulary]] }
- { id: en_534, display: niece, meaning: 조카딸, level: 3, category: family, source: [[family-vocabulary]] }
- { id: en_535, display: brother, meaning: 형제, level: 1, category: family, source: [[family-vocabulary]] }
- { id: en_536, display: sister, meaning: 자매, level: 1, category: family, source: [[family-vocabulary]] }
- { id: en_537, display: son, meaning: 아들, level: 1, category: family, source: [[family-vocabulary]] }
- { id: en_538, display: daughter, meaning: 딸, level: 1, category: family, source: [[family-vocabulary]] }
- { id: en_539, display: husband, meaning: 남편, level: 1, category: family, source: [[family-vocabulary]] }
- { id: en_540, display: wife, meaning: 아내, level: 1, category: family, source: [[family-vocabulary]] }
- { id: en_541, display: grandson, meaning: 손자, level: 2, category: family, source: [[family-vocabulary]] }
- { id: en_542, display: granddaughter, meaning: 손녀, level: 2, category: family, source: [[family-vocabulary]] }
- { id: en_543, display: father-in-law, meaning: 시아버지, level: 3, category: family, source: [[family-vocabulary]] }
- { id: en_544, display: mother-in-law, meaning: 시어머니, level: 3, category: family, source: [[family-vocabulary]] }
- { id: en_545, display: brother-in-law, meaning: 형부, level: 3, category: family, source: [[family-vocabulary]] }
- { id: en_546, display: sister-in-law, meaning: 올케, level: 3, category: family, source: [[family-vocabulary]] }
- { id: en_547, display: twin, meaning: 쌍둥이, level: 3, category: family, source: [[family-vocabulary]] }
- { id: en_548, display: orphan, meaning: 고아, level: 3, category: family, source: [[family-vocabulary]] }
- { id: en_549, display: friend, meaning: 친구, level: 1, category: family, source: [[family-vocabulary]] }
- { id: en_550, display: neighbor, meaning: 이웃, level: 1, category: family, source: [[family-vocabulary]] }
- { id: en_551, display: classmate, meaning: 급우, level: 3, category: family, source: [[family-vocabulary]] }
- { id: en_552, display: colleague, meaning: 동료, level: 2, category: family, source: [[family-vocabulary]] }
- { id: en_553, display: boss, meaning: 상사, level: 2, category: family, source: [[family-vocabulary]] }
- { id: en_554, display: subordinate, meaning: 부하, level: 3, category: family, source: [[family-vocabulary]] }
- { id: en_555, display: teacher, meaning: 선생님, level: 1, category: family, source: [[family-vocabulary]] }
- { id: en_556, display: student, meaning: 학생, level: 1, category: family, source: [[family-vocabulary]] }
- { id: en_557, display: white, meaning: 하양, level: 1, category: color, source: [[colors-vocabulary]] }
- { id: en_558, display: black, meaning: 검정, level: 1, category: color, source: [[colors-vocabulary]] }
- { id: en_559, display: gray, meaning: 회색, level: 2, category: color, source: [[colors-vocabulary]] }
- { id: en_560, display: silver, meaning: 은색, level: 2, category: color, source: [[colors-vocabulary]] }
- { id: en_561, display: gold, meaning: 금색, level: 1, category: color, source: [[colors-vocabulary]] }
- { id: en_562, display: yellow, meaning: 노란색, level: 1, category: color, source: [[colors-vocabulary]] }
- { id: en_563, display: pink, meaning: 분홍색, level: 1, category: color, source: [[colors-vocabulary]] }
- { id: en_564, display: purple, meaning: 보라색, level: 2, category: color, source: [[colors-vocabulary]] }
- { id: en_565, display: brown, meaning: 갈색, level: 1, category: color, source: [[colors-vocabulary]] }
- { id: en_566, display: beige, meaning: 베이지, level: 2, category: color, source: [[colors-vocabulary]] }
- { id: en_567, display: navy, meaning: 남색, level: 2, category: color, source: [[colors-vocabulary]] }
- { id: en_568, display: teal, meaning: 청록색, level: 3, category: color, source: [[colors-vocabulary]] }
- { id: en_569, display: maroon, meaning: 적갈색, level: 3, category: color, source: [[colors-vocabulary]] }
- { id: en_570, display: violet, meaning: 보라, level: 2, category: color, source: [[colors-vocabulary]] }
- { id: en_571, display: indigo, meaning: 남보라, level: 3, category: color, source: [[colors-vocabulary]] }
- { id: en_572, display: turquoise, meaning: 터키석색, level: 3, category: color, source: [[colors-vocabulary]] }
- { id: en_573, display: tan, meaning: 황갈색, level: 3, category: color, source: [[colors-vocabulary]] }
- { id: en_574, display: cyan, meaning: 시안, level: 3, category: color, source: [[colors-vocabulary]] }
- { id: en_575, display: magenta, meaning: 마젠타, level: 3, category: color, source: [[colors-vocabulary]] }
- { id: en_576, display: ivory, meaning: 상아색, level: 3, category: color, source: [[colors-vocabulary]] }
- { id: en_577, display: azure, meaning: 하늘색, level: 3, category: color, source: [[colors-vocabulary]] }
- { id: en_578, display: rain, meaning: 비, level: 1, category: weather, source: [[weather-vocabulary]] }
- { id: en_579, display: snow, meaning: 눈, level: 1, category: weather, source: [[weather-vocabulary]] }
- { id: en_580, display: wind, meaning: 바람, level: 1, category: weather, source: [[weather-vocabulary]] }
- { id: en_581, display: storm, meaning: 폭풍, level: 2, category: weather, source: [[weather-vocabulary]] }
- { id: en_582, display: thunder, meaning: 천둥, level: 2, category: weather, source: [[weather-vocabulary]] }
- { id: en_583, display: lightning, meaning: 번개, level: 2, category: weather, source: [[weather-vocabulary]] }
- { id: en_584, display: cloud, meaning: 구름, level: 1, category: weather, source: [[weather-vocabulary]] }
- { id: en_585, display: sun, meaning: 태양, level: 1, category: weather, source: [[weather-vocabulary]] }
- { id: en_586, display: cloudy, meaning: 흐린, level: 1, category: weather, source: [[weather-vocabulary]] }
- { id: en_587, display: sunny, meaning: 맑은, level: 1, category: weather, source: [[weather-vocabulary]] }
- { id: en_588, display: rainy, meaning: 비 내리는, level: 1, category: weather, source: [[weather-vocabulary]] }
- { id: en_589, display: snowy, meaning: 눈 내리는, level: 1, category: weather, source: [[weather-vocabulary]] }
- { id: en_590, display: windy, meaning: 바람 부는, level: 1, category: weather, source: [[weather-vocabulary]] }
- { id: en_591, display: stormy, meaning: 폭풍의, level: 2, category: weather, source: [[weather-vocabulary]] }
- { id: en_592, display: fog, meaning: 안개, level: 2, category: weather, source: [[weather-vocabulary]] }
- { id: en_593, display: mist, meaning: 실안개, level: 3, category: weather, source: [[weather-vocabulary]] }
- { id: en_594, display: sky, meaning: 하늘, level: 1, category: weather, source: [[weather-vocabulary]] }
- { id: en_595, display: sunshine, meaning: 햇빛, level: 2, category: weather, source: [[weather-vocabulary]] }
- { id: en_596, display: shadow, meaning: 그림자, level: 2, category: weather, source: [[weather-vocabulary]] }
- { id: en_597, display: rainbow, meaning: 무지개, level: 2, category: weather, source: [[weather-vocabulary]] }
- { id: en_598, display: dew, meaning: 이슬, level: 3, category: weather, source: [[weather-vocabulary]] }
- { id: en_599, display: frost, meaning: 서리, level: 2, category: weather, source: [[weather-vocabulary]] }
- { id: en_600, display: hail, meaning: 우박, level: 3, category: weather, source: [[weather-vocabulary]] }
- { id: en_601, display: typhoon, meaning: 태풍, level: 2, category: weather, source: [[weather-vocabulary]] }
- { id: en_602, display: hurricane, meaning: 허리케인, level: 3, category: weather, source: [[weather-vocabulary]] }
- { id: en_603, display: tornado, meaning: 토네이도, level: 3, category: weather, source: [[weather-vocabulary]] }
- { id: en_604, display: shirt, meaning: 셔츠, level: 1, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_605, display: pants, meaning: 바지, level: 1, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_606, display: dress, meaning: 드레스, level: 1, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_607, display: skirt, meaning: 치마, level: 2, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_608, display: jacket, meaning: 재킷, level: 1, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_609, display: coat, meaning: 코트, level: 1, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_610, display: sweater, meaning: 스웨터, level: 1, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_611, display: t-shirt, meaning: 티셔츠, level: 1, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_612, display: jeans, meaning: 청바지, level: 1, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_613, display: shorts, meaning: 반바지, level: 2, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_614, display: underwear, meaning: 속옷, level: 2, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_615, display: socks, meaning: 양말, level: 1, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_616, display: shoes, meaning: 신발, level: 1, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_617, display: boots, meaning: 부츠, level: 1, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_618, display: sandals, meaning: 샌들, level: 2, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_619, display: sneakers, meaning: 운동화, level: 2, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_620, display: hat, meaning: 모자, level: 1, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_621, display: cap, meaning: 캡, level: 1, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_622, display: scarf, meaning: 스카프, level: 2, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_623, display: gloves, meaning: 장갑, level: 2, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_624, display: belt, meaning: 벨트, level: 2, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_625, display: tie, meaning: 넥타이, level: 2, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_626, display: pajamas, meaning: 잠옷, level: 2, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_627, display: uniform, meaning: 유니폼, level: 2, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_628, display: vest, meaning: 조끼, level: 2, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_629, display: blouse, meaning: 블라우스, level: 2, category: clothing, source: [[clothing-vocabulary]] }
- { id: en_630, display: north, meaning: 북, level: 1, category: direction, source: [[directions-vocabulary]] }
- { id: en_631, display: south, meaning: 남, level: 1, category: direction, source: [[directions-vocabulary]] }
- { id: en_632, display: east, meaning: 동, level: 1, category: direction, source: [[directions-vocabulary]] }
- { id: en_633, display: west, meaning: 서, level: 1, category: direction, source: [[directions-vocabulary]] }
- { id: en_634, display: up, meaning: 위, level: 1, category: direction, source: [[directions-vocabulary]] }
- { id: en_635, display: down, meaning: 아래, level: 1, category: direction, source: [[directions-vocabulary]] }
- { id: en_636, display: front, meaning: 앞, level: 1, category: direction, source: [[directions-vocabulary]] }
- { id: en_637, display: inside, meaning: 안, level: 1, category: direction, source: [[directions-vocabulary]] }
- { id: en_638, display: outside, meaning: 밖, level: 1, category: direction, source: [[directions-vocabulary]] }
- { id: en_639, display: everywhere, meaning: 모든 곳, level: 2, category: direction, source: [[directions-vocabulary]] }
- { id: en_640, display: nowhere, meaning: 아무 데도, level: 3, category: direction, source: [[directions-vocabulary]] }
- { id: en_641, display: somewhere, meaning: 어딘가, level: 2, category: direction, source: [[directions-vocabulary]] }
- { id: en_642, display: anywhere, meaning: 어디든, level: 2, category: direction, source: [[directions-vocabulary]] }
- { id: en_643, display: forward, meaning: 앞으로, level: 1, category: direction, source: [[directions-vocabulary]] }
- { id: en_644, display: backward, meaning: 뒤로, level: 2, category: direction, source: [[directions-vocabulary]] }
- { id: en_645, display: around, meaning: 주변, level: 2, category: direction, source: [[directions-vocabulary]] }
- { id: en_646, display: across, meaning: 건너편, level: 2, category: direction, source: [[directions-vocabulary]] }
- { id: en_647, display: along, meaning: 따라, level: 2, category: direction, source: [[directions-vocabulary]] }
- { id: en_648, display: toward, meaning: ~쪽으로, level: 2, category: direction, source: [[directions-vocabulary]] }
- { id: en_649, display: away, meaning: 멀리, level: 2, category: direction, source: [[directions-vocabulary]] }
- { id: en_650, display: middle, meaning: 중간, level: 1, category: direction, source: [[directions-vocabulary]] }
- { id: en_651, display: center, meaning: 중앙, level: 1, category: direction, source: [[directions-vocabulary]] }
- { id: en_652, display: edge, meaning: 가장자리, level: 2, category: direction, source: [[directions-vocabulary]] }
- { id: en_653, display: top, meaning: 꼭대기, level: 1, category: direction, source: [[directions-vocabulary]] }
- { id: en_654, display: bottom, meaning: 바닥, level: 1, category: direction, source: [[directions-vocabulary]] }
- { id: en_655, display: side, meaning: 옆, level: 1, category: direction, source: [[directions-vocabulary]] }
- { id: en_656, display: corner, meaning: 모퉁이, level: 2, category: direction, source: [[directions-vocabulary]] }
- { id: en_657, display: health, meaning: 건강, level: 1, category: health, source: [[health-vocabulary]] }
- { id: en_658, display: sick, meaning: 아픈, level: 1, category: health, source: [[health-vocabulary]] }
- { id: en_659, display: illness, meaning: 병, level: 2, category: health, source: [[health-vocabulary]] }
- { id: en_660, display: disease, meaning: 질병, level: 2, category: health, source: [[health-vocabulary]] }
- { id: en_661, display: fever, meaning: 열, level: 1, category: health, source: [[health-vocabulary]] }
- { id: en_662, display: cough, meaning: 기침, level: 1, category: health, source: [[health-vocabulary]] }
- { id: en_663, display: headache, meaning: 두통, level: 1, category: health, source: [[health-vocabulary]] }
- { id: en_664, display: stomachache, meaning: 복통, level: 2, category: health, source: [[health-vocabulary]] }
- { id: en_665, display: toothache, meaning: 치통, level: 2, category: health, source: [[health-vocabulary]] }
- { id: en_666, display: flu, meaning: 독감, level: 2, category: health, source: [[health-vocabulary]] }
- { id: en_667, display: allergy, meaning: 알레르기, level: 3, category: health, source: [[health-vocabulary]] }
- { id: en_668, display: medicine, meaning: 약, level: 1, category: health, source: [[health-vocabulary]] }
- { id: en_669, display: pill, meaning: 알약, level: 2, category: health, source: [[health-vocabulary]] }
- { id: en_670, display: bandage, meaning: 붕대, level: 2, category: health, source: [[health-vocabulary]] }
- { id: en_671, display: doctor, meaning: 의사, level: 1, category: health, source: [[health-vocabulary]] }
- { id: en_672, display: nurse, meaning: 간호사, level: 2, category: health, source: [[health-vocabulary]] }
- { id: en_673, display: pharmacy, meaning: 약국, level: 2, category: health, source: [[health-vocabulary]] }
- { id: en_674, display: pain, meaning: 통증, level: 2, category: health, source: [[health-vocabulary]] }
- { id: en_675, display: temperature, meaning: 체온, level: 2, category: health, source: [[health-vocabulary]] }
- { id: en_676, display: blood pressure, meaning: 혈압, level: 3, category: health, source: [[health-vocabulary]] }
- { id: en_677, display: school, meaning: 학교, level: 1, category: education, source: [[education-vocabulary]] }
- { id: en_678, display: class, meaning: 수업, level: 1, category: education, source: [[education-vocabulary]] }
- { id: en_679, display: lesson, meaning: 레슨, level: 1, category: education, source: [[education-vocabulary]] }
- { id: en_680, display: homework, meaning: 숙제, level: 1, category: education, source: [[education-vocabulary]] }
- { id: en_681, display: test, meaning: 시험, level: 1, category: education, source: [[education-vocabulary]] }
- { id: en_682, display: exam, meaning: 시험, level: 2, category: education, source: [[education-vocabulary]] }
- { id: en_683, display: grade, meaning: 성적, level: 2, category: education, source: [[education-vocabulary]] }
- { id: en_684, display: score, meaning: 점수, level: 2, category: education, source: [[education-vocabulary]] }
- { id: en_685, display: pen, meaning: 펜, level: 1, category: education, source: [[education-vocabulary]] }
- { id: en_686, display: pencil, meaning: 연필, level: 1, category: education, source: [[education-vocabulary]] }
- { id: en_687, display: paper, meaning: 종이, level: 1, category: education, source: [[education-vocabulary]] }
- { id: en_688, display: notebook, meaning: 공책, level: 1, category: education, source: [[education-vocabulary]] }
- { id: en_689, display: desk, meaning: 책상, level: 1, category: education, source: [[education-vocabulary]] }
- { id: en_690, display: chair, meaning: 의자, level: 1, category: education, source: [[education-vocabulary]] }
- { id: en_691, display: board, meaning: 칠판, level: 2, category: education, source: [[education-vocabulary]] }
- { id: en_692, display: library, meaning: 도서관, level: 1, category: education, source: [[education-vocabulary]] }
- { id: en_693, display: university, meaning: 대학교, level: 2, category: education, source: [[education-vocabulary]] }
- { id: en_694, display: college, meaning: 대학, level: 1, category: education, source: [[education-vocabulary]] }
- { id: en_695, display: graduation, meaning: 졸업, level: 2, category: education, source: [[education-vocabulary]] }
- { id: en_696, display: subject, meaning: 과목, level: 2, category: education, source: [[education-vocabulary]] }
- { id: en_697, display: math, meaning: 수학, level: 1, category: education, source: [[education-vocabulary]] }
- { id: en_698, display: science, meaning: 과학, level: 1, category: education, source: [[education-vocabulary]] }
- { id: en_699, display: history, meaning: 역사, level: 1, category: education, source: [[education-vocabulary]] }
- { id: en_700, display: geography, meaning: 지리, level: 2, category: education, source: [[education-vocabulary]] }
- { id: en_701, display: music, meaning: 음악, level: 1, category: education, source: [[education-vocabulary]] }
- { id: en_702, display: art, meaning: 예술, level: 1, category: education, source: [[education-vocabulary]] }
```

## 추가 어휘 Batch 2 (Expanded 2026-07-30) — 234 entries

```yaml
- { id: en_703, display: nail, meaning: 손톱, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_704, display: thumbnail, meaning: 엄지손톱, level: 2, category: body, source: [[body-vocabulary]] }
- { id: en_705, display: heel, meaning: 발뒤꿈치, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_706, display: sole, meaning: 발바닥, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_707, display: rib, meaning: 갈비뼈, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_708, display: spine, meaning: 척추, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_709, display: skull, meaning: 두개골, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_710, display: jaw, meaning: 턱, level: 2, category: body, source: [[body-vocabulary]] }
- { id: en_711, display: chin, meaning: 턱, level: 2, category: body, source: [[body-vocabulary]] }
- { id: en_712, display: cheek, meaning: 볼, level: 1, category: body, source: [[body-vocabulary]] }
- { id: en_713, display: eyelid, meaning: 눈꺼풀, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_714, display: pupil, meaning: 동공, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_715, display: iris, meaning: 홍채, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_716, display: nostril, meaning: 콧구멍, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_717, display: molar, meaning: 어금니, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_718, display: gum, meaning: 잇몸, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_719, display: uvula, meaning: 목젖, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_720, display: windpipe, meaning: 기관, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_721, display: liver, meaning: 간, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_722, display: kidney, meaning: 신장, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_723, display: bladder, meaning: 방광, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_724, display: pancreas, meaning: 이자, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_725, display: intestine, meaning: 장, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_726, display: muscle, meaning: 근육, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_727, display: nerve, meaning: 신경, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_728, display: vein, meaning: 정맥, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_729, display: artery, meaning: 동맥, level: 3, category: body, source: [[body-vocabulary]] }
- { id: en_730, display: sad, meaning: 슬픈, level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_731, display: angry, meaning: 화난, level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_732, display: tired, meaning: 피곤한, level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_733, display: thirsty, meaning: 목마른, level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_734, display: sleepy, meaning: 졸린, level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_735, display: bored, meaning: 지루한, level: 2, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_736, display: excited, meaning: 신난, level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_737, display: nervous, meaning: 긴장된, level: 2, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_738, display: worried, meaning: 걱정하는, level: 2, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_739, display: scared, meaning: 무서운, level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_740, display: surprised, meaning: 놀란, level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_741, display: embarrassed, meaning: 당황한, level: 2, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_742, display: proud, meaning: 자랑스러운, level: 2, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_743, display: jealous, meaning: 질투하는, level: 2, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_744, display: lonely, meaning: 외로운, level: 1, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_745, display: disappointed, meaning: 실망한, level: 2, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_746, display: frustrated, meaning: 좌절한, level: 2, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_747, display: grateful, meaning: 감사하는, level: 2, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_748, display: hopeful, meaning: 희망적인, level: 2, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_749, display: relaxed, meaning: 편안한, level: 2, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_750, display: shy, meaning: 수줍은, level: 2, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_751, display: stressed, meaning: 스트레스받는, level: 2, category: emotion, source: [[emotions-personality-vocabulary]] }
- { id: en_752, display: kind, meaning: 친절한, level: 1, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_753, display: mean, meaning: 무서운, level: 2, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_754, display: nice, meaning: 좋은, level: 1, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_755, display: cruel, meaning: 잔인한, level: 3, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_756, display: smart, meaning: 똑똑한, level: 1, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_757, display: stupid, meaning: 멍청한, level: 2, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_758, display: funny, meaning: 재미있는, level: 1, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_759, display: serious, meaning: 심각한, level: 2, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_760, display: quiet, meaning: 조용한, level: 1, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_761, display: loud, meaning: 시끄러운, level: 2, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_762, display: polite, meaning: 정중한, level: 2, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_763, display: rude, meaning: 무례한, level: 2, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_764, display: honest, meaning: 정직한, level: 2, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_765, display: dishonest, meaning: 부정직한, level: 3, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_766, display: patient, meaning: 인내심 있는, level: 2, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_767, display: impatient, meaning: 성급한, level: 3, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_768, display: generous, meaning: 관대한, level: 3, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_769, display: selfish, meaning: 이기적인, level: 3, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_770, display: brave, meaning: 용감한, level: 2, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_771, display: cowardly, meaning: 겁 많은, level: 3, category: personality, source: [[emotions-personality-vocabulary]] }
- { id: en_772, display: bamboo, meaning: 대나무, level: 2, category: nature, source: [[nature-vocabulary]] }
- { id: en_773, display: cactus, meaning: 선인장, level: 3, category: nature, source: [[nature-vocabulary]] }
- { id: en_774, display: willow, meaning: 버드나무, level: 2, category: nature, source: [[nature-vocabulary]] }
- { id: en_775, display: maple, meaning: 단풍나무, level: 2, category: nature, source: [[nature-vocabulary]] }
- { id: en_776, display: pine, meaning: 소나무, level: 2, category: nature, source: [[nature-vocabulary]] }
- { id: en_777, display: cypress, meaning: 측백나무, level: 3, category: nature, source: [[nature-vocabulary]] }
- { id: en_778, display: elm, meaning: 느릅나무, level: 3, category: nature, source: [[nature-vocabulary]] }
- { id: en_779, display: oak, meaning: 참나무, level: 2, category: nature, source: [[nature-vocabulary]] }
- { id: en_780, display: cedar, meaning: 삼나무, level: 3, category: nature, source: [[nature-vocabulary]] }
- { id: en_781, display: rose, meaning: 장미, level: 2, category: nature, source: [[nature-vocabulary]] }
- { id: en_782, display: tulip, meaning: 튤립, level: 2, category: nature, source: [[nature-vocabulary]] }
- { id: en_783, display: orchid, meaning: 난초, level: 3, category: nature, source: [[nature-vocabulary]] }
- { id: en_784, display: lily, meaning: 백합, level: 2, category: nature, source: [[nature-vocabulary]] }
- { id: en_785, display: sunflower, meaning: 해바라기, level: 2, category: nature, source: [[nature-vocabulary]] }
- { id: en_786, display: lavender, meaning: 라벤더, level: 3, category: nature, source: [[nature-vocabulary]] }
- { id: en_787, display: jasmine, meaning: 자스민, level: 3, category: nature, source: [[nature-vocabulary]] }
- { id: en_788, display: peony, meaning: 모란, level: 3, category: nature, source: [[nature-vocabulary]] }
- { id: en_789, display: chrysanthemum, meaning: 국화, level: 3, category: nature, source: [[nature-vocabulary]] }
- { id: en_790, display: carnation, meaning: 카네이션, level: 3, category: nature, source: [[nature-vocabulary]] }
- { id: en_791, display: car, meaning: 자동차, level: 1, category: transport, source: [[transportation-vocabulary]] }
- { id: en_792, display: plane, meaning: 비행기, level: 1, category: transport, source: [[transportation-vocabulary]] }
- { id: en_793, display: ship, meaning: 배, level: 1, category: transport, source: [[transportation-vocabulary]] }
- { id: en_794, display: bicycle, meaning: 자전거, level: 1, category: transport, source: [[transportation-vocabulary]] }
- { id: en_795, display: motorcycle, meaning: 오토바이, level: 2, category: transport, source: [[transportation-vocabulary]] }
- { id: en_796, display: truck, meaning: 트럭, level: 2, category: transport, source: [[transportation-vocabulary]] }
- { id: en_797, display: helicopter, meaning: 헬리콥터, level: 3, category: transport, source: [[transportation-vocabulary]] }
- { id: en_798, display: scooter, meaning: 스쿠터, level: 2, category: transport, source: [[transportation-vocabulary]] }
- { id: en_799, display: van, meaning: 밴, level: 2, category: transport, source: [[transportation-vocabulary]] }
- { id: en_800, display: boat, meaning: 보트, level: 2, category: transport, source: [[transportation-vocabulary]] }
- { id: en_801, display: yacht, meaning: 요트, level: 3, category: transport, source: [[transportation-vocabulary]] }
- { id: en_802, display: ferry, meaning: 페리, level: 3, category: transport, source: [[transportation-vocabulary]] }
- { id: en_803, display: rocket, meaning: 로켓, level: 3, category: transport, source: [[transportation-vocabulary]] }
- { id: en_804, display: submarine, meaning: 잠수함, level: 3, category: transport, source: [[transportation-vocabulary]] }
- { id: en_805, display: sled, meaning: 썰매, level: 3, category: transport, source: [[transportation-vocabulary]] }
- { id: en_806, display: skateboard, meaning: 스케이트보드, level: 3, category: transport, source: [[transportation-vocabulary]] }
- { id: en_807, display: wheelchair, meaning: 휠체어, level: 3, category: transport, source: [[transportation-vocabulary]] }
- { id: en_808, display: computer, meaning: 컴퓨터, level: 1, category: tech, source: [[technology-vocabulary]] }
- { id: en_809, display: phone, meaning: 전화, level: 1, category: tech, source: [[technology-vocabulary]] }
- { id: en_810, display: television, meaning: 텔레비전, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_811, display: radio, meaning: 라디오, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_812, display: camera, meaning: 카메라, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_813, display: keyboard, meaning: 키보드, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_814, display: screen, meaning: 화면, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_815, display: monitor, meaning: 모니터, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_816, display: printer, meaning: 프린터, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_817, display: scanner, meaning: 스캐너, level: 3, category: tech, source: [[technology-vocabulary]] }
- { id: en_818, display: tablet, meaning: 태블릿, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_819, display: laptop, meaning: 노트북, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_820, display: desktop, meaning: 데스크톱, level: 3, category: tech, source: [[technology-vocabulary]] }
- { id: en_821, display: internet, meaning: 인터넷, level: 1, category: tech, source: [[technology-vocabulary]] }
- { id: en_822, display: website, meaning: 웹사이트, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_823, display: email, meaning: 이메일, level: 1, category: tech, source: [[technology-vocabulary]] }
- { id: en_824, display: app, meaning: 앱, level: 1, category: tech, source: [[technology-vocabulary]] }
- { id: en_825, display: software, meaning: 소프트웨어, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_826, display: hardware, meaning: 하드웨어, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_827, display: battery, meaning: 배터리, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_828, display: cable, meaning: 케이블, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_829, display: charger, meaning: 충전기, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_830, display: headphones, meaning: 헤드폰, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_831, display: speaker, meaning: 스피커, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_832, display: microphone, meaning: 마이크, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_833, display: projector, meaning: 프로젝터, level: 3, category: tech, source: [[technology-vocabulary]] }
- { id: en_834, display: router, meaning: 라우터, level: 3, category: tech, source: [[technology-vocabulary]] }
- { id: en_835, display: modem, meaning: 모뎀, level: 3, category: tech, source: [[technology-vocabulary]] }
- { id: en_836, display: server, meaning: 서버, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_837, display: database, meaning: 데이터베이스, level: 3, category: tech, source: [[technology-vocabulary]] }
- { id: en_838, display: backup, meaning: 백업, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_839, display: password, meaning: 비밀번호, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_840, display: username, meaning: 사용자 이름, level: 2, category: tech, source: [[technology-vocabulary]] }
- { id: en_841, display: suitcase, meaning: 여행가방, level: 2, category: travel, source: [[travel]] }
- { id: en_842, display: backpack, meaning: 배낭, level: 1, category: travel, source: [[travel]] }
- { id: en_843, display: hostel, meaning: 호스텔, level: 2, category: travel, source: [[travel]] }
- { id: en_844, display: check-in, meaning: 체크인, level: 2, category: travel, source: [[travel]] }
- { id: en_845, display: check-out, meaning: 체크아웃, level: 2, category: travel, source: [[travel]] }
- { id: en_846, display: elevator, meaning: 엘리베이터, level: 2, category: travel, source: [[travel]] }
- { id: en_847, display: stairs, meaning: 계단, level: 1, category: travel, source: [[travel]] }
- { id: en_848, display: lobby, meaning: 로비, level: 2, category: travel, source: [[travel]] }
- { id: en_849, display: reception, meaning: 프론트, level: 2, category: travel, source: [[travel]] }
- { id: en_850, display: gate, meaning: 게이트, level: 2, category: travel, source: [[travel]] }
- { id: en_851, display: runway, meaning: 활주로, level: 3, category: travel, source: [[travel]] }
- { id: en_852, display: terminal, meaning: 터미널, level: 2, category: travel, source: [[travel]] }
- { id: en_853, display: security, meaning: 보안, level: 1, category: travel, source: [[travel]] }
- { id: en_854, display: departure, meaning: 출발, level: 2, category: travel, source: [[travel]] }
- { id: en_855, display: arrival, meaning: 도착, level: 2, category: travel, source: [[travel]] }
- { id: en_856, display: delay, meaning: 지연, level: 2, category: travel, source: [[travel]] }
- { id: en_857, display: cancel, meaning: 취소, level: 1, category: travel, source: [[travel]] }
- { id: en_858, display: refund, meaning: 환불, level: 2, category: travel, source: [[travel]] }
- { id: en_859, display: visa, meaning: 비자, level: 2, category: travel, source: [[travel]] }
- { id: en_860, display: currency, meaning: 통화, level: 2, category: travel, source: [[travel]] }
- { id: en_861, display: exchange, meaning: 환전, level: 2, category: travel, source: [[travel]] }
- { id: en_862, display: tourist, meaning: 관광객, level: 2, category: travel, source: [[travel]] }
- { id: en_863, display: compass, meaning: 나침반, level: 3, category: travel, source: [[travel]] }
- { id: en_864, display: destination, meaning: 목적지, level: 2, category: travel, source: [[travel]] }
- { id: en_865, display: business, meaning: 사업, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_866, display: company, meaning: 회사, level: 1, category: business, source: [[business-vocabulary]] }
- { id: en_867, display: office, meaning: 사무실, level: 1, category: business, source: [[business-vocabulary]] }
- { id: en_868, display: meeting, meaning: 회의, level: 1, category: business, source: [[business-vocabulary]] }
- { id: en_869, display: employee, meaning: 직원, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_870, display: manager, meaning: 매니저, level: 1, category: business, source: [[business-vocabulary]] }
- { id: en_871, display: salary, meaning: 월급, level: 1, category: business, source: [[business-vocabulary]] }
- { id: en_872, display: job, meaning: 직업, level: 1, category: business, source: [[business-vocabulary]] }
- { id: en_873, display: career, meaning: 경력, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_874, display: project, meaning: 프로젝트, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_875, display: task, meaning: 과제, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_876, display: deadline, meaning: 마감, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_877, display: report, meaning: 보고서, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_878, display: conference, meaning: 회의, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_879, display: phone call, meaning: 전화 통화, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_880, display: schedule, meaning: 일정, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_881, display: appointment, meaning: 약속, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_882, display: client, meaning: 고객, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_883, display: customer, meaning: 손님, level: 1, category: business, source: [[business-vocabulary]] }
- { id: en_884, display: contract, meaning: 계약, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_885, display: agreement, meaning: 합의, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_886, display: invoice, meaning: 청구서, level: 3, category: business, source: [[business-vocabulary]] }
- { id: en_887, display: payment, meaning: 결제, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_888, display: bonus, meaning: 보너스, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_889, display: promotion, meaning: 승진, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_890, display: interview, meaning: 면접, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_891, display: resume, meaning: 이력서, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_892, display: hire, meaning: 고용, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_893, display: fire, meaning: 해고, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_894, display: resign, meaning: 사임, level: 3, category: business, source: [[business-vocabulary]] }
- { id: en_895, display: retire, meaning: 은퇴, level: 3, category: business, source: [[business-vocabulary]] }
- { id: en_896, display: overtime, meaning: 야근, level: 2, category: business, source: [[business-vocabulary]] }
- { id: en_897, display: hey, meaning: 이봐, level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: en_898, display: bye, meaning: 잘 가, level: 1, category: greeting, source: [[basic-vocabulary]] }
- { id: en_899, display: farewell, meaning: 이별, level: 3, category: greeting, source: [[basic-vocabulary]] }
- { id: en_900, display: welcome, meaning: 환영, level: 2, category: greeting, source: [[basic-vocabulary]] }
- { id: en_901, display: congratulations, meaning: 축하, level: 2, category: greeting, source: [[basic-vocabulary]] }
- { id: en_902, display: pardon, meaning: 실례, level: 3, category: basic, source: [[basic-vocabulary]] }
- { id: en_903, display: excuse me, meaning: 실례합니다, level: 2, category: basic, source: [[basic-vocabulary]] }
- { id: en_904, display: thank you, meaning: 고마워요, level: 1, category: basic, source: [[basic-vocabulary]] }
- { id: en_905, display: cheers, meaning: 건배, level: 2, category: basic, source: [[basic-vocabulary]] }
- { id: en_906, display: good luck, meaning: 행운을 빌어, level: 2, category: basic, source: [[basic-vocabulary]] }
- { id: en_907, display: take care, meaning: 잘 지내, level: 2, category: basic, source: [[basic-vocabulary]] }
- { id: en_908, display: see you, meaning: 또 봐, level: 1, category: basic, source: [[basic-vocabulary]] }
- { id: en_909, display: welcome back, meaning: 다시 오신 걸 환영, level: 2, category: basic, source: [[basic-vocabulary]] }
- { id: en_910, display: what, meaning: 무엇, level: 1, category: question, source: [[basic-vocabulary]] }
- { id: en_911, display: where, meaning: 어디, level: 1, category: question, source: [[basic-vocabulary]] }
- { id: en_912, display: why, meaning: 왜, level: 1, category: question, source: [[basic-vocabulary]] }
- { id: en_913, display: how, meaning: 어떻게, level: 1, category: question, source: [[basic-vocabulary]] }
- { id: en_914, display: who, meaning: 누구, level: 1, category: question, source: [[basic-vocabulary]] }
- { id: en_915, display: whose, meaning: 누구의, level: 2, category: question, source: [[basic-vocabulary]] }
- { id: en_916, display: which, meaning: 어느, level: 2, category: question, source: [[basic-vocabulary]] }
- { id: en_917, display: how many, meaning: 몇 개, level: 2, category: question, source: [[basic-vocabulary]] }
- { id: en_918, display: how much, meaning: 얼마나, level: 2, category: question, source: [[basic-vocabulary]] }
- { id: en_919, display: how often, meaning: 자주, level: 2, category: question, source: [[basic-vocabulary]] }
- { id: en_920, display: how long, meaning: 얼마나 오래, level: 2, category: question, source: [[basic-vocabulary]] }
- { id: en_921, display: how far, meaning: 얼마나 멀리, level: 2, category: question, source: [[basic-vocabulary]] }
- { id: en_922, display: how old, meaning: 몇 살, level: 2, category: question, source: [[basic-vocabulary]] }
- { id: en_923, display: how are you, meaning: 어떻게 지내, level: 1, category: question, source: [[basic-vocabulary]] }
- { id: en_924, display: what is this, meaning: 이게 뭐야, level: 1, category: question, source: [[basic-vocabulary]] }
- { id: en_925, display: where is it, meaning: 어디 있어, level: 1, category: question, source: [[basic-vocabulary]] }
- { id: en_926, display: what time, meaning: 몇 시, level: 1, category: question, source: [[basic-vocabulary]] }
- { id: en_927, display: how much is it, meaning: 얼마야, level: 1, category: question, source: [[basic-vocabulary]] }
- { id: en_928, display: what is your name, meaning: 이름이 뭐야, level: 1, category: question, source: [[basic-vocabulary]] }
- { id: en_929, display: where are you from, meaning: 어디서 왔어, level: 1, category: question, source: [[basic-vocabulary]] }
- { id: en_930, display: what do you do, meaning: 직업이 뭐야, level: 1, category: question, source: [[basic-vocabulary]] }
- { id: en_931, display: can you help me, meaning: 도와줄 수 있어, level: 1, category: question, source: [[basic-vocabulary]] }
- { id: en_932, display: do you speak english, meaning: 영어 할 줄 알아, level: 1, category: question, source: [[basic-vocabulary]] }
- { id: en_933, display: two hundred, meaning: 이백, level: 2, category: number, source: [[numbers-vocabulary]] }
- { id: en_934, display: three hundred, meaning: 삼백, level: 2, category: number, source: [[numbers-vocabulary]] }
- { id: en_935, display: four hundred, meaning: 사백, level: 3, category: number, source: [[numbers-vocabulary]] }
- { id: en_936, display: five hundred, meaning: 오백, level: 3, category: number, source: [[numbers-vocabulary]] }
```

## 추가 어휘 Batch 3 (Expanded 2026-07-30) — 65 entries

```yaml
- { id: en_937, display: thank you very much, meaning: 정말 고마워요, level: 1, category: phrase, source: [[basic-vocabulary]] }
- { id: en_938, display: you're welcome, meaning: 천만에요, level: 1, category: phrase, source: [[basic-vocabulary]] }
- { id: en_939, display: no problem, meaning: 괜찮아요, level: 1, category: phrase, source: [[basic-vocabulary]] }
- { id: en_940, display: that's right, meaning: 맞아요, level: 1, category: phrase, source: [[basic-vocabulary]] }
- { id: en_941, display: that's wrong, meaning: 틀려요, level: 1, category: phrase, source: [[basic-vocabulary]] }
- { id: en_942, display: of course, meaning: 물론, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_943, display: by the way, meaning: 그런데, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_944, display: on the other hand, meaning: 반면에, level: 3, category: phrase, source: [[basic-vocabulary]] }
- { id: en_945, display: for example, meaning: 예를 들어, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_946, display: in fact, meaning: 사실, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_947, display: as well, meaning: 또한, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_948, display: at least, meaning: 최소한, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_949, display: at most, meaning: 최대, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_950, display: a lot of, meaning: 많은, level: 1, category: phrase, source: [[basic-vocabulary]] }
- { id: en_951, display: a few, meaning: 약간의, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_952, display: a little, meaning: 조금의, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_953, display: too much, meaning: 너무 많은, level: 1, category: phrase, source: [[basic-vocabulary]] }
- { id: en_954, display: too many, meaning: 너무 많은, level: 1, category: phrase, source: [[basic-vocabulary]] }
- { id: en_955, display: too little, meaning: 너무 적은, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_956, display: as soon as possible, meaning: 가능한 한 빨리, level: 3, category: phrase, source: [[basic-vocabulary]] }
- { id: en_957, display: right now, meaning: 지금 바로, level: 1, category: phrase, source: [[basic-vocabulary]] }
- { id: en_958, display: right here, meaning: 바로 여기, level: 1, category: phrase, source: [[basic-vocabulary]] }
- { id: en_959, display: right there, meaning: 바로 저기, level: 1, category: phrase, source: [[basic-vocabulary]] }
- { id: en_960, display: over there, meaning: 저기 너머에, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_961, display: thing, meaning: 것, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_962, display: place, meaning: 장소, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_963, display: person, meaning: 사람, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_964, display: time, meaning: 시간, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_965, display: way, meaning: 길, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_966, display: man, meaning: 남자, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_967, display: woman, meaning: 여자, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_968, display: child, meaning: 아이, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_969, display: boy, meaning: 소년, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_970, display: girl, meaning: 소녀, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_971, display: world, meaning: 세계, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_972, display: life, meaning: 삶, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_973, display: case, meaning: 경우, level: 2, category: noun, source: [[basic-vocabulary]] }
- { id: en_974, display: point, meaning: 요점, level: 2, category: noun, source: [[basic-vocabulary]] }
- { id: en_975, display: group, meaning: 그룹, level: 2, category: noun, source: [[basic-vocabulary]] }
- { id: en_976, display: number, meaning: 숫자, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_977, display: fact, meaning: 사실, level: 2, category: noun, source: [[basic-vocabulary]] }
- { id: en_978, display: idea, meaning: 아이디어, level: 2, category: noun, source: [[basic-vocabulary]] }
- { id: en_979, display: problem, meaning: 문제, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_980, display: question, meaning: 질문, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_981, display: answer, meaning: 대답, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_982, display: reason, meaning: 이유, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_983, display: result, meaning: 결과, level: 2, category: noun, source: [[basic-vocabulary]] }
- { id: en_984, display: information, meaning: 정보, level: 2, category: noun, source: [[basic-vocabulary]] }
- { id: en_985, display: word, meaning: 단어, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_986, display: sentence, meaning: 문장, level: 2, category: noun, source: [[basic-vocabulary]] }
- { id: en_987, display: language, meaning: 언어, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_988, display: story, meaning: 이야기, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_989, display: example, meaning: 예, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_990, display: beginning, meaning: 시작, level: 2, category: noun, source: [[basic-vocabulary]] }
- { id: en_991, display: end, meaning: 끝, level: 1, category: noun, source: [[basic-vocabulary]] }
- { id: en_992, display: how much does it cost, meaning: 얼마예요, level: 1, category: phrase, source: [[basic-vocabulary]] }
- { id: en_993, display: where is the bathroom, meaning: 화장실 어디예요, level: 1, category: phrase, source: [[basic-vocabulary]] }
- { id: en_994, display: can I have the bill, meaning: 계산서 주세요, level: 1, category: phrase, source: [[basic-vocabulary]] }
- { id: en_995, display: I would like, meaning: ~하고 싶습니다, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_996, display: do you have, meaning: ~있어요?, level: 1, category: phrase, source: [[basic-vocabulary]] }
- { id: en_997, display: how do I get to, meaning: ~어떻게 가요?, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_998, display: what time does it open, meaning: 몇 시에 여나요, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_999, display: what time does it close, meaning: 몇 시에 닫나요, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_1000, display: how much is the fare, meaning: 요금이 얼마예요, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_1001, display: one ticket please, meaning: 표 한 장 주세요, level: 1, category: phrase, source: [[basic-vocabulary]] }
```

## 추가 어휘 Batch 4 (Final — 1000+ milestone) — 12 entries

```yaml
- { id: en_1002, display: yes please, meaning: 네 부탁해요, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_1003, display: no thank you, meaning: 아니요 괜찮아요, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_1004, display: I don't understand, meaning: 이해가 안 돼요, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_1005, display: please speak slowly, meaning: 천천히 말해주세요, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_1006, display: please write it down, meaning: 적어주세요, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_1007, display: how do you say, meaning: ~을 영어로 뭐라고 해요, level: 3, category: phrase, source: [[basic-vocabulary]] }
- { id: en_1008, display: I don't know, meaning: 모르겠어요, level: 1, category: phrase, source: [[basic-vocabulary]] }
- { id: en_1009, display: never mind, meaning: 괜찮아요, level: 1, category: phrase, source: [[basic-vocabulary]] }
- { id: en_1010, display: it doesn't matter, meaning: 상관없어요, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_1011, display: I'll be right back, meaning: 금방 올게요, level: 2, category: phrase, source: [[basic-vocabulary]] }
- { id: en_1012, display: see you tomorrow, meaning: 내일 봐요, level: 1, category: phrase, source: [[basic-vocabulary]] }
- { id: en_1013, display: have a nice day, meaning: 좋은 하루 보내세요, level: 2, category: phrase, source: [[basic-vocabulary]] }
```
