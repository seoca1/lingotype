# Ollama 연동 가이드

이 문서는 lingotype 프로젝트에 Ollama를 연동하는 방법을 설명합니다.

## 설치된 파일

### 1. **src/types.ts** (수정됨)
AI 관련 타입 정의가 추가되었습니다:
- `OllamaConfig`: Ollama 서버 설정
- `AIPrompt`: AI 프롬프트 구조
- `AIResponse`: AI 응답 구조

### 2. **src/ai/OllamaService.ts** (새로 생성)
Ollama와 통신하는 핵심 서비스 클래스입니다.

주요 기능:
- `testConnection()`: Ollama 서버 연결 테스트
- `generate(prompt)`: 일반 텍스트 생성
- `generateStream(prompt)`: 스트리밍 방식 생성
- `chat(messages)`: 대화형 채팅 (메시지 히스토리 유지)
- `setModel(model)`: 모델 변경
- `getConfig()`: 현재 설정 확인

### 3. **src/ui/OllamaTest.tsx** (새로 생성)
Ollama 연동을 테스트하기 위한 UI 컴포넌트입니다.

### 4. **src/App.tsx** (수정됨)
OllamaTest 컴포넌트를 임포트하고 테스트 모드를 추가했습니다.

## 사용 방법

### 1. Ollama 서버 실행 확인

터미널에서 Ollama 서버가 실행 중인지 확인:
```bash
ollama list
```

현재 실행 중인 모델: `qwen2.5:9b`

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. Ollama 테스트 페이지 접속

브라우저에서 다음 URL로 접속:
```
http://localhost:5173/?ollama-test
```

### 4. 연결 테스트

1. "Test Connection" 버튼 클릭하여 Ollama 서버 연결 확인
2. 프롬프트 입력란에 텍스트 입력
3. "Generate (Normal)" 또는 "Generate (Stream)" 버튼 클릭
4. AI 응답 확인

## 코드 예시

### 기본 사용법

```typescript
import { getOllamaService } from './ai/OllamaService.js';

// 서비스 인스턴스 가져오기
const ollama = getOllamaService();

// 텍스트 생성
const response = await ollama.generate({
  user: '일본어 단어 5개를 추천해주세요',
  system: 'You are a language learning assistant.',
});

console.log(response.text);
```

### 스트리밍 방식

```typescript
const stream = ollama.generateStream({
  user: '스페인어 문장을 만들어주세요',
});

for await (const chunk of stream) {
  console.log(chunk); // 실시간으로 출력
}
```

### 대화형 채팅

```typescript
const response = await ollama.chat([
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Hello!' },
  { role: 'assistant', content: 'Hi! How can I help you?' },
  { role: 'user', content: 'Tell me about Japan.' },
]);

console.log(response.text);
```

### 모델 변경

```typescript
// 다른 모델로 변경
ollama.setModel('llama2:7b');

// 현재 설정 확인
const config = ollama.getConfig();
console.log(config.model); // 'llama2:7b'
```

## 게임 내 활용 예시

### 1. NPC 대화 생성

```typescript
// src/npc/DialogueGenerator.ts 생성 예시
export async function generateNPCDialogue(
  npcRole: string,
  playerInput: string,
  context: string,
): Promise<string> {
  const ollama = getOllamaService();
  
  const response = await ollama.generate({
    system: `You are ${npcRole}. Respond in character.`,
    user: `Context: ${context}\nPlayer says: ${playerInput}`,
  });
  
  return response.text;
}
```

### 2. 학습 콘텐츠 생성

```typescript
// src/ai/ContentGenerator.ts 생성 예시
export async function generateVocabulary(
  language: Language,
  level: number,
  count: number,
): Promise<WordEntry[]> {
  const ollama = getOllamaService();
  
  const response = await ollama.generate({
    system: 'You are a language learning content creator.',
    user: `Generate ${count} ${language} words for level ${level}. Return as JSON array.`,
  });
  
  return JSON.parse(response.text);
}
```

### 3. 실시간 힌트 제공

```typescript
// src/ai/HintGenerator.ts 생성 예시
export async function generateHint(
  word: string,
  language: Language,
  playerProgress: number,
): Promise<string> {
  const ollama = getOllamaService();
  
  const response = await ollama.generate({
    system: 'You are a helpful language tutor.',
    user: `Give a hint for the word "${word}" in ${language}. Player progress: ${playerProgress}%`,
  });
  
  return response.text;
}
```

## 설정 커스터마이징

### 다른 서버 주소 사용

```typescript
const ollama = new OllamaService({
  host: 'http://192.168.1.100:11434',
  model: 'qwen2.5:9b',
});
```

### 환경 변수 사용

`.env` 파일 생성:
```env
VITE_OLLAMA_HOST=http://localhost:11434
VITE_OLLAMA_MODEL=qwen2.5:9b
```

코드에서 사용:
```typescript
const ollama = new OllamaService({
  host: import.meta.env.VITE_OLLAMA_HOST,
  model: import.meta.env.VITE_OLLAMA_MODEL,
});
```

## 주의사항

1. **CORS 문제**: Ollama 서버가 다른 호스트에 있을 경우 CORS 설정 필요
2. **응답 시간**: AI 생성에는 시간이 걸리므로 로딩 상태 처리 필요
3. **에러 처리**: 네트워크 오류나 모델 로딩 실패에 대한 처리 구현 권장
4. **프롬프트 엔지니어링**: 좋은 결과를 얻으려면 프롬프트 최적화 필요

## 문제 해결

### Ollama 서버가 응답하지 않을 때

```bash
# Ollama 서비스 재시작
ollama serve
```

### 모델이 로드되지 않을 때

```bash
# 모델 다운로드
ollama pull qwen2.5:9b
```

### 브라우저 콘솔 에러 확인

F12를 눌러 개발자 도구를 열고 Console 탭에서 에러 메시지 확인

## 다음 단계

1. 게임의 특정 기능에 Ollama 통합
2. 프롬프트 템플릿 작성
3. 응답 캐싱 시스템 구현
4. 사용자 경험 최적화
