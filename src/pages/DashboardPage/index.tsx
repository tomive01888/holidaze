import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import type { FullUserProfile, ProfileApiResponse } from "../../types";
import { endpoints } from "../../constants/endpoints";
import { apiClient, ApiError } from "../../api/apiClient";
import Spinner from "../../components/ui/Spinner";
import ProfileHeader from "./components/ProfileHeader";
import MyBookings from "./components/MyBookings";
import BecomeManagerPrompt from "./components/BecomeManagerPrompt";
import MyVenues from "./components/MyVenues";
import Button from "../../components/ui/Button";
import EditProfileModal from "./components/EditProfileModal";
import { UserRoundPen } from "lucide-react";
import VenueManagerTools from "./components/VenueManagerTools";

type DashboardTab = "venues" | "bookings";

/**
 * DashboardPage
 *
 * Renders the logged-in user's dashboard view, which combines:
 * - Profile information (avatar, name, email, etc.)
 * - User bookings
 * - Venue management tools (if the user is a venue manager)
 *
 * Core responsibilities:
 * - Fetches the authenticated user's profile from the API.
 * - Displays loading and error states.
 * - Allows the user to edit their profile via a modal.
 * - Provides navigation between "My Bookings" and "My Venues" tabs (if applicable).
 * - Shows a prompt to become a venue manager for non-managers.
 *
 * Layout:
 * - Two-column grid (sidebar + main content) on large screens.
 * - Collapses to a single-column layout on mobile.
 *
 * @component
 * @example
 * ```tsx
 * <Route path="/dashboard" element={<DashboardPage />} />
 * ```
 */
const DashboardPage = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState<FullUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<DashboardTab>("bookings");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isOwnProfile = user?.name === profileData?.name;

  /**
   * Fetches the logged-in user's profile data from the API.
   *
   * - Always fetches bookings.
   * - Also fetches venues if the user is a venue manager.
   * - Updates `profileData` state with the result.
   *
   * Handles:
   * - Loading state
   * - API errors (via `ApiError` or fallback message)
   */
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

  /**
   * Effect hook:
   * - Calls `fetchProfile` on mount
   * - Re-runs when `user` changes or `refetchTrigger` increments
   */
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, refetchTrigger]);

  /**
   * Handles profile updates (e.g., after editing avatar or becoming a manager).
   * - Updates the user context.
   * - Forces a profile re-fetch by incrementing `refetchTrigger`.
   *
   * @param updatedProfile - The updated profile object returned from the API
   */
  const handleProfileUpdate = (updatedProfile: FullUserProfile) => {
    if (user) {
      updateUser({ ...user, avatar: updatedProfile.avatar });
    }
    setRefetchTrigger((prev) => prev + 1);
  };

  /**
   * Content for the main (right) panel of the dashboard.
   * - Renders "My Bookings" for regular users.
   * - Renders tab-based content ("My Bookings" or "My Venues") for venue managers.
   */
  const tabContent = (
    <div className="flex flex-col gap-8">
      <h2 className="text-3xl font-bold text-white border-b pb-3">
        {profileData?.venueManager ? (activeTab === "bookings" ? "My Bookings" : "Manage Venues") : "My Bookings"}
      </h2>

      {profileData?.venueManager ? (
        <>
          {activeTab === "venues" && <MyVenues venues={profileData.venues || []} />}
          {activeTab === "bookings" && <MyBookings bookings={profileData.bookings || []} />}
        </>
      ) : (
        <MyBookings bookings={profileData?.bookings || []} />
      )}
    </div>
  );

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
      {/* Grid layout: sidebar (left) + main content (right) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_2.5fr] my-16">
        {/* ======== LEFT PANEL ======== */}
        <aside className="lg:sticky lg:top-24 self-start flex flex-col gap-2 w-full max-w-lg mx-auto bg-neutral-700 border-1 border-teal-700 rounded-xl p-4 shadow-lg shadow-black/30">
          <ProfileHeader profile={profileData} onProfileUpdate={handleProfileUpdate} />

          {isOwnProfile && (
            <Button
              variant="secondary"
              className="flex items-center justify-center gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <UserRoundPen size={20} className="mb-1 text-2xl md:text-lg" />
              <span>Edit Profile</span>
              <span className="sr-only md:hidden">Edit Profile</span>
            </Button>
          )}

          {/* Venue manager tools */}
          {profileData.venueManager && <VenueManagerTools activeTab={activeTab} onTabChange={setActiveTab} />}

          {/* Prompt for non-managers */}
          {!profileData.venueManager && <BecomeManagerPrompt onUpgradeSuccess={handleProfileUpdate} />}
        </aside>

        {/* ======== RIGHT PANEL ======== */}
        <div className="lg:min-h-[80vh]">{tabContent}</div>

        {/* Edit profile modal */}
        {isModalOpen && (
          <EditProfileModal
            profile={profileData}
            onClose={() => setIsModalOpen(false)}
            onSaveSuccess={(updatedProfile) => {
              handleProfileUpdate(updatedProfile);
              setIsModalOpen(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export default DashboardPage;
