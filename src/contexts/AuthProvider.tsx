import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, type AuthContextType } from "./AuthContext";
import { loadFromStorage, saveToStorage, removeFromStorage } from "../utils/localStorageUtils";
import type { AuthenticatedUser, AuthResponse } from "../types";

/**
 * The provider component that wraps the application and manages all authentication state.
 * This is the only component exported from this file, satisfying the Fast Refresh rule.
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
    navigate("/", { replace: true, state: {} });
    setTimeout(() => setIsLoggingOut(false), 500);
  }, [navigate]);

  const updateUser = useCallback((updatedUserData: AuthenticatedUser) => {
    setUser(updatedUserData);
    saveToStorage("user", updatedUserData);
  }, []);

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
