import { useVenueForm } from "../VenueFormContext";

export const CoreDetailsFields = () => {
  const { formData, handleChange } = useVenueForm();

  const labelClasses = "block text-sm font-medium text-neutral-700";
  const inputClasses =
    "mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500";

  return (
    <fieldset className="space-y-4 p-4 border rounded-md">
      <legend>Core Information</legend>
      <div>
        <label htmlFor="name" className={labelClasses}>
          Venue Name*
        </label>
        <input id="name" name="name" value={formData.name} onChange={handleChange} required className={inputClasses} />
      </div>
      <div>
        <label htmlFor="description" className={labelClasses}>
          Description*
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className={`min-h-[240px] ${inputClasses}`}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className={labelClasses}>
            Price per night (USD)*
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            max="10000"
            value={formData.price}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="maxGuests" className={labelClasses}>
            Max Guests*
          </label>
          <input
            id="maxGuests"
            name="maxGuests"
            type="number"
            min="1"
            max="100"
            value={formData.maxGuests}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>
      </div>
    </fieldset>
  );
};
