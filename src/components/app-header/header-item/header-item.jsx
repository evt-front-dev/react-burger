import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./header-item.module.scss";
import PropTypes from "prop-types";

const HeaderItem = ({ nameItem, IconComponent, isActive, onClick }) => {
  const getPath = () => {
    switch (nameItem) {
      case "Личный кабинет":
        return "/profile";
      case "Конструктор":
        return "/";
      case "Лента заказов":
        return "/feed";
      default:
        return "/";
    }
  };

  return (
    <NavLink to={getPath()} className={styles.item} onClick={onClick}>
      <IconComponent type={isActive ? "primary" : "secondary"} />
      <div
        className={`text text_type_main-default ml-2 ${
          isActive ? styles.primary : styles.secondary
        }`}
      >
        {nameItem}
      </div>
    </NavLink>
  );
};

HeaderItem.propTypes = {
  nameItem: PropTypes.string.isRequired,
  IconComponent: PropTypes.elementType.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default HeaderItem;
