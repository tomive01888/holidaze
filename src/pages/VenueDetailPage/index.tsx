import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient, ApiError } from "../../api/apiClient";
import { endpoints } from "../../constants/endpoints";
import type { FullVenue, SingleVenueApiResponse } from "../../types";
import NotFoundPage from "../NotFoundPage";
import Button from "../../components/ui/Button";
import ShareButton from "./components/ShareButton";
import Spinner from "../../components/ui/Spinner";
import { PageTitle } from "../../components/ui/PageTitle";
import VenueFooter from "./components/VenueFooter";
import VenueInformation from "./components/VenueInformation";
import Amenities from "./components/Amenities";
import CrashingComponent from "../../components/ui/CrashComponent";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import { motion } from "motion/react";

const VenueDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<FullVenue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | Error | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const fetchVenue = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const endpoint = `${endpoints.venues.byId(id)}?_owner=true&_bookings=true`;
      const response = await apiClient.get<SingleVenueApiResponse>(endpoint);
      setVenue(response.data);
    } catch (err) {
      setError(err as ApiError | Error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVenue();
  }, [fetchVenue]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner text="Loading venue..." />
      </div>
    );
  }

  if (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      return <NotFoundPage />;
    }
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-error">Oops! Something went wrong.</h2>
        <p className="text-neutral-300 mt-2">{error.message}</p>
        <Link to="/" className="mt-6 inline-block">
          <Button variant="primary">Go back to Homepage</Button>
        </Link>
      </div>
    );
  }

  if (!venue) {
    return <NotFoundPage />;
  }

  return (
    <div className="py-16 bg-black/0">
      <PageTitle title={`Holidaze | ${venue.name}`} />
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start mb-6 text-white">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-100">
            {venue.name ? venue.name : "Unknown"}
          </h1>
          <p className="text-xl text-neutral-200 mt-1">
            <span className="font-black">
              {venue.location?.city ? `${venue.location?.city}, ${venue.location?.country}` : "No set location"}
            </span>
          </p>
        </div>
        <ShareButton />
      </div>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-y-8 lg:gap-x-8">
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <ErrorBoundary>
            Image gallery coming soon!
            <CrashingComponent />
            <div className="min-h-[50vh] bg-black/30 animate-pulse rounded-2xl border-2 border-black" />
          </ErrorBoundary>
        </motion.div>

        <div className="lg:col-start-4 lg:col-span-2 lg:row-start-1 row-span-2 top-24">
          <ErrorBoundary>
            booking coming soon!
            <div className="min-h-[50vh] bg-black/30 animate-pulse rounded-2xl border-2 border-black sticky top-24">
              <CrashingComponent />
            </div>
          </ErrorBoundary>
        </div>

        <div className="lg:row-start-2 lg:col-span-3 space-y-12">
          <motion.div initial={{ y: 70, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
            <VenueInformation venue={venue} />{" "}
          </motion.div>
          <motion.section
            className="bg-none bg-transparent"
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold border-b pb-3 mb-6 bg-transparent">Amenities</h2>
            <Amenities meta={venue.meta} />
          </motion.section>
          <motion.section
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold border-b pb-3 mb-4">About this venue</h2>
            <div className="text-lg max-w-none text-neutral-100 break-words">
              <p>{venue.description ? venue.description : "This venue has no description."}</p>
            </div>
          </motion.section>
          <motion.section
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <VenueFooter venue={venue} />
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailPage;
