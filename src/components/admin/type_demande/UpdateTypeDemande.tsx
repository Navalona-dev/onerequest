import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../../service/Api";
import { AxiosError } from "axios";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";
import { store } from "../../../store";
  
  export interface Domaine {
    id: number;
    libelle: string;
    libelleEn: string;
  }

interface UpdateTypeProps {
  setShowModalUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  typeId: number;
  initialData: {
    domaine: Domaine | null;
    nom: string;
    description: string;
  };
}

const UpdateTypeDemande: React.FC<UpdateTypeProps> = ({ setShowModalUpdate, typeId, initialData }) => {
    const [formData, setFormData] = useState({
        domaine: initialData.domaine ? `/api/domaine_entreprises/${initialData.domaine.id}` : "",
        nom: initialData.nom,
        description: initialData.description,
      });
      
      const {langueActive} = useLangueActive();
      const { t, i18n } = useTranslation();
      const state = store.getState();
      const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;

      const fieldLabels: { [key: string]: string } = {
        domaine: t("domaineentreprise"),
        nom: t("title"),
        description: "Description",
      };


  const [domaineListe, setDomaineListe] = useState<{ id: number; libelle?: string; libelleEn: string }[]>([]);

const listeDomaine = async () => {
  try {
    const response = await api.get("/api/domaine_entreprises");
    const sites = response.data;
    return sites;
  } catch (error) {
    return 0;
  }
};

const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.patch(
        `/api/type_demandes/${typeId}`,
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
        text: langueActive?.indice === "fr" ? "Type de demande mis à jour avec succès." : 
        langueActive?.indice === "en" ? "Request type updated successfully." : "",
        confirmButtonColor: "#7c3aed",
        background: "#1c2d55",
        color: "#fff",
      }).then(() => {
        setShowModalUpdate(false);
        window.location.reload(); // ou mets à jour l'état local
      });

    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
          
        let errorMessage = langueActive?.indice === "fr" ? "Erreur lors de la mise à jour de type de demande." : 
        langueActive?.indice === "en" ? "Error updating request type." : "";
      
        if (error.response) {
          // Si une réponse est retournée par le backend
          const status = error.response.status;
          const backendMessage = error.response.data?.message;
      
          if (backendMessage) {
            errorMessage = backendMessage;
          } else if (status == 400) {
          }
          else if (status === 404) {
            errorMessage = langueActive?.indice === "fr" ? "Type de demande introuvable." : 
            langueActive?.indice === "en" ? "Request type not found" : "";
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
          title: "Erreur",
          text: errorMessage,
          confirmButtonColor: "#ef4444",
          background: "#1c2d55",
          color: "#fff",
        });
    }
  };

  useEffect(() => {
    const fetchDomaineListe = async () => {
      const liste = await listeDomaine();
      setDomaineListe(liste);
    };

  
    fetchDomaineListe();
  }, []);

  return (
    <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50">
      <div className="bg-[#111C44] border border-red-500 rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down">
        <h2 className="text-xl font-bold mb-4 text-white">{t("updatetypedemandetitle")}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((field) =>
                <div key={field}>
                  <label className="block text-gray-400 mb-1">
                    {fieldLabels[field] || field}
                    <sup className="text-red-500">*</sup>
                    
                  </label>
                  {field === "domaine" ? (
                    <select
                        name="domaine"
                        value={formData.domaine}
                        onChange={handleChange}
                        className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                        required
                    >
                        <option value="" disabled>{t("selectdomaine")}</option>
                        {domaineListe.map((item) => (
                        <option key={item.id} value={`/api/domaine_entreprises/${item.id}`} className="mt-3">
                            {langueActive?.indice === "fr" ? item.libelle : langueActive?.indice === "en" ? item.libelleEn : ""}
                        </option>
                        ))}
                    </select>
                    ) : (
                    field === "description" ? (
                        <textarea name="description" id=""
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white focus:outline-none focus:ring-0 focus:border-transparent"
                            required
                            rows={5}
                        >

                        </textarea>
                    ) : ( 
                    <input
                        type="text"
                        name={field}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white focus:outline-none focus:ring-0 focus:border-transparent"
                        autoComplete="off"
                        required
                    />
                    ))}
                </div>
            )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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

export default UpdateTypeDemande;
