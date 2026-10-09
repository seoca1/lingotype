/**
 * Character Renderer - Canvas 2D 프리미티브로 컴패니언 그리기
 *
 * 문화 의상(서양/기모노/플라멩코/한복), 헤어 스타일, 헤드피스를 합성해 그린다.
 * 외부 이미지 없이 원·사각·곡선만으로 SD 인물風 캐릭터를 그린다.
 *
 * 좌표계: 캐릭터 기준점 (cx, groundY)을 발 위치로 잡고 위로 그린다.
 * 
 * 스프라이트 모드: USE_SPRITES = true로 설정하면 스프라이트 렌더링 사용
 */

import type { CharacterState } from './CharacterController.js';
import { hasAccessory, hasProp } from './CharacterController.js';
import type { CulturalAppearance } from './CharacterData.js';
import { SpriteLoader } from '../sprites/SpriteLoader.js';
import { SpriteRenderer } from '../sprites/SpriteRenderer.js';
import { GraphicsConfig } from '../config/graphics.js';
import { ImageLoader } from '../sprites/ImageLoader.js';
import { 
  CHARACTER_IMAGES, 
  USE_EXTERNAL_IMAGES,
  getCharacterForLanguage,
} from '../config/characterImages.js';
import { getCurrentCharacter } from './CharacterSelector.js';

const spriteRenderer = new SpriteRenderer();

interface DrawContext {
  ctx: CanvasRenderingContext2D;
  now: number;
}

export function renderCharacter(
  ctx: CanvasRenderingContext2D,
  state: CharacterState,
  cx: number,
  groundY: number,
  now: number,
): void {
  // Use external image rendering if enabled
  if (USE_EXTERNAL_IMAGES) {
    renderCharacterImage(ctx, state, cx, groundY, now);
    return;
  }

  // Use sprite rendering if enabled
  if (GraphicsConfig.USE_SPRITES) {
    renderCharacterSprite(ctx, state, cx, groundY, now);
    return;
  }

  // Original primitive rendering
  const draw: DrawContext = { ctx, now };

  const breathing = state.pose === 'idle' ? Math.sin(now / 600) * 1.5 : 0;

  let bodyOffsetY = breathing;
  let bodyScaleY = 1;
  let bodyRotation = 0;
  let armLeftAngle = 0;
  let armRightAngle = 0;
  const armLeftLength = 1;
  const armRightLength = 1;
  let legSpread = 0;

  switch (state.pose) {
    case 'idle':
      armLeftAngle = Math.sin(now / 1100) * 0.05;
      armRightAngle = Math.sin(now / 1100 + Math.PI) * 0.05;
      break;
    case 'wave': {
      const t = (now - state.poseStart) / 900;
      const phase = Math.sin(t * Math.PI * 4);
      armRightAngle = -1.2 + phase * 0.3;
      armLeftAngle = 0.1;
      bodyOffsetY += Math.sin(t * Math.PI) * -3;
      break;
    }
    case 'jump': {
      const t = (now - state.poseStart) / 700;
      const arc = Math.sin(t * Math.PI);
      bodyOffsetY -= arc * 30;
      armLeftAngle = -1.8;
      armRightAngle = -1.8;
      legSpread = 0.3;
      break;
    }
    case 'clap': {
      const t = (now - state.poseStart) / 800;
      const phase = Math.sin(t * Math.PI * 6);
      armLeftAngle = -1.0 + phase * 0.15;
      armRightAngle = -1.0 - phase * 0.15;
      bodyOffsetY += Math.sin(t * Math.PI) * -2;
      break;
    }
    case 'spin': {
      const t = (now - state.poseStart) / 1400;
      bodyRotation = t * Math.PI * 2;
      armLeftAngle = -Math.PI / 2;
      armRightAngle = -Math.PI / 2;
      bodyScaleY = 1 + Math.sin(t * Math.PI * 2) * 0.05;
      break;
    }
    case 'dance': {
      const t = (now - state.poseStart) / 3000;
      const beat = Math.sin(t * Math.PI * 4);
      bodyOffsetY += Math.abs(beat) * -10;
      armLeftAngle = -1.4 + beat * 0.4;
      armRightAngle = -1.4 - beat * 0.4;
      legSpread = beat * 0.2;
      bodyRotation = Math.sin(t * Math.PI * 2) * 0.1;
      break;
    }
    case 'pose': {
      const t = (now - state.poseStart) / 1800;
      armRightAngle = -1.4;
      armLeftAngle = -0.3;
      bodyRotation = Math.sin(t * Math.PI) * 0.05;
      break;
    }
  }

  if (state.mood === 'triumphant' || state.pose === 'dance') {
    drawAura(draw, cx, groundY - 130, now);
  }
  if (state.mood === 'excited') {
    drawSparkles(draw, cx, groundY - 120, now);
  }

  ctx.save();
  ctx.translate(cx, groundY);
  ctx.rotate(bodyRotation);
  ctx.translate(0, bodyOffsetY);
  ctx.scale(1, bodyScaleY);

  drawLegs(draw, state.appearance, legSpread);
  drawOutfit(draw, state.appearance);
  drawArms(draw, state.appearance, armLeftAngle, armRightAngle, armLeftLength, armRightLength);
  drawHeadAndHair(draw, state, now);

  ctx.restore();
}

/**
 * Render character using sprites
 */
function renderCharacterSprite(
  ctx: CanvasRenderingContext2D,
  state: CharacterState,
  cx: number,
  groundY: number,
  now: number,
): void {
  // Get appropriate sprite based on pose
  let spriteName: any;
  let frameDuration = 150;
  let loop = true;

  switch (state.pose) {
    case 'idle':
      spriteName = 'character-idle';
      frameDuration = 200;
      break;
    case 'wave':
    case 'clap':
    case 'dance':
      spriteName = 'character-attack';
      frameDuration = 100;
      break;
    case 'jump':
    case 'spin':
    case 'pose':
      spriteName = 'character-victory';
      loop = false;
      break;
    default:
      spriteName = 'character-idle';
  }

  const sprite = SpriteLoader.get(spriteName);
  if (!sprite) {
    // Sprite not loaded yet, show loading or fallback
    ctx.fillStyle = '#888';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Loading...', cx, groundY - 60);
    return;
  }

  // Draw effects based on mood
  if (state.mood === 'triumphant' || state.pose === 'dance') {
    drawAura({ ctx, now }, cx, groundY - 130, now);
  }
  if (state.mood === 'excited') {
    drawSparkles({ ctx, now }, cx, groundY - 120, now);
  }

  // Draw the character sprite
  const animId = `character-${state.pose}`;
  spriteRenderer.drawAnimatedSprite(
    ctx,
    sprite,
    animId,
    cx,
    groundY - 60, // Center sprite vertically
    now,
    {
      scale: 1.2,
      frameDuration,
      loop,
      alpha: 1,
    }
  );

  // Draw additional sprite effects for hits/attacks
  const speechAge = now - state.speechStart;
  if (speechAge < 200) {
    const effectSprite = SpriteLoader.get('effect-sparkle');
    if (effectSprite) {
      spriteRenderer.drawAnimatedSprite(
        ctx,
        effectSprite,
        'speech-effect',
        cx + 30,
        groundY - 80,
        now,
        {
          scale: 0.8,
          frameDuration: 50,
          loop: false,
        }
      );
    }
  }
}

// ===== Legs =====

function drawLegs(draw: DrawContext, appearance: CulturalAppearance, spread: number): void {
  const { ctx } = draw;
  const skirt = appearance.outfitType === 'hanbok' || appearance.outfitType === 'flamenco';
  if (!skirt) {
    ctx.fillStyle = '#3a3a55';
    ctx.beginPath();
    drawLegShape(ctx, -8, spread * -1);
    drawLegShape(ctx, 8, spread);
  }
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.ellipse(-8, -2, 7, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(8, -2, 7, 4, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawLegShape(ctx: CanvasRenderingContext2D, x: number, spread: number): void {
  ctx.save();
  ctx.translate(x, 0);
  ctx.rotate(spread);
  ctx.beginPath();
  ctx.roundRect(-4, -40, 8, 40, 4);
  ctx.fill();
  ctx.restore();
}

// ===== Outfits =====

function drawOutfit(draw: DrawContext, appearance: CulturalAppearance): void {
  switch (appearance.outfitType) {
    case 'western':
      drawWesternDress(draw, appearance);
      break;
    case 'kimono':
      drawKimono(draw, appearance);
      break;
    case 'flamenco':
      drawFlamencoDress(draw, appearance);
      break;
    case 'hanbok':
      drawHanbok(draw, appearance);
      break;
  }
}

function drawWesternDress(draw: DrawContext, appearance: CulturalAppearance): void {
  const { ctx } = draw;
  ctx.fillStyle = appearance.outfitPrimary;
  ctx.beginPath();
  ctx.moveTo(-22, -45);
  ctx.quadraticCurveTo(-30, -85, -18, -90);
  ctx.lineTo(18, -90);
  ctx.quadraticCurveTo(30, -85, 22, -45);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = appearance.outfitSecondary;
  ctx.beginPath();
  ctx.moveTo(-6, -90);
  ctx.lineTo(0, -78);
  ctx.lineTo(6, -90);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = appearance.outfitAccent;
  ctx.fillRect(-22, -52, 44, 4);
}

function drawKimono(draw: DrawContext, appearance: CulturalAppearance): void {
  const { ctx } = draw;
  // 본체 (긴 직선형)
  ctx.fillStyle = appearance.outfitPrimary;
  ctx.beginPath();
  ctx.moveTo(-24, -45);
  ctx.lineTo(-26, -90);
  ctx.lineTo(26, -90);
  ctx.lineTo(24, -45);
  ctx.closePath();
  ctx.fill();

  // 패턴 (꽃 또는 지오메트릭)
  ctx.fillStyle = appearance.outfitSecondary;
  ctx.globalAlpha = 0.6;
  for (let i = 0; i < 3; i++) {
    const cy = -85 + i * 12;
    ctx.beginPath();
    ctx.arc(-10, cy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, cy + 6, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 흰색 이너 칼라 (V자)
  ctx.fillStyle = appearance.outfitSecondary;
  ctx.beginPath();
  ctx.moveTo(-14, -90);
  ctx.lineTo(0, -73);
  ctx.lineTo(14, -90);
  ctx.lineTo(10, -90);
  ctx.lineTo(0, -78);
  ctx.lineTo(-10, -90);
  ctx.closePath();
  ctx.fill();

  // 오비 (넓은 띠)
  ctx.fillStyle = appearance.outfitAccent;
  ctx.fillRect(-26, -58, 52, 14);
  // 오비 라인
  ctx.fillStyle = appearance.outfitPrimary;
  ctx.fillRect(-26, -54, 52, 1);
  ctx.fillRect(-26, -50, 52, 1);
}

function drawFlamencoDress(draw: DrawContext, appearance: CulturalAppearance): void {
  const { ctx } = draw;
  // 보디스 (상체)
  ctx.fillStyle = appearance.outfitPrimary;
  ctx.beginPath();
  ctx.moveTo(-20, -90);
  ctx.lineTo(20, -90);
  ctx.lineTo(22, -65);
  ctx.lineTo(-22, -65);
  ctx.closePath();
  ctx.fill();

  // 검정 네크라인 (오프숄더)
  ctx.fillStyle = appearance.outfitSecondary;
  ctx.beginPath();
  ctx.moveTo(-22, -90);
  ctx.lineTo(22, -90);
  ctx.lineTo(18, -87);
  ctx.lineTo(-18, -87);
  ctx.closePath();
  ctx.fill();

  // 스커트 (러플)
  ctx.fillStyle = appearance.outfitPrimary;
  ctx.beginPath();
  ctx.moveTo(-22, -65);
  ctx.lineTo(-34, -45);
  // 러플 디테일
  ctx.quadraticCurveTo(-30, -42, -28, -45);
  ctx.quadraticCurveTo(-24, -40, -20, -45);
  ctx.quadraticCurveTo(-16, -40, -12, -45);
  ctx.quadraticCurveTo(-8, -40, -4, -45);
  ctx.quadraticCurveTo(0, -40, 4, -45);
  ctx.quadraticCurveTo(8, -40, 12, -45);
  ctx.quadraticCurveTo(16, -40, 20, -45);
  ctx.quadraticCurveTo(24, -40, 28, -45);
  ctx.quadraticCurveTo(30, -42, 34, -45);
  ctx.lineTo(22, -65);
  ctx.closePath();
  ctx.fill();

  // 골드 시퀸 (장식)
  ctx.fillStyle = appearance.outfitAccent;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.arc(-14 + i * 4.5, -58, 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHanbok(draw: DrawContext, appearance: CulturalAppearance): void {
  const { ctx } = draw;
  // 치마 (긴 스커트) - 허리부터 발까지
  ctx.fillStyle = appearance.outfitPrimary;
  ctx.beginPath();
  ctx.moveTo(-18, -56);
  ctx.quadraticCurveTo(-32, -28, -34, -4);
  ctx.lineTo(34, -4);
  ctx.quadraticCurveTo(32, -28, 18, -56);
  ctx.closePath();
  ctx.fill();

  // 치마 라인
  ctx.strokeStyle = appearance.outfitSecondary;
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.4;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(-20 + i * 12, -50);
    ctx.lineTo(-22 + i * 12, -8);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // 저고리 (짧은 저킷)
  ctx.fillStyle = appearance.outfitSecondary;
  ctx.beginPath();
  ctx.moveTo(-22, -90);
  ctx.lineTo(22, -90);
  ctx.lineTo(20, -56);
  ctx.lineTo(-20, -56);
  ctx.closePath();
  ctx.fill();

  // 고름 (리본)
  ctx.fillStyle = appearance.outfitAccent;
  ctx.fillRect(-2, -82, 4, 32);
  ctx.beginPath();
  ctx.arc(0, -78, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -55, 3, 0, Math.PI * 2);
  ctx.fill();
}

// ===== Arms =====

function drawArms(
  draw: DrawContext,
  appearance: CulturalAppearance,
  leftAngle: number,
  rightAngle: number,
  leftLength: number,
  rightLength: number,
): void {
  drawArm(draw, appearance, -22, 10, leftAngle, leftLength);
  drawArm(draw, appearance, 22, 10, rightAngle, rightLength);
}

function drawArm(
  draw: DrawContext,
  appearance: CulturalAppearance,
  x: number,
  y: number,
  angle: number,
  length: number,
): void {
  const { ctx } = draw;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  // sleeve
  if (appearance.outfitType === 'kimono') {
    // 긴 기모노 소매 (직사각형)
    ctx.fillStyle = appearance.outfitPrimary;
    ctx.beginPath();
    ctx.roundRect(-6, 0, 12, 22 * length, 4);
    ctx.fill();
    // 소매 라인
    ctx.strokeStyle = appearance.outfitAccent;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-6, 8);
    ctx.lineTo(6, 8);
    ctx.stroke();
  } else if (appearance.outfitType === 'flamenco') {
    // 짧은 플라멩코 소매
    ctx.fillStyle = appearance.outfitPrimary;
    ctx.beginPath();
    ctx.roundRect(-5, 0, 10, 14 * length, 3);
    ctx.fill();
    // 러프
    ctx.beginPath();
    ctx.ellipse(0, 14 * length, 7, 2, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (appearance.outfitType === 'hanbok') {
    // 한복 저고리 소매 (좁고 긴)
    ctx.fillStyle = appearance.outfitSecondary;
    ctx.beginPath();
    ctx.roundRect(-4, 0, 8, 16 * length, 3);
    ctx.fill();
  } else {
    // western default
    ctx.fillStyle = appearance.outfitPrimary;
    ctx.beginPath();
    ctx.roundRect(-5, 0, 10, 18 * length, 4);
    ctx.fill();
  }
  // hand
  ctx.fillStyle = appearance.skinColor;
  ctx.beginPath();
  ctx.arc(0, (appearance.outfitType === 'flamenco' ? 14 : 18) * length + 4, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ===== Head & Hair =====

function drawHeadAndHair(draw: DrawContext, state: CharacterState, now: number): void {
  const headY = -110;
  drawHairBack(draw, state.appearance, headY);

  // neck
  draw.ctx.fillStyle = state.appearance.skinColor;
  draw.ctx.fillRect(-4, -95, 8, 8);

  // face
  draw.ctx.fillStyle = state.appearance.skinColor;
  draw.ctx.beginPath();
  draw.ctx.ellipse(0, headY + 4, 22, 24, 0, 0, Math.PI * 2);
  draw.ctx.fill();

  // hair front (different per style)
  drawHairFront(draw, state.appearance, headY);

  // earrings
  if (state.appearance.earrings) {
    drawEarring(draw, -22, headY + 8, state.appearance.outfitAccent);
    drawEarring(draw, 22, headY + 8, state.appearance.outfitAccent);
  }

  // headpiece
  if (state.appearance.headpiece) {
    drawHeadpiece(draw, state.appearance.headpiece, headY, state.appearance.hairOrnament?.color);
  }

  // hair ornament (clip/flower on head)
  if (state.appearance.hairOrnament && !state.appearance.headpiece) {
    drawHairFlower(draw, 18, headY - 10, state.appearance.hairOrnament.color);
  }

  // level-based crown (overrides if level 4)
  if (hasAccessory(state, 'crown')) {
    drawCrown(draw, 0, headY - 22);
  }

  drawEyes(draw, state, headY, now);
  drawCheeks(draw, state, headY);
  drawMouth(draw, state, headY, now);
}

function drawHairBack(draw: DrawContext, appearance: CulturalAppearance, headY: number): void {
  const { ctx } = draw;
  ctx.fillStyle = appearance.hairColor;
  // common back-of-head shape
  ctx.beginPath();
  ctx.ellipse(0, headY, 28, 32, 0, 0, Math.PI * 2);
  ctx.fill();

  switch (appearance.hairStyle) {
    case 'twin':
      ctx.beginPath();
      ctx.ellipse(-22, headY + 8, 8, 20, 0, 0, Math.PI * 2);
      ctx.ellipse(22, headY + 8, 8, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'hime':
      // 직선 사이드 록 (어깨까지)
      ctx.beginPath();
      ctx.ellipse(-22, headY + 15, 8, 30, 0, 0, Math.PI * 2);
      ctx.ellipse(22, headY + 15, 8, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'long-wavy':
      ctx.beginPath();
      ctx.moveTo(-25, headY);
      ctx.quadraticCurveTo(-30, headY + 20, -28, headY + 40);
      ctx.quadraticCurveTo(-15, headY + 50, 0, headY + 48);
      ctx.quadraticCurveTo(15, headY + 50, 28, headY + 40);
      ctx.quadraticCurveTo(30, headY + 20, 25, headY);
      ctx.closePath();
      ctx.fill();
      break;
    case 'long-straight':
      ctx.beginPath();
      ctx.moveTo(-25, headY);
      ctx.lineTo(-26, headY + 55);
      ctx.quadraticCurveTo(-20, headY + 58, -10, headY + 55);
      ctx.lineTo(-10, headY);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(10, headY);
      ctx.lineTo(10, headY + 55);
      ctx.quadraticCurveTo(20, headY + 58, 26, headY + 55);
      ctx.lineTo(25, headY);
      ctx.closePath();
      ctx.fill();
      break;
  }
}

function drawHairFront(draw: DrawContext, appearance: CulturalAppearance, headY: number): void {
  const { ctx } = draw;
  ctx.fillStyle = appearance.hairColor;
  switch (appearance.hairStyle) {
    case 'twin':
    case 'hime':
      ctx.beginPath();
      ctx.moveTo(-20, headY - 8);
      ctx.quadraticCurveTo(-10, headY - 18, 0, headY - 12);
      ctx.quadraticCurveTo(10, headY - 18, 20, headY - 8);
      ctx.quadraticCurveTo(18, headY - 6, 12, headY - 4);
      ctx.quadraticCurveTo(0, headY + 2, -12, headY - 4);
      ctx.quadraticCurveTo(-18, headY - 6, -20, headY - 8);
      ctx.closePath();
      ctx.fill();
      break;
    case 'long-wavy':
      // 가르마 + 웨이브 앞머리
      ctx.beginPath();
      ctx.moveTo(-22, headY - 10);
      ctx.quadraticCurveTo(-15, headY - 14, -8, headY - 4);
      ctx.lineTo(-2, headY - 8);
      ctx.lineTo(2, headY - 8);
      ctx.lineTo(8, headY - 4);
      ctx.quadraticCurveTo(15, headY - 14, 22, headY - 10);
      ctx.quadraticCurveTo(15, headY - 6, 5, headY);
      ctx.lineTo(-5, headY);
      ctx.quadraticCurveTo(-15, headY - 6, -22, headY - 10);
      ctx.closePath();
      ctx.fill();
      break;
    case 'long-straight':
      // 일자 앞머리
      ctx.beginPath();
      ctx.moveTo(-22, headY - 8);
      ctx.lineTo(22, headY - 8);
      ctx.lineTo(18, headY);
      ctx.lineTo(8, headY - 4);
      ctx.lineTo(0, headY);
      ctx.lineTo(-8, headY - 4);
      ctx.lineTo(-18, headY);
      ctx.closePath();
      ctx.fill();
      break;
  }
}

function drawEarring(draw: DrawContext, x: number, y: number, color: string): void {
  const { ctx } = draw;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x - 0.4, y, 0.8, 4);
  ctx.beginPath();
  ctx.arc(x, y + 5, 1.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawEyes(draw: DrawContext, state: CharacterState, headY: number, now: number): void {
  const { ctx } = draw;
  const appearance = state.appearance;
  const blink = state.pose === 'idle' && Math.sin(now / 1800) > 0.97;
  const eyeY = headY + 4;

  if (blink) {
    ctx.strokeStyle = appearance.eyeColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-12, eyeY);
    ctx.lineTo(-4, eyeY);
    ctx.moveTo(4, eyeY);
    ctx.lineTo(12, eyeY);
    ctx.stroke();
    return;
  }

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(-8, eyeY, 4, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(8, eyeY, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = appearance.eyeColor;
  if (state.mood === 'triumphant' || state.mood === 'excited') {
    ctx.beginPath();
    ctx.arc(-8, eyeY - 1, 2, 0, Math.PI * 2);
    ctx.arc(8, eyeY - 1, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-7, eyeY - 2, 0.8, 0, Math.PI * 2);
    ctx.arc(9, eyeY - 2, 0.8, 0, Math.PI * 2);
    ctx.fill();
  } else if (state.mood === 'happy') {
    ctx.strokeStyle = appearance.eyeColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(-8, eyeY, 3, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.arc(8, eyeY, 3, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(-8, eyeY, 2, 0, Math.PI * 2);
    ctx.arc(8, eyeY, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCheeks(draw: DrawContext, state: CharacterState, headY: number): void {
  const { ctx } = draw;
  const alpha = state.mood === 'neutral' ? 0.3 : 0.7;
  ctx.fillStyle = state.appearance.cheekColor;
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.ellipse(-12, headY + 8, 4, 2.5, 0, 0, Math.PI * 2);
  ctx.ellipse(12, headY + 8, 4, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawMouth(draw: DrawContext, state: CharacterState, headY: number, now: number): void {
  const { ctx } = draw;
  const mouthY = headY + 14;
  const speechAge = now - state.speechStart;
  const speaking = speechAge < 600;

  ctx.strokeStyle = state.appearance.eyeColor;
  ctx.fillStyle = '#d9506e';
  ctx.lineWidth = 1.5;

  if (speaking) {
    const open = Math.abs(Math.sin(speechAge / 60)) * 0.5 + 0.5;
    const w = 6;
    const h = 4 * open;
    ctx.beginPath();
    ctx.ellipse(0, mouthY, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (state.mood === 'triumphant' || state.mood === 'excited') {
    ctx.beginPath();
    ctx.arc(0, mouthY - 1, 6, 0, Math.PI);
    ctx.fill();
    ctx.stroke();
  } else if (state.mood === 'happy' || state.mood === 'smile') {
    ctx.beginPath();
    ctx.arc(0, mouthY - 3, 5, 0.2, Math.PI - 0.2);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(-3, mouthY);
    ctx.lineTo(3, mouthY);
    ctx.stroke();
  }
}

// ===== Headpieces =====

function drawHeadpiece(
  draw: DrawContext,
  headpiece: NonNullable<CulturalAppearance['headpiece']>,
  headY: number,
  ornamentColor?: string,
): void {
  switch (headpiece) {
    case 'kanzashi':
      drawKanzashi(draw, headY);
      break;
    case 'mantilla':
      drawMantilla(draw, headY);
      break;
    case 'binyeo':
      drawBinyeo(draw, headY);
      break;
    case 'flower':
      if (ornamentColor) drawHairFlower(draw, 20, headY - 8, ornamentColor);
      break;
  }
}

function drawKanzashi(draw: DrawContext, headY: number): void {
  const { ctx } = draw;
  // 기다란 꽂이 장식
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(18, headY - 14, 2, 32);
  // 꽃 장식
  const flowerColor = '#ff6b9d';
  ctx.fillStyle = flowerColor;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(19 + Math.cos(a) * 3, headY - 14 + Math.sin(a) * 3, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(19, headY - 14, 1.5, 0, Math.PI * 2);
  ctx.fill();
  // 추가 작은 꽂이
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(-20, headY - 8, 1.5, 18);
  ctx.fillStyle = '#5b9bd5';
  ctx.beginPath();
  ctx.arc(-19, headY - 8, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawMantilla(draw: DrawContext, headY: number): void {
  const { ctx } = draw;
  // 만티야 (검은 레이스 베일)
  ctx.fillStyle = 'rgba(20, 20, 30, 0.7)';
  ctx.beginPath();
  ctx.ellipse(0, headY - 4, 32, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  // 레이스 패턴 (호)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.arc(0, headY - 4, 8 + i * 4, 0, Math.PI);
    ctx.stroke();
  }
  // 작은 꽃 장식 (peineta)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-12, headY - 16, 2, 0, Math.PI * 2);
  ctx.arc(12, headY - 16, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawBinyeo(draw: DrawContext, headY: number): void {
  const { ctx } = draw;
  // 비녀 (긴 머리핀)
  ctx.fillStyle = '#c0c0c0';
  ctx.fillRect(14, headY - 10, 1.5, 32);
  // 머리 부분 장식
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(15, headY - 10, 2.5, 0, Math.PI * 2);
  ctx.fill();
  // 술
  ctx.fillStyle = '#ff6b9d';
  ctx.beginPath();
  ctx.arc(15, headY + 22, 2, 0, Math.PI * 2);
  ctx.fill();
  // 술 라인
  ctx.strokeStyle = '#ff6b9d';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(15, headY + 22);
  ctx.lineTo(15, headY + 30);
  ctx.stroke();
}

function drawHairFlower(draw: DrawContext, x: number, y: number, color: string): void {
  const { ctx } = draw;
  ctx.fillStyle = color;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * 3, y + Math.sin(a) * 3, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(x, y, 1.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawCrown(draw: DrawContext, x: number, y: number): void {
  const { ctx } = draw;
  ctx.fillStyle = '#ffd700';
  ctx.strokeStyle = '#ffaa00';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 12, y);
  ctx.lineTo(x - 10, y - 8);
  ctx.lineTo(x - 5, y - 3);
  ctx.lineTo(x, y - 10);
  ctx.lineTo(x + 5, y - 3);
  ctx.lineTo(x + 10, y - 8);
  ctx.lineTo(x + 12, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#ff4757';
  ctx.beginPath();
  ctx.arc(x, y - 5, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawAura(draw: DrawContext, cx: number, cy: number, now: number): void {
  const { ctx } = draw;
  const t = now / 1000;
  ctx.save();
  for (let i = 0; i < 3; i++) {
    const radius = 80 + i * 12 + Math.sin(t * 2 + i) * 4;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, `rgba(255, 215, 0, ${0.18 - i * 0.04})`);
    grad.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawSparkles(draw: DrawContext, cx: number, cy: number, now: number): void {
  const { ctx } = draw;
  ctx.fillStyle = '#ffd700';
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + now / 600;
    const r = 70 + Math.sin(now / 300 + i) * 5;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    const size = 2 + Math.sin(now / 200 + i) * 1;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(now / 500 + i);
    ctx.beginPath();
    for (let j = 0; j < 4; j++) {
      const a = (j / 4) * Math.PI * 2;
      ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size);
      ctx.lineTo(Math.cos(a + Math.PI / 4) * (size / 3), Math.sin(a + Math.PI / 4) * (size / 3));
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// ===== Background =====

export function renderBackground(
  ctx: CanvasRenderingContext2D,
  state: CharacterState,
  width: number,
  height: number,
  now: number,
): void {
  const bg = state.stage.background;
  if (bg === 'plain') return;

  let topColor: string;
  let bottomColor: string;
  switch (bg) {
    case 'sunset':
      topColor = 'rgba(255, 154, 158, 0.12)';
      bottomColor = 'rgba(254, 207, 239, 0.04)';
      break;
    case 'sakura':
      topColor = 'rgba(255, 183, 197, 0.15)';
      bottomColor = 'rgba(255, 230, 235, 0.05)';
      break;
    case 'starry':
      topColor = 'rgba(40, 60, 120, 0.18)';
      bottomColor = 'rgba(20, 30, 80, 0.04)';
      break;
    case 'festival':
      topColor = 'rgba(255, 220, 130, 0.15)';
      bottomColor = 'rgba(255, 180, 100, 0.05)';
      break;
    default:
      return;
  }

  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, topColor);
  grad.addColorStop(1, bottomColor);
  ctx.save();
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  if (bg === 'sakura') {
    drawSakuraPetals(ctx, width, height, now);
  } else if (bg === 'starry') {
    drawStars(ctx, width, height, now);
  } else if (bg === 'festival') {
    drawLanternsInSky(ctx, width, now);
  } else if (bg === 'sunset') {
    drawSunsetGlow(ctx, width, height);
  }
  ctx.restore();
}

function drawSakuraPetals(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  now: number,
): void {
  ctx.fillStyle = 'rgba(255, 183, 197, 0.6)';
  for (let i = 0; i < 20; i++) {
    const seed = i * 137;
    const x = (seed * 53 + now / 30) % width;
    const y = ((seed * 97 + now / 50) % (height + 100)) - 50;
    const angle = now / 1000 + i;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawStars(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  now: number,
): void {
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 60; i++) {
    const seed = i * 73;
    const x = (seed * 31) % width;
    const y = (seed * 17) % (height * 0.7);
    const twinkle = Math.sin(now / 300 + i) * 0.5 + 0.5;
    ctx.globalAlpha = 0.4 + twinkle * 0.6;
    ctx.beginPath();
    ctx.arc(x, y, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawLanternsInSky(
  ctx: CanvasRenderingContext2D,
  width: number,
  now: number,
): void {
  for (let i = 0; i < 8; i++) {
    const x = ((i + 1) * width) / 9;
    const y = 40 + Math.sin(now / 800 + i) * 4;
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.ellipse(x, y, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(x - 2, y - 14, 4, 2);
    ctx.fillRect(x - 2, y + 12, 4, 2);
    ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSunsetGlow(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const grad = ctx.createRadialGradient(width / 2, height / 3, 0, width / 2, height / 3, 500);
  grad.addColorStop(0, 'rgba(255, 200, 150, 0.18)');
  grad.addColorStop(1, 'rgba(255, 200, 150, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

// ===== Props =====

export function renderProps(
  ctx: CanvasRenderingContext2D,
  state: CharacterState,
  characterCx: number,
  groundY: number,
  now: number,
): void {
  if (hasProp(state, 'flowerpot')) {
    drawFlowerPot(ctx, characterCx - 110, groundY, now);
  }
  if (hasProp(state, 'book')) {
    drawBook(ctx, characterCx + 110, groundY);
  }
  if (hasProp(state, 'lantern')) {
    drawGroundLantern(ctx, characterCx - 80, groundY - 60, now);
  }
  if (hasProp(state, 'cat')) {
    drawCat(ctx, characterCx + 130, groundY, now);
  }
}

function drawFlowerPot(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  now: number,
): void {
  ctx.fillStyle = '#8b4513';
  ctx.beginPath();
  ctx.moveTo(x - 12, groundY);
  ctx.lineTo(x + 12, groundY);
  ctx.lineTo(x + 8, groundY - 18);
  ctx.lineTo(x - 8, groundY - 18);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3aa15c';
  const sway = Math.sin(now / 600) * 2;
  ctx.beginPath();
  ctx.ellipse(x, groundY - 24 + sway, 12, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x - 6, groundY - 26, 4, 8, -0.3, 0, Math.PI * 2);
  ctx.ellipse(x + 6, groundY - 26, 4, 8, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ff6b9d';
  ctx.beginPath();
  ctx.arc(x, groundY - 30, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawBook(ctx: CanvasRenderingContext2D, x: number, groundY: number): void {
  ctx.fillStyle = '#5b3a8c';
  ctx.fillRect(x - 14, groundY - 8, 28, 6);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 14, groundY - 7, 28, 1);
  ctx.fillStyle = '#3a3a55';
  ctx.fillRect(x - 14, groundY - 3, 28, 1);
}

function drawGroundLantern(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  now: number,
): void {
  ctx.fillStyle = '#5b3a1a';
  ctx.fillRect(x - 1, y, 2, 20);
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.ellipse(x, y, 8, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffaa00';
  ctx.strokeStyle = '#5b3a1a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(x, y, 8, 10, 0, 0, Math.PI * 2);
  ctx.stroke();
  const flicker = 0.7 + Math.sin(now / 100) * 0.3;
  ctx.fillStyle = `rgba(255, 215, 0, ${0.2 * flicker})`;
  ctx.beginPath();
  ctx.arc(x, y, 28, 0, Math.PI * 2);
  ctx.fill();
}

function drawCat(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  now: number,
): void {
  ctx.fillStyle = '#ff9eb5';
  ctx.beginPath();
  ctx.ellipse(x, groundY - 6, 14, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 10, groundY - 10, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 5, groundY - 14);
  ctx.lineTo(x + 7, groundY - 19);
  ctx.lineTo(x + 10, groundY - 14);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 10, groundY - 14);
  ctx.lineTo(x + 13, groundY - 19);
  ctx.lineTo(x + 15, groundY - 14);
  ctx.fill();
  ctx.fillStyle = '#2c2c2c';
  ctx.beginPath();
  ctx.arc(x + 8, groundY - 10, 0.8, 0, Math.PI * 2);
  ctx.arc(x + 13, groundY - 10, 0.8, 0, Math.PI * 2);
  ctx.fill();
  const tailWag = Math.sin(now / 200) * 0.4;
  ctx.strokeStyle = '#ff9eb5';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 12, groundY - 6);
  ctx.quadraticCurveTo(x - 20, groundY - 16 + tailWag * 5, x - 18, groundY - 22);
  ctx.stroke();
}

// ===== External Image Rendering =====

/**
 * Render character using external images (anime, photos, etc.)
 */
function renderCharacterImage(
  ctx: CanvasRenderingContext2D,
  state: CharacterState,
  cx: number,
  groundY: number,
  now: number,
): void {
  // 현재 선택된 캐릭터 사용 (수동 선택 우선)
  // If no manual selection, fallback to language default
  // (Random selection is handled at stage entry via selectCharacterForStage)
  const characterId = getCurrentCharacter() || getCharacterForLanguage(state.language);
  const characterSet = CHARACTER_IMAGES[characterId];
  
  if (!characterSet) {
    console.warn(`[CharacterRenderer] Character set not found: ${characterId}`);
    // Fallback to primitive rendering
    renderCharacterPrimitive(ctx, state, cx, groundY, now);
    return;
  }

  // Get image config for current pose
  const imageConfig = characterSet[state.pose] || characterSet.idle;
  const loadedImage = ImageLoader.get(imageConfig.src);

  // On-demand load if not yet preloaded (Phase E fix: random selection
  // may pick characters that weren't in the initial preload batch)
  if (!loadedImage) {
    ImageLoader.load(imageConfig).catch(() => {
      // Silent failure — placeholder shown below
    });
  }

  if (!loadedImage || !loadedImage.loaded) {
    // Image not loaded yet, show placeholder or fallback
    renderCharacterPlaceholder(ctx, cx, groundY);
    return;
  }

  // Calculate position with pose animations
  let offsetY = 0;
  let offsetX = 0;
  const rotation = 0;
  let scale = imageConfig.scale || 1.0;
  let scaleX = 1.0; // Horizontal scale for flip effects

  switch (state.pose) {
    case 'idle':
      // Gentle breathing animation
      offsetY = Math.sin(now / 600) * 3;
      break;
    case 'wave':
      // Slight bounce while waving
      const waveT = (now - state.poseStart) / 900;
      offsetY = Math.sin(waveT * Math.PI) * -5;
      break;
    case 'jump':
      // Jump arc
      const jumpT = (now - state.poseStart) / 700;
      const arc = Math.sin(jumpT * Math.PI);
      offsetY = -arc * 40;
      break;
    case 'clap':
      // Small bounce
      const clapT = (now - state.poseStart) / 600;
      offsetY = Math.sin(clapT * Math.PI * 2) * -5;
      break;
    case 'spin':
      // Horizontal flip animation (left-right spin effect)
      // Instead of rotating the image, we scale X from 1 → -1 → 1
      // This creates a natural "character spinning" effect
      const spinT = (now - state.poseStart) / 800;
      const spinCycle = Math.sin(spinT * Math.PI * 2); // -1 to 1
      scaleX = spinCycle; // Flip horizontally as we go
      offsetY = Math.sin(spinT * Math.PI) * -10; // Keep bounce
      break;
    case 'dance':
      // Dancing motion
      const danceT = (now - state.poseStart) / 1200;
      offsetY = Math.sin(danceT * Math.PI * 4) * -8;
      offsetX = Math.cos(danceT * Math.PI * 2) * 5;
      break;
    case 'pose':
      // Triumphant pose with slight scale up
      scale *= 1.05;
      break;
  }

  // Apply config offsets
  offsetX += imageConfig.offsetX || 0;
  offsetY += imageConfig.offsetY || 0;

  // Draw the image with optional frame
  ctx.save();
  ctx.translate(cx + offsetX, groundY + offsetY);
  ctx.rotate(rotation);
  ctx.scale(scaleX, 1); // Apply horizontal flip for spin effect

  const drawWidth = imageConfig.width * scale;
  const drawHeight = imageConfig.height * scale;

  // Frame styling (optional, can be toggled)
  const useFrame = true; // Set to false to disable frame
  const frameRadius = 15;
  const framePadding = 8;
  
  if (useFrame) {
    // Draw frame background with subtle shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.roundRect(
      -drawWidth / 2 - framePadding,
      -drawHeight - framePadding,
      drawWidth + framePadding * 2,
      drawHeight + framePadding * 2,
      frameRadius
    );
    ctx.fill();
    ctx.restore();
    
    // Clip to rounded rectangle
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(
      -drawWidth / 2,
      -drawHeight,
      drawWidth,
      drawHeight,
      frameRadius - framePadding
    );
    ctx.clip();
  }

  // Handle sprite sheets (multiple frames)
  if (imageConfig.frames && imageConfig.frames > 1) {
    const frameDuration = imageConfig.frameDuration || 200;
    const currentFrame = Math.floor((now / frameDuration) % imageConfig.frames);
    const frameWidth = loadedImage.element.width / imageConfig.frames;
    const frameHeight = loadedImage.element.height;

    ctx.drawImage(
      loadedImage.element,
      currentFrame * frameWidth, // source x
      0, // source y
      frameWidth, // source width
      frameHeight, // source height
      -drawWidth / 2, // dest x (centered)
      -drawHeight, // dest y (bottom aligned)
      drawWidth, // dest width
      drawHeight // dest height
    );
  } else {
    // Single image
    ctx.drawImage(
      loadedImage.element,
      -drawWidth / 2, // centered x
      -drawHeight, // bottom aligned y
      drawWidth,
      drawHeight
    );
  }

  if (useFrame) {
    ctx.restore(); // Restore from clip
    
    // Draw frame border with glow effect
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(0, 217, 255, 0.6)';
    ctx.shadowBlur = 10;
    
    ctx.beginPath();
    ctx.roundRect(
      -drawWidth / 2,
      -drawHeight,
      drawWidth,
      drawHeight,
      frameRadius - framePadding
    );
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Fallback placeholder when image is loading
 */
function renderCharacterPlaceholder(
  ctx: CanvasRenderingContext2D,
  cx: number,
  groundY: number,
): void {
  ctx.save();
  
  // Draw simple loading indicator
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(cx - 50, groundY - 150, 100, 150);
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(cx - 50, groundY - 150, 100, 150);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = '14px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Loading...', cx, groundY - 75);
  
  ctx.restore();
}

/**
 * Original primitive rendering (extracted for fallback)
 */
/**
 * Export primitive rendering for external use (e.g., CharacterSelect preview)
 */
export function renderCharacterPrimitive(
  ctx: CanvasRenderingContext2D,
  state: CharacterState,
  cx: number,
  groundY: number,
  now: number,
): void {
  // Original primitive rendering
  const draw: DrawContext = { ctx, now };

  const breathing = state.pose === 'idle' ? Math.sin(now / 600) * 1.5 : 0;

  let bodyOffsetY = breathing;
  let bodyScaleY = 1;
  let bodyRotation = 0;
  let armLeftAngle = 0;
  let armRightAngle = 0;
  const armLeftLength = 1;
  const armRightLength = 1;
  let legSpread = 0;

  switch (state.pose) {
    case 'idle':
      armLeftAngle = Math.sin(now / 1100) * 0.05;
      armRightAngle = Math.sin(now / 1100 + Math.PI) * 0.05;
      break;
    case 'wave': {
      const t = (now - state.poseStart) / 900;
      const phase = Math.sin(t * Math.PI * 4);
      armRightAngle = -1.2 + phase * 0.3;
      armLeftAngle = 0.1;
      bodyOffsetY += Math.sin(t * Math.PI) * -3;
      break;
    }
    case 'jump': {
      const t = (now - state.poseStart) / 700;
      const arc = Math.sin(t * Math.PI);
      bodyOffsetY -= arc * 30;
      armLeftAngle = -1.8;
      armRightAngle = -1.8;
      legSpread = 0.3;
      break;
    }
    case 'clap': {
      const t = (now - state.poseStart) / 800;
      const phase = Math.sin(t * Math.PI * 6);
      armLeftAngle = -1.0 + phase * 0.15;
      armRightAngle = -1.0 - phase * 0.15;
      bodyOffsetY += Math.sin(t * Math.PI) * -2;
      break;
    }
    case 'spin': {
      const t = (now - state.poseStart) / 1400;
      bodyRotation = t * Math.PI * 2;
      armLeftAngle = -Math.PI / 2;
      armRightAngle = -Math.PI / 2;
      bodyScaleY = 1 + Math.sin(t * Math.PI * 2) * 0.05;
      break;
    }
    case 'dance': {
      const t = (now - state.poseStart) / 3000;
      const beat = Math.sin(t * Math.PI * 4);
      bodyOffsetY += Math.abs(beat) * -10;
      armLeftAngle = -1.4 + beat * 0.4;
      armRightAngle = -1.4 - beat * 0.4;
      legSpread = beat * 0.2;
      bodyRotation = Math.sin(t * Math.PI * 2) * 0.1;
      break;
    }
    case 'pose': {
      const t = (now - state.poseStart) / 1800;
      armRightAngle = -1.4;
      armLeftAngle = -0.3;
      bodyRotation = Math.sin(t * Math.PI) * 0.05;
      break;
    }
  }

  if (state.mood === 'triumphant' || state.pose === 'dance') {
    drawAura(draw, cx, groundY - 130, now);
  }
  if (state.mood === 'excited') {
    drawSparkles(draw, cx, groundY - 120, now);
  }

  ctx.save();
  ctx.translate(cx, groundY);
  ctx.rotate(bodyRotation);
  ctx.translate(0, bodyOffsetY);
  ctx.scale(1, bodyScaleY);

  drawLegs(draw, state.appearance, legSpread);
  drawOutfit(draw, state.appearance);
  drawArms(draw, state.appearance, armLeftAngle, armRightAngle, armLeftLength, armRightLength);
  drawHeadAndHair(draw, state, now);

  ctx.restore();
}