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
    return data.data;
  }
);

const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
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

export default ingredientsSlice.reducer;
