import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearAuthError } from "../../services/auth/authSlice";
import styles from "../../common/form.module.scss";
import {
  Button,
  EmailInput,
  PasswordInput,
} from "@ya.praktikum/react-developer-burger-ui-components";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(form)).unwrap();
      navigate("/");
    } catch (err) {}
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
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
        {error && (
          <p className="text text_type_main-default text_color_error mb-4">
            {error}
          </p>
        )}
        <Button
          type="primary"
          size="medium"
          htmlType="submit"
          disabled={loading}
        >
          {loading ? "Вход..." : "Войти"}
        </Button>
      </form>
      <div className={styles.links}>
        <div className={styles.link}>
          <p className="text text_type_main-default text_color_inactive">
            Вы — новый пользователь?
          </p>
          <span className={styles.link} onClick={() => navigate("/register")}>
            Зарегистрироваться
          </span>
        </div>

        <div className={styles.link}>
          <p className="text text_type_main-default text_color_inactive">
            Забыли пароль?
          </p>
          <span
            className={styles.link}
            onClick={() => navigate("/forgot-password")}
          >
            Восстановить пароль
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
