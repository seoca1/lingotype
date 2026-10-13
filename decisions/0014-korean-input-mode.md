# ADR-0014: Korean Input Mode Setting

## 번호

`0014-korean-input-mode.md`

## 제목

Korean input mode setting: `jamo` (default) | `romanized` — exposed via Settings, persisted in localStorage.

## 상태

Draft

## 날짜

2026-10-13

## 컨텍스트

The Korean handler ships with the 2-beol (jamo) direct-input approach
(ADR-0010). A future romanized variant is on the roadmap. To let users
opt in early (and to keep Settings storage symmetrical with the existing
`nativeLanguage` pattern), we add a `KoreanInputMode` setting now so the
choice can be persisted before the romanized handler exists.

This slice only introduces the storage layer + a small Settings hookup;
no input handler changes ship today.

## 옵션 비교

| 옵션 | 장점 | 단점 | 비고 |
| --- | --- | --- | --- |
| A. New `KoreanInputMode` setting + storage now | Symmetric with `nativeLanguage`; future-proofs the romanized path; small diff | Ships a "pending" toggle that does nothing yet | **선택** |
| B. Wait until romanized handler exists | No premature surface | Forces a future Settings rewrite; no user choice ahead of handler | Rejected |
| C. Use a single boolean `useRomanized` | Smaller type | Binary-only, can't add a third option without breaking changes | Rejected |

## 결정

Adopt option A: introduce `src/data/koreanInputMode.ts` with a
`KoreanInputMode = 'jamo' | 'romanized'` union, default `'jamo'`,
persisted at `typing-language-korean-input-mode` in localStorage.

## 이유

- Mirrors the well-tested `nativeLanguage` storage pattern verbatim —
  small review surface.
- Lets us ship SettingsScreen wiring (and a11y test coverage) without
  waiting on the romanized handler.
- ADR-0010 (Accepted) is about input behaviour, not about exposing
  preferences — this ADR complements, does not amend.

## 결과 / 영향

### 긍정적
- Future romanized handler lands without a Settings rewrite.
- Same lazy-storage-check + in-memory fallback pattern as
  `nativeLanguage` — uniform user data layer.

### 부정적 / 트레이드오프
- Exposes a non-functional toggle until a handler is added.

### 제약
- None yet — handler is orthogonal.

## 열린 질문

- Should the SettingsScreen toggle render as disabled with a "coming
  soon" hint, or be hidden entirely until the romanized handler ships?
- When the romanized handler lands, what tier does it gate — Tier 0
  only, or any stage?