import { useVenueForm } from "../VenueFormContext";

export const CoreDetailsFields = () => {
  const { formData, handleChange } = useVenueForm();

  const labelClasses = "block font-medium text-neutral-700";
  const inputClasses =
    "mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500";

  return (
    <fieldset className="space-y-4 p-4 border rounded-md">
      <legend className="font-bold px-2 text-lg">Core Information</legend>
      <div>
        <label htmlFor="name" className={labelClasses}>
          Venue Name
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
          <span className="sr-only">(required)</span>
        </label>
        <input id="name" name="name" value={formData.name} onChange={handleChange} required className={inputClasses} />
      </div>
      <div>
        <label htmlFor="description" className={labelClasses}>
          Description
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
          <span className="sr-only">(required)</span>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="price" className={labelClasses}>
            Price per night (USD)
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="1"
            max="10000"
            value={formData.price}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="maxGuests" className={labelClasses}>
            Max Guests{" "}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(required)</span>
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
        <div>
          <label htmlFor="rating" className={labelClasses}>
            Rating
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.rating}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
      </div>
    </fieldset>
  );
};
