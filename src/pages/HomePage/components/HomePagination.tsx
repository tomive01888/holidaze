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
 * @interface HomePaginationProps
 * @description Props for the HomePagination component.
 * @property {boolean} isLoading - Indicates whether data is currently being loaded. Used to show a loading state or hide the component.
 * @property {boolean} hasItems - Indicates whether there are any items to paginate. Used to hide the component when there are no items.
 * @property {number} currentPage - The current active page number (1-indexed).
 * @property {number} pageCount - The total number of pages available.
 * @property {number} itemsPerPage - The number of items to display on each page.
 * @property {(page: number) => void} onPageChange - Callback function to be executed when the user navigates to a new page.
 * @property {(value: number) => void} onItemsPerPageChange - Callback function to be executed when the user changes the number of items per page.
 * @property {string} [uniqueId=""] - A unique identifier used for generating unique keys and IDs to prevent hydration errors and improve accessibility.
 */
interface HomePaginationProps {
  isLoading: boolean;
  hasItems: boolean;
  currentPage: number;
  pageCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
  anchor: string;
  uniqueId?: string;
}

/**
 * @function HomePagination
 * @description A flexible and responsive pagination component. It includes controls for
 * navigating pages, jumping to a specific page via an input field, and changing
 * the number of items displayed per page. It gracefully handles loading and empty states
 * to prevent layout shifts.
 * @param {HomePaginationProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered pagination component.
 */
const HomePagination = ({
  isLoading,
  hasItems,
  currentPage,
  pageCount,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  uniqueId = "",
  anchor = "",
}: HomePaginationProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const showPagination = !isLoading && hasItems;

  /**
   * @function goToPage
   * @description Handles page navigation logic, ensuring the requested page is within valid bounds.
   * @param {number} page - The target page number.
   */
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pageCount) {
      onPageChange(page);
    }
  };

  /**
   * @function handleInputSubmit
   * @description Handles the form submission for the page jump input field.
   * It parses the input value and navigates to the specified page.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = Number(inputValue);
    if (!isNaN(pageNum)) {
      goToPage(pageNum);
      setInputValue("");
    }
  };

  /**
   * @constant
   * @type {React.ReactElement[]}
   * @description An array of React elements representing the page number buttons.
   * The logic is designed to display a maximum of 3 page numbers around the current page.
   */
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
          onClick={() => goToPage(i)}
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
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-center gap-1 md:gap-2 text-white my-6 ${
        showPagination ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Prev button */}
      <button
        onClick={() => {
          goToPage(currentPage - 1);
          const anchorTag = document.getElementById(anchor);
          if (anchorTag) {
            anchorTag.scrollIntoView({ behavior: "smooth" });
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
        {/* Render ellipsis if there are pages before the visible range */}
        {startPage > 1 && (
          <li className="flex">
            <Ellipsis key={`${uniqueId}-ellipsis-left`} aria-hidden="true" className="place-self-center " />
          </li>
        )}
        {pages}
        {/* Render ellipsis if there are pages after the visible range */}
        {endPage < pageCount && (
          <li className="flex">
            <Ellipsis key={`${uniqueId}-ellipsis-left`} aria-hidden="true" className="place-self-center " />
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

      {/** Max page indicator */}
      {currentPage <= pageCount - 2 && (
        <button
          onClick={() => goToPage(pageCount)}
          className="hidden md:block w-10 aspect-square text-white rounded-lg bg-blue-500 hover:bg-blue-600 ml-2"
        >
          <p>{pageCount}</p>
        </button>
      )}

      {/* Next button */}
      <button
        onClick={() => {
          goToPage(currentPage + 1);
          const anchorTag = document.getElementById(anchor);
          if (anchorTag) {
            anchorTag.scrollIntoView({ behavior: "smooth" });
          }
        }}
        aria-label="Go to next page"
        disabled={currentPage === pageCount}
        className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
      >
        <ChevronRight size={24} aria-hidden="true" />
      </button>

      {/* Page jump input */}
      <form onSubmit={handleInputSubmit} className="flex items-center gap-2 ">
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
          className="h-10 aspect-square px-2 border rounded-lg text-center text-white"
          placeholder="Pg"
          aria-label="Enter page number to jump to"
        />
        <Button variant="primary" type="submit" className="w-10 aspect-square !p-0">
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
