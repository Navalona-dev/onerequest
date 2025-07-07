import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import api from "../../../service/Api";

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
            title: "Bon travail!",
            text: "Commune ajouté avec succès !",
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
          
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Erreur lors de l'ajout du commune.",
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
                        className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55]"
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
                  {save.upperText}
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
