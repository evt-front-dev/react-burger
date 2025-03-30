import { createAction } from "@reduxjs/toolkit";
import { IWSOrdersResponse } from "../../types/ws";

export const connect = createAction<string, "WS_CONNECT">("WS_CONNECT");
export const disconnect = createAction("WS_DISCONNECT");
export const wsConnecting = createAction("WS_CONNECTING");
export const wsOpen = createAction("WS_OPEN");
export const wsClose = createAction("WS_CLOSE");
export const wsMessage = createAction<IWSOrdersResponse, "WS_MESSAGE">(
  "WS_MESSAGE"
);
export const wsError = createAction<Event, "WS_ERROR">("WS_ERROR");

export const wsActions = {
  wsInit: connect.type,
  wsConnecting: wsConnecting.type,
  wsClose: disconnect.type,
  onOpen: wsOpen.type,
  onClose: wsClose.type,
  onError: wsError.type,
  onMessage: wsMessage.type,
};
