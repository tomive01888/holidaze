import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";
import type { AuthResponse, LoginPayload } from "../../../../types";
import { endpoints } from "../../../../constants/endpoints";
import { apiClient, ApiError } from "../../../../api/apiClient";
import Button from "../../../ui/Button";

/**
 * Props for the {@link LoginForm} component.
 *
 * @typedef {Object} LoginFormProps
 * @property {() => void} onSuccess - A callback function executed after a successful login.
 * Typically used to close a modal or redirect the user.
 */
export interface LoginFormProps {
  onSuccess: () => void;
}

/**
 * A form component for user authentication.
 *
 * @component
 *
 * @param {LoginFormProps} props - The props for the component.
 * @returns {JSX.Element} A login form with email/password fields, error handling, and submit logic.
 *
 * @description
 * This component:
 * - Collects email and password from the user.
 * - Calls the login API endpoint.
 * - Updates global auth state via `useAuth`.
 * - Displays real-time errors (both visually and via ARIA live region for screen readers).
 * - Provides loading feedback while the request is in progress.
 *
 * @example
 * ```tsx
 * <LoginForm onSuccess={() => setLoginModalOpen(false)} />
 * ```
 */
const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles form submission.
   *
   * @async
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   * @returns {Promise<void>}
   *
   * @remarks
   * - Prevents the default form behavior.
   * - Sends a login request to the API.
   * - Updates global auth state with the returned token and user data.
   * - Calls `onSuccess` on successful login.
   * - Displays an error message if the request fails.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload: LoginPayload = { email, password };

    try {
      const response = await apiClient.post<AuthResponse>(endpoints.auth.login, payload);
      if (response?.data?.accessToken && response?.data?.name) {
        login(response.data);
        onSuccess();
      } else {
        throw new Error("Login failed: Invalid response from server.");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("A network error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-10 max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

      {/* 
        ARIA Live Region — ensures screen readers announce errors
        when they appear after form submission.
      */}
      <div aria-live="assertive" className="sr-only">
        {error && `Error: ${error}`}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-md font-medium text-neutral-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!error}
            className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm"
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-md font-medium text-neutral-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!error}
            className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm"
          />
        </div>

        {/* Visible Error Message (for sighted users) */}
        {error && (
          <p
            id="form-error-message"
            className="text-md text-center text-error bg-error/10 p-2 rounded-md font-bold outline-1 outline-red-600 text-red-600"
          >
            {error}
          </p>
        )}

        {/* Submit Button */}
        <div>
          <Button type="submit" disabled={isLoading} className="w-full flex justify-center" variant="primary">
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>

        {/* Link to Registration */}
        <p className="text-center text-lg text-neutral-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            onClick={onSuccess}
            className="font-bold text-neutral-600 underline hover:text-blue-600 focus:text-blue-500"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
