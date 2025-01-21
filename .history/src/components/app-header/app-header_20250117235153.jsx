import React from "react";
import styles from "./app-header.module.css";
import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";

const HeaderItem = (props) => {
  return (
    <>
      <img src={props.src} alt={props.alt} className={styles.icon} />
      <div className="text text_type_main-default">{props.nameItem}</div>
    </>
  );
};

const AppHeader = () => {
  return (
    <div className={styles.header}>
      <HeaderItem nameItem="1" />
      <HeaderItem nameItem="2" />
      <HeaderItem nameItem="3" />
    </div>
  );
};

export default AppHeader;
