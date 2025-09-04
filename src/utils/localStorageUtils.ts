// src/utils/localStorageUtils.ts

/**
 * Saves a value to localStorage after serializing it to JSON.
 * This is a type-safe way to store complex objects or arrays.
 * It includes error handling in case storage is full or unavailable.
 *
 * @template T The type of the value being stored.
 * @param {string} key The key under which to store the value.
 * @param {T} value The value to store. Can be any JSON-serializable type.
 *
 * @example
 * const user = { name: 'John Doe', id: 123 };
 * saveToStorage('userProfile', user);
 */
export function saveToStorage<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error saving to localStorage with key "${key}":`, error);
  }
}

/**
 * Loads a value from localStorage and deserializes it from JSON.
 * This is a type-safe way to retrieve complex objects or arrays.
 * It handles cases where the key doesn't exist or the data is corrupted.
 *
 * @template T The expected type of the value being retrieved.
 * @param {string} key The key of the item to retrieve.
 * @returns {T | null} The deserialized value of type T, or null if the key
 * doesn't exist or if there's a parsing error.
 *
 * @example
 * const user = loadFromStorage<UserProfile>('userProfile');
 * if (user) {
 *   console.log(user.name); // 'John Doe'
 * }
 */
export function loadFromStorage<T>(key: string): T | null {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return null;
    }
    return JSON.parse(serializedValue) as T;
  } catch (error) {
    console.error(`Error loading from localStorage with key "${key}":`, error);
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Removes an item from localStorage by its key.
 *
 * @param {string} key The key of the item to remove.
 *
 * @example
 * removeFromStorage('userProfile');
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage with key "${key}":`, error);
  }
}
