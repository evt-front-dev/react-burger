import React from "react";
import styles from "./app-header.module.css";
import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";

const HeaderItem = ({ nameItem, IconComponent }) => {
  return (
    <div className={styles.item}>
      <IconComponent className={styles.icon} />
      <div className="text text_type_main-default">{nameItem}</div>
    </div>
  );
};

const AppHeader = () => {
  return (
    <div className={styles.header}>
      <HeaderItem nameItem="Конструктор" IconComponent={BurgerIcon} />
      <HeaderItem nameItem="Лента заказов" IconComponent={ListIcon} />
      <HeaderItem nameItem="Личный кабинет" IconComponent={ProfileIcon} />
    </div>
  );
};

export default AppHeader;
