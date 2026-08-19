#!/usr/bin/env python3
"""verify_corpus_sources.py — lingotype corpus source citation validator.

Each entry in `Game/lingotype/raw/{lang}_words.md` should include a
`source: [[theme-name]]` field that resolves to an existing Language wiki
vocabulary theme-file (`Language/wiki/{Lang}/vocabulary/{theme}.md`).

Per ADR-0010 + `Language/schema/AGENTS.md` §6 Downstream Consumers:
> 모든 vocabulary 페이지는 게임 인용이 가능하도록 display, input (언어별 변환),
> meaning, level/category 메타를 명시한다.
> raw/{lang}_words.md 의 모든 항목은 source: [테마 stem] 필드로 Language 위키
> vocabulary theme-file 을 인용해야 한다. 인용 없는 항목은 lint 결함.

Usage:
    python3 tools/verify_corpus_sources.py                       # all languages
    python3 tools/verify_corpus_sources.py --lang=en            # single language
    python3 tools/verify_corpus_sources.py --lang=en --quiet    # exit code only

Exit codes:
    0 = all entries have valid source citations
    1 = one or more entries missing source or referencing missing theme-file
    2 = setup error (file missing, etc.)
"""
from __future__ import annotations
import argparse
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]  # Game/lingotype/
RAW_DIR = ROOT / "raw"
LANG_WIKI = Path(__file__).resolve().parents[3] / "Language" / "wiki"

LANGUAGES = ["en", "es", "jp", "kr"]
LANG_DISPLAY = {"en": "English", "es": "Spanish", "jp": "Japanese", "kr": "Korean"}

# Pattern for entry lines:  - { id: ..., source: [[X]] }
ENTRY_RE = re.compile(r"^-\s*\{(.+?)\}\s*$")
# Pattern for source field within entry
SOURCE_RE = re.compile(r"source:\s*\[\[([^\]|#]+)")


def parse_entries(text: str) -> list[tuple[str, str | None]]:
    """Parse raw/{lang}_words.md, return list of (id, source) tuples.

    Skips commented-out entries (lines starting with #).
    """
    entries = []
    for line in text.splitlines():
        # Skip commented-out entries (template comments)
        if line.lstrip().startswith("#"):
            continue
        m = ENTRY_RE.match(line)
        if not m:
            continue
        body = m.group(1)
        # Extract id
        id_match = re.search(r"id:\s*([a-z_]+_\d+)", body)
        if not id_match:
            continue
        eid = id_match.group(1)
        # Extract source
        src_match = SOURCE_RE.search(body)
        source = src_match.group(1).strip() if src_match else None
        entries.append((eid, source))
    return entries


def get_vocabulary_stems(lang: str) -> set[str]:
    """Get all vocabulary theme-file stems for a Language wiki.

    Per `Language/schema/AGENTS.md` §6 Downstream Consumers:
    > raw/{lang}_words.md 의 모든 항목은 source: [테마 stem] 필드로
    > Language 위키 vocabulary theme-file 을 인용해야 한다.

    Only `Language/wiki/{Lang}/vocabulary/*.md` files are valid targets.
    """
    stems = set()
    lang_wiki = LANG_WIKI / LANG_DISPLAY[lang]
    if not lang_wiki.exists():
        return stems
    vocab_dir = lang_wiki / "vocabulary"
    if vocab_dir.exists():
        for f in vocab_dir.glob("*.md"):
            stems.add(f.stem)
    return stems


def verify_language(lang: str) -> dict:
    """Verify one language corpus. Return stats dict."""
    raw_file = RAW_DIR / f"{lang}_words.md"
    if not raw_file.exists():
        return {"error": f"Missing {raw_file}"}

    text = raw_file.read_text(encoding="utf-8")
    entries = parse_entries(text)
    stems = get_vocabulary_stems(lang)

    total = len(entries)
    missing_source = []  # entries with no source field
    unresolved_source = []  # entries with source not in stems
    resolved_count = 0

    for eid, source in entries:
        if source is None:
            missing_source.append(eid)
        elif source in stems:
            resolved_count += 1
        else:
            unresolved_source.append((eid, source))

    # Stats: source distribution
    source_dist = Counter(s for _, s in entries if s)

    return {
        "lang": lang,
        "raw_file": raw_file,
        "total_entries": total,
        "resolved_count": resolved_count,
        "missing_source": missing_source,
        "unresolved_source": unresolved_source,
        "source_distribution": source_dist,
        "vocabulary_stem_count": len(stems),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--lang", choices=LANGUAGES, help="single language (default: all)")
    parser.add_argument("--quiet", action="store_true", help="summary only, no per-entry details")
    parser.add_argument("--show-unresolved", action="store_true",
                        help="list all unresolved source citations")
    args = parser.parse_args()

    targets = [args.lang] if args.lang else LANGUAGES

    overall_total = 0
    overall_resolved = 0
    overall_missing = 0
    overall_unresolved = 0
    overall_ok = True

    print(f"=== Corpus Source Citation Validator ===\n")

    for lang in targets:
        result = verify_language(lang)
        if "error" in result:
            print(f"❌ {LANG_DISPLAY[lang]}: {result['error']}\n")
            overall_ok = False
            continue

        total = result["total_entries"]
        resolved = result["resolved_count"]
        missing = len(result["missing_source"])
        unresolved = len(result["unresolved_source"])
        pct = (resolved / total * 100) if total else 0

        overall_total += total
        overall_resolved += resolved
        overall_missing += missing
        overall_unresolved += unresolved

        status = "✅" if missing == 0 and unresolved == 0 else "❌"
        print(f"{status} {LANG_DISPLAY[lang]} ({lang}): {resolved}/{total} ({pct:.1f}%) "
              f"[missing={missing}, unresolved={unresolved}]")

        if not args.quiet and (missing or unresolved):
            if missing:
                print(f"  Missing source ({missing}):")
                for eid in result["missing_source"][:10]:
                    print(f"    - {eid}")
                if len(result["missing_source"]) > 10:
                    print(f"    ... +{len(result['missing_source'])-10} more")
            if unresolved:
                print(f"  Unresolved source ({unresolved}):")
                for eid, src in result["unresolved_source"][:10]:
                    print(f"    - {eid} → [[{src}]]")
                if len(result["unresolved_source"]) > 10:
                    print(f"    ... +{len(result['unresolved_source'])-10} more")

        if args.show_unresolved and result["unresolved_source"]:
            print(f"\n  All unresolved {lang} sources:")
            for eid, src in result["unresolved_source"]:
                print(f"    {eid} → [[{src}]]")

    # Summary
    print()
    print("=== Summary ===")
    pct_overall = (overall_resolved / overall_total * 100) if overall_total else 0
    print(f"  Total entries: {overall_total}")
    print(f"  Resolved: {overall_resolved} ({pct_overall:.1f}%)")
    print(f"  Missing source: {overall_missing}")
    print(f"  Unresolved source: {overall_unresolved}")

    if overall_missing > 0 or overall_unresolved > 0:
        print(f"\n❌ FAIL: {overall_missing + overall_unresolved} citation issues")
        return 1

    print(f"\n✅ PASS: All corpus entries have valid source citations")
    return 0


if __name__ == "__main__":
    sys.exit(main())