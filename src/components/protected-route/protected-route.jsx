import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCookie } from "../../utils/cookies";
import Loader from "../loader/loader";

// Для авторизованных пользователей
export const ProtectedRoute = ({ element }) => {
  const { user, isAuthChecked } = useSelector((state) => state.auth);
  const location = useLocation();
  const token = getCookie("token");

  if (!isAuthChecked) {
    return <Loader />;
  }

  if (!token || !user) {
    // Сохраняем путь, с которого произошел редирект
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

// Для неавторизованных пользователей
export const OnlyUnAuthRoute = ({ element }) => {
  const { user, isAuthChecked } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Loader />;
  }

  if (user) {
    // Возвращаем на предыдущую страницу или на главную
    const { from } = location.state || { from: { pathname: "/" } };
    return <Navigate to={from.pathname} replace />;
  }

  return element;
};

// Для защиты reset-password
export const ResetPasswordRoute = ({ element }) => {
  const location = useLocation();
  const { user, isAuthChecked } = useSelector((state) => state.auth);
  const forgotPasswordVisited = sessionStorage.getItem("forgotPasswordVisited");

  if (!isAuthChecked) {
    return <Loader />;
  }

  // Если пользователь авторизован, редиректим на главную
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Если не посещали forgot-password, редиректим туда
  if (!forgotPasswordVisited) {
    return <Navigate to="/forgot-password" replace />;
  }

  return element;
};
