// src/types/index.ts

// ============================================================================
// API & META TYPES
// ============================================================================

/**
 * Defines the shape of the error object returned by the API.
 */
export interface ApiErrorResponse {
  errors: { message: string }[];
  status: string;
  statusCode: number;
}

/**
 * Defines the shape of the pagination metadata from list endpoints.
 */
export interface PaginationMeta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}

// ============================================================================
// AUTHENTICATION & PROFILE TYPES
// ============================================================================

/**
 * Represents the public-facing profile of any user (e.g., a venue owner or a customer on a booking).
 */
export interface PublicProfile {
  name: string;
  email: string;
  bio: string | null;
  avatar: { url: string; alt: string } | null;
  banner: { url: string; alt: string } | null;
}

/**
 * Represents the core data for the currently authenticated user session.
 * This is stored in AuthContext and localStorage.
 */
export interface AuthenticatedUser extends PublicProfile {
  venueManager: boolean;
}

/**
 * Represents the full, rich profile data for the logged-in user, including their venues and bookings.
 * Fetched for the main dashboard page.
 */
export interface FullUserProfile extends AuthenticatedUser {
  venues: Venue[];
  bookings: ProfileBooking[];
  _count: { venues: number; bookings: number };
}

// ============================================================================
// VENUE & BOOKING CORE MODELS
// ============================================================================

/**
 * Represents the fundamental Venue object without any extra relations.
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
    lat: number | null;
    lng: number | null;
  };
}

/**
 * Represents the fundamental booking object.
 */
export interface BaseBooking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  length?: number;
}

// ============================================================================
// COMPOSED & EXTENDED TYPES
// ============================================================================

/**
 * A booking as it appears in a VENUE's booking list. Includes the customer's public profile.
 * Used for `venue.bookings` array on the venue detail page.
 */
export interface VenueBooking extends BaseBooking {
  customer: PublicProfile;
}

/**
 * A booking as it appears in a USER's own booking list. Includes the venue's details.
 * Used for the `MyBookings` component on the dashboard.
 */
export interface ProfileBooking extends BaseBooking {
  venue: Venue;
}

/**
 * Represents a Venue that includes all possible relations: owner, bookings, and counts.
 * This is the primary type for your Venue Detail Page.
 */
export interface FullVenue extends Venue {
  owner?: PublicProfile;
  bookings: VenueBooking[];
  _count: {
    bookings: number;
  };
}

// ============================================================================
// API PAYLOADS & RESPONSE TYPES
// ============================================================================

/**
 * Defines the shape of the data sent to the /auth/login endpoint.
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Defines the shape of the data sent to the /auth/register endpoint.
 */
export interface RegisterPayload extends LoginPayload {
  name: string;
  venueManager?: boolean;
  avatar?: { url: string; alt?: string };
  banner?: { url: string; alt?: string };
  bio?: string;
}

/**
 * Defines the shape of the data sent to the API when creating a new booking.
 */
export interface BookingFormData {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
}

/**
 * Defines the shape of the data sent to the API when creating or updating a venue.
 */
export interface VenueFormData {
  name: string;
  description: string;
  media: { url: string; alt: string }[];
  price: number;
  maxGuests: number;
  rating?: number;
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  location: {
    address?: string | null;
    city?: string | null;
    zip?: string | null;
    country?: string | null;
    continent?: string | null;
    lat?: number;
    lng?: number;
  };
}

/**
 * Represents the full response from the /auth/login or /auth/register endpoint.
 */
export interface AuthResponse {
  data: AuthenticatedUser & { accessToken: string };
  meta: Record<string, never>;
}

/**
 * Represents the entire API response from fetching a list of venues.
 */
export interface VenuesApiResponse {
  data: Venue[];
  meta: PaginationMeta;
}

/**
 * Represents the Venue reponse with a list of customer bookings
 */
export interface VenueWithBookings extends Venue {
  bookings: VenueBooking[];
}

/**
 * Represents the entire API response from fetching a single venue.
 */
export interface SingleVenueApiResponse {
  data: FullVenue;
  meta: Record<string, never>;
}

/**
 * Represents the entire API response from fetching the user's full profile.
 */
export interface ProfileApiResponse {
  data: FullUserProfile;
  meta: Record<string, never>;
}
