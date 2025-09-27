import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/dateUtils";
import type { ProfileBooking } from "../../../types";

interface BookingCardProps {
  /** Booking object containing venue details, dates, and guests */
  booking: ProfileBooking;
  /** Optional CSS classes for additional styling */
  className?: string;
}

/**
 * `BookingCard` renders a card-style link for a single booking.
 *
 * It displays:
 * - The venue image and name
 * - The location (city and country, if available)
 * - Booking details: check-in, check-out, and guest count
 *
 * The entire card is clickable and links to the venue details page.
 *
 * @component
 * @example
 * ```tsx
 * <BookingCard booking={myBooking} className="mb-4" />
 * ```
 */
const BookingCard: React.FC<BookingCardProps> = ({ booking, className }) => {
  return (
    <Link
      to={`/venue/${booking.venue.id}`}
      className={`grid grid-cols-5 sm:grid-cols-7 grid-rows-[auto_auto] sm:grid-rows-1 gap-2 p-2 bg-neutral-100 border border-neutral-800 rounded-lg shadow-xl 
                  ${className}`}
    >
      {/* 1. Image: Constrained to a very small, fixed height and width */}
      <img
        loading="lazy"
        src={booking.venue.media[0]?.url || "https://via.placeholder.com/100x100"}
        alt={`view of ${booking.venue.name}`}
        className="w-full aspect-video sm:h-16 object-cover rounded-sm flex-shrink-0 row-start-2 col-start-1 col-span-2 sm:col-span-1 sm:row-start-1"
      />

      <div className="flex flex-col flex-shrink-0 col-span-5 sm:col-start-2 sm:row-start-1">
        <h3 className="textl-lg md:text-2xl font-semibold truncate text-black">{booking.venue.name}</h3>
        <p className="text-neutral-600 text-sm md:text-lg truncate">
          {booking.venue.location?.city ? `${booking.venue.location?.city}` : "N/A"}
          {booking.venue.location?.city && booking.venue.location?.country ? "," : ""}
          {booking.venue.location?.country ? ` ${booking.venue.location?.country}` : " N/A"}
        </p>
      </div>

      <div className="flex flex-col text-sm flex-shrink-0 bg-neutral-50 rounded p-1 text-black row-start-2 col-start-3 col-span-3 sm:row-start-1 sm:col-start-6 drop-shadow-sm drop-shadow-black/30">
        <p>
          Check-in: <strong className="text-neutral-600">{formatDate(booking.dateFrom)}</strong>
        </p>
        <p>
          Check-out: <strong className="text-neutral-600">{formatDate(booking.dateTo)}</strong>
        </p>
        <p>
          Guests: <strong className="text-neutral-600">{booking.guests}</strong>
        </p>
      </div>
    </Link>
  );
};

export default BookingCard;
