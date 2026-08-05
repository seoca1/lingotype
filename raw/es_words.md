# Spanish Word/Sentence Corpus (Accent 처리)

> **상태**: 골격. Phase 6에서 본격 확장.
> **ADR-0003**: 액센트 직접 입력 + ASCII 폴백.

## 코퍼스 형식

```yaml
- id: es_001
  display: hola
  meaning: 안녕
  level: 1            # 1=A1, 2=A2, 3=B1, 4=B2, 5=C1/C2
  category: greeting
  accentMode: any     # 'strict' | 'loose' | 'any'
```

`accentMode`:
- `strict`: Strict 모드에서만 등장 (액센트 직접 입력 필수)
- `loose`: Loose 모드에서만 등장 (ASCII 폴백 OK)
- `any`: 두 모드 모두 등장

## Level 1 (A1, 액센트 없거나 일부)

```yaml
- { id: es_001, display: hola, meaning: 안녕, level: 1, category: greeting, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_002, display: adios, meaning: 안녕히, level: 1, category: greeting, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_003, display: gracias, meaning: 고마워, level: 1, category: greeting, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_004, display: por_favor, meaning: 부디, level: 1, category: greeting, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_005, display: si, meaning: 네, level: 1, category: basic, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_006, display: no, meaning: 아니오, level: 1, category: basic, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_007, display: uno, meaning: 하나, level: 1, category: number, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_008, display: dos, meaning: 둘, level: 1, category: number, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_009, display: tres, meaning: 셋, level: 1, category: number, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_010, display: cuatro, meaning: 넷, level: 1, category: number, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_011, display: cinco, meaning: 다섯, level: 1, category: number, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_012, display: diez, meaning: 열, level: 1, category: number, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_013, display: rojo, meaning: 빨강, level: 1, category: color, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_014, display: azul, meaning: 파랑, level: 1, category: color, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_015, display: verde, meaning: 초록, level: 1, category: color, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_016, display: gato, meaning: 고양이, level: 1, category: animal, accentMode: any, source: [[animals-vocabulary]] }
- { id: es_017, display: perro, meaning: 개, level: 1, category: animal, accentMode: any, source: [[animals-vocabulary]] }
- { id: es_049, display: pajaro, meaning: 새, level: 1, category: animal, accentMode: any, source: [[animals-vocabulary]] }
- { id: es_050, display: vaca, meaning: 소, level: 1, category: animal, accentMode: any, source: [[animals-vocabulary]] }
- { id: es_051, display: pez, meaning: 물고기, level: 1, category: animal, accentMode: any, source: [[animals-vocabulary]] }
- { id: es_052, display: rana, meaning: 개구리, level: 1, category: animal, accentMode: any, source: [[animals-vocabulary]] }
- { id: es_053, display: leon, meaning:狮子, level: 1, category: animal, accentMode: any, source: [[animals-vocabulary]] }
- { id: es_054, display: conejo, meaning: 토끼, level: 1, category: animal, accentMode: any, source: [[animals-vocabulary]] }
- { id: es_018, display: libro, meaning: 책, level: 1, category: object, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_019, display: agua, meaning: 물, level: 1, category: food, accentMode: any, source: [[food-vocabulary]] }
- { id: es_020, display: pan, meaning: 빵, level: 1, category: food, accentMode: any, source: [[food-vocabulary]] }
- { id: es_021, display: hoy, meaning: 오늘, level: 1, category: time, accentMode: any, source: [[time-prepositions-vocabulary]] }
- { id: es_022, display: manana, meaning: 내일/아침, level: 1, category: time, accentMode: any, source: [[time-prepositions-vocabulary]] }
  # 주의: mañana (mañana) — 두 의미 모두 있음
- { id: es_023, display: madre, meaning: 어머니, level: 1, category: family, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_024, display: padre, meaning: 아버지, level: 1, category: family, accentMode: any, source: [[basic-vocabulary]] }
```

## Level 1 — 자연 (Nature)

```yaml
- { id: es_055, display: rio, meaning: 강, level: 1, category: nature, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_056, display: lago, meaning: 호수, level: 1, category: nature, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_057, display: montana, meaning: 산, level: 1, category: nature, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_058, display: bosque, meaning: 숲, level: 1, category: nature, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_059, display: cielo, meaning: 하늘, level: 1, category: nature, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_060, display: tierra, meaning: 땅, level: 1, category: nature, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_061, display: fuego, meaning: 불, level: 1, category: nature, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_062, display: flor, meaning: 꽃, level: 1, category: nature, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_063, display: hoja, meaning: 잎, level: 1, category: nature, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_064, display: luna, meaning: 달, level: 1, category: nature, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_065, display: lluvia, meaning: 비, level: 1, category: nature, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_066, display: nieve, meaning: 눈, level: 1, category: nature, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_067, display: estrella, meaning: 별, level: 1, category: nature, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_068, display: sol, meaning: 태양, level: 1, category: nature, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_069, display: viento, meaning: 바람, level: 1, category: nature, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_070, display: tormenta, meaning: 폭풍, level: 1, category: nature, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_071, display: trueno, meaning: 천둥, level: 1, category: nature, accentMode: any, source: [[basic-vocabulary]] }
```

## Level 1 — 액센트 단어 (기본)

```yaml
- { id: es_030, display: nino, meaning: 아이 (남아), level: 1, category: family, accentMode: loose, source: [[basic-vocabulary]] }
  # ñ 직접 또는 n 폴백
- { id: es_031, display: senor, meaning: 신사, level: 1, category: person, accentMode: loose, source: [[basic-vocabulary]] }
  # ñ 직접 또는 n 폴백
- { id: es_032, display: anio, meaning: 해/년, level: 1, category: time, accentMode: loose, source: [[basic-vocabulary]] }
  # ñ 폴백
- { id: es_033, display: maniana, meaning: 내일/아침, level: 1, category: time, accentMode: loose, source: [[time-prepositions-vocabulary]] }
- { id: es_034, display: espana, meaning: 스페인, level: 1, category: place, accentMode: loose, source: [[basic-vocabulary]] }
```

## Level 2 (A2) — 액센트 단어 증가

```yaml
- { id: es_040, display: rapido, meaning: 빠른, level: 2, category: adjective, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_041, display: facil, meaning: 쉬운, level: 2, category: adjective, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_042, display: dificil, meaning: 어려운, level: 2, category: adjective, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_043, display: telefono, meaning: 전화, level: 2, category: object, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_044, display: restaurante, meaning: 식당, level: 2, category: place, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_045, display: hospital, meaning: 병원, level: 2, category: place, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_046, display: importante, meaning: 중요한, level: 2, category: adjective, accentMode: any, source: [[basic-vocabulary]] }
- { id: es_047, display: despues, meaning: 그 후, level: 2, category: time, accentMode: any, source: [[basic-vocabulary]] }
  # 부사형: después — é
- { id: es_048, display: ademas, meaning: 게다가, level: 2, category: basic, accentMode: any, source: [[basic-vocabulary]] }
  # además — á
```

## Level 3~5 (B1~C2)

(추가 예정 — Phase 6)

## 문장 (Sentences)

```yaml
- { id: ess_001, display: Hola, ¿cómo estás?, meaning: "안녕, 어떻게 지내?", level: 1, category: greeting, accentMode: any, source: [[basic-vocabulary]] }
  # ¿ → ¿ or ?
- { id: ess_002, display: Buenos días, ¿qué tal?, meaning: "좋은 아침, 어때?", level: 1, category: greeting, accentMode: any, source: [[basic-vocabulary]] }
- { id: ess_003, display: ¿Dónde está el baño?, meaning: "화장실 어디예요?", level: 1, category: question, accentMode: any, source: [[basic-vocabulary]] }
- { id: ess_004, display: Me gustaría un café., meaning: "커피 한 잔 주세요.", level: 2, category: restaurant, accentMode: any, source: [[basic-vocabulary]] }
- { id: ess_005, display: Muchísimas gracias., meaning: "정말정말 고마워요.", level: 1, category: greeting, accentMode: any, source: [[basic-vocabulary]] }
```

## Viajes (Travel) — Level 1~2

> **출처**: [[viajes]] (CEFR A1-A2)

### Aeropuerto y vuelo

```yaml
- { id: es_t_001, display: pasaporte, meaning: 여권, level: 1, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_002, display: aeropuerto, meaning: 공항, level: 1, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_003, display: maleta, meaning: 여행가방, level: 1, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_004, display: vuelo, meaning: 항공편, level: 1, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_005, display: embarque, meaning: 탑승, level: 2, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_006, display: terminal, meaning: 터미널, level: 2, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_007, display: reservar, meaning: 예약하다, level: 1, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_008, display: llegada, meaning: 도착, level: 2, category: travel, source: [[basic-vocabulary]] }
```

### Hotel

```yaml
- { id: es_t_010, display: hotel, meaning: 호텔, level: 1, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_011, display: habitación, meaning: 방, level: 1, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_012, display: recepción, meaning: 프론트, level: 2, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_013, display: ascensor, meaning: 엘리베이터, level: 2, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_014, display: llave, meaning: 열쇠, level: 2, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_015, display: suite, meaning: 스위트룸, level: 2, category: travel, source: [[basic-vocabulary]] }
```

### Restaurante

```yaml
- { id: es_t_020, display: menú, meaning: 메뉴, level: 1, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_021, display: camarero, meaning: 웨이터, level: 2, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_022, display: cuenta, meaning: 계산서, level: 2, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_023, display: propina, meaning: 팁, level: 2, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_024, display: pedir, meaning: 주문하다, level: 1, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_025, display: postre, meaning: 디저트, level: 2, category: travel, source: [[basic-vocabulary]] }
```

### Transporte

```yaml
- { id: es_t_030, display: metro, meaning: 지하철, level: 1, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_031, display: autobús, meaning: 버스, level: 1, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_032, display: taxi, meaning: 택시, level: 1, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_033, display: tren, meaning: 기차, level: 1, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_034, display: estación, meaning: 역, level: 1, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_035, display: parada, meaning: 정류장, level: 2, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_036, display: andén, meaning: 승강장, level: 2, category: travel, source: [[basic-vocabulary]] }
```

### Turismo

```yaml
- { id: es_t_040, display: museo, meaning: 박물관, level: 1, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_041, display: playa, meaning: 해변, level: 1, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_042, display: montaña, meaning: 산, level: 1, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_043, display: catedral, meaning: 대성당, level: 2, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_044, display: monumento, meaning: 기념물, level: 2, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_045, display: mapa, meaning: 지도, level: 1, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_046, display: guía, meaning: 가이드, level: 2, category: travel, source: [[basic-vocabulary]] }
- { id: es_t_047, display: visitar, meaning: 방문하다, level: 1, category: travel, source: [[basic-vocabulary]] }
```

### Frases de viaje (Travel Phrases) — Level 2

```yaml
- id: es_t_s_001
  display: ¿Dónde está el hotel?
  meaning: 호텔은 어디에 있나요?
  level: 2
  category: travel
  source: [[basic-vocabulary]]

- id: es_t_s_002
  display: ¿Cuánto cuesta?
  meaning: 얼마예요?
  level: 2
  category: travel
  source: [[basic-vocabulary]]

- id: es_t_s_003
  display: Quisiera reservar una habitación.
  meaning: 객실을 예약하고 싶습니다.
  level: 2
  category: travel
  source: [[basic-vocabulary]]

- id: es_t_s_004
  display: ¿Puede ayudarme?
  meaning: 도와주실 수 있나요?
  level: 2
  category: travel
  source: [[basic-vocabulary]]

- id: es_t_s_005
  display: La cuenta, por favor.
  meaning: 계산서 부탁합니다.
  level: 2
  category: travel
  source: [[basic-vocabulary]]

- id: es_t_s_006
  display: ¿Cómo llego al museo?
  meaning: 박물관에 어떻게 가나요?
  level: 2
  category: travel
  source: [[basic-vocabulary]]
```

## 액센트 단어 일람 (참고)

자주 사용되는 액센트 단어:

| 단어 | 폴백 |
| --- | --- |
| año (년) | anio |
| niño (아이) | nino |
| señor (신사) | senor |
| España (스페인) | espana |
| mañana (내일/아침) | maniana |
| después (그 후) | despues |
| además (게다가) | ademas |
| México (멕시코) | mexico |
| árbol (나무) | arbol |
| inglés (영어) | ingles |
| francés (프랑스어) | frances |
| alemán (독일어) | aleman |
| japonés (일본어) | japones |
| Cómo (어떻게) | Como |
| Cuánto (얼마) | Cuanto |

## 카테고리

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
- person (사람)
- adjective (형용사)
- question (질문)
- restaurant (식당)
- travel (여행)

## 확장 계획 (Phase 6)

- [ ] A1 단어 100개 (현재 ~35)
- [ ] A2~C2 단어 각 150개
- [ ] 액센트 단어 카탈로그 100개
- [ ] 일상 회화 문장 50개
- [ ] 뉴스 문장 30개
- [ ] ¿/¡ 처리 정책 확정

## 다음 단계

- JSON 변환: `prototype/src/data/es_words.json`
- 액센트 검증 (display 정규화)
- Loose 모드 정규화 함수 검증