import React from "react";
import { Link } from "react-router-dom";
import { truncateText } from "../../../utils/stringUtils";
import { formatDate } from "../../../utils/dateUtils";
import type { ProfileBooking } from "../../../types";

interface BookingCardProps {
  booking: ProfileBooking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white border rounded-lg shadow-sm">
      <Link to={`/venue/${booking.venue.id}`} className="md:w-1/3 flex-shrink-0">
        <img
          src={booking.venue.media[0]?.url || "https://via.placeholder.com/400x300"}
          alt={`view of ${booking.venue.name}`}
          className="w-full h-48 aspect-square md:h-full object-cover rounded-md"
        />
      </Link>
      <div className="flex-grow flex flex-col text-black">
        <div>
          <h3 className="text-2xl font-bold">
            <Link to={`/venue/${booking.venue.id}`} className="hover:underline">
              {booking.venue.name}
            </Link>
          </h3>
          <p className="text-neutral-500 text-md mt-1">
            {booking.venue.location.city}, {booking.venue.location.country}
          </p>
          <p className="mt-2 text-neutral-600 text-md">{truncateText(booking.venue.description, 120)}</p>
        </div>
        <div className="mt-4 pt-4 border-t flex-grow flex flex-col justify-end">
          <div className="space-y-1 text-md">
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
      </div>
    </div>
  );
};

export default BookingCard;
