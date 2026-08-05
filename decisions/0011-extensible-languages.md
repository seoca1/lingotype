# ADR-0010: Extensible Language System

**Status**: Accepted  
**Date**: 2026-06-18  
**Deciders**: System Architect  
**Tags**: `architecture`, `language`, `extensibility`

## Context

초기 구현에서는 4개 언어(EN/JP/ES/KR)가 하드코딩되어 있었습니다:

```typescript
export type Language = 'en' | 'jp' | 'es' | 'kr';
```

이 방식의 문제점:
1. **새로운 언어 추가 시 여러 파일 수정 필요**
   - `types.ts` (타입 정의)
   - `App.tsx` (언어별 분기 로직)
   - `Menu.tsx` (UI 하드코딩)
   - `character/CharacterData.ts` (외형 데이터)
   - `data/stages.ts` (스테이지 필터링)

2. **타입 안전성 부족**
   - 런타임에 추가된 언어는 타입 체크 불가능
   - 리터럴 유니온 타입으로 인한 확장성 제한

3. **테스트 어려움**
   - 언어별 로직이 분산되어 있어 테스트 복잡

4. **유지보수성 저하**
   - 언어 관련 로직이 여러 파일에 분산
   - 새 언어 추가 시 누락 가능성 높음

## Decision

**언어 레지스트리 패턴**을 도입하여 언어를 동적으로 등록하고 관리하는 시스템으로 리팩토링했습니다.

### Core Design

#### 1. Language Registry
```typescript
interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  inputDescription: string;
  createHandler: () => InputHandler;
  supportsTier0: boolean;
  corpus: {
    words: WordEntry[];
    sentences: WordEntry[];
    chars?: Record<string, WordEntry[]>;
  };
  icon?: string;
  themeColor?: string;
}

class LanguageRegistry {
  private languages = new Map<string, LanguageConfig>();
  register(config: LanguageConfig): void { ... }
  get(code: string): LanguageConfig | undefined { ... }
  getAll(): LanguageConfig[] { ... }
}
```

#### 2. Language Files
각 언어는 독립적인 파일로 관리:
- `src/language/languages/english.ts`
- `src/language/languages/japanese.ts`
- `src/language/languages/spanish.ts`
- `src/language/languages/korean.ts`

#### 3. Automatic Registration
```typescript
// src/language/index.ts
import { ENGLISH_CONFIG } from './languages/english.js';
import { JAPANESE_CONFIG } from './languages/japanese.js';

registerLanguage(ENGLISH_CONFIG);
registerLanguage(JAPANESE_CONFIG);
// ...
```

#### 4. Dynamic Type
```typescript
// Before
export type Language = 'en' | 'jp' | 'es' | 'kr';

// After
export type Language = string;  // 동적 확장 가능
```

### Usage Example

#### Before (Hardcoded)
```typescript
// App.tsx
const handleStartStage = (stage: StageConfig) => {
  let corpus = CORPUS[stage.language];
  if (stage.language === 'jp' && stage.corpusFilter.categories) {
    const charCategory = stage.corpusFilter.categories[0];
    if (charCategory in JP_CHARS) {
      corpus = JP_CHARS[charCategory];
    }
  }
  if (stage.corpusFilter.minLevel >= 3) {
    corpus = SENTENCES[stage.language];
  }
  // ...
};
```

#### After (Extensible)
```typescript
// App.tsx
const handleStartStage = (stage: StageConfig) => {
  const langConfig = getLanguage(stage.language);
  let corpus = langConfig.corpus.words;
  
  if (langConfig.supportsTier0 && stage.corpusFilter.categories) {
    corpus = langConfig.corpus.chars?.[stage.corpusFilter.categories[0]];
  }
  if (stage.corpusFilter.minLevel >= 3) {
    corpus = langConfig.corpus.sentences;
  }
  // ...
};
```

## Consequences

### ✅ Positive

1. **Easy Language Addition**
   - 새 언어 추가 시 5개 파일만 생성/수정:
     1. `input/{Lang}Handler.ts` (InputHandler 구현)
     2. `data/corpus.ts` (단어/문장 데이터)
     3. `language/languages/{lang}.ts` (LanguageConfig)
     4. `language/index.ts` (등록)
     5. `data/stages.ts` (스테이지 추가)
   - 기존 코드 수정 불필요

2. **Type Safety**
   - 런타임 검증: `getLanguage()` 호출 시 등록되지 않은 언어는 에러
   - 컴파일 타임 검증: LanguageConfig 인터페이스 강제

3. **Maintainability**
   - 언어별 로직이 명확히 분리
   - 각 언어를 독립적으로 테스트 가능
   - 코드 중복 제거

4. **UI Automation**
   - Menu가 `getAllLanguages()`로 자동 렌더링
   - 언어 추가 시 UI 자동 업데이트

5. **Consistency**
   - 모든 언어가 동일한 인터페이스 사용
   - 표준화된 구조로 실수 방지

### ⚠️ Neutral

1. **Runtime Overhead**
   - Map lookup 비용 (무시할 수준)
   - 등록 시 초기화 비용 약간 증가

2. **Type Inference Loss**
   - `Language = string`으로 IDE 자동완성 제한
   - 하지만 런타임 검증으로 보완

### ❌ Negative

1. **Migration Cost**
   - 초기 리팩토링 비용 (1회)
   - 8개 파일 수정 필요했음

2. **Learning Curve**
   - 새로운 레지스트리 패턴 학습 필요
   - 하지만 문서화로 완화

3. **Tutorial Hardcoded**
   - `Tutorial.tsx`의 `TUTORIAL_STEPS`는 여전히 하드코딩
   - 추후 개선 가능 (낮은 우선순위)

## Implementation Details

### Files Created
- `src/language/LanguageRegistry.ts` (135 lines)
- `src/language/languages/english.ts` (19 lines)
- `src/language/languages/japanese.ts` (21 lines)
- `src/language/languages/spanish.ts` (19 lines)
- `src/language/languages/korean.ts` (19 lines)
- `src/language/languages/french.example.ts` (62 lines) - Template
- `src/language/index.ts` (25 lines)

### Files Modified
- `src/types.ts`: `Language` type to `string`
- `src/character/CharacterData.ts`: `LanguageKey` type to `string`
- `src/data/stages.ts`: `stagesByTier(language: string)`
- `src/ui/Menu.tsx`: Dynamic language rendering
- `src/App.tsx`: Use `getLanguage()` for corpus

### Build Impact
- **Before**: 251.36 KB (gzip 76.79 KB)
- **After**: 252.73 KB (gzip 77.28 KB)
- **Delta**: +1.37 KB (+0.5%) - 무시할 수준

### Test Results
- ✅ Type check: Passed
- ✅ Build: Success
- ✅ Tests: 99/100 passed + 1 skipped (동일)

## Alternatives Considered

### Option A: Keep Hardcoded Union Type
```typescript
export type Language = 'en' | 'jp' | 'es' | 'kr' | 'fr' | 'de' | 'zh' | ...;
```
**Rejected**: 언어 추가마다 타입 수정 필요, 확장성 제한

### Option B: Plugin System (Dynamic Import)
```typescript
const langModule = await import(`./languages/${code}.js`);
```
**Rejected**: 복잡도 증가, 번들 사이즈 최적화 어려움, 현재는 과도함

### Option C: Factory Pattern Only
```typescript
function createHandler(language: string): InputHandler { ... }
```
**Rejected**: 코퍼스/메타데이터 관리 부족, 레지스트리보다 확장성 낮음

## Decision Rationale

**레지스트리 패턴**을 선택한 이유:

1. **Proven Pattern**: 많은 프레임워크에서 사용 (React components, Vue plugins, Express middleware)
2. **Low Overhead**: Map lookup은 O(1), 성능 영향 무시할 수준
3. **Future-Proof**: 10+ 언어 지원 계획 시 필수
4. **Incremental**: 기존 언어를 점진적으로 마이그레이션 가능

## Future Work

1. **Tutorial Automation**
   - `LanguageConfig.tutorialSteps` 추가
   - `Tutorial.tsx` 동적 렌더링

2. **Language Packs**
   - 언어별 번들 분리 (code splitting)
   - 사용자가 선택한 언어만 로드

3. **Community Languages**
   - 사용자가 커스텀 언어 추가 가능하도록
   - JSON 설정 파일로 언어 정의

4. **Validation Layer**
   - `LanguageConfig` 스키마 검증 (Zod)
   - 잘못된 설정 조기 탐지

## References

- [extensible-languages](../wiki/extensible-languages.md) - 구현 상세 문서
- `src/language/languages/french.example.ts` - 새 언어 추가 템플릿
- [languages/english](../wiki/languages/english.md), [languages/japanese](../wiki/languages/japanese.md), etc. - 언어별 프로필

## Status History

- **2026-06-18**: Accepted - 리팩토링 완료, 테스트 통과
