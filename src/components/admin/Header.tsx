import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLayoutContent } from '../../contexts/admin/LayoutContext';
import api from "../../service/Api";
import UserAdminConnected from "../../hooks/UserAdminConnected";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";
import { useLangueActive } from '../../hooks/useLangueActive';
import { useTranslation } from "react-i18next";
import { publicApi } from "../../service/publicApi";

type HeaderProps = {
  onToggleMobileSidebar: () => void;
};

export interface Site {
  id: number;
  nom: string;
  description: string;
  isActive: boolean;
  isCurrent: boolean;
}

type Privilege = {
  id: number;
  title: string;
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

type Langue = {
  id: number;
  titleFr: string;
  titleEn: string;
  icon: string;
  isActive: boolean;
  indice: string;
};

const Header = ({ onToggleMobileSidebar }: HeaderProps) => {
  const { layoutContent, isSidebarCollapsed, setIsSidebarCollapsed } = useLayoutContent();
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const [sites, setSites] = useState<Site[]>([]);
  const [langues, setListeLangue] = useState<Langue[]>([]);
  const { langueActive, setLangueActive } = useLangueActive();
  const { t, i18n } = useTranslation();
  const user = UserAdminConnected() as UserType | null;
  const { codeCouleur } = useGlobalActiveCodeCouleur();
  const token = sessionStorage.getItem("jwt");
  const email = sessionStorage.getItem("email");

  const getLangLabel = (lang: Langue): string => {
    return langueActive?.indice === "fr" ? lang.titleFr : lang.titleEn;
  };

  const toggleLocationDropdown = () => setLocationDropdownOpen(prev => !prev);
  const toggleLangDropdown = () => setLangDropdownOpen(prev => !prev);

  const handleSiteCurrent = async (siteId: number) => {
    try {
      const response = await api.patch(`/api/sites/${siteId}/selected`, {
        headers: {
          'Content-Type': 'application/merge-patch+json'
        }
      });
      window.location.reload();
    } catch (error) {
      console.error("Erreur API:", error);
    }
  };

  const handleLangueCurrent = async (langueId: number) => {
    const selectedLangue = langues.find((l) => l.id === langueId);
    if (!selectedLangue) return;

    i18n.changeLanguage(selectedLangue.indice);
    setLangueActive(selectedLangue);
    sessionStorage.setItem("langueActive", JSON.stringify(selectedLangue));

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

    window.location.reload();
  };

  useEffect(() => {
    api.get('/api/sites')
      .then(response => setSites(response.data))
      .catch(error => console.error("Erreur API:", error));

    publicApi.get('/api/langues/public')
      .then(response => setListeLangue(response.data))
      .catch(error => console.error("Erreur chargement langues:", error));
  }, []);

  return (
    <div
      className={`text-white p-4 flex justify-between items-center ${layoutContent === "vertical" ? "admin-header-vertical" : "admin-header-horizontal"}`}
      style={{ backgroundColor: layoutContent === "vertical" ? "" : codeCouleur?.btnColor }}
    >
      <div>
        {/* Boutons collapse */}
        <button className="block md:hidden text-white text-xl" onClick={onToggleMobileSidebar}>
          <i className="bi bi-list"></i>
        </button>

        <a href="#" className="mr-5 hidden md:inline-block bg-[#111C44] rounded text-lg py-2 px-3"
          onClick={(e) => {
            e.preventDefault();
            setIsSidebarCollapsed(!isSidebarCollapsed);
          }}>
          <i className={`bi ${isSidebarCollapsed ? "bi-arrow-right-square-fill" : "bi-list"}`}></i>
        </a>

        <input
          type="text"
          placeholder={`${t("header.search")}...`}
          className="bg-[#111C44] text-white p-2 rounded hidden md:inline-block"
        />
      </div>

      <div className="relative flex items-center space-x-4">
        {/* Dropdown site pour super_admin */}
        {user?.isSuperAdmin && (
          <div className="relative">
            <button
              onClick={toggleLocationDropdown}
              className="flex items-center gap-2 px-3 py-1 bg-white text-black rounded-md shadow hover:bg-gray-100 transition"
            >
              🌍 <span className="text-sm font-medium">Sites</span>
              <i className="bi bi-caret-down-fill text-sm"></i>
            </button>

            {locationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white text-black rounded shadow-lg z-50 p-2 grid grid-cols-3 gap-2">
                {sites.length > 0 ? (
                  sites.map((site) => (
                    <div
                      key={site.id}
                      className="px-3 py-2 text-sm text-center rounded hover:bg-gray-100 cursor-pointer"
                      style={{
                        backgroundColor: site.isCurrent ? codeCouleur?.btnColor : "",
                        color: site.isCurrent ? "white" : ""
                      }}
                      onClick={() => {
                        handleSiteCurrent(site.id);
                        setLocationDropdownOpen(false);
                      }}
                    >
                      {site.nom}
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-2">Aucun site trouvé</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Dropdown Langue */}
        <div className="relative">
          <button
            onClick={toggleLangDropdown}
            className="flex items-center gap-2 px-3 py-1 bg-white text-black rounded-md shadow hover:bg-gray-100 transition"
          >
            {langueActive?.icon} <span>{langueActive && getLangLabel(langueActive)}</span>
            <i className="bi bi-chevron-down ml-1 text-xs"></i>
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50 p-2">
              {langues.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    handleLangueCurrent(item.id);
                    setLangDropdownOpen(false);
                  }}
                >
                  <span className="mr-2">{item.icon}</span>
                  {getLangLabel(item)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Autres icônes */}
        <span>🔔</span>
        <img
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="user"
          className="w-8 h-8 rounded-full"
        />
        <Link to="/admin/logout" title="Se déconnecter">
          <span>🔓</span>
        </Link>
      </div>
    </div>
  );
};

export default Header;
