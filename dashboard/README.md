# Language Content Dashboard

게임의 언어 콘텐츠와 학습 자료를 시각적으로 비교·관리하는 대시보드입니다.

## 🚀 빠른 시작

```bash
# 1. 데이터 생성
cd Game/lingotype
python dashboard/generate_data.py

# 2. 대시보드 열기 (방법 1: 브라우저 직접)
open dashboard/index.html

# 2. 대시보드 열기 (방법 2: HTTP 서버)
python -m http.server -d dashboard 8765
# → http://localhost:8765
```

## 📊 구성

```
dashboard/
├── index.html           # 메인 HTML
├── dashboard.js         # 클라이언트 로직
├── generate_data.py     # 데이터 생성기
├── data/
│   ├── overview.json    # 전체 통계
│   ├── en.json          # 영어 데이터
│   ├── jp.json          # 일본어 데이터
│   ├── es.json          # 스페인어 데이터
│   └── kr.json          # 한국어 데이터
└── README.md            # 이 파일
```

## 📁 데이터 소스

대시보드는 다음 위치에서 데이터를 읽어옵니다:

| 데이터 | 위치 | 설명 |
|--------|------|------|
| 학습 자료 | `Language/wiki/{Lang}/` | 어휘, 표현, 문화 노트 |
| 원본 소스 | `Language/raw/{Lang}/` | 학습용 원본 텍스트 |
| 게임 코퍼스 | `Game/raw/{lang}_words.md` | 게임 단어/문장 후보 |
| 스테이지 정의 | `Game/lingotype/prototype/src/data/stages.ts` | 스테이지 설정 |

## 🔄 데이터 갱신

콘텐츠를 추가/수정한 후:

```bash
python dashboard/generate_data.py
# 브라우저 새로고침
```

## 🎯 주요 기능

- **Overview**: 전체 통계와 언어별 타일
- **언어별 상세**: 4개 탭 (코퍼스/스테이지/위키/소스)
- **비교 뷰**: 게임 코퍼스 vs 학습자료 좌우 비교
- **검색/필터**: 스테이지 검색, 티어 필터
- **자동 갱신**: 데이터 파일 변경 시 반영
- **커버리지 분석**: 코퍼스 부족 자동 감지

## 📖 자세한 내용

자세한 사용법과 확장 가이드는 [`../LANGUAGE_CONTENT_DOCUMENTATION.md`](../LANGUAGE_CONTENT_DOCUMENTATION.md) 참조

---

**마지막 업데이트:** 2024-06-18
