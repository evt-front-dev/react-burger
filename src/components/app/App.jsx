import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
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
  ResetPasswordRoute,
} from "../protected-route/protected-route";
import { getCookie, deleteCookie } from "../../utils/cookies";

import LoginPage from "../../pages/login/login";
import RegisterPage from "../../pages/register/register";
import ForgotPasswordPage from "../../pages/forgot-password/forgot-password";
import ResetPasswordPage from "../../pages/reset-password/reset-password";
import ProfilePage from "../../pages/profile/profile";
import NotFound404 from "../../pages/not-found/not-found";
import HomePage from "../../pages/home/home";
import IngredientPage from "../../pages/ingredient/ingredient";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;
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

  const handleModalClose = () => {
    dispatch(clearIngredientDetails());
    navigate(-1);
  };

  return (
    <>
      <AppHeader />
      <Routes location={background || location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
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
          element={<ResetPasswordRoute element={<ResetPasswordPage />} />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<ProfilePage />} />}
        />
        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
      {isOrderModalOpen && (
        <Modal onClose={() => dispatch(closeOrderModal())}>
          <OrderDetails order={currentOrder} />
        </Modal>
      )}
    </>
  );
}

export default App;
