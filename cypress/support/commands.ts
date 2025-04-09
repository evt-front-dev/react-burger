/// <reference types="cypress" />
/// <reference path="../cypress.d.ts" />

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("http://localhost:5173/login");
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();

  cy.url().should("eq", "http://localhost:5173/");
  cy.get('[data-testid="burger-constructor"]').should("exist");
  cy.get('[data-testid="burger-ingredients"]').should("exist");
});

Cypress.Commands.add(
  "dragAndDrop",
  (dragSelector: string, dropSelector: string) => {
    cy.get(dragSelector).first().trigger("dragstart");
    cy.get(dropSelector).trigger("drop");
    cy.get(dragSelector).first().trigger("dragend");
  }
);

Cypress.Commands.add("addIngredientToConstructor", (ingredientText: string) => {
  cy.contains(ingredientText).trigger("dragstart");
  cy.get('[data-test="constructor-drop-target"]').trigger("drop");
  cy.contains(ingredientText).trigger("dragend");
});

Cypress.Commands.add("checkConstructorItems", (expectedCount: number) => {
  cy.get('[data-test="constructor-ingredient"]').should(
    "have.length",
    expectedCount
  );
});
