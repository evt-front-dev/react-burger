import { configureStore } from "@reduxjs/toolkit";
import ingredientsReducer from "../services/ingredientsSlice";
import constructorReducer from "../services/constructorSlice";
import ingredientDetailsReducer from "../services/ingredientDetailsSlice";
import orderReducer from "../services/orderSlice";
import authReducer from "../services/auth/authSlice";
import { wsReducer } from "./reducers/ws";
import { socketMiddleware } from "./middleware/socket-middleware";
import { wsActions } from "./actions/ws";

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
    ws: wsReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(socketMiddleware(wsActions)),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
