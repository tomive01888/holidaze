import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

/**
 * A route guard component that protects routes requiring user authentication.
 * If the user is not logged in, it redirects them to the login page,
 * preserving the intended destination to redirect back to after login.
 */
const ProtectedRoute = () => {
  const { user, isLoggingOut } = useAuth();
  const location = useLocation();

  if (isLoggingOut) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location, openLoginModal: true }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
