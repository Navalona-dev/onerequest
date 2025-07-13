import React, {useState, useEffect} from "react";
import api from "../../../service/Api";
import { store } from "../../../store";
import AddUser from "./AddUser";
import UpdateUser from "./UpdateUser";
import deleteUser from "../../../service/admin/DeleteUser";
import UserAdminConnected from "../../../hooks/UserAdminConnected";
import Pagination from "../Pagination";
import bgImage from '../../../assets/images/bg-site.png';
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

type Privilege = {
    id: number;
    title: string;
  };
  
  type Site = {
    id: number;
    nom: string;
  };
  
  type UserType = {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    privileges: Privilege[];
    site: Site;
    message: string;
    isSuperAdmin: boolean;
  };
  

const UserComponent = () => {

    const [users, setUsers] = useState<UserType[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;
   
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

    const user = UserAdminConnected() as UserType | null;

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    //Search
    const [searchNom, setSearchNom] = useState("");
    const [searchPrenom, setSearchPrenom] = useState("");
    const [searchMail, setSearchMail] = useState("");
    const [searchSite, setSearchSite] = useState("");
    const [searchPrivilege, setSearchPrivilege] = useState("");

    const [currentSite, setCurrentSite] = useState<Site | null>(null);
    const {codeCouleur, loading} = useGlobalActiveCodeCouleur();

    useEffect(() => {
        api.get('/api/sites/current')
        .then((response) => {
            if (response.status === 204 || !response.data) {
            setCurrentSite(null);
            } else {
            setCurrentSite(response.data);
            }
        })
        .catch((error) => {
            console.error("Erreur API:", error); // Autres erreurs réseau ou 500
        });
    }, []);

    useEffect(() => {
        if (!user) return;
    
        // Attendre que currentSite soit bien défini (pour les super_admin)
        if (
            user.privileges.some(p => p.title === "super_admin") &&
            user.isSuperAdmin === true
        ) {
            if (!currentSite) return; // NE PAS faire la requête tant que le site n'est pas là
    
            api.get(`/api/sites/${currentSite.id}/users`)
                .then((response) => {
                    setUsers(response.data);
                })
                .catch((error) => console.error("Erreur API:", error));
        } else {
            // Cas normal : user lié à un site
            if (user.site) {
                api.get(`/api/sites/${user.site.id}/users`)
                    .then((response) => {
                        const result = Array.isArray(response.data) ? response.data : [response.data];
                        setUsers(result);
                    })
                    .catch((error) => console.error("Erreur API:", error));
            }
        }
    }, [user, currentSite]); // ✅ Ajoute currentSite ici aussi
    

    const filteredUsers = users.filter(user => {
        const nomMatch = !searchNom || user.nom.toLowerCase().includes(searchNom.toLowerCase());
        const prenomMatch = !searchPrenom || user.prenom.toLowerCase().includes(searchPrenom.toLowerCase());
        const emailMatch = !searchMail || user.email.toLowerCase().includes(searchMail.toLowerCase());
        const siteMatch = !searchSite || (user.site?.nom.toLowerCase().includes(searchSite.toLowerCase()) ?? false);
        const privilegeMatch = !searchPrivilege || (user.privileges?.some(p => 
          p.title.toLowerCase().includes(searchPrivilege.toLowerCase())
        ) ?? false);
    
        return nomMatch && prenomMatch && emailMatch && siteMatch && privilegeMatch;
    });
    
      //const dataToPaginate = filteredUsers.length > 0 ? filteredUsers : users;
      const dataToPaginate = filteredUsers;

      const totalPages = Math.max(1, Math.ceil(dataToPaginate.length / usersPerPage));
      
      const indexOfLastUser = currentPage * usersPerPage;
      const indexOfFirstUser = indexOfLastUser - usersPerPage;
      
      const currentUsers = dataToPaginate.slice(indexOfFirstUser, indexOfLastUser);

      const {langueActive} = useLangueActive();
      const { t, i18n } = useTranslation();

      useEffect(() => {
        if (currentPage > totalPages) {
          setCurrentPage(1);
        }
      }, [currentPage, totalPages]);
      
  

    return(
        <>
        <div className="h-[69vh] overflow-y-auto">
            <div className="color-header px-4 flex justify-between items-center mb-3">
                <h4 className="font-bold text-white">Liste utilisateur</h4>
                {user && user.privileges && user.privileges.some(p => p.title === "super_admin" || p.title === "admin_site") ? (
                    <button
                    onClick={() => setShowModal(true)}
                    className="px-5 py-2 text-white rounded"
                    >
                    {langueActive?.indice === "fr" ? create.fr.upperText : langueActive?.indice === "en" ? create.en.upperText : ""}
                </button>
                ) : null}
                
            </div>
            <div className="card my-6 px-5 mx-4 border border-gray-700 py-5">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="w-full">
                        <input type="text" name="" id="" 
                        placeholder={`${t("nom")}...`}
                        value={searchNom}
                        onChange={(e) => setSearchNom(e.target.value)}
                        className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                focus:outline-none focus:ring-0 focus:border-transparent"
                        />
                    </div>
                    <div className="w-full">
                        <input type="text" name="" id="" 
                        placeholder={`${t("mail")}...`}
                        value={searchMail}
                        onChange={(e) => setSearchMail(e.target.value)}
                        className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                focus:outline-none focus:ring-0 focus:border-transparent"
                        />
                    </div>
                    <div className="w-full">
                        <input type="text" name="" id="" 
                        placeholder="Site..."
                        value={searchSite}
                        onChange={(e) => setSearchSite(e.target.value)}
                        className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                focus:outline-none focus:ring-0 focus:border-transparent"
                        />
                    </div>
                    <div className="w-full">
                        <input type="text" name="" id="" 
                        placeholder={`${t("prenom")}...`}
                        value={searchPrenom}
                        onChange={(e) => setSearchPrenom(e.target.value)}
                        className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                focus:outline-none focus:ring-0 focus:border-transparent"
                        />
                    </div>
                    <div className="w-full">
                        <input type="text" name="" id="" 
                        placeholder={`${t("privilege")}`}
                        value={searchPrivilege}
                        onChange={(e) => setSearchPrivilege(e.target.value)}
                        className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                focus:outline-none focus:ring-0 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>
            <div className="mx-1">
                <div className="w-[38vh] md:w-full sm:w-[38vh] h-[55vh] overflow-auto">
                    <table className="w-full border border-gray-700 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-[#1c2d55]">
                            <tr className="text-nowrap border-b-2 border-gray-700 ...">
                                <th scope="col" className="px-6 py-3 text-white">
                                    Actions
                                </th>
                                <th scope="col" className="px-6 py-3 text-white">
                                    {t("nom")}
                                </th>
                                <th scope="col" className="px-6 py-3 text-white">
                                    {t("prenom")}
                                </th>
                                <th scope="col" className="px-6 py-3 text-white">
                                    {t("mail")}
                                </th>
                                <th scope="col" className="px-6 py-3 text-white">
                                    Site
                                </th>
                                <th scope="col" className="px-6 py-3 text-white">
                                    {t("privilege")}
                                </th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.length > 0 ? (
                                currentUsers.map((item, index) => (
                                    <tr key={item.id} className={`${index % 2 === 0 ? "" : "bg-[#1c2d55]"} text-nowrap`}>
                                        <th className="px-6 py-4">
                                        {user && user.privileges && user.privileges.some(p => p.title === "super_admin" || p.title === "admin_site") ? (
                                            <>
                                                <a href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedUser(item);
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
                                                            deleteUser(item.id, langueActive.indice as "fr" | "en", setShowModal);
                                                        }
                                                      }}
                                                    title={langueActive?.indice === "fr" ? deleteAction.fr.upperText : langueActive?.indice === "en" ? deleteAction.en.upperText : ""}><i className="bi bi-trash-fill bg-red-500 px-2 py-1.5 text-white rounded-3xl mr-3"></i>
                                                </a>
                                            </>
                                        ) : null}
                                        
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
            </div>
            <div className="mx-4 ">
                <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
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
                    privileges: selectedUser.privileges,
                }}
                />
        )}
        </>
        
    )
}

export default UserComponent;