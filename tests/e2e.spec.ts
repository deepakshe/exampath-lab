import { test, expect } from '@playwright/test';

// All 34 pre-rendered static routes in dist/
const allRoutes = [
  '/',
  '/404.html',
  '/about/',
  '/contact/',
  '/pricing/',
  '/library/',
  '/practice/',
  '/weekly/',
  '/exams/',
  '/exams/banking/',
  '/exams/ssc/',
  '/exams/railways/',
  '/exams/defence/',
  '/exams/state/',
  '/subjects/',
  '/subjects/english/',
  '/subjects/quant/',
  '/subjects/reasoning/',
  '/subjects/general-awareness/',
  '/subjects/banking-awareness/',
  '/subjects/computer-awareness/',
  '/library/percentage-foundation-and-shortcuts/',
  '/library/inequality-reasoning-speed-rules/',
  '/library/vocabulary-recall-mnemonic-pack-1/',
  '/library/rbi-monetary-policy-framework-sample/',
  '/paths/beginner/',
  '/paths/intermediate/',
  '/paths/revision/',
  '/weekly/vocab-mnemonic-pack-vol-1/',
  '/weekly/quant-percentage-speed-pack/',
  '/weekly/common-foundation-challenge/',
  '/legal/terms/',
  '/legal/privacy/',
  '/legal/refund/'
];

test.describe('1. Static Route Resolution (All 34 Routes)', () => {
  for (const route of allRoutes) {
    test(`Route ${route} resolves with HTTP 200 and valid HTML`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(5);
    });
  }
});

test.describe('2. Homepage Visuals & Core Navigation', () => {
  test('Loads homepage with hero, subject badges and 01/02/03 pathways', async ({ page }) => {
    await page.goto('/');
    
    // Header & Logo
    const logo = page.locator('header a:has-text("EXAMPATH")');
    await expect(logo).toBeVisible();

    // Hero headline
    const heroH1 = page.locator('h1');
    await expect(heroH1).toContainText('YOUR LEARNING STARTS HERE');

    // 01, 02, 03 Pathway Cards
    await expect(page.locator('h3:has-text("Beginner Foundation Path")')).toBeVisible();
    await expect(page.locator('h3:has-text("Intermediate Exam-Level Path")')).toBeVisible();
    await expect(page.locator('h3:has-text("Revision & Active Recall Path")')).toBeVisible();

    // Subject matrix (English, Quant, Reasoning, GA, Banking, Computer)
    await expect(page.locator('text=English Language').first()).toBeVisible();
    await expect(page.locator('text=Quantitative Aptitude').first()).toBeVisible();
    await expect(page.locator('text=Reasoning Ability').first()).toBeVisible();
  });
});

test.describe('3. Bilingual Language Switcher', () => {
  test('Toggles between English and Hindi, updates DOM and localStorage', async ({ page }) => {
    await page.goto('/');
    
    // Check initial English state
    const enText = page.locator('span[data-lang="en"]:has-text("YOUR LEARNING STARTS HERE.")');
    await expect(enText).toBeVisible();

    // Click language switcher button
    const toggleBtn = page.locator('#lang-toggle-btn');
    await toggleBtn.click();

    // Verify Hindi text is now visible
    const hiText = page.locator('span[data-lang="hi"]:has-text("आपकी व्यवस्थित तैयारी यहाँ शुरू होती है।")');
    await expect(hiText).toBeVisible();
    await expect(enText).toBeHidden();

    // Verify localStorage persistence
    const savedLang = await page.evaluate(() => localStorage.getItem('exampath_lang'));
    expect(savedLang).toBe('hi');

    // Toggle back to English
    await toggleBtn.click();
    await expect(enText).toBeVisible();
  });
});

test.describe('4. Interactive MCQ Quiz Engine', () => {
  test('Answers question, verifies correct banner, shows beginner & speed methods and FSRS grading', async ({ page }) => {
    await page.goto('/');
    
    // Locate the first question (Petrol price problem)
    const firstQuestion = page.locator('#quiz-q-q-quant-perc-01');
    await expect(firstQuestion).toBeVisible();

    // Click Option A (20% - Correct answer)
    const optionA = firstQuestion.locator('button[data-opt-id="A"]');
    await optionA.click();

    // Verify result banner appears with Correct status
    const resultBanner = firstQuestion.locator('.result-banner');
    await expect(resultBanner).toBeVisible();
    await expect(resultBanner).toContainText('Correct Answer');

    // Verify detailed solution sections are revealed
    await expect(firstQuestion.locator('text=Method 1: Step-by-Step Foundation')).toBeVisible();
    await expect(firstQuestion.locator('text=Method 2: 15-Second Exam Shortcut')).toBeVisible();
    await expect(firstQuestion.locator('text=Exam Trap Warning')).toBeVisible();

    // Grade recall using FSRS button (Good)
    const goodBtn = firstQuestion.locator('button[data-grade="Good"]');
    await goodBtn.click();
    await expect(firstQuestion.locator('text=Saved (Good)')).toBeVisible();
  });
});

test.describe('5. Library Search & Multi-Facet Filtering', () => {
  test('Searches keywords and filters by subject in real-time', async ({ page }) => {
    await page.goto('/library/');

    const searchInput = page.locator('#lib-search-input');
    const countLabel = page.locator('#filtered-count');

    // Initially shows all 4 guides
    await expect(countLabel).toHaveText('4');

    // Search for "inequality"
    await searchInput.fill('inequality');
    await expect(countLabel).toHaveText('1');
    await expect(page.locator('article:visible')).toHaveCount(1);
    await expect(page.locator('text=Inequality Reasoning: The King/Soldier Hierarchy')).toBeVisible();

    // Clear search
    await searchInput.fill('');
    await expect(countLabel).toHaveText('4');

    // Filter by subject: Quantitative Aptitude
    const subjectSelect = page.locator('#filter-subject');
    await subjectSelect.selectOption('subject-quant');
    await expect(countLabel).toHaveText('1');
    await expect(page.locator('text=Percentage Foundation, Mental Fractions')).toBeVisible();

    // Click Clear All Filters
    const clearBtn = page.locator('#clear-all-filters-btn');
    await clearBtn.click();
    await expect(countLabel).toHaveText('4');
  });
});

test.describe('6. Bookmarking System', () => {
  test('Bookmarks a resource, persists in localStorage and updates modal', async ({ page }) => {
    await page.goto('/library/');

    // Click bookmark button on first card
    const bookmarkBtn = page.locator('.bookmark-card-btn').first();
    const slug = await bookmarkBtn.getAttribute('data-slug');
    await bookmarkBtn.click();

    // Header counter badge should be visible and show '1'
    const badge = page.locator('#bookmarks-count-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText('1');

    // Open Bookmarks Drawer Modal
    const modalTrigger = page.locator('#bookmarks-toggle-btn');
    await modalTrigger.click();

    const modal = page.locator('#bookmarks-modal');
    await expect(modal).toBeVisible();
    if (slug) {
      await expect(modal.locator(`a[href="/library/${slug}/"]`)).toBeVisible();
    }

    // Close modal
    await page.locator('#close-bookmarks-btn').click();
    await expect(modal).toBeHidden();
  });
});

test.describe('7. Practice Drill Room & 3D Flashcard Deck', () => {
  test('Flips flashcard on click and navigates between cards', async ({ page }) => {
    await page.goto('/practice/');

    const cardFlipper = page.locator('#card-flipper');
    const frontTerm = page.locator('#fc-front-term');
    const backTerm = page.locator('#fc-back-term');
    const currentIdx = page.locator('#fc-current-idx');

    await expect(currentIdx).toHaveText('1');
    await expect(frontTerm).toHaveText('Aberration');

    // Click card to flip
    await cardFlipper.click();
    await expect(backTerm).toBeVisible();
    await expect(page.locator('#card-back')).toContainText('Desi Mnemonic Hook');

    // Next Card
    const nextBtn = page.locator('#fc-next-btn');
    await nextBtn.click();
    await expect(currentIdx).toHaveText('2');
    await expect(frontTerm).toHaveText('Cacophony');
  });
});

test.describe('8. Free Printable Challenge Guide', () => {
  test('Loads printable HTML guide with Day 1, 2, 3 sections and print trigger', async ({ page }) => {
    const response = await page.goto('/downloads/free/Common-Foundation-Challenge-Day1-3.html');
    expect(response?.status()).toBe(200);

    await expect(page.locator('text=DAY 1: English High-Yield Roots')).toBeVisible();
    await expect(page.locator('text=DAY 2: Quant Percentage Foundations')).toBeVisible();
    await expect(page.locator('text=DAY 3: Reasoning Inequality Hierarchy')).toBeVisible();
    await expect(page.locator('button:has-text("Save / Print as PDF")')).toBeVisible();
  });
});

test.describe('9. Responsive Navigation Drawer (Mobile)', () => {
  test('Toggles mobile dropdown menu on small viewports', async ({ page, viewport }) => {
    await page.goto('/');

    const mobileMenuBtn = page.locator('#mobile-menu-btn');
    const mobileMenu = page.locator('#mobile-menu');

    if (viewport && viewport.width < 768) {
      await expect(mobileMenuBtn).toBeVisible();
      await expect(mobileMenu).toBeHidden();

      await mobileMenuBtn.click();
      await expect(mobileMenu).toBeVisible();

      await mobileMenuBtn.click();
      await expect(mobileMenu).toBeHidden();
    } else {
      // Desktop: mobile button should be hidden
      await expect(mobileMenuBtn).toBeHidden();
    }
  });
});
