import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../../service/Api";

interface UpdateCategorieProps {
  setShowModalUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  categorieId: number;
  initialData: {
    nom: string;
    description: string;
  };
 
}

const UpdateCategorieDomaine: React.FC<UpdateCategorieProps> = ({ setShowModalUpdate, categorieId, initialData }) => {
  const [formData, setFormData] = useState({
    nom: initialData.nom,
    description: initialData.description,
  });

  const fieldLabels: { [key: string]: string } = {
    nom: "Nom",
    description: "Description",
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
      const response = await api.patch(`/api/categorie_domaine_entreprises/${categorieId}`, formData,
        {
          headers: {
            'Content-Type': 'application/merge-patch+json'
          }
        }
      );

      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "Catégorie domaine entreprise mis à jour avec succès.",
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
        title: "Erreur",
        text: "Une erreur est survenue lors de la mise à jour.",
        confirmButtonColor: "#ef4444",
        background: "#1c2d55",
        color: "#fff",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50">
      <div className="bg-[#111C44] border border-red-500 rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down">
        <h2 className="text-xl font-bold mb-4 text-white">Modifier la catégorie domaine</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
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
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Modifier
              </button>
            </div>
          </form>


        <button
          onClick={() => setShowModalUpdate(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-lg"
          aria-label="Close modal"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default UpdateCategorieDomaine;
