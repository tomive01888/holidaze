import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import type { FullUserProfile, ProfileApiResponse } from "../../types";
import { endpoints } from "../../constants/endpoints";
import { apiClient, ApiError } from "../../api/apiClient";
import Spinner from "../../components/ui/Spinner";
import ProfileHeader from "./components/ProfileHeader";

const DashboardPage = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState<FullUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (user) {
      document.title = `Holidaze | Dashboard for ${user.name}`;
    }
  }, [user]);

  const fetchProfile = useCallback(async () => {
    if (!user?.name) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      let profileUrl = `${endpoints.profiles.byName(user.name)}?_bookings=true`;
      if (user.venueManager) {
        profileUrl += "&_venues=true";
      }
      const response = await apiClient.get<ProfileApiResponse>(profileUrl);
      setProfileData(response.data);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to load profile data.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, refetchTrigger]);

  const handleProfileUpdate = (updatedProfile: FullUserProfile) => {
    if (user) {
      updateUser({ ...user, avatar: updatedProfile.avatar });
    }
    setRefetchTrigger((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner text="Loading your dashboard..." />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-error">Error: {error}</div>;
  }

  if (!profileData) {
    return <div className="text-center py-20">Could not load your profile. Please try logging in again.</div>;
  }
  return (
    <>
      <ProfileHeader profile={profileData} onProfileUpdate={handleProfileUpdate} />

      <div className="container mx-auto p-4 md:p-8">Hello dashboard</div>
    </>
  );
};

export default DashboardPage;
