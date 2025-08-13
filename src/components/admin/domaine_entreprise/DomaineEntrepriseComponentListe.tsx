import React, {useEffect, useState} from "react";
import { store } from "../../../store";
import api from "../../../service/Api";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import AddDomaineEntreprise from "./AddDomaineEntreprise";
import UpdateDomaineEntreprise from "./UpdateDomaineEntreprise";
import deleteDomaineEntreprise from "../../../service/admin/DeleteDomaineEntreprise";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";
import UpdateCategorieDomaine from "../categorie_domaine_entreprise/UpdateCategorieDomaine";

type CategorieType = {
    id: number;
    nom: string;
    description: string;
    nomEn: string;
    descriptionEn: string;
}

type DomaineType = {
    id: number;
    libelle: string;
    description: string;
    descriptionEn: string;
    libelleEn: string;
    categorieDomaineEntreprise: CategorieType | null;
}

const DomaineEntrepriseComponentListe = () => {
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;

    const [selectedDomaine, setSelectedDomaine] = useState<DomaineType | null>(null);

    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [showModalUpdateCategorie, setShowModalUpdateCategorie] = useState(false);
    const [domaines, setListeDomaine] = useState<DomaineType[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageCategorie, setCurrentPageCategorie] = useState(1);
    const domainesPerPage = 5;
    const categoriePerPage = 2;
    const [searchNom, setSearchNom] = useState("");

    const { idCategorieDomaine } = useParams();
    const [categorie, setCategorie] = useState<CategorieType | null >(null);
    const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();
    const [categories, setListeCategorie] = useState<CategorieType[]>([]);
    const [selectedCategorie, setSelectedCategorie] = useState<CategorieType | null>(null);

    useEffect(() => {
        api.get('/api/entreprises/categories')
        .then((response) => {
          setListeCategorie(response.data);
        })
        .catch((error) => console.log("Erreur API", error));
      }, []);

    useEffect(() => {
        api.get(`/api/entreprises/domaines`)
        .then((response) => {
            setListeDomaine(response.data)
        })
        .catch((error) => console.log('Erreur API', error));
    }, []);

    //gerer pagination domaine

    const indexOfLastDomaine = currentPage * domainesPerPage;
    const indexOfFirstDomaine = indexOfLastDomaine - domainesPerPage;
    
    let currentDomaines = domaines.slice(indexOfFirstDomaine, indexOfLastDomaine);
    let totalPages = Math.ceil(domaines.length / domainesPerPage);

    //gerer pagination categorie
    const indexOfLastCategorie = currentPageCategorie * categoriePerPage;
    const indexOfFirstCategorie = indexOfLastCategorie - categoriePerPage;
    
    let currentCategories = categories.slice(indexOfFirstCategorie, indexOfLastCategorie);
    let totalPageCategorie = Math.ceil(categories.length / categoriePerPage);

    return(
        <>
            <div className="h-[69vh] overflow-y-auto mx-4 my-6">
            <div className="color-header px-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-3">
                    {/* Titre principal */}
                    <div>
                        <h4 className="font-bold text-white text-lg">{t("listecatdomainetitle")}</h4>
                    </div>
                </div>
                <div className="w-[42vh] md:w-full sm:w-[42vh] overflow-auto p-4  mt-4 mb-4" >
                    <table className="w-full border border-gray-700 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-[#1c2d55]">
                            <tr className="text-nowrap border-b-2 border-gray-700 ...">
                                <th scope="col" className="px-6 py-3 text-white text-center">
                                    Actions
                                </th>
                                <th scope="col" className="px-6 py-3 text-white text-center">
                                    {t("title")}
                                </th>
                                <th scope="col" className="px-6 py-3 text-white text-center">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCategories.length > 0 ? (
                                currentCategories.map((item, index) => (
                                    <tr key={item.id} className={`${index % 2 === 0 ? "" : "bg-[#1c2d55]"}`}>
                                        <td className="px-6 py-4">
                                            <a href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedCategorie(item);
                                                    setShowModalUpdateCategorie(true);
                                                }}
                                            >
                                                <i className="bi bi-pencil-square px-2 py-1.5 text-white rounded-3xl mr-3"
                                                style={{
                                                    backgroundColor: codeCouleur?.btnColor
                                                }}
                                                title={langueActive?.indice === "fr" ? edit.fr.upperText : 
                                                    langueActive?.indice === "en" ? edit.en.upperText : ""
                                                }                                                
                                                ></i>
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            {langueActive?.indice === "fr" ? item.nom : 
                                            langueActive?.indice === "en" ? item.nomEn : ""}
                                        </td>
                                        <td className="px-6 py-4">
                                            {langueActive?.indice === "fr" ? item.description : 
                                            langueActive?.indice === "en" ? item.descriptionEn : ""}
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
                <div className="mx-4 mb-12">
                    <Pagination
                    currentPage={currentPageCategorie}
                    totalPages={totalPageCategorie}
                    onPageChange={(page) => setCurrentPageCategorie(page)}
                    />
                </div>
                <div className="color-header px-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-3">
                    {/* Titre principal */}
                    <div>
                        <h4 className="font-bold text-white text-lg">{t("listeDomaine")}</h4>
                    </div>

                    {/* Boutons */}
                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                        <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowModalAdd(true);
                        }}
                        className="px-5 py-2 text-white rounded w-full md:w-auto"
                        >
                        {langueActive?.indice === "fr" ? create.fr.upperText : langueActive?.indice === "en" ? create.en.upperText : ""}
                        </button>

                    </div>
                </div>
                <div className="w-[38vh] md:w-full sm:w-[38vh] h-[55vh] overflow-auto p-4  mt-4" >
                    <table className="w-full border border-gray-700 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-[#1c2d55]">
                            <tr className="text-nowrap border-b-2 border-gray-700 ...">
                                <th scope="col" className="px-6 py-3 text-white">
                                    Actions
                                </th>
                                <th scope="col" className="px-6 py-3 text-white">
                                    {t("category")}
                                </th>
                                <th scope="col" className="px-6 py-3 text-white">
                                    {t("title")}
                                </th>
                                <th scope="col" className="px-6 py-3 text-white">
                                    Description
                                </th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {currentDomaines.length > 0 ? (
                                currentDomaines.map((item, index) => (
                                    <tr key={item.id} className={`${index % 2 === 0 ? "" : "bg-[#1c2d55]"}`}>
                                        <td className="px-6 py-4 text-nowrap">
                                            <>
                                                <a href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedDomaine(item);
                                                    setShowModalUpdate(true);
                                                }}
                                                    title={langueActive?.indice === "fr" ? edit.fr.upperText : langueActive?.indice === "en" ? edit.en.upperText : ""}>
                                                    <i className="bi bi-pencil-square px-2 py-1.5 text-white rounded-3xl mr-3"
                                                    style={{
                                                        backgroundColor: codeCouleur?.btnColor
                                                    }}
                                                    ></i>
                                                </a>
                                                <a href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        deleteDomaineEntreprise(item.id)
                                                    }}
                                                    title={langueActive?.indice === "fr" ? deleteAction.fr.upperText : langueActive?.indice === "en" ? deleteAction.en.upperText : ""}><i className="bi bi-trash-fill bg-red-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                                                </a>
                                            
                                            </>
                                        
                                        </td>
                                        <td className="px-6 py-4 ">
                                            <span className="mr-2">{langueActive?.indice === "fr" ? item.categorieDomaineEntreprise?.nom : langueActive?.indice === "en" ? item.categorieDomaineEntreprise?.nomEn : ""}</span>
                                        </td>
                                        <td className="px-6 py-4 ">
                                            {langueActive?.indice === "fr" ? item.libelle : langueActive?.indice === "en" ? item.libelleEn : ""}
                                        </td>
                                        <td className="px-6 py-4">
                                            {langueActive?.indice === "fr" ? item.description : langueActive?.indice === "en" ? item.descriptionEn : ""}
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
                <div className="mx-4 ">
                    <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>

            {showModalAdd && (
                <AddDomaineEntreprise
                setShowModalAdd={setShowModalAdd}
            />
            )}

            {showModalUpdate && selectedDomaine && (
                <UpdateDomaineEntreprise 
                    setShowModalUpdate={setShowModalUpdate}
                    domaineId={selectedDomaine.id}
                    initialData={{
                        libelle: selectedDomaine.libelle,
                        description: selectedDomaine.description,
                        libelleEn: selectedDomaine.libelleEn,
                        descriptionEn: selectedDomaine.descriptionEn,
                        categorieDomaineEntreprise: selectedDomaine.categorieDomaineEntreprise
                    }}
                />
            )}

        {showModalUpdateCategorie && selectedCategorie && (
                <UpdateCategorieDomaine
                    setShowModalUpdate={setShowModalUpdate}
                    categorieId={selectedCategorie.id}
                    initialData={{
                        nom: selectedCategorie.nom,
                        description: selectedCategorie.description,
                        nomEn: selectedCategorie.nomEn,
                        descriptionEn: selectedCategorie.descriptionEn
                    }}
                 />
            )}
        </>
    )
}

export default DomaineEntrepriseComponentListe;