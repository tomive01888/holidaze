/**
 * @fileoverview A reusable and accessible pagination component for navigating through pages of data.
 * @version 1.0
 * @author Your Name <your.email@example.com>
 * @license MIT
 */

import React, { useState, forwardRef } from "react";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import Button from "../../../components/ui/Button";

interface HomePaginationProps {
  currentPage: number;
  pageCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
  uniqueId?: string;
}

const HomePagination = forwardRef<HTMLElement, HomePaginationProps>(
  ({ currentPage, pageCount, itemsPerPage, onPageChange, onItemsPerPageChange, uniqueId = "" }, ref) => {
    const [inputValue, setInputValue] = useState<string>("");

    const goToPage = (page: number) => {
      if (page >= 1 && page <= pageCount) {
        onPageChange(page);
      }
    };

    const handleInputSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const pageNum = Number(inputValue);
      if (!isNaN(pageNum)) {
        goToPage(pageNum);
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
        ref={ref}
        id={`${uniqueId}-pagination`}
        aria-label="Pagination"
        className={`flex flex-wrap items-center justify-center gap-1 md:gap-2 text-white my-6 scroll-mt-96`}
      >
        {/* Prev button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
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
            onClick={() => goToPage(pageCount)}
            className="hidden md:block w-10 aspect-square text-white rounded-lg bg-blue-500 hover:bg-blue-600 ml-2"
          >
            <p>{pageCount}</p>
          </button>
        )}

        {/* Next button */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          aria-label="Go to next page"
          disabled={currentPage === pageCount}
          className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
        >
          <ChevronRight size={24} aria-hidden="true" />
        </button>

        {/* Page jump input */}
        <form onSubmit={handleInputSubmit} className="flex items-center gap-2">
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
  }
);

export default HomePagination;
