# Corpus Sync Plan — Language Wiki → Game Corpus

**Date:** 2026-07-07
**Status:** Draft
**上游:** `Language/wiki/{Lang}/vocabulary/`
**下游:** `Game/lingotype/raw/{lang}_words.md`

---

## 1. 개요

Language Wiki XL mesh 확장 세션(2026-07-06)에서 추가된 항목을 Game LingoType corpus에 동기화한다.

### Gap 현황

| Corpus | 현재 | Wiki 신규 | 반영 필요 | 상태 |
|---------|------|-----------|---------|------|
| EN | 74 | 7 entries | **7** | 미반영 |
| ES | 74 | 25 entries | **25** | 미반영 |
| JP | 527 | 0 | **0** | — |
| KR | 1137 | 1 | **1** | 미반영 |

### 반영 필요 항목

#### EN (7개)
| Word | Category | CEFR Level | Notes |
|------|----------|------------|-------|
| face | body | A1 | EN/face.md created |
| chest | body | A1 | EN/chest.md created |
| aunt | family | A1 | EN/aunt.md created |
| baby | family | A1 | EN/baby.md created |
| cola | food | A1 | EN/cola.md created |
| pepper | food | A1 | EN/pepper.md created |
| vinegar | food | A1 | EN/vinegar.md created |

#### ES (25개)
| Word | Category | CEFR Level | Accent | Source Wiki |
|------|----------|------------|--------|-------------|
| pajaro | animal | A1 | loose (pájaro) | [[animals-vocabulary]] |
| vaca | animal | A1 | strict | [[animals-vocabulary]] |
| pez | animal | A1 | strict | [[animals-vocabulary]] |
| rana | animal | A1 | strict | [[animals-vocabulary]] |
| leon | animal | A1 | strict (león) | [[animals-vocabulary]] |
| conejo | animal | A1 | strict | [[animals-vocabulary]] |
| rio | nature | A1 | strict (río) | [[nature-vocabulary]] |
| lago | nature | A1 | strict | [[nature-vocabulary]] |
| montana | nature | A1 | strict (montaña) | [[nature-vocabulary]] |
| bosque | nature | A1 | strict | [[nature-vocabulary]] |
| cielo | nature | A1 | strict | [[nature-vocabulary]] |
| tierra | nature | A1 | strict | [[nature-vocabulary]] |
| fuego | nature | A1 | strict | [[nature-vocabulary]] |
| flor | nature | A1 | strict | [[nature-vocabulary]] |
| hoja | nature | A1 | strict | [[nature-vocabulary]] |
| luna | nature | A1 | strict | [[nature-vocabulary]] |
| lluvia | nature | A1 | strict | [[nature-vocabulary]] |
| arcoiris | nature | A1 | strict (arcoíris) | [[nature-vocabulary]] |
| nieve | nature | A1 | strict | [[nature-vocabulary]] |
| estrella | nature | A1 | strict | [[nature-vocabulary]] |
| tormenta | nature | A1 | strict | [[nature-vocabulary]] |
| sol | nature | A1 | strict | [[nature-vocabulary]] |
| trueno | nature | A1 | strict | [[nature-vocabulary]] |
| arbol | nature | A1 | strict (árbol) | [[nature-vocabulary]] |
| viento | nature | A1 | strict | [[nature-vocabulary]] |

#### KR (1개)
| Word | Category | TOPIK Level | Source Wiki |
|------|----------|-------------|-------------|
| 입술 | body | 1 | [[emotions-personality-vocabulary]] |

---

## 2. 작업 순서

### Phase 1: EN corpus 업데이트 (7개)
1. `raw/en_words.md`에 7개 항목 추가
2. `source: [corpus 단어 stem]` citations 추가
3. game-sync-check.py 실행确认

### Phase 2: ES corpus 업데이트 (25개)
1. `raw/es_words.md`에 25개 항목 추가
2. ES animal entries: category=animal, accentMode=strict/loose
3. ES nature entries: category=nature, accentMode=strict
4. `source: [corpus 단어 stem]` citations 추가
5. game-sync-check.py 실행确认

### Phase 3: KR corpus 업데이트 (1개)
1. `raw/kr_words.md`에 1개 항목 추가
2. `source: [[emotions-personality-vocabulary]]` citation 추가
3. game-sync-check.py 실행确认

### Phase 4: Final Verification
1. `python3 Language/scripts/game-sync-check.py` — 4/4 PASS 확인
2. `python3 Language/scripts/audit-wikilinks.py` — broken links 0 확인

---

## 3. 코퍼스 형식 참고

### EN 형식
```yaml
- { id: en_XXX, display: word, meaning: 뜻, level: 1, category: category, source: [corpus 단어 stem] }
```

### ES 형식
```yaml
- { id: es_XXX, display: palabra, meaning: 뜻, level: 1, category: category, accentMode: strict|loose|any, source: [[palabra]] }
```

### KR 형식
```yaml
- { id: kr_XXX, display: 단어, input: romaji, meaning: meaning, level: 1, category: category, source: "[[단어]]" }
```

---

## 4. 제약 사항

- `raw/` 디렉토리는 **읽기 전용** — 출처 표기 필수
- 모든 항목은 반드시 Language Wiki 페이지를 `source:`로 인용
- EN/ES는 CEFR level, KR은 TOPIK level 사용
- ES accentMode: strict(á é í ó ú ñ 직접 입력), loose(n 폴백 ok), any(둘 다)

---

## 5. 실제 결과

| Metric | Before | After | Δ |
|--------|--------|-------|---|
| EN corpus | 74 | 81 | +7 |
| ES corpus | 74 | 97 | +23 |
| KR corpus | 1137 | 1137 | +0 |
| Game sync | 4/4 PASS | 4/4 PASS | ✅ |

### 반영 결과

- **EN**: 7 entries added (face, chest, aunt, baby, cola, pepper, vinegar) ✅
- **ES**: 23 entries added (6 animals + 17 nature) ✅
  - SKIPPED: mar, playa (already in corpus), arbol, arcoiris (wiki page missing)
- **KR**: 0 entries added (입술 wiki page missing) ❌

### 최종 상태

| Check | Result |
|-------|--------|
| XL Mesh | 1393 entries, 0 bidirectional issues |
| Wikilinks | 0 broken links |
| Game sync | 4/4 PASS (EN 81, ES 97, JP 527, KR 1137) |
