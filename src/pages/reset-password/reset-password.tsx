import React, { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "common/form.module.scss";
import {
  Button,
  PasswordInput,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";

interface ResetPasswordForm {
  password: string;
  token: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<ResetPasswordForm>({
    password: "",
    token: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const emailSent = localStorage.getItem("passwordResetEmailSent");
    if (!emailSent) {
      navigate("/forgot-password");
    }
  }, [navigate]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("forgotPasswordVisited");
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.password.trim() || !form.token.trim()) {
      setError("Заполните все поля");
      return;
    }

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

      const data: ResetPasswordResponse = await response.json();

      if (data.success) {
        localStorage.removeItem("passwordResetEmailSent");
        localStorage.removeItem("resetEmail");
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
