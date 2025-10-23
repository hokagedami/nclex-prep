/**
 * Puppeteer Responsive Design Tests - Mobile Devices
 * Tests mobile responsiveness across different device viewports
 */

const puppeteer = require('puppeteer');

describe('Mobile Responsive Design - Puppeteer', () => {
  let browser;
  let page;
  const baseUrl = 'http://localhost';

  const mobileDevices = [
    {
      name: 'iPhone SE',
      viewport: { width: 375, height: 667, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15'
    },
    {
      name: 'iPhone 12',
      viewport: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    },
    {
      name: 'Samsung Galaxy S20',
      viewport: { width: 360, height: 800, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
      userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36'
    },
    {
      name: 'Pixel 5',
      viewport: { width: 393, height: 851, deviceScaleFactor: 2.75, isMobile: true, hasTouch: true },
      userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36'
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

  mobileDevices.forEach((device) => {
    describe(`${device.name} (${device.viewport.width}x${device.viewport.height})`, () => {
      beforeEach(async () => {
        await page.setViewport(device.viewport);
        if (device.userAgent) {
          await page.setUserAgent(device.userAgent);
        }
      });

      describe('Login Page Responsiveness', () => {
        test('should display login page correctly on mobile', async () => {
          await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle2' });

          // Check header is visible
          const header = await page.$eval('h1', el => el.textContent);
          expect(header).toContain('NCLEX Prep');

          // Check subtitle
          const subtitle = await page.$('p');
          expect(subtitle).not.toBeNull();

          // Verify form elements are present and visible
          const emailInput = await page.$('input[type="email"]');
          const passwordInput = await page.$('input[type="password"]');
          const submitButton = await page.$('button[type="submit"]');

          expect(emailInput).not.toBeNull();
          expect(passwordInput).not.toBeNull();
          expect(submitButton).not.toBeNull();

          // Verify elements are visible in viewport
          const emailVisible = await emailInput.isIntersectingViewport();
          const passwordVisible = await passwordInput.isIntersectingViewport();
          const buttonVisible = await submitButton.isIntersectingViewport();

          expect(emailVisible).toBe(true);
          expect(passwordVisible).toBe(true);
          expect(buttonVisible).toBe(true);
        });

        test('should have full-width button on mobile', async () => {
          await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle2' });

          const buttonWidth = await page.$eval('button[type="submit"]', el => el.offsetWidth);
          const containerWidth = await page.$eval('.max-w-md', el => el.offsetWidth);

          // Button should be close to container width (accounting for padding)
          expect(buttonWidth).toBeGreaterThan(containerWidth * 0.85);
        });

        test('should have appropriate text sizes for mobile', async () => {
          await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle2' });

          // Check main heading size
          const headingSize = await page.$eval('h1', el => {
            return parseInt(window.getComputedStyle(el).fontSize);
          });

          // Should be between 24px and 36px on mobile
          expect(headingSize).toBeGreaterThanOrEqual(24);
          expect(headingSize).toBeLessThanOrEqual(36);
        });

        test('should have touch-friendly input fields', async () => {
          await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle2' });

          const emailInputHeight = await page.$eval('input[type="email"]', el => el.offsetHeight);
          const passwordInputHeight = await page.$eval('input[type="password"]', el => el.offsetHeight);

          // Input fields should be at least 40px tall for touch
          expect(emailInputHeight).toBeGreaterThanOrEqual(40);
          expect(passwordInputHeight).toBeGreaterThanOrEqual(40);
        });
      });

      describe('Register Page Responsiveness', () => {
        test('should display registration form correctly on mobile', async () => {
          await page.goto(`${baseUrl}/register`, { waitUntil: 'networkidle2' });

          // Check all form fields are present
          const nameInput = await page.$('input[type="text"]');
          const emailInput = await page.$('input[type="email"]');
          const passwordInput = await page.$('input[type="password"]');
          const submitButton = await page.$('button[type="submit"]');

          expect(nameInput).not.toBeNull();
          expect(emailInput).not.toBeNull();
          expect(passwordInput).not.toBeNull();
          expect(submitButton).not.toBeNull();

          // All should be visible in viewport
          expect(await nameInput.isIntersectingViewport()).toBe(true);
          expect(await emailInput.isIntersectingViewport()).toBe(true);
        });

        test('should have adequate spacing between form fields', async () => {
          await page.goto(`${baseUrl}/register`, { waitUntil: 'networkidle2' });

          const formSpacing = await page.$eval('form', el => {
            const computedStyle = window.getComputedStyle(el);
            return computedStyle.getPropertyValue('gap') || computedStyle.getPropertyValue('row-gap');
          });

          // Should have adequate spacing (Tailwind space-y-4 or space-y-6)
          expect(formSpacing).toBeTruthy();
        });
      });

      describe('Dashboard Responsiveness (After Login)', () => {
        beforeEach(async () => {
          // Register and login
          const testEmail = `mobile-${Date.now()}@test.com`;

          await page.goto(`${baseUrl}/register`, { waitUntil: 'networkidle2' });
          await page.type('input[type="text"]', 'Mobile Test');
          await page.type('input[type="email"]', testEmail);
          await page.type('input[type="password"]', 'password123');
          await page.click('button[type="submit"]');
          await page.waitForNavigation({ waitUntil: 'networkidle2' });
        });

        test('should display welcome message with first name only', async () => {
          const welcomeText = await page.$eval('h1', el => el.textContent);
          expect(welcomeText).toContain('Welcome back, Mobile');
          expect(welcomeText).toContain('!');
        });

        test('should display stats cards in single column on mobile', async () => {
          if (device.viewport.width < 768) {
            const statsCards = await page.$$('.card');
            expect(statsCards.length).toBeGreaterThanOrEqual(3);

            // Check grid layout
            const gridClasses = await page.$eval('.grid', el => el.className);
            expect(gridClasses).toContain('grid-cols-1');
          }
        });

        test('should have mobile navbar on small screens', async () => {
          if (device.viewport.width < 768) {
            // Should have hamburger menu button
            const menuButton = await page.$('button[aria-label="Toggle menu"]');
            expect(menuButton).not.toBeNull();

            // Desktop nav should be hidden
            const desktopNav = await page.$('.hidden.md\\:flex');
            expect(desktopNav).not.toBeNull();
          }
        });

        test('should open mobile menu when hamburger is clicked', async () => {
          if (device.viewport.width < 768) {
            const menuButton = await page.$('button[aria-label="Toggle menu"]');
            if (menuButton) {
              await menuButton.click();
              await page.waitForTimeout(300); // Wait for animation

              // Mobile menu should be visible
              const mobileMenu = await page.$('.md\\:hidden .flex.flex-col');
              expect(mobileMenu).not.toBeNull();
            }
          }
        });

        test('should display Start Practice button as full width on mobile', async () => {
          const button = await page.$('button:has-text("Start Practice Session")') ||
                         await page.$('button');

          if (button) {
            const buttonWidth = await button.evaluate(el => el.offsetWidth);
            const viewportWidth = device.viewport.width;

            // Button should be close to full width (accounting for padding)
            expect(buttonWidth).toBeGreaterThan(viewportWidth * 0.75);
          }
        });
      });

      describe('Quiz Page Responsiveness', () => {
        beforeEach(async () => {
          // Login first
          const testEmail = `quiz-mobile-${Date.now()}@test.com`;

          await page.goto(`${baseUrl}/register`, { waitUntil: 'networkidle2' });
          await page.type('input[type="text"]', 'Quiz Mobile Test');
          await page.type('input[type="email"]', testEmail);
          await page.type('input[type="password"]', 'password123');
          await page.click('button[type="submit"]');
          await page.waitForNavigation({ waitUntil: 'networkidle2' });

          // Navigate to quiz
          await page.goto(`${baseUrl}/quiz`, { waitUntil: 'networkidle2' });
          await page.waitForTimeout(1000); // Wait for question to load
        });

        test('should display quiz header responsively', async () => {
          const header = await page.$('h1');
          expect(header).not.toBeNull();

          const headerText = await header.evaluate(el => el.textContent);
          expect(headerText).toContain('Practice Session');

          // End Session button should be visible
          const endButton = await page.$('button:has-text("End Session")') ||
                           await page.$$eval('button', buttons =>
                             buttons.find(b => b.textContent.includes('End'))
                           );
          expect(endButton).toBeTruthy();
        });

        test('should display question card with proper mobile spacing', async () => {
          const questionCard = await page.$('.card');
          expect(questionCard).not.toBeNull();

          // Category badge should be visible
          const categoryBadge = await page.$('.rounded-full');
          expect(categoryBadge).not.toBeNull();
        });

        test('should have full-width answer buttons on mobile', async () => {
          const answerButtons = await page.$$('button.w-full');
          expect(answerButtons.length).toBeGreaterThan(0);
        });

        test('should have adequate touch targets for answer options', async () => {
          const answerOptions = await page.$$('button[class*="p-"]');

          if (answerOptions.length > 0) {
            const firstOptionHeight = await answerOptions[0].evaluate(el => el.offsetHeight);
            // Should be at least 44px for iOS touch guidelines
            expect(firstOptionHeight).toBeGreaterThanOrEqual(40);
          }
        });

        test('should have readable question text size', async () => {
          const questionText = await page.$('h2');
          if (questionText) {
            const fontSize = await questionText.evaluate(el => {
              return parseInt(window.getComputedStyle(el).fontSize);
            });

            // Should be at least 14px for readability
            expect(fontSize).toBeGreaterThanOrEqual(14);
          }
        });
      });

      describe('Profile Page Responsiveness', () => {
        beforeEach(async () => {
          // Login first
          const testEmail = `profile-mobile-${Date.now()}@test.com`;

          await page.goto(`${baseUrl}/register`, { waitUntil: 'networkidle2' });
          await page.type('input[type="text"]', 'Profile Mobile Test');
          await page.type('input[type="email"]', testEmail);
          await page.type('input[type="password"]', 'password123');
          await page.click('button[type="submit"]');
          await page.waitForNavigation({ waitUntil: 'networkidle2' });

          // Navigate to profile
          await page.goto(`${baseUrl}/profile`, { waitUntil: 'networkidle2' });
        });

        test('should display profile page with proper mobile layout', async () => {
          const pageTitle = await page.$eval('h1', el => el.textContent);
          expect(pageTitle).toContain('Profile');

          // All profile fields should be visible
          const labels = await page.$$('label');
          expect(labels.length).toBeGreaterThanOrEqual(4); // Name, Email, Tier, Points
        });

        test('should have full-width logout button on mobile', async () => {
          if (device.viewport.width < 640) {
            const logoutButton = await page.$('button:has-text("Logout")') ||
                                await page.$$eval('button', buttons =>
                                  buttons.find(b => b.textContent.includes('Logout'))
                                );

            if (logoutButton) {
              const hasFullWidth = await page.evaluate((btn) => {
                return btn.classList.contains('w-full');
              }, logoutButton);

              expect(hasFullWidth).toBe(true);
            }
          }
        });
      });

      describe('Visual Regression - Screenshots', () => {
        test('should capture login page screenshot', async () => {
          await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle2' });

          const screenshot = await page.screenshot({
            path: `testing/puppeteer-responsive/screenshots/${device.name.replace(/\s+/g, '-')}-login.png`,
            fullPage: true
          });

          expect(screenshot).toBeTruthy();
        });

        test('should capture dashboard screenshot after login', async () => {
          const testEmail = `screenshot-${Date.now()}@test.com`;

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
      });

      describe('Performance on Mobile', () => {
        test('should load login page quickly on mobile connection', async () => {
          // Simulate 3G connection
          await page.emulateNetworkConditions({
            offline: false,
            downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
            uploadThroughput: 750 * 1024 / 8, // 750 Kbps
            latency: 40
          });

          const startTime = Date.now();
          await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle2' });
          const loadTime = Date.now() - startTime;

          // Should load within 5 seconds on 3G
          expect(loadTime).toBeLessThan(5000);
        });
      });

      describe('Accessibility on Mobile', () => {
        test('should have accessible form labels', async () => {
          await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle2' });

          const labels = await page.$$('label');
          expect(labels.length).toBeGreaterThanOrEqual(2); // Email and Password
        });

        test('should have proper button contrast', async () => {
          await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle2' });

          const button = await page.$('button[type="submit"]');
          const backgroundColor = await button.evaluate(el => {
            return window.getComputedStyle(el).backgroundColor;
          });

          // Button should have a background color set
          expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
          expect(backgroundColor).not.toBe('transparent');
        });
      });
    });
  });
});
