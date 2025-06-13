type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  
  const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;
  
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
    return (
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
                >
                  <span className="sr-only">Previous</span>
                  <svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                  </svg>
                </button>
              </li>
              {pages.map((page) => (
                <li key={page}>
                  <button
                    onClick={() => onPageChange(page)}
                    className={`flex items-center justify-center px-3 h-8 border border-red-500 ${
                      currentPage === page ? "bg-red-500 text-white" : "hover:bg-[#1c2d55] text-white"
                    }`}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => onPageChange(currentPage + 1)}
                  className="flex items-center justify-center px-3 h-8 border border-red-500 rounded-e-lg hover:bg-[#1c2d55] text-white disabled:opacity-50"
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
    );
  };
  
  export default Pagination;
  