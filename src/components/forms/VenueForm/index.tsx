import React, { useState, useEffect } from "react";
import { VenueFormContext, type VenueFormContextType } from "./VenueFormContext";
import type { VenueFormData } from "../../../types";
import { CoreDetailsFields } from "./components/CoreDetailsFields";
import { MediaFields } from "./components/MediaFields";
import { AmenitiesFields } from "./components/AmenitiesFields";
import { LocationFields } from "./components/LocationFields";
import Button from "../../ui/Button";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";

interface VenueFormProps {
  initialData?: VenueFormData;
  onSubmit: (data: VenueFormData) => void;
  isLoading: boolean;
  formTitle: string;
  submitButtonText?: string;
}

/**
 * A comprehensive, multi-part form for creating and editing venues.
 * It acts as a "smart" container, managing all form state and logic,
 * and providing it down to child fieldset components via a scoped context.
 */
const VenueForm: React.FC<VenueFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  formTitle,
  submitButtonText = "Save Venue",
}) => {
  const [formData, setFormData] = useState<VenueFormData>(
    initialData || {
      name: "",
      description: "",
      media: [],
      price: 1,
      maxGuests: 1,
      rating: 0,
      meta: { wifi: false, parking: false, breakfast: false, pets: false },
      location: { address: null, city: null, zip: null, country: null, continent: null, lat: 0, lng: 0 },
    }
  );

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      const isNumeric = key === "lat" || key === "lng";
      const finalValue = isNumeric ? parseFloat(value) || 0 : value;
      setFormData((prev) => ({ ...prev, location: { ...prev.location, [key]: finalValue } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const key = name.split(".")[1] as keyof VenueFormData["meta"];
    setFormData((prev) => ({ ...prev, meta: { ...prev.meta, [key]: checked } }));
  };

  const handleAddNewImage = () => {
    if (!newImageUrl.trim().startsWith("http")) {
      toast.error("Please enter a valid image URL.");
      return;
    }
    if (formData.media.length >= 8) {
      toast.warn("You can add a maximum of 8 images.");
      return;
    }
    const newMediaObject = { url: newImageUrl, alt: newImageAlt.trim() || "Venue image" };
    setFormData((prev) => ({ ...prev, media: [...prev.media, newMediaObject] }));
    setNewImageUrl("");
    setNewImageAlt("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({ ...prev, media: prev.media.filter((_, index) => index !== indexToRemove) }));
  };

  const handleSetMainImage = (indexToSetAsMain: number) => {
    if (indexToSetAsMain === 0) return;
    const newMedia = [...formData.media];
    const [itemToMove] = newMedia.splice(indexToSetAsMain, 1);
    newMedia.unshift(itemToMove);
    setFormData((prev) => ({ ...prev, media: newMedia }));
    toast.info("Cover image updated.");
  };

  function sanitizeOrNull(value: string | null | undefined): string | null {
    if (value == null) return null;
    const clean = DOMPurify.sanitize(value);
    return clean.trim() === "" ? null : clean;
  }

  const handleSubmit = (e: React.FormEvent) => {
    /** Sanitize string inputs */
    const sanitizedName = DOMPurify.sanitize(formData.name ?? "");
    const sanitizedDescription = DOMPurify.sanitize(formData.description ?? "");
    const sanitizedLocationAddress = sanitizeOrNull(formData.location.address ?? "");
    const sanitizedLocationCity = sanitizeOrNull(formData.location.city ?? "");
    const sanitizedLocationZip = sanitizeOrNull(formData.location.zip ?? "");
    const sanitizedLocationCountry = sanitizeOrNull(formData.location.country ?? "");
    const sanitizedLocationContinent = sanitizeOrNull(formData.location.continent ?? "");

    e.preventDefault();
    const payload: VenueFormData = {
      ...formData,
      name: sanitizedName,
      description: sanitizedDescription,
      media: formData.media.filter((item) => item.url.trim() !== ""),
      price: Number(formData.price),
      maxGuests: Number(formData.maxGuests),
      rating: Number(formData.rating || 0),
      location: {
        ...formData.location,
        address: sanitizedLocationAddress,
        city: sanitizedLocationCity,
        zip: sanitizedLocationZip,
        country: sanitizedLocationCountry,
        continent: sanitizedLocationContinent,
        lat: Number(formData.location.lat || 0),
        lng: Number(formData.location.lng || 0),
      },
    };
    const sanitizedMedia = formData.media.map((item) => ({
      ...item,
      alt: DOMPurify.sanitize(item.alt),
    }));

    const finalPayload = {
      ...payload,
      media: sanitizedMedia,
    };

    onSubmit(finalPayload);
  };

  const contextValue: VenueFormContextType = {
    formData,
    handleChange,
    handleCheckboxChange,
    newImageUrl,
    setNewImageUrl,
    newImageAlt,
    setNewImageAlt,
    handleAddNewImage,
    handleRemoveImage,
    handleSetMainImage,
  };

  return (
    <div className="bg-white p-4 lg:p-8 rounded-lg shadow-lg">
      {/* 
        The Provider wraps the entire form. All child components inside
        can now access the `contextValue` using the `useVenueForm` hook.
      */}
      <VenueFormContext.Provider value={contextValue}>
        <form onSubmit={handleSubmit} className="space-y-8 text-black">
          <h1 className="text-4xl font-bold text-center">{formTitle}</h1>
          <p className="w-full text-end mb-0">
            All marked with (
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
            ) is required
          </p>

          <CoreDetailsFields />
          <MediaFields />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AmenitiesFields />
            <LocationFields />
          </div>

          <Button type="submit" disabled={isLoading} size="lg" className="w-full">
            {isLoading ? "Saving..." : submitButtonText}
          </Button>
        </form>
      </VenueFormContext.Provider>
    </div>
  );
};

export default VenueForm;
