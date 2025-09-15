import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import BookingCard from "./BookingsCard";
import { sortBookingsByDate } from "../../../utils/dateUtils";
import type { ProfileBooking } from "../../../types";

interface MyBookingsProps {
  bookings: ProfileBooking[];
}

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
        <h3 className="text-2xl font-bold mb-4">Upcoming Trips</h3>
        {upcomingBookings.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
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
        <h3 className="text-2xl font-bold mb-4">Past Trips</h3>
        {pastBookings.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2  gap-4">
            {pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-xl p-4 bg-neutral-50 rounded-md">You have no past bookings yet.</p>
        )}
      </section>
    </div>
  );
};

export default MyBookings;
