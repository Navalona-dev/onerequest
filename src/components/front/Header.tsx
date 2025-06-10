import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { useGlobalActiveCodeCouleur } from '../../hooks/UseGlobalActiveCodeCouleur';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [hover, setHover] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();

  const location = useLocation();

  // Toggle dropdown mobile
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleMenuClick = (menu: string) => {
    localStorage.setItem("activeMenu", menu); // sauvegarde
    navigate(menu === "" ? "/" : `/${menu}`, { replace: true });
    window.location.reload(); // recharge
  };
  
  useEffect(() => {
    const savedMenu = localStorage.getItem("activeMenu");
    const path = location.pathname;
  
    if (savedMenu) {
      setActiveMenu(savedMenu);
      //localStorage.removeItem("activeMenu"); // optionnel
    } else {
      // détecte automatiquement
      if (path === "/" || path.includes("")) {
        setActiveMenu("");
      } else if (path.includes("/about")) {
        setActiveMenu("about");
      } else if (path.includes("/service")) {
        setActiveMenu("service");
      } else if (path.includes("/page")) {
        setActiveMenu("page");
      } else if (path.includes("/contact")) {
        setActiveMenu("contact");
      } else if (path.includes("/soumettre-demande")) {
        setActiveMenu("soumettre-demande");
      } else if (path.includes("/rendez-vous")) {
        setActiveMenu("rendez-vous");
      }
    }
  }, [location.pathname]);
  
  

  return (
    <>
      {/* Top Bar */}
      <div 
      style={{
        backgroundColor: codeCouleur?.bgColor
      }}
        className="text-white px-0 hidden lg:block"
        >
        <div className="mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8 ps-5 ml-12">
            <span>Follow Us : </span>
            <a href="#"><i className="bi bi-facebook"></i></a>
            <a href="#"><i className="bi bi-twitter"></i></a>
            <a href="#"><i className="bi bi-linkedin"></i></a>
            <a href="#"><i className="bi bi-instagram"></i></a>
          </div>
          <div 
          style={{
            backgroundColor: codeCouleur?.btnColor
          }}
            className="relative px-8 py-3 flex items-center pr-16"
          >
            <div 
            style={{
              backgroundColor: codeCouleur?.bgColor
            }}
            className="absolute left-0 top-0 h-full w-6 [clip-path:polygon(0_0,100%_0,0_100%)]"
            ></div>
            <i className="bi bi-telephone-fill mr-2 text-lg"></i>
            <span className="font-semibold">Call Us: +012 345 6789</span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow">
        <div className="mx-auto flex items-center justify-between px-4 py-3">
          <a href="#" 
            style={{
              backgroundColor: codeCouleur?.btnColor
            }}
            className="text-4xl font-bold text-white px-6 py-3 [clip-path:polygon(0_0,100%_0,90%_100%,0_100%)]">
            ONEREQUEST
          </a>

          {/* Mobile toggle */}
          <button className="lg:hidden text-gray-700" onClick={() => setMenuOpen(!isMenuOpen)}>
            <i className="bi bi-list text-3xl"></i>
          </button>

          {/* Nav Links */}
          <div className={`flex-col lg:flex-row lg:flex ${isMenuOpen ? "flex" : "hidden"} absolute lg:static top-16 left-0 w-full lg:w-auto bg-white lg:bg-transparent p-4 lg:p-0 z-50 shadow-lg lg:shadow-none`}>
          <a href='#' onClick={() => handleMenuClick("")} 
             onMouseEnter={() => setHovered("")}
             onMouseLeave={() => setHovered(null)}
              style={{
              color:
                hovered === ""
                  ? codeCouleur?.textColorHover
                  : activeMenu === ""
                  ? codeCouleur?.textColor
                  : "#000",
            }}
            className="block py-2 px-4 font-semibold"
          >Accueil</a>

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
            
            <a href="#" onClick={() => handleMenuClick("contact")} 
              
               onMouseEnter={() => setHovered("contact")}
               onMouseLeave={() => setHovered(null)}
                style={{
                color:
                  hovered === "contact"
                    ? codeCouleur?.textColorHover
                    : activeMenu === "contact"
                    ? codeCouleur?.textColor
                    : "#000",
              }}

              className="block py-2 px-4"
            >Contact</a>
            <a href='#' onClick={() => handleMenuClick("soumettre-demande")} 
             style={{
              backgroundColor:
                hovered === "soumettre-demande"
                  ? codeCouleur?.btnColorHover
                  : codeCouleur?.btnColor,
            }}
             onMouseEnter={() => setHovered("soumettre-demande")}
             onMouseLeave={() => setHovered(null)}
            className="mt-2 lg:mt-0 lg:ml-4 text-white px-4 py-2"
            >
              Soumettre une demande
            </a>
            <a href='#' onClick={() => handleMenuClick("rendez-vous")} 
              style={{
                backgroundColor:
                  hovered === "rendez-vous"
                    ? codeCouleur?.btnColorHover
                    : codeCouleur?.btnColor,
              }}
              onMouseEnter={() => setHovered("rendez-vous")}
              onMouseLeave={() => setHovered(null)}
              className="mt-2 lg:mt-0 lg:ml-4 text-white px-4 py-2 rounded ">
              Prendre un rendez-vous
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
