import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import api from "../../../service/Api";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

interface AddCommuneProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  idRegion: number;
}

const AddCommune: React.FC<AddCommuneProps> = ({ setShowModal, idRegion }) => {
    const [formData, setFormData] = useState({
        nom: "",
        district: "",
        region: `/api/regions/${idRegion}`
    });

    const [loading, setLoading] = useState(true);
    const {codeCouleur} = useGlobalActiveCodeCouleur();
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;
    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();

    const fieldLabels: { [key: string]: string } = {
        nom: "Nom",
        district: "District",
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
    
        try {
          const response = await api.post("/api/communes", formData);
          console.log("Réponse API:", response.data);
    
          Swal.fire({
            icon: "success",
            title: langueActive?.indice === "fr" ? "Bon travail!" : 
            langueActive?.indice === "en" ? "Good job !" : "",
            text: langueActive?.indice === "fr" ? "Commune ajouté avec succès !" : 
            langueActive?.indice === "en" ? "Commune added successfully!" : "",
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
          
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: langueActive?.indice === "fr" ? "Erreur" : langueActive?.indice === "en" ? "Error" : "",
            text: langueActive?.indice === "fr" ? "Erreur lors de l'ajout du commune." : 
            langueActive?.indice === "en" ? "Failed to add the commune." : "",
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
            <h2 className="text-xl font-bold mb-4 text-white">Créer un nouveau commune</h2>
    
            <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((field) =>
              field === "region" ? null : (
                <div key={field}>
                  <label className="block text-gray-400 mb-1">
                    {fieldLabels[field] || field}
                  </label>
                    <input
                        type="text"
                        name={field}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleChange}
                        className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                        required
                        autoComplete="off"
                    />
                </div>
              )
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

export default AddCommune;
