import React, { useEffect, useRef } from 'react';

import HeroSectionData from '../../datas/HeroSectionData';

const HeroSection = () => {

  return (
    <div id="default-carousel" className="relative w-full" data-carousel="slide">
      <div className="relative min-h-screen overflow-hidden hero-content">
        {HeroSectionData.map((data, index) => (
          <div key={index} className={`${index === 0 ? 'block' : 'hidden'} duration-700 ease-in-out`} data-carousel-item>
            <img src={data.image} className="absolute w-full h-full object-cover top-0 left-0" alt="..." />
            <div className="absolute hero-text max-w-xl w-full p-4 text-center left-1/2 bottom-12 -translate-x-1/2 sm:right-12 sm:left-auto sm:translate-x-0 sm:text-right">
              <h2 className="text-4xl md:text-6xl text-white font-bold mb-2">{data.title}</h2>
              <p className="text-white text-base md:text-lg">{data.desc}</p>
              <p className="mt-6">
                <a href="#" className="rounded-lg bg-red-500 py-3 px-6 text-white hover:bg-red-600">Soumettre une demande</a>
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute pagination-slide z-30 flex bottom-10 left-1/2 -translate-x-1/2 space-x-3 rtl:space-x-reverse sm:left-auto sm:right-12 sm:translate-x-0">
        <button type="button" className="w-3 h-3 rounded-full bg-white" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>
        <button type="button" className="w-3 h-3 rounded-full bg-white" aria-current="false" aria-label="Slide 2" data-carousel-slide-to="1"></button>
        <button type="button" className="w-3 h-3 rounded-full bg-white" aria-current="false" aria-label="Slide 3" data-carousel-slide-to="2"></button>
      </div>


          <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-500 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                  <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
                  </svg>
                  <span className="sr-only">Previous</span>
              </span>
          </button>
          <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-500 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                  <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <span className="sr-only">Next</span>
              </span>
          </button>
      </div>
  );
};

export default HeroSection;
