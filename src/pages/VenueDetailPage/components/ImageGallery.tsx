import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Image } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGalleryProps {
  /**
   * Array of media objects to display in the gallery.
   * Each object should have a `url` for the image source, and optionally an `alt` text for accessibility.
   */
  media: { url: string; alt?: string }[];
}

/**
 * ImageGallery component displays a responsive image gallery with navigation controls.
 * It supports keyboard navigation, touch swiping, and animated transitions.
 *
 * Features:
 * - Previous/Next chevron buttons for navigating between images.
 * - Dot indicators for small galleries (<= 10 images).
 * - Keyboard support using left/right arrow keys.
 * - Touch swipe support on mobile devices.
 * - Animated fade transitions between images using Framer Motion.
 * - Accessible to screen readers with live announcements of current image.
 *
 * Accessibility:
 * - Each image has proper alt text (`alt` prop or fallback "Gallery image").
 * - Buttons have `aria-label`s for screen readers.
 * - Live region announces current image for screen readers.
 * - Focusable hidden element allows keyboard users to navigate images with arrow keys.
 *
 * @component
 * @param {ImageGalleryProps} props
 * @returns {JSX.Element} Image gallery with interactive controls.
 *
 * @example
 * const galleryMedia = [
 *   { url: "/images/photo1.jpg", alt: "A beautiful sunrise" },
 *   { url: "/images/photo2.jpg", alt: "Mountain landscape" }
 * ];
 *
 * return <ImageGallery media={galleryMedia} />;
 */
const ImageGallery: React.FC<ImageGalleryProps> = ({ media }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const startX = useRef<number | null>(null);

  const hasMultiple = media.length > 1;

  const goTo = (index: number) => {
    const newIndex = (index + media.length) % media.length;
    setCurrentIndex(newIndex);
  };

  const goPrev = () => goTo(currentIndex - 1);
  const goNext = () => goTo(currentIndex + 1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!hasMultiple) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const delta = endX - startX.current;

    if (Math.abs(delta) > 50) {
      if (delta > 0) {
        goPrev();
      } else {
        goNext();
      }
    }

    startX.current = null;
  };

  if (media.length === 0) {
    return (
      <div className="h-96 bg-neutral-100 rounded-lg flex flex-col gap-2 items-center justify-center text-neutral-600">
        <Image size={54} />
        <span className="text-xl">No image available</span>
      </div>
    );
  }

  return (
    <figure
      className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden focus-within:outline-3  focus-within:outline-dashed focus-within:outline-pink-400 focus-within:outline-offset-2"
      aria-label={`Image gallery with ${media.length} images. Currently showing ${currentIndex + 1}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Hidden focusable button for keyboard navigation */}
      <button
        className="sr-only group-focus:outline-2"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Image gallery keyboard navigation. Use left and right arrows to change images."
      >
        Keyboard navigation
      </button>

      {/* Image transition */}
      <div className="w-full h-full bg-neutral-800">
        <AnimatePresence mode="wait">
          <motion.img
            loading="lazy"
            key={currentIndex}
            src={media[currentIndex].url}
            alt={media[currentIndex].alt || "Gallery image"}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.02 }}
            draggable={false}
          />
        </AnimatePresence>
      </div>

      {/* Chevron buttons */}
      {hasMultiple && (
        <div className="absolute inset-0 flex items-center justify-between px-2 z-10" tabIndex={-1}>
          <button
            tabIndex={-1}
            onClick={goPrev}
            className="bg-white bg-opacity-70 cursor-pointer hover:bg-opacity-90 rounded-full p-2 shadow-md transition"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} className="text-black" />
          </button>
          <button
            tabIndex={-1}
            onClick={goNext}
            className="bg-white bg-opacity-70 cursor-pointer hover:bg-opacity-90 rounded-full p-2 shadow-md transition"
            aria-label="Next image"
          >
            <ChevronRight size={28} className="text-black" />
          </button>
        </div>
      )}

      {/* Dots for small galleries */}
      {hasMultiple && media.length <= 10 && (
        <div
          role="presentation"
          className="hidden absolute bottom-4 left-1/2 -translate-x-1/2 md:flex items-center gap-2 z-50 "
          tabIndex={-1}
        >
          {media.map((_, i) => (
            <button
              key={i}
              tabIndex={-1}
              onClick={() => goTo(i)}
              className={`w-6 h-2 rounded-full transition cursor-pointer ${
                i === currentIndex ? "bg-white w-8 h-3" : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Screen reader text */}
      <div className="sr-only" aria-live="polite">
        {`Image ${currentIndex + 1} of ${media.length}: ${media[currentIndex].alt || "Gallery image"}`}
      </div>
    </figure>
  );
};

export default ImageGallery;
