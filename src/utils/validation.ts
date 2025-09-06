/**
 * Checks if an email is a valid @stud.noroff.no email address using a regular expression.
 *
 * @param {string} email The email string to validate.
 * @returns {boolean} `true` if the email is a valid stud.noroff.no address, otherwise `false`.
 *
 * @example
 * isValidNoroffEmail("test@stud.noroff.no"); // true
 * isValidNoroffEmail("test@noroff.no"); // false
 * isValidNoroffEmail("test@gmail.com"); // false
 */
export function isValidNoroffEmail(email: string): boolean {
  const noroffEmailRegex = /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/;
  return noroffEmailRegex.test(email);
}

/**
 * Checks if a password meets the minimum length requirement.
 *
 * @param {string} password The password string to check.
 * @param {number} [minLength=8] The minimum required length. Defaults to 8.
 * @returns {boolean} `true` if the password is long enough, otherwise `false`.
 *
 * @example
 * isPasswordStrongEnough("password123"); // true
 * isPasswordStrongEnough("pass"); // false
 */
export function isPasswordStrongEnough(password: string, minLength: number = 8): boolean {
  return password.length >= minLength;
}

/**
 * Checks if a username contains only letters, numbers, and underscores (_). No spaces.
 *
 * @param {string} name The username string to validate.
 * @returns {boolean} `true` if the username is valid, otherwise `false`.
 *
 * @example
 * isValidUsername("john_doe"); // true
 * isValidUsername("johndoe123"); // true
 * isValidUsername("john doe"); // false
 * isValidUsername("john-doe"); // false
 */
export function isValidUsername(name: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  return usernameRegex.test(name);
}
