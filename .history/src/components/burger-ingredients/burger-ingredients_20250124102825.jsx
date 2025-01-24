import React, { useState } from "react";
import style from "./burger-ingredients.module.scss";
import IngredientList from "./ingredient-list/ingredient-list";
import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";
import { ingredients } from "../../utils/data";

function BurgerIngredients() {
  const [current, setCurrent] = React.useState("one");

  const buns = ingredients.filter((item) => item.type === "bun");
  const sauces = ingredients.filter((item) => item.type === "sauce");
  const main = ingredients.filter((item) => item.type === "main");

  return (
    <div style={{ textAlign: "left", width: "calc(50% - 20px)" }}>
      <p className="text text_type_main-large pt-10 mb-5">Соберите бургер</p>
      <div className="mb-10" style={{ display: "flex" }}>
        <Tab
          value="one"
          active={current === "one"}
          onClick={() => setCurrent("one")}
        >
          Булки
        </Tab>
        <Tab
          value="two"
          active={current === "two"}
          onClick={() => setCurrent("two")}
        >
          Соусы
        </Tab>
        <Tab
          value="three"
          active={current === "three"}
          onClick={() => setCurrent("three")}
        >
          Начинка
        </Tab>
      </div>
      <section className={`ingredient-section custom-scroll ${style.section}`}>
        <p className="text text_type_main-medium">Булки</p>
        <IngredientList ingredients={buns} />
        <p className="text text_type_main-medium">Соусы</p>
        <IngredientList ingredients={sauces} />
        <p className="text text_type_main-medium">Начинка</p>
        <IngredientList ingredients={main} />
      </section>
    </div>
  );
}

export default BurgerIngredients;
