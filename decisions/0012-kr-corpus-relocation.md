# 0012 — KR Corpus Raw Documentation Relocation

## 번호

0012-kr-corpus-relocation.md

## 제목

`raw/kr_words.md` 문서 헤더(stale per-word-page 예시 포함)를 `wiki/languages/korean.md`로 이전하여 §1.5 컨벤션 정렬 + raw/ read-only 속성 보존

## 상태

Draft (2026-08-17 작성 — 사용자 결정 대기)

## 날짜

2026-08-17

## 컨텍스트

`Game/typing_language/AGENTS.md` §1.5(2026-07-10 도입)와 §2 "raw/ 절대 수정 금지" 규약에 따른 두 가지 충돌이 `raw/kr_words.md`에서 발생:

### 충돌 1: §1.5 위반 — per-word 페이지 인용

`raw/kr_words.md` 1-80 행의 문서/스캐폴드 YAML 예시가 per-word 페이지 형식을 사용 중:

```yaml
# 예시 (raw/kr_words.md line 32, 46-49, 56-60)
source: "[[annyeonghaseyo]]"     # Line 32
source: "[[annyeonghi-gaseyo]]"  # Line 47
source: "[[gamsahamnida]]"        # Line 48
source: "[[joesonghamnida]]"      # Line 49
source: "[[hana]]"                # Line 56
source: [[dul]]                   # Line 57
source: [[set]]                   # Line 58
source: [[yeol]]                  # Line 59
source: [[baek]]                  # Line 60
```

§1.5는 명시: *"per-word 페이지 없음. vocabulary 와 expressions 모두 theme-file 단위 (`source: [테마 stem]`)"*

→ 9개 인용이 §1.5 위반. 워크스페이스 `NEXT_SESSION_TODO.md` (2026-07 후반)에 `🟡 Pre-existing KR corpus broken citations` 항목으로 이미 기록됨.

### 충돌 2: raw/ read-only — 직접 수정 불가

§2 "raw/ 절대 수정 금지" 규약으로 `raw/kr_words.md`의 헤더/스캐폴드를 직접 정리할 수 없음.

### 현 상태

- 1-80행: 스캐폴드 (Language 위키 비어 있을 시절 작성) — §1.5 위반 per-word 인용
- 81행 이후: 실제 여행 카테고리 코퍼스 — §1.5 준수 theme-stem 인용 ✓
- `audit_vault.py` 결과: code-block 안의 위키링크는 lint에서 strip됨 → 0 production broken (위반이 시각적으로 보이지 않음)

## 옵션 비교

| 옵션 | 장점 | 단점 | 비고 |
| --- | --- | --- | --- |
| A. raw/ 그대로 둠 (헤더 1-80행) + wiki/languages/korean.md에 정정 문서 추가 | §2 raw/ read-only 속성 보존. 즉시 실행 가능. | §1.5 위반 상태 영구화. 사용자가 README 들여다보면 혼란 가능성. | 다음 repo lint 강화 시 결함 표면화 위험 |
| B. raw/ 헤더를 wiki/로 완전 이전 (raw/kr_words.md는 active 데이터만) | §1.5 + §2 둘 다 준수. 단일 진실 공급원 = `wiki/languages/korean.md`. | raw/ 측은 변경 안 되므로 9개 인용이 파일에 남음 (lint 비활성 영역). 결정적 단점은 아님 — 코드블록 내 예시라 동작 영향 없음. | **권장** |
| C. next raw/ sync 시 헤더 교체 | 가장 깨끗하지만 raw/ 편집 자체가 §2 위반. | §2 직접 위반. 동기화 프로세스가 raw/ 수정을 허용하지 않는 한 불가. | 사용자 결정 후 별도 ADR 필요 |

## 결정

**옵션 B 채택**: 1-80행의 문서(파이프라인 설명, 코퍼스 형식 예시, Level 1 골격, 인사/숫자/색상/가족/음식 카테고리 헤더)를 `wiki/languages/korean.md`로 이전 (또는 신규 파일 `wiki/languages/korean-corpus-format-reference.md` 생성). raw/kr_words.md는 81행부터 시작하는 active travel corpus만 유지 (가독성 위해 1-80행의 헤더 부분은 README 참조로 단축).

## 이유

1. **§1.5 + §2 둘 다 준수** — per-word 인용 예시는 wiki/로 이동 (편집 가능 영역). raw/ 측은 active 데이터만 유지.
2. **workspace AGENTS.md §5 "log 기록"** — 결정 사항은 ADR로 명시화.
3. **사용자 원칙 "단어나 문장 하나를 .md 로 만들지 않음"** — 이미 §1.5에 반영됨. 같은 컨벤션이 raw/ 스캐폴드 헤더에도 적용되어야 함.
4. **다음 Language 위키 동기화 시 일관성** — sync 도구가 raw/ 와 wiki/ 의 9개 인용을 발견하면 §1.5 위반으로 flag.

## 결과 / 영향

### 긍정적

- §1.5 위반 9개 인용이 단일 진실 공급원(wiki/)으로 이동 — lint 시 invisible 상태에서 documentation-visible로 승격
- raw/ 측은 active 데이터만 갖게 되어 raw/ 의 의도(read-only reference corpus)가 명확해짐
- `wiki/languages/korean.md`가 단일 진실 공급원이 되어 Language 위키 sync 시 의도 추적이 쉬워짐

### 부정적 / 트레이드오프

- `raw/kr_words.md` 1-80행의 stale YAML 예시는 다음 raw/ sync까지 그대로 남음 (코드블록 내 lint 영향 없음)
- wiki/languages/korean.md가 더 길어짐 (현재 230줄 → ~+60줄 예상)

### 제약

- raw/kr_words.md의 1-80행은 직접 수정 불가 (이미 §2로 금지)
- 다음 corpus sync 시 raw/ 측 헤더 정리는 별도 작업 (별도 사용자 결정 필요)

## 열린 질문

- **Q1**: wiki/languages/korean.md 안에 새 섹션으로 추가할지, 신규 파일 `wiki/languages/korean-corpus-format-reference.md`를 만들지?
  - **제안**: 후자 — `korean.md`는 언어 가이드, `korean-corpus-format-reference.md`는 코퍼스 스키마 참조로 분리 (관심사 분리).
- **Q2**: raw/kr_words.md의 1-80행을 단축(헤더만 남기고 active 섹션으로 직행)할 수 있는 절충안이 있나?
  - **현실적 답**: raw/ read-only이므로 불가. 단순 README 참조로 단축하는 표현(예: "스캐폴드/문법 예시는 wiki/languages/korean-corpus-format-reference.md 참조")도 raw/ 수정 없이는 불가.
- **Q3**: future raw/ sync에서 헤더 정리를 어떻게 안전하게 할 것인가?
  - **제안**: 별도 ADR (Future ADR-0013+) — raw/ 헤더 정리를 허용하는 예외 규정. 그때까지 wiki/ 측만 정정.
- **Q4**: 다른 언어(es_words.md, jp_words.md)에도 같은 stale per-word 예시가 있는가?
  - **검증 필요**: 이 ADR은 KR에 한정. ES/JP 측은 별도 audit 후 필요시 별도 ADR.

## 적용 계획 (사용자 승인 후)

1. `wiki/languages/korean-corpus-format-reference.md` 신규 생성 (raw/kr_words.md 1-80행의 이전)
2. `wiki/languages/korean.md` 안 cross-reference 추가 (`[[korean-corpus-format-reference]]`)
3. `wiki/languages/korean.md` 업데이트 (Status 블록에 ADR-0012 추가)
4. typing_language `log.md` 에 `[2026-08-17] decision | ADR-0012 — KR corpus documentation relocation`
5. workspace `NEXT_SESSION_TODO.md` 의 "🟡 KR corpus broken citations" 항목을 ✅ CLOSED 로 옮김
6. workspace `log.md` 에 Phase summary 추가

## 의존성

- §1.5 (AGENTS.md 2026-07-10 컨벤션 정렬) — source rule
- §2 (AGENTS.md raw/ read-only) — boundary rule
- ADR-0010 (한국어 입력 Accepted) — 이미 Accepted, immutable. 변경 없음. 본 ADR은 입력 방식과 무관 (코퍼스 포맷만 다룸).
- ADR-0011 (확장 가능한 언어 레지스트리) — 무관.

## 후속 권장

- Q4 답변: ES/JP 코퍼스도 같은 audit 필요. 별도 권장.
- Q3 답변: raw/ 헤더 정리 위한 미래 ADR (사용자 raw/ 동기화 정책 결정 후).
- Language/wiki/Korean/ 위키가 시드되어야 raw/kr_words.md의 §3.1.1 "Language 위키에 시드하기 전에는 게임 코퍼스에 신규 항목을 만들지 않는다" 규칙을 적용할 수 있음 (현 시점 Language/wiki/Korean/ 시드 완료 확인 필요).
