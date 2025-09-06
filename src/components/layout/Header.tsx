import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import holidazeLogo from "../../assets/holidaze_logo.png";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import LoginForm from "../../features/authentication/LoginForm";

/**
 * The main application header. It's responsible for displaying the main navigation,
 * handling the login modal, and reflecting the user's authentication status and role.
 */
const Header = () => {
  const { user, logout, isLoginModalOpen, openLoginModal, closeLoginModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.openLoginModal) {
      const { openLoginModal: shouldOpenModal, ...restState } = location.state;
      navigate(location.pathname, { state: restState, replace: true });

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
      <header className={`sticky top-0 z-40 h-16 shadow-md transition-colors ${getHeaderClass()}`}>
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
                      src={user.avatar.url}
                      alt={user.avatar?.alt}
                      className="w-10 aspect-square rounded-full object-cover border-2 border-white/50"
                    />
                  ) : (
                    <FaUserCircle size={24} />
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
                <Link to="/register">
                  <Button variant="primary" className="cursor-pointer">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* --- Login Modal --- */}
      {isLoginModalOpen && (
        <Modal onClose={closeLoginModal}>
          <LoginForm onSuccess={handleLoginSuccess} />
        </Modal>
      )}
    </>
  );
};

export default Header;
