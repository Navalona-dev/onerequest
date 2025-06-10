import React, { useState } from "react";
import HorizontalNav from './HorizontalNav';
import { useLayoutContent } from '../../contexts/admin/LayoutContext';
import { Link } from "react-router-dom";

type HeaderProps = {
  onToggleMobileSidebar: () => void;
};

const Header = ({ onToggleMobileSidebar }: HeaderProps) => {
  const { layoutContent, isSidebarCollapsed, setIsSidebarCollapsed } = useLayoutContent();

  const bgColor = layoutContent === "vertical" ? "bg-[#0B1437] admin-header-vertical" : "bg-red-500 admin-header-horizontal";

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
        {/* bouton pour “collapser” */}
<a
  href="#"
  className={`
    mr-5 text-lg py-2 px-3 bg-[#111C44] rounded
    show-only-icon-sidebar
    ${layoutContent === "horizontal" ? "hide-icon" : ""}
    hidden md:inline-block      /* ⬅️ caché en mobile, visible ≥ 768 px */
  `}
  onClick={(e) => {
    e.preventDefault();
    setIsSidebarCollapsed(true);
  }}
  style={{ display: isSidebarCollapsed ? "none" : undefined }}  /* plus besoin d’inline-block */
>
  <i className="bi bi-list"></i>
</a>

{/* bouton pour “dé-collapser” */}
<a
  href="#"
  className={`
    mr-5 text-lg py-2 px-3 bg-[#111C44] rounded
    show-text-and-icon-sidebar
    ${layoutContent === "horizontal" ? "hide-icon" : ""}
    hidden md:inline-block      /* idem */
  `}
  onClick={(e) => {
    e.preventDefault();
    setIsSidebarCollapsed(false);
  }}
  style={{ display: isSidebarCollapsed ? undefined : "none" }}
>
  <i className="bi bi-arrow-right-square-fill"></i>
</a>

{/* champ de recherche */}
<input
  type="text"
  placeholder="Search..."
  className="bg-[#111C44] text-white p-2 rounded hidden md:inline-block"
/>

      </div>

      
      <div className="flex items-center space-x-4">
        <span>🌐</span>
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
