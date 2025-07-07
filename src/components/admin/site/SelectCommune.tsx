import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import api from "../../../service/Api";
import { store } from "../../../store";

type RegionType = {
    id: number;
    nom: string;
}

type CommuneType = {
    id: number;
    nom: string;
    district: string;
    region: RegionType;
}
interface SelectCommuneProps {
  setShowModalSelectCommune: React.Dispatch<React.SetStateAction<boolean>>;
  siteId: number;
  regionId: number;
}

const SelectCommune: React.FC<SelectCommuneProps> = ({ setShowModalSelectCommune, siteId, regionId }) => {
    const [formData, setFormData] = useState({
        nom: "",
        district: ""
    });

    const [communes, setListeCommune] = useState<CommuneType []>([]);
    const [checkboxActive, setCheckboxActive] = useState(false);
    const [selectedCommuneId, setSelectedCommuneId] = useState<string>("");
    const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
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

        const payload: any = {};

        if (checkboxActive && formData.nom.trim() !== "" && formData.district.trim() !== "") {
            payload.commune_nom = formData.nom;
            payload.district = formData.district;
            payload.region_id = regionId;

          } else if (!checkboxActive && selectedCommuneId) {
            payload.commune_id = parseInt(selectedCommuneId);
          } else {
            Swal.fire({ icon: "error", text: "Veuillez saisir la commune et le district." });
            return;
          }
    
        try {
        await api.post(`/api/sites/${siteId}/select-commune`, payload);
    
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
            setShowModalSelectCommune(false);
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

      useEffect(() => {
        api.get(`/api/regions/${regionId}/communes`)
        .then((response) => {
            setListeCommune(response.data)
        })
        .catch((error) => console.log("Erreur API", error));
      }, []);

      return (
        <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50">
          <div className="bg-[#111C44] border rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down"
          style={{
            borderColor: codeCouleur?.btnColor
          }}
          >
            <h2 className="text-xl font-bold mb-4 text-white">Séléctionner un commune</h2>
    
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                 
                 {!checkboxActive && 
                     (
                       <>
                        <label className="block text-gray-400 mb-1">
                            Commune
                        </label>
                        <select defaultValue="" name="" id="" 
                        value={selectedCommuneId}
                        onChange={(e) => {
                            setSelectedCommuneId(e.target.value);
                        }}
                        className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent">
                            <option value="" disabled>Sélectionner un commune</option>
                            {communes.length > 0 ? (
                            communes.map((commune) => (
                                <option value={commune.id}>{commune.nom}</option>
                            ))
                            ) : null}
                        </select>
                       </>
                     )}

                    <div className="my-4">
                        <input 
                            type="checkbox" 
                            name="is_not_in_list" 
                            id="is_not_in_list"
                            checked={checkboxActive}
                            onChange={() => setCheckboxActive((prev) => !prev)}
                        />
                        <label htmlFor="is_not_in_list" className="text-white ml-3">Commune non trouvé ?</label>
                    </div>
                    
                   {checkboxActive && (
                       <>
                           <div>
                               <label className="block text-gray-400 mb-1 text-white">Nom</label>
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
                           <div className="mt-3">
                               <label className="block text-gray-400 mb-1 text-white">District</label>
                               <input
                                   type="text"
                                   name="district"
                                   value={formData.district}
                                   onChange={handleChange}
                                   className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                                   required
                                   autoComplete="off"
                                   
                                   />
                           </div>
                       </>
                   )}
               </div>


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
              onClick={() => setShowModalSelectCommune(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-lg py-1 px-2 rounded"
              aria-label="Close modal"
            >
              <i className="bi bi-x-circle-fill text-white"></i>
            </button>
          </div>
        </div>
      );
};

export default SelectCommune;
