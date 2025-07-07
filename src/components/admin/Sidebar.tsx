import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  FaFolder,
  FaRegChartBar,
  FaLock,
  FaHome,
  FaChevronDown,
  FaChevronUp,
  FaPalette,
} from "react-icons/fa";
import { useTheme } from "../../contexts/admin/ThemeContext";
import { useModule } from "../../contexts/admin/ModuleContext";
import { useNavigate } from "react-router-dom";
import { useLayoutContent } from "../../contexts/admin/LayoutContext";
import UserAdminConnected from "../../hooks/UserAdminConnected";
import api from "../../service/Api";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";


type SidebarProps = {
  onCloseMobileSidebar: () => void;
};

type Privilege = {
  id: number;
  title: string;
};

type Region = {
  id: number;
  nom: string;
}

type Commune = {
  id: number;
  nom: string;
}

type Site = {
  id: number;
  nom: string;
  region: Region | null;
  commune: Commune | null;
};

type UserType = {
  id: number;
  nom: string;
  prenom: string;
  privileges: Privilege[];
  site: Site;
  message: string;
  isSuperAdmin: boolean;
};


const Sidebar = ({ onCloseMobileSidebar }: SidebarProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [demandeOpen, setDemandeOpen] = useState<boolean>(false);
  const [isHoveringDemande, setIsHoveringDemande] = useState<boolean>(false);
  const [currentSite, setCurrentSite] = useState<Site | null>(null);

  const location = useLocation();

  const user = UserAdminConnected() as UserType | null;

  const [activeMenu, setActiveMenu] = useState<string>("dashboard");
  const { currentModule, setCurrentModule } = useModule();
  const { isSidebarCollapsed } = useLayoutContent();
  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    setCurrentModule(menu as any);
    setDemandeOpen(false);
    
    // ➕ Change l'URL en fonction du menu
    if (menu === "dashboard") {
      navigate("/admin"); // racine
    } else {
      navigate(`/${menu}`);
    }
     // Forcer le rechargement complet de la page
     //window.location.reload();
  };

  //const bgColor = theme === "dark" ? "bg-[#0B1437] text-white" : theme === "light" ? "bg-white text-gray-900" : "bg-red-500 text-white";

  const hoverColor = theme === "dark" ? "hover:bg-[#1c2d55]" : "hover:bg-[#1c2d55]";

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/admin")) {
      setActiveMenu("dashboard");
    } else if (path.includes("/document")) {
      setActiveMenu("document");
    } else if (path.includes("/code-couleur")) {
      setActiveMenu("code-couleur");
    } else if (path.includes("/demande")) {
      setActiveMenu("demande");
    }else if (path.includes("/site")) {
      setActiveMenu("site");
    }else if (path.includes("/user")) {
      setActiveMenu("user");
    }else if (path.includes("/type-demande")) {
      setActiveMenu("type-demande");
    }
    else if (path.includes("/categorie-domaine-entreprise")) {
      setActiveMenu("categorie-domaine-entreprise");
    }
  }, [location.pathname]);

  useEffect(() => {
    api.get('/api/sites/current')
      .then((response) => {
        if (response.status === 204 || !response.data) {
          setCurrentSite(null);
        } else {
          setCurrentSite(response.data);
        }
      })
      .catch((error) => {
        console.error("Erreur API:", error); // Autres erreurs réseau ou 500
      });
  }, []);
  

  return (
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'} ${theme === "light" ? "text-gray-900" : "text-white"  } min-h-screen p-4 admin-sidebar`}
      style={{
        backgroundColor: theme === "dark" ? "#0B1437" : theme === "light" ? "white" : codeCouleur?.btnColor
      }}
      >
        {onCloseMobileSidebar && (
          <button
            className="md:hidden absolute top-4 right-4 text-white text-xl"
            onClick={onCloseMobileSidebar}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        )}

        <h1 className={`text-2xl font-bold mb-5 ${isSidebarCollapsed ? 'hidden' : 'inline'}`}>ONEREQUEST</h1>
        {user ? (
          user.site ? (
            <h4 className="my-3">{user.site.nom} ({user.site.region?.nom} / {user.site.commune?.nom}) </h4>
          ) : (
            currentSite ? (
              <h4 className="my-3">{currentSite.nom} ({currentSite.region?.nom} / {currentSite.commune?.nom})</h4>
            ) : (
              null
            )
          )
      ) : (
        null
      )}
      <hr />
        <nav className="mt-8">
          <ul className="space-y-2 text-sm">
            <li
              className={`flex items-center gap-2 px-3 py-2 rounded ${hoverColor} cursor-pointer ${
                activeMenu === "dashboard" ? "bg-[#1c2d55] text-white" : ""
              } ${currentModule === "dashboard" ? "bg-[#1c2d55] text-white" : ""}`}
              onClick={() => handleMenuClick("dashboard")}
            >
              <span className="icon-sidebar">
              <i className="bi bi-house-fill"></i>
              </span>
              <span className={`${isSidebarCollapsed ? 'hidden' : 'inline'}`}>Dashboards</span>
            </li>

            <li
              className={`flex items-center gap-2 px-3 py-2 rounded ${hoverColor} cursor-pointer ${
                activeMenu === "document" ? "bg-[#1c2d55] text-white" : ""
              } ${currentModule === "document" ? "bg-[#1c2d55] text-white" : ""}`}
              onClick={() => handleMenuClick("document")}
            >
              <span className="icon-sidebar">
              <i className="bi bi-folder-fill"></i>
              </span>
              <span className={`${isSidebarCollapsed ? 'hidden' : 'inline'}`}>Documents</span>
            </li>

            <li
              className={`flex items-center gap-2 px-3 py-2 rounded ${hoverColor} cursor-pointer ${
                activeMenu === "categorie-domaine-entreprise" ? "bg-[#1c2d55] text-white" : ""
              } ${currentModule === "categorie-domaine-entreprise" ? "bg-[#1c2d55] text-white" : ""}`}
              onClick={() => handleMenuClick("categorie-domaine-entreprise")}
            >
              <span className="icon-sidebar">
              <i className="bi bi-tags-fill"></i>
              </span>
              <span className={`${isSidebarCollapsed ? 'hidden' : 'inline'}`}>Categorie entreprise</span>
            </li>

            {/* Dropdown */}
            <li
              className="flex flex-col relative"
              onMouseEnter={() => isSidebarCollapsed && setIsHoveringDemande(true)}
              onMouseLeave={() => isSidebarCollapsed && setIsHoveringDemande(false)}
            >
              <div
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded cursor-pointer ${hoverColor} ${
                  activeMenu === "demande" ? "bg-[#1c2d55] text-white" : ""
                } ${currentModule === "demande" ? "bg-[#1c2d55] text-white" : ""}`}
                onClick={() => {
                  setActiveMenu("demande");
                  setCurrentModule("demande" as any);
                  if (!isSidebarCollapsed) {
                    setDemandeOpen(!demandeOpen);
                  }
                }}
                
              >
                <div className="flex items-center gap-2">
                  <span className="icon-sidebar">
                  <i className="bi bi-lock-fill"></i>
                  </span>
                  <span className={`${isSidebarCollapsed ? 'hidden' : 'inline'}`}>Demande</span>
                </div>
                {!isSidebarCollapsed && (
                  demandeOpen ? <i className="bi bi-chevron-up text-xs"></i> : <i className="bi bi-chevron-down text-xs"></i>
                )}
              </div>

              {(demandeOpen || isHoveringDemande) && (
                <ul
                  className={`${
                    isSidebarCollapsed ? 'absolute left-full top-0 ml-2 w-48 bg-[#0B1437] p-2 rounded shadow-lg z-50' : 'ml-8 mt-1'
                  } space-y-1 text-sm`}
                >
                  {user && user.privileges && user.privileges.some(p => p.title === 'super_admin') && user.isSuperAdmin === true ? (
                    <li 
                        className={`px-2 py-1 rounded ${hoverColor} cursor-pointer
                        ${activeMenu === "type-demande" ? "bg-[#1c2d55] text-white" : ""
                        } ${currentModule === "type-demande" ? "bg-[#1c2d55] text-white" : ""}
                        `}
                        onClick={() => {
                          handleMenuClick("type-demande");
                          setDemandeOpen(true);
                        }}
                      >
                        <i className="mr-2 text-xs bi bi-circle"></i>
                        Types
                    </li>
                  ) : (null)}
                  
                  <li  
                      className={`px-2 py-1 rounded ${hoverColor} cursor-pointer
                      ${activeMenu === "demande" ? "bg-[#1c2d55] text-white" : ""
                        } ${currentModule === "demande" ? "bg-[#1c2d55] text-white" : ""}
                    `}
                    onClick={() => {
                      handleMenuClick("demande");
                      setDemandeOpen(true);
                    }}
                  >
                    <i className="mr-2 text-xs bi bi-circle"></i>Liste
                  </li>
                  <li className={`px-2 py-1 rounded ${hoverColor} cursor-pointer`}><i className="mr-2 text-xs bi bi-circle"></i>Réfusée</li>
                  <li className={`px-2 py-1 rounded ${hoverColor} cursor-pointer`}><i className="mr-2 text-xs bi bi-circle"></i>En attente</li>
                  <li className={`px-2 py-1 rounded ${hoverColor} cursor-pointer`}><i className="mr-2 text-xs bi bi-circle"></i>Acceptée</li>
                  <li className={`px-2 py-1 rounded ${hoverColor} cursor-pointer`}><i className="mr-2 text-xs bi bi-circle"></i>Validée</li>
                </ul>
              )}
            </li>

            {user && user.privileges && user.privileges.some(p => p.title === 'super_admin') && user.isSuperAdmin === true ? (
            <>
            <li
              className={`flex items-center gap-2 px-3 py-2 rounded ${hoverColor} cursor-pointer ${
                activeMenu === "code-couleur" ? "bg-[#1c2d55] text-white" : ""
              } ${currentModule === "code-couleur" ? "bg-[#1c2d55] text-white" : ""}`}
              onClick={() => handleMenuClick("code-couleur")}
            >
              <span className="icon-sidebar">
              <i className="bi bi-palette-fill"></i>
              </span>
              <span className={`${isSidebarCollapsed ? 'hidden' : 'inline'}`}>Code couleur</span>
            </li>
            <li
                className={`flex items-center gap-2 px-3 py-2 rounded ${hoverColor} cursor-pointer ${
                  activeMenu === "site" ? "bg-[#1c2d55] text-white" : ""
                } ${currentModule === "site" ? "bg-[#1c2d55] text-white" : ""}`}
                onClick={() => handleMenuClick("site")}
              >
                <span className="icon-sidebar">
                <i className="bi bi-geo-alt-fill"></i>
                </span>
                <span className={`${isSidebarCollapsed ? 'hidden' : 'inline'}`}>Sites</span>
              </li>
            </>
              
            ) : (
              null
            )}
            
            <li
              className={`flex items-center gap-2 px-3 py-2 rounded ${hoverColor} cursor-pointer ${
                activeMenu === "user" ? "bg-[#1c2d55] text-white" : ""
              } ${currentModule === "user" ? "bg-[#1c2d55] text-white" : ""}`}
              onClick={() => handleMenuClick("user")}
            >
              <span className="icon-sidebar">
              <i className="bi bi-people-fill"></i>
              </span>
              <span className={`${isSidebarCollapsed ? 'hidden' : 'inline'}`}>Utilisateur</span>
            </li>
          </ul>
        </nav>
    </div>
  );
};

export default Sidebar;
