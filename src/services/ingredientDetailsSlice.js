import { createSlice } from "@reduxjs/toolkit";

const ingredientDetailsSlice = createSlice({
  name: "ingredientDetails",
  initialState: {
    currentIngredient: null,
  },
  reducers: {
    setIngredientDetails: (state, action) => {
      state.currentIngredient = action.payload;
    },
    clearIngredientDetails: (state) => {
      state.currentIngredient = null;
    },
  },
});

export const { setIngredientDetails, clearIngredientDetails } =
  ingredientDetailsSlice.actions;

export default ingredientDetailsSlice.reducer;
