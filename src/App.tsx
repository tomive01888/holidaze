import { Suspense, lazy } from "react";
import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import VenueManagerRoute from "./components/auth/VenueManagerRoute";
import AutoScrollToTop from "./components/ui/AutoScrollToTop";
import Spinner from "./components/ui/Spinner";

const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const VenueDetailPage = lazy(() => import("./pages/VenueDetailPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const EditVenuePage = lazy(() => import("./pages/EditVenuePage"));
const CreateVenuePage = lazy(() => import("./pages/CreateVenuePage"));

/**
 * Root application component.
 *
 * Sets up:
 * - App routes with `react-router-dom`
 * - Protected routes and venue manager routes
 * - Lazy-loaded pages with `Suspense`
 * - Scroll-to-top behavior
 * - Global toast notifications via `react-toastify`
 *
 * @returns {JSX.Element} The main application layout with routing.
 */
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
      <Suspense
        fallback={
          <div className="text-2xl text-white w-full min-h-[50vh] flex flex-col gap-2 items-center justify-center">
            <Spinner />
            <span> Loading...</span>
          </div>
        }
      >
        {routes}
      </Suspense>

      <ToastContainer position="top-right" style={{ top: "90px" }} autoClose={3500} theme="light" closeOnClick />
    </>
  );
}

export default App;
