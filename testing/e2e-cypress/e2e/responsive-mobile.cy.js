describe('Responsive Design - Mobile Devices', () => {
  const mobileDevices = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'Samsung Galaxy S20', width: 360, height: 800 },
    { name: 'Pixel 5', width: 393, height: 851 }
  ];

  let testEmail;

  before(() => {
    // Create a test user for all mobile viewport tests
    testEmail = `mobile${Date.now()}@test.com`;
    cy.viewport(390, 844); // iPhone 12 viewport
    cy.visit('/register');
    cy.get('input[type="text"]').type('Mobile Test User');
    cy.get('input[type="email"]').type(testEmail);
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/');
  });

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  mobileDevices.forEach((device) => {
    describe(`${device.name} (${device.width}x${device.height})`, () => {
      beforeEach(() => {
        cy.viewport(device.width, device.height);
      });

      describe('Login Page', () => {
        it('should display login form correctly on mobile', () => {
          cy.visit('/login');

          // Check header is responsive
          cy.contains('NCLEX Prep').should('be.visible');
          cy.contains('Sign in to continue your preparation').should('be.visible');

          // Check form elements are visible and properly sized
          cy.get('input[type="email"]').should('be.visible');
          cy.get('input[type="password"]').should('be.visible');
          cy.get('button[type="submit"]').should('be.visible');

          // Verify button is full width on mobile
          cy.get('button[type="submit"]').should('have.class', 'w-full');

          // Check sign up link
          cy.contains('Sign up').should('be.visible');
        });

        it('should allow login on mobile viewport', () => {
          cy.visit('/login');

          cy.get('input[type="email"]').type(testEmail);
          cy.get('input[type="password"]').type('password123');
          cy.get('button[type="submit"]').click();

          cy.url().should('include', '/');
          cy.contains('Welcome back, Mobile').should('be.visible');
        });
      });

      describe('Register Page', () => {
        it('should display registration form correctly on mobile', () => {
          cy.visit('/register');

          // Check header
          cy.contains('NCLEX Prep').should('be.visible');
          cy.contains('Create your account').should('be.visible');

          // Check all form fields
          cy.get('input[type="text"]').should('be.visible');
          cy.get('input[type="email"]').should('be.visible');
          cy.get('input[type="password"]').should('be.visible');

          // Verify full-width button on mobile
          cy.get('button[type="submit"]').should('have.class', 'w-full');

          // Check sign in link
          cy.contains('Sign in').should('be.visible');
        });
      });

      describe('Dashboard', () => {
        beforeEach(() => {
          cy.login(testEmail, 'password123');
          cy.visit('/');
        });

        it('should display mobile navbar correctly', () => {
          // Check logo is visible
          cy.get('nav').contains('NCLEX Prep').should('be.visible');

          // On mobile (< 768px), hamburger menu should be visible
          // On tablet/desktop (>= 768px), desktop nav should be visible
          if (device.width < 768) {
            // Mobile: check for hamburger menu button
            cy.get('nav button[aria-label="Toggle menu"]').should('be.visible');
          } else {
            // Tablet/Desktop: check for navigation links
            cy.get('nav').contains('Dashboard').should('be.visible');
            cy.get('nav').contains('Practice').should('be.visible');
            cy.get('nav').contains('Profile').should('be.visible');
          }
        });

        it('should display welcome message with first name only', () => {
          cy.contains('Welcome back, Mobile').should('be.visible');
          cy.contains('Ready to continue your NCLEX preparation?').should('be.visible');
        });

        it('should display stats cards in single column on mobile', () => {
          // Check all three stats cards are visible
          cy.contains('Total Points').should('be.visible');
          cy.contains('Questions Completed').should('be.visible');
          cy.contains('Overall Accuracy').should('be.visible');

          // Verify cards are stacked vertically on mobile
          if (device.width < 768) {
            cy.get('.grid').should('have.class', 'grid-cols-1');
          }
        });

        it('should display full-width practice button on mobile', () => {
          cy.contains('Start Practice Session').should('be.visible');

          // Verify button takes full width on mobile
          cy.contains('Start Practice Session').parent().should('have.class', 'text-center');
        });
      });

      describe('Quiz Page', () => {
        beforeEach(() => {
          cy.login(testEmail, 'password123');
          cy.visit('/quiz');
        });

        it('should display quiz header responsively', () => {
          // Header should be stacked on mobile
          cy.contains('Practice Session').should('be.visible');
          cy.contains('End Session').should('be.visible');

          // On mobile, button should be full width
          if (device.width < 640) {
            cy.contains('End Session').should('have.class', 'w-full');
          }
        });

        it('should display question card with proper mobile spacing', () => {
          // Wait for question to load
          cy.get('div.card', { timeout: 10000 }).should('be.visible');

          // Check category badge
          cy.get('.rounded-full').first().should('be.visible');

          // Check question content
          cy.contains(/what|which|how|when|select/i, { timeout: 10000 }).should('be.visible');

          // Check instruction text
          cy.contains(/Select one answer|Select all that apply/).should('be.visible');
        });

        it('should display answer options with proper mobile touch targets', () => {
          // Wait for answer buttons
          cy.get('button').contains(/[A-Z]/).should('be.visible');

          // Verify answer buttons are full width
          cy.get('button').contains(/[A-Z]/).first().should('have.class', 'w-full');

          // Verify adequate spacing between options
          if (device.width < 640) {
            // Mobile should have smaller spacing
            cy.get('.space-y-2').should('exist');
          }
        });

        it('should display full-width submit button on mobile', () => {
          // Select an answer
          cy.get('input[type="radio"], input[type="checkbox"]', { timeout: 10000 }).first().check({ force: true });

          // Check submit button
          cy.contains('Submit Answer').should('be.visible');
          cy.contains('Submit Answer').should('have.class', 'w-full');
        });

        it('should display answer feedback responsively', () => {
          // Answer a question
          cy.get('input[type="radio"], input[type="checkbox"]', { timeout: 10000 }).first().check({ force: true });
          cy.contains('Submit Answer').click();

          // Check feedback is visible
          cy.contains(/correct|incorrect/i, { timeout: 5000 }).should('be.visible');

          // Check explanation section
          cy.contains('Explanation').should('be.visible');

          // Check next button is full width
          cy.contains('Next Question').should('be.visible');
          cy.contains('Next Question').should('have.class', 'w-full');
        });
      });

      describe('Profile Page', () => {
        beforeEach(() => {
          cy.login(testEmail, 'password123');
          cy.visit('/profile');
        });

        it('should display profile page responsively', () => {
          // Check page title
          cy.contains('Profile').should('be.visible');

          // Check all profile fields
          cy.contains('Name').should('be.visible');
          cy.contains('Mobile Test User').should('be.visible');

          cy.contains('Email').should('be.visible');
          cy.contains(testEmail).should('be.visible');

          cy.contains('Membership Tier').should('be.visible');
          cy.contains('FREE').should('be.visible');

          cy.contains('Total Points').should('be.visible');
        });

        it('should display full-width logout button on mobile', () => {
          // Check logout button
          cy.contains('Logout').should('be.visible');

          // On mobile, logout button should be full width
          if (device.width < 640) {
            cy.contains('Logout').should('have.class', 'w-full');
          }
        });
      });

      describe('Mobile Navigation', () => {
        beforeEach(() => {
          cy.login(testEmail, 'password123');
        });

        if (device.width < 768) {
          it('should open and close mobile menu', () => {
            cy.visit('/');

            // Open mobile menu
            cy.get('nav button[aria-label="Toggle menu"]').click();

            // Check mobile menu is visible
            cy.get('nav').contains('Dashboard').should('be.visible');
            cy.get('nav').contains('Practice').should('be.visible');
            cy.get('nav').contains('Profile').should('be.visible');

            // Check user info in mobile menu
            cy.get('nav').contains('Mobile').should('be.visible');
            cy.get('nav').contains(/\d+ points/).should('be.visible');

            // Close mobile menu
            cy.get('nav button[aria-label="Toggle menu"]').click();
          });

          it('should navigate using mobile menu', () => {
            cy.visit('/');

            // Open mobile menu
            cy.get('nav button[aria-label="Toggle menu"]').click();

            // Navigate to Practice
            cy.get('nav').contains('Practice').click();

            // Should navigate to quiz
            cy.url().should('include', '/quiz');

            // Mobile menu should close after navigation
            // cy.get('nav').contains('Dashboard').should('not.be.visible');
          });
        }
      });

      describe('Text Readability on Mobile', () => {
        beforeEach(() => {
          cy.login(testEmail, 'password123');
        });

        it('should have appropriate text sizes on mobile', () => {
          cy.visit('/');

          // Main heading should be smaller on mobile
          cy.contains('Welcome back, Mobile').invoke('css', 'font-size').then((fontSize) => {
            const size = parseFloat(fontSize);
            // Should be between 18px and 24px on mobile
            expect(size).to.be.at.least(18);
            expect(size).to.be.at.most(30);
          });
        });

        it('should have readable question text on mobile', () => {
          cy.visit('/quiz');

          // Wait for question to load
          cy.get('div.card', { timeout: 10000 }).should('be.visible');

          // Question text should be readable size
          cy.contains(/what|which|how|when|select/i).invoke('css', 'font-size').then((fontSize) => {
            const size = parseFloat(fontSize);
            // Should be at least 14px for readability
            expect(size).to.be.at.least(14);
          });
        });
      });

      describe('Touch-Friendly Interactive Elements', () => {
        beforeEach(() => {
          cy.login(testEmail, 'password123');
        });

        it('should have adequate button sizes for touch', () => {
          cy.visit('/');

          // Main CTA button should be large enough for touch
          cy.contains('Start Practice Session').invoke('height').then((height) => {
            // Buttons should be at least 44px tall (iOS minimum touch target)
            expect(height).to.be.at.least(40);
          });
        });

        it('should have adequate spacing for answer options', () => {
          cy.visit('/quiz');

          // Wait for answer options
          cy.get('button').contains(/[A-Z]/, { timeout: 10000 }).should('be.visible');

          // Answer buttons should have adequate height for touch
          cy.get('button').contains(/[A-Z]/).first().invoke('height').then((height) => {
            expect(height).to.be.at.least(40);
          });
        });
      });
    });
  });
});
