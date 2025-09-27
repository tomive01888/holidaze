import { useState, useEffect, useCallback, type ReactNode, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, type AuthContextType } from "./AuthContext";
import { loadFromStorage, saveToStorage, removeFromStorage } from "../utils/localStorageUtils";
import type { AuthenticatedUser, AuthResponse } from "../types";

/**
 * Props for AuthProvider component.
 */
interface AuthProviderProps {
  /** React children components that will have access to AuthContext */
  children: ReactNode;
}

/**
 * Provides authentication state and functions to the app.
 *
 * Wraps children in AuthContext and exposes:
 * - `user` and `token` state
 * - login/logout functions
 * - login modal state
 *
 * Listens for a global `app:logout` event to trigger logout.
 *
 * @param children - React components that need access to authentication state
 * @returns JSX element wrapping children with AuthContext
 */
export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<AuthenticatedUser | null>(() => loadFromStorage<AuthenticatedUser>("user"));
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("accessToken"));
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();

  /**
   * Opens the login modal by setting `isLoginModalOpen` to true.
   */
  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);

  /**
   * Closes the login modal by setting `isLoginModalOpen` to false.
   */
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  /**
   * Logs in a user.
   *
   * Saves user data and access token to state and localStorage.
   *
   * @param authData - The authentication response data including accessToken and user info
   */
  const login = useCallback((authData: AuthResponse["data"]) => {
    const { accessToken, ...userData } = authData;
    setUser(userData);
    setToken(accessToken);
    saveToStorage("user", userData);
    localStorage.setItem("accessToken", accessToken);
  }, []);

  /**
   * Logs out the current user.
   *
   * Clears state and localStorage, navigates to home, and triggers `isLoggingOut` state.
   */
  const logout = useCallback(() => {
    setIsLoggingOut(true);
    setUser(null);
    setToken(null);
    removeFromStorage("user");
    localStorage.removeItem("accessToken");
    navigate("/", { replace: true });
    setTimeout(() => setIsLoggingOut(false), 500);
  }, [navigate]);

  /**
   * Updates the currently logged-in user's data.
   *
   * Persists changes to both state and localStorage.
   *
   * @param updatedUserData - New user data to replace current user
   */
  const updateUser = useCallback((updatedUserData: AuthenticatedUser) => {
    setUser(updatedUserData);
    saveToStorage("user", updatedUserData);
  }, []);

  /**
   * Adds a global event listener for `app:logout`.
   * Automatically logs out the user when this event is dispatched.
   */
  useEffect(() => {
    const handleLogoutEvent = () => logout();
    window.addEventListener("app:logout", handleLogoutEvent);
    return () => window.removeEventListener("app:logout", handleLogoutEvent);
  }, [logout]);

  const value: AuthContextType = {
    user,
    token,
    isLoggingOut,
    login,
    logout,
    updateUser,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
