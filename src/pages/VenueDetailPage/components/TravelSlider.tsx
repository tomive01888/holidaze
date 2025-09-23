import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import parisImg from "../../../assets/paris.avif";
import tokyoImg from "../../../assets/tokyo.avif";
import newyorkImg from "../../../assets/newyork.avif";
import riodejaneiroImg from "../../../assets/riodejaneiro.avif";
import romeImg from "../../../assets/rome.avif";
import sydneyImg from "../../../assets/sydney.avif";
import istanbulImg from "../../../assets/istanbul.avif";
import capetownImg from "../../../assets/capetown.avif";
import barcelonaImg from "../../../assets/barcelona.avif";
import bangkokImg from "../../../assets/bangkok.avif";

type TravelImage = {
  /** Unique identifier for the image (used as React key). */
  id: number;

  /** The city name displayed on the slider. */
  city: string;

  /** The country the city belongs to. */
  country: string;

  /** The imported image source path. */
  src: string;
};

const travelImages: TravelImage[] = [
  {
    id: 1,
    city: "Paris",
    country: "France",
    src: parisImg,
  },
  {
    id: 2,
    city: "Tokyo",
    country: "Japan",
    src: tokyoImg,
  },
  {
    id: 3,
    city: "New York",
    country: "USA",
    src: newyorkImg,
  },
  {
    id: 4,
    city: "Rio de Janeiro",
    country: "Brazil",
    src: riodejaneiroImg,
  },
  {
    id: 5,
    city: "Rome",
    country: "Italy",
    src: romeImg,
  },
  {
    id: 6,
    city: "Sydney",
    country: "Australia",
    src: sydneyImg,
  },
  {
    id: 7,
    city: "Istanbul",
    country: "Turkey",
    src: istanbulImg,
  },
  {
    id: 8,
    city: "Cape Town",
    country: "South Africa",
    src: capetownImg,
  },
  {
    id: 9,
    city: "Barcelona",
    country: "Spain",
    src: barcelonaImg,
  },
  {
    id: 10,
    city: "Bangkok",
    country: "Thailand",
    src: bangkokImg,
  },
];

/**
 * TravelSlider component
 *
 * Displays a slideshow of travel destination images with
 * smooth fade-in/out animations and a text overlay using Framer Motion.
 *
 * - Automatically cycles through images every 7 seconds.
 * - Animates both the image transition and the text overlay.
 * - Shows a credit line for Unsplash at the bottom.
 *
 * @component
 * @returns {JSX.Element} A slider with rotating destination images and animated city names.
 */
const TravelSlider = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % travelImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const currentImage = travelImages[currentImageIndex];

  return (
    <div aria-label="Travel destination slideshow" className="relative w-full overflow-hidden rounded-lg shadow-lg">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImage.id}
          src={currentImage.src}
          alt={`A scenic view of ${currentImage.city} from country ${currentImage.country}`}
          className="w-full h-80 md:h-96 object-cover rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.2 }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/30 flex items-start py-6 px-2 lg:p-8 rounded-lg">
        <h2
          aria-live="polite"
          className="text-white font-bold text-3xl md:text-4xl tracking-wide mt-auto flex drop-shadow-md drop-shadow-black select-none"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={currentImage.id}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="ml-2"
            >
              Visit {currentImage.city}!
            </motion.span>
          </AnimatePresence>
        </h2>
      </div>
      <p className="w-full text-end text-sm px-2 text-gray-300 z-10 absolute bottom-2 right-2 select-none">
        Images sourced from Unsplash
      </p>
    </div>
  );
};

export default TravelSlider;
