import React from "react";
import { Wifi, Coffee, Car, PawPrint } from "lucide-react";

interface AmenitiesProps {
  /**
   * Boolean flags indicating which amenities are available.
   */
  meta: {
    /** Whether free WiFi is available. */
    wifi: boolean;
    /** Whether free parking is available. */
    parking: boolean;
    /** Whether breakfast is included. */
    breakfast: boolean;
    /** Whether pets are allowed. */
    pets: boolean;
  };
}

/**
 * A mapping of amenity keys to their corresponding icon and display name.
 */
const amenityMap = {
  wifi: { icon: Wifi, name: "Free WiFi" },
  parking: { icon: Car, name: "Free Parking" },
  breakfast: { icon: Coffee, name: "Breakfast Included" },
  pets: { icon: PawPrint, name: "Pets Allowed" },
};

/**
 * Displays a list of amenities with icons, showing which are available or unavailable.
 *
 * Each amenity is rendered with:
 * - An icon (colored green if available, gray if unavailable)
 * - A label (struck through if unavailable)
 *
 * @component
 * @example
 * ```tsx
 * <Amenities meta={{ wifi: true, parking: false, breakfast: true, pets: false }} />
 * ```
 *
 * @param {AmenitiesProps} props - The props object.
 * @param {Object} props.meta - The availability state of each amenity.
 * @param {boolean} props.meta.wifi - Whether free WiFi is available.
 * @param {boolean} props.meta.parking - Whether free parking is available.
 * @param {boolean} props.meta.breakfast - Whether breakfast is included.
 * @param {boolean} props.meta.pets - Whether pets are allowed.
 */
const Amenities: React.FC<AmenitiesProps> = ({ meta }) => {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {Object.entries(amenityMap).map(([key, { icon: Icon, name }]) => {
        const isAvailable = meta[key as keyof typeof meta];
        return (
          <div key={key} className="flex items-center gap-3">
            <Icon className={isAvailable ? "text-green-500" : "text-neutral-400"} size={24} />
            <p
              aria-live="polite"
              aria-label={`${isAvailable ? name : `No ${name}`}`}
              className={`font-bold bg-white/80 w-full p-1 rounded shadow-md shadow-black/30
                ${isAvailable ? "text-neutral-800" : "text-neutral-400 line-through"}
              `}
            >
              {name}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Amenities;
