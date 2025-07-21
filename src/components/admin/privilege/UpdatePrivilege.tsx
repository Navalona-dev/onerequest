import React, { useState } from "react";
import api from "../../../service/Api";
import { store } from "../../../store";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

interface AddCodeCouleurProps {
    setShowModalUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    privilegeId: number;
    initialData: {
      libelleFr: string;
      libelleEn: string;
      description: string;
      descriptionEn: string;
    };
    
  }

  const UpdatePrivilege: React.FC<AddCodeCouleurProps> = ({
    setShowModalUpdate,
    privilegeId,
    initialData
  }) => {
    const [formData, setFormData] = useState({
      libelleFr: initialData.libelleFr,
      libelleEn: initialData.libelleEn,
      description: initialData.description,
      descriptionEn: initialData.descriptionEn,
    });

    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;
    const {codeCouleur, loading} = useGlobalActiveCodeCouleur();

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

        payload.description = formData.description;
        payload.descriptionEn = formData.descriptionEn;
        payload.libelleFr = formData.libelleFr;
        payload.libelleEn = formData.libelleEn;
    
        try {
          await api.patch(`/api/privileges/${privilegeId}`, payload, 
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
            text: langueActive?.indice === "fr" ? "Privilège modifié avec succès !" : 
            langueActive?.indice === "en" ? "Privilege updated successfully!" : "",
            confirmButtonColor: "#7c3aed", // violet
            cancelButtonColor: "#ef4444", // rouge
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: langueActive?.indice === "en" ? "Cancel" : langueActive?.indice === "fr" ? "Annuler" : "",
            background: "#1c2d55",
            color: "#fff",
          }).then(() => {
            setShowModalUpdate(false);
            window.location.reload();
          });
          
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: langueActive?.indice === "fr" ? "Erreur" : langueActive?.indice === "en" ? "Error" : "",
            text: langueActive?.indice === "fr" ? "Erreur lors de la mise à jour de privilège." : 
            langueActive?.indice === "en" ? "Error occurred while updating the privilege." : "",
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
                    <h2 className="text-xl font-bold mb-4 text-white">{t("updatePrivilegeTitle")}</h2>
            
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {Object.keys(formData).map((field) =>
                            <div key={field}>
                                <label className="block text-gray-400 mb-1">
                                    {fieldLabels[field] || field} 
                                    {(field === "title" || field === "libelleFr" || field === "libelleEn") ? (
                                        <sup className="text-red-500">*</sup>
                                    ) : (
                                        <sup></sup>
                                    )}
                                </label>
                            {field === "description" || field === "descriptionEn" ? (
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
        </>
    )
}

export default UpdatePrivilege;