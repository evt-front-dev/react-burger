import { Middleware, AnyAction, MiddlewareAPI } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { IWSActions } from "../../types/ws";
import { RootState } from "../store";
import { wsClearState, setFeedType } from "../../services/ws/wsSlice";

const ALL_ORDERS_WS_URL = "wss://norma.nomoreparties.space/orders/all";
const USER_ORDERS_WS_URL = "wss://norma.nomoreparties.space/orders";

interface IWSAction extends AnyAction {
  payload?: any;
}

type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

let lastRequestedUrl = "";
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

const getSocketUrlFromPayload = (payload: any): string => {
  if (payload === "all") {
    const url = ALL_ORDERS_WS_URL;
    return url;
  } else if (payload) {
    const token =
      typeof payload === "string" && payload.startsWith("Bearer ")
        ? payload.replace("Bearer ", "")
        : payload;
    const url = `${USER_ORDERS_WS_URL}?token=${token}`;
    return url;
  } else {
    return ALL_ORDERS_WS_URL;
  }
};

export const socketMiddleware = (wsActions: IWSActions): Middleware => {
  return (store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;
    let isConnecting = false;
    let reconnectTimer: NodeJS.Timeout | null = null;
    let closeRequested = false;

    const clearReconnectTimer = () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    return (next) => (action: unknown) => {
      const { dispatch } = store;
      const {
        wsInit,
        wsConnecting,
        onOpen,
        onClose,
        onError,
        onMessage,
        wsClose,
      } = wsActions;

      const typedAction = action as AnyAction;
      const result = next(action);

      if (typedAction.type === wsInit) {
        const requestedUrl = getSocketUrlFromPayload(typedAction.payload);

        if (
          requestedUrl === lastRequestedUrl &&
          reconnectAttempts > MAX_RECONNECT_ATTEMPTS
        ) {
          reconnectAttempts = 0;
          clearReconnectTimer();
          return result;
        }

        lastRequestedUrl = requestedUrl;
        clearReconnectTimer();
        closeRequested = false;

        if (socket) {
          if (socket.readyState === WebSocket.OPEN) {
            if (socket.url !== requestedUrl && requestedUrl) {
              socket.close();
              socket = null;
            } else {
              reconnectAttempts = 0;
              return result;
            }
          } else if (socket.readyState === WebSocket.CONNECTING) {
            return result;
          } else {
            try {
              socket.close();
            } catch (err) {
              console.error("Error closing existing socket:", err);
            }
            socket = null;
          }
        }

        if (!isConnecting) {
          dispatch({ type: wsConnecting, payload: typedAction.payload });
          isConnecting = true;
        }

        try {
          socket = new WebSocket(requestedUrl);

          const feedType = requestedUrl.includes("?token=") ? "user" : "public";

          socket.onopen = (event) => {
            isConnecting = false;
            reconnectAttempts = 0;

            dispatch(setFeedType(feedType));
            dispatch({ type: onOpen, payload: event });
          };

          socket.onerror = (event) => {
            isConnecting = false;
            console.error("WebSocket error:", event);
            dispatch({ type: onError, payload: event });

            if (
              !closeRequested &&
              !reconnectTimer &&
              reconnectAttempts < MAX_RECONNECT_ATTEMPTS
            ) {
              reconnectAttempts++;
              reconnectTimer = setTimeout(() => {
                reconnectTimer = null;
                if (!closeRequested) {
                  dispatch({ type: wsInit, payload: typedAction.payload });
                }
              }, 2000);
            } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
              reconnectAttempts = 0;
            }
          };

          socket.onmessage = (event) => {
            try {
              const { data } = event;
              const parsedData = JSON.parse(data);

              if (parsedData.success && parsedData.orders) {
                parsedData._wsURL = requestedUrl;
              }

              dispatch({ type: onMessage, payload: parsedData });
            } catch (err) {
              console.error("Failed to parse WebSocket message:", err);
            }
          };

          socket.onclose = (event) => {
            isConnecting = false;
            dispatch({ type: onClose, payload: event });

            if (
              !closeRequested &&
              event.code !== 1000 &&
              !reconnectTimer &&
              reconnectAttempts < MAX_RECONNECT_ATTEMPTS
            ) {
              reconnectAttempts++;
              reconnectTimer = setTimeout(() => {
                reconnectTimer = null;
                if (!closeRequested) {
                  dispatch({ type: wsInit, payload: typedAction.payload });
                }
              }, 2000);
            } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
              reconnectAttempts = 0;
            }
          };
        } catch (error) {
          isConnecting = false;
          console.error("Error creating WebSocket connection:", error);
          dispatch({
            type: onError,
            payload: error,
          });

          if (
            !closeRequested &&
            !reconnectTimer &&
            reconnectAttempts < MAX_RECONNECT_ATTEMPTS
          ) {
            reconnectAttempts++;
            reconnectTimer = setTimeout(() => {
              reconnectTimer = null;
              if (!closeRequested) {
                dispatch({ type: wsInit, payload: typedAction.payload });
              }
            }, 2000);
          } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts = 0;
          }
        }
      }

      if (typedAction.type === wsClose) {
        closeRequested = true;
        reconnectAttempts = 0;
        clearReconnectTimer();

        if (socket) {
          try {
            if (
              socket.readyState === WebSocket.OPEN ||
              socket.readyState === WebSocket.CONNECTING
            ) {
              socket.close();
              dispatch(wsClearState());
            }
          } catch (err) {
            console.error("Error closing WebSocket:", err);
          }
          socket = null;
        }
      }

      return result;
    };
  };
};
