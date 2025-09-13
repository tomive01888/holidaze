import { createContext } from "react";
import type { AuthenticatedUser, AuthResponse } from "../types";

/**
 * Defines the shape of the data and functions provided by the AuthContext.
 */
export interface AuthContextType {
  user: AuthenticatedUser | null;
  token: string | null;
  isLoggingOut: boolean;
  login: (authData: AuthResponse["data"]) => void;
  logout: () => void;
  updateUser: (updatedUserData: AuthenticatedUser) => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

/**
 * React Context to hold the authentication state for the entire application.
 * It is created here but provided in the AuthProvider component.
 */
export const AuthContext = createContext<AuthContextType | null>(null);
