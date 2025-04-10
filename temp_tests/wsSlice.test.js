import wsSlice, {
  wsConnecting,
  wsOpen,
  wsClose,
  wsError,
  wsMessage,
  wsClearError,
  wsClearState,
  setFeedType,
  forceSetUserOrders,
  connect,
  disconnect,
} from "../wsSlice";

const reducer = wsSlice.reducer;

describe("ws reducer", () => {
  const initialState = {
    wsConnected: false,
    orders: [],
    publicOrders: [],
    userOrders: [],
    total: 0,
    totalToday: 0,
    error: undefined,
    connectionError: false,
    feedType: null,
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle wsConnecting with "all" payload', () => {
    const newState = reducer(initialState, wsConnecting("all"));

    expect(newState).toEqual({
      ...initialState,
      feedType: "public",
    });
  });

  it("should handle wsConnecting with user token payload", () => {
    const newState = reducer(initialState, wsConnecting("token"));

    expect(newState).toEqual({
      ...initialState,
      feedType: "user",
    });
  });

  it("should handle wsOpen", () => {
    const stateWithError = {
      ...initialState,
      error: new Error("Test error"),
      connectionError: true,
    };

    const newState = reducer(stateWithError, wsOpen());

    expect(newState).toEqual({
      ...initialState,
      wsConnected: true,
      error: undefined,
      connectionError: false,
    });
  });

  it("should handle wsClose", () => {
    const connectedState = {
      ...initialState,
      wsConnected: true,
    };

    const newState = reducer(connectedState, wsClose());

    expect(newState).toEqual({
      ...initialState,
      wsConnected: false,
    });
  });

  it("should handle wsError with regular error", () => {
    const error = new Error("Regular error");

    const newState = reducer(initialState, wsError(error));

    expect(newState).toEqual({
      ...initialState,
      wsConnected: false,
      error: error,
      connectionError: false,
    });
  });

  it("should handle wsError with token error", () => {
    const tokenError = new Error("Invalid or missing token");

    const newState = reducer(initialState, wsError(tokenError));

    expect(newState).toEqual({
      ...initialState,
      wsConnected: false,
      error: tokenError,
      connectionError: true,
    });
  });

  it("should handle wsMessage with user orders", () => {
    const ordersPayload = {
      success: true,
      orders: [
        { id: "1", name: "Order 1" },
        { id: "2", name: "Order 2" },
      ],
      total: 100,
      totalToday: 10,
      _wsURL: "wss://example.com/orders?token=123",
    };

    const newState = reducer(initialState, wsMessage(ordersPayload));

    expect(newState).toEqual({
      ...initialState,
      orders: ordersPayload.orders,
      total: ordersPayload.total,
      totalToday: ordersPayload.totalToday,
    });
  });

  it("should handle wsMessage with public orders", () => {
    const ordersPayload = {
      success: true,
      orders: [
        { id: "1", name: "Order 1" },
        { id: "2", name: "Order 2" },
      ],
      total: 100,
      totalToday: 10,
      _wsURL: "wss://example.com/orders/all",
    };

    const newState = reducer(initialState, wsMessage(ordersPayload));

    expect(newState).toEqual({
      ...initialState,
      orders: ordersPayload.orders,
      total: ordersPayload.total,
      totalToday: ordersPayload.totalToday,
    });
  });

  it("should handle wsClearError", () => {
    const stateWithError = {
      ...initialState,
      error: new Error("Test error"),
      connectionError: true,
    };

    const newState = reducer(stateWithError, wsClearError());

    expect(newState).toEqual({
      ...initialState,
      error: undefined,
      connectionError: false,
    });
  });

  it("should handle wsClearState", () => {
    const state = {
      ...initialState,
      wsConnected: true,
      orders: [{ id: "1", name: "Order 1" }],
      error: new Error("Test error"),
      connectionError: true,
      feedType: "user",
    };

    const newState = reducer(state, wsClearState());

    expect(newState).toEqual({
      ...initialState,
      feedType: "user",
    });
  });

  it("should handle setFeedType", () => {
    const newState = reducer(initialState, setFeedType("user"));

    expect(newState).toEqual({
      ...initialState,
      feedType: "user",
    });
  });

  it("should handle forceSetUserOrders", () => {
    const userOrders = [
      { id: "1", name: "Order 1" },
      { id: "2", name: "Order 2" },
    ];

    const newState = reducer(initialState, forceSetUserOrders(userOrders));

    expect(newState).toEqual({
      ...initialState,
      userOrders: userOrders,
      feedType: "user",
    });
  });
});
