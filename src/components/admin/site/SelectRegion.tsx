import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

import api from "../../../service/Api";
import { AxiosError } from "axios";
import { error } from "console";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

type RegionType = {
  id: number;
  nom: string;
}

type CommuneType = {
  id: number;
  nom: string;
  district: string;
}

interface SelectRegionProps {
  setShowModalSelectRegion: React.Dispatch<React.SetStateAction<boolean>>;
  siteId: number;
}

const SelectRegion: React.FC<SelectRegionProps> = ({ setShowModalSelectRegion, siteId }) => {
    const [formData, setFormData] = useState({
        region: "",
        commune: "",
        district: ""
    });

    const fieldLabels: { [key: string]: string } = {
        region: "Région",
        commune: "Commune",
        district: "District"
      };

    const [siteListe, setSiteListe] = useState<{ id: number; nom?: string; libelle?: string }[]>([]);

    const [regions, setListeRegion] = useState<RegionType[]>([]);
    const [communes, setListeCommune] = useState<CommuneType[]>([]);

    const [checkboxActive, setCheckboxActive] = useState(false);

    const [selectedRegionId, setSelectedRegionId] = useState<string>("");
    const [selectedCommuneId, setSelectedCommuneId] = useState<string>("");
    const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;
    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();

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
    
      if (checkboxActive && formData.region.trim() !== "") {
        payload.region_nom = formData.region;
      } else if (!checkboxActive && selectedRegionId) {
        payload.region_id = parseInt(selectedRegionId);
      } else {
        Swal.fire({ icon: "error", text: "Veuillez sélectionner ou saisir une région." });
        return;
      }

      if (checkboxActive && formData.commune.trim() !== "" && formData.district.trim() !== "") {
        payload.commune_nom = formData.commune;
        payload.district = formData.district;
      } else if (!checkboxActive && selectedCommuneId) {
        payload.commune_id = parseInt(selectedCommuneId);
      } else {
        Swal.fire({ icon: "error", text: "Veuillez saisir la commune et le district." });
        return;
      }
    
      try {
        await api.post(`/api/sites/${siteId}/select-region`, payload);
    
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Région et commune associés avec succès.",
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

    useEffect(() => {
      if (!selectedRegionId) return;
    
      api.get(`/api/regions/${selectedRegionId}/communes`)
        .then((response) => {
          setListeCommune(response.data);
        })
        .catch((error) => console.error("Erreur API", error));
    }, [selectedRegionId]); 

      return (
        <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50">
          <div className="bg-[#111C44] border rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down"
          style={{
            borderColor: codeCouleur?.btnColor
          }}
          >
            <h2 className="text-xl font-bold mb-4 text-white">Sélectionner une région</h2>
    
            <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sélecteur de région existante */}
            {!checkboxActive && (
             <>
              <div>
                <label className="block text-gray-400 mb-1">Région <sup className="text-red-500">*</sup></label>
                <select
                  name="region_id"
                  value={selectedRegionId}
                  onChange={(e) => setSelectedRegionId(e.target.value)}
                  className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white focus:outline-none focus:ring-0 focus:border-transparent"
                >
                  <option value="" disabled>Selectionner une région</option>
                  {regions.map((item) => (
                    <option key={item.id} value={item.id}>{item.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Commune <sup className="text-red-500">*</sup></label>
                <select
                  name="commune_id"
                  value={selectedCommuneId}
                  onChange={(e) => {
                    setSelectedCommuneId(e.target.value);
                  }}
                  className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white focus:outline-none focus:ring-0 focus:border-transparent"
                >
                  <option value="" disabled>Selectionner un commune</option>
                  {communes.map((item) => (
                    <option key={item.id} value={item.id}>{item.nom}</option>
                  ))}
                </select>
              </div>
             </>
              
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
              <>
              <div>
              <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#1c2d55] mt-3 border-[#1c2d55] text-white focus:outline-none focus:ring-0 focus:border-transparent"
                  autoComplete="off"
                  required
                  placeholder="Nom de la nouvelle région"
                />
              </div>
              <div>
              <input
                  type="text"
                  name="commune"
                  value={formData.commune}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#1c2d55] mt-3 border-[#1c2d55] text-white focus:outline-none focus:ring-0 focus:border-transparent"
                  autoComplete="off"
                  required
                  placeholder="Nom de nouveau commune"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#1c2d55] mt-3 border-[#1c2d55] text-white focus:outline-none focus:ring-0 focus:border-transparent"
                  autoComplete="off"
                  required
                  placeholder="District"
                />
              </div>
              </>
            )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  {langueActive?.indice === "fr" ? save.fr.upperText : langueActive?.indice === "en" ? save.en.upperText : ""}
                </button>
              </div>
            </form>
    
            <button
              onClick={() => setShowModalSelectRegion(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-lg py-1 px-2 rounded"
              aria-label="Close modal"
            >
               <i className="bi bi-x-circle-fill text-white"></i>
            </button>
          </div>
        </div>
      );
};

export default SelectRegion;
