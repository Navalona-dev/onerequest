import React, { useState, useEffect } from "react";
import bgImage from '../../../assets/images/bg-site.png';
import AddSite from "./AddSite";
import UpdateSite from "./UpdateSite";
import toggleActiveSite from "../../../service/ToogleActiveSite";

import deleteSite from "../../../service/DeleteSite";
import api from "../../../service/Api";
import { store } from "../../../store";

import RegionComponent from "../region/RegionComponent";

export interface Site {
  id: number;
  nom: string;
  description: string;
  isActive: boolean;
  isCurrent: boolean;
}

const SiteComponent = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [showRegion, setShowRegion] = useState(false);

  const state = store.getState();
  const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;

  const [nombre, setNombre] = useState<number>(0); 

  function isPair(n: number): boolean {
      return n % 2 === 0;
  }

  useEffect(() => {
    api.get("/api/sites")
      .then((response) => {
        setSites(response.data);
      })
      .catch((error) => console.error("Erreur API:", error));
  }, []);
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Table des site */}
        {showRegion ? (
          <RegionComponent />
        ) : (
          <div className="h-[75vh] overflow-y-auto">
            <div className="color-header p-4 flex justify-between items-center mb-5">
              <h4 className="font-bold text-white">Liste site</h4>
              <button
                onClick={() => setShowModal(true)}
                className="bg-red-500 px-5 py-2 text-white rounded"
              >
                {create.upperText}
              </button>
            </div>


            <div className="overflow-x-auto w-[80vh] pl-4">
              <table className="w-full border border-gray-700 text-sm text-left rtl:text-right text-gray-400 dark:text-gray-400">
                <thead className="text-xs text-white uppercase">
                  <tr className="text-nowrap border-b border-gray-700">
                    <th className="px-6 py-3">Actions</th>
                    <th className="px-6 py-3">Nom</th>
                    <th className="px-6 py-3">Description</th>
                  </tr>
                </thead>
                <tbody>
                {sites.length > 0 ? (
                  sites.map((item, index) => (
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
                        className={`${item.isActive ? '' : 'hidden'}`} title={deactivate.upperText}>
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
                        className={`${!item.isActive ? '' : 'hidden'}`} title={activate.upperText}>
                          <i className="bi bi-x-circle-fill bg-red-500 px-1.5 py-1 text-white rounded-3xl mr-3"></i>
                        </a>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedSite(item);
                            setShowModalUpdate(true);
                          }}
                          title={edit.upperText}
                        >
                          <i className="bi bi-pencil-square bg-blue-500 px-1.5 py-1 text-white rounded-3xl mr-3"></i>
                        </a>
                        <a href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteSite(item.id, setShowModal);
                        }}
                        title={deleteAction.upperText}>
                          <i className="bi bi-trash-fill bg-red-500 px-1.5 py-1 text-white rounded-3xl mr-3"></i>
                        </a>
                        
                        <a
                          href="#"
                          onClick={(e) => {
                            setShowRegion(true);
                          }}
                          title="Liste région"
                        >
                          <i className="bi bi-globe-americas bg-blue-500 px-1.5 py-1 text-white rounded-3xl"></i>
                        </a>
                      </td>
                      <td className="px-6 py-4">{item.nom}</td>
                      <td className="px-6 py-4">{item.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Aucun enregistrement trouvé
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        

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
