import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../../service/Api";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

interface UpdateDomaineEntrepriseProps {
  setShowModalUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  domaineId: number;
  initialData: {
    libelle: string;
    description: string;
  };
 
}

const UpdateDomaineEntreprise: React.FC<UpdateDomaineEntrepriseProps> = ({ setShowModalUpdate, domaineId, initialData }) => {
  const [formData, setFormData] = useState({
    libelle: initialData.libelle,
    description: initialData.description,
  });

  const fieldLabels: { [key: string]: string } = {
    libelle: "Libellé",
    description: "Description",
  };

  const {codeCouleur} = useGlobalActiveCodeCouleur();
  const state = store.getState();
  const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;
  const {langueActive} = useLangueActive();
  const { t, i18n } = useTranslation();

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
      await api.patch(`/api/domaine_entreprises/${domaineId}`, formData,
        {
          headers: {
            'Content-Type': 'application/merge-patch+json'
          }
        }
      );

      Swal.fire({
        icon: "success",
        title: "Succès",
        text: langueActive?.indice === "fr" ? "Domaine entreprise mis à jour avec succès." : 
        langueActive?.indice === "en" ? "Business domain updated successfully." : "",
        confirmButtonColor: "#7c3aed",
        background: "#1c2d55",
        color: "#fff",
      }).then(() => {
        setShowModalUpdate(false);
        window.location.reload(); // ou mets à jour l'état local
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: langueActive?.indice === "fr" ? "Erreur" : langueActive?.indice === "en" ? "Error" : "",
        text: langueActive?.indice === "fr" ? "Une erreur est survenue lors de la mise à jour." : 
        langueActive?.indice === "en" ? "An error occurred during the update." : "",
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
        <h2 className="text-xl font-bold mb-4 text-white">Modifier la domaine d'entreprise</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Libellé</label>
            <input
              type="text"
              name="libelle"
              value={formData.libelle}
              onChange={handleChange}
              className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
              required
              autoComplete="off"
            />
          </div>

            <div>
              <label className="block text-gray-400 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                required
                rows={4}
              />
            </div>

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

export default UpdateDomaineEntreprise;
