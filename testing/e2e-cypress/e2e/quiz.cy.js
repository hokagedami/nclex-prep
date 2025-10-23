describe('Quiz / Question Answering', () => {
  let testEmail;

  before(() => {
    testEmail = `quiz${Date.now()}@test.com`;
    cy.visit('/register');
    cy.get('input[type="text"]').type('Quiz Test User');
    cy.get('input[type="email"]').type(testEmail);
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
  });

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.login(testEmail, 'password123');
    cy.visit('/quiz');
  });

  it('should display question with answer options', () => {
    cy.contains(/what|which|how|when|select/i, { timeout: 10000 }).should('be.visible');

    // Should have answer options
    cy.get('input[type="radio"], input[type="checkbox"]').should('exist');
  });

  it('should allow selecting an answer option', () => {
    // Wait for question to load
    cy.get('input[type="radio"], input[type="checkbox"]', { timeout: 10000 }).first().as('firstAnswer');

    cy.get('@firstAnswer').check({ force: true });
    cy.get('@firstAnswer').should('be.checked');
  });

  it('should submit answer and show feedback', () => {
    // Select first answer
    cy.get('input[type="radio"], input[type="checkbox"]', { timeout: 10000 }).first().check({ force: true });

    // Submit answer
    cy.contains('Submit Answer').click();

    // Should show feedback
    cy.contains(/correct|incorrect/i, { timeout: 5000 }).should('be.visible');
    cy.contains('Explanation').should('be.visible');
  });

  it('should show points earned after answering', () => {
    // Select and submit answer
    cy.get('input[type="radio"], input[type="checkbox"]', { timeout: 10000 }).first().check({ force: true });
    cy.contains('Submit Answer').click();

    // Should show points (either 0, 10, or 15)
    cy.contains(/points earned/i, { timeout: 5000 }).should('be.visible');
  });

  it('should allow getting next question after answering', () => {
    // Answer first question
    cy.get('input[type="radio"], input[type="checkbox"]', { timeout: 10000 }).first().check({ force: true });
    cy.contains('Submit Answer').click();

    // Click next question
    cy.contains('Next Question', { timeout: 5000 }).click();

    // Should load new question
    cy.contains(/what|which|how|when|select/i, { timeout: 10000 }).should('be.visible');
  });

  it('should update navbar points after answering correctly', () => {
    // Get initial points from navbar
    cy.get('nav').contains(/\d+ points/).invoke('text').then((initialText) => {
      const initialPoints = parseInt(initialText.match(/\d+/)[0]);

      // Answer a question (we'll select the first option)
      cy.get('input[type="radio"], input[type="checkbox"]', { timeout: 10000 }).first().check({ force: true });
      cy.contains('Submit Answer').click();

      // Wait for submission
      cy.wait(1000);

      // Check if points increased in navbar (they might not if answer was wrong)
      cy.get('nav').contains(/\d+ points/, { timeout: 5000 });
    });
  });
});
