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
  const [activeId, setActiveId] = useState(1);
  const menuItems = [
    { id: "constructor", name: "Конструктор", icon: BurgerIcon },
    { id: "orders", name: "Лента заказов", icon: ListIcon },
    { id: "profile", name: "Личный кабинет", icon: ProfileIcon },
  ];

  return (
    <header className={styles.header}>
      {menuItems.map((item) => (
        <HeaderItem
          key={item.id}
          nameItem={item.name}
          IconComponent={item.icon}
          isActive={activeId === item.id}
          onClick={() => setActiveId(item.id)}
        />
      ))}
      <div className={styles.logo}>
        <Logo />
      </div>
    </header>
  );
};

export default AppHeader;
