import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://norma.nomoreparties.space/api/orders";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (ingredients) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients }),
    });
    if (!response.ok) {
      throw new Error("Ошибка при создании заказа");
    }
    const data = await response.json();
    return data.order;
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    currentOrder: null,
    loading: false,
    error: null,
    isOrderModalOpen: false, // Добавлено для управления модальным окном
  },
  reducers: {
    openOrderModal: (state) => {
      state.isOrderModalOpen = true;
    },
    closeOrderModal: (state) => {
      state.isOrderModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.isOrderModalOpen = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { openOrderModal, closeOrderModal } = orderSlice.actions;

export default orderSlice.reducer;
