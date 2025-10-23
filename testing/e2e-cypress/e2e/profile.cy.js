describe('Profile Page', () => {
  let testEmail;

  before(() => {
    testEmail = `profile${Date.now()}@test.com`;
    cy.visit('/register');
    cy.get('input[type="text"]').type('Profile Test User');
    cy.get('input[type="email"]').type(testEmail);
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
  });

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.login(testEmail, 'password123');
    cy.visit('/profile');
  });

  it('should display user profile information', () => {
    cy.contains('Profile Test User').should('be.visible');
    cy.contains(testEmail).should('be.visible');
  });

  it('should display subscription tier', () => {
    cy.contains(/subscription|tier|free/i).should('be.visible');
  });
});
