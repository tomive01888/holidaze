/**
 * Defines the shape of the error object returned by the API.
 */
export interface ApiErrorResponse {
  errors: { message: string }[];
  status: string;
  statusCode: number;
}

/**
 * Defines the shape of the pagination metadata from the API.
 */
export interface Meta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}

/**
 * Defines the response structure for fetching a list of venues.
 */
export interface VenuesApiResponse {
  data: Venue[];
  meta: Meta;
}

/**
 * Represents the fundamental Venue object.
 */
export interface Venue {
  id: string;
  name: string;
  description: string;
  media: { url: string; alt: string }[];
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  location: {
    address: string | null;
    city: string | null;
    zip: string | null;
    country: string | null;
    continent: string | null;
    lat: number;
    lng: number;
  };
}

/**
 * Represents a user's profile information.
 * Used for the venue owner and the logged-in user's profile.
 */
export interface Profile {
  name: string;
  email: string;
  avatar: {
    url: string;
    alt: string;
  } | null;
  isVenueManager: boolean;
}

/**
 * Represents a single booking.
 */
export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
}

/**
 * Represents a Venue that includes the owner's profile information.
 * Used for the single venue page.
 */
export interface VenueWithOwner extends Venue {
  owner: Profile;
}

/**
 * Represents a Venue that includes its list of bookings.
 */
export interface VenueWithBookings extends Venue {
  bookings: Booking[];
}

/**

 * Represents a Booking that includes information about the venue it's for.
 * Used when fetching a user's list of their own bookings.
 */
export interface BookingWithVenue extends Booking {
  venue: Venue;
}

/**
 * A comprehensive type for a single venue page that includes everything.
 */
export interface FullVenue extends VenueWithOwner, VenueWithBookings {}

// The type for a single venue API response is simply the fully detailed venue object itself.
export type SingleVenueApiResponse = FullVenue;
