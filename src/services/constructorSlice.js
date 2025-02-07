import { createSlice } from "@reduxjs/toolkit";

const constructorSlice = createSlice({
  name: "constructor",
  initialState: {
    ingredients: [],
  },
  reducers: {
    addIngredient: (state, action) => {
      if (action.payload.type === "bun") {
        state.ingredients = state.ingredients.filter(
          (item) => item.type !== "bun"
        );
      }
      state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action) => {
      const index = state.ingredients.findIndex(
        (item) => item.uniqueId === action.payload
      );
      if (index !== -1) {
        state.ingredients.splice(index, 1);
      }
    },
    moveIngredient: (state, action) => {
      const { dragIndex, hoverIndex } = action.payload;

      // Получаем только не-булочные ингредиенты
      const nonBunIngredients = state.ingredients.filter(
        (item) => item.type !== "bun"
      );
      const bunIngredients = state.ingredients.filter(
        (item) => item.type === "bun"
      );

      // Перемещаем элемент
      const [draggedItem] = nonBunIngredients.splice(dragIndex, 1);
      nonBunIngredients.splice(hoverIndex, 0, draggedItem);

      // Обновляем массив, сохраняя булки на своих местах
      state.ingredients = [...bunIngredients, ...nonBunIngredients];
    },
  },
});

export const { addIngredient, removeIngredient, moveIngredient } =
  constructorSlice.actions;

export default constructorSlice.reducer;
