# Typing Language - Prototype

> 🌍 외국어 타자 연습 게임 - 실제 입력 방식으로 배우는 4개 언어

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.3-646cff)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-680%20passed-success)](#testing)

**🎮 [Play Live Demo](https://seoca1.github.io/typing-language/)**

---

## 🚀 Quick Start

### 1. 설치

```bash
# 의존성 설치
npm install
```

### 2. 개발 서버 실행

```bash
# 웹 브라우저에서 실행
npm run dev

# 브라우저에서 http://localhost:5173 열기
```

### 3. CLI 검증 도구 (배포 전 빠른 테스트)

```bash
# 자동 검증 (30개 테스트, ~1초)
npm run cli:test

# 언어 목록 및 통계
npm run cli:verify

# 대화형 타이핑 연습
npm run cli:interactive
```

📖 **상세 가이드:** [CLI_QUICKSTART.md](../CLI_QUICKSTART.md)

---

## 📦 프로젝트 구조

```
prototype/
├── src/
│   ├── cli/                  # CLI 검증 도구
│   │   ├── quick-test.ts     # 자동 검증 (30 tests)
│   │   └── verify.ts         # 대화형 도구
│   ├── language/             # 언어 시스템 (확장형)
│   │   ├── LanguageRegistry.ts  # 코어 레지스트리
│   │   ├── index.ts          # 자동 등록
│   │   └── languages/        # 언어별 설정
│   │       ├── english.ts
│   │       ├── japanese.ts
│   │       ├── spanish.ts
│   │       ├── korean.ts
│   │       └── french.example.ts  # 템플릿
│   ├── input/                # InputHandler (언어별)
│   │   ├── InputHandler.ts   # Base
│   │   ├── EnglishHandler.ts
│   │   ├── JapaneseHandler.ts
│   │   ├── SpanishHandler.ts
│   │   └── KoreanHandler.ts
│   ├── data/                 # 코퍼스 & 스테이지
│   │   ├── {en,jp,es,kr}_corpus.ts  # 4,038 entries (auto-generated from Language wiki)
│   │   ├── dailyLessons.ts   # 52 문화 가이드 (EN 15 + JP 14 + ES 11 + KR 12)
│   │   └── stages.ts         # 140 stages (Tier 0-5)
│   ├── combat/               # 격파 시스템
│   ├── mission/              # 미션 시스템
│   ├── stage/                # 스테이지 진행
│   ├── character/            # 컴패니언 캐릭터
│   ├── effects/              # 이펙트 시스템
│   ├── engine/               # 렌더링
│   ├── ui/                   # React 컴포넌트
│   └── state/                # 게임 상태
├── tests/                    # 유닛 테스트 (680 passed + 1 skipped)
├── CLI_TOOLS.md              # CLI 도구 상세 가이드
└── package.json
```

---

## 🌍 지원 언어

| 언어 | 코드 | 입력 방식 | 단어 (corpus) | Tier 0 |
|------|------|----------|------|------|
| **English** | `en` | QWERTY | 1,054 | - |
| **Japanese** | `jp` | Romaji → Kanji | 502 | 132 chars |
| **Spanish** | `es` | Accent input | 1,246 | - |
| **Korean** | `kr` | 2-beol Jamo | 1,236 | - |

**총:** 4,038 corpus entries, 140 stages, 52 Daily Lessons

---

## 📜 사용 가능한 명령어

### 개발
```bash
npm run dev          # 개발 서버 (http://localhost:5173)
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 미리보기
```

### 테스트
```bash
npm test             # 유닛 테스트 (680 passed, 1 skipped)
npm run test:watch   # Watch 모드
npm run cli:test     # CLI 자동 검증 (30 tests)
```

### 코드 품질
```bash
npm run typecheck    # TypeScript 타입 체크
npm run lint         # ESLint
npm run format       # Prettier
```

### CLI 도구 (빠른 검증)
```bash
npm run cli:test               # 자동 검증
npm run cli:verify             # 언어 목록
npm run cli:verify -- --language=jp   # 특정 언어
npm run cli:interactive        # 대화형 모드
```

---

## 🎮 게임 특징

### 1. 실제 입력 방식
- **영어**: 표준 QWERTY
- **일본어**: Romaji → 한자 직접 매핑 (예: `konnichiwa` → `こんにちは`)
- **스페인어**: 악센트 직접 입력 또는 ASCII 폴백
- **한국어**: 2벌식 자모 조합 (예: `ㄱ+ㅏ+ㄴ` → `간`)

### 2. 6단계 티어 시스템
- **Tier 0**: 문자 (JP 전용 - 히라가나/가타카나)
- **Tier 1-2**: 단어 (3-15 글자)
- **Tier 3**: 짧은 문장 (10-30 글자)
- **Tier 4**: 중간 문장 (30-60 글자)
- **Tier 5**: 긴 문장/단락 (60+ 글자)

### 3. 미션 시스템
- 적 격파 (Defeat Count)
- 정확도 목표 (Accuracy Threshold)
- 분당 단어수 (WPM Threshold)
- 콤보 달성 (Combo Chain)
- 카테고리 집중 (Category Focus)

### 4. 컴패니언 캐릭터
- 언어별 문화적 외형 (의상, 헤어스타일, 색상)
- 레벨업 및 성장 시스템
- 실시간 반응 애니메이션

### 5. 시각 효과
- 격파 시 파티클 효과
- 콤보 시 화면 흔들림
- 언어별 색상 테마
- 키 입력 글로우 효과

---

## 🧪 Testing

### 유닛 테스트
```bash
npm test
```

**결과:**
- ✅ 680/680 tests passed
- ⏭️ 1 test skipped (Korean accuracy - 설계상 의도)
- 📊 Coverage: EnglishHandler (22), JapaneseHandler (24), SpanishHandler (26), KoreanHandler (27)

### CLI 검증
```bash
npm run cli:test
```

**결과:**
- ✅ 30/30 tests passed
- 📦 Language Registry (5 tests)
- ⚙️ Language Configs (13 tests)
- ⌨️ Input Handlers (12 tests)

---

## 🏗️ 아키텍처

### 확장형 언어 시스템
- **Language Registry 패턴** (Map 기반)
- 새로운 언어 추가: 5개 파일만 수정
- 동적 타입 (`Language = string`)
- 자동 UI 생성

### 주요 타입
```typescript
interface LanguageConfig {
  code: string;              // 'en', 'jp', 'es', 'kr'
  name: string;              // 'English', 'Japanese'
  nativeName: string;        // '日本語', 'Español'
  inputDescription: string;
  createHandler: () => InputHandler;
  supportsTier0: boolean;
  corpus: {
    words: WordEntry[];
    sentences: WordEntry[];
    chars?: Record<string, WordEntry[]>;
  };
  icon?: string;
  themeColor?: string;
}
```

---

## 📚 문서

### 프로젝트 문서
- **README.md** (이 파일) - 프로젝트 개요
- **CLI_QUICKSTART.md** - CLI 도구 빠른 시작
- **CLI_TOOLS.md** - CLI 도구 상세 가이드
- **OLLAMA_GUIDE.md** - Ollama 통합 가이드

### 디자인 문서 (상위 디렉토리)
- `../design/GDD.md` - 게임 디자인 문서
- `../design/pillars.md` - 핵심 기둥
- `../design/StageDesignSpec.md` - 스테이지 설계

### Wiki
- `../wiki/extensible-languages.md` - 언어 시스템 아키텍처
- `../wiki/languages/*.md` - 언어별 프로필

### Architecture Decision Records
- `../decisions/0011-extensible-languages.md` - 확장형 언어 시스템
- `../decisions/0002-jp-input.md` - 일본어 입력 방식
- `../decisions/0003-es-accents.md` - 스페인어 악센트

---

## 🔧 새로운 언어 추가하기

### 5단계 프로세스

#### 1. InputHandler 구현
```typescript
// src/input/FrenchHandler.ts
export class FrenchHandler extends BaseInputHandler {
  readonly language = 'fr';
  // 악센트 처리 로직
}
```

#### 2. 코퍼스 추가
```typescript
// src/data/corpus.ts
export const FR_WORDS: WordEntry[] = [
  { id: 'fr_001', display: 'bonjour', level: 1 },
  // ...
];
```

#### 3. LanguageConfig 생성
```typescript
// src/language/languages/french.ts
export const FRENCH_CONFIG: LanguageConfig = {
  code: 'fr',
  name: 'French',
  nativeName: 'Français',
  createHandler: () => new FrenchHandler(),
  corpus: { words: FR_WORDS, sentences: FR_SENTENCES },
};
```

#### 4. 등록
```typescript
// src/language/index.ts
registerLanguage(FRENCH_CONFIG);
```

#### 5. 검증
```bash
npm run cli:test
npm run cli:verify -- --language=fr
```

📖 **상세 가이드:** `../wiki/extensible-languages.md`

---

## 🚀 배포

### 빌드
```bash
npm run build
```

**결과:**
- `dist/` 디렉토리 생성
- 크기: ~253 KB (gzip 77 KB)
- 정적 파일: HTML, CSS, JS

### 미리보기
```bash
npm run preview
```

### 배포 플랫폼
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **GitHub Pages**: `npm run build` → `dist/` 배포

---

## 🐛 트러블슈팅

### Q: "Cannot find module 'tsx'"
**A:** 의존성 설치 필요
```bash
npm install
```

### Q: CLI 도구가 작동하지 않음
**A:** `prototype` 디렉토리에서 실행 확인
```bash
cd prototype
npm run cli:test
```

### Q: 테스트 실패
**A:** 캐시 삭제 후 재실행
```bash
rm -rf node_modules dist
npm install
npm test
```

### Q: 포트 충돌 (5173)
**A:** 다른 포트 사용
```bash
npm run dev -- --port 3000
```

---

## 📊 프로젝트 통계

| 항목 | 값 |
|------|-----|
| **언어** | TypeScript 5.5 |
| **프레임워크** | React 18.3 + Vite 5.3 |
| **코드 라인** | ~15,000 lines |
| **유닛 테스트** | 680 passed, 1 skipped |
| **빌드 크기** | 929 KB (gzip 274 KB) |
| **지원 언어** | 4개 (EN/JP/ES/KR) |
| **코퍼스** | 4,038개 항목 (EN 1,054 + JP 502 + ES 1,246 + KR 1,236) |
| **스테이지** | 140개 (Tier 0-5) |
| **Daily Lessons** | 52 (EN 15 + JP 14 + ES 11 + KR 12) |

---

## 🎯 로드맵

### ✅ 완료
- [x] 4개 언어 지원 (EN/JP/ES/KR)
- [x] Tier 0-3 스테이지 (24개)
- [x] 확장형 언어 시스템
- [x] CLI 검증 도구
- [x] 튜토리얼 시스템
- [x] 컴패니언 캐릭터
- [x] 이펙트 시스템

### 🚧 진행 중
- [ ] Tier 4-5 활성화 (16개 추가)
- [ ] 추가 언어 (French, German, Chinese)
- [ ] 세이브/로드 기능

### 📅 계획
- [ ] 사운드 효과
- [ ] 멀티플레이어 (타임어택)
- [ ] 리더보드
- [ ] 커스텀 코퍼스
- [ ] 모바일 지원

---

## 🤝 기여

### 새로운 언어 추가
1. `src/language/languages/french.example.ts` 참고
2. Pull request 생성
3. `npm run cli:test` 통과 필수

### 버그 리포트
- GitHub Issues 사용
- CLI 도구 실행 결과 첨부

---

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

---

## 🙏 감사

- **React Team** - UI 프레임워크
- **Vite Team** - 빌드 도구
- **TypeScript Team** - 타입 시스템
- **Language Resources** - 코퍼스 출처

---

## 📞 문의

- 📧 Email: [your-email]
- 💬 Discord: [your-discord]
- 🐦 Twitter: [your-twitter]

---

**Happy Typing! ⌨️ 즐거운 타이핑 연습 되세요!**

```bash
# 지금 바로 시작하세요!
npm run cli:interactive
```
