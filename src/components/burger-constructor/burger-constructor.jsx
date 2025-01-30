import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./burger-constructor.module.scss";
import {
  ConstructorElement,
  CurrencyIcon,
  Button,
} from "@ya.praktikum/react-developer-burger-ui-components";
import IngredientItem from "./ingredient-item/ingredient-item";
import { IngredientType } from "../../utils/types";

const BurgerConstructor = ({ ingredients, onOrderClick }) => {
  const getIngredientsByType = (ingredients, type) =>
    ingredients.filter((item) => item.type === type);

  const buns = getIngredientsByType(ingredients, "bun");
  const sauces = getIngredientsByType(ingredients, "sauce");
  const mains = getIngredientsByType(ingredients, "main");

  const topBun = buns[0];
  const bottomBun = buns[0];

  const totalPrice = ingredients.reduce((acc, item) => acc + item.price, 0);

  return (
    <section className={`pl-4 pr-4 ${styles.burgerConstructor}`}>
      <article className={`ml-7 ${styles.constructorElement}`}>
        <ConstructorElement
          type="top"
          isLocked={true}
          text={`${topBun.name} (верх)`}
          price={topBun.price}
          thumbnail={topBun.image}
        />
      </article>
      <ul className={`${styles.resizingList} custom-scroll`}>
        {[...sauces, ...mains].map((item) => (
          <IngredientItem key={item._id} item={item} />
        ))}
      </ul>
      <article className={`ml-7 ${styles.constructorElement}`}>
        <ConstructorElement
          type="bottom"
          isLocked={true}
          text={`${bottomBun.name} (низ)`}
          price={bottomBun.price}
          thumbnail={bottomBun.image}
        />
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
        >
          Нажми на меня
        </Button>
      </footer>
    </section>
  );
};

BurgerConstructor.propTypes = {
  ingredients: PropTypes.arrayOf(IngredientType).isRequired,
};

export default BurgerConstructor;
