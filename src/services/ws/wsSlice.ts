import { createSlice, createAction, PayloadAction } from "@reduxjs/toolkit";
import { IWSStoreState, IWSOrdersResponse, IWSOrder } from "../../types/ws";

const initialState: IWSStoreState = {
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

export const connect = createAction<string, "WS_CONNECT">("WS_CONNECT");
export const disconnect = createAction("WS_DISCONNECT");

const wsSlice = createSlice({
  name: "ws",
  initialState,
  reducers: {
    wsConnecting: (state, action: PayloadAction<string | undefined>) => {
      state.wsConnected = false;
      state.connectionError = false;

      state.feedType = action.payload === "all" ? "public" : "user";
    },

    wsOpen: (state) => {
      state.wsConnected = true;
      state.error = undefined;
      state.connectionError = false;
    },

    wsClose: (state) => {
      state.wsConnected = false;
    },

    wsError: (state, action: PayloadAction<Event | Error>) => {
      state.wsConnected = false;
      state.error = action.payload;

      if (
        action.payload instanceof Error &&
        action.payload.message === "Invalid or missing token"
      ) {
        state.connectionError = true;
      }
    },

    wsMessage: (state, action: PayloadAction<IWSOrdersResponse>) => {
      if (action.payload && action.payload.success) {
        const orders = action.payload.orders || [];

        const isUserOrders =
          action.payload._wsURL?.includes("token=") ||
          (orders.length <= 20 && state.feedType === "user");

        state.orders = [...orders];

        state.total = action.payload.total || 0;
        state.totalToday = action.payload.totalToday || 0;
      }
    },

    wsClearError: (state) => {
      state.error = undefined;
      state.connectionError = false;
    },

    wsClearState: (state) => {
      const savedFeedType = state.feedType;

      state.wsConnected = false;
      state.orders = [];
      state.error = undefined;
      state.connectionError = false;
      state.feedType = savedFeedType;
    },

    setFeedType: (state, action: PayloadAction<"user" | "public" | null>) => {
      state.feedType = action.payload;
    },

    forceSetUserOrders: (state, action: PayloadAction<IWSOrder[]>) => {
      state.userOrders = [...action.payload];

      state.feedType = "user";
    },
  },
});

export const {
  wsConnecting,
  wsOpen,
  wsClose,
  wsError,
  wsMessage,
  wsClearError,
  wsClearState,
  setFeedType,
  forceSetUserOrders,
} = wsSlice.actions;

export const wsActions = {
  wsInit: connect.type,
  wsConnecting: wsConnecting.type,
  wsClose: disconnect.type,
  onOpen: wsOpen.type,
  onClose: wsClose.type,
  onError: wsError.type,
  onMessage: wsMessage.type,
  wsClearState: wsClearState.type,
};

export default wsSlice.reducer;
