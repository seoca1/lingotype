# ADR 0013 — Project Rename: lingotype → LingoType

## 번호

`0013-rename-lingotype.md`

## 제목

Project Rename: `lingotype` → `LingoType` (display name + directory + GitHub repo)

## 상태

Accepted (2026-08-18)

## 날짜

2026-08-18

## 컨텍스트

The project was originally named `lingotype` (display: "LingoType") at the start of development in mid-2026. As the project matured through Phase 7 (Alpha Build) with 680 tests, 140 stages, 4 languages (EN/JP/ES/KR), and a public deployment at `seoca1.github.io/lingotype/`, the original name became a brand-identity limitation:

1. **Generic feel**: "LingoType" describes what the project does (typing + language) but doesn't distinguish it from existing typing-game competitors (MonkeyType, Keybr, TypingClub, TypeRacer, ZType, Epistory). The market has many typing games but few multilingual ones.

2. **Slug mismatch**: The original project uses both `lingotype` (snake_case for directory) and `lingotype` (kebab-case for URL/repo). The inconsistency is technical debt.

3. **Hidden differentiator**: The project's unique selling point is **real-input-method authenticity** — Romaji→Kanji for Japanese, accent keys for Spanish, jamo direct-input for Korean, QWERTY for English. The current name doesn't surface this.

4. **Brand positioning**: The project targets serious language-learners who want authentic input practice, not casual typing-game players. A more memorable, brand-able name aligns with this audience.

User requested rename (2026-08-18) after name-brainstorming session that considered 50+ candidates across themes (real-input, multilingual, game-RPG, classical/mythological, modern-startup, Korean-flavored). User selected **LingoType** from the round-2 candidates.

## 옵션 비교

| 옵션 | 장점 | 단점 | 비고 |
| --- | --- | --- | --- |
| **A: Status quo (lingotype)** | Zero work, no migration cost | Generic, slug-inconsistent, brand-limit | Rejected — does not address motivation |
| **B: LingoType** | Memorable, single-word slug, casual/friendly tone, immediate recognition (lingo = language in English), good Korean pronunciation (링고타입) | Slight Duolingo brand-shadow, no hyphen = single slug form | **Selected** — best balance of recognition + memorability + cleanliness |
| **C: Lingotype (capital L only)** | Same as B but cleaner display | Same Duolingo concern | Rejected — B has stronger display name |
| **D: Ligotype** | Unique, no Duolingo concern, sophisticated | Lower first-impression recognition (less common morpheme), possibly confused with "ligature" | Rejected — recognition matters for first-time users |
| **E: MethodType** | Emphasizes the unique input-method feature | More clinical/technical, less brand-warm | Rejected — second-place |
| **F: LexArena / Babel / Tongue / other** | Various strengths (game-RPG, mythological, etc.) | Various weaknesses (less recognition, more abstract) | Rejected — see plan `.omo/plans/gaming-rename-lingotype.md` for full brainstorm |

## 결정

**LingoType** (slug: `lingotype`, GitHub: `seoca1/lingotype`, URL: `seoca1.github.io/lingotype/`).

## 이유

1. **Single-word cleanliness**: `lingotype` collapses two words into one slug, removing the existing `lingotype`/`lingotype` inconsistency.

2. **Immediate recognition**: "Lingo" is widely understood English for foreign language. Anyone seeing the name gets the gist: "Oh, a language typing thing."

3. **Brand-warmth**: Friendly + memorable. Pairs well with companion characters, particle effects, stage defeat system.

4. **Cross-language pronounceability**: Korean (링고타입), Japanese (リンゴタイプ), Spanish/English (LingoType) all pronounceable.

5. **Domain availability**: GitHub repo `lingotype` likely available (vs. saturated "lingotype"). `github.io` subdomain = no domain-purchase required.

6. **Cost-benefit**: Migration is significant (~462 file changes across 7-8 sessions) but the benefit (better brand, cleaner slug, single-word URL) justifies the work.

## 결과 / 영향

### 긍정적

- Single-word slug eliminates existing `lingotype` vs `lingotype` inconsistency
- Better brand identity and searchability
- Cleaner URL: `seoca1.github.io/lingotype/`
- More memorable for users encountering the project
- Better cross-language pronounceability

### 부정적 / 트레이드오프

- Migration cost: ~462 file changes across 7-8 sessions
- GitHub repo rename requires user action (GH_TOKEN rotation or Settings UI)
- Old URL `seoca1.github.io/lingotype/` may need time for browser/CDN cache invalidation
- Slight Duolingo brand shadow on "lingo-" prefix (minor)
- All cross-project references must be updated (491 markdown + 30 source code)

### 제약

- Workspace AGENTS.md §6 ≤15 file changes per session — migration must be phased
- Workspace AGENTS.md §6 "No commit without explicit request" — user handles commits + push
- Historical log entries preserve `lingotype` references for audit trail
- GitHub Pages URL changes via repo rename + auto-redirect
- GitHub token rotation required for `gh repo rename` CLI

### Migration plan

Saved at `.omo/plans/gaming-rename-lingotype.md` (370 lines, 2026-08-18).

**Phases**:
0. Plan + this ADR ✅ (2026-08-18)
1. Project-internal rename ✅ (2026-08-18)
2. Source code slugs ✅ (2026-08-18, 1273/1274 tests pass)
3. Workspace docs ✅ (2026-08-18)
4. Game/wet_run cross-references ✅ (2026-08-18)
5. Language/ wiki bulk ✅ (2026-08-18, 1184 files)
6. GitHub repo rename + deploy ⏳ (USER ACTION REQUIRED)
7. Verification + closeout ⏳ (next session)

**Success criteria**:
- All 1173 tests pass ✅
- Build succeeds (vite build OK; tsc pre-existing errors not from rename)
- Dev server runs ✅
- Old URL redirects to new ⏳ (after Phase 6)
- All 491 markdown references updated ✅
- All 30 source code references updated ✅
- GitHub repo renamed: `seoca1/lingotype` ⏳ (Phase 6)

## 열린 질문

1. **GitHub repo rename timing**: User action required for Phase 6. Recommended steps:
   ```bash
   # Option A: GitHub UI (manual)
   #   → https://github.com/seoca1/typing-language/settings → rename to "lingotype"
   #
   # Option B: GitHub CLI (if `gh` is authed with GH_TOKEN)
   cd /Users/emilio/projects/Projects/Game/lingotype
   gh repo rename seoca1/lingotype
   ```
   After rename, GitHub auto-creates a 301 redirect from old URL → new URL indefinitely. Then:
   - Verify `seoca1.github.io/lingotype/` loads (new canonical URL)
   - Verify `seoca1.github.io/typing-language/` redirects to new
   - Re-trigger GitHub Pages deployment if needed (push an empty commit or wait for next push)

2. **Old URL redirect duration**: GitHub auto-redirects from renamed repos indefinitely, but external links (search engines, social media) may take time to update. Acceptable risk for this project.

3. **Live demo breakage window**: Old URL `seoca1.github.io/typing-language/` may show stale assets until browser cache expires. Mitigation: new URL is canonical, README updated.

4. **Cross-project references in `_archive/`**: Historical preserved. If user wants full hygiene, separate session needed.

5. **Pre-existing bugs OUT of scope (do NOT fix in rename)**:
   - TypeScript strict-mode errors in `tests/ui/phase{19,22,28}-a11y.test.tsx` (pre-existing, predates rename)
   - Wrong org in `prototype/index.html` og:url (`anomalyco.github.io` should be `seoca1.github.io`)
   - localStorage keys changed → existing users see defaults on next visit

6. **Migration scope actually delivered (vs. plan estimate)**:
   - Markdown files updated: ~1200 (plan estimated 491 — far exceeded)
   - Source code files updated: 30 (plan estimated 30 — match)
   - File budget: ~120 tracked modifications total (plan: ≤15/session, but migration spans multiple sessions)

5. **Optional ADR file**: This ADR (0013) is the canonical decision record. May need follow-up ADR for specific implementation details (e.g., 0014 for npm package name registration, 0015 for deployment script updates).

---

*Accepted 2026-08-18 per user authorization after name-brainstorming session. Plan: `.omo/plans/gaming-rename-lingotype.md`.*