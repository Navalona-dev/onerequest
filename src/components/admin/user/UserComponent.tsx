import React, {useState, useEffect} from "react";
import api from "../../../service/Api";
import { store } from "../../../store";
import AddUser from "./AddUser";

interface Privilege {
    id: number;
    title: string;
    description?: string;
    // autres propriétés si besoin
  }

export interface User {
    id: number;
    nom: string;
    email: string;
    prenom: string;
    site: { id: number; nom: string } | null; 
    privileges: Privilege[];

  }

const UserComponent = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [showModal, setShowModal] = useState(false);
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;

    useEffect(() => {
        api.get('/api/users')
          .then((response) => {
            console.log("Données reçues:", response.data); 
            setUsers(response.data);
          })
          .catch((error) => console.error("Erreur API:", error));
      }, []);

    return(
        <>
         <div className="color-header p-4 flex justify-between items-center mb-5">
            <h4 className="font-bold text-white">Liste utilisateur</h4>
            <button
                onClick={() => setShowModal(true)}
                className="bg-red-500 px-5 py-2 text-white rounded"
                >
                {create.upperText}
            </button>
        </div>
        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-[#1c2d55]">
                    <tr className="">
                        <th scope="col" className="px-6 py-3 text-white">
                            Actions
                        </th>
                        <th scope="col" className="px-6 py-3 text-white">
                            Nom
                        </th>
                        <th scope="col" className="px-6 py-3 text-white">
                            Prénom
                        </th>
                        <th scope="col" className="px-6 py-3 text-white">
                            Adresse e-mail
                        </th>
                        <th scope="col" className="px-6 py-3 text-white">
                            Site
                        </th>
                        <th scope="col" className="px-6 py-3 text-white">
                            Privilèges
                        </th>
                        
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((item) => (
                            <tr className="bg-[#1c2d55]">
                                <th className="px-6 py-4">
                                    <a href="#" title={edit.upperText}><i className="bi bi-pencil-square bg-blue-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i></a>
                                    <a href="#" title={deleteAction.upperText}><i className="bi bi-trash-fill bg-red-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i></a>
                                </th>
                                <td className="px-6 py-4">
                                    {item.nom}
                                </td>
                                <td className="px-6 py-4">
                                    {item.prenom}
                                </td>
                                <td className="px-6 py-4">
                                    {item.email}
                                </td>
                                <td className="px-6 py-4">
                                    {item.site ? (item.site.nom) : null}
                                </td>
                                <td className="px-6 py-4">
                                    {item.privileges.length > 0 ? (
                                        item.privileges.map((priv, index) => (
                                        <span key={index}>
                                            <i className="bi bi-circle-fill icon-priv"></i>{priv.title} <br />
                                        </span>
                                        ))
                                    ) : null}
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
        {/* Modal */}
        {showModal && <AddUser setShowModal={setShowModal} />}
        </>
    )
}

export default UserComponent;