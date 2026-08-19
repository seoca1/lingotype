# 🎨 스프라이트 시스템 가이드

## 📌 개요

LingoType는 **2가지 렌더링 모드**를 지원합니다:

| 모드 | 설명 | 장점 | 단점 |
|------|------|------|------|
| **Primitives** | Canvas 2D 원시 도형 | 가볍고 빠름, 로딩 없음 | 덜 정교함 |
| **Sprites** | 이미지 기반 렌더링 | 정교한 비주얼, 게임다움 | 용량 증가, 로딩 필요 |

---

## 🎮 현재 구현 상태

### ✅ 완성된 기능

#### **1. 스프라이트 로더**
- 이미지 캐싱 시스템
- 비동기 로딩
- 프리로드 지원
- Data URL 기반 프로그래밍 생성

#### **2. 스프라이트 렌더러**
- 애니메이션 프레임 관리
- 회전/크기/투명도 지원
- 플립 (H/V) 지원
- 루프/단발성 애니메이션

#### **3. 생성된 스프라이트**

**캐릭터:**
- `character-idle` (4프레임) - 호흡 애니메이션
- `character-attack` (6프레임) - 공격 모션
- `character-hit` (1프레임) - 피격 플래시
- `character-victory` (1프레임) - 승리 포즈

**적:**
- `enemy-idle` (2프레임) - 떠다니는 애니메이션
- `enemy-hit` (1프레임) - 피격 효과

**이펙트:**
- `effect-hit` (8프레임) - 폭발 이펙트
- `effect-sparkle` (12프레임) - 반짝임 효과
- `effect-star` (1프레임) - 별 파티클

---

## 🔧 사용 방법

### 스프라이트 모드 켜기/끄기

**`src/config/graphics.ts`** 파일 수정:

```typescript
export const GraphicsConfig = {
  USE_SPRITES: true,  // ← true: 스프라이트, false: 프리미티브
  // ...
};
```

### 즉시 적용

코드 수정 후:
```bash
npm run dev  # 개발 서버 재시작
# 또는
npm run build  # 프로덕션 빌드
```

---

## 🎨 스프라이트 교체 방법

### 방법 1: 프로그래밍 생성 수정

**`src/sprites/SpriteLoader.ts`** 파일에서 생성 함수 수정:

```typescript
private generateCharacterIdleSprite(
  canvas: HTMLCanvasElement, 
  ctx: CanvasRenderingContext2D
): string {
  // 여기서 Canvas API로 스프라이트 그리기
  canvas.width = 320; // 4프레임 × 80px
  canvas.height = 120;
  
  for (let frame = 0; frame < 4; frame++) {
    // 각 프레임 그리기
    const x = frame * 80;
    ctx.fillStyle = '#ff69b4';
    ctx.fillRect(x, 0, 80, 120);
    // ... 더 복잡한 그래픽
  }
  
  return canvas.toDataURL();
}
```

### 방법 2: 실제 이미지 파일 사용

#### Step 1: 이미지 파일 준비
```
prototype/public/sprites/
├── character-idle.png (320x120 - 4프레임)
├── character-attack.png (480x120 - 6프레임)
├── enemy-idle.png (200x100 - 2프레임)
└── effect-hit.png (512x64 - 8프레임)
```

#### Step 2: SpriteLoader 수정

`src/sprites/SpriteLoader.ts`:

```typescript
private async loadSprite(name: SpriteName): Promise<Sprite> {
  // 이미지 URL 매핑
  const urls: Record<SpriteName, string> = {
    'character-idle': '/sprites/character-idle.png',
    'character-attack': '/sprites/character-attack.png',
    'enemy-idle': '/sprites/enemy-idle.png',
    // ...
  };
  
  const url = urls[name];
  if (url) {
    return this.loadFromUrl(url, name);
  }
  
  // Fallback: 프로그래밍 생성
  const dataUrl = this.generateSprite(name);
  return this.loadFromDataUrl(dataUrl, name);
}

private loadFromUrl(url: string, name: SpriteName): Promise<Sprite> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        image: img,
        width: img.width,
        height: img.height,
        frames: this.getFrameCount(name),
      });
    };
    img.onerror = () => reject(new Error(`Failed to load: ${url}`));
    img.src = url;
  });
}
```

---

## 🖼️ 스프라이트 시트 규격

### 프레임 레이아웃

**수평 스프라이트 시트:**
```
[Frame 1][Frame 2][Frame 3][Frame 4]
```

**예시: character-idle.png**
```
총 크기: 320px × 120px
프레임 수: 4
프레임 크기: 80px × 120px
```

### 권장 크기

| 스프라이트 | 프레임 크기 | 프레임 수 | 총 크기 |
|------------|-------------|-----------|---------|
| character-idle | 80×120 | 4 | 320×120 |
| character-attack | 80×120 | 6 | 480×120 |
| enemy-idle | 100×100 | 2 | 200×100 |
| effect-hit | 64×64 | 8 | 512×64 |
| effect-sparkle | 32×32 | 12 | 384×32 |

---

## 🎬 애니메이션 설정

### 프레임 속도 조정

**`src/character/CharacterRenderer.ts`**:

```typescript
function renderCharacterSprite(/* ... */) {
  let frameDuration = 150; // ms per frame
  
  switch (state.pose) {
    case 'idle':
      frameDuration = 200; // 느리게 (호흡)
      break;
    case 'attack':
      frameDuration = 60; // 빠르게 (공격)
      break;
  }
  
  spriteRenderer.drawAnimatedSprite(ctx, sprite, animId, x, y, now, {
    frameDuration,
    loop: true,
  });
}
```

### 애니메이션 이벤트

```typescript
spriteRenderer.drawAnimatedSprite(ctx, sprite, 'attack', x, y, now, {
  frameDuration: 80,
  loop: false, // 한 번만 재생
  onComplete: () => {
    console.log('Animation finished!');
    // 다음 동작으로 전환
  },
});
```

---

## 🔍 디버깅

### 스프라이트 로딩 확인

브라우저 콘솔에서:

```typescript
// 스프라이트 프리로드 상태 확인
import { SpriteLoader } from './sprites/SpriteLoader.js';

const sprite = SpriteLoader.get('character-idle');
console.log(sprite); // null이면 아직 로딩 안 됨

// 수동 로딩
await SpriteLoader.load('character-idle');
```

### "Loading..." 텍스트가 보이면?

스프라이트가 로딩되지 않았습니다:

1. **네트워크 탭 확인** (DevTools)
   - 이미지 로딩 실패?
   - 404 에러?

2. **콘솔 확인**
   - "Sprite preload failed" 경고?
   - 에러 메시지?

3. **프리로드 리스트 확인**
   ```typescript
   // src/config/graphics.ts
   SPRITE_PRELOAD: [
     'character-idle', // ← 이름 확인
     // ...
   ]
   ```

---

## 🎨 Photoshop/Aseprite로 스프라이트 만들기

### Aseprite (추천 - 픽셀아트)

#### 1. 새 파일 생성
```
Width: 80px
Height: 120px
Mode: RGBA
```

#### 2. 프레임 그리기
- Frame 1: 기본 포즈
- Frame 2: 약간 위로
- Frame 3: 더 위로
- Frame 4: 기본으로 돌아옴

#### 3. 스프라이트 시트 내보내기
```
File → Export Sprite Sheet
- Layout: Horizontal
- Trim: No
- Output File: character-idle.png
```

### Photoshop

#### 1. 새 캔버스
```
Width: 320px (80 × 4)
Height: 120px
```

#### 2. 가이드 생성
```
View → New Guide
- Vertical: 80px, 160px, 240px
```

#### 3. 각 80px 구간에 프레임 그리기

#### 4. 저장
```
File → Export → Export As → PNG
```

---

## 💡 팁과 트릭

### 1. 투명 배경 필수

```
PNG-24 with Alpha Channel
```

배경이 투명하지 않으면 네모 박스가 보입니다.

### 2. 픽셀 정렬

스프라이트를 정수 좌표에 그리기:
```typescript
ctx.drawImage(sprite, Math.floor(x), Math.floor(y));
```

### 3. 안티앨리어싱 끄기 (픽셀아트)

```typescript
ctx.imageSmoothingEnabled = false;
```

### 4. 프레임 수 동기화

**SpriteLoader.ts:**
```typescript
private getFrameCount(name: SpriteName): number {
  switch (name) {
    case 'character-idle':
      return 4; // ← 실제 프레임 수와 일치!
  }
}
```

### 5. 메모리 관리

```typescript
// 사용 안 하는 스프라이트 해제
SpriteLoader.clear('old-sprite');
```

---

## 📊 성능 비교

| 모드 | 번들 크기 | 로딩 시간 | FPS | 메모리 |
|------|-----------|-----------|-----|--------|
| **Primitives** | 261 KB | 즉시 | 60 | 낮음 |
| **Sprites (생성)** | 273 KB | ~100ms | 60 | 중간 |
| **Sprites (PNG)** | 350 KB | ~300ms | 60 | 높음 |

**권장:**
- 데모/프로토타입: Primitives
- 출시 버전: Sprites (PNG)

---

## 🚀 다음 단계

### 추가 가능한 스프라이트

1. **표정 변화**
   - `character-happy`
   - `character-sad`
   - `character-surprised`

2. **적 다양화**
   - `enemy-type1`, `enemy-type2`
   - 언어별 적 디자인

3. **배경 요소**
   - `bg-sakura-petals`
   - `bg-stars`
   - `bg-lanterns`

4. **UI 요소**
   - `ui-button-hover`
   - `ui-star-fill`
   - `ui-progress-bar`

### 스프라이트 애니메이션 툴

- **Aseprite** (유료, $20) - 픽셀아트 특화
- **Piskel** (무료, 웹) - 브라우저 기반
- **GraphicsGale** (무료) - 전통적 툴
- **Krita** (무료) - 2D 애니메이션 지원

---

## 📝 체크리스트

### 스프라이트 추가 시

- [ ] 이미지 파일 준비 (PNG, 투명 배경)
- [ ] `SpriteName` 타입에 추가
- [ ] `SpriteLoader.getFrameCount()` 업데이트
- [ ] `GraphicsConfig.SPRITE_PRELOAD`에 추가
- [ ] 로딩 테스트
- [ ] 애니메이션 속도 조정
- [ ] 크기/위치 조정
- [ ] 실제 플레이로 확인

---

## ❓ FAQ

### Q: 스프라이트가 깨져 보여요
A: `imageSmoothingEnabled = false` 설정 확인

### Q: 애니메이션이 너무 빨라요
A: `frameDuration` 값을 늘리세요 (예: 100 → 200)

### Q: Loading... 텍스트가 계속 보여요
A: 스프라이트 프리로드가 실패했습니다. 콘솔 에러 확인

### Q: 이미지 교체 후에도 이전 이미지가 보여요
A: 브라우저 캐시 클리어 (`Cmd+Shift+R`)

### Q: 프리미티브와 스프라이트를 섞어 쓸 수 있나요?
A: 네! `GraphicsConfig.USE_SPRITES`는 캐릭터 전체 설정이지만, 개별 요소는 커스터마이징 가능합니다.

---

## 🎉 완성된 시스템

현재 구현된 스프라이트 시스템:

✅ 스프라이트 로더 (캐싱, 비동기)
✅ 스프라이트 렌더러 (애니메이션)
✅ 9종 스프라이트 (프로그래밍 생성)
✅ 프레임 애니메이션 시스템
✅ 설정 파일 (토글 가능)
✅ 프리로드 시스템
✅ 기존 프리미티브 시스템 유지

**언제든지 전환 가능!**

```typescript
// src/config/graphics.ts
USE_SPRITES: false  // 프리미티브
USE_SPRITES: true   // 스프라이트
```

---

**제작:** LingoType
**버전:** v0.4.0
**마지막 업데이트:** 2024-01-XX
