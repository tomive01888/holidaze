import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import type { FullUserProfile } from "../../../types";
import Button from "../../../components/ui/Button";
import EditProfileModal from "./EditProfileModal";
import { FaPencilAlt } from "react-icons/fa";

interface ProfileHeaderProps {
  profile: FullUserProfile;
  onProfileUpdate: (updatedProfile: FullUserProfile) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, onProfileUpdate }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isOwnProfile = user?.name === profile.name;

  return (
    <>
      <div className="relative h-64 md:h-80 w-full bg-neutral-200">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${profile.banner?.url || ""})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <section className="relative h-full flex flex-col justify-center items-center text-white text-center p-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-xs"></div>
          <div className="relative flex flex-col items-center gap-4">
            <img
              src={profile.avatar?.url}
              alt={`${profile.name}'s avatar`}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <h1 className="text-4xl font-bold mt-4 drop-shadow-md">{profile.name}</h1>
            <p className="text-lg drop-shadow-md">{profile.email}</p>
          </div>
        </section>

        {isOwnProfile && (
          <div className="absolute top-4 right-4 ">
            <Button
              variant="secondary"
              className="flex items-center justify-center gap-2"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPencilAlt size={16} className="mb-1" />
              Edit Profile
            </Button>
          </div>
        )}
      </div>

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
