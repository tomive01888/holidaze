import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { apiClient, ApiError } from "../../api/apiClient";
import { endpoints } from "../../constants/endpoints";
import type { VenueFormData } from "../../types";
import NotFoundPage from "../NotFoundPage";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
import VenueForm from "../../components/forms/VenueForm";

const EditVenuePage = () => {
  const { id } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<VenueFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [error, setError] = useState<ApiError | Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchInitialData = async () => {
      try {
        const response = await apiClient.get<{ data: VenueFormData }>(endpoints.venues.byId(id));
        setInitialData(response.data);
      } catch (err) {
        setError(err as ApiError | Error);
      }
    };

    fetchInitialData();
  }, [id]);

  const handleUpdate = async (data: VenueFormData) => {
    if (!id) return;
    setIsLoading(true);
    try {
      await apiClient.put(endpoints.venues.byId(id), data);
      toast.success("Venue updated successfully!");
      navigate(`/venue/${id}`);
    } catch (error) {
      let errorMessage = "Failed to update venue. An unknown error occurred.";
      if (error instanceof ApiError || error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialData && !error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner text="Loading venue data..." />
      </div>
    );
  }

  if (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      return <NotFoundPage />;
    }

    return (
      <div className="text-center py-20 text-white">
        <h1 className="text-4xl font-bold text-error">Oops! Something went wrong.</h1>
        <p className="text-neutral-300 mt-2">We couldn't load the data for this venue.</p>
        <p className="text-neutral-400 text-md mt-1">Error: {error.message}</p>
        <Link to="/dashboard" className="mt-6 inline-block">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16">
      <VenueForm
        initialData={initialData!}
        onSubmit={handleUpdate}
        isLoading={isLoading}
        formTitle="Edit Your Venue"
        submitButtonText="Save Changes"
      />
    </div>
  );
};

export default EditVenuePage;
