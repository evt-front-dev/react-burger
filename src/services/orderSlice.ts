import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://norma.nomoreparties.space/api/orders";

interface OrderResponse {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
}

interface OrderState {
  currentOrder: OrderResponse | null;
  isOrderModalOpen: boolean;
  loading: boolean;
  error: string | null;
}

export const createOrder = createAsyncThunk<OrderResponse, string[]>(
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
      const error = await response.json();
      throw new Error(error.message || "Ошибка при создании заказа");
    }

    const data = await response.json();
    return data;
  }
);

const initialState: OrderState = {
  currentOrder: null,
  isOrderModalOpen: false,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.isOrderModalOpen = false;
      state.currentOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isOrderModalOpen = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Произошла ошибка";
      });
  },
});

export const { closeOrderModal } = orderSlice.actions;
export default orderSlice.reducer;
