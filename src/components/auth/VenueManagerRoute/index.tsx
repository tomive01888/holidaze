import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

/**
 * A route guard component that protects routes requiring the user to be a Venue Manager.
 * If the user is not logged in or is not a Venue Manager, it redirects them.
 */
const VenueManagerRoute = () => {
  const { user } = useAuth();

  if (!user || !user.venueManager) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default VenueManagerRoute;
