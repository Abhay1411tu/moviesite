import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers array (with truncation if totalPages > 7)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass border border-gray-200/80 dark:border-white/10 shadow-sm">
      {/* Items count summary */}
      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Showing <span className="font-extrabold text-gray-950 dark:text-white">{startItem}–{endItem}</span> of{" "}
        <span className="font-extrabold text-gray-950 dark:text-white">{totalItems}</span> reviews
      </div>

      {/* Page Navigation Controls */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-black border transition-all shadow-xs",
            currentPage === 1
              ? "opacity-40 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200 dark:bg-white/5 dark:text-gray-500 dark:border-white/10"
              : "bg-white/80 dark:bg-white/10 text-gray-950 dark:text-gray-100 hover:bg-white dark:hover:bg-white/20 border-gray-200/80 dark:border-white/10 hover:text-coral"
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => {
          if (typeof page === "string") {
            return (
              <span key={`dots-${index}`} className="px-2 py-1 text-xs text-gray-400 font-bold select-none">
                …
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "h-9 w-9 sm:h-10 sm:w-10 rounded-xl text-xs sm:text-sm font-extrabold transition-all border flex items-center justify-center shadow-xs",
                isActive
                  ? "bg-coral text-gray-950 font-black border-coral shadow-md scale-105"
                  : "bg-white/80 dark:bg-white/10 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-white/20 border-gray-200/80 dark:border-white/10 hover:text-coral"
              )}
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-black border transition-all shadow-xs",
            currentPage === totalPages
              ? "opacity-40 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200 dark:bg-white/5 dark:text-gray-500 dark:border-white/10"
              : "bg-white/80 dark:bg-white/10 text-gray-950 dark:text-gray-100 hover:bg-white dark:hover:bg-white/20 border-gray-200/80 dark:border-white/10 hover:text-coral"
          )}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
