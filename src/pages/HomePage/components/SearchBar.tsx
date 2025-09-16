import React from "react";
import { MdSearch, MdClose } from "react-icons/md";

/**
 * Props for the {@link SearchBar} component.
 *
 * @typedef {Object} SearchBarProps
 * @property {string} searchTerm - Current value of the search input.
 * @property {(term: string) => void} setSearchTerm - Function to update the search term state.
 * @property {string} [placeholder] - Optional placeholder text for the search input.
 *   Defaults to `"Search by name or description..."`.
 * @property {string} [className] - Optional additional CSS classes to style the container.
 */
export interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * A reusable search bar component with a left-aligned search icon and
 * a clear button that appears when text is entered.
 *
 * @component
 *
 * @param {SearchBarProps} props - The props for the component.
 * @returns {JSX.Element} A styled search bar input with search and clear functionality.
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState("");
 *
 * return (
 *   <SearchBar
 *     searchTerm={searchTerm}
 *     setSearchTerm={setSearchTerm}
 *     placeholder="Search venues..."
 *     className="mb-4"
 *   />
 * );
 * ```
 */
const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  placeholder = "Search by name or description...",
  className = "",
}) => {
  /**
   * Handles typing in the input and updates the search term state.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input change event.
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  /**
   * Clears the search input and resets the search term.
   */
  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <form className={`relative w-full max-w-lg mx-auto ${className}`} role="search">
      <label htmlFor="venue-search" className="sr-only">
        Search for venues
      </label>

      <div className="relative">
        {/* Search icon on left */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MdSearch className="h-5 w-5 text-neutral-300" />
        </div>

        {/* Input */}
        <input
          type="text"
          id="venue-search"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="
            w-full 
            py-3 pl-10 pr-10
            text-xl font-semibold text-white
            border-2 border-neutral-300 rounded-full 
            focus:outline-dashed focus:outline-offset-2 focus:ring-orange-400
            transition-colors
          "
        />

        {/* Clear button on right */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center"
            aria-label="Clear search"
          >
            <MdClose className="h-8 w-8 text-2xl text-neutral-400 hover:text-white" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
