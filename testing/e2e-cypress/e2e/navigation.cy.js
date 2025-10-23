describe('Navigation', () => {
  let testEmail;

  before(() => {
    testEmail = `nav${Date.now()}@test.com`;
    cy.visit('/register');
    cy.get('input[type="text"]').type('Nav Test User');
    cy.get('input[type="email"]').type(testEmail);
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
  });

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.login(testEmail, 'password123');
  });

  it('should display navigation bar with user info', () => {
    cy.visit('/');

    cy.get('nav').should('be.visible');
    cy.get('nav').contains('Nav Test User').should('be.visible');
    cy.get('nav').contains(/\d+ points/).should('be.visible');
    cy.get('nav').contains('Logout').should('be.visible');
  });

  it('should navigate between Dashboard and Quiz', () => {
    cy.visit('/');

    // Navigate to Quiz
    cy.get('nav').contains('Practice').click();
    cy.url().should('include', '/quiz');

    // Navigate back to Dashboard
    cy.get('nav').contains('Dashboard').click();
    cy.url().should('equal', Cypress.config().baseUrl + '/');
  });

  it('should navigate to profile page', () => {
    cy.visit('/');

    cy.get('nav').contains('Profile').click();
    cy.url().should('include', '/profile');
  });
});
