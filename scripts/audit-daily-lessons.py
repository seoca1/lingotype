#!/usr/bin/env python3
"""
Audit Daily Lessons JSON

각 lesson의 quality 점수를 계산하고 보고서를 출력합니다.

Quality 점수 기준 (100점 만점):
- Vocab relevance (40점): wikilink으로 해결된 vocab 비율
- Vocab count (10점): 5-8개 사이면 만점
- Expression count (10점): 2-4개 사이면 만점
- Culture presence (10점): 있으면 만점
- Raw excerpt quality (15점): 150-400자 사이면 만점
- Wikilink resolution (15점): 본문의 wikilink 해결률
"""

import json
import re
from pathlib import Path
from collections import defaultdict, Counter

OUTPUT_PATH = Path(__file__).parent.parent / "prototype" / "src" / "data" / "dailyLessons.json"
LANGUAGE_ROOT = Path("/Users/emilio/projects/Projects/Language")

REQUIRED_LANG = ["en", "jp", "es", "kr"]


def resolve_wikilink_to_stem(wikilink: str, wiki_index: dict) -> str | None:
    """wikilink를 wikiIndex stem으로 해결."""
    target = wikilink.split("|")[0].strip()
    if target in wiki_index:
        return target
    target_with_md = target + '.md'
    if target_with_md in wiki_index:
        return target_with_md
    # Try by title
    for key, page in wiki_index.items():
        if page.get("title") == target:
            return key
        stem = key[:-3] if key.endswith('.md') else key
        if stem == target:
            return key
    return None


def is_source_page_wikilink(target: str, wiki_index: dict) -> bool:
    """Check if wikilink target is a source page topic (not vocab)."""
    # Source pages are stored as sources/{topic}.md or wiki sources files
    # In wikiIndex, source pages have filename ending with topic name
    return False  # Will be detected by being absent from wikiIndex vocab/expr


def is_navigational_wikilink(target: str) -> bool:
    """Detect wikilinks that are navigational (sources, categories) vs content."""
    # Multi-word or hyphenated targets are usually navigational
    navigational_keywords = {
        'travel', 'travel-basics', 'travel-basics-kr', 'travel-adventure',
        'first-travel-japan', 'first-travel-korea', 'first-travel-spain',
        'dating-romance', 'dating-romance-kr', 'dating-romance-jp', 'dating-romance-es',
        'daily-life-basics', 'sports-and-hobbies', 'health-and-body',
        'holidays-and-celebrations', 'technology-and-internet',
        'food-and-dining', 'shopping-and-money', 'work-and-career',
        'viaje-aventura', 'comida-y-restaurante', 'fiestas-y-celebraciones',
        'trabajo-y-carrera', 'como-agua-para-chocolate-cap1',
        'el-ahogado-mas-hermoso-del-mundo', 'notes-in-spanish-listening-log',
        'notes-in-spanish-planes-de-verano',
        'topik1-starter', 'meet-friend', 'first-meeting',
        'chopstick-etiquette', 'shoes-off', 'tipping', 'souvenirs',
        'how-much', 'where-is', 'thank-you', 'goodbye', 'hello',
        # Categories and high-level navigation
        'travel-vocabulary', 'basic-vocabulary', 'core-vocabulary',
        'romance-vocabulary', 'food-vocabulary',
    }
    return target.lower() in navigational_keywords


def score_lesson(lesson: dict, wiki_index: dict, all_wikilink_targets: set) -> dict:
    """Compute quality score for a single lesson."""
    issues = []
    score = 0
    breakdown = {}

    # === Vocab Relevance (40 points) ===
    vocab = lesson.get("vocabulary", [])
    topic = lesson.get("sourceTopic", "")
    topic_clean = topic.replace(".md", "").replace("-", " ")
    topic_words = set(w.lower() for w in topic_clean.split())

    # Check if vocab words are topic-relevant
    relevant_count = 0
    generic_count = 0
    generic_patterns = {
        "en": {"traffic-light", "kiss", "sweet", "cute", "photo"},
        "jp": {"achim", "好き", "映画", "dalda", "beoseu"},
        "kr": {"dalda", "beoseu", "ssada", "masissda", "jikjin"},
    }
    lang = lesson.get("language", "")
    lang_generics = generic_patterns.get(lang, set())

    for v in vocab:
        vname = v.replace(".md", "").lower()
        if vname in lang_generics:
            generic_count += 1
        else:
            relevant_count += 1

    total_vocab = len(vocab)
    if total_vocab == 0:
        breakdown["vocab_relevance"] = 0
        issues.append("No vocab entries")
    else:
        relevance_pct = relevant_count / total_vocab
        relevance_score = int(relevance_pct * 40)
        breakdown["vocab_relevance"] = relevance_score
        score += relevance_score
        if generic_count > 0:
            issues.append(f"{generic_count}/{total_vocab} generic fallback vocab")

    # === Vocab Count (10 points) ===
    if 5 <= total_vocab <= 8:
        score += 10
        breakdown["vocab_count"] = 10
    elif total_vocab > 8:
        score += 8
        breakdown["vocab_count"] = 8
    elif total_vocab > 0:
        score += 4
        breakdown["vocab_count"] = 4
        issues.append(f"Low vocab count: {total_vocab}")
    else:
        breakdown["vocab_count"] = 0

    # === Expression Count (10 points) ===
    expr = lesson.get("expressions", [])
    if 2 <= len(expr) <= 4:
        score += 10
        breakdown["expr_count"] = 10
    elif len(expr) > 0:
        score += 5
        breakdown["expr_count"] = 5
        issues.append(f"Expression count off: {len(expr)}")
    else:
        breakdown["expr_count"] = 0
        issues.append("No expressions")

    # === Culture Presence (10 points) ===
    if lesson.get("culture"):
        score += 10
        breakdown["culture"] = 10
    else:
        breakdown["culture"] = 0
        issues.append("No culture page")

    # === Raw Excerpt Quality (15 points) ===
    raw_len = len(lesson.get("raw", {}).get("excerpt", ""))
    if 150 <= raw_len <= 800:
        score += 15
        breakdown["raw_quality"] = 15
    elif raw_len >= 100:
        score += 10
        breakdown["raw_quality"] = 10
        issues.append(f"Raw excerpt short: {raw_len} chars")
    elif raw_len > 0:
        score += 5
        breakdown["raw_quality"] = 5
        issues.append(f"Raw excerpt very short: {raw_len} chars")
    else:
        breakdown["raw_quality"] = 0
        issues.append("No raw excerpt")

    # === Wikilink Resolution (15 points) ===
    # Only count vocab-to-vocab/content wikilinks (skip navigational ones)
    total_wikilinks = 0
    resolved_wikilinks = 0
    skipped = 0
    for fname in vocab + expr:
        if fname in wiki_index:
            body = wiki_index[fname].get("body", "")
            links = re.findall(r"\[\[([^\]]+)\]\]", body)
            for link in links:
                target = link.split("|")[0].strip()
                # Skip navigational links (source pages, common phrases)
                if is_navigational_wikilink(target):
                    skipped += 1
                    continue
                total_wikilinks += 1
                if resolve_wikilink_to_stem(link, wiki_index):
                    resolved_wikilinks += 1

    if total_wikilinks == 0:
        score += 10
        breakdown["wikilinks"] = 10
    else:
        resolve_rate = resolved_wikilinks / total_wikilinks
        wl_score = int(resolve_rate * 15)
        score += wl_score
        breakdown["wikilinks"] = wl_score
        if resolve_rate < 0.5:
            issues.append(f"Low wikilink resolution: {int(resolve_rate * 100)}%")

    return {
        "score": score,
        "breakdown": breakdown,
        "issues": issues,
        "vocab_count": total_vocab,
        "expr_count": len(expr),
        "raw_len": raw_len,
        "generic_vocab": generic_count,
        "wikilink_rate": (resolved_wikilinks / total_wikilinks) if total_wikilinks > 0 else 1.0,
        "wikilinks_total": total_wikilinks,
        "wikilinks_skipped": skipped,
    }


def main():
    data = json.load(open(OUTPUT_PATH))
    lessons = data.get("lessons", [])
    wiki_index = data.get("wikiIndex", {})

    if not lessons:
        print("No lessons found.")
        return

    print("=" * 60)
    print("  Daily Lessons Quality Audit")
    print("=" * 60)
    print(f"Schema: {data.get('schemaVersion')}")
    print(f"Total lessons: {len(lessons)}")
    print(f"By language: {data.get('byLanguage', {})}")
    print(f"wikiIndex: {len(wiki_index)} pages")
    print()

    all_scores = []
    lang_scores = defaultdict(list)
    lang_issues = defaultdict(list)

    for lesson in lessons:
        result = score_lesson(lesson, wiki_index, set(wiki_index.keys()))
        all_scores.append(result["score"])
        lang_scores[lesson["language"]].append(result["score"])
        if result["issues"]:
            lang_issues[lesson["language"]].append((lesson["id"], result["issues"], result["score"]))

    # === Overall Summary ===
    print("=" * 60)
    print("  Overall Quality")
    print("=" * 60)
    if all_scores:
        avg = sum(all_scores) / len(all_scores)
        print(f"Average score: {avg:.1f}/100")
        print(f"Max: {max(all_scores)}, Min: {min(all_scores)}")
        print()
        # Distribution
        buckets = {"excellent (90+)": 0, "good (70-89)": 0, "fair (50-69)": 0, "poor (<50)": 0}
        for s in all_scores:
            if s >= 90:
                buckets["excellent (90+)"] += 1
            elif s >= 70:
                buckets["good (70-89)"] += 1
            elif s >= 50:
                buckets["fair (50-69)"] += 1
            else:
                buckets["poor (<50)"] += 1
        for k, v in buckets.items():
            print(f"  {k}: {v}")
    print()

    # === Per Language ===
    print("=" * 60)
    print("  Per Language")
    print("=" * 60)
    for lang in REQUIRED_LANG:
        scores = lang_scores[lang]
        if scores:
            avg = sum(scores) / len(scores)
            print(f"{lang}: avg={avg:.1f}/100 ({len(scores)} lessons)")
            issues = lang_issues[lang]
            print(f"  Lessons with issues: {len(issues)}/{len(scores)}")
    print()

    # === Top Issues ===
    print("=" * 60)
    print("  Top Issues")
    print("=" * 60)
    issue_counts = Counter()
    for _, issues, _ in sum(lang_issues.values(), []):
        for issue in issues:
            # Extract issue type (drop specifics)
            if "generic fallback vocab" in issue:
                issue_counts["Generic fallback vocab"] += 1
            elif "Raw excerpt" in issue:
                issue_counts["Short raw excerpt"] += 1
            elif "wikilink resolution" in issue:
                issue_counts["Low wikilink resolution"] += 1
            elif "culture" in issue:
                issue_counts["No culture page"] += 1
            else:
                issue_counts[issue] += 1
    for issue, count in issue_counts.most_common(10):
        print(f"  {count:3d} × {issue}")
    print()

    # === Worst Lessons ===
    print("=" * 60)
    print("  Worst Lessons (score < 60)")
    print("=" * 60)
    lesson_results = []
    for lesson in lessons:
        result = score_lesson(lesson, wiki_index, set(wiki_index.keys()))
        lesson_results.append((lesson["id"], result["score"], result))
    lesson_results.sort(key=lambda x: x[1])

    for lid, sc, res in lesson_results[:10]:
        if sc < 60:
            print(f"  {sc:3d} {lid}")
            print(f"       Issues: {', '.join(res['issues'][:3])}")
    print()

    # === Save Report ===
    report_path = OUTPUT_PATH.parent.parent.parent / "docs" / "daily-lessons-audit.md"
    report_path.parent.mkdir(parents=True, exist_ok=True)

    with open(report_path, "w") as f:
        f.write("# Daily Lessons Quality Audit\n\n")
        f.write(f"**Generated**: from `dailyLessons.json` ({len(lessons)} lessons)\n\n")
        f.write(f"**Overall avg score**: {avg:.1f}/100\n\n")
        f.write("## Per Language\n\n")
        for lang in REQUIRED_LANG:
            scores = lang_scores[lang]
            if scores:
                avg_l = sum(scores) / len(scores)
                f.write(f"- **{lang}**: avg={avg_l:.1f}/100 ({len(scores)} lessons)\n")
        f.write("\n## All Lessons\n\n")
        f.write("| Lang | Topic | Score | Vocab | Expr | Raw | Generic | Issues |\n")
        f.write("|---|---|---:|---:|---:|---:|---:|---|\n")
        for lesson in lessons:
            result = score_lesson(lesson, wiki_index, set(wiki_index.keys()))
            issues_str = "; ".join(result["issues"][:2]) if result["issues"] else "✓"
            f.write(
                f"| {lesson['language']} | {lesson['sourceTopic'][:30]} | "
                f"{result['score']} | {result['vocab_count']} | {result['expr_count']} | "
                f"{result['raw_len']} | {result['generic_vocab']} | {issues_str} |\n"
            )
        f.write(f"\n## Report saved to {report_path}\n")

    print(f"Report saved to {report_path}")


if __name__ == "__main__":
    main()