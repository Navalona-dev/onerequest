import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { publicApi } from '../../service/publicApi';
import { useTranslation } from "react-i18next";
import api from '../../service/Api';
import { useLangueActive } from '../../hooks/useLangueActive';

import { useGlobalActiveCodeCouleur } from '../../hooks/UseGlobalActiveCodeCouleur';

type Langue = {
  id: number;
  titleFr: string;
  titleEn: string;
  icon: string;
  isActive: boolean;
  indice: string;
}

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [hover, setHover] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();

  const location = useLocation();
  const token = sessionStorage.getItem("jwt");
  const email = sessionStorage.getItem("email");
  const [langues, setListeLangue] = useState<Langue[]>([]);
  const {langueActive, setLangueActive} = useLangueActive();
  const { t, i18n } = useTranslation();

  const getLangLabel = (lang: Langue): string => {
    if (!langueActive) return lang.titleFr;
  
    return langueActive.indice === "fr" ? lang.titleFr : lang.titleEn;
  };
  

  const toggleDropdown = (menu: string) => {
    setDropdownOpen(prev => prev === menu ? null : menu);
  };
  

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

  const handleLangueCurrent = async (langueId: number) => {
    const selectedLangue = langues.find((l) => l.id === langueId);
    if (!selectedLangue) return;
      
    // Appliquer immédiatement
    i18n.changeLanguage(selectedLangue.indice);
    setLangueActive(selectedLangue);
    sessionStorage.setItem("langueActive", JSON.stringify(selectedLangue));

    // Si connecté, enregistrer côté serveur (optionnel)
    if (token) {
      try {
        
        const response = await api.get(`/api/users/${email}/get-user-admin-connected`);
        const userId = response.data.id;
  
        await api.patch(`/api/users/${userId}/set-langue`, {
          langueId: langueId
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de la langue côté serveur:", error);
      }
    }
  
    // Recharge si nécessaire
    window.location.reload();
  };

  useEffect(() => {
    publicApi.get('/api/langues/public')
    .then((response) => {
      setListeLangue(response.data)
    })
    .catch((error) => console.log("Erreur API", error));
  }, []);

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
            <span>{t("menu.followus")} : </span>
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
            <span className="font-semibold">{t('menu.callus')}: +012 345 6789</span>
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
            className="text-2xl font-bold text-white px-6 py-3 [clip-path:polygon(0_0,100%_0,90%_100%,0_100%)]">
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
          >{t("menu.home")}</a>

            <a href='#' 
              className="block py-2 px-4"
              onMouseEnter={() => setHovered("about")}
               onMouseLeave={() => setHovered(null)}
              style={{
                color:
                  hovered === "about"
                    ? codeCouleur?.textColorHover
                    : activeMenu === "about"
                    ? codeCouleur?.textColor
                    : "#000",
              }}
            >
                {t("menu.about")}
            </a>
            <a href='#' 
              className="block py-2 px-4"
              onMouseEnter={() => setHovered("service")}
               onMouseLeave={() => setHovered(null)}
              style={{
                color:
                  hovered === "service"
                    ? codeCouleur?.textColorHover
                    : activeMenu === "service"
                    ? codeCouleur?.textColor
                    : "#000",
              }}
            >
              {t("menu.services")}
            </a>

            <div className="relative group block py-2 px-4">
              <button
                onClick={() => toggleDropdown("page")}
                className="flex items-center hover:text-red-500 lg:cursor-default"
                type="button"
                onMouseEnter={() => setHovered("page")}
               onMouseLeave={() => setHovered(null)}
                style={{
                  backgroundColor: "transparent",
                  color:
                  hovered === "page"
                    ? codeCouleur?.textColorHover
                    : activeMenu === "page"
                    ? codeCouleur?.textColor
                    : "#000",
                }}
              >
                {t("menu.pages")} <i className="bi bi-chevron-down ml-1 text-xs"></i>
              </button>

              <div
                className={`
                  absolute bg-white shadow-md rounded z-10
                  ${dropdownOpen === "page" ? "block w-[35vh]" : "hidden w-[35vh]"}  
                  group-hover:block
                `}
              >
                <a href='/#tutoriel' className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Tutoriel</a>
                <a href='/#service' className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Service</a>
                <a href='/#testimonial' className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">{t("menu.testimonial")}</a>
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
            >{t("menu.contact")}</a>

            <div className="relative group block py-2 px-4">
              <button
                onClick={() => toggleDropdown("account")}
                className="flex items-center hover:text-red-500 lg:cursor-default"
                type="button"
                onMouseEnter={() => setHovered("account")}
               onMouseLeave={() => setHovered(null)}
                style={{
                  backgroundColor: "transparent",
                  color:
                  hovered === "account"
                    ? codeCouleur?.textColorHover
                    : activeMenu === "account"
                    ? codeCouleur?.textColor
                    : "#000",
                }}
              >
                {t("menu.account")} <i className="bi bi-chevron-down ml-1 text-xs"></i>
              </button>

              <div
                className={`
                  absolute bg-white shadow-md rounded z-10
                  ${dropdownOpen === "account" ? "block w-[35vh]" : "hidden w-[35vh]"}  
                  group-hover:block
                `}
              >
                {token ? (
                  <>
                  <a href='#' onClick={() => handleMenuClick("mes-demandes")} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">{t("menu.myRequests")}</a>
                  <a href='/logout' className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">{t("menu.logout")}</a>
                  
                  </>
                ) : (
                  <>
                    <a href='#' onClick={() => handleMenuClick("connexion")}  className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">{t("menu.login")}</a>
                    <a href='#'
                     className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                     onClick={() => handleMenuClick("inscription")} 
                     >
                      {t("menu.register")}
                    </a>
                  </>
                )}
                
              </div>
            </div>

            <div className="relative group block py-2 px-4">
              <button
                onClick={() => toggleDropdown("autre")}
                className="flex items-center lg:cursor-default"
                type="button"
                onMouseEnter={() => setHovered("autre")}
               onMouseLeave={() => setHovered(null)}
                style={{
                  backgroundColor: "transparent",
                  color:
                  hovered === "autre"
                    ? codeCouleur?.textColorHover
                    : activeMenu === "autre"
                    ? codeCouleur?.textColor
                    : "#000",
                }}
              >
                Autre <i className="bi bi-chevron-down ml-1 text-xs"></i>
              </button>

              <div
                className={`
                  absolute bg-white shadow-md rounded z-10
                  ${dropdownOpen === "autre" ? "block w-[35vh]" : "hidden w-[35vh]"}  
                  group-hover:block
                `}
              >
                
                <a href='#' 
                className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleMenuClick("rendez-vous")} 
                >
                  {t("menu.appointment")}
                </a>
                
              </div>
            </div>

            <div className="relative group block py-2 px-4">
              <button
                onClick={() => toggleDropdown("langue")}
                className="flex items-center lg:cursor-default"
                type="button"
                onMouseEnter={() => setHovered("langue")}
               onMouseLeave={() => setHovered(null)}
                style={{
                  backgroundColor: "transparent",
                  color:
                  hovered === "langue"
                    ? codeCouleur?.textColorHover
                    : activeMenu === "langue"
                    ? codeCouleur?.textColor
                    : "#000",
                }}
              >
                 <span className='mr-2'>{langueActive?.icon}</span> <span>{langueActive && getLangLabel(langueActive)}</span> <i className="bi bi-chevron-down ml-1 text-xs"></i>
              </button>

              <div
                className={`
                  absolute bg-white shadow-md rounded z-10
                  ${dropdownOpen === "langue" ? "block w-[35vh]" : "hidden w-[35vh]"}  
                  group-hover:block
                `}
              >
                {langues.map((item, index) => (
                  <a
                  href="#"
                  key={item.id}
                  className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLangueCurrent(item.id);
                  }}
                >
                  {item.icon}
                  <span className='ml-2'>{getLangLabel(item)}</span>
                </a>
                
                ))}
                
              </div>
            </div>

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
              {t("menu.submit")}
            </a>
            
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
