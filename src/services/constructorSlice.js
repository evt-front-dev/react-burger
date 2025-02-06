import { createSlice } from "@reduxjs/toolkit";

const constructorSlice = createSlice({
  name: "constructor",
  initialState: {
    ingredients: [],
  },
  reducers: {
    addIngredient: (state, action) => {
      state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient._id !== action.payload
      );
    },
  },
});

export const { addIngredient, removeIngredient } = constructorSlice.actions;

export default constructorSlice.reducer;
