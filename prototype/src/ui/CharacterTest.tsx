import { useEffect, useRef, useState } from 'react';
import { Keyboard } from '../engine/Keyboard.js';
import {
  createInitialCharacterState,
  tickPose,
  applyCorrectKeystroke,
  resetForNewStage,
  type CharacterState,
} from '../character/CharacterController.js';
import {
  renderBackground,
  renderCharacter,
  renderProps,
} from '../character/CharacterRenderer.js';
import { GraphicsConfig } from '../config/graphics.js';
import type { PoseName } from '../character/CharacterData.js';
import { setCharacter } from '../character/CharacterSelector.js';
import { CHARACTER_INFO, CHARACTER_IMAGES } from '../config/characterImages.js';
import { ImageLoader } from '../sprites/ImageLoader.js';

interface CharacterTestProps {
  onBack: () => void;
}

export function CharacterTest({ onBack }: CharacterTestProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keyboardRef = useRef<Keyboard | null>(null);
  const characterRef = useRef<CharacterState>(createInitialCharacterState());
  const animationFrameRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);

  const [useSprites, setUseSprites] = useState(true); // Start with sprites enabled
  const [currentPose, setCurrentPose] = useState<PoseName>('idle');
  const [showKeyboard, setShowKeyboard] = useState(false); // Hide keyboard by default
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [currentCharacter, setCurrentCharacter] = useState<string>('en-emily'); // Emily or Oliver
  
  // Current character info
  const characterInfo = CHARACTER_INFO[currentCharacter];

  useEffect(() => {
    // Set current character for testing
    setCharacter(currentCharacter);
    
    // IMPORTANT: Update characterRef to use the new character
    // This forces the renderer to use the new character's images
    characterRef.current = createInitialCharacterState();
    console.log(`[CharacterTest] Character state reset for: ${currentCharacter}`);
    
    // Preload character images immediately
    const characterImages = CHARACTER_IMAGES[currentCharacter];
    if (characterImages) {
      const imagesToLoad = Object.values(characterImages);
      console.log(`[CharacterTest] Preloading ${currentCharacter} images:`, imagesToLoad.length);
      console.log('[CharacterTest] Image paths:', imagesToLoad.map(img => img.src));
      
      setImagesLoaded(false);
      setLoadingError(null);
      
      ImageLoader.preload(imagesToLoad)
        .then(() => {
          console.log(`[CharacterTest] ${currentCharacter} images loaded successfully!`);
          setImagesLoaded(true);
          setLoadingError(null);
        })
        .catch(err => {
          console.error(`[CharacterTest] Failed to load ${currentCharacter} images:`, err);
          setLoadingError(err.message || 'Failed to load images');
          setImagesLoaded(false);
        });
    } else {
      setLoadingError(`${currentCharacter} images not found in config`);
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize keyboard
    keyboardRef.current = new Keyboard('en', 32, 610, 60, 50, 4);

    // Render loop
    const render = (timestamp: number) => {
      const dt = timestamp - lastTickRef.current;
      lastTickRef.current = timestamp;

      // Update character pose timer
      tickPose(characterRef.current, dt);

      // Clear canvas
      ctx.fillStyle = '#0a0a14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render background
      renderBackground(ctx, characterRef.current, canvas.width, canvas.height, timestamp);

      // Render character (positioned lower for better visibility)
      const cx = canvas.width / 2;
      const cy = canvas.height * 0.65; // Move down to 65% of canvas height
      
      // Temporarily override USE_SPRITES for testing
      const originalUseSprites = GraphicsConfig.USE_SPRITES;
      GraphicsConfig.USE_SPRITES = useSprites;
      
      renderCharacter(ctx, characterRef.current, cx, cy, timestamp);
      renderProps(ctx, characterRef.current, cx, cy, timestamp);
      
      // Restore original setting
      GraphicsConfig.USE_SPRITES = originalUseSprites;

      // Render keyboard
      if (showKeyboard && keyboardRef.current) {
        keyboardRef.current.update();
        keyboardRef.current.render(ctx);
      }

      // Render UI
      renderUI(ctx, canvas.width, canvas.height);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [useSprites, showKeyboard, currentCharacter]);

  // Update pose when selection changes
  useEffect(() => {
    characterRef.current.pose = currentPose;
    characterRef.current.poseStart = performance.now();
  }, [currentPose]);

  const renderUI = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('캐릭터 이미지 테스트', width / 2, 40);

    // Character name
    ctx.fillStyle = '#00d9ff';
    ctx.font = '16px -apple-system, sans-serif';
    ctx.fillText(`${characterInfo.name} (${characterInfo.description})`, width / 2, 70);

    // Current pose info
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 18px -apple-system, sans-serif';
    ctx.fillText(`현재 포즈: ${getPoseLabel(currentPose)}`, width / 2, height - 80);

    // Loading status
    if (loadingError) {
      ctx.fillStyle = '#ff4444';
      ctx.font = '14px -apple-system, sans-serif';
      ctx.fillText(`⚠️ 로딩 오류: ${loadingError}`, width / 2, height - 60);
    } else if (!imagesLoaded) {
      ctx.fillStyle = '#ffaa00';
      ctx.font = '14px -apple-system, sans-serif';
      ctx.fillText('🔄 이미지 로딩 중...', width / 2, height - 60);
    } else {
      ctx.fillStyle = '#00ff88';
      ctx.font = '14px -apple-system, sans-serif';
      ctx.fillText('✅ 이미지 로딩 완료!', width / 2, height - 60);
    }

    // Image status
    ctx.fillStyle = '#ffaa00';
    ctx.font = '14px -apple-system, sans-serif';
    ctx.fillText('AI 생성 이미지 (1024×1536 PNG)', width / 2, height - 40);

    // Sprite mode info
    ctx.fillStyle = useSprites ? '#00ff88' : '#ff6b9d';
    ctx.fillText(
      `렌더링: ${useSprites ? 'Emily AI 이미지 (7/7)' : '프리미티브 (개발용)'}`,
      width / 2,
      height - 15
    );
  };

  const getPoseLabel = (pose: PoseName): string => {
    switch (pose) {
      case 'idle':
        return '대기 (Idle)';
      case 'wave':
        return '손 흔들기 (Wave)';
      case 'jump':
        return '점프 (Jump)';
      case 'clap':
        return '박수 (Clap)';
      case 'spin':
        return '회전 (Spin)';
      case 'dance':
        return '춤 (Dance)';
      case 'pose':
        return '포즈 (Pose)';
      default:
        return pose;
    }
  };

  const triggerPose = (pose: PoseName) => {
    setCurrentPose(pose);
    const now = performance.now();
    
    // Also trigger the actual state change for animations
    switch (pose) {
      case 'wave':
      case 'jump':
      case 'clap':
      case 'spin':
      case 'dance':
      case 'pose':
        applyCorrectKeystroke(characterRef.current, now);
        break;
      case 'idle':
      default:
        resetForNewStage(characterRef.current);
        break;
    }
  };

  return (
    <div className="character-test-screen">
      <canvas
        ref={canvasRef}
        width={1024}
        height={640}
        style={{
          display: 'block',
          margin: '0 auto',
          background: '#0a0a14',
          maxWidth: '100%',
          height: 'auto',
        }}
      />
      
      <div className="character-test-controls">
        <div className="control-group">
          <h3>English 캐릭터 (EN)</h3>
          <div className="button-group" role="group" aria-label="English character selection">
            <button
              className={currentCharacter === 'en-emily' ? 'active' : ''}
              onClick={() => setCurrentCharacter('en-emily')}
              style={{ background: currentCharacter === 'en-emily' ? '#00d9ff' : undefined }}
              aria-label="Emily (English character, 7 of 7 images complete)"
              aria-pressed={currentCharacter === 'en-emily'}
            >
              👧 Emily (완료 7/7)
            </button>
            <button
              className={currentCharacter === 'en-oliver' ? 'active' : ''}
              onClick={() => setCurrentCharacter('en-oliver')}
              style={{ background: currentCharacter === 'en-oliver' ? '#00d9ff' : undefined }}
              aria-label="Oliver (English character, 7 of 7 images complete)"
              aria-pressed={currentCharacter === 'en-oliver'}
            >
              👦 Oliver (완료 7/7)
            </button>
            <button
              className={currentCharacter === 'en-sophia' ? 'active' : ''}
              onClick={() => setCurrentCharacter('en-sophia')}
              style={{ background: currentCharacter === 'en-sophia' ? '#00d9ff' : undefined }}
              aria-label="Sophia (English character, 7 of 7 images complete)"
              aria-pressed={currentCharacter === 'en-sophia'}
            >
              👩 Sophia (완료 7/7)
            </button>
          </div>
        </div>

        <div className="control-group">
          <h3>Spanish 캐릭터 (ES) - Sophia placeholder</h3>
          <div className="button-group" role="group" aria-label="Spanish character selection">
            <button
              className={currentCharacter === 'es-isabella' ? 'active' : ''}
              onClick={() => setCurrentCharacter('es-isabella')}
              style={{ background: currentCharacter === 'es-isabella' ? '#f59e0b' : undefined }}
              aria-label="Isabella (Spanish character, placeholder)"
              aria-pressed={currentCharacter === 'es-isabella'}
            >
              💃 Isabella (placeholder)
            </button>
            <button
              className={currentCharacter === 'es-carlos' ? 'active' : ''}
              onClick={() => setCurrentCharacter('es-carlos')}
              style={{ background: currentCharacter === 'es-carlos' ? '#f59e0b' : undefined }}
              aria-label="Carlos (Spanish character, placeholder)"
              aria-pressed={currentCharacter === 'es-carlos'}
            >
              🧑 Carlos (placeholder)
            </button>
            <button
              className={currentCharacter === 'es-luna' ? 'active' : ''}
              onClick={() => setCurrentCharacter('es-luna')}
              style={{ background: currentCharacter === 'es-luna' ? '#f59e0b' : undefined }}
              aria-label="Luna (Spanish character, placeholder)"
              aria-pressed={currentCharacter === 'es-luna'}
            >
              🎨 Luna (placeholder)
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
            ⚠️ ES 캐릭터는 Sophia 이미지를 placeholder로 사용 중. 실제 이미지 생성 후 교체 예정.
          </p>
        </div>

        <div className="control-group">
          <h3>{characterInfo.name}의 7가지 포즈</h3>
          <div className="button-group" role="group" aria-label="Pose selection">
            <button
              className={currentPose === 'idle' ? 'active' : ''}
              onClick={() => triggerPose('idle')}
              title="1-idle.png"
              aria-label="Pose 1: idle (1-idle.png)"
              aria-pressed={currentPose === 'idle'}
            >
              1️⃣ 대기 (Idle)
            </button>
            <button
              className={currentPose === 'wave' ? 'active' : ''}
              onClick={() => triggerPose('wave')}
              title="2-wave.png"
              aria-label="Pose 2: wave (2-wave.png)"
              aria-pressed={currentPose === 'wave'}
            >
              2️⃣ 손 흔들기 (Wave)
            </button>
            <button
              className={currentPose === 'jump' ? 'active' : ''}
              onClick={() => triggerPose('jump')}
              title="3-jump.png"
              aria-label="Pose 3: jump (3-jump.png)"
              aria-pressed={currentPose === 'jump'}
            >
              3️⃣ 점프 (Jump)
            </button>
            <button
              className={currentPose === 'clap' ? 'active' : ''}
              onClick={() => triggerPose('clap')}
              title="4-clap.png"
              aria-label="Pose 4: clap (4-clap.png)"
              aria-pressed={currentPose === 'clap'}
            >
              4️⃣ 박수 (Clap)
            </button>
            <button
              className={currentPose === 'spin' ? 'active' : ''}
              onClick={() => triggerPose('spin')}
              title="5-spin.png"
              aria-label="Pose 5: spin (5-spin.png)"
              aria-pressed={currentPose === 'spin'}
            >
              5️⃣ 회전 (Spin)
            </button>
            <button
              className={currentPose === 'dance' ? 'active' : ''}
              onClick={() => triggerPose('dance')}
              title="6-dance.png"
              aria-label="Pose 6: dance (6-dance.png)"
              aria-pressed={currentPose === 'dance'}
            >
              6️⃣ 춤 (Dance)
            </button>
            <button
              className={currentPose === 'pose' ? 'active' : ''}
              onClick={() => triggerPose('pose')}
              title="7-pose.png"
              aria-label="Pose 7: pose (7-pose.png)"
              aria-pressed={currentPose === 'pose'}
            >
              7️⃣ 포즈 (Pose)
            </button>
          </div>
        </div>

        <div className="control-group">
          <h3>렌더링 모드</h3>
          <div className="button-group" role="group" aria-label="Render mode selection">
            <button
              className={useSprites ? 'active' : ''}
              onClick={() => setUseSprites(true)}
              style={{ background: useSprites ? '#00ff88' : undefined }}
              aria-label="AI image rendering mode"
              aria-pressed={useSprites}
            >
              ✅ AI 이미지
            </button>
            <button
              className={!useSprites ? 'active' : ''}
              onClick={() => setUseSprites(false)}
              aria-label="Primitive render mode (for comparison)"
              aria-pressed={!useSprites}
            >
              🎨 프리미티브 (비교용)
            </button>
          </div>
          <label style={{ display: 'block', marginTop: '10px' }}>
            <input
              type="checkbox"
              checked={showKeyboard}
              onChange={(e) => setShowKeyboard(e.target.checked)}
              aria-label="Show keyboard overlay"
            />
            키보드 표시
          </label>
        </div>

        <div className="control-group">
          {/* Phase 31: bare aria-label on the back button so keyboard users
              tabbing past the 16+ control buttons get a meaningful target name
              (the emoji-only text was the only label before). */}
          <button className="back-button" onClick={onBack} aria-label="Back to menu">
            ← 메뉴로 돌아가기
          </button>
        </div>
      </div>

      <div className="character-test-info">
        <h3>Emily AI 생성 이미지 (7/7 완성!)</h3>
        <ul>
          <li><strong>1️⃣ 대기 (Idle):</strong> 1-idle.png - 기본 서 있는 자세 (2.6MB)</li>
          <li><strong>2️⃣ 손 흔들기 (Wave):</strong> 2-wave.png - 반갑게 인사하는 모습 (1.8MB)</li>
          <li><strong>3️⃣ 점프 (Jump):</strong> 3-jump.png - 신나게 점프하는 모습 (1.6MB)</li>
          <li><strong>4️⃣ 박수 (Clap):</strong> 4-clap.png - 기쁘게 박수치는 모습 (1.8MB)</li>
          <li><strong>5️⃣ 회전 (Spin):</strong> 5-spin.png - 빙글빙글 도는 모습 (2.8MB)</li>
          <li><strong>6️⃣ 춤 (Dance):</strong> 6-dance.png - 춤추는 모습 (2.9MB)</li>
          <li><strong>7️⃣ 포즈 (Pose):</strong> 7-pose.png - 승리 포즈 (1.7MB)</li>
        </ul>

        <h3>이미지 정보</h3>
        <ul>
          <li><strong>생성 도구:</strong> ChatGPT/Grok AI</li>
          <li><strong>해상도:</strong> 1024×1536 pixels (portrait)</li>
          <li><strong>형식:</strong> PNG (RGB/RGBA)</li>
          <li><strong>스타일:</strong> 고품질 아니메 일러스트</li>
          <li><strong>총 크기:</strong> 15.2MB (7개 이미지)</li>
        </ul>

        <h3>게임에서 사용될 때</h3>
        <ul>
          <li><strong>Wave:</strong> 스테이지 시작 시</li>
          <li><strong>Jump:</strong> 콤보 5+ 달성 시</li>
          <li><strong>Clap:</strong> Perfect 타이핑 달성 시</li>
          <li><strong>Spin:</strong> 콤보 10+ 달성 시</li>
          <li><strong>Dance/Pose:</strong> 스테이지 클리어 시</li>
        </ul>

        <h3>테스트 방법</h3>
        <p>✅ 위 버튼을 클릭하여 Emily의 7가지 AI 생성 이미지를 확인하세요!</p>
        <p>🎨 "프리미티브" 모드로 전환하면 개발용 도형 렌더링과 비교할 수 있습니다.</p>
      </div>

      <style>{`
        /* Phase 31: focus-visible ring on every actionable control button
           in the CharacterTest screen. Phase 31 audit found 16+ buttons
           with no :focus-visible rule, so keyboard users tabbing through
           the test harness got no visual confirmation of which button
           was selected. Mirrors the Phase 14/19/20/21/27/29/30 + 2px
           cyan outline + 2px offset convention so visual cadence stays
           consistent across the app. */
        .character-test-controls button:focus-visible {
          outline: 2px solid #00d9ff;
          outline-offset: 2px;
        }
        .character-test-controls input[type="checkbox"]:focus-visible {
          outline: 2px solid #00d9ff;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
