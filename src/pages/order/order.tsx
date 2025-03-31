import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import { IOrder, IOrderIngredient } from "../../types/ws";
import { formatDate } from "../../utils/date";
import styles from "./order.module.css";
import { fetchIngredients, Ingredient } from "services/ingredientsSlice";
import { RootState } from "store/store";
import { useAppDispatch, useAppSelector } from "hooks/redux";

interface IIngredientCount {
  ingredient: IOrderIngredient;
  count: number;
}

interface IngredientsState {
  list: Ingredient[];
  loading: boolean;
  error: string | null;
}

interface OrderPageProps {
  isModal?: boolean;
}

export const OrderPage: React.FC<OrderPageProps> = ({ isModal = false }) => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const {
    list: ingredients,
    loading: ingredientsLoading,
    error: ingredientsError,
  } = useAppSelector((state) => state.ingredients);
  const { publicOrders, userOrders } = useAppSelector((state) => state.ws);

  useEffect(() => {
    if (!ingredients?.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients?.length]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError("Идентификатор заказа не указан");
        return;
      }

      try {
        const orderNumber = parseInt(id);
        let foundOrder =
          userOrders && userOrders.length > 0
            ? userOrders.find((order: IOrder) => order.number === orderNumber)
            : undefined;

        if (!foundOrder && publicOrders && publicOrders.length > 0) {
          foundOrder = publicOrders.find(
            (order: IOrder) => order.number === orderNumber
          );
        }

        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          try {
            const response = await fetch(
              `https://norma.nomoreparties.space/api/orders/${id}`
            );
            const data = await response.json();

            if (data.success && data.orders && data.orders.length > 0) {
              setOrder(data.orders[0]);
            } else {
              setError("Заказ не найден");
            }
          } catch (apiError) {
            console.error("Error fetching order from API:", apiError);
            setError("Ошибка при загрузке заказа");
          }
        }
      } catch (err) {
        console.error("Error processing order data:", err);
        setError("Ошибка при обработке данных заказа");
      }
    };

    if (ingredients && ingredients.length > 0) {
      fetchOrder();
    }
  }, [id, publicOrders, userOrders, ingredients]);

  useEffect(() => {
    if (isModal && order) {
      const modalTitle = document.querySelector('[data-testid="modal-title"]');

      if (modalTitle) {
        modalTitle.textContent = `#${order.number}`;
      } else {
        const headers = document.querySelectorAll(".text_type_digits-default");
        for (let i = 0; i < headers.length; i++) {
          const header = headers[i];
          if (
            header.closest('[class*="_modal_"]') ||
            header.closest('[class*="modal"]')
          ) {
            header.textContent = `#${order.number}`;
            break;
          }
        }
      }
    }
  }, [isModal, order]);

  if (ingredientsLoading) {
    return (
      <div className={`${styles.loading} text text_type_main-medium`}>
        Загрузка ингредиентов...
      </div>
    );
  }

  if (ingredientsError) {
    return (
      <div className={`${styles.error} text text_type_main-medium`}>
        Ошибка: {ingredientsError}
      </div>
    );
  }

  if (!ingredients) {
    return (
      <div className={`${styles.loading} text text_type_main-medium`}>
        Загрузка ингредиентов...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.error} text text_type_main-medium`}>
        {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className={`${styles.loading} text text_type_main-medium`}>
        Загрузка заказа...
      </div>
    );
  }

  const orderIngredients = order.ingredients
    .map((id) => ingredients.find((ingredient) => ingredient._id === id))
    .filter((ingredient): ingredient is Ingredient => ingredient !== undefined);

  const ingredientCounts = orderIngredients.reduce(
    (acc: IIngredientCount[], ingredient) => {
      const existingItem = acc.find(
        (item) => item.ingredient._id === ingredient._id
      );
      if (existingItem) {
        existingItem.count += 1;
      } else {
        acc.push({ ingredient, count: 1 });
      }
      return acc;
    },
    []
  );

  const totalPrice = ingredientCounts.reduce(
    (sum, item) => sum + item.count * item.ingredient.price,
    0
  );

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
    <div className={styles.container}>
      {!isModal && (
        <p className={`${styles.number} text text_type_digits-default`}>
          #{order.number}
        </p>
      )}
      <h1 className={`${styles.name} text text_type_main-medium`}>
        {order.name}
      </h1>
      <p
        className={`${styles.status} ${
          order.status === "done" ? styles.done : ""
        } text text_type_main-default`}
      >
        {getStatus(order.status)}
      </p>
      <div className={styles.composition}>
        <h2 className={`${styles.compositionTitle} text text_type_main-medium`}>
          Состав:
        </h2>
        <ul className={styles.ingredients}>
          {ingredientCounts.map(({ ingredient, count }) => (
            <li key={ingredient._id} className={styles.ingredient}>
              <div className={styles.ingredientInfo}>
                <div className={styles.ingredientImage}>
                  <img src={ingredient.image_mobile} alt={ingredient.name} />
                </div>
                <p
                  className={`${styles.ingredientName} text text_type_main-default`}
                >
                  {ingredient.name}
                </p>
              </div>
              <div className={styles.ingredientPrice}>
                <span
                  className={`${styles.count} text text_type_digits-default`}
                >
                  {count} x {ingredient.price}
                </span>
                <CurrencyIcon type="primary" />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.footer}>
        <p
          className={`${styles.date} text text_type_main-default text_color_inactive`}
        >
          {formatDate(order.createdAt)}
        </p>
        <div className={styles.total}>
          <span
            className={`${styles.totalPrice} text text_type_digits-default`}
          >
            {totalPrice}
          </span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};
