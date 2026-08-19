# Korean (KR) - 입력 방식과 코퍼스

> **상태**: 구현 완료. ADR-0010 (한국어 입력 방식) Accepted — **하이브리드 모드** (자모 입력 + 로마자 입력).
> **업스트림 소스**: `Language/wiki/Korean/` (코퍼스는 Language 위키에서 인용)
> **코퍼스 형식 참조**: [[korean-corpus-format-reference]] (2026-08-17 ADR-0012 Accepted; theme-stem §1.5 컨벤션)

## 입력 방식 (ADR-0010 Accepted)

**전략**: 화면에는 한글(완성형)로 표시. 사용자는 두 가지 입력 방식 중 선택:
1. **자모 모드 (jamo, 기본)**: 한글 2벌식 키보드로 자모 직접 입력
2. **로마자 모드 (romanized)**: QWERTY 키보드로 로마자 입력 (외국인용)

자세한 옵션 비교 및 결정: `decisions/0010-kr-input.md`

### 두 입력 방식 비교

| 모드 | 필수 키보드 | 입력 예시 | 대상 사용자 |
| --- | --- | --- | --- |
| **jamo (기본)** | 한글 2벌식 | ㅏㄴㄴㅕㅇㅎㅏㅅㅔㅇㅛ | 한국인, 한글 키보드 보유자 |
| **romanized** | QWERTY | annyeonghaseyo | 외국인, 한글 키보드 미보유자 |

### 표시 → 입력 예시 (자모 모드)

| 표시 (Display) | 입력 (Input, Jamo) | 의미 |
| --- | --- | --- |
| 안녕하세요 | ㅏㄴㄴㅕㅇㅎㅏㅅㅔㅇㅛ | hello (polite) |
| 감사합니다 | ㄱㅏㅡㅁㅅㅏㅎㅂㄴㅣㄷㅏ | thank you |
| 한국 | ㅎㅏㄴㄱㅜㄱ | Korea |
| 사랑 | ㅅㅏㄹㅏㅇ | love |
| 아름답다 | ㅇㅏㄹㅡㅁㄷㅏㅂㄷㅏ | to be beautiful |

### 표시 → 입력 예시 (로마자 모드)

| 표시 (Display) | 입력 (Input, Romanized) | 의미 |
| --- | --- | --- |
| 안녕하세요 | annyeonghaseyo | hello (polite) |
| 감사합니다 | gamsahamnida | thank you |
| 한국 | hangug | Korea |
| 사랑 | sarang | love |
| 아름답다 | aleumdapda | to be beautiful |

### 가상 키보드 레이아웃

게임 화면의 가상 키보드 표시:

| 입력 모드 | 표시되는 키보드 | 설명 |
| --- | --- | --- |
| **jamo** | 두벌식 (ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ) | 실제 한글 물리 키보드와 동일 |
| **romanized** | QWERTY (QWERTY...) | 영어 키보드 배열 |

### 자모 매핑 규칙 (자모 모드, 한글 2벌식, 브라우저 event.key 기준)

#### 기본 자음 (14음) / 모음 (10음)

| 물리 키 | Q | W | E | R | T | A | S | D | F | G | Z | X | C | V |
| --- |---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| event.key | ㅂ | ㅈ | ㄷ | ㄱ | ㅅ | ㅁ | ㄴ | ㅇ | ㄹ | ㅎ | ㅋ | ㅌ | ㅊ | ㅍ |

| 물리 키 | H | J | K | L | Y | U | I | O | P |
| --- |---|---|---|---|---|---|---|---|---|
| event.key | ㅗ | ㅓ | ㅏ | ㅣ | ㅛ | ㅜ | ㅣ | ㅗ | ㅛ |

> **중요**: macOS에서 Caps Lock이 ON이면 영문 출력 → 한글 입력이 안 됨 (자모 모드).

#### 격음 (된소리) — 앞에 쌍 받침

| ㄲ | ㄸ | ㅃ | ㅆ | ㅉ |
|---|---|---|---|---|
| kk | tt | pp | ss | jj |

#### 기본 모음

| ㅏ | ㅑ | ㅓ | ㅕ | ㅗ | ㅛ | ㅜ | ㅠ | ㅡ | ㅣ |
|---|---|---|---|---|---|---|---|---|---|
| a | ya | eo | yeo | o | yo | u | yu | eu | i |

#### 이중 모음

| ㅐ | ㅒ | ㅔ | ㅖ | ㅘ | ㅙ | ㅚ | ㅝ | ㅞ | ㅟ | ㅢ |
|---|---|---|---|---|---|---|---|---|---|---|
| ae | yae | e | ye | wa | wae | oe | wo | we | wi | ui |

### 받침 (종성) 규칙

받침은 일반적으로 **표기된 자음 그대로** 입력한다. 단, 발음 변동이 있는 경우는 별도 매핑.

| 받침 | 입력 | 비고 |
| --- | --- | --- |
| ㄱ, ㄴ, ㄹ, ㅁ, ㅇ, ㅂ | 받침 그대로 (g/n/r/m/ng/b) | 기본 |
| ㅋ, ㅍ | k, p | |
| ㄷ (다음이 모음) | t (예: 같이 → gachi, 닫다 → datda) | 대표음 |
| ㅅ, ㅈ, ㅊ, ㅌ, ㅎ (다음이 모음) | 탈락 또는 발음 변동 | 단어별 매핑 필요 |
| ㄲ, ㅆ | kk, ss | 대표음 |

> **주의**: 발음 변동(연음·비음화·구개음화·경음화 등)은 단어 단위로 매핑 테이블에 명시. ADR-0009 결정 후 정식 매핑 문서화.

### 자주 쓰는 발음 변동 예시 (단어 매핑)

| 표시 | 입력 | 변동 |
| --- | --- | --- |
| 같이 | gachi | ㄷ + ㅣ → ㅊ |
| 닫다 | datda | ㄷ + ㄷ → ㅅ |
| 있어요 | isseoyo | ㅂ + ㅅ → ㅆ |
| 않습니다 | animnida | ㅂ + ㄴ → ㅁ |
| 십이 | sibi | ㅂ + ㅇ → ㅁ + ㅇ |

### 조사·어미

조사·어미는 **붙여서** 입력하는 것을 기본으로 한다 (한 단어/문장 단위).

| 표시 | 입력 |
| --- | --- |
| 한국에 | hanguge |
| 한국에서 | hangugeseo |
| 한국은 | hangugun |
| 안녕하세요 | annyeonghaseyo |

## 코퍼스

### 업스트림 소스

- **Language 위키**: `Language/wiki/Korean/` (단일 진실 공급원)
- **현재 상태**: `Language/wiki/Korean/` 에 7 theme 파일 보유 (여행, 동물 어휘, 자연・날씨 어휘, 의류・패션 어휘, business-vocabulary, food-vocabulary, emotions-personality-vocabulary). 인제스트 진행 중.

### 출처 후보 (Language `raw/Korean/` 에 추가 예정)

- **TOPIK 단어 목록**: TOPIK 1~6 (한국어 능력 시험)
- **빈도순 단어**: 국립국어원 한국어 학습용 어휘 목록, 세종 말뭉치
- **회화 표현**: Yonsei Korean, Korean for Beginners, Sogang Korean
- **문장**: 위키피디아 (CC-BY-SA), 한국어 학습 교재
- **문화**: 한국 문화 콘텐츠 (K-드라마, K-팝 가사 등 학습 라이선스 확인)

### 코퍼스 형식

```yaml
# Game/lingotype/raw/kr_words.md
- id: kr_001
  display: 안녕하세요       # 화면 표시
  input: annyeonghaseyo    # 사용자가 타이핑
  meaning: hello (polite)  # 영어 정의 (또는 한국어 뜻)
  level: 1                 # TOPIK 1=1, 2=2, ..., 6=6 (낮을수록 어려움)
  category: greeting
  source: "[[travel]]"   # Language/wiki/Korean/vocabulary/{theme}.md 인용 (theme-file 컨벤션, 2026-07-10)
```

> **인용 규칙**: 모든 항목은 `source: [[...]]` 필드로 Language 위키 페이지를 가리켜야 한다. 자세한 내용: `wiki/corpus-pipeline.md`

### 카테고리 (예시)

| 카테고리 | 예시 단어 (인제스트 후 채워짐) |
| --- | --- |
| greeting | 안녕하세요, 감사합니다, 안녕히 가세요 |
| number | 하나, 둘, 셋, 열, 백 |
| color | 빨강, 파랑, 노랑, 초록 |
| time | 오늘, 어제, 내일, 아침 |
| family | 아버지, 어머니, 형, 누나 |
| food | 밥, 물, 김치, 불고기 |
| place | 서울, 한국, 집, 학교 |
| common_verb | 가다, 오다, 먹다, 마시다, 읽다 |

### 난이도 (TOPIK)

| 레벨 | 정의 | 특징 |
| --- | --- | --- |
| 1 | TOPIK 1 (1~2급 통합) | 기초 어휘, 인사·자기소개 |
| 2 | TOPIK 2 | 일상 어휘, 짧은 문장 |
| 3 | TOPIK 3 | 중급 어휘, 의견 표현 |
| 4 | TOPIK 4 | 중고급, 시사·문학 |
| 5 | TOPIK 5 | 고급, 학술·전문 |
| 6 | TOPIK 6 | 최고급, 원어민 수준 |

> Language 위키에서 난이도 라벨을 다르게 정의하면 (예: CEFR 유사 6단계) 이 표를 그에 맞춰 갱신한다.

## 게임 통합

### 핸들러

- **클래스명**: `KoreanHandler` (`src/input/KoreanHandler.ts`)
- **로직**: 자모 composition (jamo 모드) + 로마자 prefix 매칭 (romanized 모드)
- **받침 처리**: 단어별 매핑 테이블 + 발음 변동 룰
- **하이브리드**: `getKoreanInputMode()`로 현재 모드 확인
- **조사·어미**: 단어와 함께 입력 (한 유닛 단위)

자세한 내용: `design/systems/input-handler.md` > KoreanHandler 섹션 (구현 시 추가)

### 스테이지 (예시, 구현은 인제스트 이후)

- kr_easy_1 (1): TOPIK 1 인사·자기소개 10개
- kr_easy_2 (1): TOPIK 1 숫자·색상 15개
- kr_med_1 (2): TOPIK 2 일상 어휘 20개
- kr_med_2 (2): TOPIK 2 짧은 문장 12개
- kr_hard_1 (3): TOPIK 3 어휘 + 표현 15개
- kr_hard_2 (4): TOPIK 4 뉴스·문학 문장 10개

## 미해결 질문

- [x] **ADR-0010** 입력 방식 (하이브리드 자모 + 로마자) — 2026-06-25 채택
- [ ] 발음 변동(연음·비음화·구개음화·경음화) 매핑 깊이 (전부 / 자주 쓰는 것만)
- [ ] 받침 표기 통일 (표준어 vs. 실제 발음)
- [ ] 로마자 표기법 (국립국어원 / Revised Romanization vs. Yale / McCune-Reischauer)
- [ ] 한국어 인용 규칙 (영어 정의 vs. 한국어 뜻 vs. 둘 다)
- [ ] 코퍼스 라이선스 (교재 인용 가능 범위)
- [ ] 한자어 병기 (예: 韓國 → 한국 → 한국)
- [ ] macOS Caps Lock 경고 UI (jamo 모드용)

## 다음 단계

1. ✅ `decisions/0010-kr-input.md` 하이브리드 모드 채택 (2026-06-25)
2. ✅ KoreanHandler 자모 composition 엔진 작성
3. ✅ 로마자 corpus 채우기 (`romaji` 필드) — 2026-06-26 완료
4. ✅ 입력 모드 선택 UI (SettingsScreen)
5. ⏳ Language 위키 한국어 페이지 입력 방식 갱신 (현재 문서)
6. ⏳ 단위 테스트 (받침/복합 모음 경계 케이스)
7. ⏳ macOS Caps Lock 경고 UI

## 관련 문서

- 업스트림: `Language/wiki/pipeline-to-game.md`
- 파이프라인: `wiki/corpus-pipeline.md`
- 결정: `decisions/0010-kr-input.md`
- **로마자 / 자모 매핑 reference**: [`wiki/languages/korean-romaji-mapping.md`](korean-romaji-mapping.md) — canonical mapping tables (초성/중성/종성 19/21/28 + 발음 변동 + Revised Romanization 표준 + QWERTY 키 매핑). ADR-0010 보완.
- 일본어 참고 (유사 패턴): `wiki/languages/japanese.md`
- 스페인어 참고 (액센트 직접 입력 패턴): `wiki/languages/spanish.md`

## Sources

- [[0010-kr-input]] — ADR-0010 (한글 키보드 자모 직접 입력 + 클라이언트 합성, Accepted)
- [[0009-kr-input]] — ADR-0009 (로마자→한글 매핑, Superseded by 0010)
- [[AGENTS]] §4 — 언어 정확성 규칙
- Language 위키 업스트림: `Language/wiki/Korean/index.md`
- 코퍼스: `Game/lingotype/raw/kr_words.md` (theme-anchor citation, 5 real travel entries currently)