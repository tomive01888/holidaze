import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import type { FullUserProfile } from "../../../types";
import Button from "../../../components/ui/Button";
import EditProfileModal from "./EditProfileModal";
import { UserRoundPen } from "lucide-react";

/**
 * Props for the {@link ProfileHeader} component.
 *
 * @typedef {Object} ProfileHeaderProps
 * @property {FullUserProfile} profile - The full user profile data to display.
 * @property {(updatedProfile: FullUserProfile) => void} onProfileUpdate -
 *   Callback triggered when the profile is successfully updated,
 *   typically used to refresh the displayed data.
 */
interface ProfileHeaderProps {
  profile: FullUserProfile;
  onProfileUpdate: (updatedProfile: FullUserProfile) => void;
}

/**
 * Displays a user's profile header, including banner, avatar, name, and email.
 *
 * @component
 *
 * @param {ProfileHeaderProps} props - The props for the component.
 * @returns {JSX.Element} A profile header with optional edit functionality.
 *
 * @description
 * - Shows the user's banner image (if available).
 * - Displays the avatar, name, and email centered on top of the banner.
 * - If the logged-in user is viewing their own profile, an "Edit Profile" button is shown.
 * - Clicking "Edit Profile" opens a modal allowing profile updates.
 *
 * @example
 * ```tsx
 * const [profile, setProfile] = useState<FullUserProfile>(userProfile);
 *
 * return (
 *   <ProfileHeader
 *     profile={profile}
 *     onProfileUpdate={(updated) => setProfile(updated)}
 *   />
 * );
 * ```
 */
const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, onProfileUpdate }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [renderOpacity, setRenderOpacity] = useState(false);
  const isOwnProfile = user?.name === profile.name;

  useEffect(() => {
    setRenderOpacity(true);

    const timer = setTimeout(() => {
      setRenderOpacity(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [profile.banner?.url, profile.avatar?.url]);

  return (
    <>
      {/* --- Banner & Profile Info --- */}
      <div className="relative h-64 md:h-96 w-full bg-neutral-200 border-lg">
        {/* Banner image as background */}
        <div
          className={`absolute inset-0 bg-neutral-800 transition-opacity duration-2000 border-lg ${
            renderOpacity ? "opacity-0 animate-pulse" : "opacity-100"
          }`}
          style={{
            backgroundImage: `url(${profile.banner?.url || ""})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <section className="relative h-full flex flex-col justify-center items-center text-white text-center p-4 bg-gradient-to-t from-black/60 to-transparent border-lg">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-xs border-lg"></div>
          <div className="relative flex flex-col items-center gap-4 border-lg">
            <img
              src={profile.avatar?.url}
              alt={`${profile.name}'s profile avatar`}
              className={`w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg bg-neutral-600 transition-opacity duration-1000 ${
                renderOpacity ? "opacity-0 animate-pulse" : "opacity-100"
              }`}
            />
            <h1 className="text-4xl font-bold mt-4 drop-shadow-md">{profile.name}</h1>
            <p className="text-lg drop-shadow-md">{profile.email}</p>
          </div>
        </section>

        {/* --- Edit Button (Only if this is the user's own profile) --- */}
        {isOwnProfile && (
          <div className="absolute top-4 right-4">
            <Button
              variant="secondary"
              className="flex items-center justify-center gap-2"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              <UserRoundPen className="mb-1 text-2xl md:text-lg" />
              <span className="hidden md:block">Edit Profile</span>
              <span className="sr-only md:hidden">Edit Profile</span>
            </Button>
          </div>
        )}
      </div>

      {/* --- Edit Profile Modal --- */}
      {isModalOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsModalOpen(false)}
          onSaveSuccess={(updatedProfile) => {
            onProfileUpdate(updatedProfile);
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default ProfileHeader;
