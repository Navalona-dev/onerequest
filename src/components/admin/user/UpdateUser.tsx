import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../../service/Api";
import { AxiosError } from "axios";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

export interface Privilege {
    id: number;
    title: string;
    description?: string;
  }
  
  export interface Site {
    id: number;
    nom: string;
  }

interface UpdateUserProps {
  setShowModalUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  userId: number;
  initialData: {
    site: Site | null;
    nom: string;
    prenom: string;
    email: string;
    privileges: Privilege[];
  };
}

const UpdateUser: React.FC<UpdateUserProps> = ({ setShowModalUpdate, userId, initialData }) => {
    const [formData, setFormData] = useState({
        site: initialData.site ? `/api/sites/${initialData.site.id}` : "",
        nom: initialData.nom,
        prenom: initialData.prenom,
        email: initialData.email,
        privileges: initialData.privileges.map(p => `/api/privileges/${p.id}`), 
      });
      
      const {langueActive} = useLangueActive();
      const { t, i18n } = useTranslation();

      const fieldLabels: { [key: string]: string } = {
        site: "Site",
        nom: t("nom"),
        prenom: t("prenom"),
        email: t("mail"),
        privileges: t("privileges")
      };

  const [siteListe, setSiteListe] = useState<{ id: number; nom?: string; libelle?: string }[]>([]);
  const [privilegeListe, setPrivilegeListe] = useState<{ id: number; title?: string; description?: string; libelleFr: string; libelleEn: string; }[]>([]);
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
        title: "Succès",
        text: langueActive?.indice === "fr" ? "Utilisateur mis à jour avec succès." : 
        langueActive?.indice === "en" ? "User updated successfully." : "",
        confirmButtonColor: "#7c3aed",
        background: "#1c2d55",
        color: "#fff",
      }).then(() => {
        setShowModalUpdate(false);
        window.location.reload(); // ou mets à jour l'état local
      });

    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
          
        let errorMessage = langueActive?.indice === "fr" ? "Erreur lors de la mise à jour d'utilisateur." : 
        langueActive?.indice === "en" ? "Error while updating user." : "";
      
        if (error.response) {
          // Si une réponse est retournée par le backend
          const status = error.response.status;
          const backendMessage = error.response.data?.message;
      
          // Si le backend renvoie un message clair, on l’affiche
          if (backendMessage) {
            errorMessage = backendMessage;
          } else if (status == 400) {
            errorMessage = langueActive?.indice === "fr" ? "Un compte avec cet email existe déjà." : 
            langueActive?.indice === "en" ? "An account with this email already exists." : "";
          }
          else if (status === 404) {
            errorMessage = langueActive?.indice === "fr" ? "Utilisateur introuvable." : 
            langueActive?.indice === "en" ? "User not found" : "";
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
        <h2 className="text-xl font-bold mb-4 text-white">{t("userupdatetitle")}</h2>

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
                        className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55]"
                        required
                    >
                        <option value="" disabled>{t("selecetpriv")}</option>
                        {privilegeListe.map((priv) => (
                        <option key={priv.id} value={`/api/privileges/${priv.id}`} className="mt-3">
                            {priv.title} ({langueActive?.indice === "fr" ? priv.libelleFr : langueActive?.indice === "en" ? priv.libelleEn : ""})
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
                        className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55]"
                        required
                    >
                        <option value="" disabled>{t("selectsite")}</option>
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
                        className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white"
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
              {langueActive?.indice === "fr" ? edit.fr.upperText : langueActive?.indice === "en" ? edit.en.upperText : ""}
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
  );
};

export default UpdateUser;
