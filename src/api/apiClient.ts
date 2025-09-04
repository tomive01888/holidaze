import { endpoints } from "../constants/endpoints";
import { triggerLogout } from "../contexts/AuthContext";
import type { ApiErrorResponse } from "../types";
const API_BASE_URL = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * A custom error class for predictable, type-safe API error handling.
 * It contains the HTTP status code and the full error details from the API.
 */
export class ApiError extends Error {
  status: number;
  details: ApiErrorResponse | null;

  constructor(message: string, status: number, details: ApiErrorResponse | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/**
 * The core, private function that handles all fetch logic for the application.
 * It is fully type-safe and handles authentication, API key, and global error states.
 *
 * @template T The expected type of the full API response object (e.g., VenuesApiResponse).
 * @param {string} endpoint The relative API endpoint (e.g., '/holidaze/venues').
 * @param {RequestInit} [options={}] Standard fetch options, including the AbortSignal.
 * @returns {Promise<T>} A promise that resolves with the full, typed API response.
 * @throws {ApiError} Throws for API-related errors (e.g., 400, 404, 500).
 * @throws {Error} Throws for generic network failures or other unexpected issues.
 * @throws {AbortError} Re-throws the native AbortError if the request is cancelled.
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!API_KEY) {
    const errorMessage = "API Key is missing. Check your .env file.";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("accessToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      if (response.status === 401) {
        if (response.status === 401 && endpoint !== endpoints.auth.login) {
          triggerLogout();
          throw new ApiError("Your session has expired. Please log in again.", 401, null);
        }
      }
      const errorBody: ApiErrorResponse = await response.json();
      const errorMessage = errorBody.errors?.[0]?.message || "An API error occurred.";
      throw new ApiError(errorMessage, response.status, errorBody);
    }

    if (response.status === 204 || response.headers.get("Content-Length") === "0") {
      return null as T;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (typeof error === "object" && error !== null && "name" in error && error.name === "AbortError") {
      throw error;
    }

    console.error("API Client Error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new Error("A network error occurred. Please check your connection.");
  }
}

/**
 * A type-safe, centralized API client for the Holidaze application.
 * Provides convenient methods for all HTTP verbs.
 */
export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { method: "GET", ...options }),
  post: <T>(endpoint: string, data: any) => request<T>(endpoint, { method: "POST", body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: any) => request<T>(endpoint, { method: "PUT", body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
