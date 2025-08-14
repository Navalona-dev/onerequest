import React, { useEffect, useState } from "react";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import api from "../../../service/Api";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import { AxiosError } from "axios";

interface AddDepartementProps {
    setShowModalAdd: React.Dispatch<React.SetStateAction<boolean>>;
}

type Site = {
  id: number;
  nom: string;
  departements: [];
}

interface FormDepartementData {
    nom: string;
    nomEn: string;
    description: string;
    descriptionEn: string;
}

type Departement = {
  id: number;
  nom: string;
  nomEn: string;
}

  
  const AddDepartement: React.FC<AddDepartementProps> = ({ setShowModalAdd }) => {
    const [formData, setFormData] = useState<FormDepartementData>({
        nom: "",
        nomEn: "",
        description: "",
        descriptionEn: "",
    });

    const [site, setSite] = useState<Site | null>(null);
    const [departements, setListeDepartement] = useState<Departement[]>([]);

    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();
    const {codeCouleur} = useGlobalActiveCodeCouleur();
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;
    const [isFindDepartement, setIsFindDepartement] = useState(false);
    const [selectedDepartements, setSelectedDepartements] = useState<number[]>([]);

    const fieldLabels: { [key: string]: string } = {
        nom: t("nomFr"),
        nomEn: t("nomEn"),
        ordre: t("ordre"),
        description: t("descriptionFr"),
        descriptionEn: t("descriptionEn"),
      };

    const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsFindDepartement(e.target.checked);
    };

    const handleSelectDepartement = (id: number) => {
      setSelectedDepartements((prev) =>
        prev.includes(id) ? prev.filter((depId) => depId !== id) : [...prev, id]
      );
    };
    

    useEffect(() => {
      api.get('/api/departements')
      .then((response) => {
        setListeDepartement(response.data);
      })
      .catch((error) => console.log("Erreur API", error));
    }, []);

      const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        const { name, value } = e.target;
      
        setFormData((prev) => ({
          ...prev,
          [name]: name === "ordre" ? parseInt(value, 10) : value,
        }));
      };
      
      useEffect(() => {
        api.get('/api/sites/current')
        .then((response) => {
          setSite(response.data);
        })
        .catch((error) => console.log("Erreur API", error));
      }, []);

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = {};

        if (!site) {
          Swal.fire("Erreur", "Site introuvable", "error");
          return;
        }

        if (!isFindDepartement) {
          // Cas 1 : assignation de départements existants
          try {

          // 2 Extraire les IDs actuels
          /*const departementsExistants = site.departements.map(
            (dep: any) => `/api/departements/${dep.id}`
          );*/
          const departementsExistants = (site.departements ?? []).map(
            (dep: any) => `/api/departements/${dep.id}`
          );          

          // 3️ Fusionner sans doublons
          const nouveauxDepartements = selectedDepartements.map(
            (depId) => `/api/departements/${depId}`
          );
          const tousDepartements = Array.from(new Set([...departementsExistants, ...nouveauxDepartements]));

          // 4️ Envoyer le PATCH avec la liste fusionnée
          await api.patch(
            `/api/sites/${site.id}`,
            { departements: tousDepartements },
            {
              headers: {
                "Content-Type": "application/merge-patch+json"
              }
            }
          );
      
            Swal.fire("Succès", "Départements assignés au site", "success").then(() => {
              setShowModalAdd(false);
              window.location.reload();
            });
          } catch (error) {
            Swal.fire("Erreur", "Impossible d'assigner les départements", "error");
          }
        }else {
          payload.nom = formData.nom;
          payload.description = formData.description;
          payload.descriptionEn = formData.descriptionEn;
          payload.nomEn = formData.nomEn;
          payload.sites = site ? [`/api/sites/${site.id}`] : [];

          await api.post("/api/departements", payload);

        }
    
        try {
    
          Swal.fire({
            icon: "success",
            title: langueActive?.indice === "fr" ? "Bon travail!" : 
            langueActive?.indice === "en" ? "Good job !" : "",
            text: langueActive?.indice === "fr" ? "Departement ajouté avec succès !" : 
            langueActive?.indice === "en" ? "Department added successfully!" : "",
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
          
            let errorMessage = langueActive?.indice === "fr" ? "Erreur lors de l'ajout de departement." : 
            langueActive?.indice === "en" ? "Error while adding department." : "";
          
            if (error.response) {
              // Si une réponse est retournée par le backend
              const status = error.response.status;
              const backendMessage = error.response.data?.message;
          
              // Si le backend renvoie un message clair, on l’affiche
              if (backendMessage) {
                errorMessage = backendMessage;
              } else if (status == 400 || status == 422) {
                errorMessage = langueActive?.indice === "fr" ? "Un departement avec cet ordre existe déjà." : 
                langueActive?.indice === "en" ? "An department with this order already exists." : "";
              }
              else if (status === 404) {
                errorMessage = langueActive?.indice === "fr" ? "Departement introuvable." : 
                langueActive?.indice === "en" ? "Department not found" : "";
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
                    <h2 className="text-xl font-bold mb-4 text-white">{t("addDepartement")}</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                      {!isFindDepartement && (
                        <div className="mb-4 flex flex-col gap-2" id="dep_liste">
                        {departements.map((item) => {
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
                                checked={selectedDepartements.includes(item.id)}
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
                        checked={isFindDepartement}
                      />
                      <label htmlFor="depNonTrouve" className="text-gray-700 cursor-pointer">
                        {langueActive?.indice === "fr" ? "Departement n'existe pas encore?" : 
                        langueActive?.indice === "en" ? "Department doesn't exist yet?" : ""}
                      </label>
                    </div>
                        
                        {isFindDepartement && (
                          <div className="dep_form">
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
                              ) : (
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

export default AddDepartement;