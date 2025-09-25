import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../../../api/apiClient";
import { endpoints } from "../../../constants/endpoints";
import type { VenueWithBookings } from "../../../types";
import ViewBookingsModal from "./ViewBookingsModal";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

/**
 * Props for the {@link VenueManagementCard} component.
 *
 * @typedef {Object} VenueManagementCardProps
 * @property {Venue} venue - The venue data to display and manage.
 */
interface VenueManagementCardProps {
  venue: VenueWithBookings;
}

/**
 * A card component for displaying and managing a single venue.
 *
 * @component
 * @param {VenueManagementCardProps} props - The props for the component.
 * @returns {JSX.Element} A venue card with edit, delete, and view bookings actions.
 *
 * @description
 * This card shows:
 * - The venue image and name (clickable, links to venue details).
 * - A delete button (hover-revealed on desktop, always visible on mobile).
 * - Buttons to edit the venue or view its bookings.
 *
 * It also manages:
 * - Delete confirmation via modal.
 * - View Bookings modal opening/closing.
 * - API call for deleting a venue with success/error toast notifications.
 *
 * @example
 * ```tsx
 * <VenueManagementCard venue={venue} />
 * ```
 */
const VenueManagementCard: React.FC<VenueManagementCardProps> = ({ venue }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Handles deleting the venue.
   *
   * @async
   * @returns {Promise<void>}
   *
   * @remarks
   * - Calls the API to delete the venue.
   * - Shows a toast notification on success or failure.
   * - Reloads the page after successful deletion.
   */
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiClient.delete(endpoints.venues.byId(venue.id));
      toast.success(`Venue "${venue.name}" deleted successfully.`);
      window.location.reload();
    } catch (error) {
      let errorMessage = "Failed to delete venue. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <div className="rounded-lg shadow-lg h-full flex flex-col text-lg bg-black">
        {/* --- Image and Title Section --- */}
        <Link
          to={`/venue/${venue.id}`}
          tabIndex={0}
          className="focus:outline-2 focus:outline-pink-400 focus:outline-offset-3 relative overflow-hidden rounded-lg"
        >
          <img
            tabIndex={-1}
            loading="lazy"
            src={venue.media[0]?.url || "https://placehold.co/600x400/e2e8f0/475569?text=No+Image"}
            alt={`view of ${venue.name}`}
            className="w-full h-56 object-cover transition-transform duration-300 bg-black/80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white truncate max-w-full pr-4">
            {venue.name}
          </h3>
        </Link>

        {/* --- Actions Section --- */}
        <div className="flex gap-2 p-2 sm:p-4 bg-neutral-100 flex-grow rounded-b-lg">
          <Link
            to={`/venue/edit/${venue.id}`}
            aria-label={`View details for venue ${venue.name}`}
            tabIndex={-1}
            className="w-full"
          >
            <Button variant="primary" size="sm" className="w-full">
              Edit Venue
            </Button>
          </Link>
          <Button variant="secondary" size="sm" className="w-full" onClick={() => setIsBookingsModalOpen(true)}>
            View Bookings
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteModalOpen(true)}
            className="!rounded-full w-fit sm:!px-4"
            aria-label={`Delete venue ${venue.name}`}
          >
            <Trash2 size={22} />
          </Button>
        </div>
      </div>

      {/* --- Delete Confirmation Modal --- */}
      {isDeleteModalOpen && (
        <Modal onClose={() => setIsDeleteModalOpen(false)} modalTitle={`Holidaze | Confirm deletion of ${venue.name}`}>
          <h2 className="text-2xl font-bold">Delete "{venue.name}"?</h2>
          <p className="my-4">
            Are you sure you want to delete this venue? This action is permanent and cannot be undone.
          </p>
          <div className="flex justify-end gap-4">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </Button>
          </div>
        </Modal>
      )}

      {/* --- View Bookings Modal --- */}
      {isBookingsModalOpen && (
        <ViewBookingsModal venueId={venue.id} venueName={venue.name} onClose={() => setIsBookingsModalOpen(false)} />
      )}
    </>
  );
};

export default VenueManagementCard;
