# 0005 - 상태 관리 (React state / Zustand / Redux)

## 상태

**Accepted**

## 결정일

2026-06-18 (구현 중 확정 — React useState/useReducer + Context 채택)

## 컨텍스트

게임의 상태(현재 스테이지, 플레이어 진행도, 점수, 입력 버퍼 등)를 어떻게 관리할지 결정.

**요건**:
- 입력 버퍼는 키 입력마다 갱신 (고빈도)
- 스테이지 진행 상태, 플레이어 통계
- React 컴포넌트에서 접근 용이
- 디버깅 가능성

## 옵션 비교

| 옵션 | 장점 | 단점 | 비고 |
| --- | --- | --- | --- |
| **React state (useState/useReducer)** | 의존성 없음, 단순 | 컴포넌트 깊이가 깊으면 prop drilling | **추천** |
| Zustand | 가벼움, 외부 store, 디버깅 용이 | 외부 의존성 | |
| Redux Toolkit | 표준 패턴, 미들웨어, 시간 여행 디버깅 | 보일러플레이트, 학습 곡선 | |
| Jotai / Recoil | atomic state, React 친화 | 작은 프로젝트엔 과함 | |
| XState | 상태 머신, FSM | 격파 게임엔 과함 | |

## 결정 (제안)

**React state (useReducer) + Context (필요시)**

- 게임 루프 상태: useReducer (명시적 액션)
- 단순 UI 상태: useState
- 전역(플레이어 통계): Context (Phase 5+)

## 이유

1. **의존성 최소화**: 격파 게임에 Redux는 과함
2. **명시적 액션**: useReducer로 게임 액션을 명확히
3. **React 친화**: Phase 4에서 시작 가능, 즉시 검증

## 결과 / 영향

### 긍정적
- 빠른 시작, 추가 의존성 없음
- React DevTools로 디버깅 가능
- FSM 패턴 (useReducer)으로 게임 로직 명확

### 부정적 / 트레이드오프
- 컴포넌트 깊이가 깊어지면 prop drilling
- 글로벌 상태는 Context로 해결 (오버헤드 미미)

### 제약
- 성능: 고빈도 업데이트 시 React 리렌더링 → 필요한 부분만 메모이즈
- 미들웨어 없음 → Phase 5+에서 필요시 검토

## 열린 질문

- [ ] Canvas 렌더링과 React 상태 동기화 (requestAnimationFrame?)
- [ ] 디버깅 도구 (Redux DevTools 대안)
- [ ] Phase 7에서 Zustand 도입 검토?

## 다음 단계

- 사용자 결정 대기
- 결정 후 `prototype/src/state/` 구현