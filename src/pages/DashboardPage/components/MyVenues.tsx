import React from "react";
import { Link } from "react-router-dom";
import type { Venue } from "../../../types";
import Button from "../../../components/ui/Button";
import VenueManagementCard from "./VenueManagerCard";
import { motion } from "motion/react";

/**
 * Props for the {@link MyVenues} component.
 *
 * @typedef {Object} MyVenuesProps
 * @property {Venue[]} venues - An array of venues owned by the logged-in user.
 */
interface MyVenuesProps {
  venues: Venue[];
}

/**
 * A component that displays all venues owned by the current user.
 *
 * @component
 *
 * @param {MyVenuesProps} props - The props for the component.
 * @returns {JSX.Element} A section displaying the user's venues or an empty state message.
 *
 * @description
 * This component:
 * - Displays a **"Create New Venue"** button that links to the venue creation page.
 * - If venues are available, it renders a responsive grid of `VenueManagementCard` components.
 * - If no venues exist, it displays a friendly empty state encouraging the user to create one.
 *
 * @example
 * ```tsx
 * import MyVenues from "./MyVenues";
 *
 * const userVenues: Venue[] = [
 *   { id: "1", name: "City Hall", description: "Downtown venue", ... },
 *   { id: "2", name: "Open Air Theater", description: "Outdoor stage", ... }
 * ];
 *
 * <MyVenues venues={userVenues} />
 * ```
 */
const MyVenues: React.FC<MyVenuesProps> = ({ venues }) => {
  return (
    <div className="bg-black/0">
      {/* Create New Venue Button */}
      <div className="flex justify-end mb-6">
        <Link to="/venue/create" tabIndex={-1}>
          <Button variant="primary" size="lg">
            + Create New Venue
          </Button>
        </Link>
      </div>

      {/* Display list of venues or empty state */}
      {venues.length > 0 ? (
        <div>
          <h2 className="text-3xl font-bold text-neutral-100 col-span-full">Venues you own</h2>

          {/* Render a card for each venue */}
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue) => (
              <motion.li
                key={venue.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <VenueManagementCard venue={venue} />
              </motion.li>
            ))}
          </ul>
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
