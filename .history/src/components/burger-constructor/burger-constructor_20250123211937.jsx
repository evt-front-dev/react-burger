import React from "react";
import styles from "./burger-constructor.module.scss";
import {
  ConstructorElement,
  DragIcon,
  CurrencyIcon,
  Button,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { ingredients } from "../../utils/data";

const BurgerConstructor = () => {
  const buns = ingredients.filter((item) => item.type === "bun");
  const sauces = ingredients.filter((item) => item.type === "sauce");
  const mains = ingredients.filter((item) => item.type === "main");

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
          <li key={item._id} className={`${styles.resizingListItem}`}>
            <DragIcon className="mr-2" type="primary" />
            <ConstructorElement
              text={item.name}
              price={item.price}
              thumbnail={item.image}
            />
          </li>
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
      <footer className={`${styles.total} pt-10 pr-4`}>
        <div className={`${styles.price} mr-10`}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button htmlType="button" type="primary" size="large">
          Нажми на меня
        </Button>
      </footer>
    </section>
  );
};

export default BurgerConstructor;
