import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common/form.module.scss";
import {
  Button,
  EmailInput,
  PasswordInput,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h1 className="text text_type_main-medium">Регистрация</h1>
        <Input
          type="text"
          placeholder="Имя"
          name="name"
          value={form.name}
          onChange={onChange}
        />
        <EmailInput
          placeholder="E-mail"
          name="email"
          isIcon={false}
          value={form.email}
          onChange={onChange}
        />
        <PasswordInput
          placeholder="Пароль"
          name="password"
          value={form.password}
          onChange={onChange}
        />
        <Button htmlType="submit" type="primary" size="medium">
          Зарегистрироваться
        </Button>
      </form>
      <div className={styles.links}>
        <p className="text text_type_main-default text_color_inactive">
          Уже зарегистрированы?{" "}
          <span className={styles.link} onClick={() => navigate("/login")}>
            Войти
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
