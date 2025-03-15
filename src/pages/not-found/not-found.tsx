import React from "react";
import { Link } from "react-router-dom";
import styles from "./not-found.module.scss";

const NotFound404: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className="text text_type_main-large mb-10">404</h1>
        <p className="text text_type_main-medium mb-15">Страница не найдена</p>
        <Link to="/" className={`${styles.link} text text_type_main-default`}>
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default NotFound404;
