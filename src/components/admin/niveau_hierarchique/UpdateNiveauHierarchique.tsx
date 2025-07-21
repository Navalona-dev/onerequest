import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../../service/Api";
import { AxiosError } from "axios";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

type Departement = {
    id: number;
    nom: string;
    nomEn: string;
}

interface UpdateNiveauProps {
  setShowModalUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  niveauId: number;
  initialData: {
    nom: string;
    nomEn: string;
    description: string;
    descriptionEn: string;
    departements: Departement[];
  };
}

const UpdateNiveauHierarchique: React.FC<UpdateNiveauProps> = ({ setShowModalUpdate, niveauId, initialData }) => {
    const [formData, setFormData] = useState({
        nom: "",
        nomEn: "",
        departements: [] as string[],
        description: "",
        descriptionEn: ""
      });
      
      
      const {langueActive} = useLangueActive();
      const { t, i18n } = useTranslation();

      const fieldLabels: { [key: string]: string } = {
        nom: t("nomFr"),
        nomEn: t("nomEn"),
        ordre: t("ordre"),
        description: t("descriptionFr"),
        descriptionEn: t("descriptionEn"),
        departements: t("departements")
      };

      const [departementListe, setDepartementListe] = useState<Departement[]>([]);
      const [departementsLoaded, setDepartementsLoaded] = useState(false); // ← FLAG IMPORTANT
      
  const {codeCouleur} = useGlobalActiveCodeCouleur();
  const state = store.getState();
  const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;

const listeDepartement = async () => {
    try {
      const response = await api.get("/api/departements");
      const departements = response.data;

      return departements;
    } catch (error) {
      return 0;
    }
  };

  useEffect(() => {
    const fetchDepartement = async () => {
      const liste = await listeDepartement();
      setDepartementListe(liste);
      setDepartementsLoaded(true);
    };
  
    fetchDepartement();
  }, []);
  

  useEffect(() => {
    if (initialData && departementsLoaded) {
      const departementsFormattes = (initialData.departements ?? []).map(
        (d) => `/api/departements/${d.id}`
      );
  
      setFormData({
        nom: initialData.nom || "",
        nomEn: initialData.nomEn || "",
        departements: departementsFormattes,
        description: initialData.description || "",
        descriptionEn: initialData.descriptionEn || "",
      });
    }
  }, [initialData, departementsLoaded]);
  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    if (e.target instanceof HTMLSelectElement && e.target.multiple) {
      const values = Array.from(e.target.selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, [name]: values }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };    

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.patch(
        `/api/niveau_hierarchiques/${niveauId}`,
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
        text: langueActive?.indice === "fr" ? "Niveau hierarchique mis à jour avec succès." : 
        langueActive?.indice === "en" ? "Hierarchy Levels updated successfully." : "",
        confirmButtonColor: "#7c3aed",
        background: "#1c2d55",
        color: "#fff",
      }).then(() => {
        setShowModalUpdate(false);
        window.location.reload(); // ou mets à jour l'état local
      });

    } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
      
        let errorMessage = langueActive?.indice === "fr" ? "Erreur lors de l'ajout de niveau hierarchique." : 
        langueActive?.indice === "en" ? "Error while adding Hierarchy Levels." : "";
      
        if (error.response) {
          // Si une réponse est retournée par le backend
          const status = error.response.status;
          const backendMessage = error.response.data?.message;
      
          // Si le backend renvoie un message clair, on l’affiche
          if (backendMessage) {
            errorMessage = backendMessage;
          } else if (status == 400 || status == 422) {
            errorMessage = langueActive?.indice === "fr" ? "Un niveau hierarchique avec cet ordre existe déjà." : 
            langueActive?.indice === "en" ? "An Hierarchy Levels with this order already exists." : "";
          }
          else if (status === 404) {
            errorMessage = langueActive?.indice === "fr" ? "Niveau hierarchique introuvable." : 
            langueActive?.indice === "en" ? "Hierarchy Levels not found" : "";
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

  return (
    <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50 h-[100vh]">
      <div className="bg-[#111C44] border rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down h-[95vh] overflow-y-auto"
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
                  {field === "departements" ? (
                    <select
                        name="departements"
                        multiple
                        value={formData.departements}
                        onChange={handleChange}
                        className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55]"
                        required
                    >
                        {departementListe.map((dep) => (
                        <option key={dep.id} value={`/api/departements/${dep.id}`}>
                            {langueActive?.indice === "fr" ? dep.nom : dep.nomEn}
                        </option>
                        ))}
                    </select>
                  
                    ): field === "description" || field === "descriptionEn" ? (
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
                        className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white"
                        autoComplete="off"
                        required={field === "nom" || field === "email"}
                    />
                    )}
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

export default UpdateNiveauHierarchique;
