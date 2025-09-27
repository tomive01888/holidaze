/**
 * @fileoverview A reusable and accessible pagination component for navigating through pages of data.
 * @version 1.0
 * @author Your Name <your.email@example.com>
 * @license MIT
 */

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import Button from "../../../components/ui/Button";

/**
 * Props for the HomePagination component.
 */
interface HomePaginationProps {
  /** The currently active page number */
  currentPage: number;
  /** Total number of pages */
  pageCount: number;
  /** Number of items to show per page */
  itemsPerPage: number;
  /**
   * Callback when the page changes
   * @param page - The page number to navigate to
   * @param source - How the page was changed: "keyboard", "mouse", or "input"
   */
  onPageChange: (page: number, source: "keyboard" | "mouse" | "input") => void;
  /**
   * Callback when the number of items per page changes
   * @param value - New items per page value
   */
  onItemsPerPageChange: (value: number) => void;
  /** Optional unique identifier for accessibility and testing purposes */
  uniqueId?: string;
}

/**
 * HomePagination component provides a fully accessible pagination UI
 * including previous/next buttons, page numbers, jump-to-page input, and items-per-page selector.
 *
 * @param props - Component props
 * @returns JSX.Element
 */
const HomePagination = ({
  currentPage,
  pageCount,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  uniqueId = "",
}: HomePaginationProps) => {
  const [inputValue, setInputValue] = useState<string>("");

  /**
   * Navigate to a specific page if within valid bounds
   * @param page - Page number to navigate to
   * @param source - How the navigation was triggered: "keyboard", "mouse", or "input"
   */
  const goToPage = (page: number, source: "keyboard" | "mouse" | "input") => {
    if (page >= 1 && page <= pageCount) {
      onPageChange(page, source);
    }
  };

  /**
   * Handles form submission from the page jump input
   * @param e - Form event
   */
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = Number(inputValue);
    if (!isNaN(pageNum)) {
      goToPage(pageNum, "input");
      setInputValue("");
    }
  };

  const pages = [];
  const maxPagesToShow = 3;
  let startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(pageCount, startPage + maxPagesToShow - 1);
  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <li key={`${uniqueId}-${i}`}>
        <button
          onClick={() => goToPage(i, "mouse")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              goToPage(i, "keyboard");
            }
          }}
          className={`w-10 aspect-square rounded-lg text-sm md:text-base ${
            i === currentPage ? "bg-neutral-400 text-white font-bold" : "text-white bg-blue-500 hover:bg-blue-600"
          }`}
          aria-label={`Go to page ${i}`}
          aria-current={i === currentPage ? "page" : undefined}
        >
          {i}
        </button>
      </li>
    );
  }

  return (
    <nav
      id={`${uniqueId}-pagination`}
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-center gap-1 md:gap-2 text-white my-6 scroll-mt-96`}
    >
      {/* Prev button */}
      <button
        onClick={() => goToPage(currentPage - 1, "mouse")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            goToPage(currentPage - 1, "keyboard");
          }
        }}
        aria-label="Go to previous page"
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-neutral-300 disabled:opacity-50"
      >
        <ChevronLeft size={24} aria-hidden="true" />
      </button>

      {/* Desktop page numbers */}
      <ul className="hidden md:flex gap-2 md:min-w-32 list-none p-0 m-0">
        {startPage > 1 && (
          <li className="flex">
            <Ellipsis key={`${uniqueId}-ellipsis-left`} aria-hidden="true" className="place-self-center" />
          </li>
        )}
        {pages}
        {endPage < pageCount && (
          <li className="flex">
            <Ellipsis key={`${uniqueId}-ellipsis-right`} aria-hidden="true" className="place-self-center" />
          </li>
        )}
      </ul>

      {/* Mobile compact page indicator */}
      <div
        className="md:hidden px-3 py-2 border rounded-lg bg-gray-200 text-black w-18 flex justify-center gap-1"
        aria-label={`Page ${currentPage} of ${pageCount}`}
      >
        <span className="font-bold">{currentPage}</span> / <span>{pageCount}</span>
      </div>

      {/* Max page indicator */}
      {currentPage <= pageCount - 2 && (
        <button
          onClick={() => goToPage(pageCount, "mouse")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              goToPage(pageCount, "keyboard");
            }
          }}
          className="hidden md:block w-10 aspect-square text-white rounded-lg bg-blue-500 hover:bg-blue-600 ml-2"
        >
          <p>{pageCount}</p>
        </button>
      )}

      {/* Next button */}
      <button
        onClick={() => goToPage(currentPage + 1, "mouse")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            goToPage(currentPage - 1, "keyboard");
          }
        }}
        aria-label="Go to next page"
        disabled={currentPage === pageCount}
        className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
      >
        <ChevronRight size={24} aria-hidden="true" />
      </button>

      {/* Page jump input */}
      <form
        onSubmit={handleInputSubmit}
        className="flex items-center border border-neutral-400 rounded-lg  bg-black/20"
      >
        <label htmlFor={`${uniqueId}-page-jump-input`} className="sr-only">
          Go to page
        </label>
        <input
          id={`${uniqueId}-page-jump-input`}
          type="number"
          min={1}
          max={pageCount}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="h-10 w-16 px-2  text-center text-white"
          placeholder="Pg"
          aria-label="Enter page number to jump to"
        />
        <Button variant="primary" type="submit" className="!w-10 !h-10 text-center !p-0 !rounded-lg ml-1">
          GO
        </Button>
      </form>

      {/* Items-per-page selector */}
      <label htmlFor={`${uniqueId}-items-per-page-select`} className="sr-only">
        Items per page
      </label>
      <select
        id={`${uniqueId}-items-per-page-select`}
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        className="border rounded-lg h-10 px-3 bg-neutral-200 text-black"
        aria-label="Select items per page"
      >
        {[12, 18, 24].map((size) => (
          <option key={`${uniqueId}-ipp-${size}`} value={size}>
            {size} / page
          </option>
        ))}
      </select>
    </nav>
  );
};

export default HomePagination;
