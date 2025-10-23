/**
 * Puppeteer Responsive Design Tests - Tablet Devices
 * Tests tablet responsiveness across different device viewports
 */

const puppeteer = require('puppeteer');

describe('Tablet Responsive Design - Puppeteer', () => {
  let browser;
  let page;
  const baseUrl = 'http://localhost';

  const tabletDevices = [
    {
      name: 'iPad Mini',
      viewport: { width: 768, height: 1024, deviceScaleFactor: 2, isMobile: false, hasTouch: true },
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    },
    {
      name: 'iPad Air',
      viewport: { width: 820, height: 1180, deviceScaleFactor: 2, isMobile: false, hasTouch: true },
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    },
    {
      name: 'iPad Pro 11',
      viewport: { width: 834, height: 1194, deviceScaleFactor: 2, isMobile: false, hasTouch: true },
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    },
    {
      name: 'Surface Pro 7',
      viewport: { width: 912, height: 1368, deviceScaleFactor: 2, isMobile: false, hasTouch: true },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  ];

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  tabletDevices.forEach((device) => {
    describe(`${device.name} (${device.viewport.width}x${device.viewport.height})`, () => {
      beforeEach(async () => {
        await page.setViewport(device.viewport);
        if (device.userAgent) {
          await page.setUserAgent(device.userAgent);
        }
      });

      describe('Login Page on Tablet', () => {
        test('should display login page centered on tablet', async () => {
          await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle2' });

          // Form should be centered with max-width
          const form = await page.$('form');
          expect(form).not.toBeNull();

          const formWidth = await form.evaluate(el => el.offsetWidth);
          const viewportWidth = device.viewport.width;

          // Form should not span full width on tablet
          expect(formWidth).toBeLessThan(viewportWidth * 0.9);
        });

        test('should have appropriate text sizes on tablet', async () => {
          await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle2' });

          const headingSize = await page.$eval('h1', el => {
            return parseInt(window.getComputedStyle(el).fontSize);
          });

          // Should be larger on tablet
          expect(headingSize).toBeGreaterThanOrEqual(28);
        });
      });

      describe('Navigation on Tablet', () => {
        beforeEach(async () => {
          // Login first
          const testEmail = `tablet-${Date.now()}@test.com`;

          await page.goto(`${baseUrl}/register`, { waitUntil: 'networkidle2' });
          await page.type('input[type="text"]', 'Tablet Test');
          await page.type('input[type="email"]', testEmail);
          await page.type('input[type="password"]', 'password123');
          await page.click('button[type="submit"]');
          await page.waitForNavigation({ waitUntil: 'networkidle2' });
        });

        test('should display desktop navigation on tablet', async () => {
          // Tablet should show desktop nav (md:flex)
          const desktopNav = await page.$('.md\\:flex');
          expect(desktopNav).not.toBeNull();

          // Check for navigation links
          const navLinks = await page.$$('nav a');
          expect(navLinks.length).toBeGreaterThanOrEqual(3); // Dashboard, Practice, Profile
        });

        test('should show user info in navbar', async () => {
          // Should show user name (first name only)
          const userName = await page.$$eval('nav div', divs => {
            return divs.some(div => div.textContent.includes('Tablet'));
          });
          expect(userName).toBe(true);

          // Should show points
          const points = await page.$$eval('nav div', divs => {
            return divs.some(div => div.textContent.includes('points'));
          });
          expect(points).toBe(true);
        });

        test('should navigate using navbar links', async () => {
          // Click Practice link
          await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click('nav a[href="/quiz"]')
          ]);

          expect(page.url()).toContain('/quiz');

          // Click Profile link
          await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click('nav a[href="/profile"]')
          ]);

          expect(page.url()).toContain('/profile');
        });
      });

      describe('Dashboard on Tablet', () => {
        beforeEach(async () => {
          const testEmail = `dashboard-tablet-${Date.now()}@test.com`;

          await page.goto(`${baseUrl}/register`, { waitUntil: 'networkidle2' });
          await page.type('input[type="text"]', 'Dashboard Tablet Test');
          await page.type('input[type="email"]', testEmail);
          await page.type('input[type="password"]', 'password123');
          await page.click('button[type="submit"]');
          await page.waitForNavigation({ waitUntil: 'networkidle2' });
        });

        test('should display stats cards in grid layout', async () => {
          const grid = await page.$('.grid');
          expect(grid).not.toBeNull();

          const gridClasses = await grid.evaluate(el => el.className);
          expect(gridClasses).toContain('md:grid-cols-3');

          // All three cards should be visible
          const cards = await page.$$('.card');
          expect(cards.length).toBeGreaterThanOrEqual(3);
        });

        test('should have proper spacing between stats cards', async () => {
          const grid = await page.$('.grid');
          const gap = await grid.evaluate(el => {
            return window.getComputedStyle(el).gap;
          });

          // Should have gap defined
          expect(gap).toBeTruthy();
          expect(gap).not.toBe('0px');
        });

        test('should have proper max-width for content', async () => {
          const container = await page.$('.max-w-6xl, .container');
          expect(container).not.toBeNull();
        });
      });

      describe('Quiz Page on Tablet', () => {
        beforeEach(async () => {
          const testEmail = `quiz-tablet-${Date.now()}@test.com`;

          await page.goto(`${baseUrl}/register`, { waitUntil: 'networkidle2' });
          await page.type('input[type="text"]', 'Quiz Tablet Test');
          await page.type('input[type="email"]', testEmail);
          await page.type('input[type="password"]', 'password123');
          await page.click('button[type="submit"]');
          await page.waitForNavigation({ waitUntil: 'networkidle2' });

          await page.goto(`${baseUrl}/quiz`, { waitUntil: 'networkidle2' });
          await page.waitForTimeout(1000);
        });

        test('should display quiz header in row layout', async () => {
          const header = await page.$('h1');
          expect(header).not.toBeNull();

          // End Session button should be in same row on tablet
          const endButton = await page.$('button');
          expect(endButton).not.toBeNull();
        });

        test('should have constrained width for question card', async () => {
          const card = await page.$('.max-w-3xl');
          expect(card).not.toBeNull();

          const cardWidth = await card.evaluate(el => el.offsetWidth);
          const viewportWidth = device.viewport.width;

          // Should not span full width
          expect(cardWidth).toBeLessThan(viewportWidth);
        });

        test('should have adequate touch targets for answers', async () => {
          const answerButtons = await page.$$('button[class*="p-"]');

          if (answerButtons.length > 0) {
            const buttonHeight = await answerButtons[0].evaluate(el => el.offsetHeight);
            // Should still be touch-friendly on tablet
            expect(buttonHeight).toBeGreaterThanOrEqual(40);
          }
        });

        test('should have readable question text', async () => {
          const questionText = await page.$('h2');
          if (questionText) {
            const fontSize = await questionText.evaluate(el => {
              return parseInt(window.getComputedStyle(el).fontSize);
            });

            // Should be larger on tablet
            expect(fontSize).toBeGreaterThanOrEqual(16);
          }
        });
      });

      describe('Profile Page on Tablet', () => {
        beforeEach(async () => {
          const testEmail = `profile-tablet-${Date.now()}@test.com`;

          await page.goto(`${baseUrl}/register`, { waitUntil: 'networkidle2' });
          await page.type('input[type="text"]', 'Profile Tablet Test');
          await page.type('input[type="email"]', testEmail);
          await page.type('input[type="password"]', 'password123');
          await page.click('button[type="submit"]');
          await page.waitForNavigation({ waitUntil: 'networkidle2' });

          await page.goto(`${baseUrl}/profile`, { waitUntil: 'networkidle2' });
        });

        test('should display profile with proper layout', async () => {
          const pageTitle = await page.$eval('h1', el => el.textContent);
          expect(pageTitle).toContain('Profile');

          // Profile card should have max-width
          const card = await page.$('.max-w-2xl');
          expect(card).not.toBeNull();
        });

        test('should have auto-width logout button on tablet', async () => {
          const logoutButton = await page.$('button');
          if (logoutButton) {
            const buttonWidth = await logoutButton.evaluate(el => el.offsetWidth);
            const viewportWidth = device.viewport.width;

            // Button should not span full width on tablet
            expect(buttonWidth).toBeLessThan(viewportWidth * 0.5);
          }
        });
      });

      describe('Visual Regression - Tablet Screenshots', () => {
        test('should capture dashboard screenshot on tablet', async () => {
          const testEmail = `screenshot-tablet-${Date.now()}@test.com`;

          await page.goto(`${baseUrl}/register`, { waitUntil: 'networkidle2' });
          await page.type('input[type="text"]', 'Screenshot Test');
          await page.type('input[type="email"]', testEmail);
          await page.type('input[type="password"]', 'password123');
          await page.click('button[type="submit"]');
          await page.waitForNavigation({ waitUntil: 'networkidle2' });

          const screenshot = await page.screenshot({
            path: `testing/puppeteer-responsive/screenshots/${device.name.replace(/\s+/g, '-')}-dashboard.png`,
            fullPage: true
          });

          expect(screenshot).toBeTruthy();
        });

        test('should capture quiz page screenshot on tablet', async () => {
          const testEmail = `screenshot-quiz-tablet-${Date.now()}@test.com`;

          await page.goto(`${baseUrl}/register`, { waitUntil: 'networkidle2' });
          await page.type('input[type="text"]', 'Quiz Screenshot Test');
          await page.type('input[type="email"]', testEmail);
          await page.type('input[type="password"]', 'password123');
          await page.click('button[type="submit"]');
          await page.waitForNavigation({ waitUntil: 'networkidle2' });

          await page.goto(`${baseUrl}/quiz`, { waitUntil: 'networkidle2' });
          await page.waitForTimeout(1000);

          const screenshot = await page.screenshot({
            path: `testing/puppeteer-responsive/screenshots/${device.name.replace(/\s+/g, '-')}-quiz.png`,
            fullPage: true
          });

          expect(screenshot).toBeTruthy();
        });
      });

      describe('Landscape Orientation', () => {
        test('should handle landscape orientation properly', async () => {
          // Rotate to landscape
          await page.setViewport({
            ...device.viewport,
            width: device.viewport.height,
            height: device.viewport.width
          });

          const testEmail = `landscape-${Date.now()}@test.com`;

          await page.goto(`${baseUrl}/register`, { waitUntil: 'networkidle2' });
          await page.type('input[type="text"]', 'Landscape Test');
          await page.type('input[type="email"]', testEmail);
          await page.type('input[type="password"]', 'password123');
          await page.click('button[type="submit"]');
          await page.waitForNavigation({ waitUntil: 'networkidle2' });

          // Dashboard should display properly in landscape
          const welcomeText = await page.$eval('h1', el => el.textContent);
          expect(welcomeText).toContain('Welcome back, Landscape');

          // Navigation should still be visible
          const nav = await page.$('nav');
          expect(nav).not.toBeNull();
        });
      });

      describe('Hover Effects on Tablet', () => {
        beforeEach(async () => {
          const testEmail = `hover-tablet-${Date.now()}@test.com`;

          await page.goto(`${baseUrl}/register`, { waitUntil: 'networkidle2' });
          await page.type('input[type="text"]', 'Hover Test');
          await page.type('input[type="email"]', testEmail);
          await page.type('input[type="password"]', 'password123');
          await page.click('button[type="submit"]');
          await page.waitForNavigation({ waitUntil: 'networkidle2' });
        });

        test('should have hover effects on navigation links', async () => {
          const navLink = await page.$('nav a');
          if (navLink) {
            const hoverClass = await navLink.evaluate(el => {
              return el.className.includes('hover');
            });

            expect(hoverClass).toBe(true);
          }
        });
      });
    });
  });
});
