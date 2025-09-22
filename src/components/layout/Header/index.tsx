import { useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import LoginForm from "./components/LoginForm.tsx";
import holidazeLogo from "../../../assets/holidaze_logo.png";
import { CircleUserRound } from "lucide-react";

/**
 * The main application header. It's responsible for displaying the main navigation,
 * handling the login modal, and reflecting the user's authentication status and role.
 */
const Header = () => {
  const { user, logout, isLoginModalOpen, openLoginModal, closeLoginModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.triggerLogin) {
      const newState = { ...location.state };
      delete newState.triggerLogin;
      navigate(location.pathname, { state: newState, replace: true });

      if (!user) {
        openLoginModal();
      }
    }
  }, [location, navigate, user, openLoginModal]);

  const getHeaderClass = () => {
    if (user?.venueManager) {
      return "bg-neutral-700 text-white";
    }
    if (user) {
      return "bg-teal-600 text-white";
    }
    return "bg-teal-800 text-white";
  };

  const handleLoginSuccess = () => {
    closeLoginModal();
  };

  return (
    <>
      <header className={`fixed w-full top-0 z-40 h-16 shadow-md transition-colors ${getHeaderClass()}`}>
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:opacity-80 transition-opacity font-new flex gap-1">
            <img src={holidazeLogo} alt="Holidaze logo including a globe" className=" w-full max-w-30" />
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 font-bold hover:opacity-80">
                  {user.avatar?.url ? (
                    <img
                      src={user.avatar?.url}
                      alt={user.avatar?.alt}
                      className="w-10 aspect-square rounded-full object-cover border-2 border-white/50"
                    />
                  ) : (
                    <CircleUserRound size={24} />
                  )}
                  <span className="hidden sm:inline">{user.name}</span>
                </Link>
                <Button variant="destructive" size="sm" onClick={logout} className="cursor-pointer text-white py-2">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={openLoginModal} className="cursor-pointer">
                  Login
                </Button>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 
             text-white font-semibold hover:bg-teal-900/80 focus-visible:outline-dashed 
             focus-visible:outline-offset-2 focus-visible:outline-3 focus-visible:outline-pink-400"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* --- Login Modal --- */}
      {isLoginModalOpen && (
        <Modal onClose={closeLoginModal} modalTitle="Holidaze | Login form">
          <LoginForm onSuccess={handleLoginSuccess} />
        </Modal>
      )}
    </>
  );
};

export default Header;
