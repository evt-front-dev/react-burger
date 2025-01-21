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
      <div className="text text_type_main-default">item</div>
    </>
  );
};

const AppHeader = () => {
  return (
    <div className="AppHeader">
      AppHeader component
      <p>The quick brown fox jumps over the lazy dog.</p>
      <HeaderItem />
    </div>
  );
};

export default AppHeader;
