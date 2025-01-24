import React from "react";
import style from "./ingredient-list.module.scss";
import {
  Counter,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";

function IngredientList({ ingredients }) {
  return (
    <div className={`pl-4 pr-4 pb-10 pt-6 ${style.group}`}>
      {ingredients.map((item) => (
        <div className={style.block} key={item._id}>
          <img className="mb-1" src={item.image} alt={item.name} />
          <div className={`mb-1 ${style.price}`}>
            <span className="text text_type_digits-default">{item.price}</span>
            <CurrencyIcon className="ml-2" />
          </div>
          <span className={`text text_type_main-default ${style.name}`}>
            {item.name}
          </span>
          <Counter count={1} size="default" extraClass="m-1" />
        </div>
      ))}
    </div>
  );
}

export default IngredientList;
