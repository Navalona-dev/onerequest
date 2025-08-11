import React, { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import bgImage from '../../../assets/images/bg-site.png';
import AddSite from "./AddSite";
import UpdateSite from "./UpdateSite";
import toggleActiveSite from "../../../service/admin/ToogleActiveSite";

import deleteSite from "../../../service/admin/DeleteSite";
import api from "../../../service/Api";
import { store } from "../../../store";
import Pagination from "../Pagination";
import SelectRegion from "./SelectRegion";

import { Link } from "react-router-dom";
import { error } from "console";
import SelectCommune from "./SelectCommune";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

type RegionType = {
  id: number;
  nom: string;
}

type CommuneType = {
  id: number;
  nom: string;
  district: string;
}

type SiteType = {
  id: number;
  nom: string;
  description: string;
  isActive: boolean;
  isCurrent: boolean;
  region: RegionType;
  commune: CommuneType;
}

const SiteComponent = () => {
  const [sites, setSites] = useState<SiteType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [selectedSite, setSelectedSite] = useState<SiteType | null>(null);
  const [showModalSelectRegion, setShowModalSelectRegion] = useState(false);
  const [showModalSelectCommune, setShowModalSelectCommune] = useState(false);

  const state = store.getState();
  const { create, delete: deleteAction, edit, activate, deactivate, addRegion } = state.actionTexts;

  const [currentPage, setCurrentPage] = useState(1);
  const sitesPerPage = 5;

  const [regions, setListeRegion] = useState<RegionType[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<RegionType | null>(null);

  const [searchByRegion, setSearchByRegion] = useState(false);
  const [searchNom, setSearchNom] = useState("");
  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();

  const {langueActive} = useLangueActive();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (searchByRegion && selectedRegion) {
      api.get(`/api/regions/${selectedRegion.id}/sites`)
        .then((response) => {
          setSites(response.data);
        })
        .catch((error) => console.error("Erreur API:", error));
    } else {
      api.get("/api/sites")
        .then((response) => {
          setSites(response.data);
        })
        .catch((error) => console.error("Erreur API:", error));
    }
  }, [searchByRegion, selectedRegion]);
  

  const filteredSites = sites.filter(site =>
    site.nom.toLowerCase().includes(searchNom.toLowerCase())
  );

  const indexOfLastSite = currentPage * sitesPerPage;
  const indexOfFirstSite = indexOfLastSite - sitesPerPage;
  let currentSites;
  let totalPages;
  
  if (filteredSites.length > 0) {
    currentSites = filteredSites.slice(indexOfFirstSite, indexOfLastSite);
    totalPages = Math.ceil(filteredSites.length / sitesPerPage);
  } else {
    currentSites = sites.slice(indexOfFirstSite, indexOfLastSite);
    totalPages = Math.ceil(sites.length / sitesPerPage);
  }

  useEffect(() => {
    api.get('/api/regions')
    .then((response) => {
      setListeRegion(response.data)
    })
    .catch((error) => console.error("Erreur API:", error));
  }, []);

  
  return (
    <>
    {codeCouleur?.id && (
      <style>
        {`
          .btn-search:hover {
            background-color: #1c2d55 !important
          }
        `}
      </style>
    )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Table des site */}
        <div className="h-[75vh] overflow-y-auto">
              <div className="color-header p-4 flex justify-between items-center mb-5">
                <h4 className="font-bold text-white">Liste site</h4>
                <div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-5 py-1.5 text-white rounded mr-3"
                  >
                    {langueActive?.indice === "fr" ? create.fr.upperText : langueActive?.indice === "en" ? create.en.upperText : ""}
                  </button>
                  <Link to={'/region'}
                    className="px-5 py-2 text-white rounded btn-list"
                  >
                    {t("btnlisteregion")}
                  </Link>
                </div>
              </div>

              <div className="card my-6 px-5 mx-4 border border-gray-700 py-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full">
                      <Listbox value={selectedRegion} onChange={setSelectedRegion}>
                        <div className="relative">
                          <Listbox.Button 
                          className="bg-[#1c2d55] text-white py-2 text-sm w-full rounded focus:outline-none focus:ring-0 focus:border-transparent btn-search">
                            {selectedRegion ? selectedRegion.nom : `${t("region")}...`}
                          </Listbox.Button>
                          <i 
                            onClick={() => {
                              if (selectedRegion) {
                                setSearchByRegion(true);
                              }
                            }}
                            className="cursor-pointer bi bi-search absolute mr-6 right-3 top-1/2 transform -translate-y-1/2 text-white text-sm"
                          />
                          <i 
                            onClick={() => {
                              setSearchByRegion(false);
                              setSelectedRegion(null);
                            }}
                            className="cursor-pointer bi bi-trash-fill absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 text-sm"
                          />


                          <Listbox.Options 
                          className="absolute mt-1 w-full bg-[#1c2d55] text-white rounded shadow-lg z-50 max-h-60 overflow-auto focus:outline-none focus:ring-0 focus:border-transparent">
                            {regions.map((region, index) => (
                              <Listbox.Option
                                key={index}
                                value={region}
                                className={({ active }) =>
                                  `cursor-pointer select-none px-4 py-2 ${
                                    active ? "bg-[#2a3a75]" : ""
                                  }`
                                }
                              >
                                {region.nom}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </div>
                      </Listbox>
                    </div>

                    <div className="relative w-full">
                    <input
                      type="text"
                      placeholder={`${t("nom")}...`}
                      value={searchNom}
                      onChange={(e) => setSearchNom(e.target.value)}
                      className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                focus:outline-none focus:ring-0 focus:border-transparent"
                    />  
                    </div>

                  </div>
              </div>

              <div className="overflow-x-auto w-[45vh] md:w-[80vh] sm:w-[45vh] pl-4">
                <table className="w-full border border-gray-700 text-sm text-left rtl:text-right text-gray-400 dark:text-gray-400">
                  <thead className="text-xs text-white uppercase">
                    <tr className="text-nowrap border-b border-gray-700">
                      <th className="px-6 py-3">Actions</th>
                      <th className="px-6 py-3">{t("nom")}</th>
                      <th className="px-6 py-3">{t("region")}</th>
                      <th className="px-6 py-3">{t("commune")} / District</th>
                      <th className="px-6 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                  {currentSites.length > 0 ? (
                    currentSites.map((item, index) => (
                      <tr key={item.id} className={`text-nowrap ${index % 2 === 0 ? "" : "bg-[#1c2d55]"}`}>
                        <td className="px-6 py-4">
                          <a href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleActiveSite(
                              item.id,
                              true,
                              setShowModal
                            )
                          }}
                          className={`${item.isActive ? '' : 'hidden'}`} title={langueActive?.indice === "fr" ? deactivate.fr.upperText : langueActive?.indice === "en" ? deactivate.en.upperText : ""}>
                            <i className="bi bi-check-circle-fill bg-green-500 px-1.5 py-1 text-white rounded-3xl mr-3"></i>
                          </a>
                          <a href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            toggleActiveSite(
                              item.id,
                              false,
                              setShowModal
                            )
                          }}
                          className={`${!item.isActive ? '' : 'hidden'}`} title={langueActive?.indice === "fr" ? activate.fr.upperText : langueActive?.indice === "en" ? activate.en.upperText : ""}>
                            <i className="bi bi-x-circle-fill bg-red-500 px-1.5 py-1 text-white rounded-3xl mr-3"></i>
                          </a>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedSite(item);
                              setShowModalUpdate(true);
                            }}
                            title={langueActive?.indice === "fr" ? edit.fr.upperText : langueActive?.indice === "en" ? edit.en.upperText : ""}
                          >
                            <i className="bi bi-pencil-square px-1.5 py-1 text-white rounded-3xl mr-3"
                            style={{
                              backgroundColor: codeCouleur?.btnColor
                            }}
                            ></i>
                          </a>
                          <a href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (langueActive) {
                              deleteSite(item.id, langueActive.indice as "fr" | "en", setShowModal);
                            }
                          }}
                          title={langueActive?.indice === "fr" ? deleteAction.fr.upperText : langueActive?.indice === "en" ? deleteAction.en.upperText : ""}>
                            <i className="bi bi-trash-fill bg-red-500 px-1.5 py-1 text-white rounded-3xl mr-3"></i>
                          </a>
                          
                        </td>
                        <td className="px-6 py-4">{item.nom}</td>
                        <td className="px-6 py-4">
                          {item.region ? (
                            <>
                              <span className="mr-2">{item.region.nom}</span>
                              <a href="#"
                              style={{
                                color: codeCouleur?.textColor
                              }}
                              ><i className="bi bi-pencil-fill"></i></a>
                            </>

                          ) : (
                            <div className="flex items-center justify-center">
                              <a href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedSite(item)
                                setShowModalSelectRegion(true);
                              }}
                              title={langueActive?.indice === "fr" ? addRegion.fr.upperText : langueActive?.indice === "en" ? addRegion.en.upperText : ""}
                              >
                                <i className="bi bi-plus-circle-fill text-blue-500"></i>
                              </a>
                            </div>
                          )}
                          </td>
                          <td className="px-6 py-4">
                            {item.commune ? (
                              <>
                                <span className="mr-2">{item.commune.nom} / {item.commune.district}</span>
                                <a href="#"
                                style={{
                                  color: codeCouleur?.textColor
                                }}
                                ><i className="bi bi-pencil-fill"></i></a>
                              </>
                            ) : (
                              item.region ? (
                                  <a href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedSite(item)
                                    setSelectedRegion(item.region)
                                    setShowModalSelectCommune(true);
                                  }}
                                  ><i className="bi bi-plus-circle-fill"></i></a>
                              ) : null
                            )}
                            </td>
                        <td className="px-6 py-4">{item.description}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        {t("nodata")}
                      </td>
                    </tr>
                  )}
                  </tbody>
                </table>
              </div>
              <div className="mx-4 mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
          </div>
        

        {/* Image */}
        <div className="color-card h-[45vh] md:h-[75vh]">
          <div className="h-[40vh] md:h-[70vh] p-8 flex items-center justify-center">
            <img
              src={bgImage}
              alt="background"
              className="w-[30vh] h-[30vh] md:w-[60vh] md:h-[60vh]"
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && <AddSite setShowModal={setShowModal} />}
      {showModalSelectRegion && selectedSite &&
        <SelectRegion 
          setShowModalSelectRegion={setShowModalSelectRegion}
          siteId={selectedSite.id}
        />}

      {showModalSelectCommune && selectedSite &&
        <SelectCommune
          setShowModalSelectCommune={setShowModalSelectCommune}
          siteId={selectedSite.id}
          regionId={selectedSite.region.id}
        />}

      {showModalUpdate && selectedSite && (
        <UpdateSite
          setShowModalUpdate={setShowModalUpdate}
          siteId={selectedSite.id}
          initialData={{
            nom: selectedSite.nom,
            description: selectedSite.description,
            isActive: selectedSite.isActive,
            isCurrent: selectedSite.isCurrent
          }}
          
        />
      )}

    </>
  );
};

export default SiteComponent;
