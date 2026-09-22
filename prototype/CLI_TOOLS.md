# CLI Verification Tools

커맨드라인에서 언어 시스템을 직접 테스트할 수 있는 도구들입니다.

## Quick Test (자동 검증)

모든 언어의 기본 기능을 자동으로 테스트합니다.

```bash
npm run cli:test
```

**테스트 항목:**
- ✅ Language Registry 작동 여부
- ✅ 4개 언어 등록 확인 (EN/JP/ES/KR)
- ✅ 각 언어별 필수 필드 확인
- ✅ 코퍼스 데이터 존재 여부 (words/sentences)
- ✅ Tier 0 지원 일관성 (JP만 해당)
- ✅ InputHandler 생성 가능 여부
- ✅ InputHandler 필수 메서드 존재 여부
- ✅ 기본 타이핑 시뮬레이션

**예상 출력:**
```
╔═══════════════════════════════════════════════════════════╗
║      Typing Language - Quick System Verification         ║
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
  ✅ jp: Has all required fields
  ✅ jp: Has words (51)
  ✅ jp: Has sentences (19)
  ✅ jp: Tier 0 support has chars
  ✅ es: Has all required fields
  ✅ es: Has words (50)
  ✅ es: Has sentences (21)
  ✅ kr: Has all required fields
  ✅ kr: Has words (32)
  ✅ kr: Has sentences (20)

⌨️  Testing Input Handlers...
  ✅ en: InputHandler created (EnglishHandler)
  ✅ en: InputHandler has required methods
  ✅ en: Can type word "hello"
  ✅ jp: InputHandler created (JapaneseHandler)
  ✅ jp: InputHandler has required methods
  ✅ jp: Can type word "こんにちは"
  ✅ es: InputHandler created (SpanishHandler)
  ✅ es: InputHandler has required methods
  ✅ es: Can type word "hola"
  ✅ kr: InputHandler created (KoreanHandler)
  ✅ kr: InputHandler has required methods
  ✅ kr: Can type word "안녕하세요" (skipped - needs jamo)

═══════════════════════════════════════════════════════════
📊 Summary: 30 passed, 0 failed
═══════════════════════════════════════════════════════════

🎉 All tests passed!
```

---

## Verify (언어 정보 조회)

### 모든 언어 목록 보기

```bash
npm run cli:verify
```

**출력 예시:**
```
╔══════════════════════════════════════════════════════════════╗
║          Typing Language - CLI Verification Tool            ║
╚══════════════════════════════════════════════════════════════╝

📚 Available Languages:

📦 Language: English (en)
   Native: English
   Input: Standard QWERTY keyboard
   Tier 0 Support: ❌
   Words: 70
   Sentences: 23

📦 Language: Japanese (jp)
   Native: 日本語
   Input: Romaji input (e.g., "konnichiwa" → こんにちは)
   Tier 0 Support: ✅
   Words: 51
   Sentences: 19
   Characters: 132

📦 Language: Spanish (es)
   Native: Español
   Input: Direct accent input (á, é, í, ó, ú, ñ) or ASCII fallback
   Tier 0 Support: ❌
   Words: 50
   Sentences: 21

📦 Language: Korean (kr)
   Native: 한국어
   Input: 2-beol (dubeolsik) keyboard - Jamo composition (ㄱ + ㅏ + ㄴ → 간)
   Tier 0 Support: ❌
   Words: 32
   Sentences: 20

Total: 4 languages registered
```

### 특정 언어 테스트

```bash
npm run cli:verify -- --language=jp
npm run cli:verify -- --language=en
npm run cli:verify -- --language=es
npm run cli:verify -- --language=kr
```

**출력 예시 (일본어):**
```
✅ Language 'jp' found!

📦 Language: Japanese (jp)
   Native: 日本語
   Input: Romaji input (e.g., "konnichiwa" → こんにちは)
   Tier 0 Support: ✅
   Words: 51
   Sentences: 19
   Characters: 132

🔧 Testing InputHandler creation...
✅ InputHandler created: JapaneseHandler

📝 Testing corpus...
   Sample word: "こんにちは" (hello)
   Sample sentence: "こんにちは、元気ですか?"
✅ Corpus loaded successfully
```

---

## Interactive Mode (대화형 타이핑 연습)

실제로 단어를 입력해서 테스트할 수 있습니다.

```bash
npm run cli:interactive
```

**⚠️ 제한사항:**
- **한국어 (Korean)**: CLI에서 지원 안 됨 ❌
  - 이유: 자모 조합이 필요 (ㄱ + ㅏ + ㄴ → 간)
  - 해결: 웹 브라우저에서 사용 (`npm run dev`)

**지원되는 언어:**
- ✅ English (QWERTY 직접 입력)
- ✅ Japanese (Romaji → Kanji)
- ✅ Spanish (악센트 직접 또는 ASCII)

**흐름:**
1. 언어 선택 (1-3, 한국어는 스킵됨)
2. 5개 단어 타이핑 연습
3. 정확도 및 점수 표시

**예시:**
```
╔══════════════════════════════════════════════════════════════╗
║          Typing Language - CLI Verification Tool            ║
╚══════════════════════════════════════════════════════════════╝

Select a language:

  1. English (en) — English
  2. Japanese (jp) — 日本語
  3. Spanish (es) — Español
  4. Korean (kr) — 한국어

Enter number (1-4): 2

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

...

═══════════════════════════════════════════
📊 Results: 5/5 correct (100.0%)
═══════════════════════════════════════════
```

---

## 도움말

```bash
npm run cli:verify -- --help
```

---

## Use Cases

### 1. 개발 중 빠른 검증
새로운 언어를 추가한 후:
```bash
npm run cli:test
```

### 2. 특정 언어 디버깅
InputHandler 수정 후:
```bash
npm run cli:verify -- --language=jp
```

### 3. 코퍼스 데이터 확인
단어/문장 개수 확인:
```bash
npm run cli:verify
```

### 4. 실제 입력 테스트
사용자 경험 검증:
```bash
npm run cli:interactive
```

---

## Technical Details

### Quick Test (`cli:test`)
- **파일**: `src/cli/quick-test.ts`
- **실행 시간**: ~1초
- **의존성**: Language Registry, InputHandlers, Corpus
- **Exit code**: 0 (성공) / 1 (실패)

### Verify (`cli:verify`)
- **파일**: `src/cli/verify.ts`
- **모드**:
  - Default: 모든 언어 목록
  - `--language={code}`: 특정 언어 테스트
  - `--interactive`: 대화형 모드

### Requirements
- Node.js 18+
- tsx (TypeScript runner)
- 모든 언어 레지스트리 등록 완료

---

## Troubleshooting

### "Language 'xx' not registered"
→ `src/language/index.ts`에서 `registerLanguage()` 호출 확인

### InputHandler 생성 실패
→ Handler 클래스 constructor 확인

### Corpus 데이터 없음
→ `src/data/corpus.ts`에서 `{LANG}_WORDS`, `{LANG}_SENTENCES` 확인

### 타이핑 테스트 실패
→ `acceptedInputs` 배열 확인 (특히 JP는 romaji 필요)

---

## See Also

- **Language Registry**: `src/language/LanguageRegistry.ts`
- **Wiki**: `wiki/extensible-languages.md`
- **ADR**: `decisions/0011-extensible-languages.md`
