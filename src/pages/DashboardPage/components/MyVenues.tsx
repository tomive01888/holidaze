import React from "react";
import { Link } from "react-router-dom";
import type { Venue } from "../../../types";
import Button from "../../../components/ui/Button";


interface MyVenuesProps {
  venues: Venue[];
}

const MyVenues: React.FC<MyVenuesProps> = ({ venues }) => {
  return (
    <div className="bg-black/0">
      <div className="flex justify-end mb-6">
        <Link to="/venue/create">
          <Button variant="primary" size="lg">
            + Create New Venue
          </Button>
        </Link>
      </div>

      {venues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <h2
            className="text-3xl font-bold text-neutral-100 col-span-3
          "
          >
            Venues you own
          </h2>

          {venues.map((venue) => (
            <VenueManagementCard key={venue.id} venue={venue} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-neutral-100 rounded-lg">
          <h2 className="text-2xl font-bold text-neutral-700">No Venues Yet</h2>
          <p className="text-neutral-500 mt-2 text-lg">
            Click the "Create New Venue" button to get started and list your first property.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyVenues;
