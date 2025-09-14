import { Link } from "react-router-dom";
import { FaStar, FaUserFriends } from "react-icons/fa";
import type { Venue } from "../../../types";
import { formatCurrency } from "../../../utils/currencyUtils";

/**
 * Props for the VenueCard component.
 */
interface VenueCardProps {
  /**
   * The venue data object to display in the card.
   */
  venue: Venue;
}

/**
 * A card component to display a summary of a venue.
 * Designed to be accessible and robust, handling missing data gracefully.
 * Typically used inside lists of venues.
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
      <div className="bg-neutral-800 relative rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-primary-800/50 group-hover:-translate-y-1 h-full flex flex-col">
        <img src={imageUrl} alt={imageAlt} className="w-full h-48 object-cover" />
        <div className="p-4 flex-grow flex flex-col justify-between">
          <h3 className="text-xl font-bold truncate text-white">{venue.name || "Untitled Venue"}</h3>
          <div className="flex justify-between items-center mt-2 text-neutral-300 text-sm">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-1"
                aria-label={`Rating: ${venue.rating > 0 ? `${venue.rating.toFixed(1)} out of 5 stars` : "Not rated"}`}
              >
                <FaStar className="text-yellow-400 mb-1" aria-hidden="true" />
                <span>{venue.rating > 0 ? venue.rating.toFixed(1) : "N/A"}</span>
              </div>

              <span aria-hidden="true">·</span>

              <div className="flex items-center gap-1" aria-label={`Maximum ${venue.maxGuests} guests`}>
                <FaUserFriends aria-hidden="true" className="mb-1" />
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
