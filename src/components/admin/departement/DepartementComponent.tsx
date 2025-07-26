import React, { useEffect, useState } from "react";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";
import api from "../../../service/Api";
import Pagination from "../Pagination";
import { store } from "../../../store";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import AddDepartement from "./AddDepartement";
import UpdateDepartement from "./UpdateDepartement";
import deleteDepartement from "../../../service/admin/DeleteDepartement";
import { Link } from "react-router-dom";
import UserAdminConnected from "../../../hooks/UserAdminConnected";
import AddRangDepartement from "./AddRangDepartement";

type Rang = {
    'id' : number;
    rang: number;
}

type Departement = {
    id: number;
    nom: string;
    description: string;
    nomEn: string;
    descriptionEn: string;
    departementRangs: Rang[] | [];
}

type Site = {
    id: number;
    nom: string;
}

type Privilege = {
    id: number;
    title: string;
  };

type UserType = {
    id: number;
    nom: string;
    prenom: string;
    privileges: Privilege[];
    site: Site;
    message: string;
    isSuperAdmin: boolean;
  };

const DepartementComponent = () => {
    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 2;

    const [departements, setListeDepartement] = useState<Departement[]>([]);

    const [searchNom, setSearchNom] = useState("");
    const [searchNomEn, setSearchNomEn] = useState("");
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [selectedDepartement, setSelectedDepartement] = useState<Departement | null>(null);
    const [site, setSite] = useState<Site | null>(null);
    const user = UserAdminConnected() as UserType | null;
    const [showModalAddRangDep, setShowModalAddRangDep] = useState(false);

    useEffect(() => {
        api.get('/api/sites/current')
        .then((response) => {
            setSite(response.data)
        })
        .catch((error) => console.log("Erreur API", error));

        if (!site?.id) return;
        api.get(`/api/sites/${site?.id}/departements`)
        .then((response) => {
            setListeDepartement(response.data)
        })
        .catch((error) => console.log("Erreur API", error));
    }, [site?.id]);

    const filteredDepartements = departements.filter(dep => {
        const nomMatch = !searchNom || dep.nom.toLowerCase().includes(searchNom.toLowerCase());
        const nomEnMatch = !searchNomEn || dep.nomEn.toLowerCase().includes(searchNomEn.toLowerCase());
        return nomMatch && nomEnMatch;
    });

     //const dataToPaginate = filteredDepartements.length > 0 ? filteredDepartements : users;
     const dataToPaginate = filteredDepartements;

     const totalPages = Math.max(1, Math.ceil(dataToPaginate.length / usersPerPage));
     
     const indexOfLastDepartement = currentPage * usersPerPage;
     const indexOfFirstDepartement = indexOfLastDepartement - usersPerPage;

     const {codeCouleur} = useGlobalActiveCodeCouleur();
     
     const currentDepartements = dataToPaginate.slice(indexOfFirstDepartement, indexOfLastDepartement);

     useEffect(() => {
        if (currentPage > totalPages) {
          setCurrentPage(1);
        }
      }, [currentPage, totalPages]);

    return(
        <>
            <div className="h-[69vh] overflow-y-auto my-3">
                <div className="color-header px-4 flex justify-between items-center mb-3">
                    <h4 className="font-bold text-white">{t("listDepartement")}</h4>
                    {user && user.privileges && user.privileges.some(p => p.title === "super_admin") && user.isSuperAdmin === true ? (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setShowModalAdd(true);
                            }}
                            className="px-5 py-2 text-white rounded"
                            >
                            {langueActive?.indice === "fr" ? create.fr.upperText : langueActive?.indice === "en" ? create.en.upperText : ""}
                        </button>
                    ) : null}
                    
                    
                </div>
                <div className="card my-6 px-5 mx-8 border border-gray-700 py-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="w-full">
                            <input type="text" name="" id="" 
                            placeholder={`${t("nomFr")}...`}
                            value={searchNom}
                            onChange={(e) => setSearchNom(e.target.value)}
                            className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                    focus:outline-none focus:ring-0 focus:border-transparent"
                            />
                        </div>
                        <div className="w-full">
                            <input type="text" name="" id="" 
                            placeholder={`${t("nomEn")}...`}
                            value={searchNomEn}
                            onChange={(e) => setSearchNomEn(e.target.value)}
                            className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                    focus:outline-none focus:ring-0 focus:border-transparent"
                            />
                        </div>
                    
                    </div>
                </div>
                <div className="mx-3">
                    <div className="w-[38vh] md:w-full sm:w-[38vh] h-[40vh] md:h-[55vh] sm:h-[40vh] overflow-auto">
                        <table className="w-full border border-gray-700 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-[#1c2d55]">
                                <tr className="text-nowrap border-b-2 border-gray-700 ...">
                                    <th scope="col" className="px-6 py-3 text-white">
                                        Actions
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        {t("nomFr")}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        {t("nomEn")}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        {t("ordre")}
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
                                                {user && user.privileges && user.privileges.some(p => p.title === "super_admin") && user.isSuperAdmin === true ? (
                                                    <>
                                                        <a href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setSelectedDepartement(item);
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
                                                                if (langueActive) {
                                                                    deleteDepartement(item.id, langueActive.indice as "fr" | "en");
                                                                }
                                                            }}
                                                            title={langueActive?.indice === "fr" ? deleteAction.fr.upperText : langueActive?.indice === "en" ? deleteAction.en.upperText : ""}><i className="bi bi-trash-fill bg-red-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                                                        </a>
                                                    </>
                                                ) : null}
                                                
                                                
                                                <Link to={`/${item.id}/niveau-hierarchique`}
                                                    title={langueActive?.indice === "fr" ? "Liste niveau hierarchique" : langueActive?.indice === "en" ? "List of Hierarchical Levels" : ""}
                                                >
                                                    <i className="bi bi-list-task bg-red-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                                                </Link>
                                                </>
                                            
                                            </th>
                                            <td className="px-6 py-4">
                                                {item.nom}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.nomEn}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.departementRangs && item.departementRangs.length > 0 ? (
                                                    item.departementRangs.map((rang, index) => (
                                                        <>
                                                            <span>{ rang.rang}</span><br />
                                                        </>
                                                    ))
                                                ) : (
                                                    <a href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedDepartement(item);
                                                        setShowModalAddRangDep(true);
                                                    }}
                                                    style={{
                                                        color: codeCouleur?.textColor
                                                    }}
                                                    >
                                                        <i className="bi bi-plus-circle-fill"></i>
                                                    </a>
                                                )}
                                                
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
                                        <td colSpan={7} className="px-6 py-4">{t("nodata")}</td>
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
                <AddDepartement setShowModalAdd={setShowModalAdd} />
            )}

            {showModalUpdate && selectedDepartement && (
                <UpdateDepartement
                depId={selectedDepartement.id}
                setShowModalUpdate={setShowModalUpdate}
                initialData={{
                    nom: selectedDepartement.nom,
                    nomEn: selectedDepartement.nomEn,
                    description: selectedDepartement.description,
                    descriptionEn: selectedDepartement.descriptionEn
                }}
                />
            )}
            {showModalAddRangDep && selectedDepartement && (
                <AddRangDepartement 
                    setShowModalAddRangDep={setShowModalAddRangDep}
                    depId={selectedDepartement.id}
                />
            )}
        </>
    )
}

export default DepartementComponent;