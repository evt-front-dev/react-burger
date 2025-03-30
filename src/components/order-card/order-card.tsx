import React, { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import { IOrder, IOrderIngredient } from "../../types/ws";
import styles from "./order-card.module.css";
import { formatDate } from "../../utils/date";

interface IOrderCardProps {
  order: IOrder;
  ingredients: { [key: string]: IOrderIngredient };
  status?: boolean;
}

export const OrderCard: FC<IOrderCardProps> = ({
  order,
  ingredients,
  status,
}) => {
  const location = useLocation();
  const { number, createdAt, name } = order;

  const orderIngredients = order.ingredients
    .map((id) => ingredients[id])
    .filter((ingredient) => ingredient);

  const totalPrice = order.ingredients.reduce((sum, id) => {
    const ingredient = ingredients[id];
    return ingredient ? sum + ingredient.price : sum;
  }, 0);

  const maxIngredientsToShow = 6;
  const remainingCount = orderIngredients.length - maxIngredientsToShow;

  const getStatus = (status: string) => {
    switch (status) {
      case "done":
        return "Выполнен";
      case "pending":
        return "Готовится";
      case "created":
        return "Создан";
      default:
        return "Статус неизвестен";
    }
  };

  return (
    <Link
      to={`${location.pathname}/${number}`}
      state={{ background: location }}
      className={styles.card}
    >
      <div className={styles.header}>
        <span className={`text text_type_digits-default ${styles.number}`}>
          #{number}
        </span>
        <span
          className={`text text_type_main-default text_color_inactive ${styles.date}`}
        >
          {formatDate(createdAt)}
        </span>
      </div>
      <div className={`text text_type_main-medium ${styles.name}`}>{name}</div>
      {status && (
        <div
          className={`${styles.status} ${
            order.status === "done" ? styles.done : ""
          } text text_type_main-default`}
        >
          {getStatus(order.status)}
        </div>
      )}
      <div className={styles.footer}>
        <div className={styles.ingredients}>
          {orderIngredients
            .slice(0, maxIngredientsToShow)
            .map((ingredient, index) => (
              <div
                key={index}
                className={styles.ingredient}
                style={{
                  zIndex: maxIngredientsToShow - index,
                  transform: `translateX(-${index * 16}px)`,
                }}
              >
                <img src={ingredient.image_mobile} alt={ingredient.name} />
                {index === maxIngredientsToShow - 1 && remainingCount > 0 && (
                  <div
                    className={`${styles.counter} text text_type_main-default`}
                  >
                    +{remainingCount}
                  </div>
                )}
              </div>
            ))}
        </div>
        <div className={styles.price}>
          <span className={`text text_type_digits-default ${styles.value}`}>
            {totalPrice}
          </span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </Link>
  );
};
