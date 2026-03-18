import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PageInfo {
  page: number;       // 0-indexed (từ BE)
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

interface PaginationProps {
  pageInfo: PageInfo;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ pageInfo, onPageChange, className = '' }) => {
  const { page, totalPages, totalElements, size, first, last } = pageInfo;
  const currentPage = page; // 0-indexed

  if (totalPages <= 1) return null;

  // Tạo danh sách trang hiển thị (tối đa 5 trang)
  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 4) pages.push('...');
      pages.push(totalPages - 1);
    }
    return pages;
  };

  const from = totalElements === 0 ? 0 : currentPage * size + 1;
  const to = Math.min((currentPage + 1) * size, totalElements);

  return (
    <div className={`flex items-center justify-between px-2 py-4 ${className}`}>
      <p className="text-xs text-gray-400 font-bold">
        Hiển thị {from}–{to} / {totalElements} mục
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={first}
          className="size-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="size-4" />
        </button>

        {getPageNumbers().map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="size-9 flex items-center justify-center text-gray-400 text-xs font-bold">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`size-9 flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                p === currentPage
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {(p as number) + 1}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={last}
          className="size-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
