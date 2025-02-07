import React from "react";
import PropTypes from "prop-types";
import styles from "./burger-constructor.module.scss";
import {
  ConstructorElement,
  Button,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import IngredientItem from "./ingredient-item/ingredient-item";
import { useSelector } from "react-redux";

const BurgerConstructor = ({ onOrderClick }) => {
  const ingredients = useSelector(
    (state) => state.constructor.ingredients || []
  );

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

  return (
    <section className={`pl-4 pr-4 ${styles.burgerConstructor}`}>
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
          <div className={`${styles.placeholder} ${styles.placeholderTop}`}>
            <p className="text text_type_main-default text_color_inactive">
              Выберите булку
            </p>
          </div>
        )}
      </article>

      {saucesAndMains.length > 0 ? (
        <ul className={`${styles.resizingList} custom-scroll`}>
          {saucesAndMains.map((item, index) => (
            <IngredientItem key={`${item._id}-${index}`} item={item} />
          ))}
        </ul>
      ) : (
        <article className={`${styles.constructorElement}`}>
          <div className={`${styles.placeholder} ${styles.placeholderMiddle}`}>
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
          <div className={`${styles.placeholder} ${styles.placeholderBottom}`}>
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
          onClick={onOrderClick}
          disabled={!bun || saucesAndMains.length === 0}
        >
          Оформить заказ
        </Button>
      </footer>
    </section>
  );
};

BurgerConstructor.propTypes = {
  onOrderClick: PropTypes.func.isRequired,
};

export default BurgerConstructor;
