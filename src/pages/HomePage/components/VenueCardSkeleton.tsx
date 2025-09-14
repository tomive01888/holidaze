/**
 * VenueCardSkeleton.tsx
 * A skeleton placeholder for VenueCard while data is loading.
 */

import React from "react";

interface VenueCardSkeletonProps {
  /**
   * Optional className for styling
   */
  className?: string;
}

const VenueCardSkeleton: React.FC<VenueCardSkeletonProps> = ({ className }) => {
  return (
    <div
      className={`bg-neutral-700 animate-pulse rounded-lg shadow-lg overflow-hidden h-full flex flex-col ${
        className || ""
      }`}
    >
      {/* Image placeholder */}
      <div className="w-full h-48 bg-neutral-600" />

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-2">
        {/* Venue name */}
        <div className="h-6 bg-neutral-500 rounded w-3/4"></div>

        {/* Rating & guests */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-3">
            <div className="h-4 w-12 bg-neutral-500 rounded"></div>
            <div className="h-4 w-6 bg-neutral-500 rounded"></div>
          </div>
          <div className="h-5 w-16 bg-primary-400 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default VenueCardSkeleton;
