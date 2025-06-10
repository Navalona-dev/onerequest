import React, {useState, useEffect} from "react";
import api from "../../../service/Api";
import { store } from "../../../store";
import AddUser from "./AddUser";
import UpdateUser from "./UpdateUser";
import deleteUser from "../../../service/DeleteUser";

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
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;
    const [nombre, setNombre] = useState<number>(0); 
    const [selectedUser, setSelectedUser] = useState<User | null>(null);


    function isPair(n: number): boolean {
        return n % 2 === 0;
    }

    useEffect(() => {
        api.get('/api/users')
          .then((response) => {
            console.log("Données reçues:", response.data); 
            setUsers(response.data);
          })
          .catch((error) => console.error("Erreur API:", error));
      }, []);

    return(
         <div className="h-[69vh]">
            <div className="color-header p-4 flex justify-between items-center mb-5">
                <h4 className="font-bold text-white">Liste utilisateur</h4>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-red-500 px-5 py-2 text-white rounded"
                    >
                    {create.upperText}
                </button>
            </div>
            <div className="relative overflow-x-auto h-[56vh] overflow-y-auto">
                <table className="w-full border border-gray-700 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-[#1c2d55]">
                        <tr className="border-b-2 border-gray-700 ...">
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
                                <tr className={`${isPair(nombre + item.id) ? "bg-[#1c2d55]" : ""}`}>
                                    <th className="px-6 py-4">
                                        <a href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedUser(item);
                                            setShowModalUpdate(true);
                                        }}
                                        title={edit.upperText}><i className="bi bi-pencil-square bg-blue-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i></a>
                                        <a href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            deleteUser(item.id, setShowModal);
                                          }}
                                        title={deleteAction.upperText}><i className="bi bi-trash-fill bg-red-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i></a>
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
                                <td colSpan={6} className="px-6 py-4">Aucun enregistrement trouvé</td>
                            </tr>
                        )}
                        
                    
                    </tbody>
                </table>
            </div>
            {/* Modal */}
            {showModal && <AddUser setShowModal={setShowModal} />}
            {showModalUpdate && selectedUser && (
                <UpdateUser
                    setShowModalUpdate={setShowModalUpdate}
                    userId={selectedUser.id} // ✅
                    initialData={{
                        nom: selectedUser.nom,
                        prenom: selectedUser.prenom,
                        email: selectedUser.email,
                        site: selectedUser.site ?? null,
                        privileges: selectedUser.privileges
                    }}
                    />
            )}
         </div>
    )
}

export default UserComponent;