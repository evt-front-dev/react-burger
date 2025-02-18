import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../common/form.module.scss";
import {
  Button,
  EmailInput,
} from "@ya.praktikum/react-developer-burger-ui-components";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://norma.nomoreparties.space/api/password-reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("passwordResetEmailSent", "true");
        navigate("/reset-password");
      } else {
        setError(data.message || "Произошла ошибка");
      }
    } catch (err) {
      setError("Произошла ошибка при отправке запроса");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium">Восстановление пароля</h1>
        <EmailInput
          placeholder="Укажите e-mail"
          name="email"
          isIcon={false}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {isLoading ? "Отправка..." : "Восстановить"}
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

export default ForgotPasswordPage;
