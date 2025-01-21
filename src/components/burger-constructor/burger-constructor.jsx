import React from "react";
import styles from "./burger-constructor.module.scss";
import { ConstructorElement, DragIcon, CurrencyIcon, Button } from "@ya.praktikum/react-developer-burger-ui-components";
import { ingredients } from "../../utils/data";

const BurgerConstructor = () => {
  const buns = ingredients.filter((item) => item.type === "bun");
  const sauces = ingredients.filter((item) => item.type === "sauce");
  const mains = ingredients.filter((item) => item.type === "main");

  const topBun = buns[0];
  const bottomBun = buns[0];

  const totalPrice = ingredients.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className={`pl-4 pr-4 ${styles.burgerConstructor}`}>
      <div className={`${styles.constructorElement}`}>
        <ConstructorElement type="top" isLocked={true} text={`${topBun.name} (верх)`} price={topBun.price} thumbnail={topBun.image} />
      </div>
      <div className={`${styles.scrollableList} custom-scroll`}>
        {[...sauces, ...mains].map((item) => (
          <div key={item._id}>
            <DragIcon type="primary" />
            <ConstructorElement text={item.name} price={item.price} thumbnail={item.image} />
          </div>
        ))}
      </div>
      <div className={`${styles.constructorElement}`}>
        <ConstructorElement type="bottom" isLocked={true} text={`${bottomBun.name} (низ)`} price={bottomBun.price} thumbnail={bottomBun.image} />
      </div>
      <div className={`${styles.total} pt-10`}>
        <div className={`${styles.price} mr-10`}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button htmlType="button" type="primary" size="large">
          Нажми на меня
        </Button>
      </div>
    </div>
  );
};

export default BurgerConstructor;
