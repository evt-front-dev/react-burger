import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  EmailInput,
  PasswordInput,
  Input,
  Button,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { updateUser, logout } from "../../services/auth/authSlice";
import styles from "./profile.module.scss";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsModified(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = {};

    if (form.name !== user.name) updateData.name = form.name;
    if (form.email !== user.email) updateData.email = form.email;
    if (form.password) updateData.password = form.password;

    if (Object.keys(updateData).length > 0) {
      await dispatch(updateUser(updateData));
      setIsModified(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: user.name,
      email: user.email,
      password: "",
    });
    setIsModified(false);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (err) {
      console.error("Ошибка при выходе:", err);
    }
  };

  return (
    <div className={styles.container}>
      <nav className={`text text_type_main-medium ${styles.nav}`}>
        <ul>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
              end
            >
              Профиль
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile/orders"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              История заказов
            </NavLink>
          </li>
          <li>
            <button
              className={`${styles.link} text text_type_main-medium`}
              onClick={handleLogout}
            >
              Выход
            </button>
          </li>
        </ul>
        <p className={`text text_type_main-default ${styles.hint}`}>
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </nav>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="text"
            placeholder="Имя"
            name="name"
            value={form.name}
            onChange={handleChange}
            icon="EditIcon"
          />
          <EmailInput
            placeholder="E-mail"
            name="email"
            value={form.email}
            onChange={handleChange}
            isIcon={true}
          />
          <PasswordInput
            placeholder="Пароль"
            name="password"
            value={form.password}
            onChange={handleChange}
            icon="EditIcon"
          />
          {error && (
            <p className="text text_type_main-default text_color_error">
              {error}
            </p>
          )}
          {isModified && (
            <div className={styles.buttons}>
              <Button
                type="secondary"
                size="medium"
                onClick={handleCancel}
                htmlType="button"
              >
                Отмена
              </Button>
              <Button
                type="primary"
                size="medium"
                htmlType="submit"
                disabled={loading}
              >
                {loading ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
