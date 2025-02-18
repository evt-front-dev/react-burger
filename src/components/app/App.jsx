import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import styles from "./App.module.css";
import AppHeader from "../app-header/app-header";
import Modal from "../modal/modal";
import IngredientDetails from "../ingredient-details/ingredient-details";
import OrderDetails from "../order-details/order-details";
import { fetchIngredients } from "../../services/ingredientsSlice";
import { clearIngredientDetails } from "../../services/ingredientDetailsSlice";
import { closeOrderModal } from "../../services/orderSlice";
import {
  setAuthChecked,
  getUser,
  refreshToken,
  resetAuthState,
} from "../../services/auth/authSlice";
import {
  ProtectedRoute,
  OnlyUnAuthRoute,
} from "../protected-route/protected-route";
import { getCookie, deleteCookie } from "../../utils/cookies";

import HomePage from "../../pages/home/home";
import LoginPage from "../../pages/login/login";
import RegisterPage from "../../pages/register/register";
import ForgotPasswordPage from "../../pages/forgot-password/forgot-password";
import ResetPasswordPage from "../../pages/reset-password/reset-password";
import ProfilePage from "../../pages/profile/profile";
import IngredientPage from "../../pages/ingredient/ingredient";
import OrdersHistory from "../../pages/profile/orders-history/orders-history";
import ProfileOrderDetails from "../../pages/profile/order-details/order-details";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentIngredient } = useSelector((state) => state.ingredientDetails);
  const { currentOrder, isOrderModalOpen } = useSelector(
    (state) => state.order
  );
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getCookie("token");
      if (!token) {
        dispatch(resetAuthState());
        return;
      }

      try {
        await dispatch(getUser()).unwrap();
      } catch (err) {
        if (err.message === "jwt expired") {
          try {
            await dispatch(refreshToken()).unwrap();
            await dispatch(getUser()).unwrap();
          } catch (refreshErr) {
            dispatch(resetAuthState());
          }
        } else {
          dispatch(resetAuthState());
        }
      } finally {
        dispatch(setAuthChecked(true));
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={<OnlyUnAuthRoute element={<LoginPage />} />}
        />
        <Route
          path="/register"
          element={<OnlyUnAuthRoute element={<RegisterPage />} />}
        />
        <Route
          path="/forgot-password"
          element={<OnlyUnAuthRoute element={<ForgotPasswordPage />} />}
        />
        <Route
          path="/reset-password"
          element={<OnlyUnAuthRoute element={<ResetPasswordPage />} />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<ProfilePage />} />}
        />
        <Route
          path="/profile/orders"
          element={<ProtectedRoute element={<OrdersHistory />} />}
        />
        <Route
          path="/profile/orders/:number"
          element={<ProtectedRoute element={<ProfileOrderDetails />} />}
        />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
      </Routes>

      {currentIngredient && (
        <Modal
          title="Детали ингредиента"
          onClose={() => dispatch(clearIngredientDetails())}
        >
          <IngredientDetails ingredient={currentIngredient} />
        </Modal>
      )}
      {isOrderModalOpen && (
        <Modal onClose={() => dispatch(closeOrderModal())}>
          <OrderDetails order={currentOrder} />
        </Modal>
      )}
    </div>
  );
}

export default App;
