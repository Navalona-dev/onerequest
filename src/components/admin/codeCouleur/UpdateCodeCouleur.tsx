import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../../service/Api";
import { store } from "../../../store";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

interface AddCodeCouleurProps {
  setShowModalUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  codeId: number;
  initialData: {
    libelle: string;
    bgColor: string;
    textColor: string;
    btnColor: string;
    colorOne: string;
    colorTwo: string;
    isGlobal: boolean;
    isDefault: boolean;
    isActive: boolean;
    textColorHover: string;
    btnColorHover: string;
  };
  
}


interface Site {
  id: number;
  nom: string;
}
const UpdateCodeCouleur: React.FC<AddCodeCouleurProps> = ({
  setShowModalUpdate,
  codeId,
  initialData
}) => {
  const [formData, setFormData] = useState({
    libelle: initialData.libelle,
    bgColor: initialData.bgColor,
    textColor: initialData.textColor,
    btnColor: initialData.btnColor,
    textColorHover: initialData.textColorHover,
    btnColorHover: initialData.btnColorHover,
    colorOne: initialData.colorOne,
    colorTwo: initialData.colorTwo,
   
  });

  const {langueActive} = useLangueActive();
  const { t, i18n } = useTranslation();

  const fieldLabels: { [key: string]: string } = {
    libelle: "Libelle",
    bgColor: t("bgcolor"),
    textColor: t("textcolor"),
    btnColor: t("btncolor"),
    colorOne: t("colorone"),
    colorTwo: t("colortwo"),
    textColorHover: t("textcolorhover"),
    btnColorHover: t("btncolorhover"),
  };

  const [siteListe, setSiteListe] = useState<Site[]>([]);
  const state = store.getState();
  const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;
  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();

  const listeSite = async () => {
    try {
      const response = await api.get("/api/sites");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des sites");
      return [];
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.patch(`/api/code_couleurs/${codeId}`, formData,
        {
          headers: {
            'Content-Type': 'application/merge-patch+json'
          }
        }
      );
      Swal.fire({
        icon: "success",
        title: "Bon travail!",
        text: "Code couleur mis à jour avec succès !",
        confirmButtonColor: "#7c3aed",
        cancelButtonColor: "#ef4444",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Annuler",
        background: "#1c2d55",
        color: "#fff",
      }).then(() => {
        setShowModalUpdate(false);
        window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de la mise à jour du code couleur.",
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
        <h2 className="text-xl font-bold mb-4 text-white">{t("updatecodecouleurtitle")}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(formData).map((field) => (
            <div key={field}>
             
             <label className="block text-gray-400 mb-1">
             {fieldLabels[field] || field}
                 {["site", "bgColor", "textColor", "btnColor"].includes(field) && (
                   <sup className="text-red-500">*</sup>
                 )}
            </label>

            <input
                  type={`${field === "libelle" ? "text" : "color"}`}
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  className={`w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] ${field === "libelle" ? "text-white" : "cursor-pointer"} focus:outline-none focus:ring-0 focus:border-transparent`}
                  autoComplete="off"
                  required={["bgColor", "textColor", "btnColor"].includes(field)}
                />
            </div>
          ))}

          <div className="flex justify-end">
            <button type="submit" className="text-white px-4 py-2 rounded">
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

export default UpdateCodeCouleur;
