// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command for login
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/');
});

// Custom command for registration
Cypress.Commands.add('register', (name, email, password) => {
  cy.visit('/register');
  cy.get('input[type="text"]').type(name);
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/');
});

// Custom command to generate unique email
Cypress.Commands.add('generateEmail', () => {
  return `test${Date.now()}@example.com`;
});

// Custom command to clear database (requires API endpoint)
Cypress.Commands.add('clearTestData', (email) => {
  // This would require a backend endpoint for clearing test data
  // For now, we'll just clear localStorage
  cy.clearLocalStorage();
  cy.clearCookies();
});
