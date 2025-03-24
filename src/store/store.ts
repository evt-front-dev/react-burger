import { configureStore } from "@reduxjs/toolkit";
import ingredientsReducer from "../services/ingredientsSlice";
import constructorReducer from "../services/constructorSlice";
import ingredientDetailsReducer from "../services/ingredientDetailsSlice";
import orderReducer from "../services/orderSlice";
import authReducer from "../services/auth/authSlice";

const preloadedState = {
  constructor: {
    ingredients: [],
  },
};

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    constructor: constructorReducer,
    ingredientDetails: ingredientDetailsReducer,
    order: orderReducer,
    auth: authReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
