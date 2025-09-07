/**
 * A custom event used to trigger a global logout from non-React modules.
 */
export const logoutEvent = new Event("app:logout");

/**
 * A globally accessible function that dispatches the logout event.
 * This allows modules like apiClient to trigger a logout.
 */
export const triggerLogout = () => {
  window.dispatchEvent(logoutEvent);
};
