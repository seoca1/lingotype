# 🎨 Gemini를 사용한 캐릭터 이미지 생성 가이드

Gemini (Google AI)를 사용하여 게임 캐릭터 이미지를 생성하는 완전 가이드입니다.

---

## ✅ Gemini 장점

### **무료 & 접근성:**
- ✅ **완전 무료** (Gemini 2.0 Flash)
- ✅ Google 계정만 있으면 사용 가능
- ✅ 빠른 생성 속도
- ✅ 제한 없음 (일일 생성 제한 관대)

### **품질:**
- ✅ 고품질 아니메 스타일 이미지
- ✅ 일관된 캐릭터 디자인
- ✅ 자연스러운 포즈
- ✅ 세부 디테일 우수

### **편의성:**
- ✅ 프롬프트 이해도 높음
- ✅ 채팅 기반 인터페이스
- ✅ 수정 요청 쉬움
- ✅ 여러 옵션 생성 가능

---

## ⚠️ Gemini 제약사항

### **파일 형식 문제:**
- ❌ **JPEG 형식으로 생성됨**
- ❌ 파일 확장자는 `.png`이지만 실제는 JPEG
- ❌ 투명도(알파 채널) 없음
- ❌ 흰색 배경 포함

### **해결 방법:**
✅ **Python 변환 스크립트 사용** (자동화 완료!)

---

## 🚀 Gemini 이미지 생성 워크플로우

### **전체 프로세스:**

```
1. Gemini에서 이미지 생성
2. 이미지 다운로드 (.png)
3. 변환 스크립트 실행 (JPEG → PNG with transparency)
4. 게임 폴더에 저장
5. 검증
```

---

## 📝 Step 1: Gemini에서 생성

### **1. Gemini 접속:**
```
https://gemini.google.com/
```

### **2. 프롬프트 입력:**

**기본 템플릿:**
```
Generate an anime-style character illustration:

CHARACTER:
- Name: Emily (Modern American Girl)
- Gender: Female
- Age: 16-18 years old
- Hair: Blonde, long wavy hair
- Eyes: Blue eyes
- Expression: Friendly smile

OUTFIT:
- Orange hoodie
- Blue jeans
- White sneakers
- Casual modern style

POSE:
- Standing idle/neutral pose
- Full body visible
- Relaxed posture

STYLE:
- High-quality anime illustration
- Clean linework
- Vibrant colors
- Portrait orientation (vertical)

BACKGROUND:
- Simple white or transparent background
- No additional objects

TECHNICAL:
- Resolution: Approximately 512×768 or higher
- Portrait orientation (taller than wide)
- Professional quality
```

**중요 팁:**
- "anime-style" 명시
- "portrait orientation" 강조
- "full body" 필수
- 캐릭터 세부사항 자세히 기술

### **3. 이미지 생성 확인:**
- 여러 옵션이 생성됨 (보통 4개)
- 가장 마음에 드는 것 선택
- 클릭하여 확대

### **4. 다운로드:**
- 확대된 이미지 우클릭
- "이미지 저장" 또는 "Save image as..."
- 파일명: `1-idle.png` (번호 포함!)
- 저장 위치: Downloads 폴더

---

## 🔄 Step 2: 변환 스크립트 실행

### **왜 필요한가?**

Gemini가 생성한 이미지:
```
파일명: 1-idle.png
실제 형식: JPEG (JFIF)
배경: 흰색 (불투명)
알파 채널: 없음 ❌
```

게임에 필요한 형식:
```
파일명: 1-idle.png
실제 형식: PNG
배경: 투명
알파 채널: 있음 (RGBA) ✅
```

### **변환 스크립트 사용:**

#### **A. 준비 (최초 1회만):**

```bash
cd ~/projects/Projects/Game/lingotype

# 가상환경 생성 (이미 있으면 skip)
python3 -m venv .venv

# 가상환경 활성화
source .venv/bin/activate

# 패키지 설치 (이미 했으면 skip)
pip install Pillow numpy
```

#### **B. 이미지 변환:**

**방법 1: Emily 폴더 (기본값)**
```bash
# 가상환경 활성화
source .venv/bin/activate

# 스크립트 실행 (Emily 이미지 자동 변환)
python3 scripts/convert_to_png.py
```

**방법 2: 특정 폴더**
```bash
source .venv/bin/activate
python3 scripts/convert_to_png.py /path/to/images
```

**방법 3: 다른 캐릭터**
```bash
source .venv/bin/activate

# Oliver
python3 scripts/convert_to_png.py prototype/public/characters/en/oliver/

# Sakura
python3 scripts/convert_to_png.py prototype/public/characters/jp/sakura/
```

#### **C. 출력 확인:**

성공 시:
```
============================================================
PNG CONVERSION TOOL
============================================================
Directory: .../emily

Found 7 files to convert

[1/7] Processing 1-idle.png...
✓ Converted: 1-idle.png
  Original format: PNG
  New format: PNG (RGBA)
  Size: (687, 1024)

... (7개 모두)

✓ Completed: 7 files converted to PNG with transparency

============================================================
VERIFICATION REPORT
============================================================

✓ 1-idle.png
   Format: PNG
   Mode: RGBA
   Size: (687, 1024)

... (7개 모두)

✓ All images are valid PNG with transparency!
============================================================
```

---

## ✅ Step 3: 검증

### **1. 파일 형식 확인:**

```bash
cd prototype/public/characters/en/emily
file *.png
```

**올바른 출력:**
```
1-idle.png: PNG image data, 687 x 1024, 8-bit/color RGBA, non-interlaced
2-wave.png: PNG image data, 687 x 1024, 8-bit/color RGBA, non-interlaced
... (모두 RGBA 확인)
```

### **2. 이미지 뷰어로 확인:**

- 이미지 더블클릭
- 배경이 **체크무늬 패턴**으로 보이면 ✅ 투명
- 배경이 **흰색 박스**로 보이면 ❌ 재변환 필요

### **3. 게임에서 테스트:**

```bash
cd prototype
npm run build
npm run dev
```

- 브라우저에서 `localhost:5173` 접속
- "캐릭터 테스트" 메뉴 선택
- 모든 포즈 확인
- 배경이 깨끗하게 투명한지 확인

---

## 📋 전체 워크플로우 (7개 포즈)

### **Emily 예시:**

```bash
# 1. Gemini에서 7개 포즈 생성
# - 1-idle, 2-wave, 3-jump, 4-clap, 5-spin, 6-dance, 7-pose

# 2. 다운로드 폴더에 저장
Downloads/
  1-idle.png
  2-wave.png
  3-jump.png
  4-clap.png
  5-spin.png
  6-dance.png
  7-pose.png

# 3. 게임 폴더로 복사
cp ~/Downloads/*-*.png ~/projects/Projects/Game/lingotype/prototype/public/characters/en/emily/

# 4. 변환 스크립트 실행
cd ~/projects/Projects/Game/lingotype
source .venv/bin/activate
python3 scripts/convert_to_png.py

# 5. 검증
cd prototype/public/characters/en/emily
file *.png | grep RGBA

# 6. 빌드 및 테스트
cd ../../..
npm run build
npm run dev
```

---

## 🎯 프롬프트 팁

### **좋은 프롬프트:**

✅ **명확한 스타일 지정:**
```
- "anime-style character illustration"
- "high-quality anime art"
- "manga aesthetic"
```

✅ **세부사항:**
```
- Hair: "blonde, long wavy hair past shoulders"
- Eyes: "blue eyes, large anime eyes"
- Outfit: "orange hoodie with drawstrings, blue jeans"
```

✅ **포즈 설명:**
```
- Idle: "standing relaxed, hands at sides"
- Wave: "waving right hand cheerfully, smiling"
- Jump: "jumping in air, both feet off ground, excited expression"
```

✅ **기술 사양:**
```
- "Portrait orientation (vertical, taller than wide)"
- "Full body visible from head to toe"
- "High resolution, 512×768 or larger"
```

### **피해야 할 것:**

❌ **모호한 요청:**
```
- "cute character" (너무 일반적)
- "nice pose" (구체적이지 않음)
```

❌ **복잡한 배경:**
```
- "in a park" → 배경 제거 어려움
- "with flowers" → 불필요한 객체
```

❌ **여러 캐릭터:**
```
- "two girls" → 단일 캐릭터만 요청
```

---

## 🔧 트러블슈팅

### **문제 1: RGBA가 아닌 RGB로 변환됨**

**원인:** 스크립트가 배경을 감지하지 못함

**해결:**
```bash
# threshold 값 낮추기 (더 공격적인 배경 제거)
python3 scripts/convert_to_png.py --threshold 220
```

또는 스크립트 수정:
```python
# convert_to_png.py 에서
batch_convert(directory, '*.png', threshold=220)  # 240 → 220
```

### **문제 2: 캐릭터 일부가 투명해짐**

**원인:** 흰색 옷이나 밝은 피부가 배경으로 인식됨

**해결:**
```bash
# threshold 값 높이기 (덜 공격적)
python3 scripts/convert_to_png.py --threshold 250
```

### **문제 3: 이미지 품질이 낮음**

**원인:** Gemini 해상도 제한

**해결:**
- 프롬프트에 "high resolution" 강조
- "detailed", "professional quality" 추가
- 여러 옵션 생성 후 가장 좋은 것 선택

### **문제 4: 포즈가 일관되지 않음**

**원인:** 캐릭터 설명이 달라짐

**해결:**
- 모든 프롬프트에 **동일한 캐릭터 설명** 사용
- 이전 프롬프트 복사 후 포즈 부분만 수정
- "Same character as before, but [new pose]" 추가

---

## 📊 Emily 생성 결과 (실제 사례)

### **원본 Gemini 이미지:**
```
형식: JPEG (JFIF)
파일명: *.png (확장자만 PNG)
크기: 81-110 KB
해상도: 687×1024
배경: 흰색 (불투명)
알파: 없음
```

### **변환 후:**
```
형식: PNG (RGBA)
파일명: *.png (실제 PNG)
크기: 408-613 KB
해상도: 687×1024 (유지)
배경: 투명
알파: 있음 ✅
```

### **품질:**
- ✅ 캐릭터 디자인 일관성 높음
- ✅ 7개 포즈 모두 같은 캐릭터로 인식 가능
- ✅ 표정, 의상, 헤어스타일 일관됨
- ✅ 아니메 스타일 충실
- ✅ 디테일 우수

### **게임 통합:**
- ✅ 투명 배경으로 자연스러운 합성
- ✅ 모든 포즈 정상 작동
- ✅ 캐릭터 전환 부드러움
- ✅ 시각적 일관성 유지

---

## 💡 권장 사항

### **Gemini 사용 시:**

1. **모든 캐릭터에 사용 가능**
   - ✅ 무료, 제한 없음
   - ✅ 빠른 생성
   - ✅ 변환 스크립트로 자동 처리

2. **생성 후 바로 변환**
   - 다운로드 → 복사 → 스크립트 실행
   - 한 번에 처리 (7개 이미지)
   - 자동 검증 포함

3. **일관성 유지**
   - 같은 캐릭터 설명 재사용
   - 포즈 부분만 변경
   - 스타일 키워드 동일하게

4. **품질 확인**
   - 여러 옵션 중 최고 선택
   - 해상도 확인 (최소 512×768)
   - 포즈 정확도 확인

---

## 🎉 결론

### **Gemini는 완벽한 선택입니다!**

**장점:**
- ✅ **완전 무료**
- ✅ 고품질 아니메 이미지
- ✅ 빠른 생성
- ✅ 일관된 캐릭터
- ✅ 변환 스크립트로 자동화

**단점:**
- ❌ JPEG 형식 → **자동 변환 스크립트로 해결!**
- ❌ 흰색 배경 → **자동 투명화!**

### **나머지 11개 캐릭터 생성:**

Oliver, Sophia, Sakura, Yuki, Kaito, Isabella, Carlos, Luna, Hana, Minho, Jiwoo

**각 캐릭터당:**
1. Gemini로 7개 포즈 생성 (5-10분)
2. 다운로드 및 복사 (2분)
3. 변환 스크립트 실행 (30초)
4. 검증 및 커밋 (2분)

**총 소요 시간:** 캐릭터당 10-15분

---

## 📁 관련 파일

- **변환 스크립트:** `scripts/convert_to_png.py`
- **프롬프트 템플릿:** `characters/prompts/PROMPT_TEMPLATE_V2.txt`
- **Emily 프롬프트:** `characters/prompts/en/emily/*.txt`
- **이미지 위치:** `prototype/public/characters/[lang]/[character]/*.png`

---

**Gemini + 변환 스크립트 = 완벽한 워크플로우!** 🚀✨
