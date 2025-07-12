import React, { useEffect, useState } from "react";
import { store } from "../../../store";
import api from "../../../service/Api";
import Pagination from "../Pagination";
import AddCategorieDomaine from "./AddCategorieDomaine";
import UpdateCategorieDomaine from "./UpdateCategorieDomaine";
import { Link } from "react-router-dom";
import deleteCategorieDomaine from "../../../service/admin/DeleteCategorieDomaine";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

type CategoryType = {
    id: number;
    nom: string;
    description: string;
    nomEn: string;
    descriptionEn: string;
}
const CategorieDomaineComponent = () => {
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;
    const [categories, setListeCategorie] = useState<CategoryType[]>([]);
    const [searchNom, setSearchNom] = useState("");
    const [selectedCategorie, setSelectedCategorie] = useState<CategoryType | null>(null);

    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const {codeCouleur, loading} = useGlobalActiveCodeCouleur();

    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 3;
    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        api.get('/api/categorie_domaine_entreprises')
        .then((response) => {
            setListeCategorie(response.data)
        })
        .catch((error) => console.log("Erreur API", error));
    }, []);

    const filteredCategories = categories.filter(categorie =>
        categorie.nom.toLowerCase().includes(searchNom.toLowerCase())
      );

    const dataToPaginate = filteredCategories.length > 0 ? filteredCategories : categories;

    const indexOfLastCategorie = currentPage * categoriesPerPage;
    const indexOfFirstCategorie = indexOfLastCategorie - categoriesPerPage;
    
    let currentCategories;
    let totalPages;

    if (filteredCategories.length > 0) {
        currentCategories = filteredCategories.slice(indexOfFirstCategorie, indexOfLastCategorie);
        totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);
      } else {
        currentCategories = categories.slice(indexOfFirstCategorie, indexOfLastCategorie);
        totalPages = Math.ceil(categories.length / categoriesPerPage);
      }

    return(
        <>
        <div className="h-[69vh] overflow-y-auto m-4">
            <div className="color-header px-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-3">
                <h4 className="font-bold text-white text-lg">{t("listecatdomainetitle")}</h4>

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


            <div className="card my-6 px-5 mx-12 border border-gray-700 py-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="w-full">
                     
                    </div>

                  </div>
              </div>

            <div className="w-[38vh] md:w-full sm:w-[38vh] h-[55vh] overflow-auto p-4" >
                <table className="w-full border border-gray-700 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-[#1c2d55]">
                        <tr className="text-nowrap border-b-2 border-gray-700 ...">
                            <th scope="col" className="px-6 py-3 text-white">
                                Actions
                            </th>
                            <th scope="col" className="px-6 py-3 text-white">
                                {langueActive?.indice === "fr" ? "Titre" : langueActive?.indice === "en" ? "Title" : ""}
                            </th>
                            <th scope="col" className="px-6 py-3 text-white">
                                Description
                            </th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {currentCategories.length > 0 ? (
                            currentCategories.map((item, index) => (
                                <tr key={item.id} className={`${index % 2 === 0 ? "" : "bg-[#1c2d55]"}`}>
                                    <td className="px-6 py-4 text-nowrap">
                                        <>
                                            <a href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedCategorie(item);
                                                    setShowModalUpdate(true);
                                                }}
                                                title={langueActive?.indice === "fr" ? edit.fr.upperText : langueActive?.indice === "en" ? edit.en.upperText : ""}>
                                                    <i 
                                                        className="bi bi-pencil-square px-2 py-1.5 text-white rounded-3xl mr-3"
                                                        style={
                                                            {
                                                                backgroundColor: codeCouleur?.btnColor
                                                            }
                                                        }
                                                    >
                                                    </i>
                                            </a>
                                            <a href="#"
                                               onClick={(e) => {
                                                e.preventDefault();
                                                deleteCategorieDomaine(item.id);
                                               }}
                                                title={langueActive?.indice === "fr" ? deleteAction.fr.upperText: langueActive?.indice === "en" ? deleteAction.en.upperText : ""}>
                                                    <i className="bi bi-trash-fill bg-red-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                                            </a>
                                            <Link to={`/${item.id}/domaine-entreprise`}
                                                title="Liste domaine entreprise">
                                                    <i 
                                                        className="bi bi-list-stars bg-blue-500 px-2 py-1.5 text-white rounded-3xl mr-3"
                                                        style={
                                                            {
                                                                backgroundColor: codeCouleur?.btnColor
                                                            }
                                                        }
                                                    >
                                                    </i>
                                            </Link>
                                        </>
                                       
                                    </td>
                                    <td className="px-6 py-4 ">
                                        {langueActive?.indice === "fr" ? item.nom : langueActive?.indice === "en" ? item.nomEn : ""}
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
                <AddCategorieDomaine
                setShowModalAdd={setShowModalAdd}
                 />
            )}

            {showModalUpdate && selectedCategorie && (
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

export default CategorieDomaineComponent;