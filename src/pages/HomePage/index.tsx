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
import { motion } from "motion/react";

const DEFAULT_ITEMS_PER_PAGE = 12;

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
  const skipLinkRef = useRef<HTMLAnchorElement>(null);
  const lastPageRef = useRef(page);

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

  useEffect(() => {
    fetchData(page, itemsPerPage, debouncedSearchTerm).then(() => {
      lastPageRef.current = page;
    });
  }, [page, itemsPerPage, debouncedSearchTerm, fetchData]);

  const handleSearchChange = (newSearchTerm: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("q", newSearchTerm);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== page) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", String(newPage));
      setSearchParams(newParams);

      setTimeout(() => {
        skipLinkRef.current?.focus();
      }, 0);
    }
  };

  const handleItemsPerPageChange = (newItems: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("itemsPerPage", String(newItems));
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const shouldShowPagination = searchParams && !error && (venues.length > 0 || pageCount > 0);

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
          <p className="text-neutral-500 mt-2">
            {searchTerm
              ? `We couldn't find any venues matching "${searchTerm}".`
              : "No venues available at the moment."}
          </p>
          {searchTerm && (
            <Button variant="primary" onClick={() => handleSearchChange("")} className="mt-4">
              Clear Search
            </Button>
          )}
        </div>
      );
    }

    return (
      <ul
        id="venue-list"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scroll-mt-[500px]"
        aria-label="Available venues"
      >
        {venues.map((venue) => (
          <motion.li
            tabIndex={-1}
            key={venue.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            data-venue-card
            className="focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 rounded-lg"
            aria-label={`Venue: ${venue.name}`}
          >
            <VenueCard venue={venue} />
          </motion.li>
        ))}
      </ul>
    );
  };

  return (
    <div className="py-8 bg-black/0">
      <PageTitle title={"Holidaze | Homepage"} />

      <ErrorBoundary>
        <section aria-labelledby="page-heading" className="mb-8">
          <h1 id="page-heading" className="text-5xl py-6 text-center">
            Find your perfect stay
          </h1>
          <SearchBar searchTerm={searchTerm} setSearchTerm={handleSearchChange} />
        </section>

        <section className="my-6 scroll-mt-24">
          <h2 id="venue-results-heading" className="sr-only">
            Venues
          </h2>

          {/* Skip link for screen readers */}
          <a
            href="#venue-list"
            ref={skipLinkRef}
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white focus:p-2 focus:text-xl focus:font-bold rounded-md z-50"
          >
            Skip to venue results
          </a>

          {/* Pagination - only shows when there are results to paginate */}
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

          <div className="mt-6">{renderContent()}</div>

          {/* Bottom pagination - same logic */}
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
