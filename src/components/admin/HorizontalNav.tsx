import React, { useState, useEffect, useRef } from "react";
import {
  FaFolder,
  FaRegChartBar,
  FaLock,
  FaHome,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useTheme } from "../../contexts/admin/ThemeContext";
import { useModule } from "../../contexts/admin/ModuleContext";
import { useNavigate } from "react-router-dom";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";

// Casting des icônes pour TypeScript
const FaFolderIcon = FaFolder as React.FC<React.SVGProps<SVGSVGElement>>;
const FaHomeIcon = FaHome as React.FC<React.SVGProps<SVGSVGElement>>;
const FaLockIcon = FaLock as React.FC<React.SVGProps<SVGSVGElement>>;
const FaRegChartBarIcon = FaRegChartBar as React.FC<React.SVGProps<SVGSVGElement>>;
const FaChevronDownIcon = FaChevronDown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaChevronUpIcon = FaChevronUp as React.FC<React.SVGProps<SVGSVGElement>>;

const HorizontalNav = () => {

  const navigate = useNavigate();
  const { theme } = useTheme();
  const [demandeOpen, setDemandeOpen] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");
  const { currentModule, setCurrentModule } = useModule();
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
     window.location.reload();
  };


  return (
    <nav className="bg-[#0B1437] sidebar-horizontal  flex items-center">
      <div className="max-w-screen-xl mx-auto content">
        <div className="flex items-center">
          <ul className="flex flex-row font-medium space-x-8 rtl:space-x-reverse text-sm">
          <li
            className={`flex items-center gap-2 px-3 py-2 rounded hover:text-red-500 cursor-pointer ${
              activeMenu === "dashboard" ? "text-red-500" : "text-white"
            } ${currentModule === "dashboard" ? "text-red-500" : ""}`}
            onClick={() => handleMenuClick("dashboard")}
          >
            <FaHomeIcon />
            <span>Dashboards</span>
          </li>

          <li
            className={`flex items-center gap-2 px-3 py-2 rounded hover:text-red-500 cursor-pointer ${
              activeMenu === "document" ? "text-red-500" : "text-white"
            } ${currentModule === "document" ? "text-red-500" : ""}`}
            onClick={() => handleMenuClick("document")}
          >
            <FaFolderIcon />
            <span>Documents</span>
          </li>

          {/* Dropdown */}
          <li className="relative group">
            <div
              className={`flex items-center justify-between gap-2 px-3 py-2 rounded cursor-pointer hover:text-red-500 ${
                activeMenu === "demande" ? "text-red-500" : "text-white"
              } ${currentModule === "demande" ? "text-red-500" : ""}`}
              onMouseEnter={() => setActiveMenu("demande")} // Optionnel, pour marquer actif
            >
              <div className="flex items-center gap-2">
                <FaLockIcon />
                <span>Demande</span>
              </div>
              <FaChevronDownIcon className="text-xs" />
            </div>

            <ul className="absolute top-full left-0 w-48 bg-[#1c2d55] p-2 rounded shadow-lg z-10 hidden group-hover:block">
              <li className="px-2 py-1 rounded text-white hover:text-red-500 cursor-pointer">En cours</li>
              <li className="px-2 py-1 rounded text-white hover:text-red-500 cursor-pointer">Annulée</li>
              <li className="px-2 py-1 rounded text-white hover:text-red-500 cursor-pointer">Réfusée</li>
              <li className="px-2 py-1 rounded text-white hover:text-red-500 cursor-pointer">En attente</li>
              <li className="px-2 py-1 rounded text-white hover:text-red-500 cursor-pointer">Acceptée</li>
              <li className="px-2 py-1 rounded text-white hover:text-red-500 cursor-pointer">Validée</li>
            </ul>
          </li>

          <li
            className={`flex items-center gap-2 px-3 py-2 rounded hover:text-red-500 cursor-pointer ${
              activeMenu === "code-couleur" ? "text-red-500" : "text-white"
            } ${currentModule === "code-couleur" ? "text-red-500" : ""}`}
            onClick={() => handleMenuClick("code-couleur")}
          >
            <FaRegChartBarIcon />
            <span>Code couleur</span>
          </li>
          </ul>
        </div>
      </div>
    </nav>


  );
};

export default HorizontalNav;
