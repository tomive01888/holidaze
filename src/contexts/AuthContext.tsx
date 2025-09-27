import { createContext } from "react";
import type { AuthenticatedUser, AuthResponse } from "../types";

/**
 * Defines the shape of the data and functions provided by the AuthContext.
 * Used by AuthProvider to manage authentication state throughout the app.
 */
export interface AuthContextType {
  /** The currently authenticated user, or null if not logged in */
  user: AuthenticatedUser | null;

  /** JWT or session token, null if not logged in */
  token: string | null;

  /** True if the user is currently being logged out */
  isLoggingOut: boolean;

  /**
   * Logs in a user.
   * @param authData - The authentication data received from the server
   */
  login: (authData: AuthResponse["data"]) => void;

  /** Logs out the current user and clears authentication data */
  logout: () => void;

  /**
   * Updates the current user's information.
   * @param updatedUserData - Partial or full updated user data
   */
  updateUser: (updatedUserData: AuthenticatedUser) => void;

  /** True if the login modal is currently open */
  isLoginModalOpen: boolean;

  /** Opens the login modal */
  openLoginModal: () => void;

  /** Closes the login modal */
  closeLoginModal: () => void;
}

/**
 * React Context for authentication state.
 * Provides access to `user`, `token`, modal state, and login/logout functions.
 * This context should be wrapped by `AuthProvider` at the top level of the app.
 */
export const AuthContext = createContext<AuthContextType | null>(null);
