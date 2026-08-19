#!/usr/bin/env node
/**
 * CLI Verification Tool
 * 
 * 언어 시스템과 입력 핸들러를 커맨드라인에서 직접 테스트합니다.
 * 
 * Usage:
 *   npm run cli:verify
 *   npm run cli:verify -- --language=jp
 *   npm run cli:verify -- --interactive
 */

import * as readline from 'readline';
import { getAllLanguages, getLanguage } from '../language/index.js';
import type { LanguageConfig } from '../language/index.js';

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function printHeader() {
  console.clear();
  log('╔══════════════════════════════════════════════════════════════╗', 'cyan');
  log('║          LingoType - CLI Verification Tool            ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════════╝', 'cyan');
  console.log();
}

function printLanguageInfo(lang: LanguageConfig) {
  log(`📦 Language: ${lang.name} (${lang.code})`, 'bright');
  log(`   Native: ${lang.nativeName}`, 'dim');
  log(`   Input: ${lang.inputDescription}`, 'dim');
  log(`   Tier 0 Support: ${lang.supportsTier0 ? '✅' : '❌'}`, 'dim');
  log(`   Words: ${lang.corpus.words.length}`, 'dim');
  log(`   Sentences: ${lang.corpus.sentences.length}`, 'dim');
  if (lang.corpus.chars) {
    const charCount = Object.values(lang.corpus.chars).reduce((sum, arr) => sum + arr.length, 0);
    log(`   Characters: ${charCount}`, 'dim');
  }
  console.log();
}

function listAllLanguages() {
  printHeader();
  log('📚 Available Languages:', 'bright');
  console.log();

  const languages = getAllLanguages();
  
  for (const lang of languages) {
    printLanguageInfo(lang);
  }

  log(`Total: ${languages.length} languages registered`, 'green');
  console.log();
}

function testLanguage(langCode: string) {
  printHeader();
  
  try {
    const lang = getLanguage(langCode);
    log(`✅ Language '${langCode}' found!`, 'green');
    console.log();
    printLanguageInfo(lang);

    // Test handler creation
    log('🔧 Testing InputHandler creation...', 'yellow');
    const handler = lang.createHandler();
    log(`✅ InputHandler created: ${handler.constructor.name}`, 'green');
    console.log();

    // Test corpus
    log('📝 Testing corpus...', 'yellow');
    if (lang.corpus.words.length > 0) {
      const sample = lang.corpus.words[0];
      log(`   Sample word: "${sample.display}" (${sample.meaning || 'no meaning'})`, 'dim');
    }
    if (lang.corpus.sentences.length > 0) {
      const sample = lang.corpus.sentences[0];
      log(`   Sample sentence: "${sample.display}"`, 'dim');
    }
    log('✅ Corpus loaded successfully', 'green');
    console.log();

  } catch (error) {
    log(`❌ Error: ${error instanceof Error ? error.message : String(error)}`, 'red');
    console.log();
  }
}

async function interactiveMode() {
  printHeader();
  
  const languages = getAllLanguages();
  log('Select a language:', 'bright');
  console.log();
  
  languages.forEach((lang, idx) => {
    const note = lang.code === 'kr' ? ' (CLI not supported - use web)' : '';
    log(`  ${idx + 1}. ${lang.name} (${lang.code}) — ${lang.nativeName}${note}`, 'cyan');
  });
  console.log();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await new Promise<string>((resolve) => {
    rl.question(`${colors.yellow}Enter number (1-${languages.length}): ${colors.reset}`, resolve);
  });

  const idx = parseInt(answer) - 1;
  if (idx < 0 || idx >= languages.length) {
    log('❌ Invalid selection', 'red');
    rl.close();
    return;
  }

  const selectedLang = languages[idx];
  console.clear();
  printHeader();
  log(`Selected: ${selectedLang.name} (${selectedLang.code})`, 'bright');
  console.log();

  // Start typing practice
  await typingPractice(selectedLang, rl);
}

async function typingPractice(lang: LanguageConfig, rl: readline.Interface) {
  // Korean requires jamo-level input which is not supported in CLI
  if (lang.code === 'kr') {
    log('⚠️  Korean input is not supported in CLI mode', 'yellow');
    log('Korean requires jamo-level composition (ㄱ + ㅏ + ㄴ → 간)', 'dim');
    log('Please use the web version for Korean typing practice.', 'dim');
    console.log();
    log('💡 To try Korean in the browser:', 'cyan');
    log('   cd prototype', 'dim');
    log('   npm run dev', 'dim');
    log('   Open http://localhost:5173', 'dim');
    console.log();
    rl.close();
    return;
  }

  const handler = lang.createHandler();
  const words = lang.corpus.words.filter((w) => w.level <= 2).slice(0, 5);

  if (words.length === 0) {
    log('❌ No words available for practice', 'red');
    rl.close();
    return;
  }

  log('🎮 Typing Practice Mode', 'bright');
  log('Type the displayed words. Press Ctrl+C to exit.', 'dim');
  console.log();

  let score = 0;
  let total = 0;

  for (const word of words) {
    total++;
    log(`\nTarget: ${colors.cyan}${word.display}${colors.reset}`, 'bright');
    if (word.meaning) {
      log(`Meaning: ${word.meaning}`, 'dim');
    }

    // For Japanese, show romaji hint
    if ('romaji' in word && word.romaji) {
      log(`Hint: Type "${word.romaji}"`, 'dim');
    }

    // Create Target object
    let acceptedInput = word.display;
    if ('romaji' in word && word.romaji) {
      acceptedInput = word.romaji as string;
    }

    const target = {
      text: word.display,
      acceptedInputs: [acceptedInput],
      level: word.level,
    };

    // Set target for handler (setTarget calls reset internally)
    handler.setTarget(target);

    const input = await new Promise<string>((resolve) => {
      rl.question(`${colors.yellow}Type here: ${colors.reset}`, resolve);
    });

    // Simulate typing
    let result: any;
    for (const char of input) {
      result = handler.handleKey({ key: char } as KeyboardEvent);
    }

    if (!result) {
      result = { completed: false, accuracy: 0, errors: 0, currentBuffer: '' };
    }

    if (result.completed) {
      log(`✅ Correct! Accuracy: ${result.accuracy.toFixed(1)}%`, 'green');
      score++;
    } else {
      log(`❌ Incorrect. Expected: "${word.display}", Got: "${input}"`, 'red');
      log(`   Buffer: "${result.currentBuffer}"`, 'dim');
    }
  }

  console.log();
  log('═══════════════════════════════════════', 'cyan');
  log(`📊 Results: ${score}/${total} correct (${((score / total) * 100).toFixed(1)}%)`, 'bright');
  log('═══════════════════════════════════════', 'cyan');
  console.log();

  rl.close();
}

// Main
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    printHeader();
    log('Usage:', 'bright');
    log('  npm run cli:verify                 List all languages', 'dim');
    log('  npm run cli:verify -- --language=jp   Test specific language', 'dim');
    log('  npm run cli:verify -- --interactive    Interactive mode', 'dim');
    console.log();
    return;
  }

  const langArg = args.find((arg: string) => arg.startsWith('--language='));
  const interactive = args.includes('--interactive') || args.includes('-i');

  if (interactive) {
    await interactiveMode();
  } else if (langArg) {
    const langCode = langArg.split('=')[1];
    testLanguage(langCode);
  } else {
    listAllLanguages();
  }
}

main().catch((error) => {
  log(`\n❌ Fatal error: ${error instanceof Error ? error.message : String(error)}`, 'red');
  process.exit(1);
});
