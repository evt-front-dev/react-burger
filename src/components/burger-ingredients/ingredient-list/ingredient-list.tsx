import React from "react";
import style from "./ingredient-list.module.scss";
import {
  Counter,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useDrag } from "react-dnd";
import { DND_TYPES } from "utils/constants";
import { Ingredient } from "services/ingredientsSlice";

interface IngredientListProps {
  ingredients: Ingredient[];
  onIngredientClick: (ingredient: Ingredient) => void;
}

const IngredientList: React.FC<IngredientListProps> = ({
  ingredients,
  onIngredientClick,
}) => {
  return (
    <div
      className={`pl-4 pr-4 pb-10 pt-6 ${style.group}`}
      data-testid="ingredients-group"
    >
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

interface IngredientItemProps {
  item: Ingredient;
  onIngredientClick: (ingredient: Ingredient) => void;
}

const IngredientItem: React.FC<IngredientItemProps> = ({
  item,
  onIngredientClick,
}) => {
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
      data-testid="ingredient-item"
    >
      <img className="mb-1" src={item.image} alt={item.name} />
      <div className={`mb-1 ${style.price}`}>
        <span className="text text_type_digits-default">{item.price}</span>
        <CurrencyIcon type="primary" className="ml-2" />
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

export default IngredientList;
