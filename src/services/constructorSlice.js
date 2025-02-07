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
  },
});

export const { addIngredient, removeIngredient } = constructorSlice.actions;

export default constructorSlice.reducer;
