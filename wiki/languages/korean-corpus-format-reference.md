# KR Corpus Format Reference (위키 이관본)

> **상태**: ADR-0012 Accepted (2026-08-17). raw/kr_words.md 1-80행의 stale 문서(per-word-page YAML 예시 포함)을 wiki 측으로 이관.
> **원본 위치**: ~~`raw/kr_words.md` line 1-80~~ (raw/는 read-only로 직접 정리 불가. §2)
> **이관 시점**: 2026-08-17

---

## 1. 파이프라인

모든 코퍼스 항목은 Language 위키의 **theme-file** 단위 vocabulary/expressions 페이지를 인용해야 합니다 (§1.5 컨벤션, 2026-07-10 적용). per-word 페이지는 **존재하지 않음** (금지).

```
Language/raw/Korean/         (소스 자료, immutable)
  └─ ingest
Language/wiki/Korean/vocabulary/
  └─ curate (source: [테마 stem], theme-file anchor)
Game/lingotype/raw/kr_words.md  ← raw/ read-only; active 데이터만 유지
  └─ build
Game/lingotype/prototype/src/data/kr_words.json
  └─ consume
```

> **§1.5 핵심 규칙**: `source` 필드는 **반드시** `[테마 stem]` 형식 (예: `source: [basic-vocabulary]`). per-word wikilink (예: `[[annyeonghaseyo]]`) 사용 금지. 위키 검증은 theme-file 단위로만.

자세한 내용: `wiki/corpus-pipeline.md`, `wiki/languages/korean.md`

---

## 2. 코퍼스 형식 (theme-stem)

```yaml
- id: kr_001
  display: 안녕하세요          # 화면 표시 (한글 완성형)
  input: annyeonghaseyo       # 사용자가 타이핑 (로마자)
  meaning: hello (polite)     # 영어 정의 또는 한국어 뜻
  level: 1                    # TOPIK 1~6 (1=기초, 6=최고)
  category: greeting
  source: "[basic-vocabulary]"   # ← [theme-stem] format (NOT [[per-word-page]])
  note: ""                    # 선택. irregular, 발음 변동 등 게임 메카닉 비고
```

> **`source` 필드는 필수** (§1.5). 누락 시 lint 결함. wikilink target = theme-file stem.

---

## 3. Level 1 (TOPIK 1, 기초) — Theme-stem 구조 골격

### 인사 (Greeting) → `[basic-vocabulary]` theme

```yaml
# Language 위키 시드 후 채워질 골격. 현재 Language/wiki/Korean/vocabulary/ 
# 시드 상태 확인 필요 (2026-08-17 Language expansion closure 이후).

# 예시 (theme-stem 형식 준수):
# - { id: kr_001, display: 안녕하세요, input: annyeonghaseyo, meaning: hello (polite), 
#     level: 1, category: greeting, source: "[basic-vocabulary]" }
# - { id: kr_002, display: 안녕히 가세요, input: annyeonghi gaseyo, meaning: goodbye (to person leaving),
#     level: 1, category: greeting, source: "[basic-vocabulary]" }
# - { id: kr_003, display: 감사합니다, input: gamsahamnida, meaning: thank you,
#     level: 1, category: greeting, source: "[basic-vocabulary]" }
# - { id: kr_004, display: 죄송합니다, input: joesonghamnida, meaning: I'm sorry,
#     level: 1, category: greeting, source: "[basic-vocabulary]" }
```

### 숫자 (Number) → `[topik1-starter]` theme

```yaml
# - { id: kr_010, display: 하나, input: hana, meaning: one, level: 1, category: number, source: "[topik1-starter]" }
# - { id: kr_011, display: 둘, input: dul, meaning: two, level: 1, category: number, source: "[topik1-starter]" }
# - { id: kr_012, display: 셋, input: set, meaning: three, level: 1, category: number, source: "[topik1-starter]" }
# - { id: kr_013, display: 열, input: yeol, meaning: ten, level: 1, category: number, source: "[topik1-starter]" }
# - { id: kr_014, display: 백, input: baek, meaning: hundred, level: 1, category: number, source: "[topik1-starter]" }
```

### 색상 (Color) → `[basic-vocabulary]` theme

```yaml
# (예정)
```

### 가족 (Family) → `[body-family]` theme

```yaml
# (예정)
```

### 음식 (Food) → `[food-vocabulary]` theme

```yaml
# (예정)
```

---

## 4. ADR-0012 Migration Notes

### 이전된 stale 항목 (raw/kr_words.md 1-80행)

| Stale per-word (raw/) | 정규화 (wiki/) | 테마 stem |
|---|---|---|
| `[[annyeonghaseyo]]` | `[[basic-vocabulary]]` (greeting 항목 묶음) | 인사 |
| `[[annyeonghi-gaseyo]]` | `[[basic-vocabulary]]` | 인사 |
| `[[gamsahamnida]]` | `[[basic-vocabulary]]` | 인사 |
| `[[joesonghamnida]]` | `[[basic-vocabulary]]` | 인사 |
| `[[hana]]` | `[[topik1-starter]]` | 숫자 |
| `[[dul]]` | `[[topik1-starter]]` | 숫자 |
| `[[set]]` | `[[topik1-starter]]` | 숫자 |
| `[[yeol]]` | `[[topik1-starter]]` | 숫자 |
| `[[baek]]` | `[[topik1-starter]]` | 숫자 |

### 다음 raw/ sync 시 작업

`raw/kr_words.md` 1-80행은 직접 수정 불가 (§2). 다음 raw/ sync 시 별도 사용자 결정 후:
- 헤더를 짧은 README 참조로 단축 (예: `> 자세한 형식: wiki/languages/korean-corpus-format-reference.md`)
- 또는 §1.5 컨벤션 위반 명시 표시 추가

별도 ADR (Future ADR-0013+) 가 필요합니다.

---

## 5. 의존성

- `decisions/0010-kr-input.md` (Accepted, Korean input mode) — 입력 방식. 본 문서와 무관.
- `decisions/0011-extensible-languages.md` (Accepted, language registry) — 본 문서와 무관.
- `AGENTS.md` §1.5 (theme-stem 규약) — 본 문서 직결.
- `AGENTS.md` §2 (raw/ read-only) — 본 문서 작성의 직접 trigger.

---

*이관 완료: 2026-08-17 / 작성: Sisyphus (ADR-0012 implementation) / 이전 출처: raw/kr_words.md 1-80행 (immutable, read-only)*
