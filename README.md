# Typing Language

> 🌍 외국어 타자 연습 게임 - 각 언어의 **실제 입력 방식**을 그대로 살린 스테이지형 격파 게임

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://react.dev/)
[![Tests](https://img.shields.io/badge/Tests-680%20passed-success)](prototype/README.md#testing)
[![Phase](https://img.shields.io/badge/Phase-7%20Alpha%20%F0%9F%9F%9A-green)](ROADMAP.md)

**🎮 [Play Live Demo](https://seoca1.github.io/typing-language/)**

---

## ✨ 핵심 특징

- **4개 언어 지원**: English, Japanese, Spanish, Korean
- **실제 입력 방식 재현**:
  - 🇬🇧 **English**: 표준 QWERTY
  - 🇯🇵 **Japanese**: Romaji → Kanji 매핑 (`konnichiwa` → `こんにちは`)
  - 🇪🇸 **Spanish**: 악센트 입력 + ASCII fallback (`adios` → `adiós` ✅)
  - 🇰🇷 **Korean**: 한글 키보드 자모 직접 입력 + 클라이언트 합성 (`ㅎㅏㄴㄴㅕㅱ` → `한냥`)
- **격파 시스템**: 단어·문장을 격파하여 미션 클리어
  - 실시간 비주얼 피드백 (파티클, 플래시, 콤보)
  - 정확도/속도 기반 점수 시스템
- **컴패니언 캐릭터**: 언어별 문화 의상 (영미복/기모노/플라멩코/한복)
- **140개 스테이지**: Tier 0-5 난이도 곡선
- **4,038개 코퍼스 항목**: EN 1,054 + JP 502 + ES 1,246 + KR 1,236 (auto-generated from `Language/` wiki)
- **52 Daily Lessons**: 100% topic-appropriate culture (EN 15 + JP 14 + ES 11 + KR 12)

## 디렉토리 구조

| 경로 | 목적 | 비고 |
| --- | --- | --- |
| `raw/` | 단어/문장 코퍼스, 언어 참고 자료 | 읽기 전용 |
| `wiki/` | LLM이 유지하는 지식 베이스 (언어, 메카닉) | LLM Wiki |
| `design/` | 활성 게임 디자인 명세 | 사용자/AI가 함께 편집 |
| `testcases/` | 게임플레이 테스트 케이스 / 시나리오 | 디자인과 동기화 |
| `decisions/` | 결정 기록 (ADR) | 결정은 immutable, draft는 mutable |
| `prototype/` | 프로토타입 코드 (TypeScript + React) | Phase 4~ |
| `ROADMAP.md` | 단계별 계획 | 본 디렉토리 루트 |
| `AGENTS.md` | AI 에이전트 작업 가이드 | 본 디렉토리 루트 |

## 🚀 빠른 시작

### 플레이하기

```bash
cd prototype
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 열기

**또는** CLI에서 바로 테스트:
```bash
npm run cli:interactive
```

### 개발자용

1. **현재 상태 확인**: `ROADMAP.md` → Phase 7 진행 중
2. **프로토타입 실행**: `prototype/README.md` 참고
3. **배포**: `prototype/DEPLOYMENT.md` 참고
4. **언어별 입력 방식**: `wiki/languages/` 참고
5. **게임 디자인**: `design/pillars.md` → `design/GDD.md`

## 📊 프로젝트 현황

**Phase 7 - Alpha Build** ✅

| 항목 | 상태 | 세부사항 |
|------|------|----------|
| **테스트** | ✅ | 680개 테스트 통과 (1 skipped) |
| **번들 크기** | ✅ | 971KB (gzip: 298KB) |
| **언어** | ✅ | EN, JP, ES, KR |
| **스테이지** | ✅ | 140개 (Tier 0-5) |
| **콘텐츠** | ✅ | 4,038개 코퍼스 항목 + 52 Daily Lessons (100% culture) |
| **배포** | ✅ | GitHub Pages 자동 배포 |
| **Social** | ✅ | SVG favicon + OG/Twitter Card |

---

## 🛠️ 기술 스택

- **Language**: TypeScript 5.5
- **Framework**: React 18.3
- **Build**: Vite 5.3
- **Testing**: Vitest (680 tests + 1 skipped) + Playwright
- **Rendering**: HTML5 Canvas 2D
- **State**: React useState + Reducer
- **Styling**: CSS (모듈 없이)

---

## 📚 문서 구조

| 경로 | 목적 | 상태 |
| --- | --- | --- |
| `prototype/` | 실행 가능한 게임 코드 | ✅ 완성 |
| `prototype/README.md` | 프로토타입 가이드 | ✅ |
| `prototype/DEPLOYMENT.md` | 배포 가이드 | ✅ |
| `ROADMAP.md` | 단계별 진행 상황 | ✅ 업데이트 |
| `design/` | 게임 디자인 문서 | ✅ |
| `wiki/` | 언어/메카닉 지식베이스 | ✅ |
| `decisions/` | 기술 결정 기록 (ADR) | ✅ |
| `raw/` | 원본 코퍼스 | ✅ |

---

## 🎯 다음 단계

1. **피드백** - 사용자 테스트 및 개선
2. **옵션 메뉴** - 키맵 커스텀, 색맹 모드
3. **사운드** - BGM, SFX (optional)
4. **확장** - Tier 4-5 스테이지 추가
5. **신규 언어** - 프랑스어, 독일어, 중국어 등

---

## 🤝 기여하기

새로운 언어 추가는 매우 쉽습니다! (5개 파일만 수정)

1. `src/language/languages/newlang.ts` - 언어 설정
2. `src/input/NewLangHandler.ts` - 입력 핸들러
3. `src/data/corpus.ts` - 단어/문장 추가
4. `src/data/stages.ts` - 스테이지 정의
5. `tests/input/NewLangHandler.test.ts` - 테스트

자세한 가이드: `prototype/README.md#adding-a-new-language`

---

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

---

**Happy Typing! ⌨️ 즐거운 타이핑 연습 되세요!**
