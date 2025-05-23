import React from "react";
import { useParams } from "react-router-dom";
import IngredientDetails from "components/ingredient-details/ingredient-details";
import styles from "./ingredient.module.scss";
import { Ingredient } from "services/ingredientsSlice";
import { RootState } from "store/store";
import { useAppSelector } from "hooks/redux";

interface IngredientsState {
  list: Ingredient[];
}

const IngredientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { list: ingredients } = useAppSelector((state) => state.ingredients);
  const ingredient = ingredients.find((item) => item._id === id);

  if (!ingredient) {
    return <div>Ингредиент не найден</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-large">Детали ингредиента</h1>
      <IngredientDetails ingredient={ingredient} />
    </div>
  );
};

export default IngredientPage;
