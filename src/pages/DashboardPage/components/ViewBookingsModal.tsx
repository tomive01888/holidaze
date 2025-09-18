/**
 * @fileoverview A modal component to display a list of upcoming bookings for a specific venue.
 * @version 1.0
 * @author Your Name <your.email@example.com>
 * @license MIT
 */

import React, { useState, useEffect, useMemo } from "react";
import { apiClient, ApiError } from "../../../api/apiClient";
import { endpoints } from "../../../constants/endpoints";
import type { FullVenue, VenueBooking } from "../../../types";
import BookingListItem from "./BookingListItem";
import Spinner from "../../../components/ui/Spinner";
import Modal from "../../../components/ui/Modal";
import { sortBookingsByDate } from "../../../utils/dateUtils";

/**
 * @interface ViewBookingsModalProps
 * @description Props for the ViewBookingsModal component.
 * @property {string} venueId - The unique identifier of the venue whose bookings are to be fetched and displayed.
 * @property {string} venueName - The name of the venue, displayed in the modal's header.
 * @property {() => void} onClose - A callback function to be executed when the modal is requested to close.
 */
interface ViewBookingsModalProps {
  venueId: string;
  venueName: string;
  onClose: () => void;
}

/**
 * @function ViewBookingsModal
 * @description A modal component that fetches and displays upcoming bookings for a given venue.
 * It handles different states such as loading, errors, and an empty list of bookings.
 * @param {ViewBookingsModalProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered modal component.
 */
const ViewBookingsModal: React.FC<ViewBookingsModalProps> = ({ venueId, venueName, onClose }) => {
  const [bookings, setBookings] = useState<VenueBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * @effect
   * @description Fetches the bookings for the specified venue when the component mounts or when the `venueId` changes.
   * It includes related customer data to display in the list.
   * @dependency {string} venueId - Triggers a re-fetch when a new venue ID is provided.
   */
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

  /**
   * @memo
   * @description Filters and sorts the fetched bookings to only include upcoming bookings.
   * This is memoized to prevent re-computation unless the `bookings` state changes.
   * @dependency {VenueBooking[]} bookings - Recalculates the list when the main bookings state is updated.
   * @returns {VenueBooking[]} A sorted array of upcoming bookings.
   */
  const upcomingBookings = useMemo(() => {
    const now = new Date();
    const futureBookings = bookings.filter((booking) => new Date(booking.dateTo) >= now);
    return sortBookingsByDate(futureBookings, "asc");
  }, [bookings]);

  /**
   * @function renderContent
   * @description A helper function to conditionally render the modal's content based on the current state (loading, error, no bookings, or displaying list).
   * @returns {React.ReactElement} The appropriate JSX content to display inside the modal.
   */
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-10" aria-busy="true" role="status">
          <Spinner text="Loading bookings..." />
        </div>
      );
    }
    if (error) {
      return (
        <p className="text-center text-error" role="alert">
          {error}
        </p>
      );
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
    <Modal
      onClose={onClose}
      aria-labelledby="bookingsModalTitle"
      modalTitle={`Holidaze | Viewing bookings for ${venueName}`}
    >
      <h2 id="bookingsModalTitle" className="text-3xl font-bold mb-1">
        Bookings for
      </h2>
      <h3 className="text-2xl text-neutral-700 font-bold mb-6">{venueName}</h3>
      {renderContent()}
    </Modal>
  );
};

export default ViewBookingsModal;
