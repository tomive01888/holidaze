import { useVenueForm } from "../VenueFormContext";

/**
 * `LocationFields` is a fieldset component for managing the venue's location details.
 * It uses the `useVenueForm` hook to access `formData` and the generic `handleChange`
 * function for updating text and number inputs.
 *
 * The component includes inputs for:
 * - Address
 * - City
 * - Zip Code
 * - Country
 * - Latitude (optional)
 * - Longitude (optional)
 *
 * It also provides tips for the user to help others find the venue more easily.
 *
 * @component
 * @example
 * <LocationFields />
 */
export const LocationFields = () => {
  const { formData, handleChange } = useVenueForm();

  const labelClasses = "block font-medium text-neutral-700";
  const inputClasses =
    "mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500";

  return (
    <fieldset className="space-y-4 p-4 border rounded-md">
      <legend className="text-xl font-bold px-2 !m-0">Location</legend>

      <p className="italic text-neutral-600 border-dashed border-1 border-neutral-400 rounded p-2 bg-neutral-100">
        <strong>Tip:</strong> Adding country and city helps others find your location.
      </p>

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
          onFocus={(e) => e.target.select()}
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
            onFocus={(e) => e.target.select()}
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
            onFocus={(e) => e.target.select()}
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
          onFocus={(e) => e.target.select()}
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
            onFocus={(e) => e.target.select()}
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
            onFocus={(e) => e.target.select()}
            className={inputClasses}
          />
        </div>
      </div>
    </fieldset>
  );
};
