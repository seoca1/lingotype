import { chromium } from 'playwright';

const BASE = 'http://localhost:5173/typing-language/';

async function test() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const logs = [];
  page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });

  console.log('Testing Korean stage input...\n');

  try {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Skip tutorial
    const skipBtn = await page.$('.btn-secondary');
    if (skipBtn) await skipBtn.click();
    await page.waitForTimeout(1000);

    // Select Korean
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    console.log('1. Korean menu loaded');

    // Click Korean stage
    const krCard = await page.$('[data-stage-id="kr_1_1"]');
    if (krCard) await krCard.click();
    await page.waitForTimeout(500);

    console.log('2. LearnScreen shown');

    // Click Start
    const startBtn = await page.$('.learn-screen__start');
    if (startBtn) await startBtn.click();
    await page.waitForTimeout(800);

    console.log('3. After clicking Start');

    // Check for warning
    const warning = await page.$('.keyboard-warning-overlay');
    if (warning) {
      console.log('4. Warning modal shown - clicking Continue');

      // Click Continue
      const continueBtn = await page.$('.warning-btn-primary');
      if (continueBtn) await continueBtn.click();
      await page.waitForTimeout(1000);

      console.log('5. After Continue');
    }

    // Check if game screen
    const canvas = await page.$('canvas');
    console.log('   Canvas visible: ' + (canvas ? 'yes' : 'no'));

    // Type a character
    console.log('\n6. Typing "ㄱ" (Korean consonant)...');
    await page.keyboard.press('KeyA');
    await page.waitForTimeout(500);

    // Type another
    await page.keyboard.press('KeyB');
    await page.waitForTimeout(500);

    // Print relevant logs
    console.log('\nRelevant logs:');
    const relevant = logs.filter(l =>
      l.includes('[App]') ||
      l.includes('[KoreanHandler]') ||
      l.includes('[GameReducer]')
    );
    relevant.forEach(l => console.log('  ' + l));

  } catch (err) {
    console.error('Error: ' + err.message);
  }

  await browser.close();
}

test();
