import { createSlice } from "@reduxjs/toolkit";

const constructorSlice = createSlice({
  name: "constructor",
  initialState: {
    ingredients: [],
  },
  reducers: {
    addIngredient: (state, action) => {
      if (!state.ingredients) {
        state.ingredients = [];
      }

      const ingredient = action.payload;

      if (ingredient.type === "bun") {
        state.ingredients = state.ingredients.filter(
          (item) => item.type !== "bun"
        );
        state.ingredients.unshift(ingredient);
      } else {
        state.ingredients.push(ingredient);
      }
    },
    removeIngredient: (state, action) => {
      if (!state.ingredients) {
        state.ingredients = [];
        return;
      }
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient._id !== action.payload
      );
    },
  },
});

export const { addIngredient, removeIngredient } = constructorSlice.actions;

export default constructorSlice.reducer;
