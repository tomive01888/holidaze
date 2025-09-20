import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/dateUtils";
import type { ProfileBooking } from "../../../types";

/**
 * Props for the `BookingCard` component.
 * @typedef {Object} BookingCardProps
 * @property {ProfileBooking} booking - The booking object containing venue details, dates, and guest count.
 */
interface BookingCardProps {
  booking: ProfileBooking;
}

/**
 * Displays a single booking in a card layout with venue image, location, description,
 * and check-in/check-out details. Each card links to the venue's details page.
 */
const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  return (
    <div className="flex flex-col md:flex-row items-start justify-start gap-4 p-4 bg-white border rounded-lg shadow-sm min-h-60">
      <img
        loading="lazy"
        src={booking.venue.media[0]?.url || "https://via.placeholder.com/400x300"}
        alt={`view of ${booking.venue.name}`}
        className="h-48 aspect-square object-cover rounded-md bg-black/80"
      />
      <div className="flex-grow flex flex-col gap-1 text-black">
        <h3 className="text-2xl font-bold text-pretty">
          <Link
            to={`/venue/${booking.venue.id}`}
            className="hover:underline hover:text-blue-500 focus:text-blue-500 focus:underline"
          >
            {booking.venue.name}
          </Link>
        </h3>
        <p className="text-neutral-500 text-md mt-1">
          {booking.venue.location?.city !== null ? (
            <span>
              {booking.venue.location.city}, {booking.venue.location.country}
            </span>
          ) : (
            "Not stated"
          )}
        </p>
        <div className="h-0.5 w-full border-t-1 border-t-black mt-2 pb-2" />
        <p>
          <strong>Check-in:</strong> {formatDate(booking.dateFrom)}
        </p>
        <p>
          <strong>Check-out:</strong> {formatDate(booking.dateTo)}
        </p>
        <p>
          <strong>Guests:</strong> {booking.guests}
        </p>
      </div>
    </div>
  );
};

export default BookingCard;
