import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

import api from "../../../service/Api";

interface AddCodeCouleurProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddCodeCouleur: React.FC<AddCodeCouleurProps> = ({ setShowModal }) => {
    const [formData, setFormData] = useState({
        libelle: "",
        bgColor: "",
        textColor: "",
        btnColor: "",
        colorOne: "",
        colorTwo: "",
    });

    const fieldLabels: { [key: string]: string } = {
        libelle: "Libelle",
        bgColor: "Couleur de fond",
        textColor: "Couleur du texte",
        btnColor: "Couleur du bouton",
        colorOne: "Couleur 1",
        colorTwo: "Couleur 2",
      };

    const [siteListe, setSiteListe] = useState<{ id: number; nom?: string; libelle?: string }[]>([]);

    const listeSite = async () => {
      try {
        const response = await api.get("/api/sites");
        const sites = response.data;
        return sites;
      } catch (error) {
        return 0;
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
          const response = await api.post("/api/code_couleurs", formData);
          console.log("Réponse API:", response.data);
    
          Swal.fire({
            icon: "success",
            title: "Bon travail!",
            text: "Code couleur ajouté avec succès !",
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
            text: "Erreur lors de l'ajout du code couleur.",
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
      
        fetchSiteListe();
      }, []);

      return (
        <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50 h-[100vh]">
          <div className="bg-[#111C44] border border-red-500 rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down h-[95vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-white">Créer un nouveau code couleur</h2>
    
            <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((field) => (
              <div key={field}>
                <label className="block text-gray-400 mb-1">
                  {fieldLabels[field] || field} 
                  {(field === "site" || field === "bgColor" || field === "textColor" || field === "btnColor") ? (
                    <sup className="text-red-500">*</sup>
                  ) : (
                    <sup></sup>
                  )}

                </label>

                <input
                    type={`${field === "libelle" ? "text" : "color"}`}
                    name={field}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleChange}
                    className={`w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] ${field === "libelle" ? "text-white" : "cursor-pointer"} focus:outline-none focus:ring-0 focus:border-transparent`}
                    autoComplete="off"
                    required={field === "bgColor" || field === "textColor" || field === "btnColor"}
                  />
              </div>
            ))}

    
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
    
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-lg"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>
      );
};

export default AddCodeCouleur;
