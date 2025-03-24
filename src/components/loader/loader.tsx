import React from "react";
import styles from "./loader.module.scss";

const Loader: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <p className="text text_type_main-medium">Загрузка...</p>
    </div>
  );
};

export default Loader;
