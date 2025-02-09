import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://norma.nomoreparties.space/api/ingredients";

export const fetchIngredients = createAsyncThunk(
  "ingredients/fetchIngredients",
  async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Ошибка при загрузке ингредиентов");
    }
    const data = await response.json();
    return data.data.map((ingredient) => ({ ...ingredient, count: 0 }));
  }
);

const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    incrementIngredientCount: (state, action) => {
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
    decrementIngredientCount: (state, action) => {
      const ingredient = state.list.find((item) => item._id === action.payload);
      if (ingredient && ingredient.count > 0) {
        if (ingredient.type === "bun") {
          ingredient.count = 0;
        } else {
          ingredient.count -= 1;
        }
      }
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
        state.error = action.error.message;
      });
  },
});

export const { incrementIngredientCount, decrementIngredientCount } =
  ingredientsSlice.actions;

export default ingredientsSlice.reducer;
