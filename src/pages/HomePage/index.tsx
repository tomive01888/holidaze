import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { apiClient } from "../../api/apiClient";
import { endpoints } from "../../constants/endpoints";
import type { Venue, VenuesApiResponse } from "../../types";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import HeroSection from "./components/HeroSection";
import HomePagination from "./components/HomePagination";
import VenueCard from "./components/VenueCard";
import VenueCardSkeleton from "./components/VenueCardSkeleton";
import Button from "../../components/ui/Button";
import { PageTitle } from "../../components/ui/PageTitle";
import PopularSearchesSection from "./components/PopularSearchedSection";

const DEFAULT_ITEMS_PER_PAGE = 12;

/**
 * HomePage component
 *
 * Displays the main homepage for Holidaze, including:
 * - Hero banner with search functionality
 * - Popular search term buttons
 * - Venue results grid with pagination
 * - Skeleton loaders while fetching
 * - Error handling UI
 *
 * Accessibility:
 * - Provides a "Skip to venue results" link for keyboard and screen reader users.
 * - Uses semantic headings and ARIA labels for lists and cards.
 *
 * State management:
 * - Search, pagination, and items-per-page are persisted in the URL query string.
 * - API requests are debounced and abortable.
 *
 * @returns {JSX.Element} The rendered homepage UI.
 */
const HomePage = () => {
  // URL params
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const itemsPerPage = Number(searchParams.get("itemsPerPage")) || DEFAULT_ITEMS_PER_PAGE;
  const searchTerm = searchParams.get("q") || "";

  // Refs for focus management
  const clearSearchButtonRef = useRef<HTMLButtonElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const skipLinkRef = useRef<HTMLAnchorElement | null>(null);

  // Data state
  const [venues, setVenues] = useState<Venue[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helpers
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastPageRef = useRef(page);

  // derived boolean to centralize "has results" logic
  const hasResults = venues.length > 0;

  /**
   * Fetch venues from the API.
   *
   * Cancels outdated requests with AbortController.
   *
   * @param pageNum - Page number to request.
   * @param perPage - Number of items per page.
   * @param query - Search query string.
   */
  const fetchData = useCallback(async (pageNum: number, perPage: number, query: string) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);
    setError(null);

    try {
      const endpointUrl = query
        ? `${endpoints.venues.search(query)}&limit=${perPage}&page=${pageNum}`
        : `${endpoints.venues.all}?sort=created&sortOrder=desc&limit=${perPage}&page=${pageNum}`;

      const response = await apiClient.get<VenuesApiResponse>(endpointUrl, { signal });

      if (signal.aborted) return;
      if (!Array.isArray(response.data)) throw new Error("Invalid data from server");

      setVenues(response.data);
      setPageCount(response.meta.pageCount);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Trigger data fetching whenever page, itemsPerPage, or searchTerm changes.
   */
  useEffect(() => {
    fetchData(page, itemsPerPage, debouncedSearchTerm).then(() => {
      lastPageRef.current = page;
    });
  }, [page, itemsPerPage, debouncedSearchTerm, fetchData]);

  /**
   * Handle focus management after search completes.
   *
   * Ensures only one element is focused based on final resolved state:
   * - Results found (venues.length > 0) → skip link is focused
   * - No results with search term → Clear Search button is focused
   * - No results and no search term → Search input is focused
   *
   * IMPORTANT: skip link is only focusable (tabIndex=0) when hasResults === true.
   */
  useEffect(() => {
    if (isLoading) return;

    const isNewSearch = page === 1 && debouncedSearchTerm;
    if (isNewSearch) {
      const t = setTimeout(() => {
        if (hasResults) {
          skipLinkRef.current?.focus();
        } else if (searchTerm) {
          clearSearchButtonRef.current?.focus();
        } else {
          searchInputRef.current?.focus();
        }
      }, 10);

      return () => clearTimeout(t);
    }
  }, [isLoading, page, debouncedSearchTerm, hasResults, searchTerm]);

  /**
   * Updates the search term in query params and resets to page 1.
   *
   * @param newSearchTerm - The new search term to set.
   */
  const handleSearchChange = (newSearchTerm: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("q", newSearchTerm);
    newParams.set("page", "1");
    setSearchParams(newParams);

    if (newSearchTerm === "") {
      searchInputRef.current?.focus();
    }
  };

  /**
   * Handles pagination page change.
   *
   * @param newPage - Target page number.
   * @param source - Origin of the page change (keyboard, mouse, or input).
   */
  const handlePageChange = (newPage: number, source: "keyboard" | "mouse" | "input") => {
    if (newPage !== page) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", String(newPage));
      setSearchParams(newParams);

      if (source === "keyboard") {
        // Only focus the skip link if there are results to skip to
        setTimeout(() => {
          if (hasResults) skipLinkRef.current?.focus();
        }, 200);
      }
    }
  };

  /**
   * Updates items per page in query params and resets to page 1.
   *
   * @param newItems - The new items-per-page value.
   */
  const handleItemsPerPageChange = (newItems: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("itemsPerPage", String(newItems));
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  /** Whether pagination controls should be shown. */
  const shouldShowPagination = searchParams && !error && (venues.length > 0 || pageCount > 0);

  /**
   * Render the main content section depending on state.
   *
   * @returns {JSX.Element} Content UI
   */
  const renderContent = () => {
    if (isLoading) {
      return (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <li key={`skeleton-${index}`}>
              <VenueCardSkeleton />
            </li>
          ))}
        </ul>
      );
    }

    if (error) {
      return (
        <div role="alert" className="text-center bg-red-50 border border-red-200 p-6 rounded-lg">
          <h3 className="text-2xl font-bold text-red-800 mb-2">Unable to load venues</h3>
          <p className="text-red-700">{error}</p>
        </div>
      );
    }

    if (venues.length === 0) {
      return (
        <div className="text-center py-16 px-4 bg-neutral-100 rounded-lg text-black">
          <h2 className="text-2xl font-bold text-neutral-700">No Venues Found</h2>
          <p className="text-neutral-500 mt-2">
            {searchTerm
              ? `We couldn't find any venues matching "${searchTerm}".`
              : "No venues available at the moment."}
          </p>
          {searchTerm && (
            <Button
              variant="primary"
              onClick={() => handleSearchChange("")}
              className="mt-4"
              ref={clearSearchButtonRef}
            >
              Clear Search
            </Button>
          )}
        </div>
      );
    }

    return (
      <ul
        id="venue-list"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scroll-mt-[500px] px-4"
        aria-label="Available venues"
      >
        {venues.map((venue) => (
          <li
            tabIndex={-1}
            key={venue.id}
            data-venue-card
            className="focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 rounded-lg"
            aria-label={`Venue: ${venue.name}`}
          >
            <VenueCard venue={venue} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="py-8 bg-black/0">
      <PageTitle title={"Holidaze | Homepage"} />

      <ErrorBoundary>
        <HeroSection searchTerm={searchTerm} onSearchChange={handleSearchChange} searchInputRef={searchInputRef} />

        <PopularSearchesSection onSearchChange={handleSearchChange} />

        <section className="my-6 scroll-mt-24">
          {/* Skip link for screen readers — only focusable when there are results */}
          <a
            href="#venue-list"
            ref={skipLinkRef}
            tabIndex={hasResults ? 0 : -1}
            aria-hidden={!hasResults}
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-blue-600 text-white focus:p-2 focus:text-xl focus:font-bold rounded-md z-[101]"
          >
            Skip to venue results
          </a>

          {/* Top pagination */}
          {shouldShowPagination && (
            <HomePagination
              uniqueId="top"
              currentPage={page}
              pageCount={pageCount}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}

          <h3 id="venue-results-heading" className="sr-only">
            Venues
          </h3>
          <div className="mt-6">{renderContent()}</div>

          {/* Bottom pagination */}
          {shouldShowPagination && (
            <HomePagination
              uniqueId="bottom"
              currentPage={page}
              pageCount={pageCount}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </section>
      </ErrorBoundary>
    </div>
  );
};

export default HomePage;
