import React, { useEffect, useState } from "react";
import api from "../../../service/Api";
import { store } from "../../../store";
import Pagination from "../Pagination";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import AddEtapeTypeDemande from "./AddEtapeTypeDemande";

type TypeDemande = {
    id: number,
    nom: string;
    nomEn: string
}

type Commune = {
    id: number;
    nom: string
}

type Region = {
    id: number;
    nom: string;
}

type Site = {
    id: number;
    nom: string;
    commune: Commune | null;
    region: Region | null;
}

type EtapeTypeDemande = {
    id: number;
    statutInitial: string;
    title: string;
    createdAt: string;
    site: Site | null;
    typeDemande: TypeDemande | null;
    ordre: string;
    titleEn: string;
}

const EtapeTypeDemandeComponent = () => {
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate, dissocie } = state.actionTexts;
    const [currentPage, setCurrentPage] = useState(1);
    const typesPerPage = 5;
    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();
    const [etapes, setEtape] = useState<EtapeTypeDemande[]>([]);
    const [typeDemande, setTypeDemande] = useState<TypeDemande | null>(null);
    const [selectedEtape, setSelectedEtape] = useState<EtapeTypeDemande | null>(null);

    const {idTypeDemande} = useParams();

    const dataToPaginate = etapes;

      const totalPages = Math.max(1, Math.ceil(dataToPaginate.length / typesPerPage));
      
      const indexOfLastEtape = currentPage * typesPerPage;
      const indexOfFirstEtape = indexOfLastEtape - typesPerPage;
      
      const currentEtapes = dataToPaginate.slice(indexOfFirstEtape, indexOfLastEtape);

      const [showModalAdd, setShowModalAdd] = useState(false);

      useEffect(() => {
        if(!idTypeDemande) return;

        api.get(`/api/type_demandes/${idTypeDemande}`)
        .then((response) => {
            setTypeDemande(response.data);
        })
        .catch((error) => console.log("Erreur API", error));
      }, [idTypeDemande]);

      useEffect(() => {
        if(!idTypeDemande) return;
        api.get(`/api/type_demandes/${idTypeDemande}/etapes`)
        .then((response) => {
            setEtape(response.data);
        })
        .catch((error) => console.log("Erreur API", error));
      }, [idTypeDemande]);

      useEffect(() => {
        if (currentPage > totalPages) {
          setCurrentPage(1);
        }
      }, [currentPage, totalPages]);

    return(
        <>
            <div className="h-[69vh] overflow-y-auto overflow-x-auto px-3 py-4">
                <div className="color-header px-4 flex justify-between items-center mb-3">
                    <h4 className="font-bold text-white">
                        {t("listeEtapeTypeDemande")} 
                        <span>  "{langueActive?.indice === "fr" ? typeDemande?.nom : langueActive?.indice === "en" ? typeDemande?.nomEn : ""}"</span>
                    </h4>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setShowModalAdd(true);
                            }}
                                className="px-5 py-2 text-white rounded"
                                >
                                {langueActive?.indice === "fr" ? create.fr.upperText : langueActive?.indice === "en" ? create.en.upperText : ""}
                        </button>
                    
                    
                </div>
                <div className="w-[42vh] md:w-full sm:w-[42vh] h-[55vh] overflow-auto">
                    <table className="w-full border border-gray-700 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-[#1c2d55]">
                            <tr className="text-nowrap border-b-2 border-gray-700 ...">
                                <th scope="col" className="px-6 py-3 text-white">
                                    Actions
                                </th>
                                <th scope="col" className="px-6 py-3 text-white">
                                    {t("ordre")}
                                </th>
                                <th scope="col" className="px-6 py-3 text-white">
                                    {t("titre")}
                                </th>
                                <th scope="col" className="px-6 py-3 text-white">
                                    {t("statutInitial")}
                                </th>
                                <th scope="col" className="px-6 py-3 text-white">
                                    {t("dateDeCreation")}
                                </th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {currentEtapes.length > 0 ? (
                                currentEtapes.map((item, index) => (
                                    <tr key={item.id} className={`${index % 2 === 0 ? "" : "bg-[#1c2d55]"} `}>
                                        <th className="px-6 py-4 text-nowrap">
                                            <>
                                                <a href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                }}
                                                    title={langueActive?.indice === "fr" ? edit.fr.upperText : langueActive?.indice === "en" ? edit.en.upperText : ""}><i className="bi bi-pencil-square bg-blue-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                                                </a> 
                                                <a href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                    }}
                                                    title={langueActive?.indice === "fr" ? deleteAction.fr.upperText : langueActive?.indice === "en" ? deleteAction.en.upperText : ""}><i className="bi bi-trash-fill bg-red-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                                                </a>
                                                <br /><br /><br />
                                            </>
                                        </th>
                                        <td className="px-6 py-4">
                                            {item.ordre}
                                        </td>
                                        <td className="px-6 py-4">
                                            {langueActive?.indice === "fr" ? item.title : langueActive?.indice === "en" ? item.titleEn : ""}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.statutInitial}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.createdAt}
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr className="bg-[#1c2d55] text-center">
                                    <td colSpan={5} className="px-6 py-4">{t("nodata")}</td>
                                </tr>
                            )}
                            
                        
                        </tbody>
                    </table>
                </div>
                <div className="mx-4 mt-5">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>

            {showModalAdd && (
                <AddEtapeTypeDemande 
                    setShowModal={setShowModalAdd}
                />
            )}
        </>
    )
}

export default EtapeTypeDemandeComponent;