import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, ApiError } from "../../api/apiClient";
import { endpoints } from "../../constants/endpoints";
import type { Venue, VenueFormData } from "../../types";
import VenueForm from "../../components/forms/VenueForm";
import { toast } from "react-toastify";
import { PageTitle } from "../../components/ui/PageTitle";

const CreateVenuePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (data: VenueFormData) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<{ data: Venue }>(endpoints.venues.all, data);

      toast.success("Venue created successfully!");

      setTimeout(() => {
        navigate(`/venue/${response.data.id}`);
      }, 1000);
    } catch (error) {
      let errorMessage = "Failed to create venue. An unknown error occurred.";
      if (error instanceof ApiError || error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-16">
      <PageTitle title={`Holidaze | Creating new venue`} />

      <VenueForm
        onSubmit={handleCreate}
        isLoading={isLoading}
        formTitle="Create a New Venue"
        submitButtonText="Create Venue"
      />
    </div>
  );
};

export default CreateVenuePage;
