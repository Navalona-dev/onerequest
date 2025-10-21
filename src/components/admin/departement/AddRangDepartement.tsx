import React, { useEffect, useState } from "react";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import api from "../../../service/Api";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import { AxiosError } from "axios";

type Site = {
    id: number;
    nom: string;
}

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

interface AddRangProps {
    setShowModalAddRangDep: React.Dispatch<React.SetStateAction<boolean>>;
    depId: number;

}

const AddRangDepartement: React.FC<AddRangProps> = ({ setShowModalAddRangDep, depId }) => {
    const [formData, setFormData] = useState({
        rang: "",
        type: "",
    });

    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();
    const {codeCouleur} = useGlobalActiveCodeCouleur();
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;
    const [site, setSite] = useState<Site | null>(null);
    const [typeDemande, setListeTypeDemande] = useState<TypeDemande[]>([]);
    const [demandesDejaLiees, setDemandesDejaLiees] = useState<string[]>([]);

    const fieldLabels: { [key: string]: string } = {
        rang: t("ordre"),
        type: t("typeDemande")
      };

      useEffect(() => {
        api.get('/api/sites/current')
        .then((response) => {
            setSite(response.data);
        })
        .catch((error) => console.log("Erreur API", error));
      }, []);

      useEffect(() => {
        if (!site) return;
        
        api.get(`/api/sites/${site?.id}/type-demandes`)
        .then((response) => {
          console.log(response.data);
            setListeTypeDemande(response.data)
        } )
        .catch((error) => console.log("Erreur API", error));
    }, [site]);

    useEffect(() => {
      if (!depId || !site) return;
      api.get(`/api/departement_rangs/departement/${depId}/site/${site?.id}/rangs`)
        .then((response) => {
          const rangs: any[] = response.data; // tableau de rangs
          // on récupère tous les typeDemande déjà liés
          const demandesLiees: string[] = rangs
            .filter(rang => rang.typeDemande)
            .map(rang => `/api/type_demandes/${rang.typeDemande.id}`);
          setDemandesDejaLiees(demandesLiees);
        })
        .catch((error) => console.log("Erreur récupération types déjà liés", error));
    }, [depId, site]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      ) => {
        const { name, value } = e.target;
      
        setFormData((prev) => ({
          ...prev,
          [name]: name === "rang" ? parseInt(value, 10) : value,
        }));
      };
      

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = {
            rang: parseInt(formData.rang, 10),
            site: `/api/sites/${site?.id}`,
            departement: `/api/departements/${depId}`,
            typeDemande: formData.type
          };
          
    
        try {
          await api.post(`/api/departement_rangs`, payload);
    
          Swal.fire({
            icon: "success",
            title: langueActive?.indice === "fr" ? "Bon travail!" : 
            langueActive?.indice === "en" ? "Good job !" : "",
            text: langueActive?.indice === "fr" ? "Rang ajouté avec succès !" : 
            langueActive?.indice === "en" ? "Order added successfully!" : "",
            confirmButtonColor: "#7c3aed", // violet
            cancelButtonColor: "#ef4444", // rouge
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: langueActive?.indice === "en" ? "Cancel" : langueActive?.indice === "fr" ? "Annuler" : "",
            background: "#1c2d55",
            color: "#fff",
          }).then(() => {
            setShowModalAddRangDep(false);
            window.location.reload();
          });
          
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
          
            let errorMessage = langueActive?.indice === "fr" ? "Erreur lors de l'ajout de rang." : 
            langueActive?.indice === "en" ? "Error while adding order." : "";
          
            if (error.response) {
              // Si une réponse est retournée par le backend
              const status = error.response.status;
              const backendMessage = error.response.data?.message;
          
              // Si le backend renvoie un message clair, on l’affiche
              if (backendMessage) {
                errorMessage = backendMessage;
              } else if (status == 400) {
                errorMessage = langueActive?.indice === "fr" ? "Un rang departement pour ce type de demande et ce site existe déjà." : 
                langueActive?.indice === "en" ? "An order of department with this site and request type already exists." : "";
              }
              else if (status === 404) {
                errorMessage = langueActive?.indice === "fr" ? "Rang introuvable." : 
                langueActive?.indice === "en" ? "Order not found" : "";
              } else if (status === 401) {
                errorMessage = langueActive?.indice === "fr" ? "Non autorisé. Veuillez vous reconnecter." : 
                langueActive?.indice === "en" ? "Unauthorized. Please log in again." : "";
              } else if (status === 500) {
                errorMessage = langueActive?.indice === "fr" ? "Erreur serveur. Réessayez plus tard." : 
                langueActive?.indice === "en" ? "Server error. Please try again later." : "";
              }
              // Tu peux rajouter d'autres cas ici si besoin
            } else {
              // Pas de réponse du serveur (ex: problème de réseau)
            }
          
            await Swal.fire({
              icon: "error",
              title: langueActive?.indice === "fr" ? "Erreur" : langueActive?.indice === "en" ? "Error" : "",
              text: errorMessage,
              confirmButtonColor: "#ef4444",
              background: "#1c2d55",
              color: "#fff",
            });
          
        }
      };

    return(
        <>
        <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50">
                <div className="bg-[#111C44] border rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down"
                style={{
                    borderColor: codeCouleur?.btnColor
                }}
                >
                    <h2 className="text-xl font-bold mb-4 text-white">{t("addRang")}</h2>
            
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {Object.keys(formData).map((field) =>
                            <div key={field}>
                                <label className="block text-gray-400 mb-1">
                                    {fieldLabels[field] || field} 
                                    <sup className="text-red-500">*</sup>
                                   
                                </label>
                                {field === "rang" ? (
                                    <input
                                        type="number"
                                        name={field}
                                        value={formData[field as keyof typeof formData]}
                                        onChange={handleChange}
                                        className={`w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent`}
                                        required
                                        autoComplete="off"
                                    />
                                ) : (
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                                        required
                                    >
                                        <option value="" disabled>{t("selecttypedemande")}</option>
                                        {typeDemande
                                          .filter((item) => !demandesDejaLiees.includes(`/api/type_demandes/${item.id}`))
                                          .map((item) => (
                                            <option key={item.id} value={`/api/type_demandes/${item.id}`} className="mt-3">
                                              {langueActive?.indice === "fr" ? item.nom : langueActive?.indice === "en" ? item.nomEn : ""}
                                            </option>
                                          ))}
                                    </select>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                            type="submit"
                            className="text-white px-4 py-2 rounded"
                            >
                            {langueActive?.indice === "fr" ? save.fr.upperText : langueActive?.indice === "en" ? save.en.upperText : ""}
                            </button>
                        </div>
                    </form>
            
                    <button
                        onClick={() => setShowModalAddRangDep(false)}
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-lg py-1 px-2 rounded"
                        aria-label="Close modal"
                        >
                        <i className="bi bi-x-circle-fill text-white"></i>
                    </button>
                </div>
            </div>
        </>
    )
}

export default AddRangDepartement;