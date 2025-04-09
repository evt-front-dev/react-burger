import wsReducer, {
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
    expect(wsReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle wsConnecting with "all" payload', () => {
    const newState = wsReducer(initialState, wsConnecting("all"));

    expect(newState).toEqual({
      ...initialState,
      feedType: "public",
    });
  });

  it("should handle wsConnecting with user token payload", () => {
    const newState = wsReducer(initialState, wsConnecting("token"));

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

    const newState = wsReducer(stateWithError, wsOpen());

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

    const newState = wsReducer(connectedState, wsClose());

    expect(newState).toEqual({
      ...initialState,
      wsConnected: false,
    });
  });

  it("should handle wsError with regular error", () => {
    const error = new Error("Regular error");

    const newState = wsReducer(initialState, wsError(error));

    expect(newState).toEqual({
      ...initialState,
      wsConnected: false,
      error: error,
      connectionError: false,
    });
  });

  it("should handle wsError with token error", () => {
    const tokenError = new Error("Invalid or missing token");

    const newState = wsReducer(initialState, wsError(tokenError));

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

    const newState = wsReducer(initialState, wsMessage(ordersPayload));

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

    const newState = wsReducer(initialState, wsMessage(ordersPayload));

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

    const newState = wsReducer(stateWithError, wsClearError());

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

    const newState = wsReducer(state, wsClearState());

    expect(newState).toEqual({
      ...initialState,
      feedType: "user",
    });
  });

  it("should handle setFeedType", () => {
    const newState = wsReducer(initialState, setFeedType("user"));

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

    const newState = wsReducer(initialState, forceSetUserOrders(userOrders));

    expect(newState).toEqual({
      ...initialState,
      userOrders: userOrders,
      feedType: "user",
    });
  });
});
