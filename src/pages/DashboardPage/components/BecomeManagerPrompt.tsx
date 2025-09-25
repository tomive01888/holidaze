import React, { useState } from "react";
import { apiClient, ApiError } from "../../../api/apiClient";
import { endpoints } from "../../../constants/endpoints";
import { useAuth } from "../../../hooks/useAuth";
import type { FullUserProfile } from "../../../types";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { toast } from "react-toastify";
import { TriangleAlert } from "lucide-react";

/**
 * Props for the `BecomeManagerPrompt` component.
 * @typedef {Object} BecomeManagerPromptProps
 * @property {(updatedProfile: FullUserProfile) => void} onUpgradeSuccess - Callback triggered after a successful account upgrade, usually to re-fetch user data.
 */
interface BecomeManagerPromptProps {
  /**
   * A callback function to execute after a successful role upgrade.
   * This should trigger a data re-fetch in the parent component.
   */
  onUpgradeSuccess: (updatedProfile: FullUserProfile) => void;
}

/**
 * Displays a call-to-action card prompting the user to become a Venue Manager.
 * Opens a confirmation modal on click and upgrades the user's profile via API.
 * Shows success and error toasts and disables the confirm button while processing.
 */
const BecomeManagerPrompt: React.FC<BecomeManagerPromptProps> = ({ onUpgradeSuccess }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmUpgrade = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const payload = {
        venueManager: true,
      };

      const response = await apiClient.put<{ data: FullUserProfile }>(endpoints.profiles.byName(user.name), payload);

      toast.success("Congratulations! You are now a Venue Manager.");

      setIsModalOpen(false);

      onUpgradeSuccess(response.data);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to upgrade account.";
      toast.error(message);
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="px-3 py-6 bg-black/20 bg-linear-to-tr from-neutral-700/20 to-teal-400/20 rounded-lg text-center border-1 border-dashed border-neutral-300">
        <h3 className="text-2xl font-bold">Ready to Host?</h3>
        <p className="mt-2 text-neutral-100 max-w-md mx-auto">
          Become a Venue Manager today to list your own properties, manage bookings, and start earning.
        </p>
        <Button onClick={() => setIsModalOpen(true)} className="mt-6" size="sm">
          Start your journey
        </Button>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} modalTitle="Holidaze | Become a venue manager">
          <h3 className="text-2xl font-bold">Confirm Your Account Upgrade</h3>
          <p className="my-4 text-neutral-800">
            You are about to upgrade your account to a Venue Manager. This will grant you access to the venue management
            dashboard.
          </p>
          <p className="font-bold text-error bg-error/10 p-3 rounded-md flex gap-2 text-red-600">
            <TriangleAlert size={24} /> Please note: This action is permanent and cannot be undone.
          </p>
          <div className="flex justify-end gap-4 mt-8">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleConfirmUpgrade} className="!text-sm">
              {isLoading ? "Upgrading..." : "I Understand, Upgrade My Account"}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default BecomeManagerPrompt;
