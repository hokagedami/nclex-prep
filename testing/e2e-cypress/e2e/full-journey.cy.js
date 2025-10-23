describe('Full User Journey', () => {
  it('should complete full user journey: register -> quiz -> dashboard -> logout', () => {
    const testEmail = `journey${Date.now()}@test.com`;

    // 1. Register
    cy.visit('/register');
    cy.get('input[type="text"]').type('Journey Test User');
    cy.get('input[type="email"]').type(testEmail);
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Should be on dashboard
    cy.url().should('include', '/');
    cy.contains('Welcome back, Journey Test User').should('be.visible');

    // 2. Navigate to quiz
    cy.contains('Start Practice Session').click();
    cy.url().should('include', '/quiz');

    // 3. Answer a question
    cy.get('input[type="radio"], input[type="checkbox"]', { timeout: 10000 })
      .first()
      .check({ force: true });
    cy.contains('Submit Answer').click();

    // Should see feedback
    cy.contains(/correct|incorrect/i, { timeout: 5000 }).should('be.visible');

    // 4. Go back to dashboard
    cy.get('nav').contains('Dashboard').click();
    cy.url().should('equal', Cypress.config().baseUrl + '/');

    // Should see updated stats
    cy.contains('Questions Completed').parent().should('contain', '1');

    // 5. Logout
    cy.contains('Logout').click();
    cy.url().should('include', '/login');

    // 6. Should not be able to access protected routes
    cy.visit('/');
    cy.url().should('include', '/login');
  });
});
