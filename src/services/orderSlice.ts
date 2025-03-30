import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCookie } from "../utils/cookies";

const API_URL = "https://norma.nomoreparties.space/api/orders";

interface OrderResponse {
  name: string;
  order: {
    number: number;
    ingredients?: string[];
    _id?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
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
  async (ingredients, { rejectWithValue }) => {
    try {
      if (!ingredients || ingredients.length === 0) {
        throw new Error("Необходимо добавить ингредиенты для заказа");
      }

      const token = getCookie("token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.authorization = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;
      } else {
        console.warn(
          "Создание заказа без токена авторизации - возможно, пользователь не авторизован"
        );
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers,
          body: JSON.stringify({ ingredients }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Ошибка при создании заказа:", errorData);
          return rejectWithValue(
            errorData.message || "Ошибка при создании заказа"
          );
        }

        const data = await response.json();
        return data;
      } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error) {
          if (error.name === "AbortError") {
            console.error("Запрос на создание заказа отменен по таймауту");
            throw new Error("Превышено время ожидания ответа от сервера");
          }

          console.error("Ошибка сети при создании заказа:", error);
          throw error;
        }
        throw new Error("Неизвестная ошибка при создании заказа");
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Неизвестная ошибка при создании заказа");
    }
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
        state.currentOrder = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (
          action.payload &&
          action.payload.order &&
          action.payload.order.number
        ) {
          state.currentOrder = action.payload;
        } else {
          state.error = "Ошибка получения номера заказа";
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Произошла ошибка";
        console.error("Order creation error:", action.error);
      });
  },
});

export const { closeOrderModal } = orderSlice.actions;
export default orderSlice.reducer;
