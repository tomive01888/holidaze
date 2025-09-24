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
        console.log(response);

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

      <ProfileHeader profile={profileData} onProfileUpdate={handleProfileUpdate} />
      <div className="container mx-auto p-4 md:p-8">
        {/* --- TAB NAVIGATION (Only for Venue Managers) --- */}
        {profileData.venueManager && (
          <div className="border-b border-neutral-200 mb-8">
            <nav className="flex space-x-6">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`pb-3 px-1 font-bold text-xl transition-colors ${
                  activeTab === "bookings"
                    ? "border-b-2 border-neutral-300 text-neutral-50"
                    : "text-neutral-300 hover:text-neutral-200 "
                }`}
              >
                <span className={`p-2 rounded-lg ${activeTab === "bookings" ? "bg-none" : "hover:bg-black/10 "}`}>
                  My Bookings
                </span>
              </button>
              <button
                onClick={() => setActiveTab("venues")}
                className={`pb-3 px-1 font-bold text-xl transition-colors ${
                  activeTab === "venues"
                    ? "border-b-2 border-neutral-300 text-neutral-50"
                    : "text-neutral-300 hover:text-neutral-100"
                }`}
              >
                <span className={`p-2 rounded-lg ${activeTab === "venues" ? "bg-none" : "hover:bg-black/10 "}`}>
                  My Venues
                </span>
              </button>
            </nav>
          </div>
        )}

        {/* --- TAB CONTENT --- */}
        <div>
          {profileData.venueManager ? (
            <>
              {activeTab === "venues" && <MyVenues venues={profileOwnVenues || []} />}
              {activeTab === "bookings" && <MyBookings bookings={profileData.bookings || []} />}
            </>
          ) : (
            <>
              <section className="bg-black/0">
                <h2 className="text-3xl font-bold border-b pb-3 mb-6">My Bookings</h2>
                <MyBookings bookings={profileData.bookings || []} />
              </section>
              <section className="mt-12">
                <BecomeManagerPrompt onUpgradeSuccess={handleProfileUpdate} />
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
