import React from "react";
import PropTypes from "prop-types";
import style from "./ingredient-list.module.scss";
import {
  Counter,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { IngredientType } from "../../../utils/types";
import { useDrag } from "react-dnd";
import { DND_TYPES } from "../../../utils/constants";

const IngredientItem = ({ item, onIngredientClick }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: DND_TYPES.INGREDIENT,
    item: () => item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      className={`${style.block} ${isDragging ? style.dragging : ""}`}
      onClick={() => onIngredientClick(item)}
    >
      <img className="mb-1" src={item.image} alt={item.name} />
      <div className={`mb-1 ${style.price}`}>
        <span className="text text_type_digits-default">{item.price}</span>
        <CurrencyIcon className="ml-2" />
      </div>
      <span className={`text text_type_main-default ${style.name}`}>
        {item.name}
      </span>
      {item.count > 0 && (
        <Counter count={item.count} size="default" extraClass="m-1" />
      )}
    </div>
  );
};

const IngredientList = ({ ingredients, onIngredientClick }) => {
  return (
    <div className={`pl-4 pr-4 pb-10 pt-6 ${style.group}`}>
      {ingredients.map((item) => (
        <IngredientItem
          key={item._id}
          item={item}
          onIngredientClick={onIngredientClick}
        />
      ))}
    </div>
  );
};

IngredientItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["bun", "sauce", "main"]).isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  }).isRequired,
  onIngredientClick: PropTypes.func.isRequired,
};

IngredientList.propTypes = {
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["bun", "sauce", "main"]).isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  onIngredientClick: PropTypes.func.isRequired,
};

export default IngredientList;
