import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

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
