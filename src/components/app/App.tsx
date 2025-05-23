import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import AppHeader from "components/app-header/app-header";
import { fetchIngredients } from "services/ingredientsSlice";
import { getUser, setAuthChecked } from "services/auth/authSlice";
import { getCookie } from "utils/cookies";
import {
  MainPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  ProfilePage,
  NotFound404,
  IngredientPage,
  FeedPage,
  OrderPage,
} from "pages";
import {
  ProtectedRoute,
  OnlyUnAuthRoute,
  ResetPasswordRoute,
} from "components/protected-route/protected-route";
import Modal from "components/modal/modal";
import IngredientDetails from "components/ingredient-details/ingredient-details";
import OrderDetails from "components/order-details/order-details";
import { RootState } from "store/store";
import { closeOrderModal } from "services/orderSlice";
import { refreshToken } from "services/auth/authSlice";
import { useAppDispatch, useAppSelector } from "hooks/redux";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;
  const { isOrderModalOpen } = useAppSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchIngredients());

    const checkAuth = async () => {
      const token = getCookie("token");
      if (token) {
        try {
          await dispatch(getUser()).unwrap();
          dispatch(setAuthChecked(true));
        } catch (err) {
          try {
            const refreshData = await dispatch(refreshToken()).unwrap();
            if (refreshData.success) {
              await dispatch(getUser()).unwrap();
            }
            dispatch(setAuthChecked(true));
          } catch (refreshErr) {
            dispatch(setAuthChecked(true));
          }
        }
      } else {
        dispatch(setAuthChecked(true));
      }
    };

    checkAuth();
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  const handleOrderModalClose = () => {
    dispatch(closeOrderModal());
  };

  return (
    <>
      <AppHeader />
      <Routes location={background || location}>
        <Route path="/" element={<MainPage />} />
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
        <Route
          path="/profile/orders"
          element={<ProtectedRoute element={<ProfilePage />} />}
        />
        <Route
          path="/profile/orders/:id"
          element={<ProtectedRoute element={<OrderPage />} />}
        />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/feed/:id" element={<OrderPage />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
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
          <Route
            path="/feed/:id"
            element={
              <Modal title="" onClose={handleModalClose}>
                <OrderPage isModal={true} />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:id"
            element={
              <Modal title="" onClose={handleModalClose}>
                <OrderPage isModal={true} />
              </Modal>
            }
          />
        </Routes>
      )}

      {isOrderModalOpen && (
        <Modal onClose={handleOrderModalClose}>
          <OrderDetails />
        </Modal>
      )}
    </>
  );
};

export default App;
