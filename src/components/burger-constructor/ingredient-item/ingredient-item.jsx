import React from "react";
import styles from "./ingredient-item.module.scss";
import PropTypes from "prop-types";
import {
  ConstructorElement,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useDispatch } from "react-redux";
import { removeIngredient } from "../../../services/constructorSlice";
import { decrementIngredientCount } from "../../../services/ingredientsSlice";

const IngredientItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(removeIngredient(item.uniqueId));
    dispatch(decrementIngredientCount(item._id));
  };

  return (
    <li className={`${styles.resizingListItem}`}>
      <DragIcon className="mr-2" type="primary" />
      <ConstructorElement
        text={item.name}
        price={item.price}
        thumbnail={item.image}
        handleClose={handleDelete}
      />
    </li>
  );
};

IngredientItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    uniqueId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default IngredientItem;
