import orderReducer from "./orderSlice";

export const store = configureStore({
  reducer: {
    // ... другие reducers
    order: orderReducer,
  },
});
