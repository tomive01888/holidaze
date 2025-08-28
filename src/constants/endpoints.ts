// src/api/endpoints.ts

/**
 * A centralized object for all API endpoints.
 * This provides a single source of truth for all relative API paths
 * and includes functions for generating dynamic URLs with parameters.
 */
export const endpoints = {
  auth: {
    login: "/auth/login?_holidaze=true",
    register: "/auth/register?_holidaze=true",
  },
  venues: {
    /**
     * Endpoint for all venues. Supports GET (all) and POST (create).
     */
    all: "/holidaze/venues",
    /**
     * Generates the endpoint for a single venue by its ID.
     * Supports GET (single), PUT (update), and DELETE.
     * @param {string} id The ID of the venue.
     */
    byId: (id: string) => `/holidaze/venues/${id}`,
    /**
     *
     * @param query string that user searches with and API call will return any value matching this string back
     * @returns
     */
    search: (query: string) => `/holidaze/venues/search?q=${encodeURIComponent(query)}`,
  },
  profiles: {
    /**
     * Generates the endpoint for a specific user's profile.
     * @param {string} name The name of the user.
     */
    byName: (name: string) => `/holidaze/profiles/${name}`,
    /**
     * Generates the endpoint for a user's venues.
     * @param {string} name The name of the user.
     */
    venues: (name: string) => `/holidaze/profiles/${name}/venues`,
    /**
     * Generates the endpoint for a user's bookings.
     * @param {string} name The name of the user.
     */
    bookings: (name: string) => `/holidaze/profiles/${name}/bookings`,
  },
  bookings: {
    /**
     * Endpoint for all bookings. Supports POST (create).
     */
    all: "/holidaze/bookings",
    /**
     * Generates the endpoint for a single booking by its ID.
     * Supports GET (single), PUT (update), and DELETE.
     * @param {string} id The ID of the booking.
     */
    byId: (id: string) => `/holidaze/bookings/${id}`,
  },
};
