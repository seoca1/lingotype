# 다중 프로필 시스템 설계

## 📋 개요

여러 사용자가 각자의 진행도를 저장하고 관리할 수 있는 프로필 시스템

---

## 🎯 주요 기능

### 1. 다중 프로필
- 한 브라우저에서 여러 프로필 생성 가능
- 각 프로필은 독립적인 진행도 유지
- 프로필 전환 가능

### 2. 스테이지별 기록
- 클리어 여부
- 최고 점수
- 최고 WPM
- 최고 정확도
- 별점 (0~3)
- 플레이 횟수

### 3. 프로필 정보
- 이름
- 아바타 (이모지)
- 생성일시
- 마지막 플레이 시간
- 레벨, 총 점수
- 통계

---

## 📂 파일 구조

```
src/
├── types.ts                      # 타입 추가
│   ├── UserProfile
│   ├── StageRecord
│   └── PlayerProgress (확장)
├── state/
│   └── profileManager.ts         # 프로필 관리 (신규)
└── ui/
    └── ProfileSelector.tsx       # 프로필 선택 UI (신규)
```

---

## 🔧 구현 상태

### ✅ 완료
1. **타입 정의** (`types.ts`)
   - `UserProfile`: 프로필 정보
   - `StageRecord`: 스테이지별 클리어 기록
   - `PlayerProgress`: stageRecords 필드 추가

2. **프로필 관리자** (`profileManager.ts`)
   - `loadAllProfiles()`: 모든 프로필 로드
   - `saveAllProfiles()`: 모든 프로필 저장
   - `createProfile()`: 새 프로필 생성
   - `updateProfile()`: 프로필 업데이트
   - `deleteProfile()`: 프로필 삭제
   - `switchProfile()`: 프로필 전환
   - `updateStageRecord()`: 스테이지 클리어 기록
   - `isStageCleared()`: 클리어 여부 확인
   - `getStageStars()`: 별점 가져오기

3. **프로필 선택 UI** (`ProfileSelector.tsx`)
   - 프로필 카드 표시
   - 프로필 생성 모달
   - 아바타 선택 (12종)
   - 프로필 삭제 확인
   - 통계 표시 (레벨, 별, 클리어 수)

4. **CSS 스타일** (`style.css`)
   - 프로필 그리드
   - 프로필 카드
   - 모달
   - 아바타 선택기

### 🔄 통합 필요
1. **App.tsx 수정**
   - 프로필 선택 단계 추가
   - 현재 프로필 상태 관리
   - 프로필별 진행도 로드/저장

2. **gameReducer.ts 수정**
   - PlayerProgress → UserProfile.progress 연동

3. **Menu.tsx 수정**
   - 스테이지별 클리어 상태 표시
   - 별점 표시
   - 언락 상태 확인

---

## 🎮 사용자 플로우

```
1. 앱 시작
   ↓
2. 프로필 선택 화면
   - 기존 프로필 선택
   - 새 프로필 생성
   ↓
3. 튜토리얼 (첫 실행 시)
   ↓
4. 메인 메뉴
   - 스테이지 목록 (클리어 상태 표시)
   ↓
5. 스테이지 플레이
   ↓
6. 결과 화면
   - 별점 계산
   - 스테이지 기록 업데이트
   ↓
7. 메뉴로 복귀
```

---

## 💾 LocalStorage 구조

### 프로필 목록
```json
{
  "version": 1,
  "profiles": [
    {
      "id": "profile_1234567890_abc123",
      "name": "Player1",
      "avatar": "👤",
      "createdAt": 1234567890000,
      "lastPlayedAt": 1234567890000,
      "progress": {
        "level": 5,
        "totalScore": 15000,
        "stats": { ... },
        "unlockedStages": ["en_easy_1", ...],
        "achievements": [],
        "stageRecords": {
          "en_easy_1": {
            "stageId": "en_easy_1",
            "cleared": true,
            "bestScore": 1500,
            "bestWpm": 45,
            "bestAccuracy": 95,
            "stars": 2,
            "playCount": 3,
            "firstClearedAt": 1234567890000,
            "lastPlayedAt": 1234567891000
          }
        }
      }
    }
  ],
  "lastUpdated": 1234567890000
}
```

### 현재 프로필
```
lingotype-current-profile: "profile_1234567890_abc123"
```

---

## 🌟 별점 계산 로직

```typescript
function calculateStars(accuracy: number, wpm: number): number {
  if (accuracy >= 95 && wpm >= 60) return 3; // ⭐⭐⭐
  if (accuracy >= 90 && wpm >= 40) return 2; // ⭐⭐
  if (accuracy >= 80 && wpm >= 20) return 1; // ⭐
  return 0; // 클리어했지만 별 없음
}
```

---

## 🎨 UI 개선 계획 (향후)

### 스테이지 트리 맵 (가로 스크롤)

```
[EN] English
     │
     ├─[⭐⭐⭐] Tier 1: First Words ────→ [⭐⭐] Tier 1: Greetings ────→ [🔒] Tier 2: ...
     │
     └─[⭐⭐] Tier 1: Basic ────→ [⭐] Tier 1: Numbers ────→ [🔒] Tier 2: ...

[JP] Japanese
     │
     ├─[⭐⭐⭐] Tier 0: Hiragana ────→ [⭐⭐] Tier 1: Words ────→ [🔒] Tier 2: ...
     │
     └─[⭐] Tier 0: Katakana ────→ [🔒] Tier 1: ...

[ES] Spanish
     │
     ├─[⭐⭐] Tier 1: Primeras Palabras ────→ [🔒] Tier 2: ...
     │
     └─[⭐] Tier 1: Saludos ────→ [🔒] Tier 2: ...
```

### 스테이지 카드에 표시할 정보
- ⭐⭐⭐ 별점
- 🏆 최고 점수
- ⚡ 최고 WPM
- 🎯 최고 정확도
- 🔢 플레이 횟수
- 🔒 언락 상태

---

## 📝 TODO (통합 작업)

### 우선순위 높음
- [ ] App.tsx에 프로필 선택 단계 추가
- [ ] 프로필 전환 시 gameReducer 초기화
- [ ] 스테이지 클리어 시 기록 업데이트

### 우선순위 중간
- [ ] Menu.tsx에 클리어 상태 표시
- [ ] 스테이지 카드에 별점 표시
- [ ] 프로필 전환 버튼 (메뉴에)

### 우선순위 낮음
- [ ] 가로 스크롤 트리 맵 UI
- [ ] 프로필 아바타 커스터마이징
- [ ] 업적 시스템 구현

---

## 🚀 배포 전 체크리스트

- [ ] 기존 진행도 마이그레이션 (단일 → 프로필)
- [ ] 프로필 없을 때 자동 생성
- [ ] 프로필 삭제 시 확인 대화상자
- [ ] 프로필 이름 중복 방지
- [ ] LocalStorage 용량 체크 (5MB 제한)

---

## 📚 참고

- LocalStorage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- React State Management: https://react.dev/learn/managing-state
- TypeScript Types: https://www.typescriptlang.org/docs/handbook/2/objects.html
