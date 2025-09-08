import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/layout/Layout";
import HomePage from "./features/venues/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./features/authentication/RegisterPage";

/**
 * The main application component that defines and renders all routes.
 */
function App() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        // { path: "venue/:id", element: <VenueDetailPage /> },
        { path: "register", element: <RegisterPage /> },

        // {
        //   element: <ProtectedRoute />,
        //   children: [
        //     { path: "dashboard", element: <DashboardPage /> },
        //     { path: "profile", element: <DashboardPage /> },
        //   ],
        // },

        // {
        //   element: <VenueManagerRoute />,
        //   children: [
        //     { path: "venue/create", element: <CreateVenuePage /> },
        //     { path: "venue/edit/:id", element: <EditVenuePage /> },
        //   ],
        // },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ]);

  return (
    <>
      {routes}
      <ToastContainer position="top-right" style={{ top: "90px" }} autoClose={3500} theme="light" closeOnClick />
    </>
  );
}

export default App;
