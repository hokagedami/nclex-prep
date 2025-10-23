describe('Authentication', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  describe('Registration', () => {
    it('should display registration page with all required fields', () => {
      cy.visit('/register');

      cy.get('input[type="text"]').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
      cy.contains('Register').should('be.visible');
    });

    it('should successfully register a new user', () => {
      cy.generateEmail().then((email) => {
        cy.visit('/register');

        cy.get('input[type="text"]').type('Test User');
        cy.get('input[type="email"]').type(email);
        cy.get('input[type="password"]').type('password123');
        cy.get('button[type="submit"]').click();

        // Should redirect to dashboard after successful registration
        cy.url().should('include', '/');
        cy.contains('Welcome back, Test User').should('be.visible');
      });
    });

    it('should show error for duplicate email registration', () => {
      const testEmail = `duplicate${Date.now()}@test.com`;

      // Register first time
      cy.visit('/register');
      cy.get('input[type="text"]').type('Test User');
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/');

      // Logout
      cy.contains('Logout').click();

      // Try to register again with same email
      cy.visit('/register');
      cy.get('input[type="text"]').type('Another User');
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      // Should show error message
      cy.contains(/email.*already/i, { timeout: 5000 }).should('be.visible');
    });
  });

  describe('Login', () => {
    let testEmail;

    before(() => {
      // Create a test user
      testEmail = `login${Date.now()}@test.com`;
      cy.visit('/register');
      cy.get('input[type="text"]').type('Login Test User');
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/');
      cy.contains('Logout').click();
    });

    it('should display login page with email and password fields', () => {
      cy.visit('/login');

      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
      cy.contains('Login').should('be.visible');
    });

    it('should successfully login with valid credentials', () => {
      cy.visit('/login');

      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      cy.url().should('include', '/');
      cy.contains('Welcome back, Login Test User').should('be.visible');
    });

    it('should show error for invalid credentials', () => {
      cy.visit('/login');

      cy.get('input[type="email"]').type('wrong@test.com');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      cy.contains(/invalid/i, { timeout: 5000 }).should('be.visible');
    });

    it('should redirect to login for protected routes when not authenticated', () => {
      cy.visit('/quiz');
      cy.url().should('include', '/login');

      cy.visit('/profile');
      cy.url().should('include', '/login');
    });
  });

  describe('Logout', () => {
    it('should logout user and redirect to login', () => {
      cy.generateEmail().then((email) => {
        cy.register('Logout Test', email, 'password123');

        cy.contains('Logout').click();

        cy.url().should('include', '/login');
      });
    });

    it('should clear authentication after logout', () => {
      cy.generateEmail().then((email) => {
        cy.register('Auth Clear Test', email, 'password123');

        cy.contains('Logout').click();

        // Try to access protected route
        cy.visit('/');
        cy.url().should('include', '/login');
      });
    });
  });
});
