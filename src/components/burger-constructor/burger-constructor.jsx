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
import { selectBuns, selectSaucesAndMains } from "../../services/selectors";

const BurgerConstructor = ({ onOrderClick }) => {
  const buns = useSelector(selectBuns);
  const saucesAndMains = useSelector(selectSaucesAndMains);

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
      {bun && (
        <article className={`ml-7 ${styles.constructorElement}`}>
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </article>
      )}
      <ul className={`${styles.resizingList} custom-scroll`}>
        {saucesAndMains.map((item, index) => (
          <IngredientItem key={`${item._id}-${index}`} item={item} />
        ))}
      </ul>
      {bun && (
        <article className={`ml-7 ${styles.constructorElement}`}>
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </article>
      )}
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
