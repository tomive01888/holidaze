import React from "react";
import { formatDate } from "../../../utils/dateUtils";
import type { VenueBooking } from "../../../types";
import { FaCalendar, FaHashtag, FaUser } from "react-icons/fa";

interface BookingListItemProps {
  booking: VenueBooking;
}

const BookingListItem: React.FC<BookingListItemProps> = ({ booking }) => {
  return (
    <li className="p-4 border rounded-lg bg-neutral-50">
      <div className="flex items-start gap-4">
        <img
          src={booking.customer.avatar?.url || "/default-avatar.png"}
          alt={booking.customer.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-grow">
          <h4 className="font-bold text-lg">{booking.customer.name}</h4>
          <p className="text-md text-neutral-500">{booking.customer.email}</p>
          <div className="mt-2 text-md text-neutral-700 space-y-1">
            <p className="flex items-center gap-2">
              <FaCalendar size={14} />
              <span>
                {formatDate(booking.dateFrom)} to {formatDate(booking.dateTo)}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <FaUser size={14} />
              <span>{booking.guests} Guest(s)</span>
            </p>
            <p className="flex items-center gap-2 font-mono text-xs">
              <FaHashtag size={14} />
              <span>{booking.id}</span>
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default BookingListItem;
