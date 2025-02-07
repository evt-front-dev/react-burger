// OrderDetails.js
import React from "react";
import styles from "./order-details.module.scss";
import doneImage from "../../images/done.png";
import { useSelector } from "react-redux";
import { CheckMarkIcon } from "@ya.praktikum/react-developer-burger-ui-components";

const OrderDetails = () => {
  const { currentOrder, error } = useSelector((state) => state.order);

  if (error) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-medium text_color_error">{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <p className="text text_type_digits-large mb-8">
        {currentOrder?.order?.number}
      </p>
      <p className="text text_type_main-medium mb-15">идентификатор заказа</p>
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
