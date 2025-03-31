import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { OrderList } from "../../components/order-list/order-list";
import { connect, disconnect, setFeedType } from "services/ws/wsSlice";
import styles from "./feed.module.css";
import { fetchIngredients, Ingredient } from "services/ingredientsSlice";
import { RootState } from "store/store";
import { IWSStoreState, IOrderIngredient, IWSOrder } from "types/ws";
import { useAppDispatch, useAppSelector } from "hooks/redux";

interface IngredientsState {
  list: Ingredient[];
  loading: boolean;
  error: string | null;
}

export const FeedPage = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { publicOrders, orders, total, totalToday, wsConnected, feedType } =
    useAppSelector((state) => state.ws);
  const {
    list: ingredients,
    loading,
    error,
  } = useAppSelector((state) => state.ingredients);

  const ingredientsMap = ingredients?.reduce<{
    [key: string]: IOrderIngredient;
  }>((acc, ingredient) => {
    acc[ingredient._id] = ingredient;
    return acc;
  }, {});

  const currentPathRef = useRef(location.pathname);
  const isConnectedRef = useRef(false);
  const disconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    if (!ingredients?.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients?.length]);

  useEffect(() => {
    currentPathRef.current = location.pathname;

    if (location.pathname.includes("feed")) {
      dispatch(setFeedType("public"));
    }

    const shouldConnect =
      location.pathname.includes("feed") &&
      (!wsConnected || feedType !== "public");

    if (shouldConnect && !isConnectingRef.current) {
      isConnectingRef.current = true;

      if (wsConnected && feedType !== "public") {
        dispatch(disconnect());

        setTimeout(() => {
          dispatch(connect("all"));
          isConnectedRef.current = true;
          setTimeout(() => {
            isConnectingRef.current = false;
          }, 1000);
        }, 1000);
      } else {
        dispatch(connect("all"));
        isConnectedRef.current = true;

        setTimeout(() => {
          isConnectingRef.current = false;
        }, 1000);
      }
    }

    return () => {
      if (
        !currentPathRef.current.includes("feed") &&
        !isConnectingRef.current
      ) {
        isConnectingRef.current = true;

        if (disconnectTimeoutRef.current) {
          clearTimeout(disconnectTimeoutRef.current);
        }

        disconnectTimeoutRef.current = setTimeout(() => {
          dispatch(disconnect());
          isConnectedRef.current = false;
          disconnectTimeoutRef.current = null;

          setTimeout(() => {
            isConnectingRef.current = false;
          }, 1000);
        }, 1000);
      }
    };
  }, [dispatch, location.pathname, wsConnected, feedType]);

  useEffect(() => {
    return () => {
      if (disconnectTimeoutRef.current) {
        clearTimeout(disconnectTimeoutRef.current);
        disconnectTimeoutRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p className="text text_type_main-medium">Загрузка ингредиентов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p className="text text_type_main-medium">Ошибка: {error}</p>
      </div>
    );
  }

  if (!ingredients) {
    return (
      <div className={styles.loading}>
        <p className="text text_type_main-medium">Загрузка ингредиентов...</p>
      </div>
    );
  }

  if (!wsConnected) {
    return (
      <div className={styles.loading}>
        <p className="text text_type_main-medium">Подключение к серверу...</p>
      </div>
    );
  }

  const ordersToDisplay: IWSOrder[] =
    publicOrders && publicOrders.length > 0
      ? publicOrders
      : orders && orders.length > 0
      ? orders
      : [];

  if (!ordersToDisplay || ordersToDisplay.length === 0) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={`${styles.title} text text_type_main-large`}>
            Лента заказов
          </h1>
          <div className={styles.empty}>
            <p className="text text_type_main-medium">
              В данный момент нет активных заказов. Пожалуйста, попробуйте
              позже.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const doneOrders = ordersToDisplay
    .filter((order) => order.status === "done")
    .slice(0, 10);
  const pendingOrders = ordersToDisplay
    .filter((order) => order.status === "pending")
    .slice(0, 10);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={`${styles.title} text text_type_main-large`}>
          Лента заказов
        </h1>
        <div className={styles.content}>
          <section className={styles.orders}>
            <OrderList orders={ordersToDisplay} ingredients={ingredientsMap} />
          </section>
          <section className={styles.info}>
            <div className={styles.boards}>
              <div className={styles.board}>
                <h2
                  className={`${styles.boardTitle} text text_type_main-medium`}
                >
                  Готовы:
                </h2>
                <ul className={`${styles.numbers} ${styles.done}`}>
                  {doneOrders.map((order) => (
                    <li
                      key={order._id}
                      className="text text_type_digits-default"
                    >
                      {order.number}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.board}>
                <h2
                  className={`${styles.boardTitle} text text_type_main-medium`}
                >
                  В работе:
                </h2>
                <ul className={styles.numbers}>
                  {pendingOrders.map((order) => (
                    <li
                      key={order._id}
                      className="text text_type_digits-default"
                    >
                      {order.number}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={styles.total}>
              <h2 className={`${styles.totalTitle} text text_type_main-medium`}>
                Выполнено за все время:
              </h2>
              <p className="text text_type_digits-large">{total}</p>
            </div>
            <div className={styles.total}>
              <h2 className={`${styles.totalTitle} text text_type_main-medium`}>
                Выполнено за сегодня:
              </h2>
              <p className="text text_type_digits-large">{totalToday}</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
