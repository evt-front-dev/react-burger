import React from "react";
import styles from "./app-header.module.css";
import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";

const HeaderItem = ({ props, IconHeader }) => {
  return (
    <div>
      <IconHeader />
      <div className="text text_type_main-default">{props.nameItem}</div>
    </div>
  );
};

const AppHeader = () => {
  return (
    <div className={styles.header}>
      <HeaderItem nameItem="Конструктор" IconHeader={Logo} />
      <HeaderItem nameItem="Лента заказов" />
      <HeaderItem nameItem="Личный кабинет" />
    </div>
  );
};

export default AppHeader;
