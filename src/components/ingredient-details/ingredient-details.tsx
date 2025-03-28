import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import style from "./ingredient-details.module.scss";
import Structure from "./structure/structure";
import { Ingredient } from "services/ingredientsSlice";
import { RootState } from "services/store";

interface IngredientDetailsProps {
  ingredient?: Ingredient;
}

const IngredientDetails: React.FC<IngredientDetailsProps> = ({
  ingredient: propIngredient,
}) => {
  const { id } = useParams<{ id: string }>();
  const { list: ingredients } = useSelector<RootState, { list: Ingredient[] }>(
    (state) => state.ingredients
  );
  const ingredient =
    propIngredient || ingredients?.find((item) => item._id === id);

  if (!ingredient) return null;

  return (
    <div className={style.details}>
      <img
        src={ingredient.image_large}
        alt={ingredient.name}
        className="mb-4"
      />
      <p className={`text text_type_main-medium mb-8 ${style.name}`}>
        {ingredient.name}
      </p>
      <div className={style.structure}>
        <Structure label="Калории,ккал" value={ingredient.calories} />
        <Structure label="Белки, г" value={ingredient.proteins} />
        <Structure label="Жиры, г" value={ingredient.fat} />
        <Structure label="Углеводы, г" value={ingredient.carbohydrates} />
      </div>
    </div>
  );
};

export default IngredientDetails;
