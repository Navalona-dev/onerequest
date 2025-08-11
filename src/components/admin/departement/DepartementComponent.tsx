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
import UpdateRangDepartement from "./UpdateRangDepartement";
import deleteRangDepartement from "../../../service/admin/DeleteRangDepartement";
import dissocieDepartement from "../../../service/admin/DissocieDepartement";

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
}

type Rang = {
    id : number;
    rang: number;
    typeDemande: TypeDemande;
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
    const { create, delete: deleteAction, edit, activate, deactivate, dissocie } = state.actionTexts;
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 2;

    const [departements, setListeDepartement] = useState<Departement[]>([]);

    const [searchNom, setSearchNom] = useState("");
    const [searchNomEn, setSearchNomEn] = useState("");
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [selectedDepartement, setSelectedDepartement] = useState<Departement | null>(null);
    const [selectedRang, setSelectedRang] = useState<Rang | null>(null);
    const [site, setSite] = useState<Site | null>(null);
    const user = UserAdminConnected() as UserType | null;
    const [showModalAddRangDep, setShowModalAddRangDep] = useState(false);
    const [showModalUpdateRangDep, setShowModalUpdateRangDep] = useState(false);
    const {codeCouleur} = useGlobalActiveCodeCouleur();
    const [rangsParDepartement, setRangsParDepartement] = useState<{ [depId: number]: Rang[] }>({});

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

    useEffect(() => {
        if (site && departements.length > 0) {
          departements.forEach(dep => {
            api
              .get(`/api/sites/${site.id}/departement/${dep.id}/rangs`)
              .then((response) => {
                setRangsParDepartement(prev => ({
                  ...prev,
                  [dep.id]: response.data,
                }));
              })
              .catch(err => {
                console.error(`Erreur pour département ${dep.id} :`, err);
              });
          });
        }
      }, [site, departements]);


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
     
     const currentDepartements = dataToPaginate.slice(indexOfFirstDepartement, indexOfLastDepartement);

     useEffect(() => {
        if (currentPage > totalPages) {
          setCurrentPage(1);
        }
      }, [currentPage, totalPages]);

    return(
        <>
            <div className="h-[69vh] overflow-y-auto py-3">
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
                <div className="card my-6 px-5 mx-12 border border-gray-700 py-5">
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
                    <div className="w-[42vh] md:w-full sm:w-[42vh] h-[40vh] md:h-[55vh] sm:h-[40vh] overflow-auto">
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
                                            <th className="px-6 py-4 text-nowrap ">
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
                                                        </a> <br /> <br />
                                                        <a href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            dissocieDepartement(item.id, langueActive?.indice as "fr" | "en", Number(site?.id))
                                                        }}
                                                            title={langueActive?.indice === "fr" ? dissocie.fr.upperText : langueActive?.indice === "en" ? dissocie.en.upperText : ""}><i className="bi bi-trash2-fill bg-red-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
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
                                            <td className="px-6 py-4 text-nowrap">
                                            {user && user.privileges && (
                                                (user.privileges.some(p => p.title === "super_admin") && user.isSuperAdmin === true) ||
                                                user.privileges.some(p => p.title === "admin_site")
                                            ) ? (
                                                <div className="text-center">
                                                    <a
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setSelectedDepartement(item);
                                                            setShowModalAddRangDep(true);
                                                        }}
                                                        style={{ color: codeCouleur?.textColor }}
                                                        title={langueActive?.indice === "fr" ? "Ajout rang" : langueActive?.indice === "en" ? "Add order" : ""}
                                                    >
                                                        <i className="bi bi-plus-circle-fill"></i>
                                                    </a>
                                                    <br /><br />
                                                </div>
                                            ) : null}

                                                
                                                {rangsParDepartement[item.id] && rangsParDepartement[item.id].length > 0 ? (
                                                    rangsParDepartement[item.id].map((rang, index) => (
                                                        <p key={rang.id} className="mb-3">
                                                            <span className="mr-2">{ rang.rang}</span>
                                                            {user && user.privileges && (
                                                                (user.privileges.some(p => p.title === "super_admin") && user.isSuperAdmin === true) ||
                                                                user.privileges.some(p => p.title === "admin_site")
                                                            ) ? (
                                                                <>
                                                                    <a href="#"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            setSelectedRang(rang);
                                                                            setShowModalUpdateRangDep(true);
                                                                        }}
                                                                        style={{
                                                                            color: codeCouleur?.textColor
                                                                        }}
                                                                        title={langueActive?.indice === "fr" ? "Modification rang" : langueActive?.indice === "en" ? "Update order" : ""}                                                                className="mr-2"
                                                                    >
                                                                        <i className="bi bi-pencil-fill"></i>
                                                                    </a>
                                                                    <a href="#"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        deleteRangDepartement(rang.id, langueActive?.indice as "fr" | "en");
                                                                    }}
                                                                        title={langueActive?.indice === "fr" ? "Supprimer rang" : langueActive?.indice === "en" ? "Delete order" : ""}                                                            >
                                                                        <i className="bi bi-trash-fill text-red-500"></i>
                                                                    </a>
                                                                </>
                                                            ) : null}
                                                            
                                                        </p>
                                                    ))
                                                ) : null}

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

        {showModalUpdateRangDep && selectedRang && (
            <UpdateRangDepartement
                setShowModalUpdateRangDep={setShowModalUpdateRangDep}
                idRang={selectedRang.id}
                initialData={{
                    rang: selectedRang.rang,
                    type: selectedRang.typeDemande ?? null,
                }}
            />
        )}

        </>
    )
}

export default DepartementComponent;