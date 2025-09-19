import React from "react";
import { Wifi, Coffee, Car, PawPrint } from "lucide-react";

interface AmenitiesProps {
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
}

const amenityMap = {
  wifi: { icon: Wifi, name: "Free WiFi" },
  parking: { icon: Car, name: "Free Parking" },
  breakfast: { icon: Coffee, name: "Breakfast Included" },
  pets: { icon: PawPrint, name: "Pets Allowed" },
};

const Amenities: React.FC<AmenitiesProps> = ({ meta }) => {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {Object.entries(amenityMap).map(([key, { icon: Icon, name }]) => {
        const isAvailable = meta[key as keyof typeof meta];
        return (
          <div key={key} className="flex items-center gap-3" title={name}>
            <Icon
              className={`
                ${isAvailable ? "text-green-500" : "text-neutral-400"}
              `}
              size={24}
            />
            <p
              className={`font-bold bg-white/80 w-full p-1 rounded
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
