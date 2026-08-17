/**
 * UI Translations
 *
 * Multilingual UI strings for the game's chrome (buttons, labels, headings).
 * This is for the application's UI surface, NOT in-game learning content
 * (which lives in the Language wiki).
 *
 * Languages:
 * - en: English (default)
 * - ko: 한국어
 * - ja: 日本語
 * - es: Español
 *
 * To add a new string:
 * 1. Add a key to the UITranslations type
 * 2. Provide translations for all 4 languages in UI_STRINGS
 * 3. Use t('key') in components
 */

import type { NativeLanguage } from './nativeLanguage.js';

export type TranslationKey =
  // Stage / Game UI
  | 'backToMenu'
  | 'stageClear'
  | 'nextStage'
  | 'tryAgain'
  | 'showHint'
  // Game HUD
  | 'score'
  | 'defeated'
  | 'combo'
  | 'wpm'
  | 'accuracy'
  | 'audio'
  | 'volume'
  | 'on'
  | 'off'
  | 'sound'
  | 'mute'
  // Tooltip / in-game explanations
  | 'meaning' // 뜻
  | 'pronunciation' // 발음
  | 'input' // 입력
  | 'category' // 카테고리
  | 'level' // 레벨
  | 'difficulty' // 난이도
  | 'listening'
  | 'tipHoverForMeaning' // 적 위에 마우스... (existing)
  // Daily lesson
  | 'todaysLesson' // 오늘의 학습
  | 'readMore' // 읽어보기
  | 'practice' // 연습하기
  | 'later' // 나중에
  | 'vocabulary' // 어휘
  | 'expressions' // 표현
  | 'culture' // 문화
  | 'minutes' // 분
  | 'words' // 단어
  | 'quick' // Quick
  | 'standard' // Standard
  | 'deep' // Deep
  | 'close' // 닫기
  | 'relatedStageComingSoon' // 곧 추가됩니다
  | 'rawMaterial' // 원본
  | 'listeningTo' // 발음 듣기
  // Result screen
  | 'stageResult' // Stage Result
  | 'missions' // Missions
  | 'weakWords' // Weak Words
  | 'learningProgress' // 학습 진행도
  | 'wordsLearned' // 학습 중
  | 'masteryPercent' // 숙련도
  | 'mistakes' // 실수
  // Learn screen
  | 'learnTitle' // 학습
  | 'back' // 뒤로
  | 'start' // 시작
  | 'core' // 핵심
  | 'all' // 전체
  | 'learningTip' // 팁
  | 'preview' // 미리보기
  | 'studyNote' // 학습 노트
  | 'wordInfo' // 단어 정보
  | 'display' // 표시
  | 'times' // 번
  // Common
  | 'yes'
  | 'no'
  | 'ok'
  | 'cancel'
  | 'error'
  | 'loading'
  | 'language'
  | 'settings'
  | 'character'
  | 'selectCharacter'
  | 'nativeLanguage' // 모국어 / Native Language
  | 'characterSelect' // 캐릭터 선택
  | 'randomCharacter' // 랜덤 캐릭터
  | 'noCharacterSelected' // 선택 안 함
  | 'stages' // 스테이지 (메뉴)
  | 'bestScore' // 최고 점수
  | 'points' // 점
  | 'startingStage' // 시작 단계
  | 'startingStageReady' // 시작 단계 - 바로 플레이 가능
  | 'unlocked' // 잠금 해제
  | 'locked' // 잠김
  | 'tierRange' // 티어 범위
  | 'menuFooter' // 메뉴 푸터
  // Phase 39: settings saved indicator + language selection hints
  | 'settingsSaved' // 설정 저장됨
  | 'footerHint' // 푸터 안내
  | 'languagesSupported' // 지원 언어 수
  | 'pressEscToClose'; // Esc 닫기

export const UI_STRINGS: Record<TranslationKey, Record<NativeLanguage, string>> = {
  // Stage / Game UI
  backToMenu: { en: 'Back to Menu', ko: '메뉴로', ja: 'メニューへ', es: 'Volver al menú' },
  stageClear: { en: 'Stage Clear!', ko: '스테이지 클리어!', ja: 'ステージクリア!', es: '¡Etapa completada!' },
  nextStage: { en: 'Next Stage', ko: '다음 스테이지', ja: '次のステージ', es: 'Siguiente etapa' },
  tryAgain: { en: 'Try Again', ko: '다시 시도', ja: 'もう一度', es: 'Reintentar' },
  showHint: { en: 'Show Hint', ko: '힌트 보기', ja: 'ヒントを見る', es: 'Ver pista' },

  // Game HUD
  score: { en: 'Score', ko: '점수', ja: 'スコア', es: 'Puntuación' },
  defeated: { en: 'Defeated', ko: '격파', ja: '撃破', es: 'Derrotados' },
  combo: { en: 'Combo', ko: '콤보', ja: 'コンボ', es: 'Combo' },
  wpm: { en: 'WPM', ko: 'WPM', ja: 'WPM', es: 'PPM' },
  accuracy: { en: 'ACC', ko: '정확도', ja: '精度', es: 'Prec.' },
  audio: { en: 'Audio', ko: '오디오', ja: 'オーディオ', es: 'Audio' },
  volume: { en: 'Volume', ko: '볼륨', ja: '音量', es: 'Volumen' },
  on: { en: 'On', ko: '켜기', ja: 'オン', es: 'Encendido' },
  off: { en: 'Off', ko: '끄기', ja: 'オフ', es: 'Apagado' },
  sound: { en: 'Sound', ko: '소리', ja: '音', es: 'Sonido' },
  mute: { en: 'Mute', ko: '음소거', ja: 'ミュート', es: 'Silencio' },

  // Tooltip
  meaning: { en: 'Meaning', ko: '뜻', ja: '意味', es: 'Significado' },
  pronunciation: { en: 'Pronunciation', ko: '발음', ja: '発音', es: 'Pronunciación' },
  input: { en: 'Input', ko: '입력', ja: '入力', es: 'Entrada' },
  category: { en: 'Category', ko: '카테고리', ja: 'カテゴリ', es: 'Categoría' },
  level: { en: 'Level', ko: '난이도', ja: 'レベル', es: 'Nivel' },
  difficulty: { en: 'Difficulty', ko: '난이도', ja: '難易度', es: 'Dificultad' },
  listening: { en: 'Listening...', ko: '재생 중...', ja: '再生中...', es: 'Reproduciendo...' },
  tipHoverForMeaning: {
    en: '💡 Hover over an enemy to see meaning/pronunciation',
    ko: '💡 적 위에 마우스를 올리면 뜻/발음을 볼 수 있습니다',
    ja: '💡 敵の上にマウスを置くと意味・発音が確認できます',
    es: '💡 Pasa el ratón sobre un enemigo para ver significado/pronunciación',
  },

  // Daily lesson
  todaysLesson: { en: "Today's Lesson", ko: '오늘의 학습', ja: '今日の学習', es: 'Lección de hoy' },
  readMore: { en: 'Read', ko: '읽어보기', ja: '読む', es: 'Leer' },
  practice: { en: 'Practice', ko: '연습하기', ja: '練習する', es: 'Practicar' },
  later: { en: 'Later', ko: '나중에', ja: '後で', es: 'Más tarde' },
  vocabulary: { en: 'Vocabulary', ko: '어휘', ja: '語彙', es: 'Vocabulario' },
  expressions: { en: 'Expressions', ko: '표현', ja: '表現', es: 'Expresiones' },
  culture: { en: 'Culture', ko: '문화', ja: '文化', es: 'Cultura' },
  minutes: { en: 'min', ko: '분', ja: '分', es: 'min' },
  words: { en: 'words', ko: '단어', ja: '語', es: 'palabras' },
  quick: { en: 'Quick', ko: '퀵', ja: 'クイック', es: 'Rápido' },
  standard: { en: 'Standard', ko: '표준', ja: '標準', es: 'Estándar' },
  deep: { en: 'Deep', ko: '심화', ja: '詳細', es: 'Profundo' },
  close: { en: 'Close', ko: '닫기', ja: '閉じる', es: 'Cerrar' },
  relatedStageComingSoon: {
    en: 'A practice stage for this topic is coming soon',
    ko: '이 주제와 관련된 연습 스테이지가 곧 추가됩니다',
    ja: 'このトピックに関連する練習ステージは近日追加',
    es: 'Pronto añadiremos una etapa de práctica para este tema',
  },
  rawMaterial: { en: 'Original Source', ko: '원본', ja: '原文', es: 'Fuente original' },
  listeningTo: { en: 'Listen', ko: '발음 듣기', ja: '発音を聞く', es: 'Escuchar pronunciación' },

  // Result screen
  stageResult: { en: 'Stage Result', ko: '스테이지 결과', ja: 'ステージ結果', es: 'Resultado' },
  missions: { en: 'Missions', ko: '미션', ja: 'ミッション', es: 'Misiones' },
  weakWords: { en: 'Weak Words (this stage)', ko: '약한 단어 (이번 스테이지)', ja: '苦手な単語 (このステージ)', es: 'Palabras difíciles (esta etapa)' },
  learningProgress: { en: '📊 Learning Progress', ko: '📊 학습 진행도', ja: '📊 学習進捗', es: '📊 Progreso' },
  wordsLearned: { en: 'words learned', ko: '학습 중', ja: '学習中', es: 'palabras aprendidas' },
  masteryPercent: { en: 'Overall mastery', ko: '전체 숙련도', ja: '全体の習熟度', es: 'Dominio general' },
  mistakes: { en: 'mistakes', ko: '실수', ja: 'ミス', es: 'errores' },

  // Learn screen
  learnTitle: { en: 'Learn', ko: '학습', ja: '学習', es: 'Aprender' },
  back: { en: 'Back', ko: '뒤로', ja: '戻る', es: 'Atrás' },
  start: { en: 'Start', ko: '시작', ja: '開始', es: 'Empezar' },
  core: { en: 'Core', ko: '핵심', ja: '重要', es: 'Esencial' },
  all: { en: 'All', ko: '전체', ja: '全て', es: 'Todo' },
  learningTip: {
    en: 'Tip: Click any word to see detailed information',
    ko: '팁: 각 단어를 클릭하면 더 자세한 정보를 볼 수 있습니다',
    ja: 'ヒント: 単語をクリックすると詳細情報が見られます',
    es: 'Consejo: haz clic en cada palabra para más información',
  },
  preview: { en: 'Preview', ko: '미리보기', ja: 'プレビュー', es: 'Vista previa' },
  studyNote: { en: 'Study Note', ko: '학습 노트', ja: '学習メモ', es: 'Nota de estudio' },
  wordInfo: { en: 'Word Info', ko: '단어 정보', ja: '単語情報', es: 'Información' },
  display: { en: 'Display', ko: '표시', ja: '表示', es: 'Visualización' },
  times: { en: 'times', ko: '번', ja: '回', es: 'veces' },

  // Common
  yes: { en: 'Yes', ko: '예', ja: 'はい', es: 'Sí' },
  no: { en: 'No', ko: '아니오', ja: 'いいえ', es: 'No' },
  ok: { en: 'OK', ko: '확인', ja: 'OK', es: 'OK' },
  cancel: { en: 'Cancel', ko: '취소', ja: 'キャンセル', es: 'Cancelar' },
  error: { en: 'Error', ko: '오류', ja: 'エラー', es: 'Error' },
  loading: { en: 'Loading...', ko: '로딩 중...', ja: '読み込み中...', es: 'Cargando...' },
  language: { en: 'Language', ko: '언어', ja: '言語', es: 'Idioma' },
  settings: { en: 'Settings', ko: '설정', ja: '設定', es: 'Ajustes' },
  character: { en: 'Character', ko: '캐릭터', ja: 'キャラクター', es: 'Personaje' },
  selectCharacter: { en: 'Select Character', ko: '캐릭터 선택', ja: 'キャラクター選択', es: 'Seleccionar personaje' },
  nativeLanguage: {
    en: 'Native Language',
    ko: '모국어',
    ja: '母語',
    es: 'Idioma nativo',
  },
  characterSelect: { en: 'Character Select', ko: '캐릭터 선택', ja: 'キャラ選択', es: 'Selección de personaje' },
  randomCharacter: { en: 'Random', ko: '랜덤', ja: 'ランダム', es: 'Aleatorio' },
  noCharacterSelected: { en: 'No character selected', ko: '선택 안 함', ja: '未選択', es: 'Sin selección' },

  // Menu specific
  stages: { en: 'stages', ko: '스테이지', ja: 'ステージ', es: 'etapas' },
  bestScore: { en: 'Best', ko: '최고', ja: '最高', es: 'Mejor' },
  points: { en: 'pts', ko: '점', ja: '点', es: 'pts' },
  startingStage: { en: 'Starting Stage', ko: '시작 단계', ja: '開始ステージ', es: 'Etapa inicial' },
  startingStageReady: { en: 'Starting Stage — Ready to play!', ko: '시작 단계 — 바로 플레이할 수 있어요', ja: '開始ステージ — すぐにプレイ可能', es: '¡Etapa inicial — Listo para jugar!' },
  unlocked: { en: 'Unlocked!', ko: '잠금 해제!', ja: 'ロック解除!', es: '¡Desbloqueado!' },
  locked: { en: 'Locked', ko: '잠김', ja: 'ロック', es: 'Bloqueado' },
  tierRange: { en: 'Tiers {min}-{max}', ko: '티어 {min}-{max}', ja: 'ティア{min}-{max}', es: 'Niveles {min}-{max}' },
  menuFooter: { en: 'Words to paragraphs · {count} {stages}', ko: '단어부터 장문까지 6 티어 · 총 {count} 스테이지', ja: '単語から段落まで6ティア · 合計{count}ステージ', es: 'Palabras a párrafos · {count} {stages}' },
  // Phase 39: SettingsScreen "saved" indicator now follows the user's
  // native language. Previously the visible English string broke the
  // language-preference contract for KO/JA/ES users (the surrounding
  // Settings body is translated via t() but the live-region visible text
  // was hardcoded). SR users hear the indicator anyway via role=status +
  // aria-live=polite; sighted users now see the translation matching the
  // rest of the screen.
  settingsSaved: {
    en: '✓ Settings saved',
    ko: '✓ 설정이 저장됨',
    ja: '✓ 設定を保存しました',
    es: '✓ Ajustes guardados',
  },
  // Phase 39: LanguageSelection footer hint about supported languages +
  // tier count. Replaces the hardcoded "7개 언어 지원 · 각 언어별 7 티어
  // · 140개 스테이지" which broke for non-KO native speakers using the
  // EN/JA/ES localized UI.
  footerHint: {
    en: '{count} languages supported · 7 tiers per language · 140 stages',
    ko: '{count}개 언어 지원 · 각 언어별 7 티어 · 140개 스테이지',
    ja: '{count}言語対応 · 各言語7ティア · 140ステージ',
    es: '{count} idiomas compatibles · 7 niveles por idioma · 140 etapas',
  },
  languagesSupported: {
    en: '{count} languages',
    ko: '{count}개 언어',
    ja: '{count}言語',
    es: '{count} idiomas',
  },
  pressEscToClose: {
    en: 'Press Esc to close',
    ko: '닫으려면 Esc 키를 누르세요',
    ja: '閉じるには Esc キーを押してください',
    es: 'Pulsa Esc para cerrar',
  },
};

/**
 * Get a translated string for the given key and native language.
 * Falls back to English if the key is missing for the target language.
 */
export function t(
  key: TranslationKey,
  nativeLanguage: NativeLanguage
): string {
  const entry = UI_STRINGS[key];
  if (!entry) return key; // Key not registered — show key as debug
  return entry[nativeLanguage] ?? entry.en ?? key;
}
