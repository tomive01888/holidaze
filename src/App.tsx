import { Suspense, lazy } from "react";
import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import VenueManagerRoute from "./components/auth/VenueManagerRoute";
import AutoScrollToTop from "./components/ui/AutoScrollToTop";

const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const VenueDetailPage = lazy(() => import("./pages/VenueDetailPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const EditVenuePage = lazy(() => import("./pages/EditVenuePage"));
const CreateVenuePage = lazy(() => import("./pages/CreateVenuePage"));

function App() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "venue/:id", element: <VenueDetailPage /> },
        { path: "register", element: <RegisterPage /> },

        {
          element: <ProtectedRoute />,
          children: [
            { path: "dashboard", element: <DashboardPage /> },
            { path: "profile", element: <DashboardPage /> },
          ],
        },

        {
          element: <VenueManagerRoute />,
          children: [
            { path: "venue/create", element: <CreateVenuePage /> },
            { path: "venue/edit/:id", element: <EditVenuePage /> },
          ],
        },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ]);

  return (
    <>
      <AutoScrollToTop />
      {/* 🔑 Wrap routes in Suspense */}
      <Suspense fallback={<div>Loading...</div>}>{routes}</Suspense>

      <ToastContainer position="top-right" style={{ top: "90px" }} autoClose={3500} theme="light" closeOnClick />
    </>
  );
}

export default App;
