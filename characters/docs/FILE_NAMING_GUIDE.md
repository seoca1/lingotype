# 📁 파일명 확장자 가이드 (Gemini 이미지)

Gemini로 이미지를 다운로드할 때 어떤 확장자를 사용할지 가이드입니다.

---

## 🎯 권장: `.png` 확장자 사용 (간편함)

### **이유:**
- ✅ **최종 형식과 일치** - 어차피 PNG로 변환됨
- ✅ **파일명 일관성** - 모든 게임 이미지가 `.png`
- ✅ **코드 호환성** - `characterImages.ts`에서 `.png` 경로 사용
- ✅ **자동 덮어쓰기** - 변환 시 같은 파일명 재사용
- ✅ **단계 최소화** - 별도 파일명 변경 불필요

### **워크플로우:**

```bash
# 1. Gemini에서 다운로드 (확장자: .png)
Downloads/
  1-idle.png      ← JPEG 데이터지만 .png 확장자
  2-wave.png
  ...

# 2. 게임 폴더에 복사
cp ~/Downloads/*.png .../characters/en/oliver/

# 3. 변환 스크립트 실행
cd ~/projects/Projects/Game/lingotype
source .venv/bin/activate
python3 scripts/convert_to_png.py prototype/public/characters/en/oliver/

# 결과: 같은 파일명으로 PNG로 덮어쓰기
characters/en/oliver/
  1-idle.png      ← 이제 진짜 PNG (RGBA)
  2-wave.png
  ...
```

### **출력 예시:**

```
[1/7] Processing 1-idle.png...
✓ Converted: 1-idle.png → 1-idle.png
  Original format: JPEG
  New format: PNG (RGBA)
  Size: (687, 1024)
```

**장점:** 파일 1개만 존재, 추가 작업 없음

---

## 🔄 대안: `.jpeg` 확장자 사용 (명확함)

### **이유:**
- ✅ **정직한 표현** - 실제 형식과 확장자 일치
- ✅ **명확한 구분** - 원본(JPEG)과 변환본(PNG) 구분
- ✅ **원본 보존** - 원본 파일 유지 가능 (선택사항)

### **워크플로우:**

```bash
# 1. Gemini에서 다운로드 (확장자: .jpeg)
Downloads/
  1-idle.jpeg     ← JPEG 데이터에 .jpeg 확장자
  2-wave.jpeg
  ...

# 2. 게임 폴더에 복사
cp ~/Downloads/*.jpeg .../characters/en/oliver/

# 3. 변환 스크립트 실행
cd ~/projects/Projects/Game/lingotype
source .venv/bin/activate
python3 scripts/convert_to_png.py prototype/public/characters/en/oliver/

# 결과: PNG 파일 새로 생성, 원본 JPEG 자동 삭제
characters/en/oliver/
  1-idle.png      ← 새로 생성된 PNG (RGBA)
  2-wave.png
  ...
  (*.jpeg 파일들은 자동 삭제됨)
```

### **출력 예시:**

```
[1/7] Processing 1-idle.jpeg...
✓ Converted: 1-idle.jpeg → 1-idle.png
  Original format: JPEG
  New format: PNG (RGBA)
  Size: (687, 1024)
  ✓ Deleted original JPEG: 1-idle.jpeg
```

**장점:** 형식이 명확, 자동 정리

---

## 🤖 변환 스크립트 기능

### **지원 형식:**
```python
# 자동으로 처리되는 확장자
['*.png', '*.jpg', '*.jpeg']
```

### **자동 처리:**
1. **형식 감지** - JPEG인지 PNG인지 자동 판별
2. **변환** - JPEG → PNG (RGBA)
3. **배경 제거** - 흰색 배경 투명화
4. **파일명 변경** - 모두 `.png`로 통일
5. **원본 삭제** - `.jpeg` 파일은 자동 삭제

### **예시:**

**입력:**
```
1-idle.png    (JPEG 데이터)
2-wave.jpeg   (JPEG 데이터)
3-jump.jpg    (JPEG 데이터)
```

**출력:**
```
1-idle.png    (PNG RGBA) ← 덮어쓰기
2-wave.png    (PNG RGBA) ← 새로 생성
3-jump.png    (PNG RGBA) ← 새로 생성

2-wave.jpeg   ← 삭제됨
3-jump.jpg    ← 삭제됨
```

---

## 💡 권장 사항

### **개인 선호에 따라 선택:**

#### **옵션 A: `.png` 사용 (추천!)**
**적합한 경우:**
- 빠르고 간편하게 작업하고 싶을 때
- 파일 관리를 단순하게 하고 싶을 때
- 형식보다 편의성 우선

**장점:**
- 클릭 1번 적게 (파일명 변경 불필요)
- 파일 1개만 존재 (정리 불필요)
- 최종 형식과 일치

#### **옵션 B: `.jpeg` 사용**
**적합한 경우:**
- 파일 형식을 명확히 표시하고 싶을 때
- 원본 보존이 중요할 때
- 변환 전/후 구분을 명확히 하고 싶을 때

**장점:**
- 정직한 파일명
- 원본 형식 명확
- 혼동 없음

---

## 📋 실제 사용 예시

### **Emily 7개 포즈 (.png 사용):**

```bash
# Gemini 다운로드
~/Downloads/
  1-idle.png
  2-wave.png
  3-jump.png
  4-clap.png
  5-spin.png
  6-dance.png
  7-pose.png

# 게임 폴더 복사
cp ~/Downloads/*-*.png ~/projects/Projects/Game/lingotype/prototype/public/characters/en/emily/

# 변환
cd ~/projects/Projects/Game/lingotype
source .venv/bin/activate
python3 scripts/convert_to_png.py

# 결과: Emily 폴더에 PNG 7개 (RGBA)
prototype/public/characters/en/emily/
  1-idle.png  (PNG RGBA) ✅
  2-wave.png  (PNG RGBA) ✅
  3-jump.png  (PNG RGBA) ✅
  4-clap.png  (PNG RGBA) ✅
  5-spin.png  (PNG RGBA) ✅
  6-dance.png (PNG RGBA) ✅
  7-pose.png  (PNG RGBA) ✅
```

### **Oliver 7개 포즈 (.jpeg 사용):**

```bash
# Gemini 다운로드
~/Downloads/
  1-idle.jpeg
  2-wave.jpeg
  3-jump.jpeg
  4-clap.jpeg
  5-spin.jpeg
  6-dance.jpeg
  7-pose.jpeg

# 게임 폴더 복사
cp ~/Downloads/*-*.jpeg ~/projects/Projects/Game/lingotype/prototype/public/characters/en/oliver/

# 변환
cd ~/projects/Projects/Game/lingotype
source .venv/bin/activate
python3 scripts/convert_to_png.py prototype/public/characters/en/oliver/

# 결과: Oliver 폴더에 PNG 7개 (JPEG는 자동 삭제됨)
prototype/public/characters/en/oliver/
  1-idle.png  (PNG RGBA) ✅
  2-wave.png  (PNG RGBA) ✅
  3-jump.png  (PNG RGBA) ✅
  4-clap.png  (PNG RGBA) ✅
  5-spin.png  (PNG RGBA) ✅
  6-dance.png (PNG RGBA) ✅
  7-pose.png  (PNG RGBA) ✅
  
  (1-idle.jpeg ~ 7-pose.jpeg 모두 삭제됨)
```

---

## 🎯 최종 권장

### **`.png` 확장자 사용을 추천합니다!**

**이유:**
1. ✅ 단순함 - 파일 1개만 관리
2. ✅ 빠름 - 파일명 변경 불필요
3. ✅ 일관성 - 모든 캐릭터 `.png`
4. ✅ 자동화 - 스크립트가 알아서 처리

**결론:**
- Gemini에서 다운로드 시: **`1-idle.png`로 저장**
- 스크립트 실행: **자동으로 PNG (RGBA)로 변환**
- 추가 작업: **없음**

---

## 📝 요약

| 항목 | `.png` 확장자 | `.jpeg` 확장자 |
|------|--------------|----------------|
| **다운로드** | 1-idle.png | 1-idle.jpeg |
| **실제 형식** | JPEG | JPEG |
| **변환 후** | 1-idle.png (덮어쓰기) | 1-idle.png (새로 생성) |
| **원본 파일** | 덮어써짐 | 자동 삭제 |
| **장점** | 간편, 단순 | 명확, 정직 |
| **권장도** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**둘 다 괜찮지만, `.png`가 더 편리합니다!**

---

## 🚀 다음 캐릭터 생성 시

**권장 워크플로우:**

```bash
# 1. Gemini 다운로드 (.png 확장자)
1-idle.png, 2-wave.png, ..., 7-pose.png

# 2. 게임 폴더 복사
cp ~/Downloads/*-*.png .../characters/[lang]/[character]/

# 3. 변환 (자동으로 PNG RGBA로)
python3 scripts/convert_to_png.py .../characters/[lang]/[character]/

# 완료! ✅
```

**어떤 확장자를 사용하든 스크립트가 자동으로 처리합니다!** 🎨✨
