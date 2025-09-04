import { createContext, useState, useContext, useEffect, useCallback, type ReactNode } from "react";
import { loadFromStorage, saveToStorage, removeFromStorage } from "../utils/localStorageUtils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { AuthenticatedUser, AuthResponse } from "../types";

/**
 * Defines the shape of the data and functions provided by the AuthContext.
 */
interface AuthContextType {
  user: AuthenticatedUser | null;
  token: string | null;
  login: (authData: AuthResponse["data"]) => void;
  logout: () => void;
  updateUser: (updatedUserData: AuthenticatedUser) => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isLoggingOut: boolean;
}

/**
 * A custom event used to trigger a global logout from non-React modules.
 */
const logoutEvent = new Event("app:logout");

/**
 * React Context to hold the authentication state.
 */
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * A custom hook for easy, type-safe access to the AuthContext.
 * Throws an error if used outside of an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * A globally accessible function that dispatches the logout event.
 * This allows modules like apiClient to trigger a logout.
 */
export const triggerLogout = () => {
  window.dispatchEvent(logoutEvent);
};

/**
 * The provider component that wraps the application and manages all authentication state.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(() => loadFromStorage<AuthenticatedUser>("user"));
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("accessToken"));
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  const login = useCallback((authData: AuthResponse["data"]) => {
    const { accessToken, ...userData } = authData;
    setUser(userData);
    setToken(accessToken);
    saveToStorage("user", userData);
    localStorage.setItem("accessToken", accessToken);
  }, []);

  const logout = useCallback(() => {
    setIsLoggingOut(true);
    setUser(null);
    setToken(null);
    removeFromStorage("user");
    localStorage.removeItem("accessToken");
    navigate("/", { replace: true });
    toast.info("User logged out, welcome back again!");
    setTimeout(() => {
      setIsLoggingOut(false);
    }, 100);
  }, [navigate]);

  const updateUser = useCallback((updatedUserData: AuthenticatedUser) => {
    setUser(updatedUserData);
    saveToStorage("user", updatedUserData);
  }, []);

  useEffect(() => {
    const handleLogoutEvent = () => logout();
    window.addEventListener("app:logout", handleLogoutEvent);
    return () => {
      window.removeEventListener("app:logout", handleLogoutEvent);
    };
  }, [logout]);

  const value = {
    user,
    token,
    login,
    logout,
    updateUser,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    isLoggingOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
