import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  lastPage: number;
  baseUrl: string;
}

export default function PaginationControls({ 
  currentPage, 
  lastPage, 
  baseUrl 
}: PaginationControlsProps) {
  const renderPageLink = (page: number, label?: string) => {
    const isActive = page === currentPage;
    const url = `${baseUrl}?page=${page}`;
    
    return (
      <Link 
        href={url}
        aria-current={isActive ? "page" : undefined}
        className={`join-item btn ${isActive ? 'btn-active' : ''}`}
      >
        {label || page}
      </Link>
    );
  };

  return (
    <div className="flex justify-center mt-4">
      <div className="join">
        {/* Previous page button */}
        {currentPage > 1 && (
          <Link href={`${baseUrl}?page=${currentPage - 1}`} className="join-item btn">
            <ChevronLeft size={16} />
          </Link>
        )}
        
        {/* Page numbers */}
        {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
          let pageNum: number;
          
          // Handle pagination display strategy
          if (lastPage <= 5) {
            // If 5 or fewer pages, show all
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            // If near start, show first 5
            pageNum = i + 1;
          } else if (currentPage >= lastPage - 2) {
            // If near end, show last 5
            pageNum = lastPage - 4 + i;
          } else {
            // Otherwise show current and 2 on each side
            pageNum = currentPage - 2 + i;
          }
          
          // Only render if page number is valid
          return pageNum > 0 && pageNum <= lastPage ? renderPageLink(pageNum) : null;
        })}
        
        {/* Next page button */}
        {currentPage < lastPage && (
          <Link href={`${baseUrl}?page=${currentPage + 1}`} className="join-item btn">
            <ChevronRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}