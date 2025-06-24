import React, { useEffect, useState } from "react";
import api from "../../../service/Api";
import { store } from "../../../store";
import Pagination from "../Pagination";

type TypeDemande = {
    id: number;
    nom: string;
    description: string;
    isActive: boolean;
}

const TypeDemandeComponent = () => {
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;
    const [typeDemandes, setListeTypeDemande] = useState<TypeDemande[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const typesPerPage = 5;

    useEffect(() => {
        api.get('/api/type_demandes')
        .then((response) => {
            setListeTypeDemande(response.data)
        } )
        .catch((error) => console.log("Erreur API", error));
    })


      const totalPages = Math.max(1, Math.ceil(typeDemandes.length / typesPerPage));
      
      const indexOfLastTypeDemande = currentPage * typesPerPage;
      const indexOfFirstTypeDemande = indexOfLastTypeDemande - typesPerPage;
      
      const currentTypeDemandes = typeDemandes.slice(indexOfFirstTypeDemande, indexOfLastTypeDemande);

    useEffect(() => {
        if (currentPage > totalPages) {
          setCurrentPage(1);
        }
      }, [currentPage, totalPages]);

    return(
        <>
             <div className="h-[69vh] overflow-y-auto overflow-x-auto px-3 py-4">
                <div className="color-header px-4 flex justify-between items-center mb-3">
                    <h4 className="font-bold text-white">Liste type de demande</h4>
                    <button
                        className="bg-red-500 px-5 py-2 text-white rounded"
                        >
                        {create.upperText}
                    </button>
                    
                </div>
                <div className="w-[38vh] md:w-full sm:w-[38vh] h-[55vh] overflow-auto">
                    <table className="w-full border border-gray-700 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-[#1c2d55]">
                            <tr className="text-nowrap border-b-2 border-gray-700 ...">
                                <th scope="col" className="px-6 py-3 text-white">
                                    Actions
                                </th>
                                <th scope="col" className="px-6 py-3 text-white">
                                    Nom
                                </th>
                                <th scope="col" className="px-6 py-3 text-white">
                                    Description
                                </th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {currentTypeDemandes.length > 0 ? (
                                currentTypeDemandes.map((item, index) => (
                                    <tr key={item.id} className={`${index % 2 === 0 ? "" : "bg-[#1c2d55]"} `}>
                                        <th className="px-6 py-4">
                                            <>
                                                <a href="#"
                                                    title={edit.upperText}><i className="bi bi-pencil-square bg-blue-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                                                </a>
                                                <a href="#"
                                                    title={deleteAction.upperText}><i className="bi bi-trash-fill bg-red-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                                                </a>
                                            </>
                                        
                                        </th>
                                        <td className="px-6 py-4">
                                            {item.nom} 
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
        </>
    )
}

export default TypeDemandeComponent;