import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../../service/Api";

interface AddCodeCouleurProps {
  setShowModalUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  codeId: number;
  initialData: {
    site: {
      id: number;
      nom: string;
    } | null;
    bgColor: string;
    textColor: string;
    btnColor: string;
    colorOne: string;
    colorTwo: string;
    isGlobal: boolean;
    isDefault: boolean;
    isActive: boolean;
    textColorHover: string;
    btnColorHover: string;
  };
  codeCouleur?: {
    isGlobal?: boolean | null;
    isDefault?: boolean | null;
  };
}


interface Site {
  id: number;
  nom: string;
}
const UpdateCodeCouleur: React.FC<AddCodeCouleurProps> = ({
  setShowModalUpdate,
  codeId,
  initialData,
  codeCouleur
}) => {
  const [formData, setFormData] = useState({
    site: initialData.site ? `/api/sites/${initialData.site.id}` : "",
    bgColor: initialData.bgColor,
    textColor: initialData.textColor,
    btnColor: initialData.btnColor,
    textColorHover: initialData.textColorHover,
    btnColorHover: initialData.btnColorHover,
    colorOne: initialData.colorOne,
    colorTwo: initialData.colorTwo,
   
  });

  const fieldLabels: { [key: string]: string } = {
    site: "Site",
    bgColor: "Couleur de fond",
    textColor: "Couleur du texte",
    btnColor: "Couleur du bouton",
    colorOne: "Couleur 1",
    colorTwo: "Couleur 2",
    textColorHover: "Couleur du text en survol",
    btnColorHover: "Couleur du bouton en survole"
  };

  const [siteListe, setSiteListe] = useState<Site[]>([]);

  const listeSite = async () => {
    try {
      const response = await api.get("/api/sites");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des sites");
      return [];
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const buildPayload = () => {
      const basePayload = codeCouleur?.isGlobal || codeCouleur?.isDefault
        ? (() => {
            const { site, ...rest } = formData;
            return rest;
          })()
        : formData;
    
      return {
        ...basePayload,
        isActive: initialData.isActive,
        isGlobal: initialData.isGlobal,
        isDefault: initialData.isDefault
      };
    };
    
    
    const payload = buildPayload();

    try {
      const response = await api.patch(`/api/code_couleurs/${codeId}`, payload,
        {
          headers: {
            'Content-Type': 'application/merge-patch+json'
          }
        }
      );
      Swal.fire({
        icon: "success",
        title: "Bon travail!",
        text: "Code couleur mis à jour avec succès !",
        confirmButtonColor: "#7c3aed",
        cancelButtonColor: "#ef4444",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Annuler",
        background: "#1c2d55",
        color: "#fff",
      }).then(() => {
        setShowModalUpdate(false);
        window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de la mise à jour du code couleur.",
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

  console.log("codeCouleur props:", codeCouleur);

  return (
    <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50 h-[100vh]">
      <div className="bg-[#111C44] border border-red-500 rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down h-[95vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-white">Modifier le code couleur</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(formData).map((field) => (
            <div key={field}>
             
             <label className="block text-gray-400 mb-1">
              {codeCouleur?.isGlobal !== true && codeCouleur?.isDefault !== true ? (
                 <>
                 {fieldLabels[field] || field}
                 {["site", "bgColor", "textColor", "btnColor"].includes(field) && (
                   <sup className="text-red-500">*</sup>
                 )}
               </>
              ) : (
                field === "site" ? null : (
                  <>
                    {fieldLabels[field] || field}
                    {["bgColor", "textColor", "btnColor"].includes(field) && (
                      <sup className="text-red-500">*</sup>
                    )}
                  </>
                )
              )}
            </label>

              {field === "site" ? (
                (codeCouleur?.isGlobal != true && codeCouleur?.isDefault != true) ? (
                  <select
                    name="site"
                    value={formData.site}
                    onChange={handleChange}
                    className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55]"
                    required
                  >
                  <option value="" disabled selected>Selectionner un site</option>
                  {siteListe.map((site) => (
                    <option key={site.id} value={`/api/sites/${site.id}`}>
                      {site.nom}
                    </option>
                  ))}
                </select>
                )  : (
                 null
                )
              ) : (
                <input
                  type="color"
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] cursor-pointer"
                  autoComplete="off"
                  required={["bgColor", "textColor", "btnColor"].includes(field)}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end">
            <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
              Enregistrer
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

export default UpdateCodeCouleur;
