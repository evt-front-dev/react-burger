import React, { FC } from "react";
import { OrderCard } from "../order-card/order-card";
import { IOrder, IOrderIngredient } from "../../types/ws";
import styles from "./order-list.module.css";

interface IOrderListProps {
  orders: IOrder[];
  ingredients: { [key: string]: IOrderIngredient };
  showStatus?: boolean;
}

export const OrderList: FC<IOrderListProps> = ({
  orders,
  ingredients,
  showStatus,
}) => {
  return (
    <div className={styles.list}>
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          ingredients={ingredients}
          status={showStatus}
        />
      ))}
    </div>
  );
};
