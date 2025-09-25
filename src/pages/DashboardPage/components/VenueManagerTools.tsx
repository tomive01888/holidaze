import { Link } from "react-router-dom";
import Button from "../../../components/ui/Button";

interface VenueManagerToolsProps {
  /**
   * The currently active dashboard tab.
   * Controls which navigation button appears selected.
   *
   * - `"bookings"` → Highlights the "My Bookings" tab
   * - `"venues"` → Highlights the "My Venues" tab
   */
  activeTab: "bookings" | "venues";

  /**
   * Callback fired when the user switches tabs.
   * Should update the parent component's state.
   *
   * @param tab - The tab that was selected (`"bookings"` | `"venues"`)
   */
  onTabChange: (tab: "bookings" | "venues") => void;
}

/**
 * VenueManagerTools
 *
 * Sidebar section for venue managers, providing:
 * - Button to create a new venue
 * - Tab navigation for switching between "My Bookings" and "My Venues"
 *
 * @component
 * @example
 * ```tsx
 * <VenueManagerTools activeTab={activeTab} onTabChange={setActiveTab} />
 * ```
 */
const VenueManagerTools: React.FC<VenueManagerToolsProps> = ({ activeTab, onTabChange }) => {
  return (
    <>
      {/* Create new venue */}
      <Link to="/venue/create" tabIndex={-1}>
        <Button variant="primary" className="w-full" size="sm">
          + Create New Venue
        </Button>
      </Link>

      {/* Tab navigation */}
      <nav className="flex flex-col space-y-2 border-t border-neutral-200 pt-3 mt-2">
        <button
          onClick={() => onTabChange("bookings")}
          className={`py-2 px-3 text-left font-semibold text-lg rounded-lg transition-colors flex items-center justify-between ${
            activeTab === "bookings" ? "border-2 border-neutral-200" : "text-neutral-300 hover:bg-neutral-800"
          }`}
        >
          My Bookings {activeTab === "bookings" && <span className="bg-teal-500 h-2 w-2 rounded-full" />}
        </button>

        <button
          onClick={() => onTabChange("venues")}
          className={`py-2 px-3 text-left font-semibold text-lg rounded-lg transition-colors flex items-center justify-between ${
            activeTab === "venues" ? "border-2 border-neutral-200" : "text-neutral-300 hover:bg-neutral-800"
          }`}
        >
          My Venues {activeTab === "venues" && <span className="bg-teal-500 h-2 w-2 rounded-full" />}
        </button>
      </nav>
    </>
  );
};

export default VenueManagerTools;
