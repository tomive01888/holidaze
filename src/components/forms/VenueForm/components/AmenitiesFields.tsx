import { useVenueForm } from "../VenueFormContext";

/**
 * A fieldset component for managing the venue's amenities (meta properties).
 * It consumes the VenueFormContext to get the current form data and the
 * handler function for checkbox changes.
 */
export const AmenitiesFields = () => {
  const { formData, handleCheckboxChange } = useVenueForm();

  const amenities = [
    { key: "wifi", label: "Free WiFi Included" },
    { key: "parking", label: "Free Parking" },
    { key: "breakfast", label: "Breakfast Included" },
    { key: "pets", label: "Pets Welcome" },
  ];

  return (
    <fieldset className="p-4 border rounded-md">
      <legend className="font-bold px-2">Amenities</legend>
      <p className="italic text-neutral-600 border-dashed border-1 border-neutral-400 rounded p-2 bg-neutral-100">
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
