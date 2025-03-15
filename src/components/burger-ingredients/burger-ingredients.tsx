import React, { useState, useRef, useEffect } from "react";
import style from "./burger-ingredients.module.scss";
import IngredientList from "./ingredient-list/ingredient-list";
import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";
import { Ingredient } from "services/ingredientsSlice";
import { useDispatch } from "react-redux";

interface BurgerIngredientsProps {
  ingredients: Ingredient[];
  onIngredientClick: (ingredient: Ingredient) => void;
}

interface TabItem {
  id: "buns" | "sauces" | "main";
  name: string;
}

const BurgerIngredients: React.FC<BurgerIngredientsProps> = ({
  ingredients,
  onIngredientClick,
}) => {
  const [current, setCurrent] = useState<"buns" | "sauces" | "main">("buns");
  const containerRef = useRef<HTMLElement>(null);
  const dispatch = useDispatch();

  const tabs: TabItem[] = [
    { id: "buns", name: "Булки" },
    { id: "sauces", name: "Соусы" },
    { id: "main", name: "Начинка" },
  ];

  const categoryIngredients = {
    buns: ingredients.filter((item) => item.type === "bun"),
    sauces: ingredients.filter((item) => item.type === "sauce"),
    main: ingredients.filter((item) => item.type === "main"),
  };

  const handleScroll = () => {
    if (!containerRef.current) return;

    const containerTop = containerRef.current.getBoundingClientRect().top;
    const distances = tabs.map((tab) => {
      const element = document.getElementById(tab.id);
      if (!element) return Infinity;
      return Math.abs(element.getBoundingClientRect().top - containerTop);
    });

    const closestTab = tabs[distances.indexOf(Math.min(...distances))];
    setCurrent(closestTab.id);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleIngredientClick = (ingredient: Ingredient) => {
    onIngredientClick(ingredient);
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
          ref={containerRef}
          className={`ingredient-section custom-scroll ${style.section}`}
        >
          {tabs.map((tab) => (
            <div key={tab.id} id={tab.id} className={style.category}>
              <p className="text text_type_main-medium">{tab.name}</p>
              <IngredientList
                ingredients={categoryIngredients[tab.id]}
                onIngredientClick={handleIngredientClick}
              />
            </div>
          ))}
        </section>
      </section>
    </>
  );
};

export default BurgerIngredients;
