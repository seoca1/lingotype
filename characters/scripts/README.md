# 🤖 캐릭터 이미지 자동 생성 가이드

Python 스크립트를 사용해서 AI 이미지를 자동으로 생성하는 방법입니다.

---

## 📋 목차

1. [빠른 시작](#빠른-시작)
2. [설치](#설치)
3. [백엔드 선택](#백엔드-선택)
4. [사용법](#사용법)
5. [문제 해결](#문제-해결)

---

## 🚀 빠른 시작

### 방법 1: OpenAI (권장 — 가장 빠름)

```bash
# 1. API 키 발급: https://platform.openai.com/api-keys
export OPENAI_API_KEY="sk-proj-xxx..."

# 2. 스크립트 실행
python3 generate_characters.py --backend openai --token "$OPENAI_API_KEY" --all
```

### 방법 2: Stable Diffusion WebUI (무료, 로컬)

```bash
# 1. Stable Diffusion WebUI 실행 (--api 필수!)
cd ~/stable-diffusion-webui
./webui.sh --api

# 2. 스크립트 실행
cd lingotype/scripts
python3 generate_characters.py --backend webui --character en-emily
```

### 방법 3: Hugging Face (무료, 클라우드)

```bash
# API 토큰 발급: https://huggingface.co/settings/tokens
export HF_TOKEN="hf_xxx..."

python3 generate_characters.py --backend huggingface --character en-emily --token $HF_TOKEN
```

### 방법 4: Replicate (유료, 클라우드)

```bash
# API 토큰 발급: https://replicate.com/account/api-tokens
export REPLICATE_API_TOKEN="r8_xxx..."

python3 generate_characters.py --backend replicate --character en-emily --token $REPLICATE_API_TOKEN
```

---

## 💻 설치

### 1. Python 설치

**macOS:**
```bash
brew install python3
```

**Ubuntu/Debian:**
```bash
sudo apt install python3 python3-pip
```

**Windows:**
- https://www.python.org/downloads/ 에서 다운로드

### 2. 필요한 패키지 설치

```bash
cd lingotype/scripts
pip3 install requests
```

**또는 requirements.txt 사용:**
```bash
pip3 install -r requirements.txt
```

---

## 🎛️ 백엔드 선택

### Option 1: OpenAI (추천 — 가장 빠름)

**장점:**
- ✅ API 키만 필요 (설치 불필요)
- ✅ 매우 빠른 생성 (gpt-image-1 모델)
- ✅ 고품질 (1024×1024)
- ✅ 일관된 스타일

**단점:**
- ❌ 유료 (약 $0.01/이미지)
- ❌ API 키 필요

**API 키 발급:**
1. https://platform.openai.com/api-keys 방문
2. "Create new secret key" 클릭
3. 복사 (sk-proj-로 시작)

**사용법:**
```bash
export OPENAI_API_KEY="sk-proj-xxx..."
python3 generate_characters.py --backend openai --token "$OPENAI_API_KEY" --all
```

---

### Option 2: Stable Diffusion WebUI (무료, 로컬)

**장점:**
- ✅ 완전 무료
- ✅ 로컬 실행 (인터넷 불필요)
- ✅ 무제한 생성
- ✅ 빠른 속도 (GPU 있으면)
- ✅ 높은 품질

**단점:**
- ❌ 설치 필요 (3GB+)
- ❌ GPU 권장 (CPU도 가능하지만 느림)

**설치 방법:**

1. **자동 설치 (권장):**
   ```bash
   # macOS/Linux
   git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
   cd stable-diffusion-webui
   ./webui.sh
   ```

2. **API 모드로 재실행:**
   ```bash
   ./webui.sh --api
   ```

3. **브라우저에서 확인:**
   - http://127.0.0.1:7860 접속
   - API docs: http://127.0.0.1:7860/docs

**모델 다운로드 (선택):**
- Anything V5: https://civitai.com/models/9409/anything-v5
- AbyssOrangeMix3: https://civitai.com/models/9942/abyssorangemix3-aom3
- → `models/Stable-diffusion/` 폴더에 저장

---

### Option 3: Replicate (클라우드)

**장점:**
- ✅ 설치 불필요
- ✅ 고품질 (SDXL 사용)
- ✅ GPU 불필요

**단점:**
- ❌ 유료 ($0.0023/초, ~$0.05/이미지)
- ❌ API 토큰 필요
- ❌ 인터넷 필요
- ❌ 느림 (대기 시간)

**API 토큰 발급:**

1. https://replicate.com 가입
2. https://replicate.com/account/api-tokens 접속
3. "Create token" 클릭
4. 토큰 복사 (r8_로 시작)

**사용법:**
```bash
export REPLICATE_API_TOKEN="r8_your_token_here"
python3 generate_characters.py --backend replicate --character en-emily --token $REPLICATE_API_TOKEN
```

**비용 예상:**
- 1 이미지 ≈ $0.05
- 12 캐릭터 × 3 포즈 = 36 이미지 ≈ $1.80

---

### Option 4: Hugging Face (클라우드)

**장점:**
- ✅ 무료!
- ✅ 설치 불필요
- ✅ 간단한 API

**단점:**
- ❌ 느림 (무료 tier)
- ❌ 품질이 조금 낮음
- ❌ 요청 제한 있음
- ❌ API 토큰 필요

**API 토큰 발급:**

1. https://huggingface.co 가입
2. https://huggingface.co/settings/tokens 접속
3. "New token" 클릭
4. Role: "read" 선택
5. 토큰 복사 (hf_로 시작)

**사용법:**
```bash
export HF_TOKEN="hf_your_token_here"
python3 generate_characters.py --backend huggingface --character en-emily --token $HF_TOKEN
```

---

## 📖 사용법

### 기본 사용법

```bash
python3 generate_characters.py [옵션]
```

### 옵션

| 옵션 | 설명 | 예시 |
|------|------|------|
| `--backend` | AI 백엔드 선택 | `--backend webui` |
| `--character` | 단일 캐릭터 생성 | `--character en-emily` |
| `--language` | 언어별 모든 캐릭터 | `--language en` |
| `--all` | 모든 캐릭터 생성 | `--all` |
| `--output` | 출력 디렉토리 | `--output ../public/characters` |
| `--token` | API 토큰 | `--token r8_xxx` |
| `--url` | WebUI URL | `--url http://localhost:7860` |

### 예시

#### 1. 단일 캐릭터 (Emily)

```bash
python3 generate_characters.py --backend webui --character en-emily
```

**출력:**
```
../prototype/public/characters/
└── en/
    └── emily/
        ├── idle.png
        ├── wave.png
        ├── jump.png
        └── dance.png
```

#### 2. 언어별 모든 캐릭터 (일본어)

```bash
python3 generate_characters.py --backend webui --language jp
```

**출력:**
```
../prototype/public/characters/
└── jp/
    ├── sakura/
    │   ├── idle.png
    │   └── wave.png
    └── yuki/
        └── (프롬프트가 추가되면)
```

#### 3. 모든 캐릭터

```bash
python3 generate_characters.py --backend webui --all
```

**주의:** 현재는 en-emily, jp-sakura, kr-hana만 프롬프트 정의됨!

#### 4. 클라우드 API 사용

```bash
# Replicate
python3 generate_characters.py \
  --backend replicate \
  --character en-emily \
  --token r8_your_token

# Hugging Face
python3 generate_characters.py \
  --backend huggingface \
  --character jp-sakura \
  --token hf_your_token
```

#### 5. 커스텀 출력 경로

```bash
python3 generate_characters.py \
  --backend webui \
  --character en-emily \
  --output ~/Downloads/characters
```

---

## 🔧 고급 설정

### 스크립트 수정하기

**프롬프트 추가:**

`generate_characters.py` 파일을 열고 `CHARACTER_PROMPTS`에 추가:

```python
CHARACTER_PROMPTS = {
    # ... 기존 코드 ...
    
    "en-oliver": {
        "idle": CharacterPrompt(
            character_id="en-oliver",
            name="Oliver",
            pose="idle",
            prompt="""
masterpiece, best quality, highly detailed,
1boy, solo, full body, standing,
brown hair, short neat hair, green eyes,
calm smile, gentle expression,
formal outfit, vest, dress shirt, tie, slacks,
white background, simple background,
anime style, clean lines
""".strip(),
            negative_prompt=NEGATIVE_PROMPT,
        ),
    },
}
```

### 생성 파라미터 조정

**WebUI 설정 변경:**

```python
class StableDiffusionWebUI:
    def generate(self, prompt: CharacterPrompt) -> Optional[bytes]:
        payload = {
            "prompt": prompt.prompt,
            "negative_prompt": prompt.negative_prompt,
            "steps": 40,              # ← 30에서 40으로 (더 정교)
            "width": 512,
            "height": 768,
            "cfg_scale": 9,           # ← 7에서 9로 (프롬프트 중시)
            "sampler_name": "Euler a", # ← 다른 샘플러 시도
            "seed": 12345,            # ← 시드 고정 (일관성)
        }
```

### 배치 스크립트

**모든 캐릭터 한 번에:**

```bash
#!/bin/bash
# generate_all.sh

for char in en-emily jp-sakura kr-hana; do
  echo "Generating $char..."
  python3 generate_characters.py --backend webui --character $char
  sleep 5  # API 쿨다운
done

echo "All done!"
```

실행:
```bash
chmod +x generate_all.sh
./generate_all.sh
```

---

## ❓ 문제 해결

### WebUI 연결 실패

**증상:**
```
✗ API 연결 실패
  Stable Diffusion WebUI가 실행 중인지 확인하세요.
```

**해결:**

1. **WebUI가 실행 중인지 확인:**
   ```bash
   # 새 터미널 열고
   cd ~/stable-diffusion-webui
   ./webui.sh --api
   ```

2. **API가 활성화되었는지 확인:**
   - http://127.0.0.1:7860 접속
   - http://127.0.0.1:7860/docs 접속 (API 문서)

3. **포트 충돌:**
   ```bash
   # 다른 포트 사용
   ./webui.sh --api --port 7861
   
   # 스크립트 실행 시
   python3 generate_characters.py --backend webui --url http://127.0.0.1:7861
   ```

---

### 생성이 너무 느림

**WebUI (로컬):**
- GPU 사용 확인
- steps 줄이기 (30 → 20)
- 크기 줄이기 (768 → 512)

**Replicate/HuggingFace:**
- 무료 tier는 원래 느림
- 요청 간 간격 두기 (sleep 추가)

---

### 품질이 낮음

**프롬프트 개선:**
```python
prompt = """
masterpiece, best quality, highly detailed,  # ← 품질 키워드
ultra detailed, 8k wallpaper,               # ← 추가
professional illustration,                   # ← 추가
[원래 프롬프트]
"""
```

**네거티브 프롬프트 강화:**
```python
NEGATIVE_PROMPT = """
lowres, bad anatomy, bad hands, text, error,
worst quality, low quality, normal quality,
blurry, ugly, deformed, disfigured,          # ← 추가
jpeg artifacts, watermark, signature         # ← 추가
"""
```

**설정 조정:**
- steps: 30 → 50
- cfg_scale: 7 → 10
- 다른 모델 시도

---

### API 토큰 에러

**Replicate:**
```
✗ API 연결 실패
```

**확인:**
```bash
# 토큰 확인
echo $REPLICATE_API_TOKEN

# 토큰 설정
export REPLICATE_API_TOKEN="r8_your_token_here"

# 또는 직접 입력
python3 generate_characters.py --backend replicate --token "r8_your_token_here"
```

**Hugging Face:**
```bash
export HF_TOKEN="hf_your_token_here"
```

---

### 이미지가 잘림

**해결:**

1. **크기 조정:**
   ```python
   CharacterPrompt(
       width=512,
       height=896,  # ← 768에서 896으로
   )
   ```

2. **프롬프트에 명시:**
   ```python
   prompt = """
   full body visible,    # ← 추가
   feet visible,         # ← 추가
   standing on ground,   # ← 추가
   [나머지 프롬프트]
   """
   ```

---

## 📊 현재 상태

### 구현된 캐릭터 (프롬프트 포함)

**총 3개 캐릭터:**

1. **en-emily** (4 포즈)
   - idle, wave, jump, dance

2. **jp-sakura** (2 포즈)
   - idle, wave

3. **kr-hana** (1 포즈)
   - idle

### 추가 필요한 캐릭터

**총 9개 캐릭터:**

- en-oliver (2 포즈)
- en-sophia (2 포즈)
- jp-yuki (3 포즈)
- jp-kaito (2 포즈)
- es-isabella (4 포즈)
- es-carlos (3 포즈)
- es-luna (2 포즈)
- kr-minho (4 포즈)
- kr-jiwoo (4 포즈)

**할 일:**
1. `generate_characters.py`에 프롬프트 추가
2. `AI_CHARACTER_PROMPTS.md`에서 프롬프트 복사
3. 스크립트 실행

---

## 🎯 권장 워크플로우

### 1단계: 테스트 (1개 캐릭터)

```bash
# Emily만 생성해서 테스트
python3 generate_characters.py --backend webui --character en-emily

# 결과 확인
open ../prototype/public/characters/en/emily/
```

### 2단계: 설정 조정

- 품질 확인
- 프롬프트 수정
- 파라미터 튜닝

### 3단계: 배치 생성

```bash
# 모든 캐릭터 생성
python3 generate_characters.py --backend webui --all
```

### 4단계: 후처리

```bash
# 배경 제거 (선택)
# - remove.bg 사용
# - 또는 GIMP/Photoshop

# 크기 최적화
# - TinyPNG
# - ImageOptim
```

### 5단계: 게임에 적용

```typescript
// src/config/characterImages.ts
export const USE_EXTERNAL_IMAGES = true;
```

```bash
npm run dev
```

---

## 💡 팁

### 시간 절약

**GPU 사용:**
- CPU: 1 이미지 ~5분
- GPU (RTX 3060): 1 이미지 ~30초

**배치 처리:**
```bash
# 여러 캐릭터 순서대로
for char in en-emily jp-sakura kr-hana; do
  python3 generate_characters.py --backend webui --character $char &
done
wait
```

### 비용 절약

**로컬 우선:**
1. WebUI 사용 (무료)
2. 안 되면 HuggingFace (무료, 느림)
3. 마지막으로 Replicate (유료, 빠름)

**클라우드 사용 시:**
- 테스트는 로컬에서
- 최종본만 클라우드

### 품질 향상

**모델 선택:**
- Anything V5: 범용
- AbyssOrangeMix: 고품질 아니메
- Counterfeit V3: 아니메 스타일

**LoRA 사용:**
- 특정 스타일 학습
- 일관성 향상

---

## 📚 추가 자료

**Stable Diffusion WebUI:**
- https://github.com/AUTOMATIC1111/stable-diffusion-webui

**모델 다운로드:**
- https://civitai.com
- https://huggingface.co/models

**API 문서:**
- Replicate: https://replicate.com/docs
- HuggingFace: https://huggingface.co/docs/api-inference

---

**이제 명령어 하나로 AI 이미지를 자동 생성할 수 있습니다!** 🤖✨
