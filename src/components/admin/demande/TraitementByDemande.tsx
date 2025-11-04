import React, { useEffect, useState } from "react";
import api from "../../../service/Api";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";
import Pagination from "../Pagination";
import { useParams } from "react-router-dom";

type Commune = {
    id: number;
    nom: string;
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

type Departement = {
    id: number;
    nom: string;
    nomEn: string;
}

type User = {
    id: number;
    nom: string;
    prenom: string;
    email: string;
}

type TypeDemande = {
    id: number;
    nom: string;
    nomEn: string
}

type Demande = {
    id: number;
    type: TypeDemande | null;
}

type Traitement = {
    id: number;
    site: Site | null;
    departement: Departement | null;
    typeFr: string;
    typeEn: string;
    statutFr: string;
    statutEn: string;
    date: string;
    commentaire: string;
    user: User | null;
    demande: Demande | null

}

const TraitementByDemande = () => {
    const [traitements, setTraitement] = useState<Traitement[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const traitementsPerPage = 3;
    const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();
    const { idDemande } = useParams();
    const [departements, setDepartement] = useState<Departement[]>([]);

    useEffect(() => {
        api.get(`/api/demandes/${idDemande}/traitements`)
        .then((response) => {
            setTraitement(response.data);
        })
        .catch((error) => console.log("Erreur API", error))
    }, []);

    useEffect(() => {
        api.get('/api/departements/liste')
        .then((response) => {
            setDepartement(response.data);
        })
        .catch((error) => console.log("Erreur API", error));
    }, []);

    const dataToPaginate = traitements;

    const totalPages = Math.max(1, Math.ceil(dataToPaginate.length / traitementsPerPage));
    
    const indexOfLastTraitement = currentPage * traitementsPerPage;
    const indexOfFirstTraitement = indexOfLastTraitement - traitementsPerPage;
    
    const currentTraitements = dataToPaginate.slice(indexOfFirstTraitement, indexOfLastTraitement);

    useEffect(() => {
      if (currentPage > totalPages) {
        setCurrentPage(1);
      }
    }, [currentPage, totalPages]);

    return(
        <>
            <div className="h-[69vh] overflow-y-auto mt-5">
                <div className="color-header px-4 flex justify-between items-center mb-5">
                    <h4 className="font-bold text-white">{t("listeTraitement")} {t("demandeNum")} {Number(idDemande)}  </h4>
                </div>

                <div className="card my-6 px-5 mx-10 border border-gray-700 py-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="w-full">
                            <select
                                value=""
                                className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                            focus:outline-none focus:ring-0 focus:border-transparent"
                            >
                                <option value="" disabled>
                                    {t("selectDepartement")}
                                </option>
                                {departements.map((item, index) => (
                                    <option value={item.id} >
                                        {langueActive?.indice === "fr" ? item.nom : langueActive?.indice === "en" ? item.nomEn : ""}
                                    </option>
                                ))}
                               
                            </select>
                        </div>
                        <div className="w-full">
                            <input type="text" name="" id="" 
                            placeholder={`${t("responsable")}...`}
                            value=""
                            className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                    focus:outline-none focus:ring-0 focus:border-transparent"
                            />
                        </div>
                        <div className="w-full">
                            <input type="text" name="" id="" 
                            placeholder="Site..."
                            value=""
                            className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                    focus:outline-none focus:ring-0 focus:border-transparent"
                            />
                        </div>
                        <div className="w-full">
                            <select
                                value=""
                                className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                            focus:outline-none focus:ring-0 focus:border-transparent"
                                >
                                <option value="" disabled>
                                    {t("selectType")}
                                </option>
                            </select>
                        </div>
                        <div className="w-full">
                            <select
                                value=""
                                className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                            focus:outline-none focus:ring-0 focus:border-transparent"
                                >
                                <option value="" disabled>
                                    {t("selectStatut")}
                                </option>
                            </select>
                        </div>
                        <div className="w-full">
                            <input type="text" name="" id="" 
                            placeholder="Date..."
                            value=""
                            className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                    focus:outline-none focus:ring-0 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                <div className="mx-5">
                    <div className="w-[40vh] md:w-[152vh] sm:w-[40vh] h-[55vh] overflow-auto">
                        <table className="w-full border border-gray-700 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-[#1c2d55]">
                                <tr className="border-b-2 border-gray-700 text-center ...">
                                    <th scope="col" className="px-6 py-3 text-white">
                                        {t("typedemande")}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        {t("responsable")}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        Site
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        Departement
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        Statut
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        Commentaire
                                    </th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {currentTraitements.length > 0 ? (
                                    currentTraitements.map((item, index) => (
                                        <tr key={item.id} className={`${index % 2 === 0 ? "" : "bg-[#1c2d55]"}`}>
                                            
                                            <td className="px-6 py-4 ">
                                                {langueActive?.indice === "fr" ? item.demande?.type?.nom : langueActive?.indice === "en" ? item.demande?.type?.nomEn : ""}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.user?.nom} {item.user?.prenom} <br />
                                                <span style={{fontSize: "12px"}}>( {item.user?.email} )</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.site?.nom} ( {item.site?.region?.nom} / {item.site?.commune?.nom} )
                                            </td>
                                            <td className="px-6 py-4 ">
                                                {langueActive?.indice === "fr" ? item.departement?.nom : langueActive?.indice === "en" ? item.departement?.nomEn : "" }
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {langueActive?.indice === "fr" ? item.typeFr : langueActive?.indice === "en" ? item.typeEn : ""}
                                            </td>
                                            <td className="px-6 py-4">
                                                {langueActive?.indice === "fr" ? item.statutFr : langueActive?.indice === "en" ? item.statutEn : ""}
                                            </td>
                                            <td className="px-6 py-4">
                                                {langueActive?.indice === "fr"
                                                    ? new Date(item.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
                                                    : langueActive?.indice === "en" ? 
                                                    new Date(item.date).toLocaleDateString("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" }) : ""
                                                }
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.commentaire}
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr className="bg-[#1c2d55] text-center">
                                        <td colSpan={8} className="px-6 py-4">{t("nodata")}</td>
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
        </>
    )
}

export default TraitementByDemande;