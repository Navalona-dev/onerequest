import React, { useState, useEffect, useRef } from "react";

import FolderCard from "./FolderCard";
import Button from './Button';
import 'bootstrap-icons/font/bootstrap-icons.css';
import TableFileManager from "./TableFileManager";

import { useLayoutContent } from '../../contexts/admin/LayoutContext';
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";

const FileManagerComponent = () => {
  const handleClick = () => {
    // Action à effectuer lors du clic
    console.log('Bouton cliqué!');
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMyDriveOpen, setIsMyDriveOpen] = useState<boolean>(true); 

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  const [activeMenu, setActiveMenu] = useState<string>('mydrive');

  const dropdownRef = useRef(null);

  const { layoutContent } = useLayoutContent();

  const addClass = layoutContent === "vertical" ? "" : "dashboard-content-horizontal";
  const addHeight = layoutContent === "vertical" ? "max-h-[75vh]" : "max-h-[67vh]";
  const addHeightContent = layoutContent === "vertical" ? "max-h-[70vh]" : "max-h-[65vh]";
  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();

  const toggleMyDrive = () => {
    setIsMyDriveOpen(!isMyDriveOpen);
  };
 
  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    setIsMyDriveOpen(false); // facultatif selon logique
  };


useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
      closeDropdown();
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
  
}, []);

  return (
   
        <div className={`${addClass} p-1`}>
          <div className="flex flex-wrap md:flex-nowrap gap-x-1 gap-y-5">
            <div className={`w-full md:w-3/12 admin-content px-3 ${addHeight}`}>
            <div className={`overflow-y-auto overflow-x-auto ${addHeightContent}`}>
            <h2 className="text-white text-xl mb-4 mt-2 font-bold">My Drive</h2>
              <input className="bg-[#1c2d55] shadow appearance-none  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="search-here" type="text" placeholder="Chercher ici..." />
              <div className="mt-5">
                <ul>
                <li className="mb-3">
                <button
                    onClick={() => {
                      setIsMyDriveOpen(!isMyDriveOpen);
                      setActiveMenu('mydrive');
                    }}
                    className={` w-full text-left flex items-center justify-between`}

                    style={{
                      backgroundColor: "transparent",
                      color: activeMenu === 'mydrive' ? codeCouleur?.textColor : 'white'
                    }}
                  >
                    <span><i className="mr-2 bi bi-folder-fill"></i>My drive</span>
                    <i className={`bi ${isMyDriveOpen ? "bi-caret-down-fill" : "bi-caret-right-fill"}`}></i>
                  </button>
                  {isMyDriveOpen && (
                    <ul className="mt-2">
                      <li className="mb-3 ml-5"><a href="#" className="text-white">Assets</a></li>
                      <li className="mb-3 ml-5"><a href="#" className="text-white">Marketing</a></li>
                      <li className="mb-3 ml-5"><a href="#" className="text-white">Personal</a></li>
                      <li className="mb-3 ml-5"><a href="#" className="text-white">Projects</a></li>
                      <li className="mb-3 ml-5"><a href="#" className="text-white">Templates</a></li>
                    </ul>
                  )}
                </li>

                  <li onClick={() => handleMenuClick('documents')} className="mb-3">
                    <a href="#" className={``}
                    style={{
                      color: activeMenu === 'documents' ? codeCouleur?.textColor : 'white'
                    }}
                    >
                      <i className="mr-2 bi bi-file-earmark-pdf-fill"></i>Document
                    </a>
                  </li>
                  <li onClick={() => handleMenuClick('media')} className="mb-3">
                    <a href="#" className={``}
                    style={{
                      color: activeMenu === 'media' ? codeCouleur?.textColor : 'white'
                    }}
                    >
                      <i className="mr-2 bi bi-collection-fill"></i>Media
                    </a>
                  </li>
                  <li onClick={() => handleMenuClick('recent')} className="mb-3">
                    <a href="#" className={`${activeMenu === 'recent' ? 'text-red-500' : 'text-white'}`}>
                      <i className="mr-2 bi bi-arrow-counterclockwise"></i>Recent
                    </a>
                  </li>
                  <li onClick={() => handleMenuClick('important')} className="mb-3">
                    <a href="#" className={`${activeMenu === 'important' ? 'text-red-500' : 'text-white'}`}>
                      <i className="mr-2 bi bi-star-fill"></i>important
                      </a>
                    </li>
                  <li onClick={() => handleMenuClick('delete')} className="mb-3">
                    <a href="#" className={`${activeMenu === 'delete' ? 'text-red-500' : 'text-white'}`}>
                      <i className="mr-2 bi bi-trash-fill"></i>Deleted
                      </a>
                    </li>
                </ul>
              </div>
            </div>
              
            </div>
            <div className={`w-full md:w-9/12 admin-content px-3 pt-3 pb-5 ${addHeight}`}>
              <div className={`overflow-y-auto overflow-x-auto ${addHeightContent}`}>
                <div className="flex gap-4 flex-wrap mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-4 gap-2">

                    <h2 className="text-white text-xl mb-5">Dossiers</h2>
                    <div className="flex gap-2 mr-5">

                      {/* Dropdown ici */}
                      <div className="relative" ref={dropdownRef}>
                        <Button
                          onClick={toggleDropdown}
                          variant="primary"
                          size="medium"
                          className="text-white rounded-lg w-40 py-2"
                        
                        >
                          Document <i className="bi bi-caret-down-fill ml-2"></i>
                        </Button>
                        {dropdownOpen && (
                          <ul className="absolute right-0 w-40 bg-[#1c2d55] rounded-md shadow-lg text-gray-800 z-10 folder-dropdown-btn">
                            <li className="px-4 py-2 hover:bg-[#111C44] cursor-pointer text-white">All</li>
                            <li className="px-4 py-2 hover:bg-[#111C44] cursor-pointer text-white">Documents</li>
                            <li className="px-4 py-2 hover:bg-[#111C44] cursor-pointer text-white">Images</li>
                            <li className="px-4 py-2 hover:bg-[#111C44] cursor-pointer text-white">Music</li>
                            <li className="px-4 py-2 hover:bg-[#111C44] cursor-pointer text-white">Video</li>
                          </ul>
                        )}
                      </div>

                      <Button
                        onClick={handleClick}
                        variant="primary"
                        size="medium"
                        className="text-white py-2 rounded-lg px-4"
                      >
                        + Créer dossier
                      </Button>
                    </div>
                </div>
                  
                    
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="w-full md:w-[48%]">
                    <FolderCard name="Clients" files={349} selected />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <FolderCard name="Gestionnaire" files={2348} />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <FolderCard name="Utilisateur" files={842} />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <FolderCard name="Demandes" files={132} selected />
                  </div>
                </div>

                <div className="my-12">
                  <div className="flex items-center justify-between w-full mb-6">
                      <h2 className="text-white text-xl">Fichiers</h2>
                      <div className="flex gap-2 mr-5">

                        <Button
                          onClick={handleClick}
                          variant="primary"
                          size="medium"
                          className="text-white py-2 rounded-lg px-4"
                        >
                          + Créer fichier
                        </Button>
                      </div>
                  </div>
                  <TableFileManager />
                </div>
              </div>
              
            </div>
          </div>
        </div>

  );
};

export default FileManagerComponent;
