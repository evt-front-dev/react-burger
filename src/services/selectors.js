import { createSelector } from "reselect";

// Базовый селектор с проверкой на undefined
const selectConstructorState = (state) =>
  state.constructor || { ingredients: [] };

// Селектор для получения всех ингредиентов с проверкой
const selectIngredients = createSelector(
  [selectConstructorState],
  (constructorState) => constructorState.ingredients || []
);

// Меморизированный селектор для получения булочек
export const selectBuns = createSelector(
  [selectIngredients],
  (ingredients) => ingredients.filter((item) => item?.type === "bun") || []
);

// Меморизированный селектор для получения соусов и начинки
export const selectSaucesAndMains = createSelector(
  [selectIngredients],
  (ingredients) => ingredients.filter((item) => item?.type !== "bun") || []
);
