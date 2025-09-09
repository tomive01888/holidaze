import { useState, useEffect } from "react";

/**
 * A custom hook that debounces a value. It will only update the returned
 * value after the specified delay has passed without the input value changing.
 *
 * @template T The type of the value to debounce.
 * @param {T} value The value to be debounced (e.g., a search term from an input).
 * @param {number} delay The debounce delay in milliseconds (e.g., 500).
 * @returns {T} The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
