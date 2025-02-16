import React, { useState, useRef } from "react";
import {
  EmailInput,
  PasswordInput,
  Input,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./profile.module.scss";

const Profile = () => {
  const [name, setName] = React.useState("Марк");
  const [email, setEmail] = React.useState("mail@stellar.burgers");
  const [password, setPassword] = React.useState("******");
  const inputRef = useRef(null);

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <ul>
          <li className={styles.active}>Профиль</li>
          <li>История заказов</li>
          <li>Выход</li>
        </ul>
      </nav>

      <div className={styles.content}>
        <div className={styles.input}>
          <Input
            type={"text"}
            placeholder={"Имя"}
            onChange={(e) => setName(e.target.value)}
            icon={"EditIcon"}
            value={name}
            name={"name"}
            ref={inputRef}
            required
          />
        </div>

        <div className={styles.input}>
          <EmailInput
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name={"email"}
            placeholder={"Логин"}
            isIcon={true}
            required
          />
        </div>

        <div className={styles.input}>
          <PasswordInput
            onChange={(e) => setPassword(e.target.value)}
            placeholder={"Пароль"}
            value={password}
            name={"password"}
            icon={"EditIcon"}
            required
          />
        </div>

        <p className={styles.hint}>
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </div>
    </div>
  );
};

export default Profile;
