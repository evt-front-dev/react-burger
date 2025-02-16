import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import styles from "./App.module.css";
import AppHeader from "../app-header/app-header";
import Modal from "../modal/modal";
import IngredientDetails from "../ingredient-details/ingredient-details";
import OrderDetails from "../order-details/order-details";
import { fetchIngredients } from "../../services/ingredientsSlice";
import { clearIngredientDetails } from "../../services/ingredientDetailsSlice";
import { closeOrderModal } from "../../services/orderSlice";

// Импорт страниц
import HomePage from "../../pages/home/home";
import LoginPage from "../../pages/login/login";
import RegisterPage from "../../pages/register/register";
import ForgotPasswordPage from "../../pages/forgot-password/forgot-password";
import ResetPasswordPage from "../../pages/reset-password/reset-password";
import ProfilePage from "../../pages/profile/profile";
import IngredientPage from "../../pages/ingredient/ingredient";

function App() {
  const dispatch = useDispatch();
  const { currentIngredient } = useSelector((state) => state.ingredientDetails);
  const { currentOrder, isOrderModalOpen } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className={styles.app}>
        <AppHeader />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/ingredients/:id" element={<IngredientPage />} />
        </Routes>

        {/* Модальные окна */}
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
    </Router>
  );
}

export default App;
