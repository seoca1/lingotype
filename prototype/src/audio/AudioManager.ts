/**
 * AudioManager - Web Audio API 기반 사운드 효과
 * 
 * 파일 없이 프로그래밍 방식으로 사운드 생성
 * 가볍고 빠른 반응, 용량 부담 없음
 */

export type SoundType =
  | 'key-correct'      // 올바른 키 입력
  | 'key-incorrect'    // 잘못된 키 입력
  | 'enemy-defeat'     // 적 격파
  | 'stage-clear'      // 스테이지 클리어
  | 'combo'            // 콤보 달성
  | 'perfect'          // 완벽 격파
  | 'achievement';      // 업적/배지 달성 (글로우 상승 장7화음)

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
   * 업적/배지 - 더 화려한 글로우 상승 (3-octave arpeggio)
   */
  private playAchievement(startTime: number) {
    if (!this.context || !this.masterGain) return;

    // C5, E5, G5, C6, E6, G6, C7 — 3 옥타브 글로우
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
    notes.forEach((freq, i) => {
      const osc = this.context!.createOscillator();
      const gain = this.context!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + i * 0.08);

      gain.gain.setValueAtTime(0.18, startTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime + i * 0.08);
      osc.stop(startTime + i * 0.08 + 0.5);
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
