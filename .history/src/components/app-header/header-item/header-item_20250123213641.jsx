import React from "react";
import styles from "./header-item.module.scss";

export default function HeaderItem({
  id,
  nameItem,
  IconComponent,
  isActive,
  onClick,
}) {
  return (
    <div className={styles.item} onClick={onClick}>
      <IconComponent type={isActive ? "primary" : "secondary"} />
      <div
        className={`text text_type_main-default ml-2 ${
          isActive ? styles.primary : styles.secondary
        }`}
      >
        {nameItem}
      </div>
    </div>
  );
}
