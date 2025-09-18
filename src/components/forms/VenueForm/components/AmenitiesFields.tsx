import { useVenueForm } from "../VenueFormContext";

/**
 * A fieldset component for managing the venue's amenities (meta properties).
 * It consumes the VenueFormContext to get the current form data and the
 * handler function for checkbox changes.
 */
export const AmenitiesFields = () => {
  // Get the necessary state and function from our custom context hook.
  const { formData, handleCheckboxChange } = useVenueForm();

  const amenities = [
    { key: "wifi", label: "WiFi" },
    { key: "parking", label: "Parking" },
    { key: "breakfast", label: "Breakfast" },
    { key: "pets", label: "Pets Allowed" },
  ];

  return (
    <fieldset className="p-4 border rounded-md">
      <legend className="font-black px-2 text-lg">Amenities</legend>
      <p>
        <strong>Tip:</strong> Checked boxes help let customers know what your venue has available!
      </p>
      <div className="space-y-3 mt-4">
        {amenities.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`meta.${key}`}
              name={`meta.${key}`}
              checked={formData.meta[key as keyof typeof formData.meta]}
              onChange={handleCheckboxChange}
              className="h-5 w-5 rounded text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor={`meta.${key}`} className="font-medium text-neutral-700">
              {label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};
