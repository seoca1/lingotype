/**
 * AudioManager Tests — Phase 12
 *
 * Covers the 10 SoundType variants and the gating behavior that ties them
 * to Options.sound. AudioContext is mocked at the window level so we can
 * instantiate AudioManager inside jsdom without a real browser audio stack.
 *
 * Strategy: install a minimal AudioContext shim that records every oscillator
 * and gain node created, plus start/stop calls. We never actually emit sound
 * (tests run in headless CI), we only assert that the right number of nodes
 * was created per sound type and that setEnabled() disables all of them.
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

type OscCall = { type: string; freq: number; start: number; stop: number };
type GainCall = { startValue: number };

interface MockAudioState {
  oscCalls: OscCall[];
  gainCalls: GainCall[];
  bufferSources: number;
  destinationConnects: number;
}

function installAudioContextMock(): MockAudioState {
  const state: MockAudioState = {
    oscCalls: [],
    gainCalls: [],
    bufferSources: 0,
    destinationConnects: 0,
  };

  class FakeParam {
    value: number = 0;
    setValueAtTime(_v: number, _t: number) { /* noop */ }
    exponentialRampToValueAtTime(_v: number, _t: number) { /* noop */ }
    linearRampToValueAtTime(_v: number, _t: number) { /* noop */ }
  }

  class FakeOscillator {
    type: string = 'sine';
    frequency: FakeParam = new FakeParam();
    connect(_target: unknown) { return _target; }
    start(t: number) {
      state.oscCalls.push({
        type: this.type,
        freq: this.frequency.value,
        start: t,
        stop: t + 0.05, // filled in below by stop()
      });
    }
    stop(t: number) {
      const last = state.oscCalls[state.oscCalls.length - 1];
      if (last) last.stop = t;
    }
  }

  class FakeGain {
    gain: FakeParam = new FakeParam();
    connect(target: unknown) {
      if (target && (target as { __isMaster?: boolean }).__isMaster) {
        state.destinationConnects += 1;
      }
      return target;
    }
  }

  class FakeBufferSource {
    buffer: unknown = null;
    connect(target: unknown) {
      if (target && (target as { __isMaster?: boolean }).__isMaster) {
        state.destinationConnects += 1;
      }
      return target;
    }
    start(_t: number) {
      state.bufferSources += 1;
    }
  }

  class FakeBuffer {
    constructor(_ch: number, _len: number, _sr: number) { /* noop */ }
  }

  class FakeAudioContext {
    destination = { __isMaster: true } as unknown as AudioDestinationNode;
    currentTime = 0;
    state: AudioContextState = 'running';
    createOscillator() {
      return new FakeOscillator() as unknown as OscillatorNode;
    }
    createGain() {
      const g = new FakeGain();
      state.gainCalls.push({ startValue: g.gain.value });
      return g as unknown as GainNode;
    }
    createBufferSource() {
      return new FakeBufferSource() as unknown as AudioBufferSourceNode;
    }
    createBuffer(ch: number, len: number, sr: number) {
      return new FakeBuffer(ch, len, sr) as unknown as AudioBuffer;
    }
    resume() {
      return Promise.resolve();
    }
  }

  (globalThis as unknown as { AudioContext: typeof FakeAudioContext }).AudioContext =
    FakeAudioContext as unknown as typeof AudioContext;

  return state;
}

function uninstallAudioContextMock() {
  delete (globalThis as unknown as { AudioContext?: unknown }).AudioContext;
  delete (globalThis as unknown as { webkitAudioContext?: unknown }).webkitAudioContext;
}

let mock: MockAudioState;

beforeEach(() => {
  // Reset module cache so a fresh AudioManager is constructed against the
  // freshly-installed AudioContext mock. The singleton pattern in
  // AudioManager.ts would otherwise leak state between tests.
  vi.resetModules();
  mock = installAudioContextMock();
});

afterEach(() => {
  uninstallAudioContextMock();
});

// Helper: dynamically import a freshly constructed AudioManager (post-mock).
async function makeAudio() {
  const mod = await import('../../src/audio/AudioManager.js');
  // Direct construction avoids the getAudioManager singleton cache.
  return new mod.AudioManager();
}

describe('AudioManager — instantiation', () => {
  it('constructs successfully when AudioContext is available', async () => {
    const audio = await makeAudio();
    expect(audio.isEnabled()).toBe(true);
    expect(audio.getVolume()).toBeGreaterThan(0);
  });

  it('exposes a getter for volume and enabled state', async () => {
    const audio = await makeAudio();
    audio.setVolume(0.5);
    expect(audio.getVolume()).toBe(0.5);
    audio.setEnabled(false);
    expect(audio.isEnabled()).toBe(false);
  });

  it('clamps volume to [0, 1]', async () => {
    const audio = await makeAudio();
    audio.setVolume(2);
    expect(audio.getVolume()).toBe(1);
    audio.setVolume(-1);
    expect(audio.getVolume()).toBe(0);
  });
});

describe('AudioManager — sound catalog', () => {
  it.each([
    ['key-correct', 1],
    ['key-incorrect', 1],
    ['enemy-defeat', 3],
    ['stage-clear', 4],
    ['combo', 1],
    ['perfect', 3],
    ['combo-break', 1],
    ['menu-click', 1],
    ['menu-select', 1],
    ['stage-start', 2],
  ] as const)('play(%s) creates %i oscillator(s)', async (sound, expected) => {
    const audio = await makeAudio();
    mock.oscCalls.length = 0;
    audio.play(sound);
    expect(mock.oscCalls.length).toBe(expected);
  });
});

describe('AudioManager — Options.sound gating', () => {
  it('skips playback when setEnabled(false)', async () => {
    const audio = await makeAudio();
    audio.setEnabled(false);
    mock.oscCalls.length = 0;
    audio.play('enemy-defeat');
    audio.play('stage-clear');
    audio.play('combo-break');
    expect(mock.oscCalls.length).toBe(0);
  });

  it('plays when re-enabled after being disabled', async () => {
    const audio = await makeAudio();
    audio.setEnabled(false);
    audio.play('menu-click');
    expect(mock.oscCalls.length).toBe(0);
    audio.setEnabled(true);
    audio.play('menu-click');
    expect(mock.oscCalls.length).toBe(1);
  });
});

describe('AudioManager — resilient to AudioContext failures', () => {
  it('does not throw when AudioContext is unavailable', async () => {
    uninstallAudioContextMock();
    vi.resetModules();
    const mod = await import('../../src/audio/AudioManager.js');
    // No AudioContext constructor available — the constructor should log
    // a warning and disable audio without throwing.
    const audio = new mod.AudioManager();
    expect(audio.isEnabled()).toBe(false);
    // play() must be a no-op when disabled — no exception thrown.
    expect(() => audio.play('enemy-defeat')).not.toThrow();
  });
});

describe('AudioManager — volume routing', () => {
  it('creates one gain node per oscillator for envelope shaping', async () => {
    const audio = await makeAudio();
    mock.gainCalls.length = 0;
    audio.play('enemy-defeat');
    // enemy-defeat uses 3 oscillators → 3 per-osc gain nodes
    expect(mock.gainCalls.length).toBe(3);
  });

  it('routes through a single master gain connection at construction', async () => {
    await makeAudio();
    // AudioManager.initContext creates masterGain and connects it to
    // context.destination once. Subseqent plays do not add more master
    // connections (they reuse masterGain).
    expect(mock.destinationConnects).toBe(1);
  });
});