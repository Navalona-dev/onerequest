import React, { useEffect, useState } from "react";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";
import api from "../../../service/Api";
import Pagination from "../Pagination";
import { store } from "../../../store";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import deleteDepartement from "../../../service/admin/DeleteDepartement";
import { useParams } from 'react-router-dom';
import AddRangNiveauHierarchique from "./AddRangNiveauHierarchique";

type Rang = {
    id: number;
    rang: string;
}

type NiveauHierarchique = {
    id: number;
    nom: string;
    nomEn: string;
    description: string;
    descriptionEn: string;
}

const NiveauHierarchiqueComponent = () => {
    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 2;
    const {codeCouleur} = useGlobalActiveCodeCouleur();

    const [rangs, setRangs] = useState<{ [niveauId: number]: string }>({});

    const { idDepartement } = useParams();

    const [niveaux, setListeNiveau] = useState<NiveauHierarchique[]>([]);

    const [showModalAddRang, setShowModalAddRang] = useState(false);
    const [selectedNiveau, setSelectedNiveau] = useState<NiveauHierarchique | null>(null);

    useEffect(() => {
        const fetchRangs = async () => {
            const rangsTemp: { [niveauId: number]: string } = {};
    
            await Promise.all(
                niveaux.map(async (niveau) => {
                    try {
                        const response = await api.get(`/api/niveau_hierarchique/${niveau.id}/departement/${idDepartement}`);
                        rangsTemp[niveau.id] = response.data.rang;
                    } catch (error) {
                        console.error(`Erreur pour niveau ${niveau.id}:`, error);
                    }
                })
            );
    
            setRangs(rangsTemp);
        };
    
        if (niveaux.length > 0) {
            fetchRangs();
        }
    }, [niveaux, idDepartement]);
    
    
    useEffect(() => {
        api.get(`/api/departements/${idDepartement}/niveau-hierarchique`)
        .then((response) => {
            setListeNiveau(response.data);
        })
        .catch((error) => console.log("Erreur API", error));
    }, [idDepartement]);

     const dataToPaginate = niveaux;

     const totalPages = Math.max(1, Math.ceil(dataToPaginate.length / usersPerPage));
     
     const indexOfLastNiveau = currentPage * usersPerPage;
     const indexOfFirstNiveau = indexOfLastNiveau - usersPerPage;
     
     const currentDepartements = dataToPaginate.slice(indexOfFirstNiveau, indexOfLastNiveau);

     useEffect(() => {
        if (currentPage > totalPages) {
          setCurrentPage(1);
        }
      }, [currentPage, totalPages]);

    return(
        <>
        <div className="h-[69vh] overflow-y-auto my-3">
            <div className="color-header px-4 flex justify-between items-center mb-3">
                <h4 className="font-bold text-white">{t("listeNiveau")}</h4>
                    <button
                    className="px-5 py-2 text-white rounded"
                    >
                    {langueActive?.indice === "fr" ? create.fr.upperText : langueActive?.indice === "en" ? create.en.upperText : ""}
                </button>
                
            </div>
            <div className="mx-3 w-[153vh]">
                    <div className="w-[38vh] md:w-full sm:w-[38vh] h-[55vh] overflow-auto">
                        <table className="w-full border border-gray-700 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-[#1c2d55]">
                                <tr className="text-nowrap border-b-2 border-gray-700 ...">
                                    <th scope="col" className="px-6 py-3 text-white">
                                        Actions
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        {t('ordre')}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        {t("nomFr")}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        {t("nomEn")}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        {t("descriptionFr")}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        {t("descriptionEn")}
                                    </th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {currentDepartements.length > 0 ? (
                                    currentDepartements.map((item, index) => (
                                        <tr key={item.id} className={`${index % 2 === 0 ? "" : "bg-[#1c2d55]"}`}>
                                            <th className="px-6 py-4 text-nowrap">
                                                <>
                                                <a href="#"
                                                    title={langueActive?.indice === "fr" ? edit.fr.upperText : langueActive?.indice === "en" ? edit.en.upperText : ""}>
                                                    <i className="bi bi-pencil-square px-2 py-1.5 text-white rounded-3xl mr-3"
                                                    style={{
                                                        backgroundColor: codeCouleur?.btnColor
                                                    }}
                                                    ></i>
                                                </a>
                                                <a href="#"
                                                    title={langueActive?.indice === "fr" ? deleteAction.fr.upperText : langueActive?.indice === "en" ? deleteAction.en.upperText : ""}><i className="bi bi-trash-fill bg-red-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                                                </a>
                                                </>
                                            
                                            </th>
                                            <td className="px-6 py-4 text-center">
                                            {rangs[item.id] ? rangs[item.id] : (
                                                <a href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setShowModalAddRang(true);
                                                        setSelectedNiveau(item);
                                                    }}
                                                >
                                                    <i 
                                                        className="bi bi-plus-circle-fill"
                                                        style={{
                                                            color: codeCouleur?.textColor
                                                        }}
                                                    ></i>
                                                </a>
                                            )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.nom}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.nomEn}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.description}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.descriptionEn}
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr className="bg-[#1c2d55] text-center">
                                        <td colSpan={6} className="px-6 py-4">{t("nodata")}</td>
                                    </tr>
                                )}
                                
                            
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mx-4 ">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
        </div>
        {showModalAddRang && selectedNiveau && idDepartement && (
            <AddRangNiveauHierarchique 
                setShowModalAddRang={setShowModalAddRang} 
                niveauId={selectedNiveau.id}
                depId={Number(idDepartement)}
            />
        )}
        </>
    )
}

export default NiveauHierarchiqueComponent;