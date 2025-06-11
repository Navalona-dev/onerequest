import React, { useEffect, useState } from "react";
import HorizontalNav from './HorizontalNav';
import { useLayoutContent } from '../../contexts/admin/LayoutContext';
import { Link } from "react-router-dom";
import api from "../../service/Api";
import UserAdminConnected from "../../hooks/UserAdminConnected";

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

const Header = ({ onToggleMobileSidebar }: HeaderProps) => {
  const { layoutContent, isSidebarCollapsed, setIsSidebarCollapsed } = useLayoutContent();

  const bgColor = layoutContent === "vertical" ? "bg-[#0B1437] admin-header-vertical" : "bg-red-500 admin-header-horizontal";

  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [siteCurrent, setSiteCurrent] = useState<Site | null>(null);
  const user = UserAdminConnected() as UserType | null;

  const toggleLocationDropdown = () => {
    setLocationDropdownOpen((prev) => !prev);
  };

  const handleSiteCurrent = async (siteId: number) => {
    try {
      const response = await api.put(`/api/sites/${siteId}/selected`);
      setSiteCurrent(response.data);
      window.location.reload();
    } catch (error) {
      console.error("Erreur API:", error);
    }
  };
  
  

  useEffect(() => {
    api.get('/api/sites')
    .then((response) => {
      setSites(response.data);
    }) 
    .catch((error) => console.error("Erreur API:", error));
  }, []);


  return (
    <div className={`${bgColor} text-white p-4 flex justify-between items-center`}>
      <div>
        <button
          className="block md:hidden text-white text-xl"
          onClick={onToggleMobileSidebar}
          title="Afficher barre de menu"
        >
          <i className="bi bi-list"></i>
        </button>

        <a
          href="#"
          className={`mr-5 text-lg py-2 px-3 bg-[#111C44] rounded show-only-icon-sidebar ${layoutContent === "horizontal" ? "hide-icon" : ""} hidden md:inline-block`}
          onClick={(e) => {
            e.preventDefault();
            setIsSidebarCollapsed(true);
          }}
          style={{ display: isSidebarCollapsed ? "none" : undefined }}
        >
          <i className="bi bi-list"></i>
        </a>

        <a
          href="#"
          className={`mr-5 text-lg py-2 px-3 bg-[#111C44] rounded show-text-and-icon-sidebar ${layoutContent === "horizontal" ? "hide-icon" : ""} hidden md:inline-block`}
          onClick={(e) => {
            e.preventDefault();
            setIsSidebarCollapsed(false);
          }}
          style={{ display: isSidebarCollapsed ? undefined : "none" }}
        >
          <i className="bi bi-arrow-right-square-fill"></i>
        </a>

        <input
          type="text"
          placeholder="Search..."
          className="bg-[#111C44] text-white p-2 rounded hidden md:inline-block"
        />
      </div>

          <div className="relative flex items-center space-x-4">
          {/* Localisation dropdown */}
          {user && user.privileges && user.privileges.some(p => p.title === 'super_admin') && user.isSuperAdmin === true ? (
            <div className="relative">
            <button
              onClick={toggleLocationDropdown}
              title="Changer de site"
              className="flex items-center gap-2 px-3 py-1 bg-white text-black rounded-md shadow hover:bg-gray-100 transition"
            >
              <span className="text-lg">🌍</span>
              <span className="text-sm font-medium">Sites</span>
              <i className="bi bi-caret-down-fill text-sm"></i>
            </button>

            {locationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white text-black rounded shadow-lg z-50 p-2 grid grid-cols-3 gap-2">
                {sites.length > 0 ? (
                  sites.map((site, idx) => (
                    <div
                      key={idx}
                      className={`px-3 py-2 text-sm text-center rounded hover:bg-gray-100 cursor-pointer ${site.isCurrent === true ? "bg-red-500 text-white" : ""}`}
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
          ): null}
          

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
