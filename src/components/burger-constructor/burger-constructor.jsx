import React from "react";
import PropTypes from "prop-types";
import styles from "./burger-constructor.module.scss";
import {
  ConstructorElement,
  Button,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import IngredientItem from "./ingredient-item/ingredient-item";
import { useSelector, useDispatch } from "react-redux";
import { useDrop } from "react-dnd";
import { DND_TYPES } from "../../utils/constants";
import { addIngredient } from "../../services/constructorSlice";
import { incrementIngredientCount } from "../../services/ingredientsSlice";
import { createOrder } from "../../services/orderSlice";

const BurgerConstructor = () => {
  const dispatch = useDispatch();
  const ingredients = useSelector((state) => state.constructor.ingredients);
  const { loading, error } = useSelector((state) => state.order);

  const buns = ingredients.filter((item) => item?.type === "bun");
  const saucesAndMains = ingredients.filter((item) => item?.type !== "bun");

  const bun = buns[0];

  const totalPrice = React.useMemo(() => {
    const bunsPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = saucesAndMains.reduce(
      (acc, item) => acc + item.price,
      0
    );
    return bunsPrice + ingredientsPrice;
  }, [bun, saucesAndMains]);

  const [{ isHover, canDrop, itemType }, dropTarget] = useDrop({
    accept: DND_TYPES.INGREDIENT,
    drop(item) {
      const uniqueIngredient = {
        ...item,
        uniqueId: `${item._id}-${Date.now()}`,
      };
      dispatch(addIngredient(uniqueIngredient));
      dispatch(incrementIngredientCount(item._id));
    },
    collect: (monitor) => ({
      isHover: monitor.isOver(),
      canDrop: monitor.canDrop(),
      itemType: monitor.getItem()?.type,
    }),
  });

  // Определяем классы для разных зон
  const topBunClass = `${styles.placeholder} ${styles.placeholderTop} ${
    isHover && itemType === "bun" ? styles.placeholderHover : ""
  }`;

  const middleClass = `${styles.placeholder} ${styles.placeholderMiddle} ${
    isHover && itemType !== "bun" ? styles.placeholderHover : ""
  }`;

  const bottomBunClass = `${styles.placeholder} ${styles.placeholderBottom} ${
    isHover && itemType === "bun" ? styles.placeholderHover : ""
  }`;

  const handleOrderClick = () => {
    // Проверяем наличие всех необходимых ингредиентов
    const bun = ingredients.find((item) => item.type === "bun");
    if (!bun) {
      alert("Пожалуйста, добавьте булку для создания заказа");
      return;
    }

    if (ingredients.length < 2) {
      alert("Добавьте хотя бы один ингредиент помимо булки");
      return;
    }

    // Собираем массив ID ингредиентов
    const ingredientIds = ingredients.map((item) => item._id);

    // Отправляем заказ
    dispatch(createOrder(ingredientIds));
  };

  return (
    <section
      ref={dropTarget}
      className={`pl-4 pr-4 ${styles.burgerConstructor}`}
    >
      <article className={`${styles.constructorElement}`}>
        {bun ? (
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        ) : (
          <div className={topBunClass}>
            <p className="text text_type_main-default text_color_inactive">
              Выберите булку
            </p>
          </div>
        )}
      </article>

      {saucesAndMains.length > 0 ? (
        <ul className={`${styles.resizingList} custom-scroll`}>
          {saucesAndMains.map((item, index) => (
            <IngredientItem key={item.uniqueId} item={item} index={index} />
          ))}
        </ul>
      ) : (
        <article className={`${styles.constructorElement}`}>
          <div className={middleClass}>
            <p className="text text_type_main-default text_color_inactive">
              Добавьте ингредиенты
            </p>
          </div>
        </article>
      )}

      <article className={`${styles.constructorElement}`}>
        {bun ? (
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        ) : (
          <div className={bottomBunClass}>
            <p className="text text_type_main-default text_color_inactive">
              Выберите булку
            </p>
          </div>
        )}
      </article>

      <footer className={`${styles.total} pt-10`}>
        <div className={`${styles.price} mr-10`}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={handleOrderClick}
          disabled={!bun || saucesAndMains.length === 0}
        >
          Оформить заказ
        </Button>
      </footer>

      {/* <div className={styles.orderSection}>
        <div className={styles.total}>
          <p className="text text_type_digits-medium">{totalPrice}</p>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={handleOrderClick}
          disabled={loading}
        >
          {loading ? "Оформляем заказ..." : "Оформить заказ"}
        </Button>
      </div> */}
    </section>
  );
};

BurgerConstructor.propTypes = {
  onOrderClick: PropTypes.func.isRequired,
};

export default BurgerConstructor;
