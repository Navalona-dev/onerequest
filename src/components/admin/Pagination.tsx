import React, { useState, useEffect, useRef } from "react";

const Pagination = () => {
    return (
        <div className="flex flex-col sm:flex-row flex-wrap mb-5 items-center sm:items-start justify-center sm:justify-between text-center sm:text-left">

            <span className="text-sm text-gray-500 dark:text-white mt-5">
                Showing 
                <span className="font-semibold text-gray-400 mx-2 dark:text-white">1</span> 
                to <span className="font-semibold text-gray-400 mx-2 dark:text-white">10</span> 
                of <span className="font-semibold text-gray-400 mx-2 dark:text-white">100</span> 
                Entries
            </span>
            <div className="mt-2 sm:mt-4 sm:ml-auto sm:mr-5">

                <nav aria-label="Page navigation example">
                    <ul className="flex items-center -space-x-px h-8 text-sm">
                        <li>
                            <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 border border-e-0 border-red-500 rounded-s-lg hover:bg-[#1c2d55] hover:text-white dark:border-red-500 dark:text-white dark:hover:bg-red-700 text-white dark:hover:text-white">
                                <span className="sr-only">Previous</span>
                                <svg className="w-2.5 h-2.5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="z-10 leading-tight bg-red-500 flex items-center justify-center px-3 h-8 border border-red-500 hover:bg-[#1c2d55] hover:text-white dark:border-red-500 dark:text-white dark:hover:bg-red-700 text-white dark:hover:text-white">1</a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center justify-center px-3 h-8 border border-red-500 hover:bg-[#1c2d55] hover:text-white dark:border-red-500 dark:text-white dark:hover:bg-red-700 text-white dark:hover:text-white">2</a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center justify-center px-3 h-8 border border-red-500 hover:bg-[#1c2d55] hover:text-white dark:border-red-500 dark:text-white dark:hover:bg-red-700 text-white dark:hover:text-white">3</a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center justify-center px-3 h-8 border border-red-500 rounded-e-lg hover:bg-[#1c2d55] hover:text-white dark:border-red-500 dark:text-white dark:hover:bg-red-700 text-white dark:hover:text-white">
                                <span className="sr-only">Next</span>
                                <svg className="w-2.5 h-2.5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};


export default Pagination;