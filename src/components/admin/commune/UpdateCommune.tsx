import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../../service/Api";

interface UpdateCommuneProps {
  setShowModalUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  communeId: number;
  initialData: {
    nom: string;
    district: string;
  };
 
}

const UpdateCommune: React.FC<UpdateCommuneProps> = ({ setShowModalUpdate, communeId, initialData }) => {
  const [formData, setFormData] = useState({
    nom: initialData.nom,
    district: initialData.district,
  });

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
      const response = await api.patch(`/api/communes/${communeId}`, formData,
        {
          headers: {
            'Content-Type': 'application/merge-patch+json'
          }
        }
      );

      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "Commune mis à jour avec succès.",
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
        <h2 className="text-xl font-bold mb-4 text-white">Modifier le commune</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55]"
              required
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">District</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55]"
              required
              autoComplete="off"
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

export default UpdateCommune;
