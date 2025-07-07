// src/components/CodeColor.tsx
import React, { useState, useEffect } from "react";
import bgImage from '../../../assets/images/bg-color.png';
import AddCodeCouleur from "./AddCodeCouleur";
import UpdateCodeCouleur from "./UpdateCodeCouleur";
import toggleActiveCodeCouleur from "../../../service/ToogleActiveCodeCouleur";

import deleteCodeCouleur from "../../../service/DeleteCodeCouleur";
import UserAdminConnected from "../../../hooks/UserAdminConnected";

import api from "../../../service/Api";
import { store } from "../../../store";
import Pagination from "../Pagination";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";

type Site = {
  id: number;
  nom: string;
};

type Privilege = {
  id: number;
  title: string;
};


type UserType = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  privileges: Privilege[];
  site: Site;
  message: string;
  isSuperAdmin: boolean;
};

type CodeCouleurType = {
  id: number;
  //site: Site;
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
  libelle: string;
}




const CodeColor = () => {
  const [siteCount, setSiteCount] = useState(0);
  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();

  const user = UserAdminConnected() as UserType | null;

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

  
  const [codeCouleurs, setCodeCouleurs] = useState<CodeCouleurType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [selectedCodeCouleur, setSelectedCodeCouleur] = useState<CodeCouleurType | null>(null);

  const state = store.getState();
  const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;

  const [currentPage, setCurrentPage] = useState(1);
  const codeCouleursPerPage = 5;
  
  useEffect(() => {

    if(user && user.privileges && user.privileges.some(p => p.title === "super_admin") && user.isSuperAdmin === true) {
      api.get("/api/code_couleurs")
      .then((response) => {
        setCodeCouleurs(response.data)
      })
      .catch((error) => console.error("Erreur API:", error));
    } else {
      if(user && user.site) {
        api.get(`/api/sites/${user.site.id}/code-couleurs`)
        .then((response) => {
          const result = Array.isArray(response.data) ? response.data : [response.data];
          setCodeCouleurs(result);
      })
        .catch((error) => console.error("Erreur API:", error));
      }
    }
    
  }, [user]);

  useEffect(() => {
    const fetchSiteCount = async () => {
      const count = await countSite();
      setSiteCount(count);
    };
  
    fetchSiteCount();
  }, []);
  
  const indexOfLastCodeCouleur = currentPage * codeCouleursPerPage;
  const indexOfFirstCodeCouleur = indexOfLastCodeCouleur - codeCouleursPerPage;
  const currentCodeCouleurs = codeCouleurs.slice(indexOfFirstCodeCouleur, indexOfLastCodeCouleur);
  const totalPages = Math.ceil(codeCouleurs.length / codeCouleursPerPage);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Table des codes couleur */}
        <div className="h-[75vh] overflow-y-auto">
          <div className="color-header p-4">
            <div className="color-header p-4 flex justify-between items-center mb-5">
              <h4 className="font-bold text-white">Liste code couleur</h4>
              <button
                    onClick={() => setShowModal(true)}
                    className="px-5 py-2 text-white rounded"
                  >
                    {create.upperText}
                  </button>
                
              </div>
          </div>

          <div className="overflow-x-auto w-[80vh] h-[70h] overflow-y-auto">
            <table className="w-full border border-gray-700 text-sm text-left rtl:text-right text-gray-400 dark:text-gray-400">
              <thead className="text-xs text-white uppercase">
                <tr className="text-nowrap border-b border-gray-700">
                  <th className="px-6 py-3">Actions</th>
                  <th className="px-6 py-3">Libellé</th>
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
              {currentCodeCouleurs.length > 0 ? (
                currentCodeCouleurs.map((item, index) => (
                  <tr key={item.id} className={`text-nowrap ${index % 2 === 0 ? "" : "bg-[#1c2d55]"}`}>
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
                        <i 
                        className="bi bi-pencil-square px-2 py-1.5 text-white rounded-3xl"
                        style={{
                          backgroundColor: codeCouleur?.btnColor
                        }}
                        ></i>
                      </a>
                    </td>
                    <td className="px-6 py-4">
                     {item.libelle}
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
      {showModal && <AddCodeCouleur setShowModal={setShowModal} />}
      {showModalUpdate && selectedCodeCouleur && (
        <UpdateCodeCouleur 
          setShowModalUpdate={setShowModalUpdate}
          codeId={selectedCodeCouleur.id}
          initialData={{
            libelle: selectedCodeCouleur.libelle,
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
          
        />
      )}

    </>
  );
};

export default CodeColor;
