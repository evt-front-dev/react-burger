import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import style from "./ingredient-details.module.scss";
import Structure from "./structure/structure";

const IngredientDetails = ({ ingredient: propIngredient }) => {
  const { id } = useParams();
  const { list: ingredients } = useSelector((state) => state.ingredients);
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

IngredientDetails.propTypes = {
  ingredient: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image_large: PropTypes.string.isRequired,
    calories: PropTypes.number.isRequired,
    proteins: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    carbohydrates: PropTypes.number.isRequired,
  }),
};

export default IngredientDetails;
