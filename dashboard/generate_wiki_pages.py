#!/usr/bin/env python3
"""
Generate LLM Wiki vocabulary pages from raw source files.

Creates one .md file per word in wiki/{Lang}/vocabulary/
following the LLM Wiki pattern.
"""

import os
import re
from pathlib import Path

LANGUAGE_ROOT = Path("/Users/emilio/projects/opencodework/Language")

WORD_DATA = {
    "Korean": {
        "raw_file": "first-travel-japan.md",
        "vocab_template": """
# {romaja} ({display})

**Part of Speech:** 명사 (noun)

**Definition:** {meaning}

**Romaja:** {romaja}

**Language of Origin:** 일본어 ({display})

## Examples

- **{romaja} はどこですか?** — {display}는 어디인가요?
- **{display}**은(는) 실전 여행에서 자주 쓰이는 표현.

## Related Terms

- [[{first_related}]]
- [[travel]]

## Sources

- [[first-travel-japan]]
- [[travel-basics-kr]]
""",
        "words": [
            # (display, romaja, meaning)
            ("空港", "kuukou", "공항"),
            ("パスポート", "pasupooto", "여권"),
            ("入国審査", "nyuukoku shinsa", "입국심사"),
            ("税関", "zeikan", "세관"),
            ("荷物", "nimotsu", "짐, 수하물"),
            ("出口", "deguchi", "출구"),
            ("入口", "iriguchi", "입구"),
            ("予約", "yoyaku", "예약"),
            ("ホテル", "hoteru", "호텔"),
            ("部屋", "heya", "방, 객실"),
            ("朝食", "choushoku", "아침 식사"),
            ("注文", "chuumon", "주문"),
            ("会計", "kaikei", "계산"),
            ("駅", "eki", "역"),
            ("地下鉄", "chikatetsu", "지하철"),
            ("電車", "densha", "전철"),
            ("バス", "basu", "버스"),
            ("タクシー", "takushii", "택시"),
            ("新幹線", "shinkansen", "신칸센"),
            ("切符", "kippu", "표"),
            ("左", "hidari", "왼쪽"),
            ("右", "migi", "오른쪽"),
            ("まっすぐ", "massugu", "직진"),
            ("交差点", "kousaten", "교차로"),
            ("信号", "shingou", "신호등"),
            ("近く", "chikaku", "가까이"),
            ("遠く", "tooku", "멀리"),
            ("寺", "tera", "절"),
            ("神社", "jinja", "신사"),
            ("博物館", "hakubutsukan", "박물관"),
            ("公園", "kouen", "공원"),
            ("山", "yama", "산"),
            ("海", "umi", "바다"),
            ("写真", "shashin", "사진"),
            ("地図", "chizu", "지도"),
            ("両替", "ryougae", "환전"),
            ("安い", "yasui", "싸다"),
            ("高い", "takai", "비싸다"),
            ("おいしい", "oishii", "맛있다"),
            ("辛い", "karai", "맵다"),
            ("甘い", "amai", "달다"),
            ("冷たい", "tsumetai", "차갑다"),
            ("熱い", "atsui", "뜨겁다"),
        ],
    },
    "English": {
        "vocab_template": """
# {word}

**Part of Speech:** noun

**Definition:** {meaning}

**Language of Origin:** English

## Examples

- **Where is the {word}?** — {display}은(는) 어디인가요?
- **{display}** is essential for travel.

## Related Terms

- [[{first_related}]]
- [[travel]]

## Sources

- [[first-travel-japan]]
- [[travel-basics]]
""",
        "words": [
            ("airport", "공항"),
            ("passport", "여권"),
            ("immigration", "입국심사"),
            ("customs", "세관"),
            ("luggage", "짐, 수하물"),
            ("baggage", "수하물"),
            ("suitcase", "여행 가방"),
            ("exit", "출구"),
            ("entrance", "입구"),
            ("reservation", "예약"),
            ("hotel", "호텔"),
            ("room", "방"),
            ("breakfast", "아침 식사"),
            ("restaurant", "식당"),
            ("menu", "메뉴"),
            ("order", "주문"),
            ("bill", "계산서 (US: check)"),
            ("tip", "팁"),
            ("station", "역"),
            ("subway", "지하철"),
            ("train", "기차"),
            ("bus", "버스"),
            ("taxi", "택시"),
            ("ticket", "표"),
            ("left", "왼쪽"),
            ("right", "오른쪽"),
            ("straight", "직진"),
            ("intersection", "교차로"),
            ("traffic light", "신호등"),
            ("near", "가까이"),
            ("far", "멀리"),
            ("temple", "절"),
            ("shrine", "신사"),
            ("museum", "박물관"),
            ("park", "공원"),
            ("mountain", "산"),
            ("sea", "바다"),
            ("photo", "사진"),
            ("map", "지도"),
            ("guide", "가이드"),
            ("cheap", "싸다"),
            ("expensive", "비싸다"),
            ("delicious", "맛있다"),
            ("spicy", "맵다"),
            ("sweet", "달다"),
            ("cold", "차갑다"),
            ("hot", "뜨겁다"),
        ],
    },
    "Spanish": {
        "vocab_template": """
# {word}

**Part of Speech:** sustantivo masculino

**Definition:** {meaning}

**Language of Origin:** Español

## Examples

- **¿Dónde está el {word}?** — {display}은(는) 어디인가요?
- **{display}** es esencial para viajar.

## Related Terms

- [[{first_related}]]
- [[viajes]]

## Sources

- [[first-travel-spain]]
""",
        "words": [
            ("aeropuerto", "공항"),
            ("pasaporte", "여권"),
            ("inmigración", "입국심사"),
            ("aduana", "세관"),
            ("equipaje", "짐, 수하물"),
            ("maleta", "여행 가방"),
            ("salida", "출구"),
            ("entrada", "입구/입장"),
            ("reserva", "예약"),
            ("hotel", "호텔"),
            ("habitación", "방"),
            ("desayuno", "아침 식사"),
            ("restaurante", "식당"),
            ("menú", "메뉴"),
            ("pedido", "주문"),
            ("cuenta", "계산서"),
            ("propina", "팁"),
            ("estación", "역"),
            ("metro", "지하철"),
            ("tren", "기차"),
            ("autobús", "버스"),
            ("taxi", "택시"),
            ("billete", "표"),
            ("izquierda", "왼쪽"),
            ("derecha", "오른쪽"),
            ("recto", "직진"),
            ("intersección", "교차로"),
            ("semáforo", "신호등"),
            ("cerca", "가까이"),
            ("lejos", "멀리"),
            ("catedral", "대성당"),
            ("museo", "박물관"),
            ("parque", "공원"),
            ("playa", "해변"),
            ("montaña", "산"),
            ("foto", "사진"),
            ("mapa", "지도"),
            ("guía", "가이드"),
            ("barato", "싸다"),
            ("caro", "비싸다"),
            ("delicioso", "맛있다"),
            ("picante", "맵다"),
            ("dulce", "달다"),
            ("frío", "차갑다"),
            ("caliente", "뜨겁다"),
        ],
    },
    "Japanese": {
        "raw_file": "first-travel-korea.md",
        "vocab_template": """
# {display}

**Part of Speech:** 名詞 (명사)

**Definition:** {meaning}

**Romaji:** {romaji}

**Language of Origin:** 韓国語 (한국어)

## Examples

- **{display} はどこですか?** — {display}은(는) 어디인가요?
- **{display}**は旅行で必須です。

## Related Terms

- [[{first_related}]]
- [[travel]]

## Sources

- [[first-travel-korea]]
""",
        "words": [
            ("공항", "gonghang", "空港, 飛行場"),
            ("여권", "yeogwon", "パスポート"),
            ("입국심사", "ibguksimsa", "入国審査"),
            ("세관", "segwan", "税関"),
            ("짐", "jim", "荷物"),
            ("출구", "chulgu", "出口"),
            ("입구", "ipgu", "入口"),
            ("예약", "yeyak", "予約"),
            ("호텔", "hotel", "ホテル"),
            ("방", "bang", "部屋"),
            ("아침", "achim", "朝"),
            ("식당", "sikdang", "食堂"),
            ("주문", "jumun", "注文"),
            ("계산", "gyesan", "会計"),
            ("역", "yeog", "駅"),
            ("지하철", "jihacheol", "地下鉄"),
            ("기차", "gicha", "電車"),
            ("버스", "beoseu", "バス"),
            ("택시", "taegsi", "タクシー"),
            ("표", "pyo", "切符"),
            ("왼쪽", "oenjjog", "左"),
            ("오른쪽", "oreunjjog", "右"),
            ("직진", "jigjin", "まっすぐ"),
            ("교차로", "gyocharo", "交差点"),
            ("신호등", "sinhodeung", "信号"),
            ("가까이", "gakkai", "近く"),
            ("멀리", "meolli", "遠く"),
            ("절", "jeol", "寺"),
            ("박물관", "bangmulgwan", "博物館"),
            ("공원", "gongwon", "公園"),
            ("산", "san", "山"),
            ("바다", "bada", "海"),
            ("사진", "sajin", "写真"),
            ("지도", "jido", "地図"),
            ("환전", "hwanjeon", "両替"),
            ("싸다", "ssada", "安い"),
            ("비싸다", "bissada", "高い"),
            ("맛있다", "masitda", "おいしい"),
            ("맵다", "maepda", "辛い"),
            ("달다", "dalda", "甘い"),
            ("차갑다", "chagapda", "冷たい"),
            ("뜨겁다", "tteugeopda", "熱い"),
        ],
    },
}


def safe_filename(s):
    """Convert word to safe filename."""
    s = s.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s]+", "-", s)
    return s


def main():
    for lang, data in WORD_DATA.items():
        vocab_dir = LANGUAGE_ROOT / "wiki" / lang / "vocabulary"
        vocab_dir.mkdir(parents=True, exist_ok=True)

        template = data["vocab_template"]
        words = data["words"]
        count = 0

        for word_tuple in words:
            word = word_tuple[0]
            meaning = word_tuple[-1]

            # Filename (romanized or ASCII)
            if len(word_tuple) == 3:
                display, romaji, meaning = word_tuple
                filename_base = romaji.split()[0]  # First word for filename
            else:
                display, meaning = word_tuple
                filename_base = word

            # Handle multi-word romaji/display
            if len(word_tuple) == 3:
                first_related = words[1][0] if len(words) > 1 else "travel"
                content = template.format(
                    display=display,
                    romaja=romaji,
                    romaji=romaji,
                    word=word,
                    meaning=meaning,
                    first_related=first_related,
                )
            else:
                first_related = words[1][0] if len(words) > 1 else "viajes"
                content = template.format(
                    display=word,
                    word=word,
                    meaning=meaning,
                    first_related=first_related,
                )

            filename = safe_filename(filename_base) + ".md"
            filepath = vocab_dir / filename

            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content.strip() + "\n")
            count += 1

        print(f"  {lang}: {count} vocabulary pages created")


if __name__ == "__main__":
    print("Generating LLM Wiki vocabulary pages...")
    main()
    print("Done!")
