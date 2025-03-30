import { createReducer } from "@reduxjs/toolkit";
import { IWSStoreState } from "../../types/ws";
import {
  wsClose,
  wsConnecting,
  wsError,
  wsMessage,
  wsOpen,
} from "../actions/ws";

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

export const wsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(wsConnecting, (state) => {
      state.wsConnected = false;
      state.connectionError = false;
      state.orders = [];
    })
    .addCase(wsOpen, (state) => {
      state.wsConnected = true;
      state.error = undefined;
      state.connectionError = false;
    })
    .addCase(wsClose, (state) => {
      state.wsConnected = false;
    })
    .addCase(wsError, (state, action) => {
      state.wsConnected = false;
      state.error = action.payload;
      if (
        action.payload instanceof Error &&
        action.payload.message === "Invalid or missing token"
      ) {
        state.connectionError = true;
      }
    })
    .addCase(wsMessage, (state, action) => {
      if (action.payload && action.payload.success) {
        state.orders = action.payload.orders || [];
        state.total = action.payload.total || 0;
        state.totalToday = action.payload.totalToday || 0;
      }
    });
});
