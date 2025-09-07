import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiClient, ApiError } from "../../api/apiClient";
import { endpoints } from "../../constants/endpoints";
import type { AuthResponse, LoginPayload } from "../../types";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

export interface LoginFormProps {
  /**
   * A callback function to be executed upon successful login.
   * Typically used to close the login modal.
   */
  onSuccess: () => void;
}

/**
 * A form component for user authentication. It handles user input,
 * API communication, error display, and updates the global auth state.
 */
const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        This is an ARIA Live Region. It is visually hidden but its content
        will be announced by screen readers whenever the `error` state changes.
        This is crucial for announcing form submission errors.
      */}
      <div aria-live="assertive" className="sr-only">
        {error && `Error: ${error}`}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

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
            className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* This VISIBLE error message remains for sighted users. */}
        {error && (
          <p
            id="form-error-message"
            className="text-md text-center text-error bg-error/10 p-2 rounded-md font-bold outline-1 outline-red-600 text-red-600"
          >
            {error}
          </p>
        )}

        <div>
          <Button type="submit" disabled={isLoading} className="w-full flex justify-center" variant="primary">
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>

        <p className="text-center text-md text-neutral-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            onClick={onSuccess}
            className="font-medium text-primary-600 hover:text-primary-500 hover:underline"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
