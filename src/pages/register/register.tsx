import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "services/auth/authSlice";
import styles from "common/form.module.scss";
import {
  Button,
  EmailInput,
  PasswordInput,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { AppDispatch, RootState } from "store/store";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  loading: boolean;
  error: string | null;
  user: any;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector<RootState, AuthState>(
    (state) => state.auth
  );

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
  });

  const isFormValid = form.email && form.password && form.name;

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      dispatch(register(form));
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium">Регистрация</h1>
        <Input
          type="text"
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Имя"
          size="default"
          error={false}
          autoComplete="name"
        />
        <EmailInput
          name="email"
          value={form.email}
          onChange={onChange}
          required
          autoComplete="email"
        />
        <PasswordInput
          name="password"
          value={form.password}
          onChange={onChange}
          required
          autoComplete="new-password"
        />
        <Button
          type="primary"
          size="medium"
          htmlType="submit"
          disabled={loading || !isFormValid}
        >
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
        {error && (
          <p className="text text_type_main-default text_color_error">
            {error}
          </p>
        )}
      </form>
      <div className={styles.links}>
        <div className={styles.link}>
          <p className="text text_type_main-default text_color_inactive">
            Уже зарегистрированы?
          </p>
          <span className={styles.link} onClick={() => navigate("/login")}>
            Войти
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
