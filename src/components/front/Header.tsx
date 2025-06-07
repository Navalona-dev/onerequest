import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Toggle dropdown mobile
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleMenuClick = (menu: string) => {
    if (menu === "accueil") {
      navigate("/", { replace: true });
    } else {
      navigate(`/${menu}`, { replace: true });
    }
    window.location.reload(); // Forcer le reload si nécessaire
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#111C44] text-white px-0 hidden lg:block">
        <div className="mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8 ps-5 ml-12">
            <span>Follow Us : </span>
            <a href="#"><i className="bi bi-facebook"></i></a>
            <a href="#"><i className="bi bi-twitter"></i></a>
            <a href="#"><i className="bi bi-linkedin"></i></a>
            <a href="#"><i className="bi bi-instagram"></i></a>
          </div>
          <div className="relative bg-red-500 px-8 py-3 flex items-center pr-16">
            <div className="absolute left-0 top-0 h-full w-6 bg-[#111C44] [clip-path:polygon(0_0,100%_0,0_100%)]"></div>
            <i className="bi bi-telephone-fill mr-2 text-lg"></i>
            <span className="font-semibold">Call Us: +012 345 6789</span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow">
        <div className="mx-auto flex items-center justify-between px-4 py-3">
          <a href="#" className="text-4xl font-bold text-white bg-red-500 px-6 py-3 [clip-path:polygon(0_0,100%_0,90%_100%,0_100%)]">
            ONEREQUEST
          </a>

          {/* Mobile toggle */}
          <button className="lg:hidden text-gray-700" onClick={() => setMenuOpen(!isMenuOpen)}>
            <i className="bi bi-list text-3xl"></i>
          </button>

          {/* Nav Links */}
          <div className={`flex-col lg:flex-row lg:flex ${isMenuOpen ? "flex" : "hidden"} absolute lg:static top-16 left-0 w-full lg:w-auto bg-white lg:bg-transparent p-4 lg:p-0 z-50 shadow-lg lg:shadow-none`}>
            <a href='#' onClick={() => handleMenuClick("accueil")} className="block py-2 px-4 text-red-500 font-semibold">Accueil</a>
            <a href='#' className="block py-2 px-4 hover:text-red-500">À propos</a>
            <a href='#' className="block py-2 px-4 hover:text-red-500">Services</a>

            <div className="relative group block py-2 px-4">
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)} // toggle au clic
                className="flex items-center hover:text-red-500 lg:cursor-default"
                type="button"
                aria-expanded={isDropdownOpen}
              >
                Pages <i className="bi bi-chevron-down ml-1"></i>
              </button>

              <div
                className={`
                  absolute bg-white shadow-md rounded z-10
                  ${isDropdownOpen ? "block w-[30vh]" : "hidden w-[35vh]"}  
                  group-hover:block
                `}
              >
                <a href='/#tutoriel' className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Tutoriel</a>
                <a href='/#service' className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Service</a>
                <a href='/#testimonial' className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Testimonials</a>
              </div>
            </div>


            
            
            <a href="#" onClick={() => handleMenuClick("contact")} className="block py-2 px-4 hover:text-red-500">Contact</a>
            <a href='#' onClick={() => handleMenuClick("soumettre-demande")} className="mt-2 lg:mt-0 lg:ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Soumettre une demande
            </a>
            <a href='#' onClick={() => handleMenuClick("rendez-vous")} className="mt-2 lg:mt-0 lg:ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Prendre un rendez-vous
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
