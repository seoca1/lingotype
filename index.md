# Typing Language - Wiki Index

위키/디자인/결정/테스트 페이지 카탈로그. LLM Wiki 표준 패턴.

## 메타
- [README](README.md) - 프로젝트 개요
- [AGENTS](AGENTS.md) - AI 에이전트 가이드
- [ROADMAP](ROADMAP.md) - 단계별 계획
- [SETUP_LOG](SETUP_LOG.md) - 환경 구축 기록
- [log](log.md) - 활동 로그

## 파이프라인 (Pipeline)
- [Corpus Pipeline](wiki/corpus-pipeline.md) - **`Language/` 위키에서 게임으로 콘텐츠 흘러오는 흐름**
- [Language 측 파이프라인](../../Language/wiki/pipeline-to-game.md) - 다운스트림 컨슈머 계약

## 언어 (Languages)
- [English (EN)](wiki/languages/english.md) - 입력 방식, 단어/문장 코퍼스
- [Japanese (JP)](wiki/languages/japanese.md) - **로마자→한자 매핑** (ADR-0002)
- [Spanish (ES)](wiki/languages/spanish.md) - **액센트 직접 입력 + ASCII 폴백** (ADR-0003)
- [Korean (KR)](wiki/languages/korean.md) - **로마자→한글 매핑** (ADR-0009 Accepted)
- [Input Method Comparison](wiki/input-method-comparison.md) - 언어별 입력 방식 비교

## 코퍼스 (Corpus)
- [EN Word List](raw/en_words.md) - 영어 단어 코퍼스 (출처 포함)
- [JP Word List](raw/jp_words.md) - 일본어 단어/문장 + romaji 매핑
- [ES Word List](raw/es_words.md) - 스페인어 단어/문장
- [KR Word List](raw/kr_words.md) - 한국어 단어/문장 (Language/wiki/Korean/vocabulary/ 인용)

## 디자인 (Design)
- [Pillars](design/pillars.md) - 디자인 기둥
- [Core Loop](design/core_loop.md) - 핵심 게임 루프
- [GDD](design/GDD.md) - Game Design Document
- [Glossary](design/glossary.md) - 게임 용어
- [Systems: Input Handler](design/systems/input-handler.md) - **언어별 입력 처리**
- [Systems: Combat](design/systems/combat.md) - **단어/문장 격파 시스템**
- [Systems: Stage](design/systems/stage.md) - **스테이지 진행 / 난이도 곡선**
- [Systems: Mission](design/systems/mission.md) - **미션 시스템**
- [Systems: Progression](design/systems/progression.md) - **플레이어 성장 / 메타 진행**
- [Keyboard Input Design](KEYBOARD_INPUT_DESIGN.md) - **PC + 모바일 OS 키보드 통합 설계 (단일 입력 경로)**

## 결정 기록 (Decisions)
- [Index](decisions/README.md) - 모든 ADR 목록

## 테스트 케이스
- [Index](testcases/README.md) - 모든 테스트 시나리오
