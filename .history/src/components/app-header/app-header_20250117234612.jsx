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
      <div>item</div>
    </>
  );
};

const AppHeader = () => {
  return (
    <div className="AppHeader">
      AppHeader component
      <p className="text text_type_main-default">
        The quick brown fox jumps over the lazy dog.
      </p>
    </div>
  );
};

export default AppHeader;
