describe('Responsive Design - Tablet Devices', () => {
  const tabletDevices = [
    { name: 'iPad Mini', width: 768, height: 1024 },
    { name: 'iPad Air', width: 820, height: 1180 },
    { name: 'iPad Pro 11"', width: 834, height: 1194 },
    { name: 'Surface Pro 7', width: 912, height: 1368 }
  ];

  let testEmail;

  before(() => {
    // Create a test user for all tablet viewport tests
    testEmail = `tablet${Date.now()}@test.com`;
    cy.viewport(768, 1024); // iPad viewport
    cy.visit('/register');
    cy.get('input[type="text"]').type('Tablet Test User');
    cy.get('input[type="email"]').type(testEmail);
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/');
  });

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  tabletDevices.forEach((device) => {
    describe(`${device.name} (${device.width}x${device.height})`, () => {
      beforeEach(() => {
        cy.viewport(device.width, device.height);
      });

      describe('Login Page', () => {
        it('should display login form centered on tablet', () => {
          cy.visit('/login');

          // Header should be larger on tablet
          cy.contains('NCLEX Prep').should('be.visible');
          cy.contains('Sign in to continue your preparation').should('be.visible');

          // Form should be centered with max-width
          cy.get('input[type="email"]').should('be.visible');
          cy.get('input[type="password"]').should('be.visible');
          cy.get('button[type="submit"]').should('be.visible');
        });

        it('should have properly sized form elements on tablet', () => {
          cy.visit('/login');

          // Buttons should not be unnecessarily wide
          cy.get('button[type="submit"]').invoke('width').then((width) => {
            // Should use max-width constraint
            expect(width).to.be.at.most(500);
          });
        });
      });

      describe('Dashboard', () => {
        beforeEach(() => {
          cy.login(testEmail, 'password123');
          cy.visit('/');
        });

        it('should display desktop navbar on tablet', () => {
          // Tablets (>= 768px) should show desktop navigation
          cy.get('nav').contains('Dashboard').should('be.visible');
          cy.get('nav').contains('Practice').should('be.visible');
          cy.get('nav').contains('Profile').should('be.visible');

          // Should show user info in navbar
          cy.get('nav').contains('Tablet').should('be.visible');
          cy.get('nav').contains(/\d+ points/).should('be.visible');
          cy.get('nav').contains('Logout').should('be.visible');
        });

        it('should display stats cards in grid on tablet', () => {
          // Check all three stats cards
          cy.contains('Total Points').should('be.visible');
          cy.contains('Questions Completed').should('be.visible');
          cy.contains('Overall Accuracy').should('be.visible');

          // On tablet, should display in 3-column grid
          cy.get('.grid').should('have.class', 'md:grid-cols-3');
        });

        it('should display welcome message with medium text size', () => {
          cy.contains('Welcome back, Tablet').should('be.visible');

          // Text should be medium size on tablet
          cy.contains('Welcome back, Tablet').invoke('css', 'font-size').then((fontSize) => {
            const size = parseFloat(fontSize);
            // Should be larger than mobile but same as desktop
            expect(size).to.be.at.least(24);
          });
        });
      });

      describe('Quiz Page', () => {
        beforeEach(() => {
          cy.login(testEmail, 'password123');
          cy.visit('/quiz');
        });

        it('should display quiz header in row layout on tablet', () => {
          cy.contains('Practice Session').should('be.visible');
          cy.contains('End Session').should('be.visible');

          // On tablet (>= 640px), header should be in row layout
          cy.get('.sm\\:flex-row').should('exist');
        });

        it('should display question card with adequate spacing', () => {
          // Question card should have proper spacing
          cy.get('div.card', { timeout: 10000 }).should('be.visible');

          // Category badge should be visible
          cy.get('.rounded-full').first().should('be.visible');

          // Question text should be larger on tablet
          cy.contains(/what|which|how|when|select/i, { timeout: 10000 })
            .invoke('css', 'font-size')
            .then((fontSize) => {
              const size = parseFloat(fontSize);
              expect(size).to.be.at.least(16);
            });
        });

        it('should have properly sized answer options on tablet', () => {
          // Answer buttons should be visible
          cy.get('button').contains(/[A-Z]/, { timeout: 10000 }).should('be.visible');

          // Should have adequate padding
          cy.get('button').contains(/[A-Z]/).first().invoke('css', 'padding').should('exist');
        });
      });

      describe('Profile Page', () => {
        beforeEach(() => {
          cy.login(testEmail, 'password123');
          cy.visit('/profile');
        });

        it('should display profile content centered with max-width', () => {
          // Profile should be centered
          cy.contains('Profile').should('be.visible');

          // All fields should be visible
          cy.contains('Name').should('be.visible');
          cy.contains('Tablet Test User').should('be.visible');
          cy.contains('Email').should('be.visible');
          cy.contains('Membership Tier').should('be.visible');
          cy.contains('Total Points').should('be.visible');
        });

        it('should have properly sized logout button on tablet', () => {
          // On tablet, logout button should not be full width
          cy.contains('Logout').should('be.visible');

          // Button should have auto width on larger screens
          cy.contains('Logout').invoke('width').then((width) => {
            // Should not span full width
            const viewportWidth = device.width;
            expect(width).to.be.lessThan(viewportWidth * 0.8);
          });
        });
      });

      describe('Navigation Between Pages', () => {
        beforeEach(() => {
          cy.login(testEmail, 'password123');
        });

        it('should navigate using desktop navbar on tablet', () => {
          cy.visit('/');

          // Click Practice in navbar
          cy.get('nav').contains('Practice').click();
          cy.url().should('include', '/quiz');

          // Click Profile in navbar
          cy.get('nav').contains('Profile').click();
          cy.url().should('include', '/profile');

          // Click Dashboard in navbar
          cy.get('nav').contains('Dashboard').click();
          cy.url().should('eq', Cypress.config().baseUrl + '/');
        });
      });

      describe('Content Layout on Tablet', () => {
        beforeEach(() => {
          cy.login(testEmail, 'password123');
        });

        it('should have proper margins and max-width on dashboard', () => {
          cy.visit('/');

          // Content should be constrained with max-width
          cy.get('.max-w-6xl, .max-w-3xl, .max-w-2xl').should('exist');

          // Should have horizontal padding
          cy.get('.container, .mx-auto').should('exist');
        });

        it('should have readable line lengths for question text', () => {
          cy.visit('/quiz');

          // Question card should have max-width for readability
          cy.get('.max-w-3xl', { timeout: 10000 }).should('exist');
        });
      });

      describe('Interactive Elements on Tablet', () => {
        beforeEach(() => {
          cy.login(testEmail, 'password123');
        });

        it('should have hover effects on interactive elements', () => {
          cy.visit('/');

          // Navigation links should have hover class
          cy.get('nav a').should('have.class', 'hover:text-primary');

          // Buttons should have transitions
          cy.contains('Start Practice Session').should('have.class', 'transition');
        });

        it('should maintain touch-friendly sizes on tablet', () => {
          cy.visit('/quiz');

          // Answer options should still be touch-friendly
          cy.get('button').contains(/[A-Z]/, { timeout: 10000 })
            .invoke('height')
            .then((height) => {
              expect(height).to.be.at.least(40);
            });
        });
      });

      describe('Typography on Tablet', () => {
        beforeEach(() => {
          cy.login(testEmail, 'password123');
        });

        it('should use appropriate heading sizes', () => {
          cy.visit('/');

          // Main heading should use larger size
          cy.contains('Welcome back, Tablet').invoke('css', 'font-size').then((fontSize) => {
            const size = parseFloat(fontSize);
            expect(size).to.be.at.least(24);
          });
        });

        it('should have readable body text', () => {
          cy.visit('/quiz');

          // Answer text should be comfortable to read
          cy.get('button').contains(/[A-Z]/, { timeout: 10000 })
            .invoke('css', 'font-size')
            .then((fontSize) => {
              const size = parseFloat(fontSize);
              expect(size).to.be.at.least(14);
            });
        });
      });

      describe('Stats Cards Layout', () => {
        beforeEach(() => {
          cy.login(testEmail, 'password123');
          cy.visit('/');
        });

        it('should display stats in proper grid', () => {
          // Should have grid with 3 columns
          cy.get('.grid').should('exist');

          // All three cards should be visible
          const cards = ['Total Points', 'Questions Completed', 'Overall Accuracy'];
          cards.forEach((card) => {
            cy.contains(card).should('be.visible');
          });
        });

        it('should have adequate spacing between cards', () => {
          // Grid should have gap
          cy.get('.gap-6, .gap-4').should('exist');
        });
      });
    });
  });

  describe('Tablet Landscape Orientation', () => {
    const landscapeDevices = [
      { name: 'iPad Mini Landscape', width: 1024, height: 768 },
      { name: 'iPad Air Landscape', width: 1180, height: 820 }
    ];

    before(() => {
      // Use existing test user
    });

    landscapeDevices.forEach((device) => {
      describe(`${device.name} (${device.width}x${device.height})`, () => {
        beforeEach(() => {
          cy.viewport(device.width, device.height);
          cy.clearLocalStorage();
          cy.login(testEmail, 'password123');
        });

        it('should display content properly in landscape', () => {
          cy.visit('/');

          // Navigation should be visible
          cy.get('nav').contains('Dashboard').should('be.visible');

          // Stats should be in row
          cy.contains('Total Points').should('be.visible');
          cy.contains('Questions Completed').should('be.visible');
          cy.contains('Overall Accuracy').should('be.visible');
        });

        it('should display quiz properly in landscape', () => {
          cy.visit('/quiz');

          // Question should be visible
          cy.contains('Practice Session').should('be.visible');

          // Content should not be too wide
          cy.get('.max-w-3xl', { timeout: 10000 }).should('exist');
        });
      });
    });
  });
});
