import { useVenueForm } from "../VenueFormContext";

/**
 * A fieldset component for managing the venue's location details.
 * It consumes the VenueFormContext to get the current form data and the
 * generic `handleChange` function for text inputs.
 */
export const LocationFields = () => {
  const { formData, handleChange } = useVenueForm();

  const labelClasses = "block text-sm font-medium text-neutral-700";
  const inputClasses =
    "mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500";

  return (
    <fieldset className="space-y-4 p-4 border rounded-md">
      <legend className="text-xl font-bold px-2">Location</legend>

      <div>
        <label htmlFor="location.address" className={labelClasses}>
          Address
        </label>
        <input
          id="location.address"
          name="location.address"
          type="text"
          value={formData.location.address || ""}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location.city" className={labelClasses}>
            City
          </label>
          <input
            id="location.city"
            name="location.city"
            type="text"
            value={formData.location.city || ""}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="location.zip" className={labelClasses}>
            Zip Code
          </label>
          <input
            id="location.zip"
            name="location.zip"
            type="text"
            value={formData.location.zip || ""}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="location.country" className={labelClasses}>
          Country
        </label>
        <input
          id="location.country"
          name="location.country"
          type="text"
          value={formData.location.country || ""}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      {/* Optional: Add lat/lng fields if you want them to be user-editable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location.lat" className={labelClasses}>
            Latitude (Optional)
          </label>
          <input
            id="location.lat"
            name="location.lat"
            type="number"
            step="any" // Allows decimal values
            value={formData.location.lat || ""}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="location.lng" className={labelClasses}>
            Longitude (Optional)
          </label>
          <input
            id="location.lng"
            name="location.lng"
            type="number"
            step="any"
            value={formData.location.lng || ""}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
      </div>
    </fieldset>
  );
};
