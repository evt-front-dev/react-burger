import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common/form.module.scss";
import {
  Button,
  PasswordInput,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    password: "",
    token: "",
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h1 className="text text_type_main-medium">Восстановление пароля</h1>
        <PasswordInput
          placeholder="Введите новый пароль"
          name="password"
          value={form.password}
          onChange={onChange}
        />
        <Input
          type="text"
          placeholder="Введите код из письма"
          name="token"
          value={form.token}
          onChange={onChange}
        />
        <Button htmlType="submit" type="primary" size="medium">
          Сохранить
        </Button>
      </form>
      <div className={styles.links}>
        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?{" "}
          <span className={styles.link} onClick={() => navigate("/login")}>
            Войти
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
