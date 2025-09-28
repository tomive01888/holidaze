import React from "react";
import { formatDate } from "../../../utils/dateUtils";
import type { VenueBooking } from "../../../types";
import { Calendar, Hash, User } from "lucide-react";

/**
 * Props for the `BookingListItem` component.
 * @typedef {Object} BookingListItemProps
 * @property {VenueBooking} booking - A single venue booking containing customer details, dates, and guest count.
 */
interface BookingListItemProps {
  booking: VenueBooking;
}

/**
 * Renders a list item displaying a venue booking with customer avatar, name, email,
 * booking date range, number of guests, and booking ID.
 */
const BookingListItem: React.FC<BookingListItemProps> = ({ booking }) => {
  return (
    <li className="py-2 px-4 border rounded-lg bg-neutral-50 flex flex-col md:flex-row justify-between drop-shadow-md drop-shadow-black/25">
      <div className="flex justify-start gap-3">
        <img
          src={booking.customer.avatar?.url || "/default-avatar.png"}
          alt={booking.customer?.name}
          className="w-18 h-18 rounded-full object-cover bg-black/50"
        />
        <div className="mt-2">
          <h4 className="font-bold text-lg">{booking.customer.name}</h4>
          <p className="text-md text-neutral-500">{booking.customer.email}</p>
        </div>
      </div>

      <div className="mt-2 text-md text-neutral-700 space-y-1 text-sm md:text-base">
        <p className="flex items-center gap-2">
          <Calendar size={18} />
          <span className="font-bold">{formatDate(booking.dateFrom)}</span> to{" "}
          <span className="font-bold">{formatDate(booking.dateTo)}</span>
        </p>
        <p className="flex items-center gap-2">
          <User size={18} />
          <span>{booking.guests} Guest(s)</span>
        </p>
        <p className="flex items-center gap-2">
          <Hash size={18} />
          <span>{booking.id}</span>
        </p>
      </div>
    </li>
  );
};

export default BookingListItem;
