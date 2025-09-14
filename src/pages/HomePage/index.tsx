import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import type { Venue, VenuesApiResponse } from "../../types";
import { apiClient, ApiError } from "../../api/apiClient";
import { useDebounce } from "../../hooks/useDebounce";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import SearchBar from "./components/SearchBar";
import VenueCard from "./components/VenueCard";
import VenueCardSkeleton from "./components/VenueCardSkeleton";
import HomePagination from "./components/HomePagination";
import { toast } from "react-toastify";
import { endpoints } from "../../constants/endpoints";
import Button from "../../components/ui/Button";

const DEFAULT_ITEMS_PER_PAGE = 12;

const HomePage = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [pageCount, setPageCount] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const mainContentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const urlPage = Number(searchParams.get("page")) || 1;
    const urlItems = Number(searchParams.get("itemsPerPage")) || DEFAULT_ITEMS_PER_PAGE;
    setPage(urlPage);
    setItemsPerPage(urlItems);
  }, [searchParams]);

  useEffect(() => {
    setSearchParams({ page: String(page), itemsPerPage: String(itemsPerPage) });
  }, [page, itemsPerPage, setSearchParams]);

  const fetchData = useCallback(async (pageNum: number, perPage: number, query: string) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setError(null);

    try {
      const endpointUrl = query
        ? `${endpoints.venues.search(query)}&limit=${perPage}&page=${pageNum}`
        : `${endpoints.venues.all}?sort=created&sortOrder=desc&limit=${perPage}&page=${pageNum}`;

      const response = await apiClient.get<VenuesApiResponse>(endpointUrl, { signal });

      if (!Array.isArray(response.data)) throw new Error("Invalid data from server");

      setVenues(response.data);
      setPageCount(response.meta.pageCount);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;

      const message = err instanceof ApiError || err instanceof Error ? err.message : "Unknown error";
      setError(message);
      toast.error(message);
    }
  }, []);

  useEffect(() => {
    fetchData(page, itemsPerPage, debouncedSearchTerm).then(() => {
      const mainContent = mainContentRef.current;
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, [page, itemsPerPage, debouncedSearchTerm, fetchData]);

  useEffect(() => {
    setPage(1);
    fetchData(1, itemsPerPage, debouncedSearchTerm);
  }, [debouncedSearchTerm, itemsPerPage, fetchData]);

  useEffect(() => {
    fetchData(page, itemsPerPage, debouncedSearchTerm);
  }, [page, itemsPerPage, debouncedSearchTerm, fetchData]);

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleItemsPerPageChange = (newItems: number) => {
    setItemsPerPage(newItems);
    setPage(1);
  };

  return (
    <div className="py-8">
      <ErrorBoundary>
        <section tabIndex={-1} aria-labelledby="page-heading" className="text-center mb-8">
          <h1 id="page-heading" className="text-5xl font-bold mb-4 py-6 px-2 text-white">
            Find your perfect stay
          </h1>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </section>

        {/* Top pagination */}
        {!error && venues.length > 0 && (
          <HomePagination
            uniqueId="top"
            currentPage={page}
            pageCount={pageCount}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}

        <>
          {/* Venue grid */}
          <section aria-labelledby="venue-results-heading" className="my-6">
            <h2 id="venue-results-heading" className="sr-only">
              {searchTerm ? `Search results for "${searchTerm}"` : "All venues"}
            </h2>

            {error ? (
              <div role="alert" className="text-center bg-red-50 border border-red-200 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-red-800 mb-2">Unable to load venues</h3>
                <p className="text-red-700">{error}</p>
              </div>
            ) : venues.length !== 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[24rem]">
                {Array.from({ length: venues.length || itemsPerPage }).map((_, index) => {
                  const venue = venues[index];
                  return (
                    <li key={venue ? venue.id : `skeleton-${index}`}>
                      {venue ? <VenueCard venue={venue} /> : <VenueCardSkeleton />}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div
                role="status"
                aria-live="polite"
                className="w-full mx-auto bg-black/50 text-neutral-100 p-6 rounded-lg shadow-md"
              >
                <h3 className="text-2xl font-bold mb-2">No Venues Found</h3>
                <p className="text-neutral-200 text-lg">We couldn't find any venues matching "{searchTerm}".</p>
                <Button
                  aria-label="Reset search"
                  variant="primary"
                  type="button"
                  className="place-self-center my-4"
                  onClick={() => setSearchTerm("")}
                >
                  Reset search
                </Button>
              </div>
            )}
          </section>
        </>

        {/* Bottom pagination */}
        {!error && venues.length > 0 && (
          <HomePagination
            uniqueId="bottom"
            currentPage={page}
            pageCount={pageCount}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </ErrorBoundary>
    </div>
  );
};

export default HomePage;
