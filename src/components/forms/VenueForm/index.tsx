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
 * VenueForm is a comprehensive, multi-part React form for creating or editing venue data.
 * It manages all internal form state and logic, including:
 *  - Text fields (name, description)
 *  - Media (image URLs, alt text, cover image)
 *  - Amenities (wifi, parking, breakfast, pets)
 *  - Location (address, city, zip, country, continent, lat/lng)
 *  - Numeric inputs (price, maxGuests, rating)
 *
 * State and handlers are provided to child components via `VenueFormContext`.
 *
 * @component
 * @param {Object} props
 * @param {VenueFormData} [props.initialData] - Optional initial data to populate the form for editing.
 * @param {(data: VenueFormData) => void} props.onSubmit - Callback fired when the form is submitted with sanitized data.
 * @param {boolean} props.isLoading - Whether the form is in a loading/submitting state.
 * @param {string} props.formTitle - The title displayed at the top of the form.
 * @param {string} [props.submitButtonText="Save Venue"] - Custom text for the submit button.
 *
 * @returns {JSX.Element} The rendered form component.
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

  /**
   * Handles updates to standard input fields (text, textarea, number).
   * Supports nested fields for `location.*` and converts lat/lng to numbers.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - Change event from the input.
   */
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

  /**
   * Handles updates to checkbox inputs for venue amenities (meta).
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event from the checkbox input.
   */
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const key = name.split(".")[1] as keyof VenueFormData["meta"];
    setFormData((prev) => ({ ...prev, meta: { ...prev.meta, [key]: checked } }));
  };

  /**
   * Adds a new image to the venue's media array.
   * Performs validation on URL format and maximum image count.
   */
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

  /**
   * Removes an image from the venue's media array by index.
   *
   * @param {number} indexToRemove - The index of the image to remove.
   */
  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({ ...prev, media: prev.media.filter((_, index) => index !== indexToRemove) }));
  };

  /**
   * Sets a specific image as the main/cover image by moving it to the start of the media array.
   *
   * @param {number} indexToSetAsMain - Index of the image to set as cover.
   */
  const handleSetMainImage = (indexToSetAsMain: number) => {
    if (indexToSetAsMain === 0) return;
    const newMedia = [...formData.media];
    const [itemToMove] = newMedia.splice(indexToSetAsMain, 1);
    newMedia.unshift(itemToMove);
    setFormData((prev) => ({ ...prev, media: newMedia }));
    toast.info("Cover image updated.");
  };

  /**
   * Sanitizes a string or returns null if the result is empty.
   *
   * @param {string | null | undefined} value - The value to sanitize.
   * @returns {string | null} Sanitized string or null if empty.
   */
  function sanitizeOrNull(value: string | null | undefined): string | null {
    if (value == null) return null;
    const clean = DOMPurify.sanitize(value);
    return clean.trim() === "" ? null : clean;
  }

  /**
   * Handles form submission:
   * 1. Sanitizes all string inputs to prevent XSS.
   * 2. Converts numeric fields to numbers.
   * 3. Filters empty media items.
   * 4. Calls `onSubmit` with the final sanitized payload.
   *
   * @param {React.FormEvent} e - The form submission event.
   */
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
