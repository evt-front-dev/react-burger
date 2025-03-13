import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCookie } from "../../utils/cookies";
import Loader from "../loader/loader";
import PropTypes from "prop-types";

export const ProtectedRoute = ({ element }) => {
  const { user, isAuthChecked } = useSelector((state) => state.auth);
  const location = useLocation();
  const token = getCookie("token");

  if (!isAuthChecked) {
    return <Loader />;
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export const OnlyUnAuthRoute = ({ element }) => {
  const { user, isAuthChecked } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Loader />;
  }

  if (user) {
    const { from } = location.state || { from: { pathname: "/" } };
    return <Navigate to={from.pathname} replace />;
  }

  return element;
};

OnlyUnAuthRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export const ResetPasswordRoute = ({ element }) => {
  const location = useLocation();
  const { user, isAuthChecked } = useSelector((state) => state.auth);
  const forgotPasswordVisited = sessionStorage.getItem("forgotPasswordVisited");

  if (!isAuthChecked) {
    return <Loader />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  if (!forgotPasswordVisited) {
    return <Navigate to="/forgot-password" replace />;
  }

  return element;
};

ResetPasswordRoute.propTypes = {
  element: PropTypes.element.isRequired,
};
