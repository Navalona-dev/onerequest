import React, { useState } from "react";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import api from "../../../service/Api";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import { AxiosError } from "axios";

interface AddDepartementProps {
    setShowModalAdd: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormDepartementData {
    nom: string;
    nomEn: string;
    description: string;
    descriptionEn: string;
}
  
  
  const AddDepartement: React.FC<AddDepartementProps> = ({ setShowModalAdd }) => {
    const [formData, setFormData] = useState<FormDepartementData>({
        nom: "",
        nomEn: "",
        description: "",
        descriptionEn: "",
    });

    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();
    const {codeCouleur} = useGlobalActiveCodeCouleur();
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;

    const fieldLabels: { [key: string]: string } = {
        nom: t("nomFr"),
        nomEn: t("nomEn"),
        ordre: t("ordre"),
        description: t("descriptionFr"),
        descriptionEn: t("descriptionEn"),
      };

      const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        const { name, value } = e.target;
      
        setFormData((prev) => ({
          ...prev,
          [name]: name === "ordre" ? parseInt(value, 10) : value,
        }));
      };
      

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = {};

        payload.nom = formData.nom;
        payload.description = formData.description;
        payload.descriptionEn = formData.descriptionEn;
        payload.nomEn = formData.nomEn;
    
        try {
          await api.post("/api/departements", payload);
    
          Swal.fire({
            icon: "success",
            title: langueActive?.indice === "fr" ? "Bon travail!" : 
            langueActive?.indice === "en" ? "Good job !" : "",
            text: langueActive?.indice === "fr" ? "Departement ajouté avec succès !" : 
            langueActive?.indice === "en" ? "Department added successfully!" : "",
            confirmButtonColor: "#7c3aed", // violet
            cancelButtonColor: "#ef4444", // rouge
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: langueActive?.indice === "en" ? "Cancel" : langueActive?.indice === "fr" ? "Annuler" : "",
            background: "#1c2d55",
            color: "#fff",
          }).then(() => {
            setShowModalAdd(false);
            window.location.reload();
          });
          
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
          
            let errorMessage = langueActive?.indice === "fr" ? "Erreur lors de l'ajout de departement." : 
            langueActive?.indice === "en" ? "Error while adding department." : "";
          
            if (error.response) {
              // Si une réponse est retournée par le backend
              const status = error.response.status;
              const backendMessage = error.response.data?.message;
          
              // Si le backend renvoie un message clair, on l’affiche
              if (backendMessage) {
                errorMessage = backendMessage;
              } else if (status == 400 || status == 422) {
                errorMessage = langueActive?.indice === "fr" ? "Un departement avec cet ordre existe déjà." : 
                langueActive?.indice === "en" ? "An department with this order already exists." : "";
              }
              else if (status === 404) {
                errorMessage = langueActive?.indice === "fr" ? "Departement introuvable." : 
                langueActive?.indice === "en" ? "Department not found" : "";
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
                    <h2 className="text-xl font-bold mb-4 text-white">{t("addDepartement")}</h2>
            
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {Object.keys(formData).map((field) =>
                            <div key={field}>
                                <label className="block text-gray-400 mb-1">
                                    {fieldLabels[field] || field} 
                                    {(field === "nom" || field === "description" || field === "ordre") ? (
                                        <sup className="text-red-500">*</sup>
                                    ) : (
                                        <sup></sup>
                                    )}
                                </label>
                            {field === "description" || field === "descriptionEn" ? (
                                <textarea
                                name={field}
                                value={formData[field as keyof typeof formData]}
                                onChange={handleChange}
                                className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                                rows={4}
                                />
                            ) : (
                                <input
                                    type="text"
                                    name={field}
                                    value={formData[field as keyof typeof formData]}
                                    onChange={handleChange}
                                    className={`w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent`}
                                    required
                                    autoComplete="off"
                                />
                            ) }
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
                        onClick={() => setShowModalAdd(false)}
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

export default AddDepartement;