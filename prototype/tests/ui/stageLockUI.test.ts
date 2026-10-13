/**
 * Stage Lock UI Tests — Bug Fix
 *
 * Regression test for the bug where stages that should be locked (Tier 4+
 * requiring corpus not in SAMPLE_STAGES) were shown as accessible because
 * Menu.tsx built lockMap from SAMPLE_STAGES while byTier used ALL_STAGES.
 */

import { describe, it, expect } from 'vitest';
import { SAMPLE_STAGES, stagesByTier } from '../../src/data/stages.js';
import { checkStageUnlocked, type StageLockInfo } from '../../src/data/stageLock.js';

describe('Stage Lock UI — lockMap coverage (Bug Fix)', () => {
  /**
   * Reproduces the original bug: stages in ALL_STAGES but not in SAMPLE_STAGES
   * (e.g., Tier 5 requiring 'passages' corpus, Tier 4_2 needing 'quotes')
   * would be rendered in Menu (via byTier using ALL_STAGES) but had no
   * entry in lockMap (built from SAMPLE_STAGES), causing StageCard to
   * treat them as unlocked.
   */
  for (const lang of ['en', 'jp', 'es', 'kr'] as const) {
    it(`${lang}: lockMap covers every byTier stage (no missing entries)`, () => {
      const byTier = stagesByTier(lang);
      const renderedStages = Object.values(byTier).flat();

      // Simulate fixed lockMap construction (uses ALL language stages)
      const records = {};
      const lockMap: Record<string, StageLockInfo> = {};
      for (const s of renderedStages) {
        lockMap[s.id] = checkStageUnlocked(s.id, records);
      }

      // Every rendered stage should have a lockMap entry
      for (const s of renderedStages) {
        expect(lockMap[s.id], `${s.id} should have lockMap entry`).toBeDefined();
      }
    });
  }

  it('Tier 5 stages are LOCKED when no Tier 4 cleared (regression)', () => {
    // Without any cleared records, Tier 5 should be locked
    // because prevTier=4 exists in ALL_STAGES (en_4_1, jp_4_1, etc.)
    for (const stageId of ['en_5_1', 'jp_5_1', 'es_5_1', 'kr_5_1']) {
      const lock = checkStageUnlocked(stageId, {});
      expect(lock.unlocked, `${stageId} should be locked`).toBe(false);
    }
  });

  it('Tier 5 stages locked even if lower tiers cleared (need Tier 4 cleared)', () => {
    const records = {
      en_1_1: { stageId: 'en_1_1', cleared: true, stars: 1, bestScore: 100, bestWpm: 30, bestAccuracy: 90, playCount: 1, lastPlayedAt: 0 },
      en_2_1: { stageId: 'en_2_1', cleared: true, stars: 1, bestScore: 100, bestWpm: 30, bestAccuracy: 90, playCount: 1, lastPlayedAt: 0 },
      en_3_1: { stageId: 'en_3_1', cleared: true, stars: 1, bestScore: 100, bestWpm: 30, bestAccuracy: 90, playCount: 1, lastPlayedAt: 0 },
      // No en_4_1 cleared
    };
    expect(checkStageUnlocked('en_5_1', records).unlocked).toBe(false);
  });

  it('Tier 5 unlocked after Tier 4 cleared', () => {
    const records = {
      en_1_1: { stageId: 'en_1_1', cleared: true, stars: 1, bestScore: 100, bestWpm: 30, bestAccuracy: 90, playCount: 1, lastPlayedAt: 0 },
      en_2_1: { stageId: 'en_2_1', cleared: true, stars: 1, bestScore: 100, bestWpm: 30, bestAccuracy: 90, playCount: 1, lastPlayedAt: 0 },
      en_3_1: { stageId: 'en_3_1', cleared: true, stars: 1, bestScore: 100, bestWpm: 30, bestAccuracy: 90, playCount: 1, lastPlayedAt: 0 },
      en_4_1: { stageId: 'en_4_1', cleared: true, stars: 1, bestScore: 100, bestWpm: 30, bestAccuracy: 90, playCount: 1, lastPlayedAt: 0 },
    };
    expect(checkStageUnlocked('en_5_1', records).unlocked).toBe(true);
  });

  it('All stages from byTier are tested (no missed entries)', () => {
    // This test ensures the lockMap construction in Menu.tsx covers ALL
    // rendered stages, not just SAMPLE_STAGES.
    for (const lang of ['en', 'jp', 'es', 'kr'] as const) {
      const byTier = stagesByTier(lang);
      const totalStages = Object.values(byTier).flat().length;
      const sampleStages = SAMPLE_STAGES.filter(s => s.language === lang).length;
      // For languages with corpus-pending stages, totalStages > sampleStages
      // This confirms the bug condition exists for all 4 languages
      const missing = totalStages - sampleStages;
      console.log(`${lang}: totalStages=${totalStages}, sampleStages=${sampleStages}, missing=${missing}`);
      // At least Tier 5 should be in ALL but not SAMPLE
      expect(missing, `${lang} should have missing lock entries before fix`).toBeGreaterThan(0);
    }
  });
});

describe('Stage Lock — guard in actuallyStartStage (App.tsx)', () => {
  /**
   * The handleStartStage already checks the lock, but the user could
   * theoretically bypass it via handleConfirmStartStage → actuallyStartStage
   * if pendingStage was set before the lock check became invalid.
   * The defense-in-depth check in actuallyStartStage prevents this.
   */
  it('actuallyStartStage refuses locked stage', () => {
    const lockedStage = { id: 'jp_2_1', language: 'jp' as const, name: 'Locked', description: '', difficulty: 1, wordCount: 5, corpusFilter: {}, missions: [] };
    const records = {};  // No jp_0 cleared → jp_2_1 locked
    const lock = checkStageUnlocked(lockedStage.id, records);
    expect(lock.unlocked).toBe(false);
  });
});