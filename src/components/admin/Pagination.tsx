import React from "react";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();

  if (totalPages <= 1) return null;
  const getVisiblePages = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Si peu de pages, tout afficher
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 4) {
      // Début de pagination
      pages.push(1, 2, 3, 4, 5, 6, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      // Fin de pagination
      pages.push(1, "...");

      for (let i = totalPages - 5; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Milieu de pagination
      pages.push(1, "...");
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
      pages.push("...", totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <>
    {codeCouleur?.id && (
      <style>
        {`
          .btn-page:hover {
            background-color: ${codeCouleur.btnColor} !important
          }
        `}
      </style>
    )}
      <div className="flex flex-col sm:flex-row flex-wrap mb-5 items-center sm:items-start justify-center sm:justify-between text-center sm:text-left">
        <span className="text-sm text-gray-500 dark:text-white mt-5">
          Page <span className="font-semibold text-gray-400 mx-2 dark:text-white">{currentPage}</span> /{" "}
          <span className="font-semibold text-gray-400 mx-2 dark:text-white">{totalPages}</span>
        </span>
        <div className="mt-2 sm:mt-4 sm:ml-auto sm:mr-5">
          <nav aria-label="Page navigation">
            <ul className="flex items-center -space-x-px h-8 text-sm">
              <li>
                <button
                  disabled={currentPage === 1}
                  onClick={() => onPageChange(currentPage - 1)}
                  className="flex items-center justify-center px-3 h-8 ms-0 border border-e-0 border-red-500 rounded-s-lg hover:bg-[#1c2d55] text-white disabled:opacity-50"
                  style={{
                    backgroundColor: "transparent"
                  }}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                  </svg>
                </button>
              </li>

              {visiblePages.map((page, index) => (
                <li key={`${page}-${index}`}>
                  {page === "..." ? (
                    <span className="px-3 h-8 flex items-center justify-center text-white">...</span>
                  ) : (
                    <button
                      onClick={() => onPageChange(page as number)}
                      className={`flex items-center justify-center px-3 h-8 border text-white btn-page`}
                      style={{
                        backgroundColor: currentPage === page ? codeCouleur?.btnColor : 'transparent',
                        borderColor: codeCouleur?.btnColor
                      }}
                    >
                      {page}
                    </button>
                  )}
                </li>
              ))}

              <li>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => onPageChange(currentPage + 1)}
                  className="flex items-center justify-center px-3 h-8 border border-red-500 rounded-e-lg hover:bg-[#1c2d55] text-white disabled:opacity-50"
                  style={{
                    backgroundColor: "transparent"
                  }}
                >
                  <span className="sr-only">Next</span>
                  <svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Pagination;
