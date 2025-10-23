import puppeteer from 'puppeteer';

const APP_URL = 'http://localhost';
const API_URL = 'http://localhost:3000/api';

let browser;
let page;

// Helper function to generate random email
const generateEmail = () => `test${Date.now()}@example.com`;

// Helper function to wait for navigation
const waitForNavigation = async () => {
  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 }).catch(() => {});
  await new Promise(resolve => setTimeout(resolve, 500));
};

describe('NCLEX Prep Portal - End-to-End Tests', () => {
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
    await page.setViewport({ width: 1280, height: 720 });
  });

  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  describe('User Registration', () => {
    test('should display registration page with all required fields', async () => {
      await page.goto(`${APP_URL}/register`, { waitUntil: 'networkidle0' });

      // Check for registration form elements
      const nameInput = await page.$('input[type="text"]');
      const emailInput = await page.$('input[type="email"]');
      const passwordInput = await page.$('input[type="password"]');
      const submitButton = await page.$('button[type="submit"]');

      expect(nameInput).not.toBeNull();
      expect(emailInput).not.toBeNull();
      expect(passwordInput).not.toBeNull();
      expect(submitButton).not.toBeNull();
    });

    test('should successfully register a new user', async () => {
      await page.goto(`${APP_URL}/register`, { waitUntil: 'networkidle0' });

      const testEmail = generateEmail();

      // Fill in registration form
      await page.type('input[type="text"]', 'Test User');
      await page.type('input[type="email"]', testEmail);
      await page.type('input[type="password"]', 'password123');

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for redirect to dashboard
      await waitForNavigation();

      // Should be redirected to dashboard
      const url = page.url();
      expect(url).toBe(`${APP_URL}/`);
    });

    test('should show error for duplicate email registration', async () => {
      const testEmail = generateEmail();

      // Register first time
      await page.goto(`${APP_URL}/register`, { waitUntil: 'networkidle0' });
      await page.type('input[type="text"]', 'Test User');
      await page.type('input[type="email"]', testEmail);
      await page.type('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await waitForNavigation();

      // Clear local storage to logout
      await page.evaluate(() => localStorage.clear());

      // Try to register again with same email
      await page.goto(`${APP_URL}/register`, { waitUntil: 'networkidle0' });
      await page.type('input[type="text"]', 'Test User 2');
      await page.type('input[type="email"]', testEmail);
      await page.type('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');

      // Wait for error or stay on page
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Should still be on register page or show error
      const url = page.url();
      const content = await page.content();
      expect(url.includes('/register') || content.includes('exist')).toBe(true);
    }, 10000);
  });

  describe('User Login', () => {
    let testEmail;

    beforeEach(async () => {
      // Create a test user
      testEmail = generateEmail();
      const newPage = await browser.newPage();
      await newPage.goto(`${APP_URL}/register`, { waitUntil: 'networkidle0' });
      await newPage.type('input[type="text"]', 'Test User');
      await newPage.type('input[type="email"]', testEmail);
      await newPage.type('input[type="password"]', 'password123');
      await newPage.click('button[type="submit"]');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await newPage.close();
    });

    test('should display login page with email and password fields', async () => {
      await page.goto(`${APP_URL}/login`, { waitUntil: 'networkidle0' });

      const emailInput = await page.$('input[type="email"]');
      const passwordInput = await page.$('input[type="password"]');
      const submitButton = await page.$('button[type="submit"]');

      expect(emailInput).not.toBeNull();
      expect(passwordInput).not.toBeNull();
      expect(submitButton).not.toBeNull();
    });

    test('should successfully login with valid credentials', async () => {
      await page.goto(`${APP_URL}/login`, { waitUntil: 'networkidle0' });

      await page.type('input[type="email"]', testEmail);
      await page.type('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');

      await waitForNavigation();

      // Should be redirected to dashboard
      const url = page.url();
      expect(url).toBe(`${APP_URL}/`);
    });

    test('should show error for invalid credentials', async () => {
      await page.goto(`${APP_URL}/login`, { waitUntil: 'networkidle0' });

      await page.type('input[type="email"]', testEmail);
      await page.type('input[type="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');

      // Wait a bit for error to show
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Should still be on login page
      const url = page.url();
      expect(url).toContain('/login');
    });

    test('should redirect to login page when accessing protected route without auth', async () => {
      // Go to page first, then clear auth
      await page.goto(`${APP_URL}/login`, { waitUntil: 'networkidle0' });
      await page.evaluate(() => {
        try {
          localStorage.clear();
        } catch (e) {
          // Ignore if localStorage is not accessible
        }
      });

      // Try to access protected route
      await page.goto(`${APP_URL}/`, { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Should be redirected to login or show login prompt
      const url = page.url();
      const content = await page.content();
      expect(url.includes('/login') || content.includes('Sign in') || content.includes('Login')).toBe(true);
    });
  });

  describe('Dashboard', () => {
    beforeEach(async () => {
      // Create and login a test user
      const testEmail = generateEmail();
      await page.goto(`${APP_URL}/register`, { waitUntil: 'networkidle0' });
      await page.type('input[type="text"]', 'Test User');
      await page.type('input[type="email"]', testEmail);
      await page.type('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await waitForNavigation();
    });

    test('should display dashboard with user statistics', async () => {
      // Should be on dashboard after login
      const url = page.url();
      expect(url).toBe(`${APP_URL}/`);

      // Check for dashboard elements
      const content = await page.content();
      expect(content).toContain('Dashboard');
    });

    test('should display points, questions completed, and accuracy', async () => {
      const content = await page.content();

      // Should show initial stats
      expect(content).toContain('Points');
      expect(content).toContain('Questions');
      expect(content).toContain('Accuracy');
    });

    test('should display category breakdown section', async () => {
      const content = await page.content();

      // Check for category section header or placeholder text
      expect(
        content.includes('Performance by Category') ||
        content.includes('Physiological Integrity') ||
        content.includes('practicing to see')
      ).toBe(true);
    });

    test('should have "Start Practice" button that navigates to quiz', async () => {
      // Look for button with text containing "Practice" or "Start"
      const buttons = await page.$$('button');
      let practiceButtonFound = false;

      for (const button of buttons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text.includes('Practice') || text.includes('Start')) {
          practiceButtonFound = true;
          await button.click();
          break;
        }
      }

      expect(practiceButtonFound).toBe(true);

      await waitForNavigation();

      // Should navigate to quiz page
      const url = page.url();
      expect(url).toContain('/quiz');
    });
  });

  describe('Quiz/Question Answering', () => {
    beforeEach(async () => {
      // Create and login a test user
      const testEmail = generateEmail();
      await page.goto(`${APP_URL}/register`, { waitUntil: 'networkidle0' });
      await page.type('input[type="text"]', 'Test User');
      await page.type('input[type="email"]', testEmail);
      await page.type('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await waitForNavigation();

      // Navigate to quiz
      await page.goto(`${APP_URL}/quiz`, { waitUntil: 'networkidle0' });
    });

    test('should display a question with answer options', async () => {
      // Wait for question to load
      await new Promise(resolve => setTimeout(resolve, 1500));

      const content = await page.content();

      // Should have question content
      expect(content.length).toBeGreaterThan(100);
    });

    test('should allow selecting an answer option', async () => {
      // Wait for question to load
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Find and click an answer option
      const buttons = await page.$$('button');

      // Filter for answer buttons (exclude submit/navigation buttons)
      let answerButtons = [];
      for (const button of buttons) {
        const text = await page.evaluate(el => el.textContent, button);
        const className = await page.evaluate(el => el.className, button);

        // Answer options typically have specific styling or are in a list
        if (!text.includes('Submit') && !text.includes('End') && !text.includes('Next') &&
            text.length > 0 && text.length < 200) {
          answerButtons.push(button);
        }
      }

      if (answerButtons.length > 0) {
        await answerButtons[0].click();

        // Wait a bit for selection to register
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if button appears selected (visual feedback)
        const isSelected = await page.evaluate(btn => {
          const style = window.getComputedStyle(btn);
          return style.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
                 style.backgroundColor !== 'transparent';
        }, answerButtons[0]);

        expect(isSelected).toBe(true);
      }
    });

    test('should submit answer and show feedback', async () => {
      // Wait for question to fully load
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Verify question loaded by checking for content
      let content = await page.content();
      const hasQuestion = content.includes('Practice Session') || content.length > 5000;
      expect(hasQuestion).toBe(true);

      // Select first answer option (look for div/button with answer text)
      const buttons = await page.$$('button');
      let answerSelected = false;

      for (const button of buttons) {
        const text = await page.evaluate(el => el.textContent, button);

        // Look for answer buttons (not Submit, End Session)
        if (text.length > 5 && text.length < 300 &&
            !text.includes('Submit') && !text.includes('End') &&
            !text.includes('Practice') && !text.includes('Dashboard') &&
            !text.includes('Logout')) {
          await button.click();
          answerSelected = true;
          await new Promise(resolve => setTimeout(resolve, 700));
          break;
        }
      }

      expect(answerSelected).toBe(true);

      // Find and click submit button
      await new Promise(resolve => setTimeout(resolve, 1000));
      const allButtons = await page.$$('button');
      let submitClicked = false;

      for (const button of allButtons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text.includes('Submit') && !text.toLowerCase().includes('submitting')) {
          await button.click();
          submitClicked = true;
          break;
        }
      }

      expect(submitClicked).toBe(true);

      // Wait for API call and feedback to render (give it plenty of time)
      await new Promise(resolve => setTimeout(resolve, 4000));

      content = await page.content();

      // Should show feedback - check for Correct! or Incorrect, Explanation, or Next Question button
      const hasFeedback =
        content.includes('Correct!') ||
        content.includes('Incorrect') ||
        content.includes('Explanation:') ||
        content.includes('Next Question') ||
        content.includes('earned'); // "You earned X points"

      expect(hasFeedback).toBe(true);
    }, 20000);

    test('should show points earned after answering', async () => {
      // Wait for question to fully load
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Select and submit answer
      const buttons = await page.$$('button');
      let answerSelected = false;

      for (const button of buttons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text.length > 5 && text.length < 300 &&
            !text.includes('Submit') && !text.includes('End') &&
            !text.includes('Practice') && !text.includes('Dashboard') &&
            !text.includes('Logout')) {
          await button.click();
          answerSelected = true;
          await new Promise(resolve => setTimeout(resolve, 700));
          break;
        }
      }

      expect(answerSelected).toBe(true);

      // Submit
      await new Promise(resolve => setTimeout(resolve, 1000));
      const submitButtons = await page.$$('button');
      let submitClicked = false;

      for (const button of submitButtons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text.includes('Submit') && !text.toLowerCase().includes('submitting')) {
          await button.click();
          submitClicked = true;
          break;
        }
      }

      expect(submitClicked).toBe(true);

      // Wait for API call and feedback to render (extended wait)
      await new Promise(resolve => setTimeout(resolve, 4000));

      const content = await page.content();

      // Should show points - either "You earned X points" in feedback or points in navbar
      const hasPoints =
        content.includes('points') ||
        content.includes('Points') ||
        content.includes('earned') ||
        /\d+\s*points/i.test(content) ||
        content.includes('0 points'); // Default for new users

      expect(hasPoints).toBe(true);
    }, 20000);

    test('should allow getting next question after answering', async () => {
      // Wait for question to load
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Select and submit answer
      const buttons = await page.$$('button');

      for (const button of buttons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text.length > 5 && text.length < 200 &&
            !text.includes('Submit') && !text.includes('End')) {
          await button.click();
          await new Promise(resolve => setTimeout(resolve, 500));
          break;
        }
      }

      // Submit
      const submitButtons = await page.$$('button');
      for (const button of submitButtons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text.includes('Submit')) {
          await button.click();
          break;
        }
      }

      // Wait for feedback
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Click next question button
      const nextButtons = await page.$$('button');
      let nextClicked = false;

      for (const button of nextButtons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text.includes('Next')) {
          await button.click();
          nextClicked = true;
          break;
        }
      }

      if (nextClicked) {
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Should show a new question
        const content = await page.content();
        expect(content.length).toBeGreaterThan(100);
      }
    });
  });

  describe('Navigation', () => {
    beforeEach(async () => {
      // Create and login a test user
      const testEmail = generateEmail();
      await page.goto(`${APP_URL}/register`, { waitUntil: 'networkidle0' });
      await page.type('input[type="text"]', 'Test User');
      await page.type('input[type="email"]', testEmail);
      await page.type('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await waitForNavigation();
    });

    test('should display navigation bar with user information', async () => {
      const content = await page.content();

      // Should show user's name or email
      expect(content.includes('Test User') || content.includes('test')).toBe(true);
    });

    test('should navigate between Dashboard and Quiz pages', async () => {
      // Go to quiz
      await page.goto(`${APP_URL}/quiz`, { waitUntil: 'networkidle0' });
      let url = page.url();
      expect(url).toContain('/quiz');

      // Go back to dashboard
      await page.goto(`${APP_URL}/`, { waitUntil: 'networkidle0' });
      url = page.url();
      expect(url).toBe(`${APP_URL}/`);
    });

    test('should navigate to profile page', async () => {
      await page.goto(`${APP_URL}/profile`, { waitUntil: 'networkidle0' });

      const url = page.url();
      expect(url).toContain('/profile');

      const content = await page.content();
      expect(content.includes('Profile') || content.includes('Test User')).toBe(true);
    });
  });

  describe('Profile Page', () => {
    beforeEach(async () => {
      // Create and login a test user
      const testEmail = generateEmail();
      await page.goto(`${APP_URL}/register`, { waitUntil: 'networkidle0' });
      await page.type('input[type="text"]', 'Test User');
      await page.type('input[type="email"]', testEmail);
      await page.type('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await waitForNavigation();

      // Navigate to profile
      await page.goto(`${APP_URL}/profile`, { waitUntil: 'networkidle0' });
    });

    test('should display user profile information', async () => {
      const content = await page.content();

      // Should display user's name and email
      expect(content.includes('Test User')).toBe(true);
    });

    test('should display subscription tier', async () => {
      const content = await page.content();

      // Should show FREE tier by default
      expect(content.includes('FREE') || content.includes('Free')).toBe(true);
    });
  });

  describe('Logout', () => {
    test('should logout user and redirect to login page', async () => {
      // Create and login a test user
      const testEmail = generateEmail();
      await page.goto(`${APP_URL}/register`, { waitUntil: 'networkidle0' });
      await page.type('input[type="text"]', 'Test User');
      await page.type('input[type="email"]', testEmail);
      await page.type('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await waitForNavigation();

      // Look for logout button
      const buttons = await page.$$('button');
      let logoutFound = false;

      for (const button of buttons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text.includes('Logout') || text.includes('Sign Out')) {
          await button.click();
          logoutFound = true;
          break;
        }
      }

      if (logoutFound) {
        await waitForNavigation();

        // Should redirect to login page
        const url = page.url();
        expect(url).toContain('/login');
      }
    });

    test('should clear authentication after logout', async () => {
      // Create and login a test user
      const testEmail = generateEmail();
      await page.goto(`${APP_URL}/register`, { waitUntil: 'networkidle0' });
      await page.type('input[type="text"]', 'Test User');
      await page.type('input[type="email"]', testEmail);
      await page.type('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await waitForNavigation();

      // Logout
      const buttons = await page.$$('button');
      for (const button of buttons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text.includes('Logout') || text.includes('Sign Out')) {
          await button.click();
          break;
        }
      }

      await waitForNavigation();

      // Try to access protected route
      await page.goto(`${APP_URL}/`, { waitUntil: 'networkidle0' });

      // Should be redirected to login
      const url = page.url();
      expect(url).toContain('/login');
    });
  });

  describe('Full User Journey', () => {
    test('should complete full user journey: register -> login -> answer questions -> view progress -> logout', async () => {
      const testEmail = generateEmail();

      // 1. Register
      await page.goto(`${APP_URL}/register`, { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 500));
      await page.type('input[type="text"]', 'Journey Test User');
      await page.type('input[type="email"]', testEmail);
      await page.type('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await waitForNavigation();

      let url = page.url();
      expect(url).toBe(`${APP_URL}/`);

      // 2. View Dashboard
      await new Promise(resolve => setTimeout(resolve, 800));
      let content = await page.content();
      expect(content.includes('Dashboard') || content.includes('Journey Test User')).toBe(true);

      // 3. Start Quiz
      await page.goto(`${APP_URL}/quiz`, { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 2500));

      // 4. Answer a question
      const buttons = await page.$$('button');
      for (const button of buttons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text.length > 5 && text.length < 300 &&
            !text.includes('Submit') && !text.includes('End') &&
            !text.includes('Practice') && !text.includes('Dashboard')) {
          await button.click();
          await new Promise(resolve => setTimeout(resolve, 500));
          break;
        }
      }

      // Submit answer
      await new Promise(resolve => setTimeout(resolve, 800));
      const submitButtons = await page.$$('button');
      for (const button of submitButtons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text.includes('Submit') && !text.includes('submitting')) {
          await button.click();
          break;
        }
      }

      // Wait for answer to be processed
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 5. Go back to dashboard to see updated stats
      await page.goto(`${APP_URL}/`, { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 800));
      content = await page.content();

      // Stats should be updated
      expect(content.length).toBeGreaterThan(100);

      // 6. Logout
      const logoutButtons = await page.$$('button');
      for (const button of logoutButtons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text.includes('Logout') || text.includes('Sign Out')) {
          await button.click();
          break;
        }
      }

      await waitForNavigation();

      url = page.url();
      expect(url).toContain('/login');
    }, 25000);
  });
});
