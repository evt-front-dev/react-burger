import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../services/auth/authSlice";
import styles from "../../common/form.module.scss";
import {
  Button,
  EmailInput,
  PasswordInput,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
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

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
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
          placeholder="Имя"
          name="name"
          value={form.name}
          onChange={onChange}
          required
        />
        <EmailInput
          name="email"
          value={form.email}
          onChange={onChange}
          required
        />
        <PasswordInput
          name="password"
          value={form.password}
          onChange={onChange}
          required
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
