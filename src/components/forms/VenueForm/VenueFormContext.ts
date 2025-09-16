import { createContext, useContext } from "react";
import type { VenueFormData } from "../../../types";

/**
 * Shape of the state and handlers shared via the VenueForm context.
 *
 * @typedef {Object} VenueFormContextType
 * @property {VenueFormData} formData - The current form data for the venue.
 * @property {(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} handleChange -
 *   Generic handler for input and textarea changes, updates the corresponding value in `formData`.
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} handleCheckboxChange -
 *   Handler for checkbox inputs, toggles boolean values in `formData`.
 * @property {string} newImageUrl - URL for a new image being added.
 * @property {(url: string) => void} setNewImageUrl - Setter function to update `newImageUrl`.
 * @property {string} newImageAlt - Alt text for the new image being added.
 * @property {(alt: string) => void} setNewImageAlt - Setter function to update `newImageAlt`.
 * @property {() => void} handleAddNewImage - Adds the currently defined `newImageUrl` and `newImageAlt`
 *   as a new image entry in `formData.images`.
 * @property {(index: number) => void} handleRemoveImage - Removes an image at a given index.
 * @property {(index: number) => void} handleSetMainImage - Sets the image at the given index as the "main" image.
 */
export interface VenueFormContextType {
  formData: VenueFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newImageUrl: string;
  setNewImageUrl: (url: string) => void;
  newImageAlt: string;
  setNewImageAlt: (alt: string) => void;
  handleAddNewImage: () => void;
  handleRemoveImage: (index: number) => void;
  handleSetMainImage: (index: number) => void;
}

/**
 * Context object for sharing venue form state and handlers.
 *
 * @type {import("react").Context<VenueFormContextType | null>}
 *
 * @remarks
 * The provider for this context is created and used in `VenueForm/index.tsx`.
 */
export const VenueFormContext = createContext<VenueFormContextType | null>(null);

/**
 * Custom hook to access the `VenueFormContext`.
 *
 * @returns {VenueFormContextType} The form state and handler functions.
 *
 * @throws {Error} If used outside of a `<VenueFormProvider>`, an error is thrown to prevent null access.
 *
 * @example
 * ```tsx
 * const { formData, handleChange } = useVenueForm();
 * ```
 */
export const useVenueForm = () => {
  const context = useContext(VenueFormContext);
  if (!context) {
    throw new Error("useVenueForm must be used within a VenueFormProvider");
  }
  return context;
};
