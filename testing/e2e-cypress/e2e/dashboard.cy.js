describe('Dashboard', () => {
  let testEmail;

  before(() => {
    testEmail = `dashboard${Date.now()}@test.com`;
    cy.visit('/register');
    cy.get('input[type="text"]').type('Dashboard Test User');
    cy.get('input[type="email"]').type(testEmail);
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/');
  });

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.login(testEmail, 'password123');
  });

  it('should display dashboard with statistics', () => {
    cy.visit('/');

    cy.contains('Welcome back, Dashboard Test User').should('be.visible');
    cy.contains('Total Points').should('be.visible');
    cy.contains('Questions Completed').should('be.visible');
    cy.contains('Overall Accuracy').should('be.visible');
  });

  it('should display points, questions, and accuracy', () => {
    cy.visit('/');

    // Should show stats (initially 0 for new user)
    cy.contains('Total Points').parent().should('contain', '0');
    cy.contains('Questions Completed').parent().should('contain', '0');
    cy.contains('Overall Accuracy').parent().should('contain', '0%');
  });

  it('should display category breakdown section', () => {
    cy.visit('/');

    cy.contains('Performance by Category').should('be.visible');
  });

  it('should navigate to quiz when start practice button is clicked', () => {
    cy.visit('/');

    cy.contains('Start Practice Session').click();
    cy.url().should('include', '/quiz');
  });
});
