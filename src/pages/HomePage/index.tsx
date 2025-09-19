import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import type { Venue, VenuesApiResponse } from "../../types";
import { apiClient } from "../../api/apiClient";
import { useDebounce } from "../../hooks/useDebounce";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import SearchBar from "./components/SearchBar";
import VenueCard from "./components/VenueCard";
import VenueCardSkeleton from "./components/VenueCardSkeleton";
import HomePagination from "./components/HomePagination";
import { endpoints } from "../../constants/endpoints";
import Button from "../../components/ui/Button";
import { PageTitle } from "../../components/ui/PageTitle";

const DEFAULT_ITEMS_PER_PAGE = 12;

/**
 * The homepage of the Holidaze app.
 *
 * This component handles:
 * - Fetching paginated venues from the API (with optional search)
 * - Debounced search to reduce API calls
 * - Error handling and skeleton loading states
 * - Pagination controls and scroll-to-top on page change
 *
 * @returns {JSX.Element} The rendered homepage UI.
 */
const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const itemsPerPage = Number(searchParams.get("itemsPerPage")) || DEFAULT_ITEMS_PER_PAGE;
  const searchTerm = searchParams.get("q") || "";

  const [venues, setVenues] = useState<Venue[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const abortControllerRef = useRef<AbortController | null>(null);
  const mainContentRef = useRef<HTMLElement>(null);

  /**
   * Fetches venues from the API.
   *
   * Aborts any in-progress request if a new one is triggered.
   *
   * @param {number} pageNum - The page number to fetch.
   * @param {number} perPage - Number of items per page.
   * @param {string} query - Search query string (empty for no search).
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
   * Effect: Fetch data whenever the page, items per page, or search term changes.
   * Scrolls to the top of the main content area after loading.
   */
  useEffect(() => {
    fetchData(page, itemsPerPage, debouncedSearchTerm).then(() => {
      mainContentRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [page, itemsPerPage, debouncedSearchTerm, fetchData]);

  /**
   * Updates search query in URL params and resets to page 1.
   *
   * @param {string} newSearchTerm - The new search term.
   */
  const handleSearchChange = (newSearchTerm: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("q", newSearchTerm);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  /**
   * Updates page number in URL params.
   *
   * @param {number} newPage - The new page number.
   */
  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(newPage));
    setSearchParams(newParams);
  };

  /**
   * Updates items per page in URL params and resets to page 1.
   *
   * @param {number} newItems - The number of items to show per page.
   */
  const handleItemsPerPageChange = (newItems: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("itemsPerPage", String(newItems));
    newParams.set("page", "1"); // Reset to page 1
    setSearchParams(newParams);
  };

  /**
   * Renders the venue list, skeletons, or error message depending on state.
   *
   * @returns {JSX.Element} The content section to display.
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
          <h3 className="text-lg font-bold text-red-800 mb-2">Unable to load venues</h3>
          <p className="text-red-700">{error}</p>
        </div>
      );
    }
    if (venues.length === 0) {
      return (
        <div className="text-center py-16 px-4 bg-neutral-100 rounded-lg text-black">
          <h2 className="text-2xl font-bold text-neutral-700">No Venues Found</h2>
          <p className="text-neutral-500 mt-2">We couldn't find any venues matching "{searchTerm}".</p>
          <Button variant="primary" onClick={() => handleSearchChange("")} className="mt-4">
            Clear Search
          </Button>
        </div>
      );
    }
    return (
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {venues.map((venue) => (
          <li key={venue.id}>
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
        <section aria-labelledby="page-heading" className="text-center mb-8">
          <h1 id="page-heading" className="text-5xl ...">
            Find your perfect stay
          </h1>
          <SearchBar searchTerm={searchTerm} setSearchTerm={handleSearchChange} />
        </section>

        <section ref={mainContentRef} id="all-venues" className="my-6 scroll-mt-24">
          <h2 id="venue-results-heading" className="sr-only">
            Venues
          </h2>

          <HomePagination
            uniqueId="top"
            isLoading={isLoading}
            hasItems={!error && venues.length > 0}
            currentPage={page}
            pageCount={pageCount}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            anchor="all-venues"
          />

          <div className="mt-6">{renderContent()}</div>

          <HomePagination
            uniqueId="bottom"
            isLoading={isLoading}
            hasItems={!error && venues.length > 0}
            currentPage={page}
            pageCount={pageCount}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            anchor="all-venues"
          />
        </section>
      </ErrorBoundary>
    </div>
  );
};

export default HomePage;
