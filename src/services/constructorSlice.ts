import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Ingredient } from "./ingredientsSlice";

interface ConstructorIngredient extends Ingredient {
  uniqueId: string;
}

interface ConstructorState {
  ingredients: ConstructorIngredient[];
}

interface MoveIngredientPayload {
  dragIndex: number;
  hoverIndex: number;
}

const initialState: ConstructorState = {
  ingredients: [],
};

const constructorSlice = createSlice({
  name: "constructor",
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<ConstructorIngredient>) => {
      if (action.payload.type === "bun") {
        state.ingredients = state.ingredients.filter(
          (item) => item.type !== "bun"
        );
      }
      state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      const index = state.ingredients.findIndex(
        (item) => item.uniqueId === action.payload
      );
      if (index !== -1) {
        state.ingredients.splice(index, 1);
      }
    },
    moveIngredient: (state, action: PayloadAction<MoveIngredientPayload>) => {
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
    setConstructorIngredients: (
      state,
      action: PayloadAction<ConstructorIngredient[]>
    ) => {
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

export type { ConstructorIngredient };
export default constructorSlice.reducer;
