import React from "react";
import PropTypes from "prop-types";
import style from "./ingredient-details.module.scss";
import Structure from "./structure/structure";

const IngredientDetails = ({ ingredient }) => {
  const { calories, proteins, fat, carbohydrates } = ingredient;

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
        <Structure label="Калории,ккал" value={calories} />
        <Structure label="Белки, г" value={proteins} />
        <Structure label="Жиры, г" value={fat} />
        <Structure label="Углеводы, г" value={carbohydrates} />
      </div>
    </div>
  );
};

IngredientDetails.propTypes = {
  ingredient: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    calories: PropTypes.number.isRequired,
    proteins: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    carbohydrates: PropTypes.number.isRequired,
  }).isRequired,
};

export default IngredientDetails;
