import React, { useState } from "react";
import { apiClient, ApiError } from "../../../api/apiClient";
import { endpoints } from "../../../constants/endpoints";
import type { FullUserProfile } from "../../../types";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { toast } from "react-toastify";

/**
 * Props for the {@link EditProfileModal} component.
 * @property {FullUserProfile} profile - The user's current profile data.
 * @property {() => void} onClose - Callback fired when modal is dismissed.
 * @property {(updatedProfile: FullUserProfile) => void} onSaveSuccess - Callback fired after successful profile update.
 */
interface EditProfileModalProps {
  profile: FullUserProfile;
  onClose: () => void;
  onSaveSuccess: (updatedProfile: FullUserProfile) => void;
}

/**
 * Modal that allows the user to edit their profile avatar and banner images.
 * Handles form state, API update requests, error display, and a live preview.
 */
const EditProfileModal: React.FC<EditProfileModalProps> = ({ profile, onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    avatarUrl: profile.avatar?.url || "",
    bannerUrl: profile.banner?.url || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Handles text input changes and updates form state. */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Submits the updated avatar/banner URLs to the API.
   * Shows a toast on success or error, and triggers onSaveSuccess callback.
   */
  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        avatar: { url: formData.avatarUrl, alt: `${profile.name}'s avatar` },
        banner: { url: formData.bannerUrl, alt: `${profile.name}'s banner` },
      };

      const response = await apiClient.put<{ data: FullUserProfile }>(endpoints.profiles.byName(profile.name), payload);

      toast.success("Profile updated successfully!");
      onSaveSuccess(response.data);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to update profile.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} modalTitle={`Holidaze | Editing ${profile.name} avatar and banner`} className="!max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Edit Your Profile</h1>
      <div className="grid grid-cols-1 gap-8">
        {/* --- Top Side: Form Inputs --- */}
        <div className="space-y-4">
          <div>
            <label htmlFor="avatarUrl">Avatar URL</label>
            <input
              type="url"
              id="avatarUrl"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleInputChange}
              onFocus={(e) => e.target.select()}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="bannerUrl">Banner URL</label>
            <input
              type="url"
              id="bannerUrl"
              name="bannerUrl"
              value={formData.bannerUrl}
              onChange={handleInputChange}
              onFocus={(e) => e.target.select()}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* ---  Under Side: Live Preview --- */}
        <div>
          <p className="block mb-2 font-bold">Live Preview</p>
          <div className="w-full h-[14rem] border rounded-lg overflow-hidden relative origin-top-left ">
            <div className="absolute z-2 top-0 left-0 right-0 bottom-0 bg-black/20 backdrop-blur-xs"></div>
            <div
              className="absolute inset-0 bg-neutral-200 "
              style={{
                backgroundImage: `url(${formData.bannerUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="relative z-5 h-full flex flex-col justify-center items-center bg-gradient-to-t from-black/60 to-transparent p-2">
              <img
                src={formData.avatarUrl || "/default-avatar.png"}
                alt="Avatar Preview"
                className="w-24 aspect-square rounded-full object-cover border-2 border-white shadow-md"
              />
              <h2 className="text-white font-bold mt-2 text-2xl drop-shadow-md">{profile.name}</h2>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-center text-error mt-4 outline-1 outline-red-600 text-red-600 rounded p-2">{error}</p>
      )}

      <div className="flex justify-end gap-4 mt-8">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
