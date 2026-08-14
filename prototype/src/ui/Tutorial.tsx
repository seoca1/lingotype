/**
 * Tutorial Screen - 신규 사용자 온보딩
 *
 * 언어별 입력 방식 설명 + 게임 메카닉 소개
 */

import { useState } from 'react';
import type { Language } from '../types.js';

interface TutorialProps {
  onComplete: () => void;
  onStartTutorialStage: (language: Language) => void;
}

interface TutorialStep {
  title: string;
  content: string;
  example?: string;
  image?: string;
}

const TUTORIAL_STEPS: Record<Language, TutorialStep[]> = {
  en: [
    {
      title: '영어 (English)',
      content: '가장 기본적인 타이핑입니다. QWERTY 키보드로 표시된 단어를 그대로 입력하세요.',
      example: 'hello → h, e, l, l, o',
    },
    {
      title: '대소문자 & 구두점',
      content: '대소문자와 구두점도 정확히 입력해야 합니다.',
      example: 'Hello! → H, e, l, l, o, !',
    },
  ],
  jp: [
    {
      title: '일본어 (Japanese)',
      content: '로마자로 입력하면 한자/히라가나가 표시됩니다. IME 없이 직접 로마자를 입력하세요.',
      example: 'こんにちは → konnichiwa',
    },
    {
      title: '특수 문자',
      content: '장음(ー)은 모음 반복, 촉음(っ)은 자음 반복으로 입력합니다.',
      example: 'がっこう → gakkou (っ = kk)',
    },
    {
      title: '히라가나/가타카나',
      content: 'Tier 0 스테이지에서는 히라가나와 가타카나 문자를 개별로 연습할 수 있습니다.',
      example: 'あ → a, カ → ka',
    },
  ],
  es: [
    {
      title: '스페인어 (Spanish)',
      content: '액센트 문자를 직접 입력하거나, ASCII 문자로 대체할 수 있습니다 (Loose 모드).',
      example: 'español → espanol 또는 español',
    },
    {
      title: '특수 기호',
      content: '¿와 ¡는 스페인어 고유 문장부호입니다.',
      example: '¿Cómo estás? → ¿Como estas?',
    },
  ],
  kr: [
    {
      title: '한국어 (Korean)',
      content: '한글 2벌식 키보드로 자모를 입력하면 자동으로 완성형 한글로 합성됩니다.',
      example: '한 → ㅎ, ㅏ, ㄴ',
    },
    {
      title: '복합 자모',
      content: '쌍자음(ㄲ, ㄸ...)과 복합 모음(ㅐ, ㅘ...)은 자모를 연속으로 입력하면 자동 합성됩니다.',
      example: '까 → ㄱ, ㄱ, ㅏ (ㄱ+ㄱ=ㄲ)',
    },
    {
      title: '겹받침',
      content: '겹받침도 자모를 연속으로 입력하면 자동 합성됩니다.',
      example: '값 → ㄱ, ㅏ, ㅂ, ㅅ (ㅂ+ㅅ=ㅄ)',
    },
  ],
  fr: [
    {
      title: '프랑스어 (French)',
      content:
        'QWERTY 키보드로 프랑스어를 그대로 입력합니다. 악센트 문자(é, à, ç...)는 그대로 타이핑합니다.',
      example: 'café → c, a, f, é',
    },
    {
      title: '악센트와 cedilla',
      content:
        'é, è, ê, ë는 모두 별개의 글자입니다. 스테이지 설정에 따라 ASCII 폴백(a→á, e→é)도 지원됩니다.',
      example: 'naïve → n, a, ï, v, e',
    },
  ],
  de: [
    {
      title: '독일어 (German)',
      content:
        'QWERTY 키보드로 독일어를 그대로 입력합니다. 움라우트(ä, ö, ü)와 ß는 표준 독일어 문자입니다.',
      example: 'Bär → B, ä, r',
    },
    {
      title: 'Eszett (ß)',
      content:
        'ß는 "ss" 발음을 단일 문자로 표기한 것입니다. 예: Straße → S, t, r, a, ß, e',
      example: 'heiß → h, e, i, ß',
    },
  ],
};

const GAME_MECHANICS: TutorialStep[] = [
  {
    title: '게임 방식: 타이핑',
    content:
      '화면에 나타나는 단어/문장을 정확히 입력하세요. 빠르고 정확할수록 높은 점수를 획득합니다.',
  },
  {
    title: '콤보 시스템',
    content:
      '연속으로 정확히 입력하면 콤보가 쌓입니다! 콤보가 높을수록 보너스 점수가 증가합니다.',
  },
  {
    title: '미션',
    content:
      '각 스테이지마다 미션이 주어집니다. "10개 단어 완료", "정확도 90% 이상" 등의 조건을 달성하세요.',
  },
  {
    title: '스테이지 시스템',
    content:
      '6개 티어로 구성되어 있습니다:\n• Tier 0: 문자 (JP 전용)\n• Tier 1~2: 단어\n• Tier 3~4: 문장\n• Tier 5: 단락',
  },
];

export function Tutorial({ onComplete, onStartTutorialStage }: TutorialProps) {
  const [currentPage, setCurrentPage] = useState<'welcome' | 'language' | 'mechanics'>('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [languageStep, setLanguageStep] = useState(0);
  const [mechanicsStep, setMechanicsStep] = useState(0);

  if (currentPage === 'welcome') {
    return (
      <div className="tutorial">
        <div className="tutorial-content">
          <h1>Typing Language에 오신 것을 환영합니다!</h1>
          <p>
            외국어 타자 연습 게임입니다. 영어, 일본어, 스페인어, 한국어, 프랑스어, 독일어의
            <strong>실제 입력 방식</strong>을 그대로 체험할 수 있습니다.
          </p>
          <div className="tutorial-features">
            <div className="feature">
              <h3>🌍 6개 언어</h3>
              <p>각 언어의 고유한 입력 방식 지원</p>
            </div>
            <div className="feature">
              <h3>⌨️ 타이핑 연습</h3>
              <p>실제 입력 방식으로 타자 연습</p>
            </div>
            <div className="feature">
              <h3>🎯 140+ 스테이지</h3>
              <p>단어부터 단락까지 단계적 학습</p>
            </div>
            <div className="feature">
              <h3>✨ 컴패니언 캐릭터</h3>
              <p>언어별 의상과 성장 시스템</p>
            </div>
          </div>
          <div className="tutorial-actions">
            <button
              className="btn-primary"
              onClick={() => setCurrentPage('language')}
              aria-label="Start tutorial"
            >
              시작하기
            </button>
            <button
              className="btn-secondary"
              onClick={onComplete}
              aria-label="Skip tutorial"
            >
              튜토리얼 건너뛰기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'language') {
    const steps = TUTORIAL_STEPS[selectedLanguage];
    const currentStep = steps[languageStep];

    return (
      <div className="tutorial">
        <div className="tutorial-content">
          <div className="tutorial-nav">
            <button
              className="btn-nav"
              onClick={() => {
                if (languageStep > 0) {
                  setLanguageStep(languageStep - 1);
                } else {
                  setCurrentPage('welcome');
                }
              }}
              aria-label="Previous step"
            >
              ← 이전
            </button>
            <span className="tutorial-progress" aria-live="polite">
              {languageStep + 1} / {steps.length}
            </span>
            <button
              className="btn-nav"
              onClick={() => {
                if (languageStep < steps.length - 1) {
                  setLanguageStep(languageStep + 1);
                } else {
                  setCurrentPage('mechanics');
                  setMechanicsStep(0);
                }
              }}
              aria-label="Next step"
            >
              다음 →
            </button>
          </div>

          <div
            className="language-selector"
            role="group"
            aria-label="Tutorial language selection"
          >
            {(['en', 'jp', 'es', 'kr', 'fr', 'de'] as Language[]).map((lang) => (
              <button
                key={lang}
                className={`lang-btn ${selectedLanguage === lang ? 'active' : ''}`}
                onClick={() => {
                  setSelectedLanguage(lang);
                  setLanguageStep(0);
                }}
                aria-label={`Tutorial language: ${lang.toUpperCase()}`}
                aria-pressed={selectedLanguage === lang}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="tutorial-step" aria-live="polite">
            <h2>{currentStep.title}</h2>
            <p className="step-content">{currentStep.content}</p>
            {currentStep.example && (
              <div className="example-box">
                <strong>예시:</strong>
                <code>{currentStep.example}</code>
              </div>
            )}
          </div>

          {languageStep === steps.length - 1 && (
            <div className="tutorial-finish">
              <div className="tutorial-actions">
                <button
                  className="btn-primary"
                  onClick={() => onStartTutorialStage(selectedLanguage)}
                  aria-label={`Start ${selectedLanguage.toUpperCase()} tutorial stage`}
                >
                  {selectedLanguage.toUpperCase()} 튜토리얼 스테이지 시작
                </button>
              </div>
              <small className="tutorial-hint">Press Enter to start the practice stage</small>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentPage === 'mechanics') {
    const currentStep = GAME_MECHANICS[mechanicsStep];

    return (
      <div className="tutorial">
        <div className="tutorial-content">
          <div className="tutorial-nav">
            <button
              className="btn-nav"
              onClick={() => {
                if (mechanicsStep > 0) {
                  setMechanicsStep(mechanicsStep - 1);
                } else {
                  setCurrentPage('language');
                  setLanguageStep(TUTORIAL_STEPS[selectedLanguage].length - 1);
                }
              }}
              aria-label="Previous step"
            >
              ← 이전
            </button>
            <span className="tutorial-progress" aria-live="polite">
              {mechanicsStep + 1} / {GAME_MECHANICS.length}
            </span>
            <button
              className="btn-nav"
              onClick={() => {
                if (mechanicsStep < GAME_MECHANICS.length - 1) {
                  setMechanicsStep(mechanicsStep + 1);
                } else {
                  onComplete();
                }
              }}
              aria-label={
                mechanicsStep === GAME_MECHANICS.length - 1 ? 'Finish tutorial' : 'Next step'
              }
            >
              {mechanicsStep === GAME_MECHANICS.length - 1 ? '완료' : '다음'} →
            </button>
          </div>

          <div className="tutorial-step" aria-live="polite">
            <h2>{currentStep.title}</h2>
            <p className="step-content" style={{ whiteSpace: 'pre-line' }}>
              {currentStep.content}
            </p>
          </div>

          {mechanicsStep === GAME_MECHANICS.length - 1 && (
            <div className="tutorial-finish">
              <div className="tutorial-actions">
                <button
                  className="btn-primary"
                  onClick={onComplete}
                  aria-label="Complete tutorial and enter menu"
                >
                  튜토리얼 완료, 시작하기!
                </button>
              </div>
              <small className="tutorial-hint">Press Enter to enter the game</small>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
