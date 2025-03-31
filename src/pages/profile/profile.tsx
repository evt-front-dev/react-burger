import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef,
} from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  EmailInput,
  PasswordInput,
  Input,
  Button,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { updateUser, logout } from "services/auth/authSlice";
import {
  connect,
  disconnect,
  setFeedType,
  forceSetUserOrders,
} from "services/ws/wsSlice";
import { OrderList } from "components/order-list/order-list";
import styles from "./profile.module.scss";
import { RootState } from "store/store";
import { WS_URL } from "utils/constants";
import { getCookie } from "utils/cookie";
import { fetchIngredients, Ingredient } from "services/ingredientsSlice";
import { IWSStoreState, IOrderIngredient } from "types/ws";
import { useAppDispatch, useAppSelector } from "hooks/redux";

interface ProfileForm {
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  user: {
    name: string;
    email: string;
  } | null;
  loading: boolean;
  error: string | null;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

interface IngredientsState {
  list: Ingredient[];
  loading: boolean;
  error: string | null;
}

type TIconTypes =
  | "CurrencyIcon"
  | "BurgerIcon"
  | "LockIcon"
  | "DragIcon"
  | "DeleteIcon"
  | "ArrowUpIcon"
  | "ArrowDownIcon"
  | "MenuIcon"
  | "CloseIcon"
  | "CheckMarkIcon"
  | "ListIcon"
  | "ProfileIcon"
  | "EditIcon";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const { userOrders, wsConnected, feedType, orders, publicOrders } =
    useAppSelector((state) => state.ws);
  const {
    list: ingredients,
    loading: ingredientsLoading,
    error: ingredientsError,
  } = useAppSelector((state) => state.ingredients);

  const ingredientsMap = ingredients.reduce<{
    [key: string]: IOrderIngredient;
  }>((acc, ingredient) => {
    acc[ingredient._id] = ingredient;
    return acc;
  }, {});

  const [form, setForm] = useState<ProfileForm>({
    name: "",
    email: "",
    password: "",
  });
  const [isModified, setIsModified] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const currentPathRef = useRef(location.pathname);
  const isConnectedRef = useRef(false);
  const disconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);
  const forceConnectionAttemptedRef = useRef(false);
  const needToForceUserOrdersRef = useRef(false);

  const accessToken = getCookie("token");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        password: "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (location.pathname === "/profile/orders" && !ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, location.pathname, ingredients.length]);

  useEffect(() => {
    currentPathRef.current = location.pathname;

    const onOrdersPage = location.pathname === "/profile/orders";
    const onOrderDetailsPage = location.pathname.match(
      /^\/profile\/orders\/\d+$/
    );

    if (onOrdersPage) {
      dispatch(setFeedType("user"));

      if (wsConnected && feedType === "user") {
        return;
      }

      if (userOrders && userOrders.length > 0) {
        return;
      }

      if (accessToken && !isConnectedRef.current && !isConnectingRef.current) {
        isConnectingRef.current = true;

        const token = accessToken.startsWith("Bearer ")
          ? accessToken.replace("Bearer ", "")
          : accessToken;

        if (wsConnected) {
          dispatch(disconnect());

          setTimeout(() => {
            dispatch(connect(token));
            isConnectedRef.current = true;

            setTimeout(() => {
              isConnectingRef.current = false;
            }, 2000);
          }, 1000);
        } else {
          dispatch(connect(token));
          isConnectedRef.current = true;

          setTimeout(() => {
            isConnectingRef.current = false;
          }, 2000);
        }
      }
    } else if (onOrderDetailsPage && wsConnected) {
    } else if (
      !onOrdersPage &&
      !onOrderDetailsPage &&
      location.pathname.includes("/profile")
    ) {
    }

    return () => {
      const notOnOrdersPage = !location.pathname.includes("/profile/orders");

      if (isConnectedRef.current && notOnOrdersPage && wsConnected) {
        dispatch(disconnect());
        isConnectedRef.current = false;
      }
    };
  }, [location.pathname, dispatch, accessToken, wsConnected, feedType]);

  useEffect(() => {
    return () => {
      if (disconnectTimeoutRef.current) {
        clearTimeout(disconnectTimeoutRef.current);
        disconnectTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (needToForceUserOrdersRef.current && orders && orders.length > 0) {
      dispatch(forceSetUserOrders(orders));
      needToForceUserOrdersRef.current = false;
    }
  }, [orders, dispatch, needToForceUserOrdersRef.current]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsModified(true);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updateData: UpdateUserData = {};

    if (form.name !== user.name) updateData.name = form.name;
    if (form.email !== user.email) updateData.email = form.email;
    if (form.password) updateData.password = form.password;

    if (Object.keys(updateData).length > 0) {
      await dispatch(updateUser(updateData));
      setIsModified(false);
    }
  };

  const handleCancel = () => {
    if (!user) return;

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

  const renderContent = () => {
    if (location.pathname === "/profile/orders") {
      if (ingredientsLoading) {
        return (
          <div className={styles.loading}>
            <p className="text text_type_main-medium">
              Загрузка ингредиентов...
            </p>
          </div>
        );
      }

      if (ingredientsError) {
        return (
          <div className={styles.error}>
            <p className="text text_type_main-medium">
              Ошибка: {ingredientsError}
            </p>
          </div>
        );
      }

      if (!wsConnected) {
        return (
          <div className={styles.loading}>
            <p className="text text_type_main-medium">
              Проверяем наличие заказов...
            </p>
          </div>
        );
      }

      let ordersToDisplay: typeof orders = [];

      const probablyUserOrders =
        orders && orders.length > 0 && orders.length <= 20;

      if (probablyUserOrders) {
        ordersToDisplay = [...orders];

        if (feedType !== "user") {
          setTimeout(() => {
            dispatch(setFeedType("user"));
          }, 0);
        }
      } else if (orders && orders.length > 0) {
        ordersToDisplay = [...orders];

        if (
          !isConnectingRef.current &&
          location.pathname === "/profile/orders"
        ) {
          setTimeout(() => {
            if (accessToken && !isConnectingRef.current) {
              isConnectingRef.current = true;

              const token = accessToken.startsWith("Bearer ")
                ? accessToken.replace("Bearer ", "")
                : accessToken;

              dispatch(setFeedType("user"));
              dispatch(disconnect());

              setTimeout(() => {
                dispatch(connect(token));

                setTimeout(() => {
                  isConnectingRef.current = false;
                }, 2000);
              }, 1000);
            }
          }, 0);
        }
      }

      if (ordersToDisplay.length > 0) {
        ordersToDisplay = [...ordersToDisplay].sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
      }

      if (!ordersToDisplay || ordersToDisplay.length === 0) {
        return (
          <div className={styles.empty}>
            <p className="text text_type_main-medium">
              У вас пока нет заказов. Оформите заказ, чтобы он появился здесь.
            </p>
            <p className="text text_type_main-default text_color_inactive mt-2">
              Заказы появятся в истории после их оформления в конструкторе
              бургеров.
            </p>
          </div>
        );
      }

      return (
        <div className={styles.orders}>
          <OrderList
            orders={ordersToDisplay}
            ingredients={ingredientsMap}
            showStatus
          />
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          type="text"
          placeholder="Имя"
          name="name"
          value={form.name}
          onChange={handleChange}
          icon="EditIcon"
          error={false}
          disabled={false}
          size="default"
          autoComplete="name"
        />
        <EmailInput
          placeholder="E-mail"
          name="email"
          value={form.email}
          onChange={handleChange}
          isIcon={true}
          autoComplete="email"
        />
        <PasswordInput
          placeholder="Пароль"
          name="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
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
    );
  };

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <ul>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `text text_type_main-medium ${isActive ? styles.active : ""}`
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
                `text text_type_main-medium ${isActive ? styles.active : ""}`
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
        <p
          className={`text text_type_main-default text_color_inactive ${styles.hint}`}
        >
          {location.pathname === "/profile/orders"
            ? "В этом разделе вы можете просмотреть свою историю заказов"
            : "В этом разделе вы можете изменить свои персональные данные"}
        </p>
      </nav>

      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
};

export default Profile;
