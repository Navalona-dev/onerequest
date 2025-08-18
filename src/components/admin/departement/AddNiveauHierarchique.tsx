import React, { useEffect, useState } from "react";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import api from "../../../service/Api";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import { AxiosError } from "axios";
import { error } from "console";

interface AddNiveauProps {
    setShowModalAdd: React.Dispatch<React.SetStateAction<boolean>>;
    idDepartement: number;
}

type Departement = {
    id: number;
    nom: string;
    nomEn: string;
    niveauHierarchiques: [];
}

type NiveauHierarchique = {
  id: number;
  nom: string;
  nomEn: string
}


const AddNiveauHierarchique: React.FC<AddNiveauProps> = ({ setShowModalAdd, idDepartement }) => {
    const [formData, setFormData] = useState({
        nom: "",
        nomEn: "",
        description: "",
        descriptionEn: "",
    });

    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();
    const {codeCouleur} = useGlobalActiveCodeCouleur();
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;
    const [niveaux, setListeNiveau] = useState<NiveauHierarchique[]>([]);
    const [isFindNiveau, setIsFindNiveau] = useState(false);
    const [selectedNiveaux, setSelectedNiveaux] = useState<number[]>([]);
    const [departement, setDepartement] = useState<Departement | null>(null);

    const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsFindNiveau(e.target.checked);
    };

    const handleSelectDepartement = (id: number) => {
      setSelectedNiveaux((prev) =>
        prev.includes(id) ? prev.filter((niveauId) => niveauId !== id) : [...prev, id]
      );
    };

    useEffect(() => {
      api.get('/api/niveau_hierarchiques')
      .then((response) => {
        setListeNiveau(response.data);
      })
      .catch((error) => console.log('Erreur API', error));
    }, []);

    useEffect(() => {
      api.get(`/api/departements/${idDepartement}`)
      .then((response) => {
        setDepartement(response.data);
      })
      .catch((error) => console.log("Erreur API", error));
    }, [idDepartement]);

    const fieldLabels: { [key: string]: string } = {
        nom: t("nomFr"),
        nomEn: t("nomEn"),
        ordre: t("ordre"),
        description: t("descriptionFr"),
        descriptionEn: t("descriptionEn"),
      };


      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
      
        if (e.target instanceof HTMLSelectElement && e.target.multiple) {
          const values = Array.from(e.target.selectedOptions, option => option.value);
          setFormData(prev => ({ ...prev, [name]: values }));
        } else {
          setFormData(prev => ({ ...prev, [name]: value }));
        }
      };      
      

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = {};

        if (!departement) {
          Swal.fire("Erreur", "Departement introuvable", "error");
          return;
        }

        if (!isFindNiveau) {
          // Cas 1 : assignation de niveau hierarchique existants
          try {
            console.log("hello");

          // 2 Extraire les IDs actuels
          /*const niveauxExistants = departement.niveauHierarchiques.map(
            (niveau: any) => `/api/niveau_hierarchiques/${niveau.id}`
          );*/
          const niveauxExistants = (departement.niveauHierarchiques ?? []).map(
            (niveau: any) => `/api/niveau_hierarchiques/${niveau.id}`
          );          

          // 3️ Fusionner sans doublons
          const nouveauxNiveaux = selectedNiveaux.map(
            (niveauId) => `/api/niveau_hierarchiques/${niveauId}`
          );
          const tousNiveauHierarchiques = Array.from(new Set([...niveauxExistants, ...nouveauxNiveaux]));

          // 4️ Envoyer le PATCH avec la liste fusionnée
          await api.patch(
            `/api/departements/${departement.id}`,
            { niveauHierarchiques: tousNiveauHierarchiques },
            {
              headers: {
                "Content-Type": "application/merge-patch+json"
              }
            }
          );
      
            Swal.fire("Succès", "Niveau hierarchique assignés au departement", "success").then(() => {
              setShowModalAdd(false);
            });
          } catch (error) {
            Swal.fire("Erreur", "Impossible d'assigner les départements", "error");
          }
        }else {
          payload.nom = formData.nom;
          payload.description = formData.description;
          payload.descriptionEn = formData.descriptionEn;
          payload.nomEn = formData.nomEn;
          payload.departements = [`/api/departements/${idDepartement}`];
          await api.post("/api/niveau_hierarchiques", payload);

        }
        
    
        try {
    
          Swal.fire({
            icon: "success",
            title: langueActive?.indice === "fr" ? "Bon travail!" : 
            langueActive?.indice === "en" ? "Good job !" : "",
            text: langueActive?.indice === "fr" ? "Niveau hierarchique ajouté avec succès !" : 
            langueActive?.indice === "en" ? "Hierarchy Levels added successfully!" : "",
            confirmButtonColor: "#7c3aed", // violet
            cancelButtonColor: "#ef4444", // rouge
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: langueActive?.indice === "en" ? "Cancel" : langueActive?.indice === "fr" ? "Annuler" : "",
            background: "#1c2d55",
            color: "#fff",
          }).then(() => {
            setShowModalAdd(false);
            window.location.reload();
          });
          
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
          
            let errorMessage = langueActive?.indice === "fr" ? "Erreur lors de l'ajout de niveau hierarchique." : 
            langueActive?.indice === "en" ? "Error while adding Hierarchy Levels." : "";
          
            if (error.response) {
              // Si une réponse est retournée par le backend
              const status = error.response.status;
              const backendMessage = error.response.data?.message;
          
              // Si le backend renvoie un message clair, on l’affiche
              if (backendMessage) {
                errorMessage = backendMessage;
              } else if (status == 400 || status == 422) {
                errorMessage = langueActive?.indice === "fr" ? "Un niveau hierarchique avec cet ordre existe déjà." : 
                langueActive?.indice === "en" ? "An Hierarchy Levels with this order already exists." : "";
              }
              else if (status === 404) {
                errorMessage = langueActive?.indice === "fr" ? "Niveau hierarchique introuvable." : 
                langueActive?.indice === "en" ? "Hierarchy Levels not found" : "";
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
    return(
        <>
        <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50 h-[100vh]">
                <div className="bg-[#111C44] border rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down h-[95vh] overflow-y-auto"
                style={{
                    borderColor: codeCouleur?.btnColor
                }}
                >
                    <h2 className="text-xl font-bold mb-4 text-white">{t("addNiveauHierarchique")}</h2>
            
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {!isFindNiveau && (
                          <div className="mb-4 flex flex-col gap-2" id="dep_liste">
                          {niveaux.map((item) => {
                            const id = `departement-${item.id}`;
                            const nomAffiche =
                              langueActive?.indice === "fr"
                                ? item.nom
                                : langueActive?.indice === "en"
                                ? item.nomEn
                                : "";

                            return (
                              <div key={id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={id}
                                  checked={selectedNiveaux.includes(item.id)}
                                  onChange={() => handleSelectDepartement(item.id)}
                                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={id}
                                  className="text-gray-300 cursor-pointer select-none"
                                >
                                  {nomAffiche}
                                </label>
                              </div>
                            );
                          })}

                        </div>
                        )}

                      <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4" role="alert">
                        <input 
                          type="checkbox" 
                          name="depNonTrouve" 
                          id="depNonTrouve" 
                          className="mr-1" 
                          onChange={handleCheckBox} 
                          checked={isFindNiveau}
                        />
                        <label htmlFor="depNonTrouve" className="text-gray-700 cursor-pointer">
                          {langueActive?.indice === "fr" ? "Niveau hierarchique n'existe pas encore?" : 
                          langueActive?.indice === "en" ? "Hierarchical level doesn't exist yet?" : ""}
                        </label>
                      </div>

                        {isFindNiveau && (
                          <div className="niveau_form">
                            {Object.keys(formData).map((field) =>
                                <div key={field}>
                                    <label className="block text-gray-400 mb-1">
                                        {fieldLabels[field] || field} 
                                        <sup className="text-red-500">*</sup>
                                    </label>
                                {field === "description" || field === "descriptionEn" ? (
                                    <textarea
                                    name={field}
                                    value={formData[field as keyof typeof formData]}
                                    onChange={handleChange}
                                    className="mb-3 w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                                    rows={4}
                                    required
                                    />
                                ) :  (
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData[field as keyof typeof formData]}
                                        onChange={handleChange}
                                        className={`mb-3 w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent`}
                                        required
                                        autoComplete="off"
                                    />
                                ) }
                                </div>
                            )}
                          </div>
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
                        onClick={() => setShowModalAdd(false)}
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-lg py-1 px-2 rounded"
                        aria-label="Close modal"
                        >
                        <i className="bi bi-x-circle-fill text-white"></i>
                    </button>
                </div>
            </div>
        </>
    )
}

export default AddNiveauHierarchique;