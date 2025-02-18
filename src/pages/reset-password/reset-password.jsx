import React, { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const emailSent = localStorage.getItem("passwordResetEmailSent");
    if (!emailSent) {
      navigate("/forgot-password");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://norma.nomoreparties.space/api/password-reset/reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem("passwordResetEmailSent");
        navigate("/login");
      } else {
        setError(data.message || "Произошла ошибка");
      }
    } catch (err) {
      setError("Произошла ошибка при отправке запроса");
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
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
        {error && (
          <p className="text text_type_main-default text_color_error">
            {error}
          </p>
        )}
        <Button
          htmlType="submit"
          type="primary"
          size="medium"
          disabled={isLoading}
        >
          {isLoading ? "Сохранение..." : "Сохранить"}
        </Button>
      </form>
      <div className={styles.links}>
        <div className={styles.link}>
          <p className="text text_type_main-default text_color_inactive">
            Вспомнили пароль?
          </p>
          <span className={styles.link} onClick={() => navigate("/login")}>
            Войти
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
