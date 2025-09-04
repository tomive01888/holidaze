import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/layout/Layout";

/**
 * The main application component that defines and renders all routes.
 */
function App() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [],
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
