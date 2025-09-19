import React from "react";
import type { FullVenue } from "../../../types";
import { formatCurrency } from "../../../utils/currencyUtils";
import { Star, User } from "lucide-react";

interface VenueInformationProps {
  /**
   * The full venue object containing details such as price, rating, and guest capacity.
   */
  venue: FullVenue;
}

/**
 * Displays key details about a venue, including:
 * - **Price per night** (formatted as a localized currency string)
 * - **Average rating** (with a star icon if available)
 * - **Maximum guest capacity** (with a guest icon)
 *
 * This component is designed with semantic HTML and ARIA attributes to improve accessibility.
 *
 * @component
 * @example
 * ```tsx
 * import type { FullVenue } from "../../../types";
 *
 * const mockVenue: FullVenue = {
 *   id: "123",
 *   name: "Cozy Mountain Cabin",
 *   price: 120,
 *   rating: 4.5,
 *   maxGuests: 6,
 *   // ...other FullVenue fields
 * };
 *
 * <VenueInformation venue={mockVenue} />
 * ```
 *
 * @param {VenueInformationProps} props - Props for the VenueInformation component.
 * @param {FullVenue} props.venue - The venue data object containing price, rating, and guest capacity.
 *
 * @returns {JSX.Element} A styled section containing venue details, formatted for readability and accessibility.
 */
const VenueInformation: React.FC<VenueInformationProps> = ({ venue }) => {
  return (
    <section
      className="p-6 border rounded-lg bg-white shadow-md text-black"
      aria-labelledby="venue-information-heading"
    >
      <h2 id="venue-information-heading" className="text-2xl font-bold mb-4">
        Venue Details
      </h2>

      {/* Definition list for semantic grouping of venue details */}
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
