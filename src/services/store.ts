import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "./orderSlice";
import constructorReducer from "./constructorSlice";
import ingredientsReducer from "./ingredientsSlice";
import authReducer from "./auth/authSlice";

export const store = configureStore({
  reducer: {
    order: orderReducer,
    constructor: constructorReducer,
    ingredients: ingredientsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
