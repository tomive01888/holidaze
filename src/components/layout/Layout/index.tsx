import { Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-svh text-white relative">
      <a
        href="#main-content"
        className="
          sr-only 
          focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 
          focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg
        "
      >
        Skip to main content
      </a>
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-grow container mx-auto p-4 focus:outline-none min-h-svh pt-20"
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
