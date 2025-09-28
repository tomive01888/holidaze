import { Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

/**
 * @component Layout
 * @description
 * A top-level layout component that wraps the application with:
 * - A skip link for accessibility to jump straight to main content
 * - A persistent Header at the top
 * - A main content area where nested routes render via `Outlet`
 * - A persistent Footer at the bottom
 *
 * The layout uses flexbox to ensure the footer sticks to the bottom of the viewport
 * when content is short, and supports minimum viewport height (`min-h-svh`) for full-page layouts.
 * The main content area is keyboard-focusable to improve accessibility when using skip links.
 *
 * @returns {JSX.Element} The layout structure with header, main content, and footer.
 */
const Layout = () => {
  return (
    <div className="flex flex-col min-h-svh text-white relative">
      <a
        href="#main-content"
        className="
          sr-only 
          focus:not-sr-only focus:fixed focus:z-[110] focus:top-4 focus:left-4 bg-white text-black
          focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg
        "
      >
        Skip to main content
      </a>
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-grow container mx-auto p-4 focus:outline-none min-h-[75vh] pt-20"
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
