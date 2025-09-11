import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { isPasswordStrongEnough, isValidNoroffEmail, isValidUsername } from "../../utils/validation";
import type { AuthResponse, RegisterPayload } from "../../types";
import { apiClient, ApiError } from "../../api/apiClient";
import Button from "../../components/ui/Button";
import { endpoints } from "../../constants/endpoints";

type RegisterRole = "customer" | "manager";

/**
 * A page for new users to create an account as either a Customer or a Venue Manager.
 * It handles form input, validation and API submission.
 */
const RegisterPage = () => {
  const [role, setRole] = useState<RegisterRole>("customer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({ name: "", email: "", password: "" });
    setFormError(null);

    if (!isValidUsername(formData.name)) {
      setFieldErrors({ name: "Username can only contain letters, numbers, and underscores (_)." });
      return;
    }
    if (!isValidNoroffEmail(formData.email)) {
      setFieldErrors({ email: "Email must be a valid @stud.noroff.no address." });
      return;
    }
    if (!isPasswordStrongEnough(formData.password)) {
      setFieldErrors({ password: "Password must be at least 8 characters long." });
      return;
    }

    setIsLoading(true);

    const payload: RegisterPayload = {
      ...formData,
      ...(role === "manager" && { venueManager: true }),
    };

    try {
      await apiClient.post<AuthResponse>(endpoints.auth.register, payload);
      toast.success("Account created successfully! Please log in to continue.");
      navigate("/", { state: { openLoginModal: true } });
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError("An unknown error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      event.target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  const inputClasses =
    "mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500";

  return (
    <div className="container mx-auto max-w-2xl mt-10 text-black">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-4">Create Your Account</h1>

        {/* --- Role Selection Toggle --- */}
        <div
          role="radiogroup"
          aria-labelledby="register-role-label"
          className="grid grid-cols-1 gap-2 mb-6 bg-neutral-100 p-1 rounded-md"
        >
          <span id="register-role-label" className="sr-only">
            Choose account type
          </span>
          <button
            role="radio"
            aria-checked={role === "customer"}
            onClick={() => setRole("customer")}
            className={`py-2 rounded-md font-bold transition-colors text-lg  ${
              role === "customer" ? "bg-white text-black shadow" : "text-neutral-400 hover:bg-neutral-200"
            }`}
          >
            I'm a Customer
          </button>
          <button
            role="radio"
            aria-checked={role === "manager"}
            onClick={() => setRole("manager")}
            className={`py-2 rounded-md font-bold transition-colors text-lg ${
              role === "manager" ? "bg-neutral-800 text-white shadow" : "text-neutral-400 hover:bg-neutral-200"
            }`}
          >
            I'm a Venue Manager
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- Form Fields --- */}
          <div className="flex flex-col">
            <label htmlFor="name">Username</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              onChange={handleInputChange}
              value={formData.name}
              onFocus={handleInputFocus}
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
              className={inputClasses}
            />
            {fieldErrors.name && (
              <p id="name-error" className="text-red-600">
                {fieldErrors.name}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="email">Email (@stud.noroff.no)</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              onChange={handleInputChange}
              value={formData.email}
              onFocus={handleInputFocus}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              className={inputClasses}
            />
            {fieldErrors.email && (
              <p id="name-error" className="text-red-600">
                {fieldErrors.email}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              onChange={handleInputChange}
              value={formData.password}
              onFocus={handleInputFocus}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
              className={inputClasses}
            />
            <p id="password-hint" className="text-neutral-500">
              Must be at least 8 characters long.
            </p>
            {fieldErrors.password && (
              <p id="name-error" className="text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* --- Venue Manager Specific UI --- */}
          {role === "manager" && (
            <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-md border border-blue-200">
              <input type="checkbox" checked readOnly className="mt-1" />
              <div>
                <p className="font-bold text-blue-800">Registering as a Venue Manager</p>
                <p className="text-md text-blue-700">This will allow you to list and manage your own venues.</p>
              </div>
            </div>
          )}

          {formError && (
            <p className="text-center text-error text-red-600 outline-1 outline-red-600 rounded bg-red-50">
              {formError}
            </p>
          )}

          <Button variant="primary" type="submit" disabled={isLoading} className="w-full text-xl">
            {isLoading ? "Creating Account..." : "Register"}
          </Button>

          <p className="text-center text-lg self-center">
            Already have an account?{" "}
            <Link
              to="/"
              state={{ triggerLogin: true }}
              className="font-bold underline text-neutral-600 hover:text-blue-600"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
