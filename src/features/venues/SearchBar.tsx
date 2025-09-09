// src/components/specific/SearchBar.tsx
import React from "react";
import { MdSearch } from "react-icons/md"; // A great, lightweight icon library

export interface SearchBarProps {
  /**
   * The current value of the search input.
   */
  searchTerm: string;
  /**
   * A function to call when the search input value changes.
   */
  setSearchTerm: (term: string) => void;
  /**
   * The placeholder text to display in the input.
   * @default 'Search for venues...'
   */
  placeholder?: string;
  /**
   * Optional custom CSS classes for the container.
   */
  className?: string;
}

/**
 * A controlled search input component. It displays a search bar
 * and calls a parent-provided function to update the search term state.
 */
const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  placeholder = "Search by name or description...",
  className = "",
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <form className={`relative w-full max-w-lg mx-auto ${className}`} role="search">
      <label htmlFor="venue-search" className="sr-only">
        Search for venues
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MdSearch className="h-5 w-5 text-neutral-300" />
        </div>
        <input
          type="search"
          id="venue-search"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="
            w-full 
            py-3 pl-10 pr-4 
            text-xl font-semibold text-white
            border-2 border-neutral-300 rounded-full 
            focus:outline-none focus:ring-2 focus:ring-primary-500 
            transition-colors
          "
        />
      </div>
    </form>
  );
};

export default SearchBar;
