import React, { useState } from "react";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import api from "../../../service/Api";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";

interface AddPrivilegeProps {
    setShowModalAdd: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  
  const AddPrivilege: React.FC<AddPrivilegeProps> = ({ setShowModalAdd }) => {
    const [formData, setFormData] = useState({
        title: "",
        libelleFr: "",
        libelleEn: "",
        description: "",
        descriptionEn: ""
    });

    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();
    const {codeCouleur} = useGlobalActiveCodeCouleur();
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;

    const fieldLabels: { [key: string]: string } = {
        title: t("title"),
        libelleFr: t("libelleFr"),
        libelleEn: t("libelleEn"),
        description: t("descriptionFr"),
        descriptionEn: t("descriptionEn"),
      };

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

        const payload: any = {};

        payload.title = formData.title;
        payload.description = formData.description;
        payload.descriptionEn = formData.descriptionEn;
        payload.libelleFr = formData.libelleFr;
        payload.libelleEn = formData.libelleEn;
    
        try {
          await api.post("/api/privileges", payload);
    
          Swal.fire({
            icon: "success",
            title: langueActive?.indice === "fr" ? "Bon travail!" : 
            langueActive?.indice === "en" ? "Good job !" : "",
            text: langueActive?.indice === "fr" ? "Privilège ajouté avec succès !" : 
            langueActive?.indice === "en" ? "Privilege added successfully!" : "",
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
          
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: langueActive?.indice === "fr" ? "Erreur" : langueActive?.indice === "en" ? "Error" : "",
            text: langueActive?.indice === "fr" ? "Erreur lors de l'ajout de privilège." : 
            langueActive?.indice === "en" ? "Error occurred while adding the privilege." : "",
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
                    <h2 className="text-xl font-bold mb-4 text-white">{t("addPrivilege")}</h2>
            
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {Object.keys(formData).map((field) =>
                            <div key={field}>
                                <label className="block text-gray-400 mb-1">
                                    {fieldLabels[field] || field} 
                                    <sup className="text-red-500">*</sup>
                                    
                                </label>
                            {field === "description" || field === "descriptionEn" ? (
                                <textarea
                                name={field}
                                value={formData[field as keyof typeof formData]}
                                onChange={handleChange}
                                className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                                rows={4}
                                required
                                />
                            ) : (
                                <input
                                type="text"
                                name={field}
                                value={formData[field as keyof typeof formData]}
                                onChange={handleChange}
                                className={`w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] ${field === "district" ? "hidden" : ""} focus:outline-none focus:ring-0 focus:border-transparent`}
                                required
                                autoComplete="off"
                                placeholder={`${field === "title" ? "super_admin" : field === "libelleFr" ? "Super administrateur" : field === "libelleEn" ? "Super administrator" : ""}`}                                />
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

export default AddPrivilege;