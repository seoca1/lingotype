# 캐릭터 이미지 생성 가이드

## 개요

LingoType 게임의 12개 캐릭터(4개 언어 × 3명)에 대한 AI 이미지 생성 자동화 시스템.

---

## 캐릭터 목록

| 언어 | 캐릭터 | 컨셉 |
|------|--------|-------|
| **EN** | Emily | Modern American Girl |
| **EN** | Oliver | British Gentleman |
| **EN** | Sophia | Tech-savvy Modern Girl |
| **JP** | Sakura | Traditional Japanese Girl |
| **JP** | Yuki | Modern Japanese School Girl |
| **JP** | Kaito | Cool Japanese Boy |
| **ES** | Isabella | Flamenco Dancer |
| **ES** | Carlos | Modern Spanish Youth |
| **ES** | Luna | Barcelona Artist |
| **KR** | Hana | Traditional Hanbok Girl |
| **KR** | Minho | K-pop Idol Style |
| **KR** | Jiwoo | Modern Korean Gamer Girl |

---

## 이미지 생성 스크립트

**위치**: `characters/scripts/generate_characters.py`

### 지원 백엔드

| 백엔드 | 비용 | 명령어 |
|--------|------|--------|
| **OpenAI** (추천) | 유료 (약 $0.01/장) | `--backend openai` |
| HuggingFace | 무료 (Rate limit) | `--backend huggingface` |
| Stable Diffusion WebUI | 무료 (로컬 GPU) | `--backend webui` |
| Replicate | 유료 | `--backend replicate` |
| MiniMax | 미지원 (API 키 오류) | — |

### OpenAI 백엔드 사용법

```bash
cd characters/scripts

# 환경변수 설정
export OPENAI_API_KEY="sk-proj-..."

# 전체 캐릭터 생성 (12명 × 7포즈 = 84장)
python3 generate_characters.py --backend openai --token "$OPENAI_API_KEY" --all

# 특정 언어만
python3 generate_characters.py --backend openai --token "$OPENAI_API_KEY" --language kr

# 특정 캐릭터만
python3 generate_characters.py --backend openai --token "$OPENAI_API_KEY" --character kr-hana
```

### 포즈 종류

| 포즈 | 설명 | 사용 시점 |
|------|------|----------|
| `idle` | 대기姿态 | 기본 |
| `wave` | 손 흔들기 | 스테이지 시작 |
| `jump` | 점프 | 격파 시 |
| `dance` | 춤 | 클리어 시 |
| `clap` | 박수 | celebrations |
| `spin` | 회전 | ES Isabella |
| `pose` | 포즈 | victory |

---

## 프롬프트 구조

### 영어 캐릭터 예시 (Emily)

```python
"en-emily": {
    "idle": CharacterPrompt(
        character_id="en-emily",
        name="Emily",
        pose="idle",
        prompt="""
        masterpiece, best quality, highly detailed,
        1girl, solo, full body, standing,
        blonde hair, long wavy hair, blue eyes,
        smiling, friendly expression,
        casual outfit, hoodie, jeans, sneakers,
        white background, simple background,
        anime style, clean lines, vibrant colors,
        professional illustration
        """.strip(),
        negative_prompt=NEGATIVE_PROMPT,
    ),
    ...
}
```

### 공통 네거티브 프롬프트

```python
NEGATIVE_PROMPT = """
lowres, bad anatomy, bad hands, text, error, missing fingers,
extra digit, fewer digits, cropped, worst quality, low quality,
normal quality, jpeg artifacts, signature, watermark, username,
blurry, artist name, multiple views, multiple angles, split screen
""".strip()
```

---

## 이미지 저장 구조

```
prototype/public/characters/
├── en/
│   ├── emily/
│   │   ├── idle.png    (AI 생성, 1024×1536)
│   │   ├── wave.png
│   │   ├── jump.png
│   │   ├── clap.png
│   │   ├── spin.png
│   │   ├── dance.png
│   │   └── pose.png
│   ├── oliver/
│   └── sophia/
├── jp/
│   ├── sakura/
│   ├── yuki/
│   └── kaito/
├── es/
│   ├── isabella/
│   ├── carlos/
│   └── luna/
└── kr/
    ├── hana/
    ├── minho/
    └── jiwoo/
```

---

## 설정 파일

**`prototype/src/config/characterImages.ts`** — 캐릭터별 이미지 경로 및 크기 매핑

```typescript
export const CHARACTER_IMAGES: Record<string, CharacterImageSet> = {
  'en-emily': {
    idle: {
      src: '/lingotype/characters/en/emily/idle.png',
      width: 1024,
      height: 1536,
      scale: 0.85,
      offsetY: -60,
    },
    wave: { src: '...', width: 300, height: 450, ... },
    jump: { src: '...', width: 300, height: 450, ... },
    clap: { src: '...', width: 300, height: 450, ... },
    spin: { src: '...', width: 300, height: 450, ... },
    dance: { src: '...', width: 300, height: 450, ... },
    pose: { src: '...', width: 300, height: 450, ... },
  },
  // ... 12개 캐릭터 전체
};
```

---

## API 키 발급

### OpenAI (권장)

1. https://platform.openai.com/api-keys 방문
2. **Create new secret key** 클릭
3. 이름: `character-generator`
4. **Copy** — 다시 볼 수 없음
5. 사용: `--token 'sk-proj-...'`

### HuggingFace (무료)

1. https://huggingface.co/settings/tokens 방문
2. **New Token** 클릭
3. 이름: `character-gen`, Role: `Read`
4. 사용: `--token 'hf_...'`

---

## 현재 상태 (2026-07-08)

| 항목 | 상태 |
|------|------|
| **스크립트** | ✅ 5개 백엔드 지원 (OpenAI/HF/SD/Replicate/MiniMax) |
| **프롬프트** | ✅ 12 캐릭터 × 46 포즈 정의 |
| **테스트** | ✅ 680 passed |
| **빌드** | ✅ 986.54 KB |
| **이미지** | ✅ 125+ PNG 존재 |

---

## 알려진 문제

| 문제 | 해결 |
|------|------|
| MiniMax API 오류 (2049) | MiniMax 키 유효하지 않음 — OpenAI 사용 권장 |
| HuggingFace DNS 오류 | 네트워크 제한 — 로컬 SD 또는 OpenAI 사용 |
| 이미지 중복 생성 | 스크립트가 기존 파일 자동 스킵 (`⊙ 스킵`) |

---

## 관련 문서

- `characters/docs/AI_CHARACTER_PROMPTS.md` — 상세 프롬프트 가이드 (932줄)
- `characters/docs/CHARACTER_IMAGE_GUIDE.md` — 이미지 사용 가이드
- `characters/docs/STABLE_DIFFUSION_SETUP.md` — SD WebUI 설치
- `characters/README.md` — 캐릭터 시스템 개요

---

*최종 갱신: 2026-07-08*
