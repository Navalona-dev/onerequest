import React, {useState} from "react";
import { AxiosError } from "axios";
import api from "../../../service/Api";
import Swal from "sweetalert2";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

interface AddDomaineEntrepriseProps {
    setShowModalAdd: React.Dispatch<React.SetStateAction<boolean>>;
    idCategorie: number
  }
  
  const AddDomaineEntreprise: React.FC<AddDomaineEntrepriseProps> = ({ setShowModalAdd, idCategorie }) => {
      const [formData, setFormData] = useState({
          libelle: "",
          description: "",
          categorieDomaineEntreprise: `/api/categorie_domaine_entreprises/${idCategorie}`
      });

      const {langueActive} = useLangueActive();
      const { t, i18n } = useTranslation();

      const fieldLabels: { [key: string]: string } = {
        libelle: "Libellé",
        description: "Description",
      };

      const {codeCouleur} = useGlobalActiveCodeCouleur();
      const state = store.getState();
      const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;

      const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
      
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
          const response = await api.post("/api/domaine_entreprises", formData);
          console.log("Réponse API:", response.data);
    
          Swal.fire({
            icon: "success",
            title: langueActive?.indice === "fr" ? "Bon travail!" : 
            langueActive?.indice === "en" ? "Good job !" : "",
            text: langueActive?.indice === "fr" ? "Domaine entreprise ajoutée avec succès !" : 
            langueActive?.indice === "en" ? "Business domain added successfully!" : "",
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
          
            let errorMessage = langueActive?.indice === "fr" ? "Erreur lors de l'ajout de domaine entreprise" : 
            langueActive?.indice === "en" ? "Error while adding business domain." : "";
          
            if (error.response) {
              // Si une réponse est retournée par le backend
              const status = error.response.status;
              const backendMessage = error.response.data?.message;
          
              // Si le backend renvoie un message clair, on l’affiche
              if (backendMessage) {
                errorMessage = backendMessage;
              } else if (status == 400) {
               
              }
              else if (status === 404) {
                errorMessage = langueActive?.indice === "fr" ? "Domaine introuvable." : 
                langueActive?.indice === "en" ? "Domain not found." : "";
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
            <h2 className="text-xl font-bold mb-4 text-white">Créer une nouvelle catégorie</h2>
    
            <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((field) =>
                field === "categorieDomaineEntreprise" ? null : (
                    <div key={field}>
                    <label className="block text-gray-400 mb-1">
                        {fieldLabels[field] || field}
                        {(field === "prenom") ? (
                            <sup></sup>
                    ) : (
                        <sup className="text-red-500">*</sup>
                        
                    )}
                    </label>
                    {field === "description" ? (
                        <textarea
                        name={field}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleChange}
                        className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                        required
                        rows={4}
                    />
                    ) : (
                        <input
                            type="text"
                            name={field}
                            value={formData[field as keyof typeof formData]}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white focus:outline-none focus:ring-0 focus:border-transparent"
                            autoComplete="off"
                            required={field === "nom" || field === "email"}
                        />
                    )}
                    </div>
                )
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

export default AddDomaineEntreprise;