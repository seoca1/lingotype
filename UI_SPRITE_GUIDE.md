# 🎨 UI 스프라이트 가이드

## 📌 개요

게임 UI 요소를 스프라이트로 렌더링하여 더 정교하고 일관성 있는 비주얼을 제공합니다.

---

## 🎮 구현된 UI 스프라이트 (11종)

### **버튼 (3종)**

#### `ui-button-normal`
```
┌────────────────────┐
│                    │
│    BUTTON TEXT     │ ← 기본 상태
│                    │
└────────────────────┘
200×60px
```

#### `ui-button-hover`
```
┌────────────────────┐
│                    │
│    BUTTON TEXT     │ ← 밝은 색 + 그림자 확대
│                    │
└────────────────────┘
200×60px
```

#### `ui-button-active`
```
┌────────────────────┐
│    BUTTON TEXT     │ ← 눌린 효과 (2px 아래)
└────────────────────┘
200×60px
```

**특징:**
- 둥근 모서리 (8px radius)
- 그림자 효과
- 상단 하이라이트
- 색상: #e94560 (accent)

---

### **프로그레스 바 (2종)**

#### `ui-progress-bar`
```
┌──────────────────────────────────┐
│████████████░░░░░░░░░░░░░░░░░░░░░│
└──────────────────────────────────┘
300×30px
```

**용도:**
- 스테이지 진행도
- 로딩 바
- 경험치 바

**색상:**
- 배경: #2a2a3e
- 진행: #00d9ff → #00a8cc (그라디언트)

#### `ui-hp-bar`
```
┌───────────────────────────┐
│███████████████░░░░░░░░░░░│ ← HP 게이지
└───────────────────────────┘
200×24px
```

**용도:**
- 적 HP 바
- 캐릭터 HP
- 타이핑 진행도 **← 현재 사용 중!**

**색상:**
- 배경: #1a1a2e
- 진행: #00ff88 → #009955 (초록 그라디언트)
- 반짝임 효과 (상단 하이라이트)

---

### **콤보 뱃지**

#### `ui-combo-badge`
```
    ╱───────╲
   │ COMBO! │ ← 타원형 뱃지
    ╲───────╱
120×50px
```

**용도:**
- 콤보 카운터 배경 **← 현재 사용 중!**
- 특수 이벤트 표시

**특징:**
- 핑크 그라디언트 (#ff6b9d)
- 빛나는 효과 (shadow blur)
- 반투명 줄무늬 패턴

---

### **별 등급 (2종)**

#### `ui-star-empty`
```
   ☆
  / \
 /   \
│  ☆  │ ← 빈 별
 \   /
  \ /
   ☆
48×48px
```

**색상:**
- 배경: #2a2a3e
- 테두리: #888

#### `ui-star-filled`
```
   ★
  /█\
 /███\
│ ★★★│ ← 금색 별
 \███/
  \█/
   ★
48×48px
```

**색상:**
- 배경: 금색 그라디언트 (#ffd700)
- 빛나는 효과
- 테두리: #ff8f00

**용도:**
- 스테이지 클리어 별점 **← Menu.tsx에서 사용**
- 평가 시스템
- 업적 표시

---

### **패널**

#### `ui-panel`
```
┏━━━━━━━━━━━━━━━━━━━┓
┃                   ┃
┃   PANEL CONTENT   ┃
┃                   ┃
┗━━━━━━━━━━━━━━━━━━━┛
400×300px
```

**특징:**
- 다크 그라디언트 배경
- 둥근 모서리 (12px)
- 모서리 액센트 (파란색)
- 이중 테두리

**용도:**
- 모달 창
- 설정 패널
- 결과 화면

---

### **사운드 아이콘 (2종)**

#### `ui-icon-sound`
```
  🔊
 <)))
32×32px
```

**특징:**
- 하얀 스피커
- 파란 음파 (3개)
- 페이드 효과

#### `ui-icon-mute`
```
  🔇
  ✖
32×32px
```

**특징:**
- 회색 스피커
- 빨간 X 표시

---

## 🔧 사용 방법

### 1. HP 바 (게임 내)

**위치:** `src/engine/Renderer.ts`

```typescript
// 현재 drawEnemyHealthBar()에서 자동 사용
if (GraphicsConfig.USE_SPRITES) {
  const hpBarSprite = SpriteLoader.get('ui-hp-bar');
  if (hpBarSprite) {
    // 배경 (50% 투명)
    ctx.globalAlpha = 0.5;
    ctx.drawImage(hpBarSprite.image, x, y, width, height);
    
    // 진행도 (클리핑)
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width * progress, height);
    ctx.clip();
    ctx.drawImage(hpBarSprite.image, x, y, width, height);
    ctx.restore();
  }
}
```

**결과:**
- 초록색 그라디언트 HP 바
- 위쪽 반짝임 효과
- 부드러운 진행 애니메이션

---

### 2. 콤보 뱃지 (게임 내)

**위치:** `src/engine/Renderer.ts`

```typescript
// 콤보 5 이상일 때 자동 표시
if (GraphicsConfig.USE_SPRITES && state.combo >= 5) {
  const badgeSprite = SpriteLoader.get('ui-combo-badge');
  if (badgeSprite) {
    const scale = 1 + scaleBoost * 0.5; // 콤보 높을수록 커짐
    ctx.scale(scale, scale);
    ctx.drawImage(badgeSprite.image, x, y, w, h);
  }
}
```

**효과:**
- 콤보 수치에 따라 크기 변화
- 핑크 타원형 배경
- 빛나는 효과

---

### 3. 별 등급 (React 컴포넌트)

**위치:** `src/ui/Menu.tsx` (스테이지 카드)

**현재 코드:**
```typescript
// CSS 기반 별 표시
<span className="stars">{'⭐'.repeat(stars)}</span>
```

**스프라이트로 교체:**
```typescript
import { SpriteLoader } from '../sprites/SpriteLoader.js';

function StageCard({ record }) {
  const stars = record?.stars || 0;
  
  return (
    <div className="stage-stars">
      {[1, 2, 3].map(i => {
        const sprite = i <= stars ? 'ui-star-filled' : 'ui-star-empty';
        const img = SpriteLoader.get(sprite);
        return img ? (
          <img 
            key={i} 
            src={img.image.src} 
            width={24} 
            height={24} 
            alt="star"
          />
        ) : (
          <span key={i}>{i <= stars ? '⭐' : '☆'}</span>
        );
      })}
    </div>
  );
}
```

---

### 4. 버튼 (React 컴포넌트)

**예시: StageScreen의 뒤로가기 버튼**

```typescript
function BackButton({ onClick }) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  
  const spriteName = active 
    ? 'ui-button-active' 
    : hover 
    ? 'ui-button-hover' 
    : 'ui-button-normal';
    
  const sprite = SpriteLoader.get(spriteName);
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        background: sprite 
          ? `url(${sprite.image.src})` 
          : '#e94560',
        backgroundSize: 'cover',
        width: 200,
        height: 60,
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <span style={{ color: '#fff', fontWeight: 'bold' }}>
        Back to Menu
      </span>
    </button>
  );
}
```

---

## 🎨 커스터마이징

### 색상 변경

**`src/sprites/SpriteLoader.ts`** 수정:

```typescript
private generateButtonSprite(/* ... */, state: 'normal' | 'hover' | 'active') {
  const colors = {
    normal: { 
      bg: '#00d9ff',  // ← 파란색으로 변경
      border: '#00a8cc', 
    },
    // ...
  };
}
```

### 크기 변경

```typescript
private generateHPBarSprite(/* ... */) {
  canvas.width = 400;  // ← 200에서 400으로 변경
  canvas.height = 32;  // ← 24에서 32로 변경
  // ...
}
```

### 새 버튼 스타일 추가

```typescript
// ui-button-danger 추가
case 'ui-button-danger':
  return this.generateButtonSprite(canvas, ctx, 'danger');

private generateButtonSprite(/* ... */, state: '...' | 'danger') {
  // ...
  danger: { bg: '#ff4444', border: '#cc3333', shadow: '...' },
}
```

---

## 📊 현재 적용 현황

| UI 요소 | 스프라이트 | 위치 | 상태 |
|---------|-----------|------|------|
| **HP 바** | ✅ ui-hp-bar | Renderer.ts | ✅ 적용 완료 |
| **콤보 뱃지** | ✅ ui-combo-badge | Renderer.ts | ✅ 적용 완료 |
| 별 등급 | ⚠️ ui-star-* | Menu.tsx | ⏳ 수동 적용 가능 |
| 버튼 | ⚠️ ui-button-* | StageScreen.tsx | ⏳ 수동 적용 가능 |
| 프로그레스 바 | ⚠️ ui-progress-bar | - | ⏳ 미사용 |
| 패널 | ⚠️ ui-panel | - | ⏳ 미사용 |
| 사운드 아이콘 | ⚠️ ui-icon-* | StageScreen.tsx | ⏳ 수동 적용 가능 |

---

## 🚀 추가 예시

### 로딩 바

```typescript
function LoadingBar({ progress }: { progress: number }) {
  const sprite = SpriteLoader.get('ui-progress-bar');
  
  return (
    <canvas ref={(canvas) => {
      if (canvas && sprite) {
        const ctx = canvas.getContext('2d')!;
        canvas.width = 300;
        canvas.height = 30;
        
        // Background (dim)
        ctx.globalAlpha = 0.3;
        ctx.drawImage(sprite.image, 0, 0, 300, 30);
        
        // Progress (clipped)
        ctx.globalAlpha = 1;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, 300 * progress, 30);
        ctx.clip();
        ctx.drawImage(sprite.image, 0, 0, 300, 30);
        ctx.restore();
      }
    }} />
  );
}
```

### 패널 배경

```typescript
function SettingsPanel() {
  const sprite = SpriteLoader.get('ui-panel');
  
  return (
    <div 
      style={{
        background: sprite ? `url(${sprite.image.src})` : '#2a2a3e',
        backgroundSize: 'cover',
        width: 400,
        height: 300,
        padding: 20,
        borderRadius: 12,
      }}
    >
      <h2>Settings</h2>
      {/* ... */}
    </div>
  );
}
```

---

## 💡 모범 사례

### 1. Fallback 제공

```typescript
const sprite = SpriteLoader.get('ui-button-normal');
if (sprite) {
  // 스프라이트 사용
  ctx.drawImage(sprite.image, x, y, w, h);
} else {
  // Fallback: CSS 또는 프리미티브
  ctx.fillStyle = '#e94560';
  ctx.fillRect(x, y, w, h);
}
```

### 2. 프리로드 확인

```typescript
// App.tsx에서 프리로드
useEffect(() => {
  SpriteLoader.preload(['ui-button-normal', 'ui-hp-bar'])
    .then(() => console.log('UI sprites loaded'))
    .catch(err => console.warn('Failed to load UI sprites:', err));
}, []);
```

### 3. 반응형 크기

```typescript
const isMobile = window.innerWidth < 768;
const sprite = SpriteLoader.get('ui-button-normal');

const buttonWidth = isMobile ? 150 : 200;
const buttonHeight = isMobile ? 45 : 60;

ctx.drawImage(sprite.image, x, y, buttonWidth, buttonHeight);
```

---

## 🎯 다음 개선 사항

### 우선순위 1: React 컴포넌트 통합
- [ ] Menu.tsx 별 등급 스프라이트 적용
- [ ] StageScreen.tsx 버튼 스프라이트 적용
- [ ] StageScreen.tsx 사운드 아이콘 스프라이트 적용

### 우선순위 2: 추가 UI 스프라이트
- [ ] ui-icon-settings (⚙️)
- [ ] ui-icon-info (ℹ️)
- [ ] ui-icon-trophy (🏆)
- [ ] ui-badge-new (🆕)

### 우선순위 3: 애니메이션
- [ ] 버튼 호버 애니메이션 (3프레임)
- [ ] 별 채워지는 애니메이션 (8프레임)
- [ ] 프로그레스 바 빛나는 효과

---

## 📝 체크리스트

UI 스프라이트 추가 시:

- [ ] SpriteName 타입에 추가
- [ ] generateSprite() switch에 케이스 추가
- [ ] 생성 함수 작성 (generate___Sprite)
- [ ] GraphicsConfig.SPRITE_PRELOAD에 추가
- [ ] 사용처에서 SpriteLoader.get() 호출
- [ ] Fallback 코드 작성
- [ ] 크기 조정 테스트
- [ ] 모바일 반응형 확인

---

## 🎉 완성!

**현재 UI 스프라이트 시스템:**
- ✅ 11종 UI 스프라이트 생성
- ✅ HP 바 자동 적용
- ✅ 콤보 뱃지 자동 적용
- ✅ 프리로드 시스템 통합
- ✅ Fallback 처리 완료

**React 컴포넌트에서 사용 준비 완료!**

```typescript
// 어디서나 사용 가능
import { SpriteLoader } from './sprites/SpriteLoader.js';

const sprite = SpriteLoader.get('ui-button-normal');
// → 200×60 버튼 스프라이트!
```

---

**제작:** LingoType  
**버전:** v0.5.0  
**마지막 업데이트:** 2024-01-XX
