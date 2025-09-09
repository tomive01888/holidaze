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

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage, "");
  };

  const renderContent = () => {
    if (isLoading) {
      return <Spinner text="Finding venues..." />;
    }
    if (error) {
      return <p className="text-center text-error font-semibold bg-error/10 p-4 rounded-md">{error}</p>;
    }
    return (
      <ErrorBoundary>
        {venues.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue) => (
              <li key={venue.id}>
                <VenueCard venue={venue} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16 px-4 bg-neutral-200 rounded-lg">
            <h2 className="text-2xl font-bold text-neutral-700">No Venues Found</h2>
            <p className="text-neutral-500 mt-2">
              {searchTerm
                ? `We couldn't find any venues matching "${searchTerm}".`
                : "No venues are available right now."}
            </p>
          </div>
        )}
        <div className="text-center mt-10">
          {hasMore && (
            <Button onClick={handleLoadMore} disabled={isFetchingMore} variant="secondary" size="lg">
              {isFetchingMore ? "Loading..." : "Load More Venues"}
            </Button>
          )}
        </div>
      </ErrorBoundary>
    );
  };

  return (
    <div className="py-16">
      <section aria-labelledby="page-heading" className="text-center mb-12 bg-black/0">
        <h1 id="page-heading" className="text-5xl font-bold mb-4 py-6 px-2 text-white ">
          Find your perfect stay
        </h1>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </section>

      <div role="status" aria-live="polite" className="sr-only bg-black/0">
        {resultsCount !== null && `${resultsCount} venues found.`}
      </div>

      <section aria-labelledby="venue-results-heading">
        {/* This h2 is visually hidden but provides a crucial landmark for screen reader users */}
        <h2 id="venue-results-heading" className="sr-only bg-black/0">
          Venue Results
        </h2>
        {renderContent()}
      </section>
    </div>
  );
};

export default HomePage;
