import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

import api from "../../../service/Api";
import { AxiosError } from "axios";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

interface AddRegionProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddRegion: React.FC<AddRegionProps> = ({ setShowModal }) => {
    const [formData, setFormData] = useState({
        nom: "",
        //sites: [] as string[]
    });

    const fieldLabels: { [key: string]: string } = {
        nom: "Nom",
        //sites: "Sites"
      };

      const [siteListe, setSiteListe] = useState<{ id: number; nom?: string; libelle?: string }[]>([]);
      const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
      const state = store.getState();
      const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;
      const {langueActive} = useLangueActive();
      const { t, i18n } = useTranslation();

      const listeSite = async () => {
        try {
          const response = await api.get("/api/sites");
          const sites = response.data;
          console.log(sites);

          return sites;
        } catch (error) {
          return 0;
        }
      };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, multiple } = e.target;
      
        if (multiple) {
          // Forcer TypeScript à comprendre que e.target est un HTMLSelectElement
          const target = e.target as HTMLSelectElement;
          const values = Array.from(target.selectedOptions, option => option.value);
          setFormData(prev => ({ ...prev, [name]: values }));
        } else {
          setFormData(prev => ({ ...prev, [name]: value }));
        }
      };
      
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
          const response = await api.post("/api/regions", formData);
          console.log("Réponse API:", response.data);
    
          Swal.fire({
            icon: "success",
            title: langueActive?.indice === "fr" ? "Bon travail!" : 
            langueActive?.indice === "en" ? "Good job !" : "",
            text: langueActive?.indice === "fr" ? "Region ajouté avec succès !" : 
            langueActive?.indice === "en" ? "Region added successfully!" : "",
            confirmButtonColor: "#7c3aed", // violet
            cancelButtonColor: "#ef4444", // rouge
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: langueActive?.indice === "en" ? "Cancel" : langueActive?.indice === "fr" ? "Annuler" : "",
            background: "#1c2d55",
            color: "#fff",
          }).then(() => {
            setShowModal(false);
            window.location.reload();
          });
          
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
          
            let errorMessage = langueActive?.indice === "fr" ? "Erreur lors de l'ajout de région." : 
            langueActive?.indice === "en" ? "Error adding region." : "";
          
            if (error.response) {
              // Si une réponse est retournée par le backend
              const status = error.response.status;
              const backendMessage = error.response.data?.message;
          
              // Si le backend renvoie un message clair, on l’affiche
              if (backendMessage) {
                errorMessage = backendMessage;
              } else if (status === 404) {
                errorMessage = langueActive?.indice === "fr" ? "Région introuvable." : 
                langueActive?.indice === "en" ? "Region not found" : "";
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

      useEffect(() => {
        const fetchSite = async () => {
            const liste = await listeSite();
            setSiteListe(liste);
          };
      
        fetchSite();
      }, []);

      return (
        <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50">
          <div className="bg-[#111C44] border border-red-500 rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down">
            <h2 className="text-xl font-bold mb-4 text-white">Créer une région</h2>
    
            <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((field) =>
                <div key={field}>
                  <label className="block text-gray-400 mb-1">
                    {fieldLabels[field] || field}
                    <sup className="text-red-500">*</sup>
                    
                  </label>
                  <input
                        type="text"
                        name={field}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white focus:outline-none focus:ring-0 focus:border-transparent"
                        autoComplete="off"
                        required
                    />
                  {/*{field === "sites" ? (
                    <select
                        name="sites"
                        multiple
                        value={formData.sites}
                        onChange={handleChange}
                        className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55]"
                        required
                    >
                        <option value="" disabled>Selectionner un privilège</option>
                        {siteListe.map((site) => (
                        <option key={site.id} value={`/api/sites/${site.id}`} className="mt-3">
                            {site.nom}
                        </option>
                        ))}
                    </select>
                    ): 
                    <input
                        type="text"
                        name={field}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white"
                        autoComplete="off"
                        required
                    />
                }*/}
                </div>
            )}


              <div className="flex justify-end">
                <button
                  type="submit"
                  className="text-white px-4 py-2 rounded "
                >
                  {langueActive?.indice === "fr" ? save.fr.upperText : langueActive?.indice === "en" ? save.en.upperText : ""}
                </button>
              </div>
            </form>
    
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-lg py-1 px-2 rounded"
              aria-label="Close modal"
            >
              <i className="bi bi-x-circle-fill text-white"></i>
            </button>
          </div>
        </div>
      );
};

export default AddRegion;
