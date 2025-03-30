import { IIngredient } from "./ingredients";

export type TOrderStatus = "created" | "pending" | "done";

export interface IOrderIngredient {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
}

export interface IOrder {
  ingredients: string[];
  _id: string;
  status: TOrderStatus;
  number: number;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IWSOrder {
  _id: string;
  ingredients: string[];
  status: "created" | "pending" | "done";
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
}

export interface IWSOrdersResponse {
  success: boolean;
  orders: IWSOrder[];
  total: number;
  totalToday: number;
  _feedType?: "public" | "user";
  _wsURL?: string;
}

export interface IWSActions {
  wsInit: string;
  wsConnecting: string;
  onOpen: string;
  onClose: string;
  onError: string;
  onMessage: string;
  wsClose: string;
  wsClearState: string;
}

export interface IWSStoreState {
  wsConnected: boolean;
  orders: IWSOrder[];
  publicOrders: IWSOrder[];
  userOrders: IWSOrder[];
  total: number;
  totalToday: number;
  error?: Event | Error;
  connectionError: boolean;
  feedType: "public" | "user" | null;
}

export interface IWSOrderWithIngredients extends Omit<IWSOrder, "ingredients"> {
  ingredients: IIngredient[];
}
