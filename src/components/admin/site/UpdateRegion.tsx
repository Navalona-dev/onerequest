import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../../service/Api";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

type CommuneType = {
  id: number;
  nom: string;
}

type RegionType = {
  id: number;
  nom: string;
  commune: CommuneType | null;
}

interface UpdateRegionProps {
  setShowModalUpdateRegion: React.Dispatch<React.SetStateAction<boolean>>;
  siteId: number;
  initialData: {
    region: RegionType | null;
    commune : CommuneType | null;
  };
 
}

const UpdateRegion: React.FC<UpdateRegionProps> = ({ setShowModalUpdateRegion, siteId, initialData }) => {
  const [formData, setFormData] = useState({
    region: initialData.region ? `/api/regions/${initialData.region.id}` : "",
    commune: initialData.commune ? `/api/communes/${initialData.commune.id}` : ""
  });

  const {langueActive} = useLangueActive();
  const { t, i18n } = useTranslation();
  const [selectedRegionId, setSelectedRegionId] = useState<string>("");
  const [regions, setListeRegion] = useState<RegionType[]>([]);
  const [communes, setListeCommune] = useState<CommuneType[]>([]);

  useEffect(() => {
    api.get('/api/regions')
    .then((response) => {
      setListeRegion(response.data)
    })
    .catch((error) => console.error("Erreur API", error));
  }, []);

  useEffect(() => {
    if(!initialData.region) {
      return;
    }

    api.get(`/api/regions/${initialData.region?.id}/communes`)
    .then((response) => {
      setListeCommune(response.data)
    })
    .catch((error) => console.error("Erreur API", error));
  }, [initialData.region]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
  const state = store.getState();
  const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    try {
      const response = await api.patch(`/api/sites/${siteId}`, formData,
        {
          headers: {
            'Content-Type': 'application/merge-patch+json'
          }
        }
      );

      Swal.fire({
        icon: "success",
        title: "Succès",
        text: langueActive?.indice === "fr" ? "Region mis à jour avec succès." : 
        langueActive?.indice === "en" ? "Region updated successfully." : "",
        confirmButtonColor: "#7c3aed",
        background: "#1c2d55",
        color: "#fff",
      }).then(() => {
        setShowModalUpdateRegion(false);
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
        <h2 className="text-xl font-bold mb-4 text-white">{t("updateRegion")}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">{t("region")}</label>
            <select
              name="region"
              value={formData.region}   
              onChange={async (e) => {
                const selectedRegion = e.target.value;

                setFormData((prev) => ({
                  ...prev,
                  region: selectedRegion,
                  commune: ""
                }));

                
                const regionId = selectedRegion.split("/").pop(); 
                try {
                  const response = await api.get(`/api/regions/${regionId}/communes`);
                  setListeCommune(response.data);
                } catch (error) {
                  console.error("Erreur API communes:", error);
                  setListeCommune([]);
                }
              }}
              required
              className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
            >
              <option value="" disabled>{t("selectregion")}</option>
              {regions.map((region) => (
                <option key={region.id} value={`/api/regions/${region.id}`}>
                  {region.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-1">{t("commune")}</label>
            <select
              name="commune"
              value={formData.commune}   
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  commune: e.target.value, 
                }));
              }}
              required
              className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
            >
              <option value="" disabled>{t("selectcommune")}</option>
              {communes.map((commune) => (
                <option key={commune.id} value={`/api/communes/${commune.id}`}>
                  {commune.nom}
                </option>
              ))}
            </select>
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
          onClick={() => setShowModalUpdateRegion(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-lg py-1 px-2 rounded"
          aria-label="Close modal"
        >
          <i className="bi bi-x-circle-fill text-white"></i>
        </button>
      </div>
    </div>
  );
};

export default UpdateRegion;
