import React, { useEffect, useState } from "react";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";
import api from "../../../service/Api";
import Pagination from "../Pagination";
import { store } from "../../../store";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";

type Privilege = {
    id: number;
    title: string;
    libelleFr: string;
    libelleEn: string;
    description: string;
}

const PrivilegeComponent = () => {
    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();
    const [privileges, setListePrivilege] = useState<Privilege[]>([]);
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    const [searchTitle, setSearchTitle] = useState("");
    const [searchLibelleFr, setSearchLibelleFr] = useState("");
    const [searchLibelleEn, setSearchLibelleEn] = useState("");
    const {codeCouleur} = useGlobalActiveCodeCouleur();

    useEffect(() => {
        api.get('/api/privileges')
        .then((response) => {
            setListePrivilege(response.data)
        })
        .catch((error) => console.log("Erreur API", error))
    }, []);

    const filteredUsers = privileges.filter(priv => {
        const nomMatch = !searchTitle || priv.title.toLowerCase().includes(searchTitle.toLowerCase());
        const prenomMatch = !searchLibelleFr || priv.libelleFr.toLowerCase().includes(searchLibelleFr.toLowerCase());
        const emailMatch = !searchLibelleEn || priv.libelleEn.toLowerCase().includes(searchLibelleEn.toLowerCase());
    
        return nomMatch && prenomMatch && emailMatch;
    });

     //const dataToPaginate = filteredUsers.length > 0 ? filteredUsers : users;
     const dataToPaginate = filteredUsers;

     const totalPages = Math.max(1, Math.ceil(dataToPaginate.length / usersPerPage));
     
     const indexOfLastUser = currentPage * usersPerPage;
     const indexOfFirstUser = indexOfLastUser - usersPerPage;
     
     const currentprivileges = dataToPaginate.slice(indexOfFirstUser, indexOfLastUser);

     useEffect(() => {
        if (currentPage > totalPages) {
          setCurrentPage(1);
        }
      }, [currentPage, totalPages]);

    return(
        <>
            <div className="h-[69vh] overflow-y-auto my-3">
                <div className="color-header px-4 flex justify-between items-center mb-3">
                    <h4 className="font-bold text-white">{t("privilegeListe")}</h4>
                        <button
                        className="px-5 py-2 text-white rounded"
                        >
                        {langueActive?.indice === "fr" ? create.fr.upperText : langueActive?.indice === "en" ? create.en.upperText : ""}
                    </button>
                    
                </div>
                <div className="card my-6 px-5 mx-8 border border-gray-700 py-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="w-full">
                            <input type="text" name="" id="" 
                            placeholder={`${t("title")}...`}
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                            className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                    focus:outline-none focus:ring-0 focus:border-transparent"
                            />
                        </div>
                        <div className="w-full">
                            <input type="text" name="" id="" 
                            placeholder={`${t("libelleFr")}...`}
                            value={searchLibelleFr}
                            onChange={(e) => setSearchLibelleFr(e.target.value)}
                            className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                    focus:outline-none focus:ring-0 focus:border-transparent"
                            />
                        </div>
                        <div className="w-full">
                            <input type="text" name="" id="" 
                            placeholder={`${t("libelleEn")}...`}
                            value={searchLibelleEn}
                            onChange={(e) => setSearchLibelleEn(e.target.value)}
                            className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                    focus:outline-none focus:ring-0 focus:border-transparent"
                            />
                        </div>
                    
                    </div>
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
                                        {t("title")}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        {t("libelleFr")}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        {t("libelleEn")}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        Description
                                    </th>
                                
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {currentprivileges.length > 0 ? (
                                    currentprivileges.map((item, index) => (
                                        <tr key={item.id} className={`${index % 2 === 0 ? "" : "bg-[#1c2d55]"} text-nowrap`}>
                                            <th className="px-6 py-4">
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
                                            <td className="px-6 py-4">
                                                {item.title} 
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.libelleFr}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.libelleEn}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.description}
                                            </td>
                                            

                                        </tr>
                                    ))
                                ) : (
                                    <tr className="bg-[#1c2d55] text-center">
                                        <td colSpan={5} className="px-6 py-4">Aucun enregistrement trouvé</td>
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

export default PrivilegeComponent;