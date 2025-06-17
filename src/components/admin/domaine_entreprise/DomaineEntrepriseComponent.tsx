import React, {useEffect, useState} from "react";
import { store } from "../../../store";
import api from "../../../service/Api";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import AddDomaineEntreprise from "./AddDomaineEntreprise";
import UpdateDomaineEntreprise from "./UpdateDomaineEntreprise";
import deleteDomaineEntreprise from "../../../service/DeleteDomaineEntreprise";

type DomaineType = {
    id: number;
    libelle: string;
    description: string;
}

type CategorieType = {
    id: number;
    nom: string;
    description: string;
}

const DomaineEntrepriseComponent = () => {
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;

    const [selectedDomaine, setSelectedDomaine] = useState<DomaineType | null>(null);

    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [domaines, setListeDomaine] = useState<DomaineType[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const domainesPerPage = 5;
    const [searchNom, setSearchNom] = useState("");

    const { idCategorieDomaine } = useParams();
    const [categorie, setCategorie] = useState<CategorieType | null >(null);

    useEffect(() => {
        api.get(`/api/categorie_domaine_entreprises/${idCategorieDomaine}`)
        .then((response) => {
            console.log("category",response.data);
            setCategorie(response.data)
        })
        .catch((error) => console.log("Erreur API", error))
    }, []);


    useEffect(() => {
        api.get(`/api/categorie_domaine_entreprises/${idCategorieDomaine}/domaines`)
        .then((response) => {
            setListeDomaine(response.data)
        })
        .catch((error) => console.log('Erreur API', error));
    }, []);

    const filteredDomaines = domaines.filter(domaine =>
        domaine.libelle.toLowerCase().includes(searchNom.toLowerCase())
      );

    const dataToPaginate = filteredDomaines.length > 0 ? filteredDomaines : domaines;

    const indexOfLastDomaine = currentPage * domainesPerPage;
    const indexOfFirstDomaine = indexOfLastDomaine - domainesPerPage;
    
    let currentDomaines;
    let totalPages;

    if (filteredDomaines.length > 0) {
        currentDomaines = filteredDomaines.slice(indexOfFirstDomaine, indexOfLastDomaine);
        totalPages = Math.ceil(filteredDomaines.length / domainesPerPage);
      } else {
        currentDomaines = domaines.slice(indexOfFirstDomaine, indexOfLastDomaine);
        totalPages = Math.ceil(domaines.length / domainesPerPage);
      }

    return(
        <>
            <div className="h-[69vh] overflow-y-auto mx-4 my-6">
                <div className="color-header px-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-3">
                    {/* Titre principal */}
                    <div>
                        <h4 className="font-bold text-white text-lg">Liste domaine</h4>
                    </div>

                    {/* Sous-titre dynamique */}
                    <div>
                        {categorie ? (
                        <h4 className="font-bold text-white text-lg">{categorie.nom}</h4>
                        ) : null}
                    </div>

                    {/* Boutons */}
                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                        <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowModalAdd(true);
                        }}
                        className="bg-red-500 px-5 py-2 text-white rounded w-full md:w-auto"
                        >
                        {create.upperText}
                        </button>

                        <Link
                        to={`/categorie-domaine-entreprise`}
                        className="bg-red-500 px-5 py-2 text-white rounded text-center w-full md:w-auto"
                        >
                        Liste catégorie
                        </Link>
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
                                    Titre
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
                                                    title={edit.upperText}><i className="bi bi-pencil-square bg-blue-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                                                </a>
                                                <a href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        deleteDomaineEntreprise(item.id)
                                                    }}
                                                    title={deleteAction.upperText}><i className="bi bi-trash-fill bg-red-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                                                </a>
                                            
                                            </>
                                        
                                        </td>
                                        <td className="px-6 py-4 ">
                                            {item.libelle}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.description}
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr className="bg-[#1c2d55] text-center">
                                    <td colSpan={3} className="px-6 py-4">Aucun enregistrement trouvé</td>
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

            {showModalAdd && idCategorieDomaine && (
                <AddDomaineEntreprise
                setShowModalAdd={setShowModalAdd}
                idCategorie={Number(idCategorieDomaine)}
            />
            )}

            {showModalUpdate && selectedDomaine && (
                <UpdateDomaineEntreprise 
                    setShowModalUpdate={setShowModalUpdate}
                    domaineId={selectedDomaine.id}
                    initialData={{
                        libelle: selectedDomaine.libelle,
                        description: selectedDomaine.description
                    }}
                />
            )}
        </>
    )
}

export default DomaineEntrepriseComponent;