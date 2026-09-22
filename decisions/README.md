# Decisions (ADR) Index

게임 디자인과 기술에 대한 결정 기록. **Accepted 상태는 immutable**.

## 메타 결정 (Accepted)

| ADR | 제목 | 상태 |
| --- | --- | --- |
| [0001](0001-tech-stack.md) | Tech Stack: TypeScript + React + Canvas + Vite | Accepted |
| [0002](0002-jp-input.md) | 일본어 입력: 로마자→한자 직접 매핑 | Accepted |
| [0003](0003-es-accents.md) | 스페인어 액센트: 직접 입력 + ASCII 폴백 | Accepted |
| [0010](0010-kr-input.md) | 한국어 입력: 한글 키보드 자모 직접 입력 + 클라이언트 합성 | Accepted |
| [0011](0011-extensible-languages.md) | Extensible Language System (LanguageRegistry) | Accepted |

## 미해결 결정 (Draft)

| ADR | 제목 | 상태 |
| --- | --- | --- |
| [0004](0004-rendering.md) | 렌더링 방식 (Canvas / DOM / WebGL) | Draft |
| [0005](0005-state-management.md) | 상태 관리 (React state / Zustand / Redux) | Draft |
| [0006](0006-data-format.md) | 데이터 형식 (JSON / YAML / TS const) | Draft |
| [0007](0007-testing-strategy.md) | 테스트 전략 (Vitest / Playwright) | Draft |
| [0008](0008-build-target.md) | 빌드 타겟 (SPA / PWA / Electron) | Draft |

## 비활성

| ADR | 제목 | 상태 |
| --- | --- | --- |
| [0009](0009-kr-input.md) | 한국어 입력: 로마자→한글 매핑 | Superseded by 0010 |

## 상태 설명

- **Draft**: 자유롭게 편집 가능. 사용자가 결정하면 Accepted로 승격.
- **Accepted**: Immutable. 변경하려면 새 ADR 작성.
- **Deprecated**: 더 이상 유효하지 않음. Superseded 링크 명시.
- **Superseded by NNNN**: 다른 ADR로 대체됨.

## 다음 결정

사용자 결정 대기:
- [ ] ADR-0004 렌더링 방식
- [ ] ADR-0005 상태 관리
- [ ] ADR-0006 데이터 형식
- [ ] ADR-0007 테스트 전략
- [ ] ADR-0008 빌드 타겟