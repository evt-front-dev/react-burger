import React, { useState } from "react";
import PropTypes from "prop-types";
import style from "./burger-ingredients.module.scss";
import IngredientList from "./ingredient-list/ingredient-list";
import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";
import { IngredientType } from "../../utils/types";

const BurgerIngredients = ({ ingredients, onIngredientClick }) => {
  const [current, setCurrent] = useState("buns");

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
    <>
      <section className={style.container}>
        <p className="text text_type_main-large pt-10 mb-5">Соберите бургер</p>
        <nav className={`mb-10 ${style.tabs}`}>
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
        </nav>
        <section
          className={`ingredient-section custom-scroll ${style.section}`}
        >
          {tabs.map((tab) => (
            <div key={tab.id} id={tab.id} className={style.category}>
              <p className="text text_type_main-medium">{tab.name}</p>
              <IngredientList
                ingredients={categoryIngredients[tab.id]}
                onIngredientClick={onIngredientClick}
              />
            </div>
          ))}
        </section>
      </section>
    </>
  );
};

BurgerIngredients.propTypes = {
  ingredients: PropTypes.arrayOf(IngredientType).isRequired,
};

export default BurgerIngredients;
