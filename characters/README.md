# 🎨 캐릭터 시스템

언어별 캐릭터 이미지 생성 및 관리 시스템입니다.

---

## 📁 폴더 구조

```
characters/
├── README.md                         # 이 파일
├── QUICKSTART.md                     # 30분 빠른 시작 가이드
├── docs/                             # 문서
│   ├── AI_CHARACTER_PROMPTS.md      # AI 프롬프트 (932줄)
│   ├── CHARACTER_IMAGE_GUIDE.md     # 이미지 사용 가이드
│   ├── CHARACTER_GENERATION.md       # 생성 자동화 가이드 (NEW!)
│   ├── STABLE_DIFFUSION_SETUP.md    # SD WebUI 설치 가이드
│   ├── GEMINI_IMAGE_GENERATION.md   # Gemini 사용 가이드
│   └── CHATGPT_IMAGE_GENERATION.md  # ChatGPT/DALL-E 가이드
└── scripts/                          # 자동화 스크립트
    ├── README.md                    # 스크립트 사용법
    ├── generate_characters.py       # 이미지 자동 생성 (5개 백엔드)
    ├── test_api.py                 # API 연결 테스트
    └── requirements.txt             # Python 의존성
```

---

## 🌍 캐릭터 구성

### 총 12명 (4개 언어 × 3명)

**영어 (EN):**
- Emily - Modern American Girl
- Oliver - British Gentleman
- Sophia - Tech Expert

**일본어 (JP):**
- Sakura (さくら) - Traditional Girl
- Yuki (ゆき) - School Girl
- Kaito (かいと) - Cool Boy

**스페인어 (ES):**
- Isabella - Flamenco Dancer
- Carlos - Spanish Youth
- Luna - Barcelona Artist

**한국어 (KR):**
- Hana (하나) - Traditional Hanbok Girl
- Minho (민호) - K-pop Idol
- Jiwoo (지우) - Gamer Girl

---

## 🚀 빠른 시작

### ⚡ OpenAI 사용 (권장 — 5분)

```bash
# 1. API 키 발급
# https://platform.openai.com/api-keys

# 2. 이미지 생성 (5분)
cd scripts
python3 generate_characters.py --backend openai --token 'sk-proj-...' --all

# 3. 완료! (자동으로 public/characters/에 저장)
```

**→ `docs/CHARACTER_GENERATION.md` 참조!**

---

### 📖 지원 백엔드

| 백엔드 | 비용 | 속도 | 설정 |
|--------|------|------|------|
| **OpenAI** | 유료 | 빠름 | API 키만 |
| HuggingFace | 무료 | 보통 | API 키 + DNS 문제 |
| Stable Diffusion WebUI | 무료 | 매우 빠름 | 로컬 GPU 필요 |
| Replicate | 유료 | 보통 | API 키만 |

---

### 📖 상세 설정

**1. OpenAI API:**
```bash
# 발급: https://platform.openai.com/api-keys
export OPENAI_API_KEY="sk-proj-..."
```

**2. HuggingFace API (무료):**
```bash
# 발급: https://huggingface.co/settings/tokens
export HF_TOKEN="hf_..."
```

**3. Stable Diffusion WebUI:**
```bash
# 전체 설치 가이드
cat docs/STABLE_DIFFUSION_SETUP.md
```

**4. 이미지 생성:**
```bash
cd scripts

# 연결 테스트
python3 test_api.py --backend openai --token "$OPENAI_API_KEY"

# 모든 캐릭터 생성
python3 generate_characters.py --backend openai --token "$OPENAI_API_KEY" --all
```

**3. 게임 적용:**
```typescript
// prototype/src/config/characterImages.ts
export const USE_EXTERNAL_IMAGES = true;
```

**4. 빌드 & 배포:**
```bash
cd ../prototype
npm run build
# Deploy to GitHub Pages
```

---

### 🎨 고급: 커스터마이징

**프롬프트 수정:**
```bash
# AI 프롬프트 편집
nano docs/AI_CHARACTER_PROMPTS.md

# 특정 캐릭터 재생성
python3 scripts/generate_characters.py --character en-emily
```

**이미지 수동 추가:**
```bash
# 외부 이미지 사용
cp my_character.png prototype/public/characters/en/emily/idle.png
```

자세한 내용: `docs/CHARACTER_IMAGE_GUIDE.md`

---

## 📚 문서 목록

### 🚀 QUICKSTART.md (NEW!)
**30분 빠른 시작 가이드**

- 5분 Stable Diffusion 설정
- 이미지 생성 3가지 옵션
- 게임 활성화 단계
- 즉시 사용 가능한 명령어
- 트러블슈팅 요약

**대상:** 빠르게 시작하고 싶은 사용자

---

### 📖 docs/STABLE_DIFFUSION_SETUP.md (NEW!)
**완전한 Stable Diffusion WebUI 설치 가이드**

포함 내용:
- Windows/macOS/Linux 설치 가이드
- NVIDIA GPU / Apple Silicon / CPU 설정
- API 활성화 방법
- 모델 다운로드 및 관리
- 성능 최적화 팁
- 상세한 트러블슈팅
- 고급 설정 (ControlNet, LoRA 등)

**대상:** 처음 설치하는 사용자

---

### 🎨 docs/AI_CHARACTER_PROMPTS.md (600+ 줄)

**내용:**
- 12개 캐릭터 × 7개 포즈 프롬프트
- Stable Diffusion / Midjourney / NovelAI 설정
- 네거티브 프롬프트
- 생성 팁 & 트릭
- 파일 구조 가이드

**사용 시나리오:**
- AI 도구에 프롬프트 복사/붙여넣기
- 수동 이미지 생성
- 프롬프트 커스터마이징

### docs/CHARACTER_IMAGE_GUIDE.md

**내용:**
- 외부 이미지 사용 방법
- 이미지 준비 가이드
- 설정 파일 수정 방법
- 포즈별 설명
- 스프라이트 시트
- 문제 해결

**사용 시나리오:**
- 게임에 이미지 통합
- 설정 파라미터 조정
- 커스텀 캐릭터 추가

---

## 🤖 자동화 스크립트

### scripts/generate_characters.py

**기능:**
- 3가지 AI 백엔드 지원 (WebUI / Replicate / HuggingFace)
- 자동 이미지 생성
- 배치 처리
- 진행 상황 표시

**예시:**
```bash
# 단일 캐릭터
python3 generate_characters.py --backend webui --character en-emily

# 언어별 전체
python3 generate_characters.py --backend webui --language jp

# 모든 캐릭터
python3 generate_characters.py --backend webui --all
```

### scripts/test_api.py

**기능:**
- API 연결 테스트
- 인증 검증
- 빠른 생성 테스트

**예시:**
```bash
python3 test_api.py webui
python3 test_api.py replicate --token r8_xxx
```

자세한 내용은 `scripts/README.md` 참조

---

## 🎯 워크플로우

### Option 1: 자동 생성 (권장)

```bash
# 1. WebUI 실행
cd ~/stable-diffusion-webui
./webui.sh --api

# 2. 스크립트 실행
cd lingotype/characters/scripts
python3 generate_characters.py --backend webui --all

# 3. 게임 설정
# characterImages.ts → USE_EXTERNAL_IMAGES = true

# 4. 게임 실행
cd ../../prototype
npm run dev
```

### Option 2: 수동 생성

```bash
# 1. 프롬프트 복사
cat docs/AI_CHARACTER_PROMPTS.md

# 2. AI 도구에 붙여넣기
# Stable Diffusion / Midjourney / NovelAI

# 3. 이미지 저장
# prototype/public/characters/{lang}/{name}/

# 4. 게임 설정 및 실행
# (Option 1과 동일)
```

---

## 📊 현재 상태

### 구현 완료
- ✅ 12 캐릭터 설정 (characterImages.ts)
- ✅ AI 프롬프트 문서 (600+ 줄)
- ✅ 이미지 가이드 문서
- ✅ 자동 생성 스크립트
- ✅ 3가지 AI 백엔드
- ✅ 언어별 매핑
- ✅ 헬퍼 함수

### 프롬프트 준비됨
- ✅ en-emily (4 포즈)
- ✅ jp-sakura (2 포즈)
- ✅ kr-hana (1 포즈)

### 추가 필요
- ⏳ 나머지 9개 캐릭터 프롬프트
  - en-oliver, en-sophia
  - jp-yuki, jp-kaito
  - es-isabella, es-carlos, es-luna
  - kr-minho, kr-jiwoo

**할 일:**
- `docs/AI_CHARACTER_PROMPTS.md`에서 프롬프트 복사
- `scripts/generate_characters.py`에 추가
- 스크립트 실행

---

## 🎨 커스터마이징

### 새 캐릭터 추가

**1. 프롬프트 작성:**
```python
# scripts/generate_characters.py
CHARACTER_PROMPTS["my-character"] = {
    "idle": CharacterPrompt(
        character_id="my-character",
        name="MyName",
        pose="idle",
        prompt="...",
        negative_prompt=NEGATIVE_PROMPT,
    ),
}
```

**2. 설정 추가:**
```typescript
// prototype/src/config/characterImages.ts
CHARACTER_IMAGES["my-character"] = {
  idle: {
    src: '/characters/my/idle.png',
    width: 300,
    height: 400,
  },
};
```

**3. 생성:**
```bash
python3 generate_characters.py --backend webui --character my-character
```

### 포즈 추가

**기존 캐릭터에 포즈 추가:**
```python
CHARACTER_PROMPTS["en-emily"]["spin"] = CharacterPrompt(
    character_id="en-emily",
    name="Emily",
    pose="spin",
    prompt="... spinning pose ...",
    negative_prompt=NEGATIVE_PROMPT,
)
```

---

## 💡 팁

### 품질 향상
- steps: 30 → 50 (더 정교)
- cfg_scale: 7 → 10 (프롬프트 중시)
- 다른 모델 사용 (Anything V5, AbyssOrangeMix)

### 비용 절약
- WebUI 사용 (무료, 로컬)
- Replicate는 최종본만 (유료)
- HuggingFace는 테스트용 (무료, 느림)

### 시간 절약
- GPU 사용 (30초/이미지)
- 배치 스크립트 작성
- 프롬프트 재사용 (시드 고정)

---

## 🔗 관련 링크

**게임 설정:**
- `../prototype/src/config/characterImages.ts`

**문서:**
- `docs/AI_CHARACTER_PROMPTS.md`
- `docs/CHARACTER_IMAGE_GUIDE.md`

**스크립트:**
- `scripts/generate_characters.py`
- `scripts/test_api.py`
- `scripts/README.md`

**외부 자료:**
- Stable Diffusion WebUI: https://github.com/AUTOMATIC1111/stable-diffusion-webui
- Replicate: https://replicate.com
- Hugging Face: https://huggingface.co

---

## 📝 요약

**캐릭터 시스템은 3가지 방법으로 사용 가능:**

1. **자동 생성** (scripts/generate_characters.py)
   - 명령어 하나로 이미지 생성
   - 배치 처리 지원
   - 권장!

2. **수동 생성** (docs/AI_CHARACTER_PROMPTS.md)
   - 프롬프트 복사/붙여넣기
   - AI 도구에서 직접 생성
   - 커스터마이징에 유용

3. **기본 렌더링** (USE_EXTERNAL_IMAGES = false)
   - 이미지 없이도 작동
   - 프로그래매틱 렌더링
   - 개발 중에 유용

**모든 방법이 완벽하게 작동합니다!** 🎨✨
