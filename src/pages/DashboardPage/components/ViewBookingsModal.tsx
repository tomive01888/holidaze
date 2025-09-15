import React, { useState, useEffect, useMemo } from "react";
import { apiClient, ApiError } from "../../../api/apiClient";
import { endpoints } from "../../../constants/endpoints";
import type { FullVenue, VenueBooking } from "../../../types";
import BookingListItem from "./BookingListItem";
import Spinner from "../../../components/ui/Spinner";
import Modal from "../../../components/ui/Modal";
import { sortBookingsByDate } from "../../../utils/dateUtils";

interface ViewBookingsModalProps {
  venueId: string;
  venueName: string;
  onClose: () => void;
}

const ViewBookingsModal: React.FC<ViewBookingsModalProps> = ({ venueId, venueName, onClose }) => {
  const [bookings, setBookings] = useState<VenueBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const endpoint = `${endpoints.venues.byId(venueId)}?_bookings=true&_customer=true`;
        const response = await apiClient.get<{ data: FullVenue }>(endpoint);
        setBookings(response.data.bookings);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load bookings.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [venueId]);

  const upcomingBookings = useMemo(() => {
    const now = new Date();
    const futureBookings = bookings.filter((booking) => new Date(booking.dateTo) >= now);
    return sortBookingsByDate(futureBookings, "asc");
  }, [bookings]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-10">
          <Spinner text="Loading bookings..." />
        </div>
      );
    }
    if (error) {
      return <p className="text-center text-error">{error}</p>;
    }
    if (upcomingBookings.length === 0) {
      return (
        <p className="text-center text-lg text-neutral-700 py-10">There are no upcoming bookings for this venue.</p>
      );
    }
    return (
      <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {upcomingBookings.map((booking) => (
          <BookingListItem key={booking.id} booking={booking} />
        ))}
      </ul>
    );
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-3xl font-bold mb-1">Bookings for</h2>
      <h3 className="text-2xl text-neutral-700 font-bold mb-6">{venueName}</h3>
      {renderContent()}
    </Modal>
  );
};

export default ViewBookingsModal;
