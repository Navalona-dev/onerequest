// src/components/CodeColor.tsx
import React, { useState, useEffect } from "react";
import bgImage from '../../../assets/images/bg-color.png';
import AddCodeCouleur from "./AddCodeCouleur";
import UpdateCodeCouleur from "./UpdateCodeCouleur";
import toggleActiveCodeCouleur from "../../../service/ToogleActiveCodeCouleur";

import deleteCodeCouleur from "../../../service/DeleteCodeCouleur";

import api from "../../../service/Api";
import { store } from "../../../store";

export interface CodeCouleur {
  id: number;
  site: { id: number; nom: string } | null;  // <- ici
  bgColor: string;
  textColor: string;
  btnColor: string;
  colorOne: string;
  colorTwo: string;
  isActive: boolean;
  isGlobal: boolean;
  isDefault: boolean;
  textColorHover: string;
  btnColorHover: string;
}


const CodeColor = () => {
  const [siteCount, setSiteCount] = useState(0);

  const countSite = async () => {
    try {
      const response = await api.get("/api/sites");
      const sites = response.data;
      const totalCount = sites.length;
  
      return totalCount;
    } catch (error) {
      return 0;
    }
  };

  
  const [codeCouleurs, setCodeCouleurs] = useState<CodeCouleur[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [selectedCodeCouleur, setSelectedCodeCouleur] = useState<CodeCouleur | null>(null);


  const state = store.getState();
  const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;
  
  useEffect(() => {
    api.get("/api/code_couleurs")
      .then((response) => setCodeCouleurs(response.data))
      .catch((error) => console.error("Erreur API:", error));
  }, []);

  useEffect(() => {
    const fetchSiteCount = async () => {
      const count = await countSite();
      setSiteCount(count);
    };
  
    fetchSiteCount();
  }, []);
  

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Table des codes couleur */}
        <div className="color-card h-[75vh] overflow-y-auto">
          <div className="color-header p-4">
            <div className="color-header p-4 flex justify-between items-center mb-5">
              <h4 className="font-bold text-white">Liste code couleur</h4>
                {siteCount > 0 ? (
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-red-500 px-5 py-2 text-white rounded"
                  >
                    {create.upperText}
                  </button>
                ) : (
                  <p className="text-red-500">Ajouter au moins un site avant d'ajouter un code couleur</p>
                )}
                
              </div>
          </div>

          <div className="overflow-x-auto w-[80vh] h-[70h] overflow-y-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-400 dark:text-gray-400">
              <thead className="text-xs text-white uppercase">
                <tr className="text-nowrap border-b border-gray-700">
                  <th className="px-6 py-3">Actions</th>
                  <th className="px-6 py-3">Site</th>
                  <th className="px-6 py-3">Fond</th>
                  <th className="px-6 py-3">Texte</th>
                  <th className="px-6 py-3">Texte en survol</th>
                  <th className="px-6 py-3">Bouton</th>
                  <th className="px-6 py-3">Bouton en survol</th>
                  <th className="px-6 py-3">Couleur 1</th>
                  <th className="px-6 py-3">Couleur 2</th>
                </tr>
              </thead>
              <tbody>
              {codeCouleurs.length > 0 ? (
                codeCouleurs.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 text-nowrap">
                    <td className="px-6 py-4">
                      <a href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleActiveCodeCouleur(
                          item.id,
                          true,
                          setShowModal
                        )
                      }}
                      className={`${item.isActive ? '' : 'hidden'}`} title={deactivate.upperText}>
                        <i className="bi bi-check-circle-fill bg-green-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                      </a>
                      <a href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleActiveCodeCouleur(
                          item.id,
                          false,
                          setShowModal
                        )
                      }}
                      className={`${!item.isActive ? '' : 'hidden'}`} title={activate.upperText}>
                        <i className="bi bi-x-circle-fill bg-red-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                      </a>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteCodeCouleur(item.id , setShowModal);
                        }}
                        title={deleteAction.upperText}
                      >
                        <i className="bi bi-trash-fill bg-red-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                      </a>

                      <a href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCodeCouleur(item);
                        setShowModalUpdate(true);
                      }}
                      title={edit.upperText}>
                        <i className="bi bi-pencil-square bg-blue-500 px-2 py-1.5 text-white rounded-3xl"></i>
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      {item.site ? item.site.nom : (item.isGlobal === true ? "Couleur globale" : "Couleur par defaut")}
                    </td>
                    <td className="px-6 py-4">{item.bgColor}</td>
                    <td className="px-6 py-4">{item.textColor}</td>
                    <td className="px-6 py-4">{item.textColorHover}</td>
                    <td className="px-6 py-4">{item.btnColor}</td>
                    <td className="px-6 py-4">{item.btnColorHover}</td>
                    <td className="px-6 py-4">{item.colorOne}</td>
                    <td className="px-6 py-4">{item.colorTwo}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-gray-500">
                    Aucun enregistrement trouvé
                  </td>
                </tr>
              )}

              </tbody>
            </table>
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
      {showModal && <AddCodeCouleur setShowModal={setShowModal} />}
      {showModalUpdate && selectedCodeCouleur && (
        <UpdateCodeCouleur 
          setShowModalUpdate={setShowModalUpdate}
          codeId={selectedCodeCouleur.id}
          initialData={{
            site: selectedCodeCouleur.site ?? null,
            bgColor: selectedCodeCouleur.bgColor,
            textColor: selectedCodeCouleur.textColor,
            btnColor: selectedCodeCouleur.btnColor,
            colorOne: selectedCodeCouleur.colorOne,
            colorTwo: selectedCodeCouleur.colorTwo,
            isActive: selectedCodeCouleur.isActive,
            isGlobal: selectedCodeCouleur.isGlobal,
            isDefault: selectedCodeCouleur.isDefault,
            textColorHover: selectedCodeCouleur.textColorHover,
            btnColorHover: selectedCodeCouleur.btnColorHover
          }}
          codeCouleur={{
            isGlobal: selectedCodeCouleur.isGlobal,
            isDefault: selectedCodeCouleur.isDefault
          }}
          
        />
      )}

    </>
  );
};

export default CodeColor;
