import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../../../api/apiClient";
import { endpoints } from "../../../constants/endpoints";
import { useAuth } from "../../../hooks/useAuth";
import type { FullVenue } from "../../../types";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { toast } from "react-toastify";
import userRoundCircle from "../../../assets/circleUserRound.svg";

/**
 * Props for the `VenueFooter` component.
 *
 * @interface VenueFooterProps
 * @property {FullVenue} venue - The full venue object containing all relevant data,
 * including owner information, images, and metadata. Used to display either owner
 * management controls (if the user is the owner) or a public "Meet the Host" card.
 */
interface VenueFooterProps {
  venue: FullVenue;
}

/**
 * Renders the footer section for a venue page.
 * - If the logged-in user owns the venue, shows management actions (edit/delete).
 * - If the user does not own the venue, shows a "Meet the Host" card.
 *
 * @component
 * @param {Object} props
 * @param {FullVenue} props.venue - The venue object with owner information and metadata.
 */
const VenueFooter: React.FC<VenueFooterProps> = ({ venue }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Verifies if logged user is the owner of the venue they have visited.
   * Grants access to venue manager controls if they match.
   */
  const isOwner = user && user.name === venue.owner?.name;

  /**
   * Handles the deletion of the venue by calling the API and redirecting the user.
   * Displays success/error toasts.
   *
   * @async
   * @returns {Promise<void>}
   */
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiClient.delete(endpoints.venues.byId(venue.id));
      toast.success("Venue successfully deleted.");
      navigate("/");
    } catch (error) {
      let errorMessage = "Failed to delete venue. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isOwner) {
    return (
      <div className="mt-10 p-6 border-2 border-dashed border-neutral-400 bg-primary-50 rounded-lg text-center text-neutral-100 bg-neutral-700/40 shadow-lg shadow-black/30">
        <h3 className="text-2xl font-bold">You are the owner of this venue</h3>
        <p className="text-neutral-100 mt-2">Manage your property listing and view its bookings from your dashboard.</p>
        <div className="flex justify-center gap-4 mt-6">
          <Link to={`/venue/edit/${venue.id}`} tabIndex={-1}>
            <Button aria-label="Click to edit venue" variant="primary">
              Edit Venue
            </Button>
          </Link>
          <Button aria-label="Click to delete venue" variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
            Delete Venue
          </Button>
        </div>

        {isDeleteModalOpen && (
          <Modal
            onClose={() => setIsDeleteModalOpen(false)}
            aria-labelledby="delete-modal-title"
            modalTitle={`Holidaze | Confirm deletion of ${venue.name}`}
          >
            <h2 id="delete-modal-title" className="text-2xl font-bold">
              Delete "{venue.name}"?
            </h2>
            <p className="my-4">
              This action is permanent and cannot be undone. All data associated with this venue will be lost.
            </p>
            <div className="flex justify-end gap-4">
              <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                aria-label="Delete this venue permanently"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Venue"}
              </Button>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold border-b pb-3 mb-4">Meet the Host</h2>
      <div
        className="relative p-6 rounded-lg overflow-hidden shadow-lg shadow-black/30"
        style={{
          backgroundImage: `url(${venue.owner?.banner?.url})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
        }}
      >
        {/* Blurred background overlay */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

        {/* Content */}
        <div className="relative flex items-center gap-4">
          <img
            src={venue.owner?.avatar?.url || userRoundCircle}
            alt={venue.owner?.avatar?.alt}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-white"
          />
          <div>
            <h3 className="text-2xl font-bold text-neutral-900">{venue.owner?.name}</h3>
            <p className="text-neutral-600">{venue.owner?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueFooter;
