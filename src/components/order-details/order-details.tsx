import React, { useEffect } from "react";
import styles from "./order-details.module.scss";
import doneImage from "images/done.png";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

interface OrderState {
  currentOrder: {
    order: {
      number: number;
    };
  } | null;
  loading: boolean;
  error: string | null;
}

const OrderDetails: React.FC = () => {
  const { currentOrder, loading, error } = useSelector<RootState, OrderState>(
    (state) => state.order
  );

  if (error) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-medium text_color_error">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-medium">Оформляем заказ...</p>
      </div>
    );
  }

  if (!currentOrder || !currentOrder.order) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-medium">Номер заказа не найден</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <p className="text text_type_digits-large mb-8">
        {currentOrder.order.number}
      </p>
      <p className="text text_type_main-medium">идентификатор заказа</p>
      <div className={styles.icon}>
        <img src={doneImage} alt="Done" />
      </div>
      <p className="text text_type_main-default mb-2">
        Ваш заказ начали готовить
      </p>
      <p className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};

export default OrderDetails;
