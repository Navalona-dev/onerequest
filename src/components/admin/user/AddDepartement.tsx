import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import api from "../../../service/Api";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useLangueActive } from "../../../hooks/useLangueActive";

type Departement = {
  id: number;
  nom: string;
  nomEn: string;
}

type Site = {
  id: number;
  nom: string;
}

type Niveau = {
  id: number;
  nom: string;
  nomEn: string;
}

type Privilege = {
    id: number;
    title: string;
    libelleFr: string;
    libelleEn: string;
  }

interface AddDepProps {
    setShowModalAddDep: React.Dispatch<React.SetStateAction<boolean>>;
    userId: number;
    initialData: {
      departement: Niveau | null;
    };
  }


const AddDepartement: React.FC<AddDepProps> = ({ setShowModalAddDep, userId, initialData }) => {
  const { t, i18n } = useTranslation();
    
  const [formData, setFormData] = useState({
        departement: initialData.departement 
        ? `/api/departements/${initialData.departement.id}` 
        : "",
    });

    const {langueActive} = useLangueActive();

    const fieldLabels: { [key: string]: string } = {
        departement: t("departement")
      };

      const {codeCouleur} = useGlobalActiveCodeCouleur();
      const state = store.getState();
      const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;
      const [niveaus, setListeDepartement] = useState<Niveau[]>([]);
      const [isPrivilege, setIsPrivilege] = useState(false);
      const [privilege, setPrivilege] = useState<Privilege|null>(null);
      const [site, setSite] = useState<Site | null>(null);

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, multiple } = e.target;
      
        if (multiple) {
          const target = e.target as HTMLSelectElement;
          const values = Array.from(target.selectedOptions, option => option.value);
          setFormData(prev => ({ ...prev, [name]: values }));
        } else {
          setFormData(prev => ({ ...prev, [name]: value }));
      
        }
        
      };

      useEffect(() => {
        api.get('/api/sites/current')
        .then((response) => {
            setSite(response.data)
        })
        .catch((error) => console.log("Erreur API", error));

        if (!site?.id) return;
        api.get(`/api/sites/${site?.id}/departements`)
        .then((response) => {
            setListeDepartement(response.data)
        })
        .catch((error) => console.log("Erreur API", error));
        
    }, [site?.id]);
      
      
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
          const response = await api.patch(
            `/api/users/${userId}`,
            formData,
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
            text: langueActive?.indice === "fr" ? `Departement associé avec succès !` : 
            langueActive?.indice === "en" ? `Department associated successfully ` : "",
            confirmButtonColor: "#7c3aed", // violet
            cancelButtonColor: "#ef4444", // rouge
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: langueActive?.indice === "en" ? "Cancel" : langueActive?.indice === "fr" ? "Annuler" : "",
            background: "#1c2d55",
            color: "#fff",
          }).then(() => {
            setShowModalAddDep(false);
            window.location.reload();
          });
          
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
          
            let errorMessage = langueActive?.indice === "fr" ? "Erreur lors de l'association de département." : 
            langueActive?.indice === "en" ? "Error while associating department." : "";
          
            if (error.response) {
              // Si une réponse est retournée par le backend
              const status = error.response.status;
              const backendMessage = error.response.data?.message;
          
              // Si le backend renvoie un message clair, on l’affiche
              if (backendMessage) {
                errorMessage = backendMessage;
              } else if (status === 404) {
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
              //errorMessage = "Un compte avec cet email existe déjà.";
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

      return (
        <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50">
          <div className="bg-[#111C44] border rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down"
          style={{
            borderColor: codeCouleur?.btnColor
          }}
          >
            <h2 className="text-xl font-bold mb-4 text-white">{t("depAssociate")}</h2>
    
            <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((field) =>
                <div key={field}>
                      <label className="block text-gray-400 mb-1">
                          {fieldLabels[field] || field}
                          <sup className="text-red-500">*</sup>
                      </label>
                  
                      <select
                          id="departements"
                          name="departement"
                          value={formData.departement}
                          onChange={handleChange}
                          className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                          required
                      >
                          <option value="" >
                            {t("selectDepartement")}
                          </option>

                          {niveaus.map((dep) => (
                          <option key={dep.id} value={`/api/departements/${dep.id}`}>
                              {langueActive?.indice === "fr" ? dep.nom : langueActive?.indice === "en" ? dep.nomEn : ""}
                          </option>
                          ))}

                      </select>
                 
                    
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
              onClick={() => setShowModalAddDep(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-lg py-1 px-2 rounded"
              aria-label="Close modal"
            >
              <i className="bi bi-x-circle-fill text-white"></i>
            </button>
          </div>
        </div>
      );
};

export default AddDepartement;
