import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Ingredient } from "./ingredientsSlice";

interface IngredientDetailsState {
  currentIngredient: Ingredient | null;
}

const initialState: IngredientDetailsState = {
  currentIngredient: null,
};

const ingredientDetailsSlice = createSlice({
  name: "ingredientDetails",
  initialState,
  reducers: {
    setIngredientDetails: (state, action: PayloadAction<Ingredient>) => {
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
