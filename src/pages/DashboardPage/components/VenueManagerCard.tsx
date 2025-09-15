import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../../../api/apiClient";
import { endpoints } from "../../../constants/endpoints";
import type { Venue } from "../../../types";
import ViewBookingsModal from "./ViewBookingsModal";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";

interface VenueManagementCardProps {
  venue: Venue;
}

const VenueManagementCard: React.FC<VenueManagementCardProps> = ({ venue }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiClient.delete(endpoints.venues.byId(venue.id));
      toast.success(`Venue "${venue.name}" deleted successfully.`);
      window.location.reload();
    } catch (error) {
      let errorMessage = "Booking failed. Please try again.";
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
      <div className="rounded-lg overflow-hidden shadow-lg h-full flex flex-col text-lg">
        {/* --- Image and Title Section (The visual part) --- */}
        <div className="relative group">
          <Link to={`/venue/${venue.id}`} className="block">
            <img
              src={venue.media[0]?.url || "https://via.placeholder.com/400x300"}
              alt={`view of ${venue.name}`}
              className="w-full h-56 object-cover transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white truncate max-w-full pr-4">
              {venue.name}
            </h3>
          </Link>

          {/* --- Delete Icon (Always visible on mobile, hover on desktop) --- */}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="absolute top-3 right-3 bg-red-600/80 text-white p-2 rounded-full 
                       transition-opacity duration-300 hover:bg-red-700 hover:scale-110 
                       lg:opacity-0 lg:group-hover:opacity-100" // The magic!
            aria-label={`Delete venue ${venue.name}`}
          >
            <FaTrashAlt size={18} />
          </button>
        </div>

        {/* --- ACTIONS SECTION (Always visible on mobile, replaces hover on desktop) --- */}
        <div className="p-4 bg-white flex-grow flex flex-col justify-end">
          <div className="flex flex-col gap-3">
            <Link to={`/venue/edit/${venue.id}`}>
              <Button variant="primary" className="w-full">
                Edit Venue
              </Button>
            </Link>
            <Button variant="secondary" className="w-full" onClick={() => setIsBookingsModalOpen(true)}>
              View Bookings
            </Button>
          </div>
        </div>
      </div>

      {/* --- Delete Confirmation Modal --- */}
      {isDeleteModalOpen && (
        <Modal onClose={() => setIsDeleteModalOpen(false)}>
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

      {isBookingsModalOpen && (
        <ViewBookingsModal venueId={venue.id} venueName={venue.name} onClose={() => setIsBookingsModalOpen(false)} />
      )}
    </>
  );
};

export default VenueManagementCard;
