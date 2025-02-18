import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCookie } from "../../utils/cookies";
import { resetAuthState } from "../../services/auth/authSlice";
import Loader from "../loader/loader";

export const ProtectedRoute = ({ element }) => {
  const dispatch = useDispatch();
  const { user, isAuthChecked, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  const token = getCookie("token");

  useEffect(() => {
    if (!token && isAuthChecked) {
      dispatch(resetAuthState());
    }
  }, [token, isAuthChecked, dispatch]);

  if (!isAuthChecked) {
    return <Loader />;
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

export const OnlyUnAuthRoute = ({ element }) => {
  const { user, isAuthChecked } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Loader />;
  }

  if (user) {
    const { from } = location.state || { from: { pathname: "/" } };
    return <Navigate to={from} replace />;
  }

  return element;
};
