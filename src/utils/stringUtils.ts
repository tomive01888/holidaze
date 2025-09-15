/**
 * Truncates a string to a specified length if it exceeds it,
 * and appends an ellipsis ("..."). Handles null or undefined input gracefully.
 *
 * @param {string | null | undefined} text The text to truncate.
 * @param {number} maxLength The maximum number of characters to allow before truncation.
 * @returns {string} The truncated string with an ellipsis, or the original string if it's
 * within the max length. Returns an empty string for invalid input.
 *
 * @example
 * truncateText("This is a very long description for a venue.", 20);
 * // Returns: "This is a very long..."
 *
 * @example
 * truncateText("Short text.", 30);
 * // Returns: "Short text."
 */
export function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) {
    return "";
  }
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + "...";
}
