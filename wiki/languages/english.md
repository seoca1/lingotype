# English (EN) - 입력 방식과 코퍼스

## 입력 방식

**전략**: 표준 QWERTY 키보드, 입력된 키의 문자를 그대로 버퍼에 추가.

### 처리 규칙

| 항목 | 정책 |
| --- | --- |
| 대소문자 | 기본 case-insensitive (스테이지 설정 시 strict 가능) |
| 공백 | 단어 사이 공백 정확히 입력 |
| 문장 부호 | 마침표, 쉼표, 물음표, 느낌표 모두 정확히 입력 |
| Backspace | 마지막 문자 제거 |
| IME | 무시 (영어는 IME 불필요) |

### 입력 예시

```
Target: "Hello, world!"
Buffer: "H" → "He" → "Hel" → "Hell" → "Hello" → "Hello," → ...
                                                   → "Hello, world!" (completed)
```

### 엣지 케이스

- Apostrophe (`don't`, `it's`): 정확히 입력
- Hyphen (`well-known`): 정확히 입력
- 숫자 (`2024`): 키보드 숫자키
- 특수문자 (`$`, `%`, `@`): 정확히 입력 (스테이지에 포함된 경우)

## 코퍼스

### 출처

- **일반 단어**: 영어 빈도순 단어 목록 (예: OEC, SUBTLEX)
- **일상 어휘**: Oxford 3000, CEFR A1~C2 단어 목록
- **문장**: 위키피디아, 뉴스, 영화 자막 (학습용 라이선스 확인)

### 코퍼스 위치

- `raw/en_words.md` (사람이 읽는 형태)
- `prototype/src/data/en_words.json` (빌드 시 로드)

### 카테고리 (예시)

| 카테고리 | 예시 단어 |
| --- | --- |
| greeting | hello, hi, goodbye, thanks |
| number | one, two, three, ten, hundred |
| color | red, blue, green, yellow |
| time | today, yesterday, tomorrow, morning |
| family | mother, father, sister, brother |
| food | bread, water, meat, fruit |
| common_verb | be, have, do, go, see, know |
| ... | ... |

### 난이도 (CEFR / 빈도)

| 레벨 | 정의 | 예시 |
| --- | --- | --- |
| 1 | A1, 가장 흔한 500단어 | the, is, you, that |
| 2 | A2, 일상 어휘 | morning, hungry, together |
| 3 | B1, 일반 어휘 | although, depend, experience |
| 4 | B2, 고급 어휘 | furthermore, comprehensive |
| 5 | C1~C2, 학술/문학 | notwithstanding, quintessential |

## 게임 통합

### 스테이지

자세한 내용: `design/systems/stage.md` > "영어 (EN)" 섹션

- en_easy_1 (난이도 1): 가장 흔한 단어 10개
- en_easy_2 (난이도 1): 일상 어휘 15개
- en_med_1 (난이도 2): 짧은 문장 12개
- en_med_2 (난이도 3): 뉴스 헤드라인 15개
- en_hard_1 (난이도 4): 긴 인용구 10개
- en_hard_2 (난이도 5): 문학 발췌 8개

### 핸들러 구현

자세한 내용: `design/systems/input-handler.md` > "EnglishHandler" 섹션

- 가장 단순한 핸들러
- prefix 매칭 + 정확 일치
- 단위 테스트: `testcases/input-handler.md` > English Tests

## 미해결 질문

- [ ] 대소문자 strict 모드 (이름/약자 등)
- [ ] 코퍼스 라이선스 (CC-BY-SA 가능 출처?)
- [ ] 음성/발음 표시 (선택)

## 다음 단계

- `raw/en_words.md` 코퍼스 작성
- 핸들러 구현
- 단위 테스트

## Sources

- [[0001-tech-stack]] — ADR-0001 (TypeScript + React + Canvas + Vite, Accepted)
- [[0008-build-target]] — ADR-0008 (SPA / GitHub Pages, Accepted)
- [[AGENTS]] §4.1 — 영어 입력 방식 (표준 QWERTY, 대소문자, 문장 부호)
- Language 위키 업스트림: `Language/wiki/English/index.md`
- 코퍼스: `Game/typing_language/raw/en_words.md` (theme-anchor citation)