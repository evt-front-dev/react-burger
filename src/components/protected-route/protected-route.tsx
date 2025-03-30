import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCookie } from "utils/cookies";
import Loader from "components/loader/loader";
import { RootState } from "store/store";

interface RouteProps {
  element: React.ReactElement;
}

interface AuthState {
  user: any;
  isAuthChecked: boolean;
}

export const ProtectedRoute: React.FC<RouteProps> = ({ element }) => {
  const { user, isAuthChecked } = useSelector<RootState, AuthState>(
    (state) => state.auth
  );
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

export const OnlyUnAuthRoute: React.FC<RouteProps> = ({ element }) => {
  const { user, isAuthChecked } = useSelector<RootState, AuthState>(
    (state) => state.auth
  );
  const location = useLocation();

  if (!isAuthChecked) {
    return <Loader />;
  }

  if (user) {
    const { from } = (location.state as { from: { pathname: string } }) || {
      from: { pathname: "/" },
    };
    return <Navigate to={from.pathname} replace />;
  }

  return element;
};

export const ResetPasswordRoute: React.FC<RouteProps> = ({ element }) => {
  const location = useLocation();
  const { user, isAuthChecked } = useSelector<RootState, AuthState>(
    (state) => state.auth
  );
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
