import React, { useState } from "react";
import style from "./burger-ingredients.module.scss";
import IngredientList from "./ingredient-list/ingredient-list";
import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";
import { ingredients } from "../../utils/data";

function BurgerIngredients() {
  const [current, setCurrent] = React.useState("one");

  const tabs = [
    { id: "buns", name: "Булки" },
    { id: "sauces", name: "Соусы" },
    { id: "main", name: "Начинка" },
  ];

  const categoryIngredients = {
    buns: ingredients.filter((item) => item.type === "bun"),
    sauces: ingredients.filter((item) => item.type === "sauce"),
    main: ingredients.filter((item) => item.type === "main"),
  };

  return (
    <main style={{ textAlign: "left", width: "calc(50% - 20px)" }}>
      <p className="text text_type_main-large pt-10 mb-5">Соберите бургер</p>
      <div className="mb-10" style={{ display: "flex" }}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            value={tab.id}
            active={current === tab.id}
            onClick={() => setCurrent(tab.id)}
          >
            {tab.name}
          </Tab>
        ))}
      </div>
      <section className={`ingredient-section custom-scroll ${style.section}`}>
        <p className="text text_type_main-medium">Булки</p>
        <IngredientList ingredients={buns} />
        <p className="text text_type_main-medium">Соусы</p>
        <IngredientList ingredients={sauces} />
        <p className="text text_type_main-medium">Начинка</p>
        <IngredientList ingredients={main} />
      </section>
    </main>
  );
}

export default BurgerIngredients;
