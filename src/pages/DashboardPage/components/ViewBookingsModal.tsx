import React, { useState, useEffect, useMemo } from "react";
import { apiClient, ApiError } from "../../../api/apiClient";
import { endpoints } from "../../../constants/endpoints";
import type { FullVenue, VenueBooking } from "../../../types";
import BookingListItem from "./BookingListItem";
import Spinner from "../../../components/ui/Spinner";
import Modal from "../../../components/ui/Modal";
import { sortBookingsByDate } from "../../../utils/dateUtils";

interface ViewBookingsModalProps {
  /** ID of the venue whose bookings should be displayed */
  venueId: string;
  /** Display name of the venue */
  venueName: string;
  /** Callback fired when the modal is closed */
  onClose: () => void;
}

/**
 * A modal component for viewing a venue's bookings.
 *
 * Fetches bookings from the API and allows toggling between
 * upcoming-only and all bookings (upcoming + past).
 */
const ViewBookingsModal: React.FC<ViewBookingsModalProps> = ({ venueId, venueName, onClose }) => {
  /** List of bookings associated with the venue */
  const [bookings, setBookings] = useState<VenueBooking[]>([]);
  /** Loading state for API fetch */
  const [isLoading, setIsLoading] = useState(true);
  /** Error message, if fetching bookings fails */
  const [error, setError] = useState<string | null>(null);
  /** Whether to show all bookings (true) or only upcoming bookings (false) */
  const [showAll, setShowAll] = useState(false);

  /**
   * Fetch bookings from the API when the component mounts or venueId changes.
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
   * Split bookings into upcoming and past,
   * then sort them appropriately.
   */
  const { upcomingBookings, pastBookings } = useMemo(() => {
    const now = new Date();
    const future = bookings.filter((b) => new Date(b.dateTo) >= now);
    const past = bookings.filter((b) => new Date(b.dateTo) < now);
    return {
      upcomingBookings: sortBookingsByDate(future, "asc"),
      pastBookings: sortBookingsByDate(past, "desc"),
    };
  }, [bookings]);

  /**
   * Render a list of bookings or a fallback message if empty.
   *
   * @param list - The list of bookings to render
   * @param emptyText - Message shown if no bookings are available
   */
  const renderBookingsList = (list: VenueBooking[], emptyText: string) => {
    if (list.length === 0) {
      return <p className="text-center text-neutral-500 py-6">{emptyText}</p>;
    }
    return (
      <ul className="space-y-4">
        {list.map((booking) => (
          <BookingListItem key={booking.id} booking={booking} />
        ))}
      </ul>
    );
  };

  /**
   * Render modal body content based on loading/error state
   * and whether to show upcoming-only or all bookings.
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

    if (showAll) {
      return (
        <div className="space-y-8 max-h-[45vh] overflow-y-auto pr-2">
          <div>
            <h4 className="text-lg font-semibold mb-2">Upcoming</h4>
            {renderBookingsList(upcomingBookings, "No upcoming bookings.")}
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Past</h4>
            {renderBookingsList(pastBookings, "No past bookings.")}
          </div>
        </div>
      );
    }

    // default (upcoming only)
    if (upcomingBookings.length === 0) {
      return (
        <p className="text-center text-lg text-neutral-700 py-10">There are no upcoming bookings for this venue.</p>
      );
    }
    return (
      <div className="max-h-[60vh] overflow-y-auto pr-2">
        {renderBookingsList(upcomingBookings, "No upcoming bookings.")}
      </div>
    );
  };

  return (
    <Modal
      onClose={onClose}
      closeOnBackdropClick
      aria-labelledby="bookingsModalTitle"
      modalTitle={`Holidaze | Viewing bookings for ${venueName}`}
    >
      <h2 id="bookingsModalTitle" className="text-3xl font-bold mb-1">
        Bookings for
      </h2>
      <h3 className="text-2xl text-neutral-700 font-bold mb-6">{venueName}</h3>

      {renderContent()}

      {!isLoading && bookings.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="px-4 py-2 rounded-md bg-neutral-200 hover:bg-neutral-300 text-sm font-semibold"
          >
            {showAll ? "View upcoming only" : `View all (${bookings.length})`}
          </button>
        </div>
      )}
    </Modal>
  );
};

export default ViewBookingsModal;
