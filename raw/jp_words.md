# Japanese Word/Sentence Corpus (Romaji 매핑)

> **상태**: 골격. Phase 6에서 본격 확장.
> **ADR-0002**: 로마자→한자 직접 매핑.

## 코퍼스 형식

```yaml
- id: jp_001
  display: こんにちは
  romaji: konnichiwa
  meaning: hello
  level: 5        # JLPT N5=5, N4=4, N3=3, N2=2, N1=1 (낮을수록 어려움)
  category: greeting
```

## Level 5 (JLPT N5) — 히라가나 중심

```yaml
- { id: jp_001, display: こんにちは, romaji: konnichiwa, meaning: hello, level: 5, category: greeting, source: [[basic-vocabulary]] }
- { id: jp_002, display: おはよう, romaji: ohayou, meaning: good morning, level: 5, category: greeting, source: [[basic-vocabulary]] }
- { id: jp_003, display: こんばんは, romaji: konbanwa, meaning: good evening, level: 5, category: greeting, source: [[basic-vocabulary]] }
- { id: jp_004, display: ありがとう, romaji: arigatou, meaning: thank you, level: 5, category: greeting, source: [[basic-vocabulary]] }
- { id: jp_005, display: さようなら, romaji: sayounara, meaning: goodbye, level: 5, category: greeting, source: [[basic-vocabulary]] }
- { id: jp_006, display: すみません, romaji: sumimasen, meaning: excuse me, level: 5, category: greeting, source: [[basic-vocabulary]] }
- { id: jp_007, display: いち, romaji: ichi, meaning: one, level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_008, display: に, romaji: ni, meaning: two, level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_009, display: さん, romaji: san, meaning: three, level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_010, display: よん, romaji: yon, meaning: four, level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_011, display: ご, romaji: go, meaning: five, level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_012, display: ろく, romaji: roku, meaning: six, level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_013, display: なな, romaji: nana, meaning: seven, level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_014, display: はち, romaji: hachi, meaning: eight, level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_015, display: きゅう, romaji: kyuu, meaning: nine, level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_016, display: じゅう, romaji: juu, meaning: ten, level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_017, display: あか, romaji: aka, meaning: red, level: 5, category: color, source: [[basic-vocabulary]] }
- { id: jp_018, display: あお, romaji: ao, meaning: blue, level: 5, category: color, source: [[basic-vocabulary]] }
- { id: jp_019, display: しろ, romaji: shiro, meaning: white, level: 5, category: color, source: [[basic-vocabulary]] }
- { id: jp_020, display: くろ, romaji: kuro, meaning: black, level: 5, category: color, source: [[basic-vocabulary]] }
- { id: jp_021, display: みず, romaji: mizu, meaning: water, level: 5, category: food, source: [[basic-vocabulary]] }
- { id: jp_022, display: ごはん, romaji: gohan, meaning: rice/meal, level: 5, category: food, source: [[basic-vocabulary]] }
- { id: jp_023, display: さかな, romaji: sakana, meaning: fish, level: 5, category: food, source: [[basic-vocabulary]] }
- { id: jp_024, display: ねこ, romaji: neko, meaning: cat, level: 5, category: animal, source: [[basic-vocabulary]] }
- { id: jp_025, display: いぬ, romaji: inu, meaning: dog, level: 5, category: animal, source: [[basic-vocabulary]] }
```

## Level 5 — 한자 포함 (기본 한자 100)

```yaml
- { id: jp_030, display: 一, romaji: ichi, meaning: one, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_031, display: 二, romaji: ni, meaning: two, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_032, display: 三, romaji: san, meaning: three, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_033, display: 四, romaji: yon/shi, meaning: four, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_034, display: 五, romaji: go, meaning: five, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_035, display: 六, romaji: roku, meaning: six, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_036, display: 七, romaji: nana/shichi, meaning: seven, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_037, display: 八, romaji: hachi, meaning: eight, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_038, display: 九, romaji: kyuu/ku, meaning: nine, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_039, display: 十, romaji: juu, meaning: ten, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_040, display: 人, romaji: hito, meaning: person, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_041, display: 日, romaji: hi/nichi, meaning: day/sun, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_042, display: 月, romaji: tsuki/getsu, meaning: month/moon, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_043, display: 火, romaji: hi/ka, meaning: fire, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_044, display: 水, romaji: mizu/sui, meaning: water, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_045, display: 木, romaji: ki/moku, meaning: tree/wood, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_046, display: 金, romaji: kane/kin, meaning: money/gold, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_047, display: 土, romaji: tsuchi/do, meaning: earth/soil, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_048, display: 山, romaji: yama/san, meaning: mountain, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_049, display: 川, romaji: kawa/sen, meaning: river, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_050, display: 田, romaji: ta/da, meaning: rice field, level: 5, category: kanji_basic, source: [[basic-vocabulary]] }
- { id: jp_051, display: 学校, romaji: gakkou, meaning: school, level: 5, category: place, source: [[basic-vocabulary]] }
- { id: jp_052, display: 教室, romaji: kyoushitsu, meaning: classroom, level: 5, category: place, source: [[basic-vocabulary]] }
- { id: jp_053, display: 先生, romaji: sensei, meaning: teacher, level: 5, category: person, source: [[basic-vocabulary]] }
- { id: jp_054, display: 生徒, romaji: seito, meaning: student, level: 5, category: person, source: [[basic-vocabulary]] }
- { id: jp_055, display: 友達, romaji: tomodachi, meaning: friend, level: 5, category: person, source: [[basic-vocabulary]] }
```

## 촉음/요음 예시

```yaml
- { id: jp_060, display: 学校, romaji: gakkou, meaning: school, level: 5, category: place, source: [[basic-vocabulary]] }
- { id: jp_061, display: 雑誌, romaji: zasshi, meaning: magazine, level: 4, category: object, source: [[basic-vocabulary]] }
- { id: jp_062, display: 切手, romaji: kitte, meaning: stamp, level: 4, category: object, source: [[basic-vocabulary]] }
- { id: jp_063, display: 写真, romaji: shashin, meaning: photograph, level: 5, category: object, source: [[basic-vocabulary]] }
- { id: jp_064, display: 今日, romaji: kyou, meaning: today, level: 5, category: time, source: [[basic-vocabulary]] }
- { id: jp_065, display: 昨日, romaji: kinou, meaning: yesterday, level: 5, category: time, source: [[basic-vocabulary]] }
- { id: jp_066, display: 来年, romaji: rainen, meaning: next year, level: 5, category: time, source: [[basic-vocabulary]] }
- { id: jp_067, display: 東京, romaji: toukyou, meaning: Tokyo, level: 5, category: place, source: [[basic-vocabulary]] }
- { id: jp_068, display: 大阪, romaji: oosaka, meaning: Osaka, level: 5, category: place, source: [[basic-vocabulary]] }
- { id: jp_069, display: 京都, romaji: kyouto, meaning: Kyoto, level: 5, category: place, source: [[basic-vocabulary]] }
```

## Level 4~1 (JLPT N4~N1)

(추가 예정 — Phase 6)

## 문장 (Sentences)

```yaml
- { id: jps_001, display: こんにちは、元気ですか?, romaji: konnichiwagenkidesuka, meaning: "Hello, how are you?", level: 5, category: greeting, source: [[basic-vocabulary]] }
- { id: jps_002, display: ありがとうございます, romaji: arigatougozaimasu, meaning: "Thank you very much", level: 5, category: greeting, source: [[basic-vocabulary]] }
- { id: jps_003, display: おはようございます, romaji: ohayougozaimasu, meaning: "Good morning (polite)", level: 5, category: greeting, source: [[basic-vocabulary]] }
```

## 旅行 (Travel) — Level 5

> **출처**: [[travel-basics-jp]], [[travel]] (JLPT N5-N4)

### 空港・ホテル・観光

```yaml
- { id: jp_t_001, display: 空港, romaji: kuukou, meaning: 공항, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_002, display: 駅, romaji: eki, meaning: 역, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_003, display: 切符, romaji: kippu, meaning: 표, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_004, display: 予約, romaji: yoyaku, meaning: 예약, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_005, display: 地図, romaji: chizu, meaning: 지도, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_006, display: 荷物, romaji: nimotsu, meaning: 짐, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_007, display: 切符売り場, romaji: kippu uriba, meaning: 매표소, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_008, display: 出口, romaji: deguchi, meaning: 출구, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_009, display: 入口, romaji: iriguchi, meaning: 입구, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_010, display: 改札, romaji: kaisatsu, meaning: 개찰구, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_011, display: 観光, romaji: kankou, meaning: 관광, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_012, display: 博物館, romaji: hakubutsukan, meaning: 박물관, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_013, display: 神社, romaji: jinja, meaning: 신사, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_014, display: 寺, romaji: tera, meaning: 절, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_015, display: 城, romaji: shiro, meaning: 성, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_016, display: 公園, romaji: kouen, meaning: 공원, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_017, display: ホテル, romaji: hoteru, meaning: 호텔, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_018, display: 部屋, romaji: heya, meaning: 방, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_019, display: 注文, romaji: chuumon, meaning: 주문, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_020, display: 電車, romaji: densha, meaning: 전철, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_021, display: 地下鉄, romaji: chikatetsu, meaning: 지하철, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_022, display: バス, romaji: basu, meaning: 버스, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_023, display: タクシー, romaji: takushii, meaning: 택시, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_024, display: 新幹線, romaji: shinkansen, meaning: 신칸센, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_025, display: 山, romaji: yama, meaning: 산, level: 5, category: travel, source: [[travel]] }
- { id: jp_t_026, display: 海, romaji: umi, meaning: 바다, level: 5, category: travel, source: [[travel]] }
```

### 旅行フレーズ (Travel Phrases) — Level 5

```yaml
- id: jp_t_s_001
  display: すみません、駅はどこですか?
  romaji: sumimaseneki-wadodesuka
  meaning: 실례합니다, 역은 어디에 있나요?
  level: 5
  category: travel
  source: [[basic-vocabulary]]

- id: jp_t_s_002
  display: いくらですか?
  romaji: ikuradesuka
  meaning: 얼마예요?
  level: 5
  category: travel
  source: [[basic-vocabulary]]

- id: jp_t_s_003
  display: トイレはどこですか?
  romaji: toire-wadodesuka
  meaning: 화장실 어디예요?
  level: 5
  category: travel
  source: [[basic-vocabulary]]

- id: jp_t_s_004
  display: 助けてください
  romaji: tasetekudasai
  meaning: 도와주세요
  level: 5
  category: travel
  source: [[basic-vocabulary]]

- id: jp_t_s_005
  display: ありがとうございます
  romaji: arigatougozaimasu
  meaning: 감사합니다
  level: 5
  category: travel
  source: [[basic-vocabulary]]
```

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
- kanji_basic (기본 한자)
- travel (여행)

## 확장 계획 (Phase 6)

- [ ] N5 단어 200개 (현재 ~70)
- [ ] N4~N1 단어 각 150개
- [ ] 일상 회화 문장 50개
- [ ] 뉴스 문장 30개
- [ ] 한자 다의어 처리 (예: `今日` = きょう / こんにち)

## 다음 단계

- JSON 변환: `prototype/src/data/jp_words.json`
- romaji 매핑 검증 (n, 촉음, 요음)
- 한자 다의어 표기 통일

## Wiki-driven entries (auto-generated, 2026-07-03)

```yaml
- { id: jp_200, display: 아침, romaji: achim, meaning: 朝, level: 1, category: time, source: [[basic-vocabulary]] }
- { id: jp_201, display: 赤, romaji: aka, meaning: red (빨강), level: 5, category: color, source: [[basic-vocabulary]] }
- { id: jp_202, display: 青, romaji: ao, meaning: blue; green (파랑), level: 5, category: color, source: [[basic-vocabulary]] }
- { id: jp_203, display: ありがとうございます, romaji: arigatougozaimasu, meaning: thank you very much (polite) (감사합니다), level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_204, display: 바다, romaji: bada, meaning: 海, level: 1, category: nature, source: [[basic-vocabulary]] }
- { id: jp_205, display: 방, romaji: bang, meaning: 部屋, level: 1, source: [[basic-vocabulary]] }
- { id: jp_206, display: 박물관, romaji: bangmulgwan, meaning: 博物館, level: 1, source: [[basic-vocabulary]] }
- { id: jp_207, display: 버스, romaji: beoseu, meaning: バス, level: 1, source: [[basic-vocabulary]] }
- { id: jp_208, display: 비싸다, romaji: bissada, meaning: 高い, level: 1, category: emotion, source: [[basic-vocabulary]] }
- { id: jp_209, display: 차갑다, romaji: chagapda, meaning: 冷たい, level: 1, source: [[basic-vocabulary]] }
- { id: jp_210, display: 地下鉄, romaji: chikatetsu, meaning: subway; metro (지하철), level: 4, source: [[travel]] }
- { id: jp_211, display: 출구, romaji: chulgu, meaning: 出口, level: 1, source: [[basic-vocabulary]] }
- { id: jp_212, display: 달다, romaji: dalda, meaning: 甘い, level: 1, source: [[basic-vocabulary]] }
- { id: jp_213, display: 出口, romaji: deguchi, meaning: exit (출구), level: 4, source: [[travel]] }
- { id: jp_214, display: 駅, romaji: eki, meaning: station (역), level: 5, category: place, source: [[travel]] }
- { id: jp_215, display: 가까이, romaji: gakkai, meaning: 近く, level: 1, source: [[basic-vocabulary]] }
- { id: jp_216, display: 学校, romaji: gakkou, meaning: school (학교), level: 5, category: place, source: [[basic-vocabulary]] }
- { id: jp_217, display: 기차, romaji: gicha, meaning: 電車, level: 1, source: [[basic-vocabulary]] }
- { id: jp_218, display: 五, romaji: go, meaning: five (오; 5), level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_219, display: 極苦人, romaji: gokakunin, meaning: extreme hardship; severe suffering (극고난), level: 3, source: [[basic-vocabulary]] }
- { id: jp_220, display: 공항, romaji: gonghang, meaning: 空港, 飛行場, level: 1, category: place, source: [[basic-vocabulary]] }
- { id: jp_221, display: 공원, romaji: gongwon, meaning: 公園, level: 1, category: place, source: [[basic-vocabulary]] }
- { id: jp_222, display: ご小人, romaji: gosyounin, meaning: hardship-stricken person; sufferer (곤경에 처한 사람), level: 3, category: family, source: [[basic-vocabulary]] }
- { id: jp_223, display: ご迷惑, romaji: gowmeiwaku, meaning: aggravated confusion; further bewilderment (더 큰 혼란), level: 3, source: [[basic-vocabulary]] }
- { id: jp_224, display: 계산, romaji: gyesan, meaning: 会計, level: 1, category: nature, source: [[basic-vocabulary]] }
- { id: jp_225, display: 교차로, romaji: gyocharo, meaning: 交差点, level: 1, source: [[basic-vocabulary]] }
- { id: jp_226, display: 博物館, romaji: hakubutsukan, meaning: museum (박물관), level: 3, source: [[travel]] }
- { id: jp_227, display: 部屋, romaji: heya, meaning: room (방), level: 5, source: [[travel]] }
- { id: jp_228, display: 日, romaji: hi, meaning: day; sun (날; 해, hi reading), level: 4, category: nature, source: [[basic-vocabulary]] }
- { id: jp_229, display: 人, romaji: hito, meaning: person (사람), level: 5, category: family, source: [[basic-vocabulary]] }
- { id: jp_230, display: 호텔, romaji: hotel, meaning: ホテル, level: 1, category: place, source: [[basic-vocabulary]] }
- { id: jp_231, display: 환전, romaji: hwanjeon, meaning: 両替, level: 1, source: [[basic-vocabulary]] }
- { id: jp_232, display: 입국심사, romaji: ibguksimsa, meaning: 入国審査, level: 1, category: body, source: [[basic-vocabulary]] }
- { id: jp_233, display: 一, romaji: ichi, meaning: one (일; 1), level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_234, display: 입구, romaji: ipgu, meaning: 入口, level: 1, category: body, source: [[basic-vocabulary]] }
- { id: jp_235, display: 入口, romaji: iriguchi, meaning: entrance (입구), level: 4, category: body, source: [[travel]] }
- { id: jp_236, display: 절, romaji: jeol, meaning: 寺, level: 1, source: [[basic-vocabulary]] }
- { id: jp_237, display: 지도, romaji: jido, meaning: 地図, level: 1, source: [[basic-vocabulary]] }
- { id: jp_238, display: 직진, romaji: jigjin, meaning: まっすぐ, level: 1, source: [[basic-vocabulary]] }
- { id: jp_239, display: 지하철, romaji: jihacheol, meaning: 地下鉄, level: 1, source: [[basic-vocabulary]] }
- { id: jp_240, display: 짐, romaji: jim, meaning: 荷物, level: 1, source: [[basic-vocabulary]] }
- { id: jp_241, display: 神社, romaji: jinja, meaning: Shinto shrine (신사), level: 3, source: [[travel]] }
- { id: jp_242, display: 주문, romaji: jumun, meaning: 注文, level: 1, source: [[basic-vocabulary]] }
- { id: jp_243, display: 十, romaji: juu, meaning: ten (십; 10), level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_244, display: 火, romaji: ka, meaning: fire (불, ka reading), level: 4, category: nature, source: [[basic-vocabulary]] }
- { id: jp_245, display: 改札, romaji: kaisatsu, meaning: ticket gate (개찰구), level: 3, category: animal, source: [[travel]] }
- { id: jp_246, display: 観光, romaji: kankou, meaning: sightseeing; tourism (관광), level: 3, category: travel, source: [[travel]] }
- { id: jp_247, display: 金, romaji: kin, meaning: gold; metal; money (금; 돈, kin reading), level: 4, category: color, source: [[basic-vocabulary]] }
- { id: jp_248, display: 昨日, romaji: kinou, meaning: yesterday (어제), level: 5, category: time, source: [[basic-vocabulary]] }
- { id: jp_249, display: 切符売り場, romaji: kippuuriba, meaning: ticket office; ticket counter (매표소), level: 3, category: animal, source: [[travel]] }
- { id: jp_250, display: 切手, romaji: kitte, meaning: postage stamp (우표), level: 3, category: travel, source: [[travel]] }
- { id: jp_251, display: 公園, romaji: kouen, meaning: park (공원), level: 4, category: place, source: [[travel]] }
- { id: jp_252, display: 黒, romaji: kuro, meaning: black (검정), level: 5, category: color, source: [[basic-vocabulary]] }
- { id: jp_253, display: 今日, romaji: kyou, meaning: today (오늘), level: 5, category: time, source: [[basic-vocabulary]] }
- { id: jp_254, display: 教室, romaji: kyoushitsu, meaning: classroom (교실), level: 5, source: [[basic-vocabulary]] }
- { id: jp_255, display: 京都, romaji: kyouto, meaning: Kyoto (교토), level: 4, source: [[basic-vocabulary]] }
- { id: jp_256, display: 九, romaji: kyuu, meaning: nine (구; 9), level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_257, display: 맵다, romaji: maepda, meaning: 辛い, level: 1, source: [[basic-vocabulary]] }
- { id: jp_258, display: 맛있다, romaji: masitda, meaning: おいしい, level: 1, source: [[basic-vocabulary]] }
- { id: jp_259, display: 멀리, romaji: meolli, meaning: 遠く, level: 1, source: [[basic-vocabulary]] }
- { id: jp_260, display: 七, romaji: nana, meaning: seven (칠; 7, nana reading), level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_261, display: 二, romaji: ni, meaning: two (이; 2), level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_262, display: 왼쪽, romaji: oenjjog, meaning: 左, level: 1, source: [[basic-vocabulary]] }
- { id: jp_263, display: おはようございます, romaji: ohayougozaimasu, meaning: good morning (polite) (좋은 아침), level: 4, category: greeting, source: [[basic-vocabulary]] }
- { id: jp_264, display: 大阪, romaji: oosaka, meaning: Osaka (오사카), level: 4, source: [[basic-vocabulary]] }
- { id: jp_265, display: 오른쪽, romaji: oreunjjog, meaning: 右, level: 1, source: [[basic-vocabulary]] }
- { id: jp_266, display: お世話, romaji: osewa, meaning: help; support; care (도움; 보살핌), level: 4, source: [[basic-vocabulary]] }
- { id: jp_267, display: 표, romaji: pyo, meaning: 切符, level: 1, category: travel, source: [[travel]] }
- { id: jp_268, display: 来年, romaji: rainen, meaning: next year (내년), level: 4, category: body, source: [[basic-vocabulary]] }
- { id: jp_269, display: 六, romaji: roku, meaning: six (육; 6), level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_270, display: 사진, romaji: sajin, meaning: 写真, level: 1, source: [[basic-vocabulary]] }
- { id: jp_271, display: 산, romaji: san, meaning: 山, level: 1, category: nature, source: [[basic-vocabulary]] }
- { id: jp_272, display: さようなら, romaji: sayounara, meaning: goodbye; farewell (안녕히 가세요), level: 4, category: greeting, source: [[basic-vocabulary]] }
- { id: jp_273, display: 세관, romaji: segwan, meaning: 税関, level: 1, source: [[basic-vocabulary]] }
- { id: jp_274, display: 生徒, romaji: seito, meaning: student (학생), level: 5, source: [[basic-vocabulary]] }
- { id: jp_275, display: 先生, romaji: sensei, meaning: teacher; master (선생), level: 5, category: food, source: [[basic-vocabulary]] }
- { id: jp_276, display: 新幹線, romaji: shinkansen, meaning: Shinkansen; bullet train (신칸센), level: 4, category: nature, source: [[travel]] }
- { id: jp_277, display: 白, romaji: shiro, meaning: white (하양), level: 5, category: animal, source: [[basic-vocabulary]] }
- { id: jp_278, display: 식당, romaji: sikdang, meaning: 食堂, level: 1, category: place, source: [[basic-vocabulary]] }
- { id: jp_279, display: 신호등, romaji: sinhodeung, meaning: 信号, level: 1, source: [[basic-vocabulary]] }
- { id: jp_280, display: 싸다, romaji: ssada, meaning: 安い, level: 1, category: emotion, source: [[basic-vocabulary]] }
- { id: jp_281, display: 田, romaji: ta, meaning: rice field (논, ta reading), level: 2, category: food, source: [[basic-vocabulary]] }
- { id: jp_282, display: 택시, romaji: taegsi, meaning: タクシー, level: 1, source: [[basic-vocabulary]] }
- { id: jp_283, display: 寺, romaji: tera, meaning: Buddhist temple (절), level: 4, source: [[travel]] }
- { id: jp_284, display: 突然, romaji: totsuzen, meaning: suddenly; all of a sudden (갑자기), level: 4, source: [[basic-vocabulary]] }
- { id: jp_285, display: 東京, romaji: toukyou, meaning: Tokyo (도쿄), level: 5, source: [[basic-vocabulary]] }
- { id: jp_287, display: 土, romaji: tsuchi, meaning: earth; soil (흙, tsuchi reading), level: 4, category: body, source: [[basic-vocabulary]] }
- { id: jp_288, display: 뜨겁다, romaji: tteugeopda, meaning: 熱い, level: 1, source: [[basic-vocabulary]] }
- { id: jp_289, display: 역, romaji: yeog, meaning: 駅, level: 1, category: place, source: [[basic-vocabulary]] }
- { id: jp_290, display: 여권, romaji: yeogwon, meaning: パスポート, level: 1, category: travel, source: [[travel]] }
- { id: jp_291, display: 예약, romaji: yeyak, meaning: 予約, level: 1, source: [[basic-vocabulary]] }
- { id: jp_292, display: 四, romaji: yon, meaning: four (사; 4, yon reading), level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_293, display: 予約, romaji: yoyaku, meaning: reservation; booking (예약), level: 4, source: [[travel]] }
- { id: jp_294, display: 雑誌, romaji: zasshi, meaning: magazine (잡지), level: 4, source: [[basic-vocabulary]] }
- { id: jp_295, display: ありがとう, romaji: arigatou, meaning: thank you; thanks (감사합니다), level: 5, category: greeting, source: [[basic-vocabulary]] }
- { id: jp_296, display: 兎, romaji: usagi, meaning: rabbit; hare (토끼), level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_297, display: うどん, romaji: udon, meaning: うどん (udon) — udon noodles., level: 5, category: food, source: [[basic-vocabulary]] }
- { id: jp_298, display: おいしい, romaji: oishii, meaning: Delicious / tasty., level: 1, source: [[basic-vocabulary]] }
- { id: jp_299, display: おはよう, romaji: ohayou, meaning: good morning (casual) (좋은 아침), level: 5, category: greeting, source: [[basic-vocabulary]] }
- { id: jp_300, display: お腹, romaji: onaka, meaning: Stomach / belly., level: 1, source: [[basic-vocabulary]] }
- { id: jp_301, display: お茶, romaji: ocha, meaning: おちゃ (ocha) — tea., level: 5, category: food, source: [[basic-vocabulary]] }
- { id: jp_302, display: お金, romaji: okane, meaning: Money., level: 1, category: number, source: [[basic-vocabulary]] }
- { id: jp_303, display: お願いします, romaji: onegaishimasu, meaning: please; I ask of you (부탁합니다), level: 4, category: greeting, source: [[basic-vocabulary]] }
- { id: jp_304, display: かっこいい, meaning: 멋있다/멋진 — Cool; good-looking (for men); stylish., level: 4, source: [[basic-vocabulary]] }
- { id: jp_305, display: きつい, romaji: kitsui, meaning: きつい (kitsui) — tight., level: 3, source: [[basic-vocabulary]] }
- { id: jp_306, display: こんにちは, romaji: konnichiwa, meaning: hello; good afternoon (안녕하세요), level: 5, category: greeting, source: [[basic-vocabulary]] }
- { id: jp_307, display: こんばんは, romaji: konbanwa, meaning: good evening (좋은 저녁), level: 5, category: greeting, source: [[basic-vocabulary]] }
- { id: jp_308, display: ごめんなさい, romaji: gomennasai, meaning: ごめんなさい (gomen nasai) — sorry., level: 5, category: greeting, source: [[basic-vocabulary]] }
- { id: jp_309, display: ご飯, romaji: gohan, meaning: ごはん (gohan) — rice/meal., level: 5, category: food, source: [[basic-vocabulary]] }
- { id: jp_310, display: すごい, romaji: sugoi, meaning: amazing; awesome; terrific (대단하다), level: 5, source: [[basic-vocabulary]] }
- { id: jp_311, display: 済みません, romaji: sumimasen, meaning: excuse me; sorry; thank you (실례합니다; 죄송합니다), level: 5, category: greeting, source: [[basic-vocabulary]] }
- { id: jp_312, display: そば, romaji: soba, meaning: そば (soba) — soba noodles., level: 4, category: food, source: [[basic-vocabulary]] }
- { id: jp_313, display: ときめく, romaji: tokimeku, meaning: ときめく (tokimeku) — to flutter (heart)., level: 3, category: body, source: [[basic-vocabulary]] }
- { id: jp_314, display: とんかつ, romaji: tonkatsu, meaning: とんかつ (tonkatsu) — tonkatsu (breaded pork cutlet)., level: 4, category: food, source: [[basic-vocabulary]] }
- { id: jp_315, display: まずい, romaji: mazui, meaning: tasteless; bad; not good (맛없다; 형편없다), level: 4, category: family, source: [[basic-vocabulary]] }
- { id: jp_316, display: 湖, romaji: mizuumi, meaning: lake (호수), level: 3, category: nature, source: [[basic-vocabulary]] }
- { id: jp_317, display: アニメ, romaji: anime, meaning: anime (animated show) (애니메이션), level: 4, source: [[basic-vocabulary]] }
- { id: jp_318, display: アプリ, romaji: apuri, meaning: app; application (앱; 어플리케이션), level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_319, display: アリ, romaji: ari, meaning: あり (ari) — ant., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_320, display: イルカ, romaji: iruka, meaning: いるか (iruka) — dolphin., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_321, display: インターネット, romaji: inta-netto, meaning: Internet., level: 1, source: [[basic-vocabulary]] }
- { id: jp_322, display: ウェブサイト, romaji: webusaito, meaning: website (웹사이트), level: 3, source: [[basic-vocabulary]] }
- { id: jp_323, display: オオカミ, romaji: oogami, meaning: おおがみ (oogami) — wolf., level: 3, category: animal, source: [[basic-vocabulary]] }
- { id: jp_324, display: カエル, romaji: kaeru, meaning: かえる (kaeru) — frog., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_325, display: カフェ, meaning: 카페 — Café; coffee shop., level: 4, category: food, source: [[basic-vocabulary]] }
- { id: jp_326, display: カレー, romaji: karee, meaning: かれー (karee) — curry., level: 5, source: [[basic-vocabulary]] }
- { id: jp_327, display: カード, romaji: ka-do, meaning: Card., level: 1, source: [[basic-vocabulary]] }
- { id: jp_328, display: キツネ, romaji: kitsune, meaning: きつね (kitsune) — fox., level: 3, category: animal, source: [[basic-vocabulary]] }
- { id: jp_329, display: キャリア, romaji: kyaria, meaning: career; professional experience (커리어), level: 3, source: [[basic-vocabulary]] }
- { id: jp_330, display: キンパ, romaji: kinpa, meaning: kimbap; Korean seaweed rice roll (김밥), level: 3, category: food, source: [[basic-vocabulary]] }
- { id: jp_331, display: キーボード, romaji: ki-bo-do, meaning: Keyboard., level: 1, source: [[basic-vocabulary]] }
- { id: jp_332, display: クジラ, romaji: kujira, meaning: くじら (kujira) — whale., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_333, display: クリスマス, romaji: kurisumasu, meaning: Christmas., level: 1, source: [[basic-vocabulary]] }
- { id: jp_334, display: ケーキ, romaji: ke-ki, meaning: Cake., level: 1, category: food, source: [[basic-vocabulary]] }
- { id: jp_335, display: ゲーム, romaji: geemu, meaning: game (게임), level: 4, source: [[basic-vocabulary]] }
- { id: jp_336, display: コンパス, meaning: compass., level: 4, source: [[basic-vocabulary]] }
- { id: jp_337, display: コンピュータ, romaji: konpyu-ta, meaning: Computer — 電子計算機。, level: 1, source: [[basic-vocabulary]] }
- { id: jp_338, display: コート, romaji: kooto, meaning: こーと (kooto) — coat., level: 4, category: clothing, source: [[basic-vocabulary]] }
- { id: jp_339, display: コーヒー, romaji: koohii, meaning: こーひー (koohii) — coffee., level: 5, category: food, source: [[basic-vocabulary]] }
- { id: jp_340, display: サッカー, romaji: sakkaa, meaning: soccer; football (축구), level: 4, category: body, source: [[basic-vocabulary]] }
- { id: jp_341, display: サムギョプサル, romaji: samugyopusaru, meaning: samgyeopsal; Korean pork belly BBQ (삼겹살), level: 3, source: [[basic-vocabulary]] }
- { id: jp_342, display: サメ, romaji: same, meaning: さめ (same) — shark., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_343, display: サル, romaji: saru, meaning: さる (saru) — monkey., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_344, display: シャツ, romaji: shatsu, meaning: しゃつ (shatsu) — shirt., level: 4, category: clothing, source: [[basic-vocabulary]] }
- { id: jp_345, display: ジャケット, romaji: jaketto, meaning: jacket (재킷), level: 4, category: clothing, source: [[basic-vocabulary]] }
- { id: jp_346, display: ジャーナリズム, romaji: jaanarizumu, meaning: journalism (저널리즘), level: 2, source: [[basic-vocabulary]] }
- { id: jp_347, display: ジュース, romaji: juusu, meaning: じゅーす (juusu) — juice., level: 5, source: [[basic-vocabulary]] }
- { id: jp_348, display: ジョギング, romaji: jogingu, meaning: Jogging., level: 1, source: [[basic-vocabulary]] }
- { id: jp_349, display: スカート, romaji: sukaato, meaning: すかーと (sukaato) — skirt., level: 4, category: clothing, source: [[basic-vocabulary]] }
- { id: jp_350, display: スケジュール, romaji: sukejuuru, meaning: すけじゅーる (sukejuuru) — schedule., level: 4, source: [[basic-vocabulary]] }
- { id: jp_351, display: スポーツ, romaji: supo-tsu, meaning: Sports., level: 1, source: [[basic-vocabulary]] }
- { id: jp_352, display: スマホ, romaji: sumaho, meaning: Smartphone., level: 1, category: nature, source: [[basic-vocabulary]] }
- { id: jp_353, display: スラムダンク, romaji: suramudanku, meaning: Slam Dunk (Japanese manga/anime) (슬램덩크), level: 3, source: [[basic-vocabulary]] }
- { id: jp_354, display: スンドゥブ, romaji: sundoubu, meaning: sundubu; Korean soft tofu stew (순두부), level: 3, category: nature, source: [[basic-vocabulary]] }
- { id: jp_355, display: ズボン, romaji: zubon, meaning: ずぼん (zubon) — pants/trousers., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_356, display: セーター, romaji: seetaa, meaning: sweater (스웨터), level: 4, category: clothing, source: [[basic-vocabulary]] }
- { id: jp_357, display: ソジュ, romaji: soju, meaning: soju; Korean liquor (소주), level: 3, category: animal, source: [[basic-vocabulary]] }
- { id: jp_358, display: ゾウ, romaji: zou, meaning: ぞう (zou) — elephant., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_359, display: タクシー, romaji: takushii, meaning: taxi (택시), level: 4, source: [[basic-vocabulary]] }
- { id: jp_360, display: チャプチェ, romaji: chapuche, meaning: japchae; Korean glass noodle dish (잡채), level: 3, category: food, source: [[basic-vocabulary]] }
- { id: jp_361, display: チーズ, romaji: chiizu, meaning: ちーず (chiizu) — cheese., level: 4, category: food, source: [[basic-vocabulary]] }
- { id: jp_362, display: チームリーダー, romaji: chiimuriidaa, meaning: ちーむりーだー (chiimu riidaa) — team leader., level: 4, category: food, source: [[basic-vocabulary]] }
- { id: jp_363, display: テニス, romaji: tenisu, meaning: Tennis., level: 1, category: number, source: [[basic-vocabulary]] }
- { id: jp_364, display: テント, meaning: tent., level: 4, category: number, source: [[basic-vocabulary]] }
- { id: jp_365, display: デート, meaning: 데이트 — A date (romantic outing)., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_366, display: トッポギ, romaji: toppogi, meaning: tteokbokki; Korean spicy rice cake (떡볶이), level: 3, category: food, source: [[basic-vocabulary]] }
- { id: jp_367, display: トラ, romaji: tora, meaning: とら (tora) — tiger., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_368, display: ドレス, romaji: doresu, meaning: dress (드레스), level: 4, category: clothing, source: [[basic-vocabulary]] }
- { id: jp_369, display: ノートパソコン, romaji: nootopasokon, meaning: laptop computer (노트북), level: 4, source: [[basic-vocabulary]] }
- { id: jp_370, display: ハンサム, romaji: hansamu, meaning: handsome (잘생긴), level: 4, category: body, source: [[basic-vocabulary]] }
- { id: jp_371, display: バス, romaji: basu, meaning: bus (버스), level: 5, source: [[basic-vocabulary]] }
- { id: jp_372, display: 薔薇, romaji: bara, meaning: rose (장미), level: 4, source: [[basic-vocabulary]] }
- { id: jp_373, display: パスポート, meaning: パスポート — passport. A government-issued travel document., level: 5, category: travel, source: [[travel]] }
- { id: jp_374, display: パスワード, romaji: pasuwaado, meaning: password (비밀번호), level: 3, category: nature, source: [[basic-vocabulary]] }
- { id: jp_375, display: パン, romaji: pan, meaning: bread (빵), level: 4, category: food, source: [[basic-vocabulary]] }
- { id: jp_376, display: パーティー, romaji: paatii, meaning: party (파티), level: 4, source: [[basic-vocabulary]] }
- { id: jp_377, display: ビザ, romaji: biza, meaning: visa (비자), level: 3, category: nature, source: [[basic-vocabulary]] }
- { id: jp_378, display: ビジネス, romaji: bijinesu, meaning: business; commerce, level: 3, source: [[basic-vocabulary]] }
- { id: jp_379, display: ビビンバ, romaji: bibinba, meaning: bibimbap; Korean mixed rice bowl, level: 3, category: food, source: [[basic-vocabulary]] }
- { id: jp_380, display: ビーチ, romaji: biichi, meaning: beach, level: 4, category: nature, source: [[basic-vocabulary]] }
- { id: jp_381, display: ビール, romaji: biiru, meaning: びーる (biiru) — beer., level: 5, category: animal, source: [[basic-vocabulary]] }
- { id: jp_382, display: プレゼント, romaji: purezento, meaning: present; gift, level: 4, source: [[basic-vocabulary]] }
- { id: jp_383, display: プロジェクト, romaji: purojekuto, meaning: ぷろじぇくと (purojekuto) — project., level: 4, source: [[basic-vocabulary]] }
- { id: jp_384, display: ペット, romaji: petto, meaning: pet, level: 4, source: [[basic-vocabulary]] }
- { id: jp_385, display: ホテル, romaji: hoteru, meaning: hotel, level: 4, category: place, source: [[basic-vocabulary]] }
- { id: jp_386, display: マフラー, romaji: mafuraa, meaning: まふらー (mafuraa) — scarf., level: 4, category: clothing, source: [[basic-vocabulary]] }
- { id: jp_387, display: メッセージ, romaji: messeeji, meaning: めっせーじ (messeeji) — message., level: 5, source: [[basic-vocabulary]] }
- { id: jp_388, display: メディア, romaji: media, meaning: media, level: 3, source: [[basic-vocabulary]] }
- { id: jp_389, display: メニュー, romaji: menyuu, meaning: めにゅー (menyuu) — menu., level: 5, source: [[basic-vocabulary]] }
- { id: jp_390, display: メール, romaji: meeru, meaning: めーる (meeru) — email., level: 4, source: [[basic-vocabulary]] }
- { id: jp_391, display: ヨガ, romaji: yoga, meaning: Yoga., level: 1, source: [[basic-vocabulary]] }
- { id: jp_392, display: ライオン, romaji: raion, meaning: らいおん (raion) — lion., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_393, display: ラジョン, romaji: rajon, meaning: ramyeon; Korean instant noodles, level: 3, category: animal, source: [[basic-vocabulary]] }
- { id: jp_394, display: ラーメン, romaji: raamen, meaning: らーめん (raamen) — ramen., level: 5, source: [[basic-vocabulary]] }
- { id: jp_395, display: レシート, romaji: reshi-to, meaning: Receipt., level: 1, source: [[basic-vocabulary]] }
- { id: jp_396, display: レストラン, romaji: resutoran, meaning: restaurant, level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_397, display: ワイン, romaji: wain, meaning: わえん (wain) — wine., level: 4, source: [[basic-vocabulary]] }
- { id: jp_398, display: ワンピース, romaji: wanpiisu, meaning: one-piece dress; manga One Piece, level: 4, category: body, source: [[basic-vocabulary]] }
- { id: jp_399, display: 七転び八起き, romaji: nanakorobiyaoki, meaning: fall seven times, stand up eight; perseverance, level: 2, category: number, source: [[basic-vocabulary]] }
- { id: jp_400, display: 上司, romaji: joushi, meaning: じょうし (joushi) — boss/superior., level: 4, source: [[basic-vocabulary]] }
- { id: jp_401, display: 下書き, romaji: shitagaki, meaning: draft; rough copy, level: 3, source: [[basic-vocabulary]] }
- { id: jp_402, display: 不安, romaji: fuan, meaning: ふあん (fuan) — anxiety., level: 3, source: [[basic-vocabulary]] }
- { id: jp_403, display: 丘, romaji: oka, meaning: おか (oka) — hill., level: 4, source: [[basic-vocabulary]] }
- { id: jp_404, display: 亀, romaji: kame, meaning: かめ (kame) — turtle., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_405, display: 事務所, romaji: jimusho, meaning: じむしょ (jimusho) — office., level: 4, source: [[basic-vocabulary]] }
- { id: jp_406, display: 交渉, romaji: koushou, meaning: negotiation, level: 3, source: [[basic-vocabulary]] }
- { id: jp_407, display: 交通, romaji: koutsuu, meaning: traffic; transportation, level: 4, source: [[basic-vocabulary]] }
- { id: jp_408, display: 仕事, romaji: shigoto, meaning: しごと (shigoto) — work/job., level: 4, source: [[basic-vocabulary]] }
- { id: jp_409, display: 付き合う, meaning: 사귀다/교제하다 — To date; to go out with; to be in a relationship., level: 3, category: body, source: [[basic-vocabulary]] }
- { id: jp_410, display: 代表, romaji: daihyou, meaning: だいひょう (daihyou) — representative., level: 4, source: [[basic-vocabulary]] }
- { id: jp_411, display: 件名, romaji: kenmei, meaning: けんめい (kenmei) — subject (of email/letter)., level: 4, source: [[basic-vocabulary]] }
- { id: jp_412, display: 会いたい, romaji: aitai, meaning: あいたい (aitai) — want to meet., level: 5, category: animal, source: [[basic-vocabulary]] }
- { id: jp_413, display: 会う, romaji: au, meaning: to meet; to see, level: 4, source: [[basic-vocabulary]] }
- { id: jp_414, display: 会社, romaji: kaisha, meaning: かいしゃ (kaisha) — company., level: 4, source: [[basic-vocabulary]] }
- { id: jp_415, display: 会議, romaji: kaigi, meaning: かいぎ (kaigi) — meeting/conference., level: 4, source: [[basic-vocabulary]] }
- { id: jp_416, display: 伝統, romaji: dentou, meaning: tradition, level: 3, source: [[basic-vocabulary]] }
- { id: jp_417, display: 伝説, romaji: densetsu, meaning: legend; folklore, level: 3, category: body, source: [[basic-vocabulary]] }
- { id: jp_418, display: 住所, romaji: juusho, meaning: じゅうしょ (juusho) — address., level: 4, category: clothing, source: [[basic-vocabulary]] }
- { id: jp_419, display: 体, romaji: karada, meaning: body, level: 4, category: body, source: [[basic-vocabulary]] }
- { id: jp_420, display: 価格, romaji: kakaku, meaning: Price., level: 1, category: food, source: [[basic-vocabulary]] }
- { id: jp_421, display: 保存, romaji: hozon, meaning: ほぞん (hozon) — save/storage., level: 4, source: [[basic-vocabulary]] }
- { id: jp_422, display: 健康, romaji: kenkou, meaning: health, level: 4, source: [[basic-vocabulary]] }
- { id: jp_423, display: 僕のヒーローアカデミア, romaji: bokunohiirooakademia, meaning: My Hero Academia (manga/anime), level: 2, source: [[basic-vocabulary]] }
- { id: jp_424, display: 優しい, romaji: yasashii, meaning: やさしい (yasashii) — kind/gentle., level: 4, source: [[basic-vocabulary]] }
- { id: jp_425, display: 元気, romaji: genki, meaning: げんき (genki) — lively/healthy., level: 5, source: [[basic-vocabulary]] }
- { id: jp_426, display: 写真, romaji: shashin, meaning: photograph; picture, level: 4, source: [[basic-vocabulary]] }
- { id: jp_427, display: 冬, romaji: fuyu, meaning: winter, level: 4, category: time, source: [[basic-vocabulary]] }
- { id: jp_428, display: 凍る, romaji: kooru, meaning: こおる (kooru) — to freeze., level: 3, source: [[basic-vocabulary]] }
- { id: jp_429, display: 切符, romaji: kippu, meaning: ticket (for transport), level: 5, category: travel, source: [[travel]] }
- { id: jp_430, display: 削除, romaji: sakujo, meaning: さくじょ (sakujo) — delete., level: 4, source: [[basic-vocabulary]] }
- { id: jp_431, display: 割引, romaji: waribiki, meaning: Discount., level: 1, source: [[basic-vocabulary]] }
- { id: jp_432, display: 勉強, romaji: benkyou, meaning: study; learning, level: 4, category: body, source: [[basic-vocabulary]] }
- { id: jp_433, display: 動物, romaji: doubutsu, meaning: animal, level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_434, display: 勘定, romaji: kanjou, meaning: かんじょう (kanjou) — bill/check (payment)., level: 4, source: [[basic-vocabulary]] }
- { id: jp_435, display: 勤勉, romaji: kinmen, meaning: きんめん (kinmen) — diligent., level: 3, source: [[basic-vocabulary]] }
- { id: jp_436, display: 医者, romaji: isha, meaning: Doctor., level: 1, source: [[basic-vocabulary]] }
- { id: jp_437, display: 半沢直樹, romaji: hanzawanaoki, meaning: Hanzawa Naoki (Japanese drama), level: 2, source: [[basic-vocabulary]] }
- { id: jp_438, display: 半袖, romaji: hansode, meaning: はんそで (hansode) — short sleeve., level: 3, source: [[basic-vocabulary]] }
- { id: jp_439, display: 協力, romaji: kyouryoku, meaning: きょうりょく (kyouryoku) — cooperation., level: 3, source: [[basic-vocabulary]] }
- { id: jp_440, display: 卵, romaji: tamago, meaning: たまご (tamago) — egg., level: 4, category: food, source: [[basic-vocabulary]] }
- { id: jp_441, display: 友達, romaji: tomodachi, meaning: friend, level: 5, source: [[basic-vocabulary]] }
- { id: jp_442, display: 受け取る, romaji: uketoru, meaning: うけとる (uketoru) — to receive/to accept., level: 4, source: [[basic-vocabulary]] }
- { id: jp_443, display: 受信者, romaji: jushinsha, meaning: じゅしんしゃ (jushinsha) — recipient., level: 3, category: body, source: [[basic-vocabulary]] }
- { id: jp_444, display: 古い, romaji: furui, meaning: ふるい (furui) — old., level: 5, source: [[basic-vocabulary]] }
- { id: jp_445, display: 可愛い, romaji: kawaii, meaning: かわいい (kawaii) — cute., level: 4, source: [[basic-vocabulary]] }
- { id: jp_446, display: 合意, romaji: goui, meaning: ごうい (goui) — agreement., level: 3, source: [[basic-vocabulary]] }
- { id: jp_447, display: 同僚, romaji: douryou, meaning: どうりょう (douryou) — colleague/coworker., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_448, display: 名前, meaning: 이름 — A word by which a person is known., level: 5, category: family, source: [[basic-vocabulary]] }
- { id: jp_449, display: 吠える, romaji: hoeru, meaning: to bark; to howl, level: 3, source: [[basic-vocabulary]] }
- { id: jp_450, display: 吾輩は猫である, romaji: wagahaihanekodearu, meaning: 'I Am a Cat' (Soseki novel), level: 2, category: animal, source: [[basic-vocabulary]] }
- { id: jp_451, display: 告白, meaning: 고백 — Confession (romantic)., level: 3, category: animal, source: [[basic-vocabulary]] }
- { id: jp_452, display: 和牛, romaji: wagyuu, meaning: わぎゅう (wagyuu) — Wagyu beef., level: 3, category: animal, source: [[basic-vocabulary]] }
- { id: jp_453, display: 咲, romaji: saku, meaning: to bloom, level: 4, source: [[basic-vocabulary]] }
- { id: jp_454, display: 咲く, romaji: saku, meaning: さく (saku) — to bloom., level: 4, source: [[basic-vocabulary]] }
- { id: jp_455, display: 哲学, romaji: tetsugaku, meaning: philosophy, level: 3, source: [[basic-vocabulary]] }
- { id: jp_456, display: 問題, romaji: mondai, meaning: problem; question; issue, level: 4, source: [[basic-vocabulary]] }
- { id: jp_457, display: 地図, meaning: ちず (chizu) — map., level: 4, source: [[basic-vocabulary]] }
- { id: jp_458, display: 坊っちゃん, romaji: bocchan, meaning: young master (Bocchan; Soseki novel), level: 2, source: [[basic-vocabulary]] }
- { id: jp_459, display: 報告, romaji: houkoku, meaning: ほうこく (houkoku) — report., level: 4, source: [[basic-vocabulary]] }
- { id: jp_460, display: 報告書, romaji: houkokusho, meaning: report (written), level: 3, category: number, source: [[basic-vocabulary]] }
- { id: jp_461, display: 場所, romaji: basho, meaning: ばしょ (basho) — location/place., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_462, display: 塩, romaji: shio, meaning: しお (shio) — salt., level: 4, source: [[basic-vocabulary]] }
- { id: jp_463, display: 夕食, romaji: yuushoku, meaning: ゆうしょく (yuushoku) — dinner., level: 5, category: food, source: [[basic-vocabulary]] }
- { id: jp_464, display: 外国, romaji: gaikoku, meaning: foreign country, level: 4, category: place, source: [[basic-vocabulary]] }
- { id: jp_465, display: 夢, romaji: yume, meaning: dream, level: 5, source: [[basic-vocabulary]] }
- { id: jp_466, display: 大きい, romaji: ookii, meaning: おおきい (ookii) — big., level: 5, source: [[basic-vocabulary]] }
- { id: jp_467, display: 大学, romaji: daigaku, meaning: university, level: 5, source: [[basic-vocabulary]] }
- { id: jp_468, display: 天ぷら, romaji: tempura, meaning: てんぷら (tempura) — tempura., level: 4, source: [[basic-vocabulary]] }
- { id: jp_469, display: 天文学, romaji: tenmongaku, meaning: astronomy, level: 2, source: [[basic-vocabulary]] }
- { id: jp_470, display: 天気, meaning: てんき (tenki) — weather., level: 4, category: food, source: [[basic-vocabulary]] }
- { id: jp_471, display: 太陽, romaji: taiyou, meaning: たいよう (taiyou) — sun., level: 4, category: nature, source: [[basic-vocabulary]] }
- { id: jp_472, display: 契約, romaji: keiyaku, meaning: けいやく (keiyaku) — contract., level: 4, source: [[basic-vocabulary]] }
- { id: jp_473, display: 好き, meaning: To like; affection. (Romaji: **suki**) Used for people, thin, level: 5, category: food, source: [[basic-vocabulary]] }
- { id: jp_474, display: 嫉妬, romaji: shitto, meaning: しっと (shitto) — jealousy., level: 3, source: [[basic-vocabulary]] }
- { id: jp_475, display: 嫌, romaji: iya, meaning: いや (iya) — unpleasant/disliked., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_476, display: 嫌い, romaji: kirai, meaning: dislike; hate, level: 4, category: clothing, source: [[basic-vocabulary]] }
- { id: jp_477, display: 嬉しい, romaji: ureshii, meaning: うれしい (ureshii) — happy/pleased., level: 5, category: emotion, source: [[basic-vocabulary]] }
- { id: jp_478, display: 宇宙, romaji: uchuu, meaning: universe; space, level: 4, source: [[basic-vocabulary]] }
- { id: jp_479, display: 安い, romaji: yasui, meaning: やすい (yasui) — cheap/inexpensive., level: 5, source: [[basic-vocabulary]] }
- { id: jp_480, display: 宛先, romaji: atesaki, meaning: addressee; destination (address), level: 3, category: clothing, source: [[basic-vocabulary]] }
- { id: jp_481, display: 家族, romaji: kazoku, meaning: family, level: 5, source: [[basic-vocabulary]] }
- { id: jp_482, display: 寂しい, romaji: sabishii, meaning: さびしい (sabishii) — lonely., level: 4, category: number, source: [[basic-vocabulary]] }
- { id: jp_483, display: 寒い, romaji: samui, meaning: さむい (samui) — cold (weather)., level: 5, category: food, source: [[basic-vocabulary]] }
- { id: jp_484, display: 寿司, romaji: sushi, meaning: すし (sushi) — sushi., level: 5, category: food, source: [[basic-vocabulary]] }
- { id: jp_485, display: 小さい, romaji: chiisai, meaning: ちいさい (chiisai) — small., level: 5, source: [[basic-vocabulary]] }
- { id: jp_486, display: 山, romaji: yama, meaning: やま (yama) — mountain., level: 4, category: nature, source: [[basic-vocabulary]] }
- { id: jp_487, display: 島, romaji: shima, meaning: しま (shima) — island., level: 4, category: nature, source: [[basic-vocabulary]] }
- { id: jp_488, display: 嵐, romaji: arashi, meaning: あらし (arashi) — storm., level: 3, source: [[basic-vocabulary]] }
- { id: jp_489, display: 川, romaji: kawa, meaning: かわ (kawa) — river., level: 4, category: nature, source: [[basic-vocabulary]] }
- { id: jp_490, display: 帽子, romaji: boushi, meaning: ぼうし (boushi) — hat/cap., level: 4, category: clothing, source: [[basic-vocabulary]] }
- { id: jp_491, display: 幸せだ, romaji: shiawaseda, meaning: しあわせだ (shiawase da) — happy., level: 5, category: emotion, source: [[basic-vocabulary]] }
- { id: jp_492, display: 店, romaji: mise, meaning: Shop / store., level: 1, category: place, source: [[basic-vocabulary]] }
- { id: jp_493, display: 庭, romaji: niwa, meaning: にわ (niwa) — garden., level: 4, source: [[basic-vocabulary]] }
- { id: jp_494, display: 延期, romaji: enki, meaning: えんき (enki) — postponement., level: 3, category: number, source: [[basic-vocabulary]] }
- { id: jp_495, display: 弁当, romaji: bento, meaning: べんとう (bento) — lunch box., level: 5, source: [[basic-vocabulary]] }
- { id: jp_496, display: 彼女, meaning: 여자친구 / 그녀 — Girlfriend; she., level: 4, source: [[basic-vocabulary]] }
- { id: jp_497, display: 彼氏, meaning: 남자친구 — Boyfriend., level: 4, source: [[basic-vocabulary]] }
- { id: jp_498, display: 後悔, romaji: koukai, meaning: こうかい (koukai) — regret., level: 3, source: [[basic-vocabulary]] }
- { id: jp_499, display: 心配する, romaji: shinpaisuru, meaning: しんぱいする (shinpai suru) — to worry., level: 4, source: [[basic-vocabulary]] }
- { id: jp_500, display: 快適だ, romaji: kaitekida, meaning: かいてきだ (kaiteki da) — comfortable., level: 4, source: [[basic-vocabulary]] }
- { id: jp_501, display: 怒った, romaji: okotta, meaning: おこった (okotta) — angry., level: 4, category: emotion, source: [[basic-vocabulary]] }
- { id: jp_502, display: 怖い, romaji: kowai, meaning: こわいい (kowai) — scary/afraid., level: 4, source: [[basic-vocabulary]] }
- { id: jp_503, display: 思想, romaji: shisou, meaning: thought; ideology, level: 2, source: [[basic-vocabulary]] }
- { id: jp_504, display: 怠け者, romaji: namakemono, meaning: なまけもの (namakemono) — lazy person., level: 3, category: family, source: [[basic-vocabulary]] }
- { id: jp_505, display: 恋人, meaning: 연인 — Lover; romantic partner., level: 3, category: animal, source: [[basic-vocabulary]] }
- { id: jp_506, display: 恥ずかしい, romaji: hazukashii, meaning: はずかしい (hazukashii) — embarrassed., level: 3, source: [[basic-vocabulary]] }
- { id: jp_507, display: 悪い, romaji: warui, meaning: わるい (warui) — bad., level: 4, source: [[basic-vocabulary]] }
- { id: jp_508, display: 悲しい, romaji: kanashii, meaning: かなしい (kanashii) — sad., level: 4, category: emotion, source: [[basic-vocabulary]] }
- { id: jp_509, display: 意見, romaji: iken, meaning: いけん (iken) — opinion., level: 4, source: [[basic-vocabulary]] }
- { id: jp_510, display: 愛する, romaji: aisuru, meaning: to love, level: 3, category: emotion, source: [[basic-vocabulary]] }
- { id: jp_511, display: 感動, romaji: kandou, meaning: かんどう (kandou) — deep emotion/touched., level: 3, source: [[basic-vocabulary]] }
- { id: jp_512, display: 感謝する, romaji: kanshasuru, meaning: かんしゃする (kansha suru) — to be grateful., level: 4, source: [[basic-vocabulary]] }
- { id: jp_513, display: 成長する, romaji: seichousuru, meaning: せいちょうする (seichou suru) — to grow., level: 4, source: [[basic-vocabulary]] }
- { id: jp_514, display: 戦略, romaji: senryaku, meaning: strategy, level: 3, source: [[basic-vocabulary]] }
- { id: jp_515, display: 手, romaji: te, meaning: Hand., level: 1, category: body, source: [[basic-vocabulary]] }
- { id: jp_516, display: 手袋, romaji: tebukuro, meaning: てぶくろ (tebukuro) — gloves., level: 4, category: clothing, source: [[basic-vocabulary]] }
- { id: jp_517, display: 承認, romaji: shounin, meaning: しょうにん (shounin) — approval., level: 3, source: [[basic-vocabulary]] }
- { id: jp_518, display: 持帰り, romaji: mochikaori, meaning: もちかえり (mochikaori) — takeout., level: 4, source: [[basic-vocabulary]] }
- { id: jp_519, display: 接続, romaji: setsuzoku, meaning: せつぞく (setsuzoku) — connection., level: 4, source: [[basic-vocabulary]] }
- { id: jp_520, display: 提出, romaji: teishutsu, meaning: ていせい (teishutsu) — submission., level: 4, source: [[basic-vocabulary]] }
- { id: jp_521, display: 提案書, romaji: teiansho, meaning: proposal document, level: 3, source: [[basic-vocabulary]] }
- { id: jp_522, display: 文化, romaji: bunka, meaning: culture, level: 4, source: [[basic-vocabulary]] }
- { id: jp_523, display: 新しい, romaji: atarashii, meaning: あたらしい (atarashii) — new., level: 5, source: [[basic-vocabulary]] }
- { id: jp_524, display: 旅, romaji: tabi, meaning: journey; travel, level: 4, category: travel, source: [[travel]] }
- { id: jp_525, display: 旅行, romaji: ryokou, meaning: travel; trip, level: 5, category: travel, source: [[travel]] }
- { id: jp_526, display: 日常, romaji: nichijou, meaning: everyday life; daily, level: 4, category: time, source: [[basic-vocabulary]] }
- { id: jp_527, display: 日程, romaji: nittei, meaning: schedule; agenda, level: 3, source: [[basic-vocabulary]] }
- { id: jp_528, display: 明るい, romaji: akarui, meaning: あかるい (akarui) — bright/lively., level: 4, source: [[basic-vocabulary]] }
- { id: jp_529, display: 星, romaji: hoshi, meaning: ほし (hoshi) — star., level: 4, category: nature, source: [[basic-vocabulary]] }
- { id: jp_530, display: 映画, romaji: eiga, meaning: Movie / film., level: 1, source: [[basic-vocabulary]] }
- { id: jp_531, display: 春, romaji: haru, meaning: spring (season), level: 5, category: family, source: [[basic-vocabulary]] }
- { id: jp_532, display: 昼食, romaji: chuushoku, meaning: ちゅうしょく (chuushoku) — lunch., level: 5, source: [[basic-vocabulary]] }
- { id: jp_533, display: 普通だ, romaji: futsuuda, meaning: ふつうだ (futsuu da) — ordinary., level: 4, source: [[basic-vocabulary]] }
- { id: jp_534, display: 暑い, romaji: atsui, meaning: あつい (atsui) — hot (weather)., level: 5, category: food, source: [[basic-vocabulary]] }
- { id: jp_535, display: 暗い, romaji: kurai, meaning: くらい (kurai) — dark., level: 4, source: [[basic-vocabulary]] }
- { id: jp_536, display: 月, romaji: tsuki, meaning: つき (tsuki) — moon/month., level: 4, category: nature, source: [[basic-vocabulary]] }
- { id: jp_537, display: 朝食, romaji: choushoku, meaning: ちょうしょく (choushoku) — breakfast., level: 5, source: [[basic-vocabulary]] }
- { id: jp_538, display: 木, romaji: ki, meaning: き (ki) — tree/wood., level: 5, category: nature, source: [[basic-vocabulary]] }
- { id: jp_539, display: 果物, romaji: kudamono, meaning: くだもの (kudamono) — fruit., level: 4, category: food, source: [[basic-vocabulary]] }
- { id: jp_540, display: 森, romaji: mori, meaning: もり (mori) — forest., level: 4, category: nature, source: [[basic-vocabulary]] }
- { id: jp_541, display: 検討, romaji: kentou, meaning: けんとう (kentou) — examination/review., level: 3, source: [[basic-vocabulary]] }
- { id: jp_542, display: 楽器, romaji: gakki, meaning: musical instrument, level: 4, source: [[basic-vocabulary]] }
- { id: jp_543, display: 機嫌が悪い, romaji: kigengawarui, meaning: きげんがわるい (kigen ga warui) — in a bad mood., level: 3, source: [[basic-vocabulary]] }
- { id: jp_544, display: 欲張り, romaji: yokubari, meaning: よくばり (yokubari) — greedy., level: 3, source: [[basic-vocabulary]] }
- { id: jp_545, display: 正月, romaji: shougatsu, meaning: New Year / January., level: 1, category: body, source: [[basic-vocabulary]] }
- { id: jp_546, display: 歴史, romaji: rekishi, meaning: history, level: 3, source: [[basic-vocabulary]] }
- { id: jp_547, display: 水, romaji: mizu, meaning: Water., level: 1, category: nature, source: [[basic-vocabulary]] }
- { id: jp_548, display: 水泳, romaji: suiei, meaning: Swimming., level: 1, source: [[basic-vocabulary]] }
- { id: jp_549, display: 決定, romaji: kettei, meaning: けってい (kettei) — decision., level: 4, source: [[basic-vocabulary]] }
- { id: jp_550, display: 沉着, romaji: chinryaku, meaning: ちんちゃく (chinryaku) — calm/serene., level: 3, source: [[basic-vocabulary]] }
- { id: jp_551, display: 油, romaji: abura, meaning: あぶら (abura) — oil., level: 4, source: [[basic-vocabulary]] }
- { id: jp_552, display: 注文, romaji: chuumon, meaning: ちゅうもん (chuumon) — order., level: 5, source: [[basic-vocabulary]] }
- { id: jp_553, display: 泳ぐ, romaji: oyogu, meaning: およぐ (oyogu) — to swim., level: 4, source: [[basic-vocabulary]] }
- { id: jp_554, display: 洗う, romaji: arau, meaning: あらう (arau) — to wash., level: 4, source: [[basic-vocabulary]] }
- { id: jp_555, display: 海, romaji: umi, meaning: うみ (umi) — sea., level: 5, category: nature, source: [[basic-vocabulary]] }
- { id: jp_556, display: 海洋, romaji: kaiyou, meaning: ocean; marine, level: 2, category: nature, source: [[basic-vocabulary]] }
- { id: jp_557, display: 添付, romaji: tenpu, meaning: てんぷ (tenpu) — attachment., level: 4, category: number, source: [[basic-vocabulary]] }
- { id: jp_558, display: 温かい, romaji: atatakai, meaning: あたたかい (atatakai) — warm., level: 3, category: body, source: [[basic-vocabulary]] }
- { id: jp_559, display: 湖, romaji: mizuumi, meaning: みずうみ (mizuum i) — lake., level: 3, category: nature, source: [[basic-vocabulary]] }
- { id: jp_560, display: 満腹, romaji: manpuku, meaning: まんぷく (manpuku) — full (after eating)., level: 5, category: food, source: [[basic-vocabulary]] }
- { id: jp_561, display: 溶ける, romaji: tokeru, meaning: とける (tokeru) — to melt., level: 3, source: [[basic-vocabulary]] }
- { id: jp_562, display: 無礼, romaji: burei, meaning: ぶれい (burei) — rude., level: 3, source: [[basic-vocabulary]] }
- { id: jp_563, display: 焼肉, romaji: yakiniku, meaning: yakiniku (Korean-style grilled meat), level: 4, category: food, source: [[basic-vocabulary]] }
- { id: jp_564, display: 熊, romaji: kuma, meaning: くま (kuma) — bear., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_565, display: 熱, romaji: netsu, meaning: Fever / heat., level: 1, category: food, source: [[basic-vocabulary]] }
- { id: jp_566, display: 牛, romaji: ushi, meaning: うし (ushi) — cow., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_567, display: 牛乳, romaji: gyuunyuu, meaning: ぎゅうにゅう (gyuunyuu) — milk., level: 4, category: food, source: [[basic-vocabulary]] }
- { id: jp_568, display: 牛肉, romaji: gyuuniku, meaning: ぎゅうにく (gyuuniku) — beef., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_569, display: 犬, romaji: inu, meaning: いぬ (inu) — dog., level: 5, category: animal, source: [[basic-vocabulary]] }
- { id: jp_570, display: 狩る, romaji: karu, meaning: かる (karu) — to hunt., level: 3, source: [[basic-vocabulary]] }
- { id: jp_571, display: 猫, romaji: neko, meaning: ねこ (neko) — cat., level: 5, category: animal, source: [[basic-vocabulary]] }
- { id: jp_572, display: 猿, romaji: saru, meaning: monkey, level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_573, display: 現金, romaji: genkin, meaning: Cash., level: 1, source: [[basic-vocabulary]] }
- { id: jp_574, display: 甘い, romaji: amai, meaning: あまい (amai) — sweet., level: 5, source: [[basic-vocabulary]] }
- { id: jp_575, display: 生活, romaji: seikatsu, meaning: life; living, level: 4, source: [[basic-vocabulary]] }
- { id: jp_576, display: 画面, romaji: gamen, meaning: Screen / display., level: 1, source: [[basic-vocabulary]] }
- { id: jp_577, display: 病院, romaji: byo-in, meaning: Hospital., level: 1, source: [[basic-vocabulary]] }
- { id: jp_578, display: 痛み, romaji: itami, meaning: Pain., level: 1, source: [[basic-vocabulary]] }
- { id: jp_579, display: 発表, romaji: happyou, meaning: はっぴょう (happyou) — presentation/announcement., level: 4, category: emotion, source: [[basic-vocabulary]] }
- { id: jp_580, display: 白いズボン, romaji: shiroizubon, meaning: しろいずぼん (shiroi zubon) — white pants., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_581, display: 着る, romaji: kiru, meaning: きる (kiru) — to wear (top layer)., level: 5, category: body, source: [[basic-vocabulary]] }
- { id: jp_582, display: 睡眠, romaji: suimin, meaning: sleep, level: 3, source: [[basic-vocabulary]] }
- { id: jp_583, display: 石の上にも三年, romaji: ishinouenimosannen, meaning: three years on a stone (perseverance proverb), level: 2, category: body, source: [[basic-vocabulary]] }
- { id: jp_584, display: 砂漠, romaji: sabaku, meaning: さばく (sabaku) — desert., level: 3, source: [[basic-vocabulary]] }
- { id: jp_585, display: 砂糖, romaji: satou, meaning: さとう (satou) — sugar., level: 4, source: [[basic-vocabulary]] }
- { id: jp_586, display: 確認, romaji: kakunin, meaning: かくにん (kakunin) — confirmation., level: 4, source: [[basic-vocabulary]] }
- { id: jp_587, display: 社会, romaji: shakai, meaning: society, level: 4, source: [[basic-vocabulary]] }
- { id: jp_588, display: 社員, romaji: shain, meaning: しゃいん (shain) — company employee., level: 4, source: [[basic-vocabulary]] }
- { id: jp_589, display: 祝日, romaji: shukujitsu, meaning: Public holiday., level: 1, category: time, source: [[basic-vocabulary]] }
- { id: jp_590, display: 神話, romaji: shinwa, meaning: mythology; myth, level: 3, source: [[basic-vocabulary]] }
- { id: jp_591, display: 祭り, romaji: matsuri, meaning: Festival., level: 1, source: [[basic-vocabulary]] }
- { id: jp_592, display: 空, romaji: sora, meaning: そら (sora) — sky., level: 5, category: nature, source: [[basic-vocabulary]] }
- { id: jp_593, display: 空港, romaji: kuukou, meaning: airport, level: 4, category: place, source: [[basic-vocabulary]] }
- { id: jp_594, display: 空腹, romaji: kuufuku, meaning: かうふく (kuufuku) — hungry., level: 5, source: [[basic-vocabulary]] }
- { id: jp_595, display: 立派, romaji: rippa, meaning: りっぱ (rippa) — splendid/magnificent., level: 3, source: [[basic-vocabulary]] }
- { id: jp_596, display: 米, romaji: kome, meaning: rice (uncooked grain), level: 4, category: food, source: [[basic-vocabulary]] }
- { id: jp_597, display: 結婚式, romaji: kekkonshiki, meaning: Wedding ceremony., level: 1, source: [[basic-vocabulary]] }
- { id: jp_598, display: 絹, romaji: kinu, meaning: きぬ (kinu) — silk., level: 3, source: [[basic-vocabulary]] }
- { id: jp_599, display: 継続は力なり, romaji: keizokuwachikaranari, meaning: persistence is power (Japanese proverb), level: 2, category: number, source: [[basic-vocabulary]] }
- { id: jp_600, display: 綺麗, meaning: Beautiful (people, things, scenery); clean; pure. Two main s, level: 4, category: number, source: [[basic-vocabulary]] }
- { id: jp_601, display: 綿, romaji: men, meaning: めん (men) — cotton., level: 3, source: [[basic-vocabulary]] }
- { id: jp_602, display: 緊張する, romaji: kinchousuru, meaning: きんちょうする (kinchou suru) — to be nervous., level: 4, source: [[basic-vocabulary]] }
- { id: jp_603, display: 締め切り, romaji: shimekiri, meaning: deadline, level: 4, source: [[basic-vocabulary]] }
- { id: jp_604, display: 緩い, romaji: yurui, meaning: ゆるい (yurui) — loose., level: 3, source: [[basic-vocabulary]] }
- { id: jp_605, display: 羊, romaji: hitsuji, meaning: ひつじ (hitsuji) — sheep., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_606, display: 羊毛, romaji: youmou, meaning: ようもう (youmou) — wool., level: 3, source: [[basic-vocabulary]] }
- { id: jp_607, display: 美しい, romaji: utsukushii, meaning: beautiful, level: 4, source: [[basic-vocabulary]] }
- { id: jp_608, display: 美味しい, romaji: oishii, meaning: おいしい (oishii) — delicious., level: 5, source: [[basic-vocabulary]] }
- { id: jp_609, display: 羨ましい, romaji: urayamashii, meaning: うらやましい (urayamashii) — envious., level: 3, source: [[basic-vocabulary]] }
- { id: jp_610, display: 習慣, romaji: shuukan, meaning: habit; custom, level: 3, source: [[basic-vocabulary]] }
- { id: jp_611, display: 肉, romaji: niku, meaning: Meat., level: 1, category: food, source: [[basic-vocabulary]] }
- { id: jp_612, display: 育児, romaji: ikuji, meaning: childcare; raising children, level: 2, category: family, source: [[basic-vocabulary]] }
- { id: jp_613, display: 脱ぐ, romaji: nugu, meaning: ぬぐ (nugu) — to take off (clothing)., level: 4, source: [[basic-vocabulary]] }
- { id: jp_614, display: 自然, romaji: shizen, meaning: nature, level: 4, source: [[basic-vocabulary]] }
- { id: jp_615, display: 良い, romaji: yoi, meaning: good, level: 5, source: [[basic-vocabulary]] }
- { id: jp_616, display: 花, romaji: hana, meaning: はな (hana) — flower., level: 5, category: nature, source: [[basic-vocabulary]] }
- { id: jp_617, display: 花火, romaji: hanabi, meaning: Fireworks., level: 1, category: nature, source: [[basic-vocabulary]] }
- { id: jp_618, display: 芸術, romaji: geijutsu, meaning: art, level: 3, source: [[basic-vocabulary]] }
- { id: jp_619, display: 苦い, romaji: nigai, meaning: にがい (nigai) — bitter., level: 4, source: [[basic-vocabulary]] }
- { id: jp_620, display: 茶, romaji: cha, meaning: tea (Japanese style), level: 4, category: food, source: [[basic-vocabulary]] }
- { id: jp_621, display: 草, romaji: kusa, meaning: くさ (kusa) — grass., level: 4, source: [[basic-vocabulary]] }
- { id: jp_622, display: 草原, romaji: sougen, meaning: grassland; prairie, level: 3, source: [[basic-vocabulary]] }
- { id: jp_623, display: 荷物, romaji: nimotsu, meaning: luggage; baggage, level: 4, source: [[basic-vocabulary]] }
- { id: jp_624, display: 落ちる, romaji: ochiru, meaning: おちる (ochiru) — to fall., level: 4, source: [[basic-vocabulary]] }
- { id: jp_625, display: 葉, romaji: ha, meaning: は (ha) — leaf., level: 4, source: [[basic-vocabulary]] }
- { id: jp_626, display: 薬, romaji: kusuri, meaning: Medicine / drug., level: 1, source: [[basic-vocabulary]] }
- { id: jp_627, display: 虹, romaji: niji, meaning: にじ (niji) — rainbow., level: 4, category: nature, source: [[basic-vocabulary]] }
- { id: jp_628, display: 蛇, romaji: hebi, meaning: へび (hebi) — snake., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_629, display: 蜂, romaji: hachi, meaning: はち (hachi) — bee., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_630, display: 蝶, romaji: chou, meaning: ちょう (chou) — butterfly., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_631, display: 親切, romaji: shinsetsu, meaning: しんせつ (shinsetsu) — kindhearted., level: 3, category: body, source: [[basic-vocabulary]] }
- { id: jp_632, display: 記録, romaji: kiroku, meaning: きろく (kiroku) — record., level: 4, source: [[basic-vocabulary]] }
- { id: jp_633, display: 試験, romaji: shiken, meaning: examination; test, level: 4, source: [[basic-vocabulary]] }
- { id: jp_634, display: 誕生日, romaji: tanjyo-bi, meaning: Birthday., level: 1, category: time, source: [[basic-vocabulary]] }
- { id: jp_635, display: 読書, romaji: dokusho, meaning: Reading., level: 1, source: [[basic-vocabulary]] }
- { id: jp_636, display: 議事録, romaji: gijiroku, meaning: meeting minutes, level: 2, category: time, source: [[basic-vocabulary]] }
- { id: jp_637, display: 議題, romaji: gidai, meaning: ぎだい (gidai) — agenda topic., level: 3, source: [[basic-vocabulary]] }
- { id: jp_638, display: 谷, romaji: tani, meaning: たに (tani) — valley., level: 3, source: [[basic-vocabulary]] }
- { id: jp_639, display: 豚, romaji: buta, meaning: ぶた (buta) — pig., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_640, display: 豚肉, romaji: butaniku, meaning: ぶたにく (butaniku) — pork., level: 4, source: [[basic-vocabulary]] }
- { id: jp_641, display: 赤いドレス, romaji: akaidoresu, meaning: あかいどれす (akai doresu) — red dress., level: 4, category: clothing, source: [[basic-vocabulary]] }
- { id: jp_642, display: 走る, romaji: hashiru, meaning: はしる (hashiru) — to run., level: 4, source: [[basic-vocabulary]] }
- { id: jp_643, display: 走れメロス, romaji: hashiremerosu, meaning: 'Run, Melos!' (Dazai Osamu short story), level: 2, source: [[basic-vocabulary]] }
- { id: jp_644, display: 趣味, meaning: 취미 — Hobby; pastime., level: 4, source: [[basic-vocabulary]] }
- { id: jp_645, display: 足, romaji: ashi, meaning: Foot / leg., level: 1, category: body, source: [[basic-vocabulary]] }
- { id: jp_646, display: 転送, romaji: tensou, meaning: transfer (forwarding); transmission, level: 3, source: [[basic-vocabulary]] }
- { id: jp_647, display: 輝く, romaji: kagayaku, meaning: かがやく (kagayaku) — to shine., level: 3, source: [[basic-vocabulary]] }
- { id: jp_648, display: 辛い, romaji: karai, meaning: からい (karai) — spicy., level: 4, source: [[basic-vocabulary]] }
- { id: jp_649, display: 返信, romaji: henshin, meaning: へんしん (henshin) — reply., level: 4, source: [[basic-vocabulary]] }
- { id: jp_650, display: 返品, romaji: henpin, meaning: Return (of goods)., level: 1, source: [[basic-vocabulary]] }
- { id: jp_651, display: 送る, romaji: okuru, meaning: おくる (okuru) — to send., level: 4, source: [[basic-vocabulary]] }
- { id: jp_652, display: 送信者, romaji: soushinsha, meaning: そうしんしゃ (soushinsha) — sender., level: 3, source: [[basic-vocabulary]] }
- { id: jp_653, display: 速い, romaji: hayai, meaning: はやい (hayai) — fast., level: 4, source: [[basic-vocabulary]] }
- { id: jp_654, display: 進撃の巨人, romaji: shingekinokyojin, meaning: Attack on Titan (Japanese manga/anime), level: 2, source: [[basic-vocabulary]] }
- { id: jp_655, display: 遅い, romaji: osoli, meaning: おそい (osoi) — slow., level: 4, source: [[basic-vocabulary]] }
- { id: jp_656, display: 部下, romaji: buka, meaning: ぶか (buka) — subordinate., level: 4, source: [[basic-vocabulary]] }
- { id: jp_657, display: 部門, romaji: bumon, meaning: department; division, level: 3, source: [[basic-vocabulary]] }
- { id: jp_658, display: 部隊鍋, romaji: butainabe, meaning: buta-nabe; military hot pot, level: 2, source: [[basic-vocabulary]] }
- { id: jp_659, display: 都市, romaji: toshi, meaning: city; urban area, level: 3, category: place, source: [[basic-vocabulary]] }
- { id: jp_660, display: 酸っぱい, romaji: suppai, meaning: 酸っぱい (suppai) — sour., level: 4, source: [[basic-vocabulary]] }
- { id: jp_661, display: 野球, romaji: yakyū, meaning: Baseball., level: 1, source: [[basic-vocabulary]] }
- { id: jp_662, display: 野生, romaji: yasei, meaning: やせい (yasei) — wild., level: 3, source: [[basic-vocabulary]] }
- { id: jp_663, display: 野菜, romaji: yasai, meaning: やさい (yasai) — vegetables., level: 4, category: food, source: [[basic-vocabulary]] }
- { id: jp_664, display: 金融, romaji: kinyuu, meaning: finance; financial, level: 3, source: [[basic-vocabulary]] }
- { id: jp_665, display: 銀行, romaji: ginkou, meaning: bank, level: 4, source: [[basic-vocabulary]] }
- { id: jp_666, display: 鋼の錬金術師, romaji: haganenorenkinjutsushi, meaning: Fullmetal Alchemist (manga/anime), level: 2, source: [[basic-vocabulary]] }
- { id: jp_667, display: 長袖, romaji: nagasode, meaning: ながそで (nagasode) — long sleeve., level: 3, source: [[basic-vocabulary]] }
- { id: jp_668, display: 雨, romaji: ame, meaning: あめ (ame) — rain., level: 5, category: nature, source: [[basic-vocabulary]] }
- { id: jp_669, display: 雪, romaji: yuki, meaning: ゆき (yuki) — snow., level: 4, category: nature, source: [[basic-vocabulary]] }
- { id: jp_670, display: 雪国, romaji: yukiguni, meaning: snow country (Kawabata novel), level: 2, category: nature, source: [[basic-vocabulary]] }
- { id: jp_671, display: 雲, romaji: kumo, meaning: くも (kumo) — cloud., level: 4, category: nature, source: [[basic-vocabulary]] }
- { id: jp_672, display: 雷, romaji: kaminari, meaning: かみなり (kaminari) — thunder., level: 4, source: [[basic-vocabulary]] }
- { id: jp_673, display: 電話, romaji: denwa, meaning: でんわ (denwa) — telephone/phone call., level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_674, display: 電話番号, romaji: denwabangou, meaning: でんわばんごう (denwabangou) — phone number., level: 5, category: number, source: [[basic-vocabulary]] }
- { id: jp_675, display: 電車, romaji: densha, meaning: train (electric), level: 5, category: nature, source: [[basic-vocabulary]] }
- { id: jp_676, display: 青いシャツ, romaji: aoishatsu, meaning: あおいシャツ (aoi shatsu) — blue shirt., level: 4, category: clothing, source: [[basic-vocabulary]] }
- { id: jp_677, display: 面白い, meaning: Interesting; funny; amusing; enjoyable. Combines English "in, level: 4, category: emotion, source: [[basic-vocabulary]] }
- { id: jp_678, display: 革, romaji: kawa, meaning: leather, level: 3, category: food, source: [[basic-vocabulary]] }
- { id: jp_679, display: 靴, romaji: kutsu, meaning: くつ (kutsu) — shoes., level: 5, category: clothing, source: [[basic-vocabulary]] }
- { id: jp_680, display: 靴下, romaji: kutsushita, meaning: くつした (kutsushita) — socks., level: 4, category: clothing, source: [[basic-vocabulary]] }
- { id: jp_681, display: 音楽, romaji: ongaku, meaning: Music., level: 1, source: [[basic-vocabulary]] }
- { id: jp_682, display: 頭, romaji: atama, meaning: Head., level: 1, category: body, source: [[basic-vocabulary]] }
- { id: jp_683, display: 顧客, romaji: kokyaku, meaning: customer; client, level: 3, source: [[basic-vocabulary]] }
- { id: jp_684, display: 風, romaji: kaze, meaning: かぜ (kaze) — wind., level: 4, category: nature, source: [[basic-vocabulary]] }
- { id: jp_685, display: 風邪, romaji: kaze, meaning: Cold (illness)., level: 1, source: [[basic-vocabulary]] }
- { id: jp_686, display: 飛ぶ, romaji: tobu, meaning: とぶ (tobu) — to fly., level: 4, source: [[basic-vocabulary]] }
- { id: jp_687, display: 餃子, romaji: gyouza, meaning: gyoza; pan-fried dumpling, level: 4, source: [[basic-vocabulary]] }
- { id: jp_688, display: 馬, romaji: uma, meaning: うま (uma) — horse., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_689, display: 驚いた, romaji: odoraita, meaning: おどろいた (odoraita) — surprised., level: 4, category: emotion, source: [[basic-vocabulary]] }
- { id: jp_690, display: 高い, romaji: takai, meaning: たかい (takai) — expensive/high., level: 5, source: [[basic-vocabulary]] }
- { id: jp_691, display: 鬼滅の刃, romaji: kimetsunoyaiba, meaning: Demon Slayer (manga/anime), level: 2, category: time, source: [[basic-vocabulary]] }
- { id: jp_692, display: 魚, romaji: sakana, meaning: さかな (sakana) — fish., level: 5, category: animal, source: [[basic-vocabulary]] }
- { id: jp_693, display: 鯨, romaji: kujira, meaning: whale, level: 3, category: animal, source: [[basic-vocabulary]] }
- { id: jp_694, display: 鳥, romaji: tori, meaning: とり (tori) — bird., level: 5, category: animal, source: [[basic-vocabulary]] }
- { id: jp_695, display: 鶏, romaji: niwatori, meaning: にわとり (niwatori) — chicken., level: 4, source: [[basic-vocabulary]] }
- { id: jp_696, display: 鶏肉, romaji: toriniku, meaning: とりにく (toriniku) — chicken meat., level: 4, category: food, source: [[basic-vocabulary]] }
- { id: jp_697, display: 鹿, romaji: shika, meaning: しか (shika) — deer., level: 4, category: animal, source: [[basic-vocabulary]] }
- { id: jp_698, display: 麺, romaji: men, meaning: めん (men) — noodles., level: 4, category: food, source: [[basic-vocabulary]] }
- { id: jp_699, display: 黒い靴, romaji: kuroikutsu, meaning: くろいくつ (kuroi kutsu) — black shoes., level: 4, category: clothing, source: [[basic-vocabulary]] }
- { id: jp_700, display: 龍, romaji: ryuu, meaning: dragon (Japanese/Chinese mythology), level: 3, category: animal, source: [[basic-vocabulary]] }
- { id: jp_701, display: 여권, romaji: yeokwon, meaning: passport (Korean word), level: 3, category: travel, source: [[travel]] }
```
