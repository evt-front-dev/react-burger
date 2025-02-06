import { configureStore } from "@reduxjs/toolkit";
import ingredientsReducer from "../services/ingredientsSlice";
import constructorReducer from "../services/constructorSlice";
import ingredientDetailsReducer from "../services/ingredientDetailsSlice";
import orderReducer from "../services/orderSlice";

const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    constructor: constructorReducer,
    ingredientDetails: ingredientDetailsReducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["constructor"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
