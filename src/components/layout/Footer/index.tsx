import { Link } from "react-router-dom";
import holidazeLogo from "../../../assets/holidaze_logo.png";

/**
 * The main footer component for the application.
 * It contains copyright information, the brand logo, and a disclaimer
 * clarifying the educational purpose of the site.
 */
const Footer = () => {
  return (
    <footer className="bg-neutral-900/50 py-8 px-4 text-center text-neutral-300">
      <div className="container mx-auto">
        {/* Logo */}
        <Link to="/" aria-label="Holidaze Homepage">
          <img
            src={holidazeLogo}
            alt="Holidaze logo with a globe next to it indicating travel around the globe"
            className="w-full max-w-[150px] mx-auto opacity-30 mb-4 focus:rounded-lg focus:outline-dashed focus:outline-offset-2 focus:outline-3 focus:outline-pink-400"
          />
        </Link>

        {/* Copyright Information */}
        <p className="text-sm">© {new Date().getFullYear()} Holidaze Inc. All Rights Reserved.</p>
        <p className="text-xs text-neutral-400">Powered by the Noroff API.</p>

        {/* Disclaimer Section */}
        <div className="mt-6 border-t border-neutral-500 pt-6 max-w-md mx-auto">
          <p className="font-semibold text-neutral-300">Disclaimer</p>
          <p className="text-xs text-neutral-300 mt-2">
            This website is a fictional project created for educational purposes as part of the Noroff School of
            Technology and Digital Media curriculum. All content, including venues and bookings, is for demonstration
            only and does not represent real services.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
