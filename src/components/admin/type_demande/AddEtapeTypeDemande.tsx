import React, {useEffect, useState} from "react";
import { AxiosError } from "axios";
import api from "../../../service/Api";
import Swal from "sweetalert2";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

interface AddEtapeTypeDemandeProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  idTypeDemande: number
}

type Region = {
  id: number;
  nom: string;
}

type Commune = {
  id: number;
  nom: string;
}

type Site = {
  id: number;
  nom: string;
  region: Region | null;
  commune: Commune | null;
  typeDemandes: [];
}

type TypeDemande = {
  id: number;
  nom: string;
  description: string;
  isActive: boolean;
  nomEn: string;
  descriptionEn: string;
}

type NiveauHierarchique = {
  id: number;
  nom: string;
  nomEn: string;
}

const AddEtapeTypeDemande: React.FC<AddEtapeTypeDemandeProps> = ({ setShowModal, idTypeDemande }) => {
  const [formData, setFormData] = useState({
    ordre: "",
    title: "",
    titleEn: "",
    niveauHierarchique: "" 
  });

    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;
    const [siteListe, setListeSite] = useState<Site[]>([]);
    const {codeCouleur} = useGlobalActiveCodeCouleur();
    const [site, setSite] = useState<Site | null>(null);
    const [typeDemande, setTypeDemande] = useState<TypeDemande | null>(null);
    const [niveaux, setListeNiveau] = useState<NiveauHierarchique[]>([]);

    const fieldLabels: { [key: string]: string } = {
        title: t("titreFr"),
        titleEn: t("titreEn"),
        ordre: t("ordre"),
        niveauHierarchique: t("niveauhierarchique")
      };

      useEffect(() => {
        if(!idTypeDemande) return;

        api.get(`/api/type_demandes/${idTypeDemande}`)
        .then((response) => {
          setTypeDemande(response.data);
        })
        .catch((error) => console.log("Erreur API", error));
      }, [idTypeDemande])

      useEffect(() => {
        api.get('/api/sites/current')
        .then((response) => {
          setSite(response.data);
        })
        .catch((error) => console.log("Erreur API", error));
      }, []);

      useEffect(() => {
        api.get('/api/niveau_hierarchiques/get-liste-active')
        .then((response) => {
          setListeNiveau(response.data);
        })
        .catch((error) => console.log("Erreur API", error));
      }, []);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { name, value, multiple } = e.target as HTMLSelectElement;
    
      if (multiple) {
        const values = Array.from((e.target as HTMLSelectElement).selectedOptions, option => option.value);
        setFormData(prev => ({ ...prev, [name]: values }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    };

      
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = {};

        payload.title = formData.title;
        payload.titleEn = formData.titleEn;
        payload.ordre = formData.ordre;
        payload.site = `/api/sites/${site?.id}`;
        payload.typeDemande = `/api/type_demandes/${idTypeDemande}`;
        payload.niveauHierarchique = formData.niveauHierarchique;
    
        try {

          await api.post("/api/type_demande_etapes", payload);
    
          Swal.fire({
            icon: "success",
            title: langueActive?.indice === "fr" ? "Bon travail!" : 
            langueActive?.indice === "en" ? "Good job !" : "",
            text: langueActive?.indice === "fr" ? "Étape type de demande ajouté avec succès !" : 
            langueActive?.indice === "en" ? "Step Request type added successfully!" : "",
            confirmButtonColor: "#7c3aed", // violet
            cancelButtonColor: "#ef4444", // rouge
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: langueActive?.indice === "en" ? "Cancel" : langueActive?.indice === "fr" ? "Annuler" : "",
            background: "#1c2d55",
            color: "#fff",
          }).then(() => {
            setShowModal(false);
            window.location.reload();
          });
          
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
          
            let errorMessage = langueActive?.indice === "fr" ? "Erreur lors de l'ajout de étape type de demande." : 
            langueActive?.indice === "en" ? "An error occurred while adding the step request type." : "";
          
            if (error.response) {
              // Si une réponse est retournée par le backend
              const status = error.response.status;
              const backendMessage = error.response.data?.message;
          
              // Si le backend renvoie un message clair, on l’affiche
              if (backendMessage) {
                errorMessage = backendMessage;
              } else if (status == 400) {
                errorMessage = langueActive?.indice === "fr" ? "L'ordre existe déjà pour ce site et ce type de demande." : 
                langueActive?.indice === "en" ? "The order already exists for this site and this type of request." : "";
              }
              else if (status === 404) {
                errorMessage = langueActive?.indice === "fr" ? "Étape type de demande introuvable." : 
                langueActive?.indice === "en" ? "Step request type not found" : "";
              } else if (status === 401) {
                errorMessage = langueActive?.indice === "fr" ? "Non autorisé. Veuillez vous reconnecter." : 
                langueActive?.indice === "en" ? "Unauthorized. Please log in again." : "";
              } else if (status === 500) {
                errorMessage = langueActive?.indice === "fr" ? "Erreur serveur. Réessayez plus tard." : 
                langueActive?.indice === "en" ? "Server error. Please try again later." : "";
              }
              // Tu peux rajouter d'autres cas ici si besoin
            } else {
              // Pas de réponse du serveur (ex: problème de réseau)
            }
          
            await Swal.fire({
              icon: "error",
              title: langueActive?.indice === "fr" ? "Erreur" : langueActive?.indice === "en" ? "Error" : "",
              text: errorMessage,
              confirmButtonColor: "#ef4444",
              background: "#1c2d55",
              color: "#fff",
            });
          }
          
      };

      return (
        <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50 ">
          <div className="bg-[#111C44] border rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down"
           style={{
            borderColor: codeCouleur?.btnColor
          }}
          >
            <h2 className="text-xl font-bold mb-4 text-white">{t("addtypedemandetitle")}</h2>
    
            <form onSubmit={handleSubmit} className="space-y-4">

                      <div>
                        {Object.keys(formData).map((field) =>
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
                                    <option value="" disabled>{t("selectNiveau")}</option>
                                    {niveaux.map((niv) => (
                                    <option key={niv.id} value={`/api/niveau_hierarchiques/${niv.id}`}>
                                        {langueActive?.indice === "fr" ? niv.nom : langueActive?.indice === "en" ? niv.nomEn : ""}
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
                        )}
                      </div>

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

      {}
};

export default AddEtapeTypeDemande;
