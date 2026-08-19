#!/usr/bin/env python3
"""
Dashboard Data Generator

Generates JSON data files for the Language Content Dashboard by:
1. Scanning Language/wiki/{Lang}/ for learning materials
2. Scanning Language/raw/{Lang}/ for source documents
3. Parsing Game/raw/{lang}_words.md for game corpus
4. Parsing Game/lingotype/prototype/src/data/stages.ts for stage definitions

Output: dashboard/data/{lang}.json + dashboard/data/overview.json
"""

import json
import os
import re
import yaml
from pathlib import Path
from collections import defaultdict, Counter
from datetime import datetime

# Configuration
LANGUAGE_ROOT = Path(os.environ.get(
    "LANGUAGE_ROOT",
    Path(__file__).parent.parent.parent.parent / "Language"
)).resolve()
GAME_ROOT = Path(os.environ.get(
    "GAME_ROOT",
    Path(__file__).parent.parent
)).resolve()
DASHBOARD_DATA = GAME_ROOT / "dashboard" / "data"

LANG_CODES = {
    "English": "en",
    "Japanese": "jp",
    "Spanish": "es",
    "Korean": "kr",
}

LANG_META = {
    "en": {"name": "English", "native": "English", "flag": "🇺🇸", "color": "#3b82f6"},
    "jp": {"name": "Japanese", "native": "日本語", "flag": "🇯🇵", "color": "#ec4899"},
    "es": {"name": "Spanish", "native": "Español", "flag": "🇪🇸", "color": "#f59e0b"},
    "kr": {"name": "Korean", "native": "한국어", "flag": "🇰🇷", "color": "#10b981"},
}

TIER_LABELS = {
    0: "Tier 0 · 문자",
    1: "Tier 1 · 단어",
    2: "Tier 2 · 단어 확장",
    3: "Tier 3 · 짧은 문장",
    4: "Tier 4 · 긴 문장",
    5: "Tier 5 · 단락",
    "t": "Travel · 여행",
    "d": "Romance · 연애",
    "f": "Food · 음식",
    "b": "Business · 비즈니스",
    "e": "Emotion · 감정",
    "n": "Nature · 자연",
    "a": "Animals · 동물",
    "c": "Clothing · 의류",
}


def safe_yaml_load(content):
    """Parse YAML, fallback to safe parser for complex cases."""
    try:
        return yaml.safe_load(content)
    except yaml.YAMLError:
        # Try line-by-line parsing for the format used in en_words.md
        items = []
        for line in content.splitlines():
            line = line.strip()
            if line.startswith("- {"):
                # Inline YAML: - { id: en_001, display: hello, meaning: 안녕, level: 1, category: greeting }
                try:
                    item_str = line[2:].strip()
                    if item_str.endswith("}"):
                        item_str = item_str[:-1]
                        item_str = "{" + item_str + "}"
                        item = yaml.safe_load(item_str)
                        if item:
                            items.append(item)
                except Exception:
                    pass
        return items


def scan_language_wiki(lang_name: str) -> dict:
    """Scan Language/wiki/{Lang}/ for learning materials."""
    wiki_path = LANGUAGE_ROOT / "wiki" / lang_name

    if not wiki_path.exists():
        return {
            "sources": [],
            "vocabulary": [],
            "expressions": [],
            "culture": [],
            "study_plan": [],
        }

    def list_md_files(folder: str) -> list:
        folder_path = wiki_path / folder
        if not folder_path.exists():
            return []
        return sorted(
            [
                {
                    "name": f.stem,
                    "filename": f.name,
                    "title": extract_title(f) or f.stem,
                    "size_kb": round(f.stat().st_size / 1024, 1),
                    "modified": datetime.fromtimestamp(f.stat().st_mtime).isoformat(),
                    "path": str(f.relative_to(LANGUAGE_ROOT)),
                }
                for f in folder_path.glob("*.md")
            ],
            key=lambda x: x["name"],
        )

    return {
        "sources": list_md_files("sources"),
        "vocabulary": list_md_files("vocabulary"),
        "expressions": list_md_files("expressions"),
        "culture": list_md_files("culture"),
        "study_plan": list_md_files("study-plan"),
    }


def extract_title(filepath: Path) -> str | None:
    """Extract first H1 from markdown file."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("# "):
                    return line[2:].strip()
    except Exception:
        pass
    return None


def scan_raw_sources(lang_name: str) -> list:
    """Scan Language/raw/{Lang}/ for source documents."""
    raw_path = LANGUAGE_ROOT / "raw" / lang_name
    if not raw_path.exists():
        return []

    return sorted(
        [
            {
                "name": f.stem,
                "filename": f.name,
                "title": extract_title(f) or f.stem,
                "size_kb": round(f.stat().st_size / 1024, 1),
                "modified": datetime.fromtimestamp(f.stat().st_mtime).isoformat(),
                "path": str(f.relative_to(LANGUAGE_ROOT)),
            }
            for f in raw_path.glob("*.md")
        ],
        key=lambda x: x["name"],
    )


def parse_game_corpus(lang_code: str) -> dict:
    """Parse Game/raw/{lang}_words.md for game corpus."""
    corpus_path = GAME_ROOT / "raw" / f"{lang_code}_words.md"

    if not corpus_path.exists():
        return {
            "total": 0,
            "by_level": {},
            "by_category": {},
            "by_type": {"words": 0, "sentences": 0, "chars": 0},
            "words_sample": [],
            "sentences_sample": [],
            "chars_sample": [],
            "categories": [],
            "levels": [],
        }

    with open(corpus_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract all YAML entries
    items = []
    # Try block-style YAML first
    yaml_blocks = re.findall(r"```yaml\n(.*?)\n```", content, re.DOTALL)
    for block in yaml_blocks:
        try:
            parsed = yaml.safe_load(block)
            if isinstance(parsed, list):
                items.extend(parsed)
        except yaml.YAMLError:
            items.extend(safe_yaml_load(block))

    # Also try inline YAML: - { id: ..., display: ..., ... }
    for line in content.splitlines():
        line = line.strip()
        if line.startswith("- {") and line.endswith("}"):
            try:
                parsed = yaml.safe_load(line[1:].strip())
                if isinstance(parsed, dict):
                    items.append(parsed)
            except yaml.YAMLError:
                pass

    # Categorize items
    words = [i for i in items if i and "display" in i and i.get("level", 0) <= 3]
    sentences = [i for i in items if i and "display" in i and i.get("level", 0) >= 4]
    chars = [i for i in items if i and ("character" in str(i) or "kana" in str(i))]

    by_level = Counter(i.get("level", 0) for i in items if i)
    by_category = Counter(i.get("category", "uncategorized") for i in items if i)

    return {
        "total": len(items),
        "by_level": dict(sorted(by_level.items())),
        "by_category": dict(by_category.most_common()),
        "by_type": {
            "words": len(words),
            "sentences": len(sentences),
            "chars": len(chars),
        },
        "words_sample": [i for i in words[:10]],
        "sentences_sample": [i for i in sentences[:10]],
        "chars_sample": [i for i in chars[:10]],
        "categories": sorted(by_category.keys()),
        "levels": sorted(by_level.keys()),
    }


def parse_game_stages(lang_code: str) -> list:
    """Parse prototype/src/data/stages.ts for stage definitions."""
    stages_path = GAME_ROOT / "prototype" / "src" / "data" / "stages.ts"

    if not stages_path.exists():
        return []

    with open(stages_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find stage blocks for this language
    # Match all stage IDs: standard (xx_N_M), travel (xx_t_N), and theme stages (xx_d/f/b/e/n/a/c_N)
    pattern = rf"id:\s*'{lang_code}_([0-5]|t|d|f|b|e|n|a|c)_(\d+)'.*?(?=id:\s*'|^\]\;|\]\,)"
    matches = re.finditer(pattern, content, re.DOTALL)

    stages = []
    for match in matches:
        block = match.group(0)
        tier_raw = match.group(1)
        stage_num = int(match.group(2))

        # Special theme tiers (t/d/f/b/e/n/a/c) keep their own label; numeric tiers map directly
        if tier_raw in ('t', 'd', 'f', 'b', 'e', 'n', 'a', 'c'):
            tier = tier_raw  # Keep letter prefix as-is for special stages
        else:
            tier = int(tier_raw)

        # Extract stage details
        stage_id = f"{lang_code}_{tier_raw}_{stage_num}"
        name_match = re.search(r"name:\s*['\"](.+?)['\"]", block)
        desc_match = re.search(r"description:\s*['\"](.+?)['\"]", block)
        count_match = re.search(r"wordCount:\s*(\d+)", block)
        difficulty_match = re.search(r"difficulty:\s*(\d+)", block)
        requires_match = re.search(r"requiresCorpus:\s*['\"]?(\w+)['\"]?", block)

        # Extract corpus filter
        filter_match = re.search(r"corpusFilter:\s*\{([^}]+)\}", block)
        filter_dict = {}
        if filter_match:
            filter_str = filter_match.group(1)
            cat_match = re.search(r"categories:\s*\[([^\]]+)\]", filter_str)
            if cat_match:
                cats = re.findall(r"['\"](\w+)['\"]", cat_match.group(1))
                filter_dict["categories"] = cats
            min_match = re.search(r"minLevel:\s*(\d+)", filter_str)
            max_match = re.search(r"maxLevel:\s*(\d+)", filter_str)
            if min_match:
                filter_dict["minLevel"] = int(min_match.group(1))
            if max_match:
                filter_dict["maxLevel"] = int(max_match.group(1))

        stages.append(
            {
                "id": stage_id,
                "tier": tier,
                "stage_num": stage_num,
                "tier_label": TIER_LABELS.get(tier, f"Tier {tier}"),
                "name": name_match.group(1) if name_match else stage_id,
                "description": desc_match.group(1) if desc_match else "",
                "word_count": int(count_match.group(1)) if count_match else 0,
                "difficulty": int(difficulty_match.group(1)) if difficulty_match else tier,
                "corpus_type": (
                    requires_match.group(1)
                    if requires_match
                    else ("chars" if tier == 0 else "words")
                ),
                "corpus_filter": filter_dict,
            }
        )

    # Sort: numeric tiers first (0-5), then special themes alphabetically
    def stage_sort_key(s):
        tier = s["tier"]
        if isinstance(tier, int):
            return (0, tier, s["stage_num"])
        return (1, tier, s["stage_num"])

    return sorted(stages, key=stage_sort_key)


def compute_coverage(lang_code: str, wiki_data: dict, corpus_data: dict, stages_data: list) -> dict:
    """Compute coverage analysis between wiki materials and game corpus."""
    # Required corpus per stage
    stage_requirements = []
    for stage in stages_data:
        cats = stage["corpus_filter"].get("categories", [])
        min_lv = stage["corpus_filter"].get("minLevel", 1)
        max_lv = stage["corpus_filter"].get("maxLevel", stage["difficulty"])
        stage_requirements.append(
            {
                "stage_id": stage["id"],
                "stage_name": stage["name"],
                "tier": stage["tier"],
                "categories": cats,
                "level_range": [min_lv, max_lv],
                "word_count": stage["word_count"],
                "corpus_type": stage["corpus_type"],
            }
        )

    # Available corpus
    available_by_category = corpus_data.get("by_category", {})
    available_by_level = corpus_data.get("by_level", {})

    # Wiki learning material coverage
    wiki_total = sum(
        len(wiki_data.get(k, []))
        for k in ["vocabulary", "expressions", "culture", "sources", "study_plan"]
    )

    # Source coverage
    sources_count = len(wiki_data.get("sources", []))

    # Compute gaps: which stage needs corpus that doesn't exist yet
    gaps = []
    for req in stage_requirements:
        # Check if we have enough items for this stage
        if req["corpus_type"] == "words":
            needed = req["word_count"]
            available = 0
            for cat in req["categories"]:
                available += available_by_category.get(cat, 0)
            if available < needed:
                gaps.append(
                    {
                        "stage_id": req["stage_id"],
                        "stage_name": req["stage_name"],
                        "needed": needed,
                        "available": available,
                        "shortfall": needed - available,
                        "categories": req["categories"],
                    }
                )

    return {
        "total_stages": len(stages_data),
        "total_corpus": corpus_data.get("total", 0),
        "wiki_materials": wiki_total,
        "sources": sources_count,
        "raw_sources": 0,  # filled by caller
        "stages_by_tier": dict(Counter(str(s["tier"]) for s in stages_data)),
        "stage_requirements": stage_requirements,
        "gaps": gaps,
        "coverage_percent": (
            round((corpus_data.get("total", 0) / max(sum(s["word_count"] for s in stages_data), 1)) * 100, 1)
        ),
    }


def generate_overview(all_lang_data: dict) -> dict:
    """Generate overview stats across all languages."""
    overview = {
        "generated_at": datetime.now().isoformat(),
        "languages": [],
        "totals": {
            "stages": 0,
            "corpus": 0,
            "wiki_materials": 0,
            "raw_sources": 0,
            "vocab_words": 0,
            "expressions": 0,
            "culture": 0,
        },
        "tiers": {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
    }

    for code, data in all_lang_data.items():
        meta = LANG_META[code]
        lang_summary = {
            "code": code,
            "name": meta["name"],
            "native": meta["native"],
            "flag": meta["flag"],
            "color": meta["color"],
            "stats": {
                "stages": data["coverage"]["total_stages"],
                "corpus_total": data["corpus"]["total"],
                "vocab_wiki": len(data["wiki"]["vocabulary"]),
                "expressions_wiki": len(data["wiki"]["expressions"]),
                "culture_wiki": len(data["wiki"]["culture"]),
                "sources_wiki": len(data["wiki"]["sources"]),
                "study_plan_wiki": len(data["wiki"]["study_plan"]),
                "raw_sources": data["raw_sources_count"],
                "coverage_percent": data["coverage"]["coverage_percent"],
                "gaps": len(data["coverage"]["gaps"]),
            },
        }
        overview["languages"].append(lang_summary)
        overview["totals"]["stages"] += data["coverage"]["total_stages"]
        overview["totals"]["corpus"] += data["corpus"]["total"]
        overview["totals"]["wiki_materials"] += data["coverage"]["wiki_materials"]
        overview["totals"]["raw_sources"] += data["raw_sources_count"]
        overview["totals"]["vocab_words"] += len(data["wiki"]["vocabulary"])
        overview["totals"]["expressions"] += len(data["wiki"]["expressions"])
        overview["totals"]["culture"] += len(data["wiki"]["culture"])
        for tier, count in data["coverage"]["stages_by_tier"].items():
            overview["tiers"][tier] = overview["tiers"].get(tier, 0) + count

    return overview


def generate_language_data(lang_name: str, lang_code: str) -> dict:
    """Generate complete data for one language."""
    print(f"Processing {lang_name} ({lang_code})...")

    wiki_data = scan_language_wiki(lang_name)
    raw_sources = scan_raw_sources(lang_name)
    corpus_data = parse_game_corpus(lang_code)
    stages_data = parse_game_stages(lang_code)
    coverage = compute_coverage(lang_code, wiki_data, corpus_data, stages_data)
    coverage["raw_sources"] = len(raw_sources)

    meta = LANG_META[lang_code]

    return {
        "code": lang_code,
        "meta": meta,
        "wiki": wiki_data,
        "raw_sources": raw_sources,
        "raw_sources_count": len(raw_sources),
        "corpus": corpus_data,
        "stages": stages_data,
        "coverage": coverage,
        "generated_at": datetime.now().isoformat(),
    }


def main():
    DASHBOARD_DATA.mkdir(parents=True, exist_ok=True)

    all_lang_data = {}

    for lang_name, lang_code in LANG_CODES.items():
        data = generate_language_data(lang_name, lang_code)
        all_lang_data[lang_code] = data

        # Write per-language JSON
        output_path = DASHBOARD_DATA / f"{lang_code}.json"
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"  ✓ {output_path.relative_to(GAME_ROOT)}")

    # Write overview JSON
    overview = generate_overview(all_lang_data)
    overview_path = DASHBOARD_DATA / "overview.json"
    with open(overview_path, "w", encoding="utf-8") as f:
        json.dump(overview, f, ensure_ascii=False, indent=2)
    print(f"  ✓ {overview_path.relative_to(GAME_ROOT)}")

    print("\n=== Summary ===")
    print(f"Languages: {len(all_lang_data)}")
    print(f"Total stages: {overview['totals']['stages']}")
    print(f"Total corpus entries: {overview['totals']['corpus']}")
    print(f"Total wiki materials: {overview['totals']['wiki_materials']}")
    print(f"Total raw sources: {overview['totals']['raw_sources']}")


if __name__ == "__main__":
    main()
