# 0006 - 데이터 형식 (JSON / YAML / TS const)

## 상태

**Accepted**

## 결정일

2026-06-18 (구현 중 확정 — TypeScript const 채택, 원안 JSON에서 변경)

## 컨텍스트

단어/문장/스테이지/미션 데이터를 어떤 형식으로 저장할지 결정.

**요건**:
- 코퍼스: 단어 1000+, 문장 100+ (각 언어)
- 메타: 스테이지 정의, 미션 정의
- 사람이 읽고 편집 가능
- TypeScript와 잘 통합

## 옵션 비교

| 옵션 | 장점 | 단점 | 비고 |
| --- | --- | --- | --- |
| **JSON** | 표준, JS와 자연 통합, 도구 풍부 | 주석 불가, trailing comma 불가 | **추천** |
| JSON5 / JSONC | 주석 가능, trailing comma | 표준 아님, 도구 제한 | |
| YAML | 주석 가능, 사람이 읽기 쉬움 | 파서 의존성, 들여쓰기 민감 | |
| TypeScript const | 타입 안정성, IDE 자동완성 | 빌드 단계 필요, 비개발자 편집 어려움 | |
| TOML | 명시적, 단순 | 표현력 제한 | |
| Markdown table | 사람이 가장 읽기 쉬움 | 파싱 복잡 | |

## 결정

**TypeScript const** (`export const` arrays/objects in `.ts` files)

- 코퍼스: `prototype/src/data/corpus.ts` (TS const arrays)
- 스테이지: `prototype/src/data/stages.ts` (TS const)
- 메타데이터: `badges.ts`, `translations.ts` 등 (TS const)
- 예외: `dailyLessons.json` (빌드 산출물, generator가 생성)

> **원안 변경 사유**: 원안은 **JSON + JSON Schema** 였으나, 구현 단계에서
> **TypeScript const** 로 변경. JSON보다 다음 이점이 결정적이었음:
> - **타입 안정성**: `WordEntry[]` 타입이 컴파일 타임에 강제됨
> - **IDE 자동완성**: 변수명, 필드명 자동완성 (VSCode)
> - **런타임 검증**: `as const` + 타입 가드
> - **빌드 단계 없음**: `import { EN_WORDS } from './corpus'` 직접
> - **빌드 도구가 타입 오류를 잡아줌** (tsc strict)

## 이유

1. **타입 안정성**: 코퍼스 항목이 `WordEntry` 인터페이스와 일치하지 않으면 컴파일 실패
2. **IDE 자동완성**: 필드명 오타 방지, 리팩토링 안전
3. **런타임 import**: 별도 fetch/파싱 단계 없이 직접 import
4. **빌드 도구**: tsc가 데이터 일관성을 검증
5. **Git diff 가독성**: JSON보다 변경점이 명확

## 결과 / 영향

### 긍정적

- 4개 언어의 562개 항목(431 단어 + 131 문장) 모두 타입 안전하게 로드
- IDE 점프/리네임이 코퍼스·스테이지 코드 전반에 동작
- 비주얼 회귀 시 데이터 문제로 인한 실패를 tsc가 차단

### 부정적 / 트레이드오프

- 비개발자가 코퍼스를 편집하기 어려움 (TS 문법 학습 필요)
- 코퍼스 편집 도구 없음 (현재 VSCode + 수동 편집)
- 큰 const 배열은 초기 번들 사이즈에 포함됨 (현재 1049 KB / gzip 285 KB)

### 제약

- 코퍼스 편집자는 TypeScript 기본 문법을 알아야 함
- 빌드 시 tsc 검증 통과 필수 (strict 모드)
- 일일 레슨 데이터는 generator → JSON 패턴 유지 (`dailyLessons.json`만 JSON)

## 열린 질문

- [ ] 비개발자용 코퍼스 편집 도구 (CSV → TS const 변환기?)
- [ ] JSON Schema 검증 단계 추가 (Phase 7+)
- [ ] 외부 API/사전 연동 (Phase 7+)

## 다음 단계 (구현 완료)

- ✅ `prototype/src/data/` 구조화 완료 (`corpus.ts`, `stages.ts`, `badges.ts` 등)
- ✅ TS const 패턴 채택, 빌드 단계 없이 타입 안전 import
- 🔲 비개발자용 CSV → TS const 변환기 (열린 질문 §참조)