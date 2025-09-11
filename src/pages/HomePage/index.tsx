import { useState, useEffect, useCallback, useRef } from "react";
import type { Venue, VenuesApiResponse } from "../../types";
import { apiClient, ApiError } from "../../api/apiClient";
import { useDebounce } from "../../hooks/useDebounce";
import { endpoints } from "../../constants/endpoints";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import VenueCard from "./components/VenueCard";
import SearchBar from "./components/SearchBar";
import { toast } from "react-toastify";

const VENUES_PER_PAGE = 12;

const HomePage = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultsCount, setResultsCount] = useState<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (venues) {
      document.title = `Holidaze | Homepage`;
    }
  }, [venues]);

  const fetchData = useCallback(
    async (pageNum: number, query: string) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      const isNewLoad = pageNum === 1;
      if (isNewLoad) setIsLoading(true);
      else setIsFetchingMore(true);
      setError(null);

      try {
        const endpointUrl = query
          ? endpoints.venues.search(query)
          : `${endpoints.venues.all}?sort=created&sortOrder=desc&limit=${VENUES_PER_PAGE}&page=${pageNum}`;

        const response = await apiClient.get<VenuesApiResponse>(endpointUrl, { signal });
        if (signal.aborted) return;
        if (!Array.isArray(response.data)) throw new Error("Received invalid data from server.");

        const newVenues = response.data;
        setVenues((prev) => (isNewLoad ? newVenues : [...prev, ...newVenues]));
        setHasMore(!response.meta.isLastPage && !query);
        if (isNewLoad) setResultsCount(response.meta.totalCount);
      } catch (err) {
        if (typeof err === "object" && err !== null && "name" in err && err.name === "AbortError") {
          return;
        }

        let errorMessage = "An unexpected error occurred.";
        if (err instanceof ApiError || err instanceof Error) {
          errorMessage = err.message;
        }

        if (pageNum > 1) {
          toast.error(errorMessage || "Could not load more venues.");
        } else {
          setError(errorMessage);
        }
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    },
    [setIsLoading, setIsFetchingMore, setError, setVenues, setHasMore, setResultsCount]
  );

  useEffect(() => {
    setPage(1);
    fetchData(1, debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchData]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const currentVenueCount = venues.length;
    setPage(nextPage);
    await fetchData(nextPage, "");

    setTimeout(() => {
      const firstNewVenue = document.querySelector(`[data-venue-index="${currentVenueCount}"]`);
      if (firstNewVenue) {
        (firstNewVenue as HTMLElement).focus();
      }
    }, 200);
  };

  const renderContent = () => {
    if (isLoading) {
      return <Spinner text="Finding venues..." />;
    }
    if (error) {
      return (
        <div role="alert" className="text-center bg-red-50 border border-red-200 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-red-800 mb-2">Unable to Load Venues</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => fetchData(1, debouncedSearchTerm)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </div>
      );
    }
    return (
      <ErrorBoundary>
        {venues.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue, index) => (
              <li key={venue.id}>
                <VenueCard venue={venue} data-venue-index={index} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16 px-4 bg-neutral-200 rounded-lg">
            <h3 className="text-2xl font-bold text-neutral-700">No Venues Found</h3>
            <p className="text-neutral-500 mt-2">
              {searchTerm
                ? `We couldn't find any venues matching "${searchTerm}".`
                : "No venues are available right now."}
            </p>
          </div>
        )}
        <div className="text-center mt-10">
          {hasMore && (
            <div className="text-center mt-10">
              <Button
                aria-live="polite"
                onClick={handleLoadMore}
                disabled={isFetchingMore}
                variant="secondary"
                size="lg"
                aria-describedby={isFetchingMore ? "loading-more-status" : undefined}
              >
                {isFetchingMore ? "Loading..." : "Load More Venues"}
              </Button>
            </div>
          )}
        </div>
      </ErrorBoundary>
    );
  };

  return (
    <div className="py-16 bg-black/0">
      <section aria-labelledby="page-heading" className="text-center mb-12 ">
        <h1 id="page-heading" className="text-5xl font-bold mb-4 py-6 px-2 text-white ">
          Find your perfect stay
        </h1>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </section>

      <div role="status" aria-live="polite" className="sr-only">
        {isLoading && !isFetchingMore && "Searching for venues..."}
        {isFetchingMore && "Loading more venues..."}
        {resultsCount !== null && !isLoading && !isFetchingMore && `${resultsCount} venues found.`}
        {searchTerm && resultsCount !== null && !isLoading && `Found ${resultsCount} venues matching "${searchTerm}".`}
      </div>

      <section
        aria-labelledby="venue-results-heading"
        aria-describedby="results-summary"
        aria-busy={isLoading || isFetchingMore}
      >
        <h2 id="venue-results-heading" className="sr-only">
          {searchTerm ? `Search Results for "${searchTerm}"` : "All Available Venues"}
        </h2>
        {resultsCount !== null && (
          <p id="results-summary" className="sr-only">
            {isLoading ? "Loading venues..." : `Showing ${venues.length} of ${resultsCount} venues`}
          </p>
        )}
        {renderContent()}
      </section>
    </div>
  );
};

export default HomePage;
