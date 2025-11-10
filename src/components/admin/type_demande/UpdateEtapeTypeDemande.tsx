import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import api from "../../../service/Api";
import Swal from "sweetalert2";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";
import { Site } from "../Header";


type NiveauHierarchique = {
    id: number;
    nom: string;
    nomEn: string;
};

interface UpdateEtapeTypeDemandeProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  idEtapeTypeDemande: number;
  idTypeDemande: number;
  initialData: {
    ordre: string;
    title: string;
    titleEn: string;
    niveauHierarchique: NiveauHierarchique | null;
  };
}

const UpdateEtapeTypeDemande: React.FC<UpdateEtapeTypeDemandeProps> = ({
  setShowModal,
  idEtapeTypeDemande,
  idTypeDemande,
  initialData
}) => {

const [formData, setFormData] = useState({
    ordre: initialData.ordre,
    title: initialData.title,
    titleEn: initialData.titleEn,
    niveauHierarchique: initialData.niveauHierarchique ? `/api/niveau_hierarchiques/${initialData.niveauHierarchique.id}` : "",

    });

  const { langueActive } = useLangueActive();
  const { t } = useTranslation();
  const state = store.getState();
  const { save } = state.actionTexts;
  const [niveaux, setListeNiveau] = useState<NiveauHierarchique[]>([]);
  const { codeCouleur } = useGlobalActiveCodeCouleur();
  const [site, setSite] = useState<Site | null>(null);

  const fieldLabels: { [key: string]: string } = {
    title: t("titreFr"),
    titleEn: t("titreEn"),
    ordre: t("ordre"),
    niveauHierarchique: t("niveauhierarchique"),
  };

  // Récupérer la liste des niveaux
  useEffect(() => {
    api.get("/api/niveau_hierarchiques/get-liste-active")
      .then((response) => setListeNiveau(response.data))
      .catch((error) => console.log("Erreur API", error));
  }, []);

  // Charger les données de l'étape existante
  useEffect(() => {
    if (!idEtapeTypeDemande) return;
  
    api.get(`/api/type_demande_etapes/${idEtapeTypeDemande}`)
      .then((response) => {
        const etape = response.data;
        setFormData({
          ordre: etape.ordre,
          title: etape.title,
          titleEn: etape.titleEn,
          // Ici on met la valeur comme dans le select
          niveauHierarchique: etape.niveauHierarchique
            ? `/api/niveau_hierarchiques/${etape.niveauHierarchique.id}`
            : "",
        });
      })
      .catch((error) => console.log("Erreur API", error));
  }, [idEtapeTypeDemande]);

  useEffect(() => {
    api.get('/api/sites/current')
    .then((response) => {
      setSite(response.data);
    })
    .catch((error) => console.log("Erreur API", error));
  }, []);
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, multiple } = e.target as HTMLSelectElement;

    if (multiple) {
      const values = Array.from(
        (e.target as HTMLSelectElement).selectedOptions,
        (option) => option.value
      );
      setFormData((prev) => ({ ...prev, [name]: values }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      title: formData.title,
      titleEn: formData.titleEn,
      ordre: formData.ordre,
      typeDemande: `/api/type_demandes/${idTypeDemande}`,
      niveauHierarchique: formData.niveauHierarchique,
      site: `/api/sites/${site?.id}`
    };

    try {
      await api.patch(`/api/type_demande_etapes/${idEtapeTypeDemande}`, payload,
        {
            headers: {
              'Content-Type': 'application/merge-patch+json'
            }
          }
      );

      Swal.fire({
        icon: "success",
        title:
          langueActive?.indice === "fr"
            ? "Bon travail!"
            : langueActive?.indice === "en"
            ? "Good job!"
            : "",
        text:
          langueActive?.indice === "fr"
            ? "Étape type de demande mise à jour avec succès !"
            : langueActive?.indice === "en"
            ? "Step request type updated successfully!"
            : "",
        confirmButtonColor: "#7c3aed",
        background: "#1c2d55",
        color: "#fff",
      }).then(() => {
        setShowModal(false);
        window.location.reload();
      });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      let errorMessage =
        langueActive?.indice === "fr"
          ? "Erreur lors de la mise à jour de l'étape type de demande."
          : "An error occurred while updating the step request type.";

      if (error.response) {
        const status = error.response.status;
        const backendMessage = error.response.data?.message;

        if (backendMessage) errorMessage = backendMessage;
        else if (status === 400) {
            errorMessage = langueActive?.indice === "fr" ? "L'ordre existe déjà pour ce site et ce type de demande." : 
            langueActive?.indice === "en" ? "The order already exists for this site and this type of request." : "";
        }
        else if (status === 404)
          errorMessage =
            langueActive?.indice === "fr"
              ? "Étape type de demande introuvable."
              : "Step request type not found.";
        else if (status === 401)
          errorMessage =
            langueActive?.indice === "fr"
              ? "Non autorisé. Veuillez vous reconnecter."
              : "Unauthorized. Please log in again.";
        else if (status === 500)
          errorMessage =
            langueActive?.indice === "fr"
              ? "Erreur serveur. Réessayez plus tard."
              : "Server error. Please try again later.";
      }

      await Swal.fire({
        icon: "error",
        title: langueActive?.indice === "fr" ? "Erreur" : "Error",
        text: errorMessage,
        confirmButtonColor: "#ef4444",
        background: "#1c2d55",
        color: "#fff",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50 ">
      <div
        className="bg-[#111C44] border rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down"
        style={{ borderColor: codeCouleur?.btnColor }}
      >
        <h2 className="text-xl font-bold mb-4 text-white">
          {t("updatetypedemandetitle")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(formData).map((field) => (
            <div key={field}>
              <label className="block text-gray-400 mb-1">
                {fieldLabels[field] || field}
                <sup className="text-red-500">*</sup>
              </label>

              {field === "ordre" ? (
                <input
                  type="number"
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white focus:outline-none focus:ring-0 focus:border-transparent mb-5"
                  required
                />
              ) : field === "niveauHierarchique" ? (
                <select
                  id="niveauHierarchiques"
                  name="niveauHierarchique"
                  value={formData.niveauHierarchique}
                  onChange={handleChange}
                  className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                  required
                >
                  <option value="" disabled>
                    {t("selectNiveau")}
                  </option>
                  {niveaux.map((niv) => (
                    <option
                      key={niv.id}
                      value={`/api/niveau_hierarchiques/${niv.id}`}
                    >
                      {langueActive?.indice === "fr"
                        ? niv.nom
                        : langueActive?.indice === "en"
                        ? niv.nomEn
                        : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white focus:outline-none focus:ring-0 focus:border-transparent mb-5"
                  autoComplete="off"
                  required
                />
              )}
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              className="text-white px-4 py-2 rounded"
            >
              {langueActive?.indice === "fr"
                ? save.fr.upperText
                : langueActive?.indice === "en"
                ? save.en.upperText
                : ""}
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

export default UpdateEtapeTypeDemande;
