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

      const nonBunIngredients = state.ingredients.filter(
        (item) => item.type !== "bun"
      );
      const bunIngredients = state.ingredients.filter(
        (item) => item.type === "bun"
      );

      const [draggedItem] = nonBunIngredients.splice(dragIndex, 1);
      nonBunIngredients.splice(hoverIndex, 0, draggedItem);
      state.ingredients = [...bunIngredients, ...nonBunIngredients];
    },
    setConstructorIngredients: (state, action) => {
      state.ingredients = action.payload;
    },
    resetConstructor: (state) => {
      state.ingredients = [];
    },
  },
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  setConstructorIngredients,
  resetConstructor,
} = constructorSlice.actions;

export default constructorSlice.reducer;
