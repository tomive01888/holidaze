/**
 * @fileoverview Enhanced pagination component with transition state support
 */

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Ellipsis, Loader2 } from "lucide-react";
import Button from "../../../components/ui/Button";

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
  // New optional prop for transition state
  isPending?: boolean;
}

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
  isPending = false,
}: HomePaginationProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const showPagination = !isLoading && hasItems;

  const isUpdating = isLoading || isPending;

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
          disabled={isUpdating}
          className={`w-10 aspect-square rounded-lg text-sm md:text-base transition-all duration-200 ${
            i === currentPage ? "bg-neutral-400 text-white font-bold" : "text-white bg-blue-500 hover:bg-blue-600"
          } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
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
      className={`flex flex-wrap items-center justify-center gap-1 md:gap-2 text-white my-6 transition-opacity duration-300 ${
        showPagination ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Prev button with transition state */}
      <button
        onClick={() => {
          goToPage(currentPage - 1);
          const anchorTag = document.getElementById(anchor);
          if (anchorTag) {
            anchorTag.scrollIntoView({ behavior: "smooth" });
          }
        }}
        aria-label="Go to previous page"
        disabled={currentPage === 1 || isUpdating}
        className={`p-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-neutral-300 disabled:opacity-50 transition-all duration-200 ${
          isUpdating ? "cursor-not-allowed" : ""
        }`}
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

      {/* Mobile compact page indicator with loading state */}
      <div
        className={`md:hidden px-3 py-2 border rounded-lg bg-gray-200 text-black w-18 flex justify-center gap-1 items-center transition-opacity duration-200 ${
          isPending ? "opacity-70" : "opacity-100"
        }`}
        aria-label={`Page ${currentPage} of ${pageCount}`}
      >
        {isPending && <Loader2 size={16} className="animate-spin mr-1" />}
        <span className="font-bold">{currentPage}</span> / <span>{pageCount}</span>
      </div>

      {/* Max page indicator */}
      {currentPage <= pageCount - 2 && (
        <button
          onClick={() => goToPage(pageCount)}
          disabled={isUpdating}
          className={`hidden md:block w-10 aspect-square text-white rounded-lg bg-blue-500 hover:bg-blue-600 ml-2 transition-all duration-200 ${
            isUpdating ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <p>{pageCount}</p>
        </button>
      )}

      {/* Next button with transition state */}
      <button
        onClick={() => {
          goToPage(currentPage + 1);
          const anchorTag = document.getElementById(anchor);
          if (anchorTag) {
            anchorTag.scrollIntoView({ behavior: "smooth" });
          }
        }}
        aria-label="Go to next page"
        disabled={currentPage === pageCount || isUpdating}
        className={`p-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 transition-all duration-200 ${
          isUpdating ? "cursor-not-allowed" : ""
        }`}
      >
        <ChevronRight size={24} aria-hidden="true" />
      </button>

      {/* Page jump input with transition state */}
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
          disabled={isUpdating}
          className={`h-10 aspect-square px-2 border rounded-lg text-center text-white transition-all duration-200 ${
            isUpdating ? "opacity-50 cursor-not-allowed" : ""
          }`}
          placeholder="Pg"
          aria-label="Enter page number to jump to"
        />
        <Button
          variant="primary"
          type="submit"
          disabled={isUpdating}
          className={`w-10 aspect-square !p-0 transition-all duration-200 ${
            isUpdating ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : "GO"}
        </Button>
      </form>

      {/* Items-per-page selector with transition state */}
      <label htmlFor={`${uniqueId}-items-per-page-select`} className="sr-only">
        Items per page
      </label>
      <select
        id={`${uniqueId}-items-per-page-select`}
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        disabled={isUpdating}
        className={`border rounded-lg h-10 px-3 bg-neutral-200 text-black transition-all duration-200 ${
          isUpdating ? "opacity-50 cursor-not-allowed" : ""
        }`}
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
