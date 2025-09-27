import React, { useState, useEffect, useRef } from "react";
import { ScanSearch, X } from "lucide-react";

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
const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ searchTerm, setSearchTerm, placeholder = "Search by name or description....", className = "" }, ref) => {
    const [inputValue, setInputValue] = useState(searchTerm);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      setInputValue(searchTerm);
    }, [searchTerm]);

    /**
     * Handles typing in the input and updates the search term state.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - Input change event.
     */
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);
      setSearchTerm(value);
    };

    /**
     * Clears the search input and resets the search term.
     */
    const handleClear = () => {
      setInputValue("");
      setSearchTerm("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    /**
     * Handle form submission to prevent page reload
     */
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
    };

    return (
      <form className={`relative w-full max-w-lg mx-auto ${className}`} role="search" onSubmit={handleSubmit}>
        <label htmlFor="venue-search" className="sr-only">
          Search for venues
        </label>

        <div className="relative">
          {/* Search icon on left */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ScanSearch className="h-5 w-5 text-neutral-300" />
          </div>

          {/* Input with local state */}
          <input
            type="text"
            id="venue-search"
            ref={ref}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={(e) => e.target.select()}
            placeholder={placeholder}
            className="
            w-full 
            py-3 pl-10 pr-10
            text-xl font-semibold text-white
            border-2 border-neutral-300 rounded-full
            bg-black/50
          "
          />

          {/* Clear button on right */}
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2"
              aria-label="Clear search"
            >
              <X className="h-8 w-8 text-2xl text-neutral-400 hover:text-white" />
            </button>
          )}
        </div>

        {/* Putte lenker her som sklir ned og inn i synsfeltet under søkebaren */}
        {/* Lokal skip link, vises bare når det finnes resultater */}
        <a
          href="#venue-list"
          className="sr-only focus:not-sr-only !-bottom-12 -translate-x-1/2 !absolute mt-2 bg-blue-600/40 border-[1px] border-white !px-3 text-white !py-1 rounded"
        >
          Skip to venue results
        </a>
      </form>
    );
  }
);

export default SearchBar;
