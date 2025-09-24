import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import BookingCard from "./BookingsCard";
import { sortBookingsByDate } from "../../../utils/dateUtils";
import type { ProfileBooking } from "../../../types";
import { motion } from "motion/react";

/**
 * Props for the {@link MyBookings} component.
 *
 * @typedef {Object} MyBookingsProps
 * @property {ProfileBooking[]} bookings - A list of bookings associated with the current user.
 */
interface MyBookingsProps {
  bookings: ProfileBooking[];
}

/**
 * Displays a user's bookings, separated into **upcoming trips** and **past trips**.
 *
 * @component
 *
 * @param {MyBookingsProps} props - The props for the component.
 * @returns {JSX.Element} A UI section that displays upcoming and past bookings in a grid layout.
 *
 * @description
 * This component:
 * - Divides bookings into **upcoming** and **past** based on the `dateTo` property.
 * - Sorts upcoming bookings in ascending order (soonest first).
 * - Sorts past bookings in descending order (most recent first).
 * - Shows an empty state message if there are no bookings at all.
 * - Encourages the user to plan a trip if no upcoming bookings exist.
 *
 * @example
 * ```tsx
 * import MyBookings from "./MyBookings";
 *
 * const userBookings: ProfileBooking[] = [
 *   {
 *     id: "b1",
 *     dateFrom: "2025-09-15",
 *     dateTo: "2025-09-20",
 *     venue: { id: "v1", name: "Mountain Lodge", ... },
 *   },
 *   {
 *     id: "b2",
 *     dateFrom: "2024-08-10",
 *     dateTo: "2024-08-15",
 *     venue: { id: "v2", name: "Seaside Cabin", ... },
 *   },
 * ];
 *
 * <MyBookings bookings={userBookings} />
 * ```
 */
const MyBookings: React.FC<MyBookingsProps> = ({ bookings }) => {
  const { upcomingBookings, pastBookings } = useMemo(() => {
    const now = new Date();
    const upcoming: ProfileBooking[] = [];
    const past: ProfileBooking[] = [];

    bookings.forEach((booking) => {
      if (new Date(booking.dateTo) >= now) {
        upcoming.push(booking);
      } else {
        past.push(booking);
      }
    });

    return {
      upcomingBookings: sortBookingsByDate(upcoming, "asc"),
      pastBookings: sortBookingsByDate(past, "desc"),
    };
  }, [bookings]);

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-neutral-100 rounded-lg">
        <h2 className="text-3xl font-bold text-neutral-700">No Bookings Yet</h2>
        <p className="text-neutral-500 mt-2 text-lg">
          When you book a stay at one of our venues, your trip details will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 bg-black/0">
      {/* --- Upcoming Bookings Section --- */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Upcoming Trips</h2>
        {upcomingBookings.length > 0 ? (
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingBookings.map((booking) => (
              <motion.li
                key={booking.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.3 }}
              >
                <BookingCard booking={booking} />
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-neutral-500 p-4 bg-neutral-50 rounded-md">
            You have no upcoming bookings. Time to plan your next adventure!{" "}
            <Link to={"/"} className="text-blue-500 hover:underline">
              Go home and browse!
            </Link>
          </p>
        )}
      </section>

      {/* --- Past Bookings Section --- */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Past Trips</h2>
        {pastBookings.length > 0 ? (
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pastBookings.map((booking) => (
              <motion.li
                key={booking.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.3 }}
              >
                <BookingCard booking={booking} />
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-neutral-500 text-xl p-4 bg-neutral-50 rounded-md">You have no past bookings yet.</p>
        )}
      </section>
    </div>
  );
};

export default MyBookings;
