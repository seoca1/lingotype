#!/usr/bin/env python3
"""
Build Daily Lessons - 일일 학습 콘텐츠 빌드 스크립트

Language wiki의 원본(raw) + 정리 자료(wiki)를 결합하여 게임에 표시할
일일 lesson JSON을 생성합니다.

데이터 흐름:
    Language/raw/{Lang}/*.md              ← 원본 자료 (드라마, 교재)
    Language/wiki/{Lang}/sources/*.md     ← 출처 개요 (hub)
    Language/wiki/{Lang}/vocabulary/*.md  ← 단어 페이지
    Language/wiki/{Lang}/expressions/*.md ← 표현 페이지
    Language/wiki/{Lang}/culture/*.md     ← 문화 노트
                ↓
    (이 스크립트: source hub를 중심으로 wiki 페이지들을 묶음)
                ↓
    prototype/src/data/dailyLessons.json ← 게임이 import하는 데이터

각 lesson = 1 source + 5-7 vocabulary + 2-3 expressions + 0-1 culture
"""

import json
import os
import re
from datetime import datetime
from pathlib import Path

# ============================================================================
# Configuration
# ============================================================================

LANGUAGE_ROOT = Path(os.environ.get(
    "LANGUAGE_ROOT",
    Path(__file__).parent.parent.parent.parent / "Language"
)).resolve()
GAME_ROOT = Path(os.environ.get(
    "GAME_ROOT",
    Path(__file__).parent.parent
)).resolve()
OUTPUT_PATH = GAME_ROOT / "prototype" / "src" / "data" / "dailyLessons.json"

LANG_CODES = {
    "English": "en",
    "Japanese": "jp",
    "Spanish": "es",
    "Korean": "kr",
}

# Lesson size constraints
TARGET_VOCAB_MIN = 5
TARGET_VOCAB_MAX = 8
TARGET_EXPR_MIN = 2
TARGET_EXPR_MAX = 4
RAW_EXCERPT_MIN = 80
RAW_EXCERPT_MAX = 600  # Multi-paragraph target length
MAX_LESSONS_PER_LANG = 30  # 30일 rotation 가능

# Cross-language keyword map for culture page matching
# Maps non-English (Korean/Japanese) source topic keywords → English culture stem keywords
TOPIC_KEYWORD_MAP: dict[str, list[str]] = {
    # Korean source topics → English culture keywords
    "korean": ["korean"],
    "기술": ["technology", "tech", "internet", "digital"],
    "건강": ["health", "medical", "body"],
    "몸": ["health", "body"],
    "명절": ["holidays", "celebrations", "festival"],
    "기념일": ["holidays", "celebrations"],
    "쇼핑": ["shopping", "money"],
    "돈": ["shopping", "money"],
    "일상": ["daily", "life"],
    "회화": ["daily", "life"],
    "스포츠": ["sports", "hobbies"],
    "취미": ["sports", "hobbies"],
    "여행": ["travel"],
    "식사": ["food", "dining"],
    "음식": ["food", "dining"],
    "연애": ["dating"],
    "일본": ["japanese"],
    "어학": ["language"],
    "비즈니스": ["business"],
    "일": ["business", "work"],
    "직장": ["business", "work"],
    "소통": ["communication"],
    "표현": ["communication", "expression"],
    "의사소통": ["communication"],
    # Japanese source topic tokens → culture stem keywords
    # (EN tokens map directly; these help cross-match JP mixed stems)
    "basics": ["daily", "life"],
    "hobbies": ["sports", "hobbies"],
    "work": ["business", "work"],
    # Spanish source topic tokens → culture stem keywords
    "fiestas": ["holidays", "celebrations", "festival"],
    "celebraciones": ["holidays", "celebrations", "festival"],
    "fiesta": ["holidays", "celebrations", "festival"],
    "viaje": ["travel"],
    "aventura": ["travel", "adventure"],
    "comida": ["food", "dining"],
    "restaurante": ["food", "dining"],
    "trabajo": ["business", "work"],
    "carrera": ["business", "work"],
    "trabajo-y-carrera": ["business", "work"],
    "el": [],  # noise word, skip
    "ahogado": [],  # noise word, skip
    "mas": [],  # noise word, skip
    "hermoso": [],  # noise word, skip
    "del": [],  # noise word, skip
    "mundo": [],  # noise word, skip
    "realismo": ["literature", "realism"],
    "magico": ["literature", "magic", "realism"],
    "marquez": ["literature", "magic"],
    "esquivel": ["literature"],
    "literatura": ["literature"],
    # Spanish source stems → culture keywords
    "el-ahogado-mas-hermoso-del-mundo": ["literature", "magic"],
    "viaje-aventura": ["travel"],
    "fiestas-y-celebraciones": ["holidays", "celebrations"],
    "comida-y-restaurante": ["food"],
    "trabajo-y-carrera": ["business", "work"],
}


# ============================================================================
# Markdown Parsing
# ============================================================================

def extract_title(md_text: str) -> str:
    """Extract H1 title from markdown."""
    for line in md_text.splitlines():
        line = line.strip()
        if line.startswith("# "):
            return line[2:].strip()
    return "Untitled"


def extract_source_excerpt(md_text: str, max_chars: int = 600) -> str:
    """Extract a rich excerpt from a source hub page.

    Source hub pages have structure like:
    - ## Summary / ## 概要 / ## 文脈 / ## Overview (brief overview)
    - ## Key Takeaways / ## 핵심 추출 사항 / ## 重要な抽出事項
    - ## Vocabulary Extracted / ## 어휘 / ## 語彙カテゴリー
    - ## Sources / ## 인용 / ## 出典

    This extracts Summary + Key Takeaways + Vocabulary Extracted
    for a rich raw excerpt.
    """
    lines = md_text.splitlines()
    in_first_section = False
    in_metadata = True
    paragraph_lines: list[str] = []
    # Multi-language section aliases
    included_sections = {
        # English
        "Summary", "Overview", "Key Takeaways", "Vocabulary Extracted",
        "Vocabulary", "Expressions Extracted",
        # Korean
        "개요", "요약", "핵심 추출 사항", "어휘 카테고리", "어휘",
        "표현", "인용",
        # Japanese (also accepts English headers since some JP source pages use English)
        "概要", "文脈", "重要な抽出事項", "語彙カテゴリー",
        "語彙", "表現", "原文", "重要な抽出",
        "Summary", "Overview", "Key Takeaways", "Vocabulary Extracted",
        "Vocabulary", "Expressions Extracted",
        # Spanish
        "Resumen", "Conclusiones Clave", "Vocabulario Extraído",
        "Vocabulario", "Expresiones Extraídas",
    }
    current_section = None
    stopped = False

    for line in lines:
        if stopped:
            break
        stripped = line.strip()

        if stripped.startswith("# "):
            continue

        if stripped.startswith("## "):
            section_name = stripped.lstrip("# ").strip()
            # Strip parenthetical like "(Travel journal)" for matching
            clean_name = section_name.split("(")[0].strip()
            if not in_first_section:
                in_first_section = True
                in_metadata = False
                current_section = clean_name
                if current_section in included_sections:
                    paragraph_lines.append(stripped)
                continue
            # Already in first section. New section heading.
            if current_section in included_sections and clean_name in included_sections:
                # Transition from one kept section to another — keep going
                current_section = clean_name
                paragraph_lines.append("")  # blank line between sections
                paragraph_lines.append(stripped)
            else:
                # Either leaving a kept section, or entering a non-kept section
                # — stop here.
                if paragraph_lines:
                    stopped = True
                break
            continue

        if stripped.startswith("### "):
            break

        if stripped == "---" or stripped.startswith("---"):
            continue

        if in_metadata and (
            stripped.startswith("**")
            or stripped == ""
        ):
            continue

        in_metadata = False
        if current_section in included_sections:
            paragraph_lines.append(stripped)

        body = "\n".join(paragraph_lines)
        if len(body) >= max_chars:
            break

    body = "\n".join(paragraph_lines).strip()
    if len(body) > max_chars:
        body = body[:max_chars].rsplit(".", 1)[0] + "."
    return body


def extract_first_paragraph(md_text: str, max_chars: int = 500) -> str:
    """Extract first meaningful paragraph from a markdown file.

    Strategy:
    1. Skip H1 + metadata block (lines starting with **)
    2. Skip horizontal rules (---) and empty lines
    3. If we hit ## before finding content, dive INTO the first ## section
       and extract its first paragraph (skipping any sub-headings ###)
    4. Stop at the next ## or after max_chars

    This handles two common patterns:
    - Old: metadata block, then `---`, then `## Section`, then content
    - New: metadata block, then `## Section`, then content
    """
    lines = md_text.splitlines()
    paragraph_lines = []
    in_metadata = True
    in_first_section = False

    for line in lines:
        stripped = line.strip()

        # Skip H1
        if stripped.startswith("# "):
            continue

        # Hit a new H2 section
        if stripped.startswith("## "):
            if in_first_section:
                # Already inside first section, this is the next one — stop
                break
            # Entering first ## section — start collecting from here
            in_first_section = True
            in_metadata = False
            continue

        # Stop at H3 only if we have enough content; otherwise allow H3
        # through so short sections can collect from H3 subsections too.
        if in_first_section and stripped.startswith("### "):
            # Check current body length
            current_len = len("\n".join(paragraph_lines))
            if current_len >= 100:
                break  # Enough content, stop at H3
            # Otherwise continue past H3 (the H3 header itself we skip)
            continue

        # Horizontal rule (---) acts as a section break — stop collecting
        # once we have content. (Both inside and outside metadata block.)
        if stripped == "---" or stripped.startswith("---"):
            if in_first_section and paragraph_lines:
                break
            continue

        # Skip metadata block lines and empty lines (only before first section)
        if in_metadata and (
            stripped.startswith("**")
            or stripped == ""
        ):
            continue

        # First non-metadata line starts the paragraph
        in_metadata = False
        paragraph_lines.append(stripped)

        # Stop if we got enough content
        body = "\n".join(paragraph_lines)
        if len(body) >= max_chars:
            break

    body = "\n".join(paragraph_lines).strip()
    if len(body) > max_chars:
        body = body[:max_chars].rsplit(".", 1)[0] + "."
    return body


def extract_wikilinks(text: str) -> list[str]:
    """Extract all [[wikilinks]] from markdown body."""
    return re.findall(r"\[\[([^\]]+)\]\]", text)


def extract_section_wikilinks(md_text: str, section_label: str) -> list[str]:
    """Extract wikilinks from a specific section (e.g., 'vocabulary 인용').

    Searches for `## {section_label}` or `### {section_label}` (or similar)
    and returns all wikilinks found in that section until the next
    ## / ### header or EOF.
    """
    lines = md_text.splitlines()
    links = []
    in_section = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("## ") or stripped.startswith("### "):
            section_name = stripped.lstrip("# ").lower()
            # Match section by partial keyword
            if section_label.lower() in section_name:
                in_section = True
                continue
            elif in_section:
                # Hit next section
                break
        if in_section:
            links.extend(extract_wikilinks(stripped))
    return links


def slugify(text: str) -> str:
    """Make a safe filename slug."""
    s = re.sub(r"[^\w\s-]", "", text.lower())
    s = re.sub(r"[\s_]+", "-", s).strip("-")
    return s[:50]


# ============================================================================
# Difficulty / Stage Helpers
# ============================================================================

CEFR_BY_TIER = {
    0: "A1",
    1: "A1-A2",
    2: "A2-B1",
    3: "B1-B2",
    4: "B2-C1",
    5: "C1-C2",
}


def compute_difficulty(related_stages: list[str], lang: str) -> dict:
    """Compute difficulty metadata from related stage IDs.

    Returns {tier, cefr, primaryStage} or empty dict if no stages found.
    """
    if not related_stages:
        return {}

    stages_path = GAME_ROOT / "prototype" / "src" / "data" / "stages.ts"
    if not stages_path.exists():
        return {}

    text = stages_path.read_text(encoding="utf-8")

    primary_stage = related_stages[0]
    stage_pattern = re.escape(primary_stage)
    tier_match = re.search(
        "id:\\s*'" + stage_pattern + "'[^}]+?tier:\\s*(\\d+)",
        text,
        re.DOTALL,
    )
    if not tier_match:
        # Try alternate pattern
        tier_match = re.search(
            "'" + stage_pattern + "'[^}]+?tier:\\s*(\\d+)",
            text,
        )
    if not tier_match:
        return {"primaryStage": primary_stage}

    tier = int(tier_match.group(1))
    return {
        "tier": tier,
        "cefr": CEFR_BY_TIER.get(tier, "B1"),
        "primaryStage": primary_stage,
    }


def find_raw_entry_ids(source_stem: str, lang: str) -> list[str]:
    """Find corpus entry IDs that reference a given source wikilink.

    Scans the corpus.ts file for entries whose `source:` field matches
    the source_stem (e.g., 'movie-quotes', 'literature-passages').
    """
    corpus_path = GAME_ROOT / "prototype" / "src" / "data" / "corpus.ts"
    if not corpus_path.exists():
        return []

    text = corpus_path.read_text(encoding="utf-8")
    entry_ids = []
    lang_prefix = lang + "_"

    # Match entries with source: [[source_stem]]
    # Pattern: id: 'en_xxx' ... source: [[movie-quotes]]
    escaped_stem = re.escape(source_stem)
    pattern = "(id:\\s*'(" + lang_prefix + "[^']+)')[^\\n]*source:\\s*\\[\\[" + escaped_stem + "\\]\\]"
    for m in re.finditer(pattern, text):
        entry_ids.append(m.group(2))

    return list(set(entry_ids))[:20]  # Limit to 20 IDs


# ============================================================================
# Wiki Scanner
# ============================================================================

def scan_wiki_pages(lang_dir: Path) -> dict:
    """Scan all wiki pages for a language.

    Pages are read directly from each category directory (vocabulary/, expressions/,
    culture/, sources/, jp-travel-vocab/). Vocabulary pages are stored flatly
    (e.g., vocabulary/meat.md) with category metadata handled via frontmatter or
    index pages. Topic aggregator pages (index.md) use their parent directory as
    stem.

    Returns:
    {
      "vocabulary": { "name": WikiPage, ... },
      "expressions": { "expr-id": WikiPage, ... },
      "culture": { "topic": WikiPage, ... },
      "sources": { "source": WikiPage, ... },
      "jp-travel-vocab": { "name": WikiPage, ... },  # KR only: Japanese
    }
    """
    result = {
        "vocabulary": {},
        "expressions": {},
        "culture": {},
        "sources": {},
    }

    for category in result.keys():
        cat_dir = lang_dir / category
        if not cat_dir.exists():
            continue
        # Recursively find all .md files in subdirectories
        for f in cat_dir.glob("**/*.md"):
            text = f.read_text(encoding="utf-8")
            # For index.md files (topic aggregators), use parent dir name as stem
            if f.stem == "index":
                stem = f.parent.name
                filename = str(f.relative_to(cat_dir))
            else:
                stem = f.stem
                filename = str(f.relative_to(cat_dir))
            result[category][stem] = {
                "stem": stem,
                "filename": filename,
                "title": extract_title(text),
                "body": text,
                "category": category.rstrip("s") if category != "sources" else "source",
                "sizeChars": len(text),
            }

    # EN + KR: jp-travel-vocab (Japanese phrases for EN/KR learners)
    jp_travel_dir = lang_dir / "jp-travel-vocab"
    if jp_travel_dir.exists():
        result["jp-travel-vocab"] = {}
        for f in jp_travel_dir.glob("**/*.md"):
            text = f.read_text(encoding="utf-8")
            stem = f.stem if f.stem != "index" else f.parent.name
            filename = str(f.relative_to(jp_travel_dir))
            result["jp-travel-vocab"][stem] = {
                "stem": stem,
                "filename": filename,
                "title": extract_title(text),
                "body": text,
                "category": "vocabulary",
                "sizeChars": len(text),
                "origin": "japanese",
            }

    return result


def scan_raw_files(raw_dir: Path) -> list[dict]:
    """Scan raw source files in a given raw directory.

    Args:
        raw_dir: Path to the language's raw directory (e.g.,
                 `Language/raw/English/`). This function expects
                 the dir to contain .md files directly, not nested.
    """
    if not raw_dir.exists():
        return []
    result = []
    for f in sorted(raw_dir.glob("*.md")):
        text = f.read_text(encoding="utf-8")
        result.append({
            "filename": f.name,
            "stem": f.stem,
            "title": extract_title(text),
            "body": text,
            "sizeChars": len(text),
        })
    return result


# ============================================================================
# Lesson Builder
# ============================================================================

def find_wikilink_target(wikilink: str, wiki: dict) -> str | None:
    """Resolve a wikilink to a wiki page stem, or None if not found.

    Wikilinks may be:
    - Exact stem: [[airport]] → "airport"
    - Stem with annotation: [[airport|the airport]] → "airport"
    - Title (Korean/display text): [[달다]] → match by title for KR
    - Display only: [[the airport]] (no match, just for display)
    """
    # Take first part before |
    target = wikilink.split("|")[0].strip()
    # Check if target matches a wiki stem (incl. jp-travel-vocab for KR)
    for category in ["vocabulary", "expressions", "culture", "sources", "jp-travel-vocab"]:
        if category in wiki and target in wiki[category]:
            return target
    # Fallback: match by title (for KR/JP where wikilinks use Korean/JP text)
    for category in ["vocabulary", "expressions", "culture", "sources", "jp-travel-vocab"]:
        if category in wiki:
            for stem, page in wiki[category].items():
                if page.get("title") == target:
                    return stem
    return None


def find_wikilink_category(wikilink: str, wiki: dict) -> str | None:
    """Find which category a wikilink belongs to."""
    target = wikilink.split("|")[0].strip()
    for category in ["vocabulary", "expressions", "culture", "sources", "jp-travel-vocab"]:
        if category in wiki and target in wiki[category]:
            return category
    # Try by title
    for category in ["vocabulary", "expressions", "culture", "sources", "jp-travel-vocab"]:
        if category in wiki:
            for stem, page in wiki[category].items():
                if page.get("title") == target:
                    return category
    return None


def build_lesson_from_source(
    source_page: dict,
    wiki: dict,
    lang: str,
    raw_page: dict | None = None,
) -> dict | None:
    """Build a single daily lesson from a source hub page.

    Source pages have sections like:
    - vocabulary 인용: [[word1]], [[word2]]
    - expression 인용: [[expr1]]
    - culture 인용: [[topic]]

    The lesson combines:
    - raw excerpt (from raw/{stem}.md) — original source material
    - wiki vocabulary / expressions / culture pages
    """
    body = source_page["body"]

    # Extract wikilinks from each section
    vocab_links = extract_section_wikilinks(body, "vocabulary 인용")
    vocab_links += extract_section_wikilinks(body, "어휘 인용")
    vocab_links += extract_section_wikilinks(body, "vocabulary citations")
    vocab_links += extract_section_wikilinks(body, "語彙引用")
    vocab_links += extract_section_wikilinks(body, "Citas de Vocabulario")
    # Also catch "Vocabulary Extracted", "Vocabulary", etc.
    vocab_links += extract_section_wikilinks(body, "vocabulary extracted")
    vocab_links += extract_section_wikilinks(body, "vocabulario")
    vocab_links += extract_section_wikilinks(body, "vocab")

    expr_links = extract_section_wikilinks(body, "expression 인용")
    expr_links += extract_section_wikilinks(body, "표현 인용")
    expr_links += extract_section_wikilinks(body, "expression citations")
    expr_links += extract_section_wikilinks(body, "表現引用")
    expr_links += extract_section_wikilinks(body, "Citas de Expresiones")

    culture_links = extract_section_wikilinks(body, "culture 인용")
    culture_links += extract_section_wikilinks(body, "문화 인용")
    culture_links += extract_section_wikilinks(body, "culture citations")
    culture_links += extract_section_wikilinks(body, "Citas Culturales")
    culture_links += extract_section_wikilinks(body, "Culture citations")

    # Also try generic [[wikilink]] catch from References section
    references_match = re.search(
        r"##\s+(?:인용|References|Citas|引用|인용\s*\(References\))\s*(?:\([^)]+\))?\s*\n([\s\S]+?)(?=\n## |\Z)",
        body, re.MULTILINE
    )
    if references_match:
        refs_text = references_match.group(1)
        # Don't duplicate
        already_found = set(vocab_links + expr_links + culture_links)
        for link in extract_wikilinks(refs_text):
            if link not in already_found:
                # Try to categorize heuristically
                target = find_wikilink_target(link, wiki)
                if not target:
                    continue
                # Check which category it lives in
                for cat in ["vocabulary", "jp-travel-vocab", "expressions", "culture", "sources"]:
                    if cat in wiki and target in wiki[cat]:
                        if cat in ("vocabulary", "jp-travel-vocab") and len(vocab_links) < TARGET_VOCAB_MAX:
                            vocab_links.append(link)
                        elif cat == "expressions" and len(expr_links) < TARGET_EXPR_MAX:
                            expr_links.append(link)
                        elif cat == "culture" and not culture_links:
                            culture_links.append(link)
                        break

    # Resolve wikilinks to actual wiki pages (vocab + jp-travel-vocab)
    vocab_pages = []
    seen_stems = set()
    for link in vocab_links:
        target = find_wikilink_target(link, wiki)
        if target and target not in seen_stems:
            seen_stems.add(target)
            # Check both vocab pools
            pool = wiki.get("vocabulary", {}) if target in wiki.get("vocabulary", {}) \
                else wiki.get("jp-travel-vocab", {})
            if target in pool:
                vocab_pages.append(pool[target])
        if len(vocab_pages) >= TARGET_VOCAB_MAX:
            break

    expr_pages = []
    for link in expr_links:
        target = find_wikilink_target(link, wiki)
        if target and target not in expr_pages:
            expr_pages.append(wiki["expressions"][target])
        if len(expr_pages) >= TARGET_EXPR_MAX:
            break

    culture_page = None
    for link in culture_links:
        target = find_wikilink_target(link, wiki)
        if target and target in wiki["culture"]:
            culture_page = wiki["culture"][target]
            break

    # Fallback: if no culture page found via wikilinks, use topic-keyword matching.
    # Pick the culture page whose stem has the most overlapping keywords with
    # the source stem. Only fall back to "dating" culture when nothing else
    # matches (dating is the most generic topic).
    if not culture_page and wiki["culture"]:
        source_stem = source_page["stem"].lower()
        source_keywords = set(source_stem.replace("-", " ").replace("_", " ").split())

        # Expand source keywords with cross-language mappings
        expanded_keywords: set[str] = set(source_keywords)
        # First check full stem (for compound Spanish stems like el-ahogado-...)
        if source_stem in TOPIC_KEYWORD_MAP:
            expanded_keywords.update(TOPIC_KEYWORD_MAP[source_stem])
        for kw in source_keywords:
            if kw in TOPIC_KEYWORD_MAP:
                expanded_keywords.update(TOPIC_KEYWORD_MAP[kw])

        # Score each culture page: count keyword overlaps between source and culture stem
        # Weight: exact token match > substring match
        best_match = None
        best_score = -1  # must have score >= 0 to be accepted
        dating_match = None

        for stem, page in wiki["culture"].items():
            culture_stem = stem.lower()
            culture_keywords = set(culture_stem.replace("-", " ").replace("_", " ").split())

            # Direct token overlap (use expanded keywords for cross-language match)
            overlap = len(expanded_keywords & culture_keywords)

            # Substring bonus: if a source keyword is contained in culture stem (or vice versa)
            substring_bonus = 0
            for kw in expanded_keywords:
                if len(kw) >= 3 and (kw in culture_stem or culture_stem in kw):
                    substring_bonus += 1
            for kw in culture_keywords:
                if len(kw) >= 3 and (kw in source_stem or source_stem in kw):
                    substring_bonus += 1

            score = overlap + substring_bonus * 0.5

            is_dating = "dating" in culture_stem or "恋愛" in culture_stem
            if is_dating and dating_match is None:
                dating_match = page

            if score > best_score:
                best_score = score
                best_match = page
            elif score == best_score and is_dating and dating_match is None:
                dating_match = page

        # Accept best match only if it has at least one meaningful keyword overlap.
        # Otherwise fall back to dating culture (lowest common denominator).
        if best_match and best_score >= 0.5:
            culture_page = best_match
        elif dating_match:
            culture_page = dating_match
            # Log only when non-dating topic gets forced to dating culture
            source_topic = source_page.get("title", source_page["stem"])
            print(f"  [culture fallback] '{source_topic}' → dating culture (no keyword match)")

    if len(vocab_pages) < TARGET_VOCAB_MIN:
        sorted_items = sorted(
            wiki["vocabulary"].items(),
            key=lambda kv: (".ko" in kv[0] or ".en" in kv[0] or ".es" in kv[0] or ".jp" in kv[0] or ".kr" in kv[0], kv[0])
        )
        for stem, page in sorted_items:
            if page not in vocab_pages:
                vocab_pages.append(page)
            if len(vocab_pages) >= TARGET_VOCAB_MIN:
                break

    # Fallback: if expressions too small
    if len(expr_pages) < TARGET_EXPR_MIN:
        sorted_exprs = sorted(
            wiki["expressions"].items(),
            key=lambda kv: (".ko" in kv[0] or ".en" in kv[0] or ".es" in kv[0] or ".jp" in kv[0] or ".kr" in kv[0], kv[0])
        )
        for stem, page in sorted_exprs:
            if page not in expr_pages:
                expr_pages.append(page)
            if len(expr_pages) >= TARGET_EXPR_MIN:
                break

    # Must have at least minimum content
    if not vocab_pages or not expr_pages:
        return None

    # Raw excerpt
    raw_excerpt = ""
    if raw_page:
        raw_excerpt = extract_first_paragraph(raw_page["body"], max_chars=RAW_EXCERPT_MAX)
    if len(raw_excerpt) < RAW_EXCERPT_MIN:
        # Use source page body excerpt as fallback — but include Key Takeaways
        # + Vocabulary list section for richer content.
        raw_excerpt = extract_source_excerpt(source_page["body"], max_chars=RAW_EXCERPT_MAX)

    # Estimate read time (rough: 200 chars/min for non-native)
    total_chars = len(raw_excerpt) + sum(
        p["sizeChars"] for p in vocab_pages + expr_pages + ([culture_page] if culture_page else [])
    )
    estimated_read_minutes = max(2, min(10, round(total_chars / 1500)))

    # Find related game stages (by category match)
    related_stages = find_related_stages(lang, source_page["stem"])

    # Compute difficulty metadata from related stages
    difficulty = compute_difficulty(related_stages, lang)

    # Build wiki output paths (for reporting which wiki pages were linked)
    wiki_vocab_pages = [p["filename"] for p in vocab_pages]
    wiki_expr_pages = [p["filename"] for p in expr_pages]
    wiki_culture_page = culture_page["filename"] if culture_page else None

    return {
        "id": f"{lang}_{source_page['stem']}_{datetime.now().strftime('%Y%m%d')}",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "language": lang,
        "sourceTopic": source_page["filename"],
        "difficulty": difficulty,
        "source": {
            "rawFile": f"Language/raw/{lang.capitalize()}/{raw_page['filename']}" if raw_page else "",
        },
        "raw": {
            "sourceFile": raw_page["filename"] if raw_page else "",
            "excerpt": raw_excerpt,
        },
        "wikiOutput": {
            "hubPage": f"Language/wiki/{lang.capitalize()}/sources/{source_page['filename']}",
            "vocabularyPages": wiki_vocab_pages,
            "expressionPages": wiki_expr_pages,
            "culturePage": wiki_culture_page,
        },
        "wiki": {
            "vocabulary": [
                {
                    "filename": p["filename"],
                    "title": p["title"],
                    "body": p["body"],
                    "category": p["category"],
                }
                for p in vocab_pages
            ],
            "expressions": [
                {
                    "filename": p["filename"],
                    "title": p["title"],
                    "body": p["body"],
                    "category": p["category"],
                }
                for p in expr_pages
            ],
            "culture": (
                {
                    "filename": culture_page["filename"],
                    "title": culture_page["title"],
                    "body": culture_page["body"],
                    "category": culture_page["category"],
                }
                if culture_page
                else None
            ),
        },
        "meta": {
            "estimatedReadMinutes": estimated_read_minutes,
            "relatedStages": related_stages,
        },
    }


def find_related_stages(lang: str, source_stem: str) -> list[str]:
    """Find game stages related to a wiki source.

    Heuristic: source stem usually contains the topic keyword
    (e.g., "dating-romance"). Match against stage IDs.
    """
    stages_path = GAME_ROOT / "prototype" / "src" / "data" / "stages.ts"
    if not stages_path.exists():
        return []

    text = stages_path.read_text(encoding="utf-8")
    related = []

    # Simple keyword matching
    keywords = source_stem.replace("-", " ").split()
    matched_categories = set()
    for keyword in keywords:
        if len(keyword) < 3:
            continue
        if "dating" in keyword or "romance" in keyword:
            matched_categories.add("d")  # romance tier
        elif "travel" in keyword:
            matched_categories.add("t")  # travel tier

    # If no category matched, return all stages for the language
    if not matched_categories:
        pattern = rf"id:\s*'({lang})_(\d+)_(\d+)'"
        for m in re.finditer(pattern, text):
            stage_id = m.group(1) + "_" + m.group(2) + "_" + m.group(3)
            related.append(stage_id)
    else:
        for cat in matched_categories:
            pattern = rf"id:\s*'({lang}_{cat})_(\d+)'"
            for m in re.finditer(pattern, text):
                related.append(m.group(1) + "_" + m.group(2))

    # Dedupe
    seen = set()
    unique = []
    for s in related:
        if s not in seen:
            seen.add(s)
            unique.append(s)
    return unique[:5]  # Max 5 related stages


# ============================================================================
# Main
# ============================================================================

def main():
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    all_lessons = []
    stats = {}

    for lang_name, lang_code in LANG_CODES.items():
        lang_dir = LANGUAGE_ROOT / "wiki" / lang_name
        if not lang_dir.exists():
            print(f"  ✗ {lang_name} ({lang_code}): wiki dir not found")
            continue

        # Scan all wiki pages
        wiki = scan_wiki_pages(lang_dir)
        # Scan raw files (raw dir is sibling of wiki dir)
        raw_files = scan_raw_files(LANGUAGE_ROOT / "raw" / lang_name)
        raw_by_stem = {r["stem"]: r for r in raw_files}

        # For each source page, build a lesson
        lang_lessons = []
        for stem, source_page in wiki["sources"].items():
            raw_page = raw_by_stem.get(stem)
            lesson = build_lesson_from_source(
                source_page=source_page,
                wiki=wiki,
                lang=lang_code,
                raw_page=raw_page,
            )
            if lesson:
                lang_lessons.append(lesson)
                if len(lang_lessons) >= MAX_LESSONS_PER_LANG:
                    break

        # Fallback: if no source pages found, build from each raw file
        if not lang_lessons and raw_files:
            print(f"  ⚠ {lang_name}: no source pages, building from raw files")
            for raw in raw_files:
                # Use raw file as lesson root
                pseudo_source = {
                    "filename": raw["filename"],
                    "body": raw["body"],
                    "title": raw["title"],
                    "stem": raw["stem"],
                }
                lesson = build_lesson_from_source(
                    source_page=pseudo_source,
                    wiki=wiki,
                    lang=lang_code,
                    raw_page=raw,
                )
                if lesson:
                    lang_lessons.append(lesson)
                    if len(lang_lessons) >= MAX_LESSONS_PER_LANG:
                        break

        # If still no lessons, build from vocabulary only (last resort)
        if not lang_lessons:
            print(f"  ⚠ {lang_name}: building minimal lessons from vocabulary")
            for stem, vocab_page in list(wiki["vocabulary"].items())[:MAX_LESSONS_PER_LANG]:
                pseudo_source = {
                    "filename": f"{stem}.md",
                    "body": vocab_page["body"],
                    "title": vocab_page["title"],
                    "stem": stem,
                }
                lesson = build_lesson_from_source(
                    source_page=pseudo_source,
                    wiki=wiki,
                    lang=lang_code,
                    raw_page=None,
                )
                if lesson:
                    lang_lessons.append(lesson)

        all_lessons.extend(lang_lessons)
        stats[lang_code] = {
            "count": len(lang_lessons),
            "vocab": sum(len(l["wiki"]["vocabulary"]) for l in lang_lessons),
            "expressions": sum(len(l["wiki"]["expressions"]) for l in lang_lessons),
            "culture": sum(1 for l in lang_lessons if l["wiki"]["culture"]),
        }

    # Build v1.1 compact output (deduplicated wiki index)
    wiki_index: dict = {}
    compact_lessons = []

    for lesson in all_lessons:
        wiki = lesson.get("wiki", {})
        # Add vocab pages to wikiIndex
        vocab_filenames = []
        for v in wiki.get("vocabulary", []):
            fname = v.get("filename")
            if not fname:
                continue
            wiki_index[fname] = {
                "title": v.get("title"),
                "body": v.get("body"),
                "category": v.get("category", "vocabulary"),
            }
            vocab_filenames.append(fname)
        # Add expression pages
        expr_filenames = []
        for e in wiki.get("expressions", []):
            fname = e.get("filename")
            if not fname:
                continue
            wiki_index[fname] = {
                "title": e.get("title"),
                "body": e.get("body"),
                "category": e.get("category", "expression"),
            }
            expr_filenames.append(fname)
        # Add culture page
        culture_filename = None
        c = wiki.get("culture")
        if c and c.get("filename"):
            culture_filename = c.get("filename")
            wiki_index[culture_filename] = {
                "title": c.get("title"),
                "body": c.get("body"),
                "category": c.get("category", "culture"),
            }
        compact_lessons.append({
            "id": lesson["id"],
            "date": lesson["date"],
            "language": lesson["language"],
            "sourceTopic": lesson["sourceTopic"],
            "difficulty": lesson.get("difficulty", {}),
            "source": lesson.get("source", {}),
            "raw": lesson["raw"],
            "wikiOutput": lesson.get("wikiOutput", {}),
            "vocabulary": vocab_filenames,
            "expressions": expr_filenames,
            "culture": culture_filename,
            "meta": lesson.get("meta", {}),
        })

    output = {
        "generatedAt": datetime.now().isoformat(),
        "schemaVersion": "1.2",
        "lessonCount": len(compact_lessons),
        "byLanguage": {
            code: sum(1 for l in compact_lessons if l["language"] == code)
            for code in LANG_CODES.values()
        },
        "wikiIndex": wiki_index,
        "lessons": compact_lessons,
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n=== Build Summary ===")
    print(f"Generated {len(all_lessons)} lessons at {OUTPUT_PATH.relative_to(GAME_ROOT)}")
    for code, s in stats.items():
        print(f"  {code}: {s['count']} lessons | {s['vocab']} vocab | {s['expressions']} expr | {s['culture']} culture")
    file_size_kb = OUTPUT_PATH.stat().st_size / 1024
    print(f"File size: {file_size_kb:.1f} KB")


if __name__ == "__main__":
    main()
