import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./app-header.module.scss";
import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import HeaderItem from "./header-item/header-item";

type MenuItem = {
  id: string;
  name: string;
  icon: any;
};

const AppHeader: React.FC = () => {
  const location = useLocation();
  const [activeId, setActiveId] = useState<string>("constructor");

  useEffect(() => {
    const inactiveRoutes = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
    ];

    if (inactiveRoutes.includes(location.pathname)) {
      setActiveId("");
    } else if (location.pathname === "/") {
      setActiveId("constructor");
    } else if (location.pathname.startsWith("/profile")) {
      setActiveId("profile");
    } else if (location.pathname === "/feed") {
      setActiveId("orders");
    }
  }, [location]);

  const menuItems: MenuItem[] = [
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
