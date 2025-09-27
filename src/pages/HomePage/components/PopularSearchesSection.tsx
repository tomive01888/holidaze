import { useState, useEffect, useCallback } from "react";
import Button from "../../../components/ui/Button";

interface PopularSearchesSectionProps {
  onSearchChange: (searchTerm: string) => void;
}

/** Popular search term suggestions for quick filters. */
const popularSearches = [
  "London",
  "Paris",
  "New York",
  "Tokyo",
  "Beach",
  "Cabin",
  "Luxury",
  "Dubai",
  "Forest",
  "Villa",
  "Maldives",
  "Lake",
];

/**
 * PopularSearchesSection Component
 *
 * Renders a section displaying popular search terms that users can click for quick searches.
 * Users can toggle visibility of the search terms, and the state is persisted in localStorage.
 *
 * @param {PopularSearchesSectionProps} props - Component props
 * @param {(searchTerm: string) => void} props.onSearchChange - Callback when a search term is selected
 * @returns {JSX.Element} The rendered PopularSearchesSection component
 */
const PopularSearchesSection = ({ onSearchChange }: PopularSearchesSectionProps) => {
  /** Whether the popular searches list is currently visible */
  const [isVisible, setIsVisible] = useState(true);

  // Load visibility preference from localStorage on mount
  useEffect(() => {
    const savedVisibility = localStorage.getItem("popularSearchesVisible");
    if (savedVisibility !== null) {
      setIsVisible(savedVisibility === "true");
    }
  }, []);

  /**
   * Toggle visibility of the popular searches list and persist to localStorage.
   */
  const toggleVisibility = useCallback(() => {
    setIsVisible((prev) => {
      const newState = !prev;
      localStorage.setItem("popularSearchesVisible", String(newState));
      return newState;
    });
  }, []);

  /**
   * Handle click on a search term button.
   * @param {string} term - The selected search term
   */
  const handleButtonClick = (term: string) => {
    onSearchChange(term);
  };

  return (
    <section aria-labelledby="popular-searches-heading" className="my-8 px-4 bg-black/0">
      <div className="flex justify-between items-center border-b-1 border-b-gray-300">
        <h2 id="popular-searches-heading" className="text-2xl font-semibold">
          Popular Searches on Holidaze
        </h2>

        <Button
          onClick={toggleVisibility}
          aria-expanded={isVisible}
          aria-controls="popular-searches-content"
          className="bg-transparent text-neutral-200 hover:!bg-black/15"
        >
          {isVisible ? "Hide" : "Show"}
        </Button>
      </div>

      {isVisible && (
        <div
          id="popular-searches-content"
          className="flex flex-wrap justify-start gap-3 py-4 border-b border-neutral-200"
        >
          {popularSearches.map((term) => (
            <Button
              variant="secondary"
              size="md"
              key={term}
              onClick={() => handleButtonClick(term)}
              className="!bg-transparent underline text-teal-300 font-black drop-shadow-xs drop-shadow-teal-700 hover:scale-110 transition-transform duration-400"
            >
              {term}
            </Button>
          ))}
        </div>
      )}
    </section>
  );
};

export default PopularSearchesSection;
