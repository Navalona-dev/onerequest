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
import { Link } from "react-router-dom";
import UpdateRangNiveauHierarchique from "./UpdateRangNiveauHierarchique";
import UserAdminConnected from "../../../hooks/UserAdminConnected";
import AddNiveauHierarchique from "./AddNiveauHierarchique";
import dissocieNiveauHierarchique from "./DissocieNiveauHierarchique";
import UpdateNiveauHierarchique from "./UpdateNiveauHierarchique";
import deleteNiveauHierarchique from "../../../service/admin/DeleteNiveauHierarchique";
import deleteNiveauHierarchiqueRang from "../../../service/admin/DeleteNiveauHierarchiqueRang";


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
    id: number;
    rang: string;
    typeDemande: TypeDemande;
}

type Site = {
    id: number;
    nom: string;
}

type Privilege = {
    id: number;
    title: string;
  };

  type NiveauHierarchique = {
    id: number;
    nom: string;
    nomEn: string;
    description: string;
    descriptionEn: string;
    privilege: Privilege;
}

type UserType = {
    id: number;
    nom: string;
    prenom: string;
    privileges: Privilege[];
    site: Site;
    message: string;
    isSuperAdmin: boolean;
  };


const NiveauHierarchiqueComponent = () => {
    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate, dissocie } = state.actionTexts;
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 2;
    const {codeCouleur} = useGlobalActiveCodeCouleur();
    const user = UserAdminConnected() as UserType | null;

    const [rangsParNiveau, setRangsParNiveau] = useState<{ [niveauId: number]: Rang[] }>({});

    const { idDepartement } = useParams();

    const [niveaux, setListeNiveau] = useState<NiveauHierarchique[]>([]);

    const [showModalAddRang, setShowModalAddRang] = useState(false);
    const [showModalUpdateRang, setShowModalUpdateRang] = useState(false);
    const [selectedNiveau, setSelectedNiveau] = useState<NiveauHierarchique | null>(null);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [selectedRang, setSelectedRang] = useState<Rang | null>(null);

    if (idDepartement) {
        sessionStorage.setItem('idDepartement', idDepartement);
    }
    
    useEffect(() => {
        api.get(`/api/departements/${idDepartement}/niveau-hierarchique`)
        .then((response) => {
            setListeNiveau(response.data);
        })
        .catch((error) => console.log("Erreur API", error));
    }, [idDepartement]);

    useEffect(() => {
        if (idDepartement && niveaux.length > 0) {
            const fetchAllRangs = async () => {
                const result: { [niveauId: number]: Rang[] } = {};
                for (const niveau of niveaux) {
                    try {
                        const response = await api.get(`/api/niveau_hierarchique_rangs/niveau/${niveau.id}/departement/${idDepartement}`);
                        result[niveau.id] = response.data;
                    } catch (err) {
                        console.error(`Erreur pour niveau ${niveau.id} :`, err);
                        result[niveau.id] = [];
                    }
                }
                setRangsParNiveau(result);
            };
            fetchAllRangs();
        }
    }, [idDepartement, niveaux]);
    
    
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
        <div className="h-[69vh] overflow-y-auto my-5">
            <div className="color-header px-4 mb-5">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <h4 className="font-bold text-white mb-2 sm:mb-0">{t("listeNiveau")}</h4>

                    <div className="flex flex-row gap-2">
                    {user && user.privileges && user.privileges.some(p => p.title === "super_admin") && user.isSuperAdmin === true ? (
                        <button className="px-5 py-1.5 text-white rounded"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowModalAdd(true);
                        }}
                        >
                            {langueActive?.indice === "fr" ? create.fr.upperText : langueActive?.indice === "en" ? create.en.upperText : ""}
                        </button>
                    ) : null}
                        
                        <Link to={`/departement`} className="btn-list px-5 py-2 text-white rounded">
                            {t("listDepartement")}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mx-3">
                <div className="w-[42vh] md:w-full sm:w-[42vh] h-[40vh] md:h-[55vh] sm:h-[40vh] overflow-auto">
                    <table className="w-full border border-gray-700 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-[#1c2d55]">
                            <tr className="border-b-2 border-gray-700 ...">
                                <th scope="col" className="px-6 py-3 text-white">
                                    Actions
                                </th>
                                <th scope="col" className="px-6 py-3 text-white">
                                   {t("typedemande")} {t("et")}  {t('ordre')}
                                </th>
                                <th scope="col" className="px-6 py-3 text-white">
                                    {t("nomFr")}
                                </th>
                                <th scope="col" className="px-6 py-3 text-white">
                                    {t("nomEn")}
                                </th>
                                <th scope="col" className="px-6 py-3 text-white">
                                    {t("privilege")}
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
                                                        setShowModalUpdate(true);
                                                        setSelectedNiveau(item);
                                                    }}
                                                    title={langueActive?.indice === "fr" ? edit.fr.upperText : langueActive?.indice === "en" ? edit.en.upperText : ""}
                                                    >
                                                        <i className="bi bi-pencil-square px-2 py-1.5 text-white rounded-3xl mr-3"
                                                        style={{
                                                            backgroundColor: codeCouleur?.btnColor
                                                        }}
                                                        ></i>
                                                    </a>
                                                    <a href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        deleteNiveauHierarchique(item.id, langueActive?.indice as "fr" | "en")
                                                    }}
                                                    title={langueActive?.indice === "fr" ? deleteAction.fr.upperText : langueActive?.indice === "en" ? deleteAction.en.upperText : ""}
                                                    >
                                                        <i className="bi bi-trash-fill bg-red-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                                                    </a>
                                                    <a href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        dissocieNiveauHierarchique(item.id, langueActive?.indice as "fr" | "en", Number(idDepartement));
                                                      }}
                                                        title={langueActive?.indice === "fr" ? dissocie.fr.upperText : langueActive?.indice === "en" ? dissocie.en.upperText : ""}>
                                                        <i className="bi bi-trash2-fill bg-red-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                                                    </a>
                                                </>
                                            ) : null}
                                           
                                            </>
                                        
                                        </th>
                                        <td className="px-6 py-4 text-center text-nowrap">
                                            <div className="mb-5">
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
                                            </div>
                                            <div>
                                                
                                            {rangsParNiveau[item.id] && rangsParNiveau[item.id].length > 0 ? (
                                                <>
                                                    
                                                    <Link to={`/${item.id}/rang?type=niveau`}
                                                        className="outline outline-1 px-3 py-2 rounded"
                                                        style={{
                                                            outlineColor: codeCouleur?.btnColor
                                                        }}
                                                    >
                                                        Liste rangs
                                                    </Link>
                                                </>
                                                /*rangsParNiveau[item.id].map((rang, index) => (
                                                    
                                                    <div key={rang.id} className="mb-5">
                                                            
                                                            {rang.typeDemande && (
                                                                <h6>
                                                                    <span className="mr-2"
                                                                    style={{
                                                                        fontSize: "6px"
                                                                    }}
                                                                    >
                                                                        <i className="bi bi-circle-fill"></i>
                                                                    </span>
                                                                    {langueActive?.indice === "fr"
                                                                    ? rang.typeDemande?.nom
                                                                    : langueActive?.indice === "en"
                                                                        ? rang.typeDemande?.nomEn
                                                                        : ""}
                                                                </h6>
                                                            )}
                                                                <span className="mr-2">{rang.rang}</span>
                                                                {user && user.privileges && user.privileges.some(p => p.title === "super_admin") && user.isSuperAdmin === true ? (
                                                                    <>
                                                                        <a href="#"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                setSelectedNiveau(item);
                                                                                setSelectedRang(rang);
                                                                                setShowModalUpdateRang(true);
                                                                            }}
                                                                            className="mr-2"
                                                                        >
                                                                            <i className="bi bi-pencil-fill"
                                                                            style={{
                                                                                color: codeCouleur?.textColor
                                                                            }}
                                                                            ></i>
                                                                        </a>
                                                                        <a href="#"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            deleteNiveauHierarchiqueRang(rang.id, langueActive?.indice as "fr" | "en")
                                                                        }}
                                                                        >
                                                                            <i className="bi bi-trash-fill text-red-500"
                                                                            title={langueActive?.indice === "fr" ? deleteAction.fr.upperText : langueActive?.indice === "en" ? deleteAction.en.upperText : ""}                                                        ></i>
                                                                        </a>
                                                                    </>
                                                                ) : null
                                                            }
                                                    </div>
                                                    
                                                ))*/
                                            ) : null}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.nom}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.nomEn}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.privilege.title}
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
        {showModalAddRang && selectedNiveau && idDepartement && (
            <AddRangNiveauHierarchique 
                setShowModalAddRang={setShowModalAddRang} 
                niveauId={selectedNiveau.id}
                depId={Number(idDepartement)}
            />
        )}

        {showModalUpdateRang && selectedNiveau && selectedRang && idDepartement && (
            <UpdateRangNiveauHierarchique
                setShowModalUpdateRang={setShowModalUpdateRang}
                idRang={selectedRang.id}
                niveauId={selectedNiveau.id}
                depId={Number(idDepartement)}
                initialData={{
                    rang: Number(selectedRang.rang)
                }}
            />
        )}


        {showModalAdd && idDepartement && (
            <AddNiveauHierarchique
                setShowModalAdd={setShowModalAdd}
                idDepartement={Number(idDepartement)}
             />
        )}

        {showModalUpdate && selectedNiveau && (
            <UpdateNiveauHierarchique 
                setShowModalUpdate={setShowModalUpdate}
                idNiveau={selectedNiveau.id}
                initialData={{
                    nom: selectedNiveau.nom,
                    nomEn: selectedNiveau.nomEn,
                    description: selectedNiveau.description,
                    descriptionEn: selectedNiveau.descriptionEn
                }}
            />
        ) }

        
        </>
    )
}

export default NiveauHierarchiqueComponent;