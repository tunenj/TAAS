"use client";

import React, { useState } from "react";

interface PaginationProps {
  totalPages: number;
  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export default function Pagination({
  totalPages,
  initialPage = 1,
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    onPageChange?.(newPage);
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > totalPages) val = totalPages;
    setCurrentPage(val);
    onPageChange?.(val);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    onPageSizeChange?.(newSize);
  };

  return (
    <div className="flex items-center space-x-3 text-sm">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-1 rounded-2xl border border-gray-300 ${
          currentPage === 1
            ? "cursor-not-allowed text-gray-400 bg-gray-100"
            : "hover:bg-orange-200"
        }`}
      >
        Prev
      </button>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-1 rounded-2xl border border-orange-500 bg-orange-500 text-white ${
          currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"
        }`}
      >
        Next
      </button>

      <span>
        Page:{" "}
        <input
          type="number"
          min={1}
          max={totalPages}
          value={currentPage}
          onChange={handlePageInputChange}
          className="w-12 text-center border border-gray-300 rounded-2xl"
        />{" "}
        of {totalPages}
      </span>

      <select
        value={pageSize}
        onChange={handlePageSizeChange}
        className="border border-gray-300 rounded-2xl px-2 py-1"
      >
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}
