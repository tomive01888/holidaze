import { Link } from "react-router-dom";
import { Star, UsersRound } from "lucide-react";
import type { Venue } from "../../../types";
import { formatCurrency } from "../../../utils/currencyUtils";

/**
 * Props for the `VenueCard` component.
 */
interface VenueCardProps {
  /**
   * The venue object containing all necessary data to render the card.
   *
   * @property {string} id - Unique identifier of the venue.
   * @property {string} name - Name of the venue. Defaults to "Untitled Venue" if missing.
   * @property {number} rating - Average rating of the venue (0–5). If 0, "N/A" is displayed.
   * @property {number} maxGuests - Maximum number of guests allowed.
   * @property {number} price - Price per night in the venue's currency.
   * @property {Array<{ url: string; alt?: string }>} [media] - Optional array of media objects; the first image is displayed. If missing, a placeholder image is shown.
   */
  venue: Venue;
}

/**
 * A card component that displays a summary of a venue, typically used in lists or grids.
 *
 * Features:
 * - Lazy-loads the first image from the venue's `media` array, falling back to a placeholder.
 * - Shows venue name, rating, maximum guests, and price per night.
 * - Fully keyboard-accessible and scrolls into view when focused.
 * - Handles missing or incomplete data gracefully.
 *
 * @example
 * ```tsx
 * <VenueCard venue={myVenue} />
 * ```
 *
 * @param {VenueCardProps} props - Props object containing a `venue`.
 * @returns {JSX.Element} The rendered venue card.
 */
const VenueCard: React.FC<VenueCardProps> = ({ venue, ...props }) => {
  const placeholderImage = "https://placehold.co/600x400/e2e8f0/475569?text=No+Image";
  const imageUrl = venue.media?.[0]?.url || placeholderImage;
  const imageAlt = venue.media?.[0]?.alt || venue.name || "Image of the venue";

  return (
    <Link
      to={`/venue/${venue.id}`}
      onFocus={(e) => e.currentTarget.scrollIntoView({ behavior: "smooth", block: "center" })}
      className="block group h-full focus:rounded-lg focus:outline-dashed focus:outline-offset-2 focus:outline-3 focus:outline-pink-400 focus:scale-103"
      {...props}
      tabIndex={0}
    >
      <div className="bg-neutral-700 relative rounded-lg shadow-lg shadow-black/30 overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-primary-800/50 group-hover:-translate-y-1 h-full flex flex-col">
        <img loading="lazy" src={imageUrl} alt={imageAlt} className="w-full h-48 object-cover" />
        <div className="p-4 flex-grow flex flex-col justify-between">
          <h3 className="text-xl font-bold truncate text-white">{venue.name || "Untitled Venue"}</h3>
          <div className="flex justify-between items-center mt-2 text-neutral-300 text-sm">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-1"
                aria-label={`Rating: ${venue.rating > 0 ? `${venue.rating.toFixed(1)} out of 5 stars` : "Not rated"}`}
              >
                <Star className="text-yellow-400 mb-1" aria-hidden="true" />
                <span>{venue.rating > 0 ? venue.rating.toFixed(1) : "N/A"}</span>
              </div>

              <span aria-hidden="true">·</span>

              <div className="flex items-center gap-1" aria-label={`Maximum ${venue.maxGuests} guests`}>
                <UsersRound aria-hidden="true" className="mb-1" />
                <span>{venue.maxGuests}</span>
              </div>
            </div>
            <p className="text-base font-semibold text-primary-400">{formatCurrency(venue.price)} / night</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VenueCard;
