import React, { useEffect, useState } from "react";
import api from "../../../service/Api";
import { store } from "../../../store";
import Pagination from "../Pagination";
import AddTypeDemande from "./AddTypeDemande";
import UpdateTypeDemande from "./UpdateTypeDemande";
import deleteTypeDemande from "../../../service/DeleteTypeDemande";

type Domaine = {
    id: number;
    libelle: string;
}

type TypeDemande = {
    id: number;
    nom: string;
    domaine: Domaine;
    description: string;
    isActive: boolean;
}

const TypeDemandeComponent = () => {
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;
    const [typeDemandes, setListeTypeDemande] = useState<TypeDemande[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const typesPerPage = 5;
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [searchNom, setSearchNom] = useState("");
    const [searchDomaine, setSearchDomaine] = useState("");
    const [showModalUpdate, setShowModalUpdate] = useState(false);

    useEffect(() => {
        api.get('/api/type_demandes')
        .then((response) => {
            setListeTypeDemande(response.data)
        } )
        .catch((error) => console.log("Erreur API", error));
    }, []);


    const filteredTypes = typeDemandes.filter(type => {
        const nomMatch = !searchNom || type.nom.toLowerCase().includes(searchNom.toLowerCase());
        const domaineMatch = !searchDomaine || type.domaine.libelle.toLowerCase().includes(searchDomaine.toLowerCase());
    
        return nomMatch && domaineMatch;
    });
    
      const dataToPaginate = filteredTypes;

      const totalPages = Math.max(1, Math.ceil(dataToPaginate.length / typesPerPage));
      
      const indexOfLastType = currentPage * typesPerPage;
      const indexOfFirstType = indexOfLastType - typesPerPage;
      
      const currentTypeDemandes = dataToPaginate.slice(indexOfFirstType, indexOfLastType);
      const [selectedType, setSelectedType] = useState<TypeDemande | null>(null);

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
                    onClick={(e) => {
                        e.preventDefault();
                        setShowModalAdd(true);
                    }}
                        className="bg-red-500 px-5 py-2 text-white rounded"
                        >
                        {create.upperText}
                    </button>
                    
                </div>
                <div className="card my-6 px-5 mx-4 border border-gray-700 py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full">
                        <input type="text" name="" id="" 
                        placeholder="Nom..."
                        value={searchNom}
                        onChange={(e) => setSearchNom(e.target.value)}
                        className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                focus:outline-none focus:ring-0 focus:border-transparent"
                        />
                    </div>
                    <div className="w-full">
                        <input type="text" name="" id="" 
                        placeholder="Domaine..."
                        value={searchDomaine}
                        onChange={(e) => setSearchDomaine(e.target.value)}
                        className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                focus:outline-none focus:ring-0 focus:border-transparent"
                        />
                    </div>
                </div>
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
                                    Domaine
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
                                        <th className="px-6 py-4 text-nowrap">
                                            <>
                                                <a href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedType(item);
                                                    setShowModalUpdate(true);
                                                }}
                                                    title={edit.upperText}><i className="bi bi-pencil-square bg-blue-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                                                </a>
                                                <a href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        deleteTypeDemande(item.id);
                                                    }}
                                                    title={deleteAction.upperText}><i className="bi bi-trash-fill bg-red-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                                                </a>
                                            </>
                                        
                                        </th>
                                        <td className="px-6 py-4">
                                            {item.nom} 
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.domaine.libelle} 
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.description}
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr className="bg-[#1c2d55] text-center">
                                    <td colSpan={4} className="px-6 py-4">Aucun enregistrement trouvé</td>
                                </tr>
                            )}
                            
                        
                        </tbody>
                    </table>
                </div>
                <div className="mx-4 mt-5">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>

            {showModalAdd && <AddTypeDemande setShowModal={setShowModalAdd} /> }
            {showModalUpdate && selectedType
             &&  (<UpdateTypeDemande 
                setShowModalUpdate={setShowModalUpdate}
                typeId={Number(selectedType.id)}
                initialData={{
                    nom: selectedType.nom,
                    description: selectedType.description,
                    domaine: selectedType.domaine ?? null,
                }}
             /> 
             )}
        </>
    )
}

export default TypeDemandeComponent;