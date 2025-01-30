// OrderDetails.js
import React from "react";
import style from "./order-details.module.scss";
import doneImage from "../../images/done.png";

const OrderDetails = () => {
  return (
    <section className={style.section}>
      <h3 className={`text text_type_digits-large mb-8 ${style.neonShadow}`}>
        034536
      </h3>
      <p className="text text_type_main-medium mb-15">Идентификатор заказа</p>
      <img src={doneImage} alt="Готовность заказа" className="mb-15" />
      <p className="text text_type_main-small mb-2">
        Ваш заказ начали готовить
      </p>
      <p className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </section>
  );
};

export default OrderDetails;
