# CLI Tools - Quick Start Guide

> 🚀 **5분 안에 CLI 도구를 사용하여 게임 시스템을 검증하세요!**

---

## 📍 시작하기 전에

### 위치 확인
CLI 도구는 **prototype** 디렉토리에서 실행해야 합니다.

```bash
# 현재 위치 확인
pwd
# 출력 예: /Users/emilio/projects/Projects/Game/lingotype

# prototype 디렉토리로 이동
cd prototype

# 또는 프로젝트 루트에서
cd Game/lingotype/prototype
```

### 필수 조건
- **Node.js 18+** 설치 확인
- **npm** 설치 확인

```bash
node --version  # v18.0.0 이상
npm --version   # 9.0.0 이상
```

---

## 🎯 3단계로 시작하기

### Step 1: 의존성 설치 (처음 한 번만)

```bash
# prototype 디렉토리에서 실행
npm install
```

**예상 출력:**
```
added 322 packages, and audited 322 packages in 3s
```

### Step 2: 빠른 검증 실행

```bash
npm run cli:test
```

**예상 출력:**
```
╔═══════════════════════════════════════════════════════════╗
║      LingoType - Quick System Verification         ║
╚═══════════════════════════════════════════════════════════╝

📦 Testing Language Registry...
  ✅ Language Registry has languages
  ✅ Language 'en' is registered
  ✅ Language 'jp' is registered
  ✅ Language 'es' is registered
  ✅ Language 'kr' is registered

⚙️  Testing Language Configs...
  ✅ en: Has all required fields
  ✅ en: Has words (70)
  ✅ en: Has sentences (23)
  ...

⌨️  Testing Input Handlers...
  ✅ en: InputHandler created (EnglishHandler)
  ✅ en: Can type word "hello"
  ...

═══════════════════════════════════════════════════════════
📊 Summary: 30 passed, 0 failed
═══════════════════════════════════════════════════════════

🎉 All tests passed!
```

### Step 3: 대화형 모드 체험

```bash
npm run cli:interactive
```

**화면:**
```
Select a language:

  1. English (en) — English
  2. Japanese (jp) — 日本語
  3. Spanish (es) — Español
  4. Korean (kr) — 한국어

Enter number (1-4): _
```

**입력 예시:**
```
Enter number (1-4): 1
```

→ 영어 단어 5개를 타이핑하는 연습이 시작됩니다!

---

## 📂 전체 경로 예시

### macOS/Linux

```bash
# 프로젝트 루트에서 시작
cd ~/projects/Projects/Game/lingotype/prototype

# 또는 절대 경로
cd /Users/emilio/projects/Projects/Game/lingotype/prototype

# CLI 도구 실행
npm run cli:test
```

### Windows

```bash
# 프로젝트 루트에서 시작
cd C:\projects\Projects\Game\lingotype\prototype

# CLI 도구 실행
npm run cli:test
```

---

## 🛠️ 사용 가능한 명령어

### 1. 자동 검증 (`cli:test`)

**용도:** 모든 언어 시스템 자동 검증

```bash
npm run cli:test
```

**언제 사용:**
- 코드 수정 후 빠른 검증
- 새로운 언어 추가 후
- CI/CD 파이프라인에서

**실행 시간:** ~1초

---

### 2. 언어 정보 조회 (`cli:verify`)

**용도:** 언어 목록 및 통계 확인

```bash
# 모든 언어 목록
npm run cli:verify

# 특정 언어 상세 정보
npm run cli:verify -- --language=jp
npm run cli:verify -- --language=en
npm run cli:verify -- --language=es
npm run cli:verify -- --language=kr
```

**출력 예시 (영어):**
```bash
$ npm run cli:verify -- --language=en

✅ Language 'en' found!

📦 Language: English (en)
   Native: English
   Input: Standard QWERTY keyboard
   Tier 0 Support: ❌
   Words: 70
   Sentences: 23

🔧 Testing InputHandler creation...
✅ InputHandler created: EnglishHandler

📝 Testing corpus...
   Sample word: "hello" (hello)
   Sample sentence: "Hello, how are you?"
✅ Corpus loaded successfully
```

---

### 3. 대화형 타이핑 연습 (`cli:interactive`)

**용도:** 실제로 타이핑 테스트

```bash
npm run cli:interactive
```

**⚠️ 중요: 한국어 제한사항**

CLI에서는 **한국어(Korean)가 지원되지 않습니다**.

**이유:**
- 한국어는 자모 단위 조합이 필요 (예: `ㄱ` + `ㅏ` + `ㄴ` → `간`)
- CLI에서는 완성형 한글만 입력 가능
- 브라우저의 KeyboardEvent만 자모 단위 입력 지원

**한국어 타이핑 연습 방법:**
```bash
npm run dev
# 브라우저에서 http://localhost:5173 열기
```

**CLI 지원 언어:**
- ✅ English (직접 입력)
- ✅ Japanese (romaji 입력)
- ✅ Spanish (악센트 직접 또는 ASCII)
- ❌ Korean (웹 버전 사용 필요)

---

**체험 흐름:**

#### 단계 1: 언어 선택
```
Select a language:

  1. English (en) — English
  2. Japanese (jp) — 日本語
  3. Spanish (es) — Español
  4. Korean (kr) — 한국어 (CLI not supported - use web)

Enter number (1-4): 2
```

#### 단계 2: 타이핑 연습
```
Selected: Japanese (jp)

🎮 Typing Practice Mode
Type the displayed words. Press Ctrl+C to exit.

Target: こんにちは
Meaning: hello
Type here: konnichiwa
✅ Correct! Accuracy: 100.0%

Target: ありがとう
Meaning: thank you
Type here: arigatou
✅ Correct! Accuracy: 100.0%
```

#### 단계 3: 결과 확인
```
═══════════════════════════════════════════
📊 Results: 5/5 correct (100.0%)
═══════════════════════════════════════════
```

**입력 방법:**
- **영어**: 그대로 입력 (예: `hello`)
- **일본어**: **romaji**로 입력 (예: `konnichiwa` → `こんにちは`)
- **스페인어**: 악센트 없이 입력 가능 (예: `hola`)
- **한국어**: ❌ CLI 미지원 → 웹 버전 사용

**종료:** `Ctrl+C`

---

## 🔍 트러블슈팅

### 문제 1: "command not found: npm"

**원인:** Node.js/npm이 설치되지 않음

**해결:**
```bash
# macOS (Homebrew)
brew install node

# Windows (Chocolatey)
choco install nodejs

# 또는 https://nodejs.org 에서 다운로드
```

---

### 문제 2: "Cannot find module 'tsx'"

**원인:** 의존성 설치 안 됨

**해결:**
```bash
cd prototype
npm install
```

---

### 문제 3: "Error: Language 'xx' not registered"

**원인:** 잘못된 언어 코드

**해결:**
```bash
# 사용 가능한 언어: en, jp, es, kr
npm run cli:verify -- --language=en  # ✅
npm run cli:verify -- --language=fr  # ❌ (아직 미지원)
```

---

### 문제 4: 경로를 찾을 수 없음

**원인:** 잘못된 디렉토리

**해결:**
```bash
# 현재 위치 확인
pwd

# package.json 파일 확인
ls package.json

# 없으면 prototype 디렉토리로 이동
cd prototype
```

---

### 문제 5: Permission denied

**원인:** 권한 부족 (주로 macOS/Linux)

**해결:**
```bash
# npm 권한 수정
sudo chown -R $(whoami) ~/.npm

# 또는 nvm 사용 권장
# https://github.com/nvm-sh/nvm
```

---

## 📋 체크리스트

시작하기 전 확인:

- [ ] Node.js 18+ 설치됨 (`node --version`)
- [ ] `prototype` 디렉토리에 있음 (`pwd`)
- [ ] `package.json` 파일 존재 (`ls package.json`)
- [ ] 의존성 설치 완료 (`npm install`)
- [ ] CLI 도구 실행 가능 (`npm run cli:test`)

---

## 🎓 사용 시나리오

### 시나리오 1: 처음 사용하는 경우

```bash
# 1. prototype 디렉토리로 이동
cd Game/lingotype/prototype

# 2. 의존성 설치
npm install

# 3. 빠른 검증
npm run cli:test

# 4. 언어 목록 확인
npm run cli:verify

# 5. 대화형 모드 체험
npm run cli:interactive
```

---

### 시나리오 2: 개발 중 빠른 검증

```bash
# 코드 수정 후
npm run cli:test

# 특정 언어만 테스트
npm run cli:verify -- --language=jp
```

---

### 시나리오 3: 새로운 언어 추가 후

```bash
# 1. 언어 등록 확인
npm run cli:verify

# 2. 자동 검증
npm run cli:test

# 3. 실제 타이핑 테스트
npm run cli:interactive
```

---

## 📊 예상 출력 예시

### 성공 케이스

```bash
$ npm run cli:test

📊 Summary: 30 passed, 0 failed

🎉 All tests passed!
```

**Exit code:** 0 (성공)

---

### 실패 케이스

```bash
$ npm run cli:test

⚙️  Testing Language Configs...
  ✅ en: Has all required fields
  ❌ fr: Has all required fields
     Missing required fields

📊 Summary: 29 passed, 1 failed

⚠️  1 test(s) failed
```

**Exit code:** 1 (실패)

---

## 🚀 다음 단계

CLI 도구 사용에 익숙해졌다면:

1. **웹 버전 실행**
   ```bash
   npm run dev
   ```
   → http://localhost:5173 접속

2. **빌드 및 배포**
   ```bash
   npm run build
   npm run preview
   ```

3. **테스트 실행**
   ```bash
   npm test
   ```

---

## 📚 추가 문서

- **CLI_TOOLS.md** - 상세 사용법 및 트러블슈팅
- **prototype/README.md** - 프로젝트 전체 가이드
- **wiki/extensible-languages.md** - 언어 시스템 아키텍처
- **decisions/0011-extensible-languages.md** - 설계 결정 기록

---

## 💡 팁

### 빠른 실행 alias 설정

#### macOS/Linux (.bashrc 또는 .zshrc)
```bash
# alias 추가
alias tl-test='cd ~/projects/Projects/Game/lingotype/prototype && npm run cli:test'
alias tl-verify='cd ~/projects/Projects/Game/lingotype/prototype && npm run cli:verify'
alias tl-play='cd ~/projects/Projects/Game/lingotype/prototype && npm run cli:interactive'

# 사용
tl-test      # 어디서나 빠른 검증
tl-verify    # 언어 목록 확인
tl-play      # 대화형 모드
```

#### Windows (PowerShell Profile)
```powershell
# 프로필 열기
notepad $PROFILE

# 함수 추가
function tl-test { cd C:\projects\Projects\Game\lingotype\prototype; npm run cli:test }
function tl-verify { cd C:\projects\Projects\Game\lingotype\prototype; npm run cli:verify }
function tl-play { cd C:\projects\Projects\Game\lingotype\prototype; npm run cli:interactive }
```

---

## ❓ 도움이 필요하신가요?

### 옵션 1: 헬프 명령어
```bash
npm run cli:verify -- --help
```

### 옵션 2: 문서 확인
- `CLI_TOOLS.md` - 전체 가이드
- `prototype/README.md` - 프로젝트 개요

### 옵션 3: 디버그 모드
```bash
# 더 자세한 출력
npm run cli:verify -- --language=jp --verbose
```

---

## ✅ 요약

### 핵심 명령어 3개

```bash
# 1. 빠른 검증 (개발 중 필수)
npm run cli:test

# 2. 언어 정보 (통계 확인)
npm run cli:verify

# 3. 타이핑 연습 (실제 체험)
npm run cli:interactive
```

### 실행 위치
```
Game/lingotype/prototype/  ← 여기서 실행!
```

### 필수 조건
- Node.js 18+
- `npm install` 완료

---

**이제 CLI 도구를 사용할 준비가 되었습니다! 🎉**

```bash
cd prototype
npm run cli:interactive
```

Happy Typing! ⌨️
