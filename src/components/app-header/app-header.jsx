import React, { useState } from "react";
import styles from "./app-header.module.scss";
import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import HeaderItem from "./header-item/header-item";

const AppHeader = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const menuItems = [
    { name: "Конструктор", icon: BurgerIcon },
    { name: "Лента заказов", icon: ListIcon },
    { name: "Личный кабинет", icon: ProfileIcon },
  ];

  return (
    <div className={styles.header}>
      {menuItems.map((item, index) => (
        <HeaderItem
          key={index}
          nameItem={item.name}
          IconComponent={item.icon}
          isActive={activeIndex === index}
          toggleActiveState={() => setActiveIndex(index)}
        />
      ))}
      <Logo className={styles.logo} />
    </div>
  );
};

export default AppHeader;
