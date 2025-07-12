import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import api from "../../../service/Api";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useLangueActive } from "../../../hooks/useLangueActive";

interface AddUserProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddUser: React.FC<AddUserProps> = ({ setShowModal }) => {
    const [formData, setFormData] = useState({
        site: "",
        nom: "",
        prenom: "",
        email: "",
        privileges: [] as string[]
    });

    const fieldLabels: { [key: string]: string } = {
        site: "Site",
        nom: "Nom",
        prenom: "Prénom",
        email: "Adresse e-mail",
        privileges: "Privilèges"
      };

      const {langueActive} = useLangueActive();
      const { t, i18n } = useTranslation();

      const [siteListe, setSiteListe] = useState<{ id: number; nom?: string; libelle?: string }[]>([]);
      const [privilegeListe, setPrivilegeListe] = useState<{ id: number; title?: string; description?: string }[]>([]);
      const {codeCouleur} = useGlobalActiveCodeCouleur();
      const state = store.getState();
      const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;

    const listeSite = async () => {
      try {
        const response = await api.get("/api/sites");
        const sites = response.data;
        return sites;
      } catch (error) {
        return 0;
      }
    };

    const listePrivilege = async () => {
        try {
          const response = await api.get("/api/privileges");
          const privileges = response.data;
          console.log(privileges);

          return privileges;
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
          const response = await api.post("/api/users", formData);
          console.log("Réponse API:", response.data);
    
          Swal.fire({
            icon: "success",
            title: "Bon travail!",
            text: "Utilisateur ajouté avec succès !",
            confirmButtonColor: "#7c3aed", // violet
            cancelButtonColor: "#ef4444", // rouge
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            background: "#1c2d55",
            color: "#fff",
          }).then(() => {
            setShowModal(false);
            window.location.reload();
          });
          
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
          
            let errorMessage = `Erreur lors de l\'ajout d\'utilisateur.`;
          
            if (error.response) {
              // Si une réponse est retournée par le backend
              const status = error.response.status;
              const backendMessage = error.response.data?.message;
          
              // Si le backend renvoie un message clair, on l’affiche
              if (backendMessage) {
                errorMessage = backendMessage;
              } else if (status == 400) {
                errorMessage = "Un compte avec cet email existe déjà.";
              }
              else if (status === 404) {
                errorMessage = "Utilisateur introuvable.";
              } else if (status === 401) {
                errorMessage = "Non autorisé. Veuillez vous reconnecter.";
              } else if (status === 500) {
                errorMessage = "Erreur serveur. Réessayez plus tard.";
              }
              // Tu peux rajouter d'autres cas ici si besoin
            } else {
              // Pas de réponse du serveur (ex: problème de réseau)
              //errorMessage = "Un compte avec cet email existe déjà.";
            }
          
            await Swal.fire({
              icon: "error",
              title: "Erreur",
              text: errorMessage,
              confirmButtonColor: "#ef4444",
              background: "#1c2d55",
              color: "#fff",
            });
          }
          
      };

      useEffect(() => {
        const fetchSiteListe = async () => {
          const liste = await listeSite();
          setSiteListe(liste);
        };

        const fetchPrivilege = async () => {
            const liste = await listePrivilege();
            setPrivilegeListe(liste);
          };
      
        fetchSiteListe();
        fetchPrivilege();
      }, []);

      return (
        <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50">
          <div className="bg-[#111C44] border rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down"
          style={{
            borderColor: codeCouleur?.btnColor
          }}
          >
            <h2 className="text-xl font-bold mb-4 text-white">Créer un nouveau utilisateur</h2>
    
            <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((field) =>
                <div key={field}>
                  <label className="block text-gray-400 mb-1">
                    {fieldLabels[field] || field}
                    {(field === "prenom") ? (
                        <sup></sup>
                  ) : (
                    <sup className="text-red-500">*</sup>
                    
                  )}
                  </label>
                  {field === "privileges" ? (
                    <select
                        name="privileges"
                        multiple
                        value={formData.privileges}
                        onChange={handleChange}
                        className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                        required
                    >
                        <option value="" disabled>Selectionner un privilège</option>
                        {privilegeListe.map((priv) => (
                        <option key={priv.id} value={`/api/privileges/${priv.id}`} className="mt-3">
                            {priv.title}
                        </option>
                        ))}
                    </select>
                    ): 
                  (field === "site" ? (
                    <select
                        id="sites"
                        name="site"
                        value={formData.site}
                        onChange={handleChange}
                        className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                        required
                    >
                        <option value="" disabled>Selectionner un site</option>
                        {siteListe.map((site) => (
                        <option key={site.id} value={`/api/sites/${site.id}`}>
                            {site.nom}
                        </option>
                        ))}

                    </select>
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
                    ))}
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

export default AddUser;
