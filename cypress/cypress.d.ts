/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<void>;

    dragAndDrop(dragSelector: string, dropSelector: string): Chainable<void>;

    addIngredientToConstructor(ingredientText: string): Chainable<void>;

    checkConstructorItems(expectedCount: number): Chainable<void>;
  }
}
