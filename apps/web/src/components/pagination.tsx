import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => string;
  onNextPage: () => string;
  onPreviousPage: () => string;
  getPageNumbers: () => number[];
  className?: string;
}

export const Pagination = memo<PaginationProps>(function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onNextPage,
  onPreviousPage,
  getPageNumbers,
  className,
}) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("flex justify-center items-center space-x-2", className)}
    >
      {hasPreviousPage ? (
        <Link href={onPreviousPage()} scroll={false}>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-1"
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
        </Link>
      ) : (
        <Button
          variant="outline"
          size="sm"
          disabled
          className="flex items-center space-x-1"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
      )}

      <div className="flex items-center space-x-1">
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === -1) {
            return (
              <div
                key={`ellipsis-${index}`}
                className="flex items-center justify-center w-8 h-8"
                aria-hidden="true"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          }

          const isCurrentPage = pageNumber === currentPage;

          if (isCurrentPage) {
            return (
              <Button
                key={pageNumber}
                variant="default"
                size="sm"
                className="w-8 h-8 p-0 pointer-events-none"
                aria-label={`Page ${pageNumber} (current)`}
                aria-current="page"
              >
                {pageNumber}
              </Button>
            );
          }

          return (
            <Link key={pageNumber} href={onPageChange(pageNumber)} scroll={false}>
              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0"
                aria-label={`Go to page ${pageNumber}`}
              >
                {pageNumber}
              </Button>
            </Link>
          );
        })}
      </div>

      {hasNextPage ? (
        <Link href={onNextPage()} scroll={false}>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-1"
            aria-label="Go to next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <Button
          variant="outline"
          size="sm"
          disabled
          className="flex items-center space-x-1"
          aria-label="Go to next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  );
});

interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  className?: string;
}

export const PaginationInfo = memo<PaginationInfoProps>(function PaginationInfo({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  className,
}) {
  if (totalItems === 0) return null;

  return (
    <div className={cn("text-sm text-muted-foreground text-center", className)}>
      Showing {startIndex + 1}-{endIndex} of {totalItems} results
      {totalPages > 1 && (
        <span className="hidden sm:inline"> (page {currentPage} of {totalPages})</span>
      )}
    </div>
  );
}); 