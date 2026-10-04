/**
 * Language Selection Screen
 *
 * 초기 진입 화면 - 학습할 언어 선택
 * 한 번 선택하면 해당 언어 스테이지 선택 화면으로 이동
 * 다른 언어로 바꾸려면 초기 화면으로 돌아가야 함
 */

import type { LanguageConfig } from '../language/LanguageRegistry.js';
import { getAllLanguages } from '../language/index.js';

interface LanguageSelectionProps {
  onSelectLanguage: (langCode: string) => void;
  onShowTutorial?: () => void;
  onStartCharTest?: () => void;
}

const LANGUAGE_FLAGS: Record<string, string> = {
  en: '🇺🇸',
  jp: '🇯🇵',
  es: '🇪🇸',
  kr: '🇰🇷',
  fr: '🇫🇷',
  de: '🇩🇪',
  zh: '🇨🇳',
};

const LANGUAGE_THEME: Record<string, string> = {
  en: '#3b82f6',
  jp: '#ec4899',
  es: '#f59e0b',
  kr: '#10b981',
  fr: '#0055A4',
  de: '#000000',
  zh: '#DE2910',
};

export function LanguageSelection({
  onSelectLanguage,
  onShowTutorial,
  onStartCharTest,
}: LanguageSelectionProps) {
  const languages = getAllLanguages();

  return (
    <div className="language-selection">
      <header className="language-selection-header">
        <h1>Typing Language</h1>
        <p>외국어를 실제 입력하듯 타자하며 적을 격파하라</p>
      </header>

      <section className="language-grid-section">
        <h2>🌍 학습할 언어를 선택하세요</h2>
        <p className="language-grid-subtitle">
          한 번 선택하면 해당 언어의 스테이지로 진입합니다.
          <br />
          다른 언어로 바꾸려면 메인 화면으로 돌아가야 합니다.
        </p>

        <div className="language-grid">
          {languages.map((lang: LanguageConfig) => (
            <button
              key={lang.code}
              className="language-card"
              style={{
                '--theme-color': LANGUAGE_THEME[lang.code] || '#6366f1',
              } as React.CSSProperties}
              onClick={() => onSelectLanguage(lang.code)}
            >
              <div className="language-flag">
                {LANGUAGE_FLAGS[lang.code] || '🌐'}
              </div>
              <div className="language-info">
                <h3>{lang.nativeName}</h3>
                <p className="language-name-en">{lang.name}</p>
                <p className="language-desc">{lang.inputDescription}</p>
                <span className="language-code">{lang.code.toUpperCase()}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <footer className="language-selection-footer">
        {onShowTutorial && (
          <button className="tutorial-btn" onClick={onShowTutorial}>
            📚 튜토리얼 다시 보기
          </button>
        )}
        {onStartCharTest && (
          <button className="chartest-btn" onClick={onStartCharTest}>
            🎨 캐릭터 애니메이션 테스트
          </button>
        )}
        <p className="language-selection-info">
          {languages.length}개 언어 지원 · 각 언어별 7 티어 · 84개 스테이지
        </p>
      </footer>
    </div>
  );
}
