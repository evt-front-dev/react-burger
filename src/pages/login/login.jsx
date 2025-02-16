import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common/form.module.scss";
import {
  Button,
  EmailInput,
  PasswordInput,
} from "@ya.praktikum/react-developer-burger-ui-components";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h1 className="text text_type_main-medium">Вход</h1>
        <EmailInput
          placeholder="E-mail"
          name="email"
          value={form.email}
          onChange={onChange}
          isIcon={false}
        />
        <PasswordInput
          placeholder="Пароль"
          name="password"
          value={form.password}
          onChange={onChange}
        />
        <Button htmlType="submit" type="primary" size="medium">
          Войти
        </Button>
      </form>
      <div className={styles.links}>
        <p className="text text_type_main-default text_color_inactive">
          Вы — новый пользователь?{" "}
          <span className={styles.link} onClick={() => navigate("/register")}>
            Зарегистрироваться
          </span>
        </p>
        <p className="text text_type_main-default text_color_inactive">
          Забыли пароль?{" "}
          <span
            className={styles.link}
            onClick={() => navigate("/forgot-password")}
          >
            Восстановить пароль
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
