import React from "react";
import ingredient from "./ingredient-list.module.scss";
import {
  Counter,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";

function IngredientList({ ingredients }) {
  return (
    <div className={`pl-4 pr-4 pb-10 pt-6 ${ingredient.group}`}>
      {ingredients.map((item) => (
        <div className={ingredient.block} key={item._id}>
          <img className="mb-1" src={item.image} alt={item.name} />
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="text text_type_digits-default">{item.price}</span>
            <CurrencyIcon className="ml-2" />
          </div>
          <span
            style={{ height: "48px" }}
            className="text text_type_main-default"
          >
            {item.name}
          </span>
          <Counter count={1} size="default" extraClass="m-1" />
        </div>
      ))}
    </div>
  );
}

export default IngredientList;
