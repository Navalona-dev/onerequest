import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

import api from "../../../service/Api";
import { AxiosError } from "axios";
import { error } from "console";

type RegionType = {
  id: number;
  nom: string;
}
interface SelectRegionProps {
  setShowModalSelectRegion: React.Dispatch<React.SetStateAction<boolean>>;
  siteId: number;
}

const SelectRegion: React.FC<SelectRegionProps> = ({ setShowModalSelectRegion, siteId }) => {
    const [formData, setFormData] = useState({
        nom: "",
    });

    const fieldLabels: { [key: string]: string } = {
        nom: "Nom",
      };

    const [siteListe, setSiteListe] = useState<{ id: number; nom?: string; libelle?: string }[]>([]);

    const [regions, setListeRegion] = useState<RegionType[]>([]);

    const [checkboxActive, setCheckboxActive] = useState(false);

    const [selectedRegionId, setSelectedRegionId] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, multiple } = e.target;
    
      if (multiple) {
        // Forcer TypeScript à comprendre que e.target est un HTMLSelectElement
        const target = e.target as HTMLSelectElement;
        const values = Array.from(target.selectedOptions, option => option.value);
        setFormData(prev => ({ ...prev, [name]: values }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    };
      
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    
      const payload: any = {};
    
      if (checkboxActive && formData.nom.trim() !== "") {
        payload.region_nom = formData.nom;
      } else if (!checkboxActive && selectedRegionId) {
        payload.region_id = parseInt(selectedRegionId);
      } else {
        Swal.fire({ icon: "error", text: "Veuillez sélectionner ou saisir une région." });
        return;
      }
    
      try {
        await api.post(`/api/sites/${siteId}/select-region`, payload);
    
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Région associée avec succès.",
          confirmButtonColor: "#7c3aed",
          background: "#1c2d55",
          color: "#fff",
        }).then(() => {
          setShowModalSelectRegion(false);
          window.location.reload();
        });
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        let errorMessage = error.response?.data?.message || "Erreur inconnue.";
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: errorMessage,
          confirmButtonColor: "#ef4444",
          background: "#1c2d55",
          color: "#fff",
        });
      }
    };
    

    useEffect(() => {
      api.get('/api/regions')
      .then((response) => {
        setListeRegion(response.data)
      })
      .catch((error) => console.error("Erreur API:", error))
    }, []);

      return (
        <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50">
          <div className="bg-[#111C44] border border-red-500 rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down">
            <h2 className="text-xl font-bold mb-4 text-white">Sélectionner une région</h2>
    
            <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sélecteur de région existante */}
{!checkboxActive && (
  <div>
    <label className="block text-gray-400 mb-1">Région <sup className="text-red-500">*</sup></label>
    <select
      name="region_id"
      value={selectedRegionId}
      onChange={(e) => setSelectedRegionId(e.target.value)}
      className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white"
    >
      <option value="" disabled>Selectionner une région</option>
      {regions.map((item) => (
        <option key={item.id} value={item.id}>{item.nom}</option>
      ))}
    </select>
  </div>
)}

{/* Case à cocher */}
<div className="my-4">
  <input 
    type="checkbox" 
    name="is_not_in_list" 
    id="is_not_in_list"
    checked={checkboxActive}
    onChange={() => setCheckboxActive((prev) => !prev)}
  />
  <label htmlFor="is_not_in_list" className="text-white ml-3">Région non trouvée ?</label>
</div>

{/* Champ de nouvelle région */}
{checkboxActive && (
  <div>
    <label className="block text-gray-400 mb-1">Nom de la nouvelle région <sup className="text-red-500">*</sup></label>
    <input
      type="text"
      name="nom"
      value={formData.nom}
      onChange={handleChange}
      className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white"
      autoComplete="off"
      required
    />
  </div>
)}



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
              onClick={() => setShowModalSelectRegion(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-lg"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>
      );
};

export default SelectRegion;
