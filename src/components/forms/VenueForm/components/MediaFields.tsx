import { useVenueForm } from "../VenueFormContext";
import Button from "../../../ui/Button";
import { Star, Trash2 } from "lucide-react";

export const MediaFields = () => {
  const {
    formData,
    newImageUrl,
    setNewImageUrl,
    newImageAlt,
    setNewImageAlt,
    handleAddNewImage,
    handleRemoveImage,
    handleSetMainImage,
  } = useVenueForm();

  const isAddButtonDisabled = formData.media.length >= 8 || newImageUrl.trim() === "";

  return (
    <fieldset className="p-4 border rounded-md">
      <legend className="font-bold px-2">Images (up to 8)</legend>

      <p className="italic text-neutral-600 border-dashed border-1 border-neutral-400 rounded p-2 bg-neutral-100">
        <strong>Tip:</strong> Adding images helps attract customers, just make sure they are valid!
      </p>

      {/* Input fields and upload button container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div>
          <label htmlFor="newImageUrl" className="block text-sm font-medium text-neutral-700">
            Image URL
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="newImageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="newImageAlt" className="block text-sm font-medium text-neutral-700">
            Alt Text (Optional)
          </label>
          <input
            id="newImageAlt"
            type="text"
            placeholder="A description of the image"
            value={newImageAlt}
            onChange={(e) => setNewImageAlt(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500"
          />
        </div>
      </div>
      <Button type="button" onClick={handleAddNewImage} disabled={isAddButtonDisabled} className="mt-4">
        {formData.media.length >= 8 ? "Max Reached" : "Add Image"}
      </Button>

      {/* Gallery container for the uploaded images */}
      <div className="mt-4">
        <p className="text-sm text-neutral-600 mb-2">
          The first image is the main cover image. Click the star to change it.
        </p>
        <div className="grid grid-cols-1 grid-480-break md:!grid-cols-3 gap-2 p-2 overflow-x-auto bg-neutral-100 rounded-lg">
          {formData.media.length > 0 ? (
            formData.media.map((image, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 w-full aspect-video rounded-md overflow-hidden group shadow-md"
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://placehold.co/400x300/e2e8f0/475569?text=Invalid+URL";
                    e.currentTarget.alt = "Invalid image URL";
                  }}
                />
                <div className="absolute inset-0 lg:bg-black/60 lg:opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end w-full p-2 lg:items-center lg:justify-center gap-3">
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetMainImage(index)}
                      className="drop-shadow-md drop-shadow-black/30 text-white hover:text-yellow-400 active:text-yellow-400"
                      title="Make cover image"
                    >
                      <Star size={24} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-white hover:text-red-500"
                    title="Delete image"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
                {index === 0 && (
                  <div className="absolute top-1 left-1 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded bg-black/40 backdrop-blur-[5px]">
                    MAIN
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-neutral-400 p-8 flex-shrink-0 w-full">Your image gallery is empty.</p>
          )}
        </div>
      </div>
    </fieldset>
  );
};
