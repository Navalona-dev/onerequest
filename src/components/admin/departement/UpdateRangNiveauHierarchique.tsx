import React, { useState } from "react";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import api from "../../../service/Api";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import { AxiosError } from "axios";

interface UpdateRangProps {
    setShowModalUpdateRang: React.Dispatch<React.SetStateAction<boolean>>;
    idRang: number;
    niveauId: number;
    depId: number;
    initialData: {
      rang: number;
    }

}

const UpdateRangNiveauHierarchique: React.FC<UpdateRangProps> = ({ setShowModalUpdateRang, idRang, niveauId, depId, initialData }) => {
    const [formData, setFormData] = useState({
        rang: initialData.rang,
    });

    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();
    const {codeCouleur} = useGlobalActiveCodeCouleur();
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;


    const fieldLabels: { [key: string]: string } = {
        rang: t("ordre"),
      };

      const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
            rang: formData.rang,
          };
          
    
        try {
          await api.patch(`/api/niveau_hierarchique_rangs/${idRang}`, payload, 
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
            text: langueActive?.indice === "fr" ? "Rang modifié avec succès !" : 
            langueActive?.indice === "en" ? "Order updated successfully!" : "",
            confirmButtonColor: "#7c3aed", // violet
            cancelButtonColor: "#ef4444", // rouge
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: langueActive?.indice === "en" ? "Cancel" : langueActive?.indice === "fr" ? "Annuler" : "",
            background: "#1c2d55",
            color: "#fff",
          }).then(() => {
            setShowModalUpdateRang(false);
            window.location.reload();
          });
          
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
          
            let errorMessage = langueActive?.indice === "fr" ? "Erreur lors de la mise à jour de rang." : 
            langueActive?.indice === "en" ? "Error while updating order." : "";
          
            if (error.response) {
              // Si une réponse est retournée par le backend
              const status = error.response.status;
              const backendMessage = error.response.data?.message;
          
              // Si le backend renvoie un message clair, on l’affiche
              if (backendMessage) {
                errorMessage = backendMessage;
              } else if (status == 400 || status == 422) {
                errorMessage = langueActive?.indice === "fr" ? "Un rang niveau hierarchique pour ce departement existe déjà." : 
                langueActive?.indice === "en" ? "An order of hierarchy level with this department already exists." : "";
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
                                <input
                                    type="number"
                                    name={field}
                                    value={formData[field as keyof typeof formData]}
                                    onChange={handleChange}
                                    className={`w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent`}
                                    required
                                    autoComplete="off"
                                />
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                            type="submit"
                            className="text-white px-4 py-2 rounded"
                            >
                            {langueActive?.indice === "fr" ? edit.fr.upperText : langueActive?.indice === "en" ? edit.en.upperText : ""}
                            </button>
                        </div>
                    </form>
            
                    <button
                        onClick={() => setShowModalUpdateRang(false)}
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

export default UpdateRangNiveauHierarchique;