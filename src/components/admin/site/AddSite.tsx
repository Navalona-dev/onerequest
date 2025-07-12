import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

import api from "../../../service/Api";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

interface AddSiteProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

type CommuneType = {
  id: number;
  nom: string;
}

type RegionType = {
  id: number;
  nom: string;
  communes: CommuneType[];
}


const Addsite: React.FC<AddSiteProps> = ({ setShowModal }) => {
    const [formData, setFormData] = useState({
        nom: "",
        region: "",
        commune: "",
        district: "",
        description: "",
        entreprise: "/api/entreprises/1"
    });

    const [loading, setLoading] = useState(true);
    const [regions, setListeRegion] = useState<RegionType[]>([]);
    const [communes, setListeCommune] = useState<CommuneType[]>([]);
    const [selectedRegionId, setSelectedRegionId] = useState<string>("");
    const [selectedCommuneId, setSelectedCommuneId] = useState<string>("");
    const [checkboxActive, setCheckboxActive] = useState(false);
    const {codeCouleur} = useGlobalActiveCodeCouleur();
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;
    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();

    const fieldLabels: { [key: string]: string } = {
        nom: "Nom",
        region: "Région",
        commune: "Commune",
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

      useEffect(() => {
        api.get('/api/regions')
        .then((response) => {
          setListeRegion(response.data)
        })
        .catch((error) => console.error("Erreur API", error));
      }, []);

      useEffect(() => {
        if (!selectedRegionId) return;
      
        api.get(`/api/regions/${selectedRegionId}/communes`)
          .then((response) => {
            setListeCommune(response.data);
          })
          .catch((error) => console.error("Erreur API", error));
      }, [selectedRegionId]); 
      

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = {};

        payload.nom = formData.nom;
        payload.description = formData.description;
        payload.entreprise = formData.entreprise;
    
        //traiter la nouvelle region
        if (checkboxActive && formData.region.trim() !== "") {
          payload.region_nom = formData.region;
        } else if (!checkboxActive && selectedRegionId) {
          payload.region_id = parseInt(selectedRegionId);
        } else {
          Swal.fire({ icon: "error", text: "Veuillez sélectionner ou saisir une région." });
          return;
        }

        //traiter le nouveau commune
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
          await api.post("/api/sites", payload);
    
          Swal.fire({
            icon: "success",
            title: "Bon travail!",
            text: "Site ajouté avec succès !",
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
            text: "Erreur lors de l'ajout du site.",
            confirmButtonColor: "#ef4444",
            background: "#1c2d55",
            color: "#fff",
          });
          
        }
      };

      return (
        <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50 h-[100vh]">
          <div className="bg-[#111C44] border rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down h-[95vh] overflow-y-auto"
          style={{
            borderColor: codeCouleur?.btnColor
          }}
          >
            <h2 className="text-xl font-bold mb-4 text-white">Créer un nouveau site</h2>
    
            <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((field) =>
              field === "entreprise" ? null : (
                <div key={field}>
                  {field === "district" ? (
                    null
                  ) : (
                    <>
                    {!checkboxActive && (
                      <label className="block text-gray-400 mb-1">
                        {fieldLabels[field] || field}
                      </label>
                    )}

                    {checkboxActive && (field === "nom" || field === "description") && (
                      <label className="block text-gray-400 mb-1">
                        {fieldLabels[field] || field}
                      </label>
                    )}
                    </>
                  )}

                  {field === "description" ? (
                    <textarea
                      name={field}
                      value={formData[field as keyof typeof formData]}
                      onChange={handleChange}
                      className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                      required
                      rows={4}
                    />
                  ) : field === "region" ?  (
                    <>
                    {!checkboxActive && 
                      (
                        <select defaultValue="" name="" id="" 
                      onChange={(e) => {
                        setSelectedRegionId(e.target.value);
                      }}
                      className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent">
                        <option value="" disabled>Sélectionner une région</option>
                        {regions.length > 0 ? (
                          regions.map((region) => (
                            <option value={region.id}>{region.nom}</option>
                          ))
                        ) : null}
                      </select>
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
                              className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white focus:outline-none focus:ring-0 focus:border-transparent"
                              autoComplete="off"
                              required
                              placeholder="Nom de la nouvelle région"
                            />
                          </div>
                          
                        </>
                      )}
                      
                      
                    </>
                  ) : field === "commune" ? (
                    <>
                    {!checkboxActive && (
                      <select defaultValue="" name="" id="" 
                      onChange={(e) => {
                        setSelectedCommuneId(e.target.value);
                      }}
                      className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent">
                        <option value="" disabled>Sélectionner une commune</option>
                        {communes.length > 0 ? (
                          communes.map((commune) => (
                            <option value={commune.id}>{commune.nom}</option>
                          ))
                        ) : null}
                      </select>
                    )}

                    {checkboxActive && (
                      <div className="mt-4">
                        <input
                          type="text"
                          name="commune"
                          value={formData.commune}
                          onChange={handleChange}
                          className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white focus:outline-none focus:ring-0 focus:border-transparent"
                          autoComplete="off"
                          required
                          placeholder="Nom du nouveau commune"
                        />

                        <input
                          type="text"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          className="w-full p-2 rounded bg-[#1c2d55] mt-4 border-[#1c2d55] text-white focus:outline-none focus:ring-0 focus:border-transparent"
                          autoComplete="off"
                          required
                          placeholder="District"
                        />
                      </div>
                    )}

                    </>
                    
                  ) : (
                    <input
                      type="text"
                      name={field}
                      value={formData[field as keyof typeof formData]}
                      onChange={handleChange}
                      className={`w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] ${field === "district" ? "hidden" : ""} focus:outline-none focus:ring-0 focus:border-transparent`}
                      required={field === "nom" }
                      autoComplete="off"
                    />
                  ) }
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

export default Addsite;
