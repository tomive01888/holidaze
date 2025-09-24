import SearchBar from "./SearchBar";

/**
 * Props for the HeroSection component.
 */
interface HeroSectionProps {
  /**
   * Current search term value.
   * This is passed down to the SearchBar input.
   */
  searchTerm: string;

  /**
   * Callback function triggered when the search input changes.
   * @param term - The updated search string.
   */
  onSearchChange: (term: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

/**
 * HeroSection component
 *
 * Displays a full-width hero section with a background image,
 * a headline, a subheading, and a search bar for finding venues/destinations.
 *
 * Accessibility:
 * - The section is given an `aria-label` for screen readers to describe its purpose.
 * - Headings (`<h1>`) and descriptive text (`<p>`) provide clear context.
 *
 * @param {HeroSectionProps} props - The props for the component.
 * @returns {JSX.Element} The rendered hero section with a search bar.
 */
const HeroSection = ({ searchTerm, onSearchChange, searchInputRef }: HeroSectionProps) => {
  return (
    <section
      aria-label="Find your perfect stay"
      className="relative flex flex-col items-center justify-center h-[500px] bg-cover bg-center text-white rounded-lg"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1612278675615-7b093b07772d?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
      }}
    >
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative z-10 text-center px-4 backdrop-blur-[1.5px] p-3 h-fit md:h-full grid place-content-center bg-black/15 w-full md:w-fit">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-xs drop-shadow-black/80">
          Your Next Adventure Awaits
        </h1>
        <p className="text-xl md:text-2xl mb-8 drop-shadow-xs drop-shadow-black/80">
          Find breathtaking destinations and unique places to stay.
        </p>
        <div className="w-full max-w-2xl mx-auto">
          <SearchBar searchTerm={searchTerm} setSearchTerm={onSearchChange} ref={searchInputRef} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
