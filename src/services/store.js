import orderReducer from "./orderSlice";

export const store = configureStore({
  reducer: {
    order: orderReducer,
  },
});
