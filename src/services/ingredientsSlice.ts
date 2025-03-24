import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const API_URL = "https://norma.nomoreparties.space/api/ingredients";

export interface Ingredient {
  _id: string;
  name: string;
  type: "bun" | "sauce" | "main";
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
  count: number;
}

interface IngredientsState {
  list: Ingredient[];
  loading: boolean;
  error: string | null;
}

export const fetchIngredients = createAsyncThunk<Ingredient[]>(
  "ingredients/fetchIngredients",
  async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Ошибка при загрузке ингредиентов");
    }
    const data = await response.json();
    return data.data.map((ingredient: Ingredient) => ({
      ...ingredient,
      count: 0,
    }));
  }
);

const initialState: IngredientsState = {
  list: [],
  loading: false,
  error: null,
};

const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState,
  reducers: {
    incrementIngredientCount: (state, action: PayloadAction<string>) => {
      const ingredient = state.list.find((item) => item._id === action.payload);
      if (ingredient) {
        if (ingredient.type === "bun") {
          state.list.forEach((item) => {
            if (item.type === "bun") {
              item.count = 0;
            }
          });
          ingredient.count = 2;
        } else {
          ingredient.count = (ingredient.count || 0) + 1;
        }
      }
    },
    decrementIngredientCount: (state, action: PayloadAction<string>) => {
      const ingredient = state.list.find((item) => item._id === action.payload);
      if (ingredient && ingredient.count > 0) {
        if (ingredient.type === "bun") {
          ingredient.count = 0;
        } else {
          ingredient.count -= 1;
        }
      }
    },
    resetIngredientCounts: (state) => {
      state.list.forEach((ingredient) => {
        ingredient.count = 0;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Произошла ошибка";
      });
  },
});

export const {
  incrementIngredientCount,
  decrementIngredientCount,
  resetIngredientCounts,
} = ingredientsSlice.actions;

export default ingredientsSlice.reducer;
