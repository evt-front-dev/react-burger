import orderSlice, { createOrder, closeOrderModal } from "../orderSlice";

const reducer = orderSlice.reducer;

describe("order reducer", () => {
  const initialState = {
    currentOrder: null,
    isOrderModalOpen: false,
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it("should handle closeOrderModal", () => {
    const stateWithOrder = {
      currentOrder: {
        name: "Test Order",
        order: { number: 12345 },
        success: true,
      },
      isOrderModalOpen: true,
      loading: false,
      error: null,
    };

    const newState = reducer(stateWithOrder, closeOrderModal());

    expect(newState).toEqual({
      currentOrder: null,
      isOrderModalOpen: false,
      loading: false,
      error: null,
    });
  });

  it("should handle createOrder.pending", () => {
    const action = { type: createOrder.pending.type };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      currentOrder: null,
      isOrderModalOpen: true,
      loading: true,
      error: null,
    });
  });

  it("should handle createOrder.fulfilled", () => {
    const orderResponse = {
      name: "Test Order",
      order: { number: 12345 },
      success: true,
    };

    const action = {
      type: createOrder.fulfilled.type,
      payload: orderResponse,
    };

    const state = reducer(initialState, action);

    expect(state).toEqual({
      currentOrder: orderResponse,
      isOrderModalOpen: false,
      loading: false,
      error: null,
    });
  });

  it("should handle createOrder.fulfilled with invalid payload", () => {
    const invalidOrderResponse = {
      name: "Test Order",
      order: {},
      success: true,
    };

    const action = {
      type: createOrder.fulfilled.type,
      payload: invalidOrderResponse,
    };

    const state = reducer(initialState, action);

    expect(state).toEqual({
      currentOrder: null,
      isOrderModalOpen: false,
      loading: false,
      error: "Ошибка получения номера заказа",
    });
  });

  it("should handle createOrder.rejected", () => {
    const action = {
      type: createOrder.rejected.type,
      error: { message: "Failed to create order" },
    };

    const state = reducer(initialState, action);

    expect(state).toEqual({
      currentOrder: null,
      isOrderModalOpen: false,
      loading: false,
      error: "Failed to create order",
    });
  });
});
