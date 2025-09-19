import React from "react";
import type { FullVenue } from "../../../types";
import { formatCurrency } from "../../../utils/currencyUtils";
import { Star, User } from "lucide-react";

interface VenueInformationProps {
  venue: FullVenue;
}

/**
 * A component that displays key summary information about a venue,
 * such as price, rating, and guest capacity, in an accessible format.
 */
const VenueInformation: React.FC<VenueInformationProps> = ({ venue }) => {
  return (
    <section
      className="p-6 border rounded-lg bg-white shadow-md text-black"
      aria-labelledby="venue-information-heading"
    >
      <h3 id="venue-information-heading" className="text-2xl font-bold mb-4">
        Venue Details
      </h3>
      <dl className="grid grid-cols-3 gap-4 text-center">
        {/* --- Price --- */}
        <div className="flex flex-col items-center">
          <dt className="text-md text-neutral-500 order-2">per night</dt>
          <dd
            className="font-bold text-xl order-1 flex items-center gap-2"
            aria-label={`Price: ${venue.price} dollars per night`}
          >
            {formatCurrency(venue.price)}
          </dd>
        </div>

        {/* --- Rating --- */}
        <div className="flex flex-col items-center">
          <dt className="text-md text-neutral-500 order-2">Rating</dt>
          <dd
            className="font-bold text-xl order-1 flex items-center gap-1"
            aria-label={`Rating: ${
              venue.rating > 0 ? `${venue.rating} out of 5 stars` : "This venue is new and has not been rated yet"
            }`}
          >
            {venue.rating > 0 ? venue.rating : "No rating"}
            {venue.rating > 0 && <Star size={16} className="text-yellow-500 fill-current" aria-hidden="true" />}
          </dd>
        </div>

        {/* --- Max Guests --- */}
        <div className="flex flex-col items-center">
          <dt className="text-md text-neutral-500 order-2">Max Guests</dt>
          <dd
            className="font-bold text-xl order-1 flex items-center gap-2"
            aria-label={`Maximum capacity: ${venue.maxGuests} guests`}
          >
            <User className="text-blue-600" size={24} aria-hidden="true" />
            {venue.maxGuests}
          </dd>
        </div>
      </dl>
    </section>
  );
};

export default VenueInformation;
