import React, { useEffect, useState } from "react";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import api from "../../../service/Api";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import { AxiosError } from "axios";

type Departement = {
    id: number;
    nom: string;
    nomEn: string;
    description: string;
    descriptionEn: string;
}

interface UpdateDepartementProps {
    setShowModalUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    idNiveau: number;
    initialData: {
      nom: string;
      nomEn: string;
      description: string;
      descriptionEn: string;
    };
  }
  const UpdateNiveauHierarchique: React.FC<UpdateDepartementProps> = ({ setShowModalUpdate,idNiveau , initialData }) => {
    const [formData, setFormData] = useState({
        nom: initialData.nom,
        nomEn: initialData.nomEn,
        description: initialData.description,
        descriptionEn: initialData.descriptionEn
    });

    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();
    const {codeCouleur} = useGlobalActiveCodeCouleur();
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;

    const fieldLabels: { [key: string]: string } = {
        nom: t("nomFr"),
        nomEn: t("nomEn"),
        description: t("descriptionFr"),
        descriptionEn: t("descriptionEn")
      };

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
            nom: formData.nom,
            nomEn: formData.nomEn,
            description: formData.description,
            descriptionEn: formData.descriptionEn
          };
          
    
        try {
          await api.patch(`/api/niveau_hierarchiques/${idNiveau}`, payload,
            {
                headers: {
                  'Content-Type': 'application/merge-patch+json'
                }
              }
          );
    
          Swal.fire({
            icon: "success",
            title: langueActive?.indice === "fr" ? "Bon travail!" : 
            langueActive?.indice === "en" ? "Good job !" : "",
            text: langueActive?.indice === "fr" ? "Niveau hiérarchique modifié avec succès !" : 
            langueActive?.indice === "en" ? "Hierarchical level updated successfully!" : "",
            confirmButtonColor: "#7c3aed", // violet
            cancelButtonColor: "#ef4444", // rouge
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: langueActive?.indice === "en" ? "Cancel" : langueActive?.indice === "fr" ? "Annuler" : "",
            background: "#1c2d55",
            color: "#fff",
          }).then(() => {
            setShowModalUpdate(false);
            window.location.reload();
          });
          
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
          
            let errorMessage = langueActive?.indice === "fr" ? "Erreur lors de la mise à jour de niveau hierarchique." : 
            langueActive?.indice === "en" ? "Error while updating hierarchical level." : "";
          
            if (error.response) {
              // Si une réponse est retournée par le backend
              const status = error.response.status;
              const backendMessage = error.response.data?.message;
          
              // Si le backend renvoie un message clair, on l’affiche
              if (backendMessage) {
                errorMessage = backendMessage;
              } else if (status == 400 || status == 422) {
                //errorMessage = langueActive?.indice === "fr" ? "Un rang departement pour ce type de demande et ce site existe déjà." : 
                //langueActive?.indice === "en" ? "An order of department with this site and request type already exists." : "";
              }
              else if (status === 404) {
                errorMessage = langueActive?.indice === "fr" ? "Niveau hierarchique introuvable." : 
                langueActive?.indice === "en" ? "Hierarchical level not found" : "";
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
        <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50 h-[100vh]">
                <div className="bg-[#111C44] border rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down h-[95vh] overflow-y-auto"
                style={{
                    borderColor: codeCouleur?.btnColor
                }}
                >
                    <h2 className="text-xl font-bold mb-4 text-white">{t("updateniveautitle")}</h2>
            
                    <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="niveau_form">
                            {Object.keys(formData).map((field) =>
                                <div key={field}>
                                    <label className="block text-gray-400 mb-1">
                                        {fieldLabels[field] || field} 
                                        <sup className="text-red-500">*</sup>
                                    </label>
                                {field === "description" || field === "descriptionEn" ? (
                                    <textarea
                                    name={field}
                                    value={formData[field as keyof typeof formData]}
                                    onChange={handleChange}
                                    className="mb-3 w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                                    rows={4}
                                    required
                                    />
                                ) :  (
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData[field as keyof typeof formData]}
                                        onChange={handleChange}
                                        className={`mb-3 w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent`}
                                        required
                                        autoComplete="off"
                                    />
                                ) }
                                </div>
                            )}
                          </div>

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
                        onClick={() => setShowModalUpdate(false)}
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

export default UpdateNiveauHierarchique;