import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import type { FullUserProfile, FullVenue, ProfileApiResponse } from "../../types";
import { endpoints } from "../../constants/endpoints";
import { apiClient, ApiError } from "../../api/apiClient";
import Spinner from "../../components/ui/Spinner";
import ProfileHeader from "./components/ProfileHeader";
import MyBookings from "./components/MyBookings";
import BecomeManagerPrompt from "./components/BecomeManagerPrompt";
import MyVenues from "./components/MyVenues";
import { PageTitle } from "../../components/ui/PageTitle";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import EditProfileModal from "./components/EditProfileModal";
import { UserRoundPen } from "lucide-react";

type DashboardTab = "venues" | "bookings";

/**
 * DashboardPage component
 *
 * Displays the user's dashboard including their profile, bookings, and (if they are a venue manager)
 * their venues. Handles fetching profile data from the API, switching between "Bookings" and "Venues"
 * tabs, and refreshing data after profile updates.
 *
 * Features:
 * - Dynamically sets the page title with the user's name.
 * - Fetches profile data (bookings, venues if applicable).
 * - Shows loading spinner while fetching data.
 * - Handles and displays API errors.
 * - Allows the user to toggle between "Bookings" and "Venues" tabs if they are a venue manager.
 * - Displays "Become a Manager" prompt for non-venue managers.
 */
const DashboardPage = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState<FullUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<DashboardTab>("bookings");
  const [profileOwnVenues, setProfilOwnVenues] = useState<FullVenue[] | []>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isOwnProfile = user?.name === profileData?.name;

  /**
   * Fetches the user's profile data including bookings (and venues if user is a manager).
   * Uses `apiClient` to call the API and handles loading & error states.
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
   * Effect: Runs `fetchProfile` whenever the component mounts,
   * the logged-in user changes, or `refetchTrigger` increments.
   */
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, refetchTrigger]);

  useEffect(() => {
    if (!user?.name) {
      setIsLoading(false);
      return;
    }
    const fetchBookings = async () => {
      try {
        const endpoint = `${endpoints.profiles.venues(user.name)}`;
        const response = await apiClient.get<{ data: FullVenue[] }>(endpoint);
        setProfilOwnVenues(response.data);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load bookings.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [profileData, user]);

  /**
   * Handles profile updates (e.g., avatar changes or role upgrades).
   * Updates the user context and triggers a re-fetch of profile data.
   *
   * @param updatedProfile - The updated profile object returned from the API.
   */
  const handleProfileUpdate = (updatedProfile: FullUserProfile) => {
    if (user) {
      updateUser({ ...user, avatar: updatedProfile.avatar });
    }
    setRefetchTrigger((prev) => prev + 1);
  };

  const tabContent = (
    <div className="flex flex-col gap-8">
      {/* Tab Navigation/Title for the main content area (moved from the top) */}
      <h2 className="text-3xl font-bold text-white border-b pb-3">
        {profileData?.venueManager ? (activeTab === "bookings" ? "My Bookings" : "My Venues") : "My Bookings"}
      </h2>

      {/* Render Active Tab Content */}
      {profileData?.venueManager ? (
        <>
          {activeTab === "venues" && <MyVenues venues={profileOwnVenues || []} />}
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
      <PageTitle title={`Holidaze | ${user?.venueManager ? "VenueManager" : "Customer"} ${user?.name} `} />
      {/* Base: Single column on mobile, switches to 2 columns on 'lg' */}
      <div className="grid grid-cols-1 gap-8 p-4 md:p-8 lg:grid-cols-[1.5fr_2.5fr] max-w-4xl mx-auto">
        {/* ======== 1. LEFT PANEL (Sticky/Sidebar) ======== */}
        <aside className="lg:sticky lg:top-24 self-start flex flex-col gap-2 bg-neutral-700 border-1 border-teal-700 rounded-xl p-4 shadow-xl">
          <ProfileHeader profile={profileData} onProfileUpdate={handleProfileUpdate} />

          {isOwnProfile && (
            <Button
              variant="secondary"
              className="flex items-center justify-center gap-2"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              <UserRoundPen size={20} className="mb-1 text-2xl md:text-lg" />
              <span>Edit Profile</span>
              <span className="sr-only md:hidden">Edit Profile</span>
            </Button>
          )}

          {/* Tab Navigation moved here (Only for Venue Managers) */}
          {profileData.venueManager && (
            <>
              <Link to="/venue/create" tabIndex={-1}>
                <Button variant="primary" className="w-full" size="sm">
                  + Create New Venue
                </Button>
              </Link>

              {/* Tab navigation for changing views MyBookings and MyVenues */}
              <nav className="flex flex-col space-y-2 border-t border-neutral-700 pt-4 mt-4">
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`py-2 px-3 text-left font-semibold text-lg rounded-lg transition-colors flex items-center justify-between ${
                    activeTab === "bookings" ? "border-2 border-neutral-200" : "text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  My Bookings{" "}
                  {activeTab === "bookings" ? <span className="animate-pulse bg-teal-500 h-2 w-2 rounded-full" /> : ""}
                </button>

                <button
                  onClick={() => setActiveTab("venues")}
                  className={`py-2 px-3 text-left font-semibold text-lg rounded-lg transition-colors flex items-center justify-between ${
                    activeTab === "venues" ? "border-2 border-neutral-200" : "text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  My Venues{" "}
                  {activeTab === "venues" ? <span className="animate-pulse bg-teal-500 h-2 w-2 rounded-full" /> : ""}
                </button>
              </nav>
            </>
          )}

          {/* Prompt for non-managers */}
          {!profileData.venueManager && <BecomeManagerPrompt onUpgradeSuccess={handleProfileUpdate} />}
        </aside>

        {/* ======== 2. RIGHT CONTENT (Scrollable Main Area) ======== */}
        <div className="lg:min-h-[80vh]">{tabContent}</div>

        {/* --- Edit Profile Modal --- */}
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
