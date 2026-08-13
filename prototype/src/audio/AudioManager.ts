/**
 * AudioManager - Web Audio API 기반 사운드 효과
 *
 * 파일 없이 프로그래밍 방식으로 사운드 생성
 * 가볍고 빠른 반응, 용량 부담 없음
 *
 * Phase 12: 콤보 브레이크 / 메뉴 클릭 / 메뉴 선택 / 스테이지 시작 4종 추가
 * (기존 6종 위에 additive 확장 — 기존 호출자는 그대로 동작)
 */

export type SoundType =
  | 'key-correct'      // 올바른 키 입력
  | 'key-incorrect'    // 잘못된 키 입력
  | 'enemy-defeat'     // 적 격파
  | 'stage-clear'      // 스테이지 클리어
  | 'combo'            // 콤보 달성
  | 'perfect'          // 완벽 격파
  | 'combo-break'      // 콤보 브레이크 (콤보가 0으로 떨어질 때)
  | 'menu-click'       // 메뉴 항목 호버/선택 (낮은 톤, 짧음)
  | 'menu-select'      // 메뉴 항목 확정 (조금 높은 톤)
  | 'stage-start'      // 스테이지 시작 (짧은 알림음)
  | 'level-up'         // Phase 13: 레벨업 / 마일스톤 달성 (상승 장3화음)
  | 'game-over'        // Phase 13: 게임 오버 (하강 단3화음)
  | 'stage-intro'      // Phase 13: 튜토리얼/첫 스테이지 인트로 (stage-start보다 더 풍부)
  | 'achievement';     // Phase 13: 업적 달성 (장7 화음이 상향 글로우)

export class AudioManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private enabled = true;
  private volume = 0.3; // 기본 볼륨 30%

  constructor() {
    // AudioContext는 사용자 인터랙션 후 생성 (브라우저 정책)
    this.initContext();
    this.setupMobileAudioUnlock();
  }

  private initContext() {
    if (!this.context) {
      try {
        this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.masterGain = this.context.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(this.context.destination);
      } catch (e) {
        console.warn('Web Audio API not supported:', e);
        this.enabled = false;
      }
    }
  }

  /**
   * 모바일 오디오 언락 (iOS/Android autoplay 정책 우회)
   */
  private setupMobileAudioUnlock() {
    const unlock = () => {
      if (!this.context) return;
      
      if (this.context.state === 'suspended') {
        this.context.resume().then(() => {
          console.log('[Audio] Context resumed on user interaction');
        });
      }

      // 무음 재생으로 오디오 잠금 해제 (iOS)
      const buffer = this.context.createBuffer(1, 1, 22050);
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.context.destination);
      source.start(0);

      // 이벤트 리스너 제거 (한 번만 실행)
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('touchend', unlock);
      document.removeEventListener('click', unlock);
    };

    // 여러 이벤트에 리스너 추가
    document.addEventListener('touchstart', unlock, { once: true });
    document.addEventListener('touchend', unlock, { once: true });
    document.addEventListener('click', unlock, { once: true });
  }

  /**
   * 사운드 재생
   */
  play(type: SoundType) {
    if (!this.enabled || !this.context || !this.masterGain) {
      return;
    }

    // 사용자 제스처 후 context resume (iOS Safari)
    if (this.context.state === 'suspended') {
      this.context.resume();
    }

    const now = this.context.currentTime;

    switch (type) {
      case 'key-correct':
        this.playKeyCorrect(now);
        break;
      case 'key-incorrect':
        this.playKeyIncorrect(now);
        break;
      case 'enemy-defeat':
        this.playEnemyDefeat(now);
        break;
      case 'stage-clear':
        this.playStageClear(now);
        break;
      case 'combo':
        this.playCombo(now);
        break;
      case 'perfect':
        this.playPerfect(now);
        break;
      case 'combo-break':
        this.playComboBreak(now);
        break;
      case 'menu-click':
        this.playMenuClick(now);
        break;
      case 'menu-select':
        this.playMenuSelect(now);
        break;
      case 'stage-start':
        this.playStageStart(now);
        break;
      case 'level-up':
        this.playLevelUp(now);
        break;
      case 'game-over':
        this.playGameOver(now);
        break;
      case 'stage-intro':
        this.playStageIntro(now);
        break;
      case 'achievement':
        this.playAchievement(now);
        break;
    }
  }

  /**
   * 올바른 키 입력 - 짧고 높은 틱 소리
   */
  private playKeyCorrect(startTime: number) {
    if (!this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, startTime); // A5
    
    gain.gain.setValueAtTime(0.15, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + 0.05);
  }

  /**
   * 잘못된 키 입력 - 낮고 거친 버즈 소리
   */
  private playKeyIncorrect(startTime: number) {
    if (!this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, startTime); // A2
    
    gain.gain.setValueAtTime(0.1, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + 0.1);
  }

  /**
   * 적 격파 - 상승하는 멜로디
   */
  private playEnemyDefeat(startTime: number) {
    if (!this.context || !this.masterGain) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = this.context!.createOscillator();
      const gain = this.context!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + i * 0.05);
      
      gain.gain.setValueAtTime(0.2, startTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.05 + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime + i * 0.05);
      osc.stop(startTime + i * 0.05 + 0.15);
    });
  }

  /**
   * 스테이지 클리어 - 승리 팡파레
   */
  private playStageClear(startTime: number) {
    if (!this.context || !this.masterGain) return;

    // C major arpeggio: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const osc = this.context!.createOscillator();
      const gain = this.context!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + i * 0.1);
      
      gain.gain.setValueAtTime(0.25, startTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.1 + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime + i * 0.1);
      osc.stop(startTime + i * 0.1 + 0.3);
    });
  }

  /**
   * 콤보 - 짧은 상승음
   */
  private playCombo(startTime: number) {
    if (!this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(440, startTime);
    osc.frequency.exponentialRampToValueAtTime(880, startTime + 0.1);
    
    gain.gain.setValueAtTime(0.15, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + 0.15);
  }

  /**
   * 완벽 격파 - 반짝이는 소리
   */
  private playPerfect(startTime: number) {
    if (!this.context || !this.masterGain) return;

    // 빠른 아르페지오
    const notes = [1046.50, 1318.51, 1567.98]; // C6, E6, G6
    notes.forEach((freq, i) => {
      const osc = this.context!.createOscillator();
      const gain = this.context!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + i * 0.03);
      
      gain.gain.setValueAtTime(0.2, startTime + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.03 + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime + i * 0.03);
      osc.stop(startTime + i * 0.03 + 0.2);
    });
  }

  /**
   * Phase 12: 콤보 브레이크 — 하강 톤 + 약간의 노이즈로 "아쉬운" 느낌
   *
   * 220Hz에서 110Hz로 약 0.18초간 내려가는 톤. 콤보가 끊긴 것을 직관적으로
   * 전달하면서도 적(스테이지 격파) 사운드보다 명확히 약하게 유지한다.
   */
  private playComboBreak(startTime: number) {
    if (!this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, startTime); // A3
    osc.frequency.exponentialRampToValueAtTime(110, startTime + 0.18); // A2

    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + 0.2);
  }

  /**
   * Phase 12: 메뉴 클릭 — 아주 짧고 낮은 톤의 "틱"
   *
   * 메뉴 항목 위로 마우스가 지나가거나 단순 클릭 시 발생. 스테이지 카드
   * 같은 무거운 UI에서도 과하지 않도록 진폭과 지속 시간을 작게 잡는다.
   */
  private playMenuClick(startTime: number) {
    if (!this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, startTime); // E5

    gain.gain.setValueAtTime(0.08, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + 0.04);
  }

  /**
   * Phase 12: 메뉴 선택 — 메뉴 클릭보다 약간 높은 톤의 "틱"
   *
   * 옵션/설정 버튼이나 스테이지 시작 같은 "확정" 액션에서 발생.
   * menu-click보다 살짝 더 길고 높게 두어 "이건 클릭 그 자체"임을 구분.
   */
  private playMenuSelect(startTime: number) {
    if (!this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, startTime); // A5

    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.07);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + 0.07);
  }

  /**
   * Phase 12: 스테이지 시작 — 짧은 상승 알림음
   *
   * 첫 적 등장 직전에 한 번 재생해 "시작!" 신호를 준다.
   * 기존 stage-clear(승리 팡파레)와 짝을 이루며 대칭적인 시작/종료 피드백을 형성.
   */
  private playStageStart(startTime: number) {
    if (!this.context || !this.masterGain) return;

    const notes = [392.0, 523.25]; // G4, C5 — 짧은 도-미 상승
    notes.forEach((freq, i) => {
      const osc = this.context!.createOscillator();
      const gain = this.context!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + i * 0.07);

      gain.gain.setValueAtTime(0.18, startTime + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.07 + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime + i * 0.07);
      osc.stop(startTime + i * 0.07 + 0.18);
    });
  }

  /**
   * Phase 13: 레벨업 / 마일스톤 달성 — 4음 상승 장3 화음 (C-E-G-C)
   *
   * stage-clear(승리 팡파레)와 짝을 이루지만 더 길고 더 위로 올라가는
   * "성장" 느낌. Player가 의미 있는 마일스톤(첫 클리어, 다음 레벨,
   * 연속 클리어 등)에 도달했을 때 함께 재생한다.
   */
  private playLevelUp(startTime: number) {
    if (!this.context || !this.masterGain) return;

    // C5, E5, G5, C6 — ascending major triad with octave pop
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const osc = this.context!.createOscillator();
      const gain = this.context!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + i * 0.08);

      gain.gain.setValueAtTime(0.22, startTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.08 + 0.32);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime + i * 0.08);
      osc.stop(startTime + i * 0.08 + 0.32);
    });
  }

  /**
   * Phase 13: 게임 오버 — 3음 하강 단3 (diminished) 화음
   *
   * key-incorrect(짧은 버즈)보다 길고 더 "결말" 느낌. 마감을 못 맞추거나
   * 모든 미션을 실패로 끝냈을 때 stage-clear 대신 재생한다.
   */
  private playGameOver(startTime: number) {
    if (!this.context || !this.masterGain) return;

    // A4, F4, D4 — descending minor-ish feel
    const notes = [440.0, 349.23, 293.66];
    notes.forEach((freq, i) => {
      const osc = this.context!.createOscillator();
      const gain = this.context!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime + i * 0.18);

      gain.gain.setValueAtTime(0.14, startTime + i * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.18 + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime + i * 0.18);
      osc.stop(startTime + i * 0.18 + 0.35);
    });
  }

  /**
   * Phase 13: 스테이지 인트로 — 튜토리얼/첫 스테이지용 풍부한 4음 아르페지오
   *
   * 기존 stage-start(G4, C5 짧은 도-미)와 달리 C5-E5-G5-C6 4음을 0.1초 간격으로
   * 길게 울려 "첫 등장" 또는 튜토리얼 첫 시작 신호로 사용한다.
   */
  private playStageIntro(startTime: number) {
    if (!this.context || !this.masterGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = this.context!.createOscillator();
      const gain = this.context!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + i * 0.1);

      gain.gain.setValueAtTime(0.22, startTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.1 + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime + i * 0.1);
      osc.stop(startTime + i * 0.1 + 0.28);
    });
  }

  /**
   * Phase 13: 업적 달성 — 장7 화음 (C-E-G-B)
   *
   * 4음을 동시에 울리는 shimmering chord로, "방금 무언가 멋진 일이
   * 일어났다"는 알림음. achievement system이 도입되면 hook 자리.
   * 현재는 SFX catalog에 노출만 하고 호출자는 보류.
   */
  private playAchievement(startTime: number) {
    if (!this.context || !this.masterGain) return;

    const notes = [523.25, 659.25, 783.99, 987.77]; // C5, E5, G5, B5 (major7)
    notes.forEach((freq, i) => {
      const osc = this.context!.createOscillator();
      const gain = this.context!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + i * 0.04);

      gain.gain.setValueAtTime(0.18, startTime + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.04 + 0.45);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime + i * 0.04);
      osc.stop(startTime + i * 0.04 + 0.45);
    });
  }

  /**
   * 볼륨 설정 (0.0 ~ 1.0)
   */
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume;
    }
  }

  /**
   * 사운드 켜기/끄기
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * 현재 볼륨 가져오기
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * 활성화 상태 가져오기
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}

// 싱글톤 인스턴스
let audioManager: AudioManager | null = null;

export function getAudioManager(): AudioManager {
  if (!audioManager) {
    audioManager = new AudioManager();
  }
  return audioManager;
}
