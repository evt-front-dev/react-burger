import React from "react";
import styles from "./ingredient-item.module.scss";
import PropTypes from "prop-types";
import {
  ConstructorElement,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";

const IngredientItem = ({ item }) => (
  <li className={`${styles.resizingListItem}`}>
    <DragIcon className="mr-2" type="primary" />
    <ConstructorElement
      text={item.name}
      price={item.price}
      thumbnail={item.image}
    />
  </li>
);

IngredientItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default IngredientItem;
