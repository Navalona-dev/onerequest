import React, { useEffect, useState } from "react";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";
import api from "../../../service/Api";
import Pagination from "../Pagination";
import { store } from "../../../store";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import deleteDepartement from "../../../service/admin/DeleteDepartement";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import deleteNiveauHierarchiqueRang from "../../../service/admin/DeleteNiveauHierarchiqueRang";
import AddRangDepartement from "./AddRangDepartement";
import UpdateRangDepartement from "./UpdateRangDepartement";
import deleteRangDepartement from "../../../service/admin/DeleteRangDepartement";

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
    nom: string
    region: Region |null;
    commune: Commune | null;
}
type Departement = {
    id: number;
    nom: string;
    nomEn: string;
}

type NiveauHierarchique = {
    id: number;
    nom: string;
    nomEn: string;
    description: string;
    descriptionEn: string;
    departements: Departement[];
}

type Domaine = {
    id: number;
    libelle: string;
    libelleEn: string;
  }
  
  type TypeDemande = {
    id: number;
    nom: string;
    domaine: Domaine;
    description: string;
    isActive: boolean;
    nomEn: string;
    descriptionEn: string;
    site: Site | null;
  }

type Rang = {
    id: number;
    rang: number;
    niveau: NiveauHierarchique;
    departement: Departement;
    typeDemande: TypeDemande | null;
    site: Site | null;
}

const DepartementRangComponent = () => {
    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 2;
    const {codeCouleur} = useGlobalActiveCodeCouleur();

    const [showModalAdd, setShowModalAddRangDep] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const { id } = useParams();
    const [selectedRang, setSelectedRang] = useState<Rang | null>(null);

    const idDepartement = sessionStorage.getItem('idDepartement');

    const [rangs, setListeRang] = useState<Rang[]>([]);
    
    useEffect(() => {
        api.get(`/api/departement_rangs/departement/${id}/rangs`)
        .then((response) => {
            setListeRang(response.data);
        })
        .catch((error) => console.log("Erreur API", error));
    }, []);

     const dataToPaginate = rangs;

     const totalPages = Math.max(1, Math.ceil(dataToPaginate.length / usersPerPage));
     
     const indexOfLastRang = currentPage * usersPerPage;
     const indexOfFirstRang = indexOfLastRang - usersPerPage;
     
     const currentRangs = dataToPaginate.slice(indexOfFirstRang, indexOfLastRang);

     useEffect(() => {
        if (currentPage > totalPages) {
          setCurrentPage(1);
        }
      }, [currentPage, totalPages]);

    return(
        <>
        <div className="h-[69vh] overflow-y-auto my-6">
            <div className="color-header px-4 flex justify-between items-center mb-5">
                <h4 className="font-bold text-white">{t("listeNiveau")}</h4>
                <div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowModalAddRangDep(true);
                        }}
                        className="px-5 py-1 text-white rounded mr-5"
                        >
                        {langueActive?.indice === "fr" ? create.fr.upperText : langueActive?.indice === "en" ? create.en.upperText : ""}
                    </button>
                    <Link to={`/departement`} className="btn-list px-5 py-2 text-white rounded">
                        {t("departement")}
                    </Link>
                </div>
                
            </div>
            <div className="mx-4 w-[153vh]">
                    <div className="w-[38vh] md:w-full sm:w-[38vh] h-[55vh] overflow-auto">
                        <table className="w-full border border-gray-700 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-[#1c2d55]">
                                <tr className="text-nowrap border-b-2 border-gray-700 ...">
                                    <th scope="col" className="px-6 py-3 text-white">
                                        Actions
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        {t("order")}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        {t("typeDemande")}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        Site
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRangs.length > 0 ? (
                                    currentRangs.map((item, index) => (
                                        <tr key={item.id} className={`${index % 2 === 0 ? "" : "bg-[#1c2d55]"}`}>
                                            <th className="px-6 py-4 text-nowrap">
                                                <>
                                                <a href="#"
                                                    title={langueActive?.indice === "fr" ? edit.fr.upperText : langueActive?.indice === "en" ? edit.en.upperText : ""}>
                                                    <i className="bi bi-pencil-square px-2 py-1.5 text-white rounded-3xl mr-3"
                                                    style={{
                                                        backgroundColor: codeCouleur?.btnColor
                                                    }}
                                                    onClick={() => {
                                                        setSelectedRang(item);
                                                        setShowModalUpdate(true);
                                                      }}
                                                    ></i>
                                                </a>
                                                <a href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        deleteRangDepartement(item.id, langueActive?.indice as "fr" | "en");
                                                    }}
                                                    title={langueActive?.indice === "fr" ? deleteAction.fr.upperText : langueActive?.indice === "en" ? deleteAction.en.upperText : ""}><i className="bi bi-trash-fill bg-red-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                                                </a>
                                                </>
                                            
                                            </th>
                                            
                                            <td className="px-6 py-4">
                                                {item.rang}
                                            </td>
                                            <td className="px-6 py-4">
                                                {langueActive?.indice === "fr" ? item.typeDemande?.nom : 
                                                langueActive?.indice === "en" ? item.typeDemande?.nomEn : ""}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span>{item.site?.nom} ({item.site?.region?.nom} / {item.site?.commune?.nom})</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="bg-[#1c2d55] text-center">
                                        <td colSpan={3} className="px-6 py-4">{t("nodata")}</td>
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

        {showModalAdd && (
            <AddRangDepartement 
                setShowModalAddRangDep={setShowModalAddRangDep}
                depId={Number(id)}
            />
        )}

        {showModalUpdate && selectedRang && 
            <UpdateRangDepartement 
                idRang={selectedRang.id}
                depId={selectedRang.id}
                setShowModalUpdateRangDep={setShowModalUpdate}
                initialData={{
                    rang: selectedRang.rang,
                    type: selectedRang.typeDemande ?? null
                }}
            />
        }

        </>
    )
}

export default DepartementRangComponent;