#!/usr/bin/env python3
"""
Generate Language/wiki/{Lang}/index.md and log.md from filesystem.

LLM Wiki index convention:
- Vocabulary sections grouped by topic/theme
- Each entry is [[wikilink]] with name and meaning
"""

from pathlib import Path
from datetime import datetime

LANGUAGE_ROOT = Path("/Users/emilio/projects/Projects/Language")

LANG_NAMES = {
    "English": "English",
    "Japanese": "Japanese",
    "Spanish": "Spanish",
    "Korean": "Korean",
}

# Travel theme grouping
TRAVEL_TAGS = {
    "Korean": [
        "kuukou", "pasupooto", "nyuukoku", "zeikan", "nimotsu", "deguchi", "iriguchi",
        "yoyaku", "hoteru", "heya", "choushoku", "chuumon", "kaikei",
        "eki", "chikatetsu", "densha", "basu", "takushii", "shinkansen", "kippu",
        "hidari", "migi", "massugu", "kousaten", "shingou", "chikaku", "tooku",
        "tera", "jinja", "hakubutsukan", "kouen", "yama", "umi", "shashin",
        "chizu", "ryougae", "yasui", "takai", "oishii", "karai", "amai",
        "tsumetai", "atsui",
    ],
    "English": [
        "airport", "passport", "immigration", "customs", "luggage", "baggage",
        "suitcase", "exit", "entrance", "reservation", "hotel", "room",
        "breakfast", "restaurant", "menu", "order", "bill", "tip", "station",
        "subway", "train", "bus", "taxi", "ticket", "left", "right", "straight",
        "intersection", "traffic-light", "near", "far", "temple", "shrine",
        "museum", "park", "mountain", "sea", "photo", "map", "guide", "cheap",
        "expensive", "delicious", "spicy", "sweet", "cold", "hot",
    ],
    "Spanish": [
        "aeropuerto", "pasaporte", "inmigracion", "aduana", "equipaje", "maleta",
        "salida", "entrada", "reserva", "hotel", "habitacion", "desayuno",
        "restaurante", "menu", "pedido", "cuenta", "propina", "estacion",
        "metro", "tren", "autobus", "taxi", "billete", "izquierda", "derecha",
        "recto", "interseccion", "semaforo", "cerca", "lejos", "catedral",
        "museo", "parque", "playa", "montana", "foto", "mapa", "guia", "barato",
        "caro", "delicioso", "picante", "dulce", "frio", "caliente",
    ],
    "Japanese": [
        "gonghang", "yeogwon", "ibguksimsa", "segwan", "jim", "chulgu", "ipgu",
        "yeyak", "hotel", "bang", "achim", "sikdang", "jumun", "gyesan",
        "yeog", "jihacheol", "gicha", "beoseu", "taegsi", "pyo", "oenjjog",
        "oreunjjog", "jigjin", "gyocharo", "sinhodeung", "gakkai", "meolli",
        "jeol", "bangmulgwan", "gongwon", "san", "bada", "sajin", "jido",
        "hwanjeon", "ssada", "bissada", "masitda", "maepda", "dalda",
        "chagapda", "tteugeopda",
    ],
}


def parse_vocab(filepath: Path):
    """Extract first heading and definition from vocab page."""
    try:
        content = filepath.read_text(encoding="utf-8")
        title = ""
        meaning = ""
        for line in content.splitlines():
            if line.startswith("# "):
                title = line[2:].strip()
            elif "**Definition:**" in line:
                meaning = line.split("**Definition:**", 1)[1].strip()
                break
        return title, meaning
    except Exception:
        return filepath.stem, ""


def extract_title_from_filename(filename: str, lang: str):
    """Extract title from wiki link format."""
    name = filename.replace(".md", "")
    return name


def generate_index(lang: str):
    """Generate index.md for a language."""
    vocab_dir = LANGUAGE_ROOT / "wiki" / lang / "vocabulary"
    expr_dir = LANGUAGE_ROOT / "wiki" / lang / "expressions"
    source_dir = LANGUAGE_ROOT / "wiki" / lang / "sources"

    vocab_files = sorted(vocab_dir.glob("*.md"))
    expr_files = sorted(expr_dir.glob("*.md"))
    source_files = sorted(source_dir.glob("*.md"))

    travel_set = set(TRAVEL_TAGS.get(lang, []))
    travel_words = []
    other_words = []

    for vf in vocab_files:
        name = vf.stem
        title, meaning = parse_vocab(vf)
        display = title.split(" ", 1)[0] if title else name  # first word before space
        entry = f"- [[{name}]] - {display} — {meaning}"

        if name in travel_set:
            travel_words.append(entry)
        else:
            other_words.append(entry)

    # Expressions
    expr_entries = []
    for ef in expr_files:
        name = ef.stem
        title, meaning = parse_vocab(ef)
        expr_entries.append(f"- [[{name}]] - {meaning}")

    # Sources
    source_entries = []
    for sf in source_files:
        name = sf.stem
        source_entries.append(f"- [[{name}]]")

    today = datetime.now().strftime("%Y-%m-%d")

    index = f"""# {LANG_NAMES.get(lang, lang)} Learning Wiki - Index

Last updated: {today}

## Vocabulary ({len(vocab_files)} entries)

### Travel (첫 여행 경험) ({len(travel_words)} entries)

{chr(10).join(travel_words) if travel_words else "*No travel entries yet.*"}

### Other ({len(other_words)} entries)

{chr(10).join(other_words) if other_words else "*No other entries yet.*"}

## Expressions ({len(expr_files)} entries)

{chr(10).join(expr_entries) if expr_entries else "*No expression entries yet.*"}

## Sources ({len(source_files)} processed)

{chr(10).join(source_entries) if source_entries else "*No sources processed yet.*"}

---

## Quick Start

To learn {lang}:

1. Start with **Vocabulary > Travel** — basic words for first travel
2. Practice **Expressions** — common phrases
3. Read **Sources** — original travel journals and notes
4. Use the **typing game** to practice (see: Game/lingotype/)
"""

    (LANGUAGE_ROOT / "wiki" / lang / "index.md").write_text(index, encoding="utf-8")
    print(f"  {lang}/index.md: {len(vocab_files)} vocab, {len(expr_files)} expr, {len(source_files)} source")


def generate_log_entry(lang: str, entry_text: str):
    """Append entry to log.md."""
    log_path = LANGUAGE_ROOT / "wiki" / lang / "log.md"

    today = datetime.now().strftime("%Y-%m-%d")
    entry = f"## [{today}] ingest | {entry_text}\n\n"

    if log_path.exists():
        content = log_path.read_text(encoding="utf-8")
    else:
        content = f"# {lang} Learning Wiki - Log\n\n"

    # Insert at top after header
    if content.startswith("# "):
        lines = content.split("\n", 2)
        if len(lines) >= 2:
            header = lines[0]
            rest = lines[2] if len(lines) > 2 else ""
            content = f"{header}\n\n{entry}{rest}"
        else:
            content = f"{content}\n\n{entry}"
    else:
        content = content + "\n" + entry

    log_path.write_text(content, encoding="utf-8")
    print(f"  {lang}/log.md: appended entry")


def main():
    print("Generating LLM Wiki index.md and log.md...")

    for lang in ["English", "Japanese", "Spanish", "Korean"]:
        generate_index(lang)

    # Log entries
    log_entries = {
        "English": "first-travel-japan | Korean traveler's perspective on Japan",
        "Japanese": "first-travel-korea | Japanese traveler's perspective on Korea",
        "Spanish": "first-travel-spain | Spanish first travel experience",
        "Korean": "first-travel-japan | First Japan travel experience vocabulary",
    }

    for lang, entry in log_entries.items():
        generate_log_entry(lang, entry)

    print("Done!")


if __name__ == "__main__":
    main()
