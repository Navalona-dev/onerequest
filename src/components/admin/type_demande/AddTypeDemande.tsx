import React, {useEffect, useState} from "react";
import { AxiosError } from "axios";
import api from "../../../service/Api";
import Swal from "sweetalert2";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

interface AddTypeDemandeProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
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

const AddTypeDemande: React.FC<AddTypeDemandeProps> = ({ setShowModal }) => {
    const [formData, setFormData] = useState({
        domaine: "",
        nom: "",
        nomEn: "",
        sites: [] as string[],
        description: "",
        descriptionEn: "",
    });

    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;
    const [siteListe, setListeSite] = useState<Site[]>([]);
    const {codeCouleur} = useGlobalActiveCodeCouleur();
    const [isFindTypeDemande, setIsFindTypeDemande] = useState(false);
    const [site, setSite] = useState<Site | null>(null);
    const [selectedTypeDemandes, setSelectedTypeDemandes] = useState<number[]>([]);
    const [typeDemandes, setListeTypeDemande] = useState<TypeDemande[]>([])

    const fieldLabels: { [key: string]: string } = {
        domaine: t("domaineentreprise"),
        nom: t("nomFr"),
        nomEn: t("nomEn"),
        sites: "Sites",
        description: t("descriptionFr"),
        descriptionEn: t("descriptionEn")
      };

  const [domaineListe, setDomaineListe] = useState<{ id: number; libelle?: string; libelleEn: string }[]>([]);

    const listeDomaine = async () => {
      try {
        const response = await api.get('/api/entreprises/domaines');
        const sites = response.data;
        return sites;
      } catch (error) {
        return 0;
      }
    };

    const listeSite = async () => {
      try {
        const response = await api.get("/api/sites");
        const sites = response.data;
        return sites;
      } catch (error) {
        return 0;
      }
    };

    const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsFindTypeDemande(e.target.checked);
    };

    const handleSelectTypeDemandes = (id: number) => {
      setSelectedTypeDemandes((prev) =>
        prev.includes(id) ? prev.filter((typeId) => typeId !== id) : [...prev, id]
      );
    };

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

    useEffect(() => {
      api.get('/api/sites/current')
      .then((response) => {
        setSite(response.data);
      })
      .catch((error) => console.log("Erreur API", error));
    }, []);

    useEffect(() => {
      
      api.get(`/api/entreprises/type-demandes`)
      .then((response) => {
          setListeTypeDemande(response.data)
      } )
      .catch((error) => console.log("Erreur API", error));
  }, []);
    
      
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!site) {
          Swal.fire("Erreur", "Site introuvable", "error");
          return;
        }

        if (!isFindTypeDemande) {
          // Cas 1 : assignation de type de demande existants
          try {

          // 2 Extraire les IDs actuels
        
          const typesExistants = (site.typeDemandes ?? []).map(
            (type: any) => `/api/type_demandes/${type.id}`
          );   

          // 3️ Fusionner sans doublons
          const nouveauxTypeDemandes = selectedTypeDemandes.map(
            (typeId) => `/api/type_demandes/${typeId}`
          );

          const tousTypeDemandes = Array.from(new Set([...typesExistants, ...nouveauxTypeDemandes]));

          // 4️ Envoyer le PATCH avec la liste fusionnée
          await api.patch(
            `/api/sites/${site.id}`,
            { typeDemandes: tousTypeDemandes },
            {
              headers: {
                "Content-Type": "application/merge-patch+json"
              }
            }
          );
      
            Swal.fire("Succès", "Départements assignés au site", "success").then(() => {
              setShowModal(false);
            });
          } catch (error) {
            Swal.fire("Erreur", "Impossible d'assigner les départements", "error");
          }
        } else {
          const response = await api.post("/api/type_demandes", formData);

        }
    
        try {
    
          Swal.fire({
            icon: "success",
            title: langueActive?.indice === "fr" ? "Bon travail!" : 
            langueActive?.indice === "en" ? "Good job !" : "",
            text: langueActive?.indice === "fr" ? "Type de demande ajouté avec succès !" : 
            langueActive?.indice === "en" ? "Request type added successfully!" : "",
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
          
            let errorMessage = langueActive?.indice === "fr" ? "Erreur lors de l'ajout de type de demande." : 
            langueActive?.indice === "en" ? "An error occurred while adding the request type." : "";
          
            if (error.response) {
              // Si une réponse est retournée par le backend
              const status = error.response.status;
              const backendMessage = error.response.data?.message;
          
              // Si le backend renvoie un message clair, on l’affiche
              if (backendMessage) {
                errorMessage = backendMessage;
              } else if (status == 400) {
              }
              else if (status === 404) {
                errorMessage = langueActive?.indice === "fr" ? "Type de demande introuvable." : 
                langueActive?.indice === "en" ? "Request type not found" : "";
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

      useEffect(() => {
        const fetchDomaineListe = async () => {
          const liste = await listeDomaine();
          setDomaineListe(liste);
        };

        const fetchSiteListe = async () => {
          const liste = await listeSite();
          setListeSite(liste);
        };

        fetchDomaineListe();
        fetchSiteListe();
      }, []);

      return (
        <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50 h-[100vh]">
          <div className="bg-[#111C44] border rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down h-[95vh] overflow-y-auto"
           style={{
            borderColor: codeCouleur?.btnColor
          }}
          >
            <h2 className="text-xl font-bold mb-4 text-white">{t("addtypedemandetitle")}</h2>
    
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isFindTypeDemande && (
                  <div className="mb-4 flex flex-col gap-2" id="dep_liste">
                  {typeDemandes.map((item) => {
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
                          checked={selectedTypeDemandes.includes(item.id)}
                          onChange={() => handleSelectTypeDemandes(item.id)}
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
                        checked={isFindTypeDemande}
                      />
                      <label htmlFor="depNonTrouve" className="text-gray-700 cursor-pointer">
                        {langueActive?.indice === "fr" ? "Departement n'existe pas encore?" : 
                        langueActive?.indice === "en" ? "Department doesn't exist yet?" : ""}
                      </label>
                    </div>
                    {isFindTypeDemande && (
                      <div>
                        {Object.keys(formData).map((field) =>
                          <div key={field}>
                            <label className="block text-gray-400 mb-1">
                              {fieldLabels[field] || field}
                              {(field === "nom" || field === "description" || field === "sites" || field === "domaine") ? (
                                <sup className="text-red-500">*</sup>
                              ): null}
                              
                            </label>
                            {field === "domaine" ? (
                              <select
                                  name="domaine"
                                  value={formData.domaine}
                                  onChange={handleChange}
                                  className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                                  required
                              >
                                  <option value="" disabled>{t("selectdomaine")}</option>
                                  {domaineListe.map((item) => (
                                  <option key={item.id} value={`/api/domaine_entreprises/${item.id}`} className="mt-3">
                                      {langueActive?.indice === "fr" ? item.libelle : langueActive?.indice === "en" ? item.libelleEn : ""}
                                  </option>
                                  ))}
                              </select>
                              ) : (
                              field === "description" ? (
                                  <textarea name="description" id=""
                                      value={formData.description}
                                      onChange={handleChange}
                                      className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white focus:outline-none focus:ring-0 focus:border-transparent"
                                      required
                                      rows={5}
                                  >

                                  </textarea>
                              ) : field === "descriptionEn" ? (
                                  <textarea name="descriptionEn" id=""
                                      value={formData.descriptionEn}
                                      onChange={handleChange}
                                      className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white focus:outline-none focus:ring-0 focus:border-transparent"
                                      required
                                      rows={5}
                                  >

                                  </textarea>
                              ) : field === "sites" ? (
                                <select
                                  name="sites"
                                  multiple
                                  value={formData.sites}
                                  onChange={handleChange}
                                  className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                                  required
                              >
                                  <option value="" disabled>{t("selectsite")}</option>
                                  {siteListe.map((site) => (
                                  <option key={site.id} value={`/api/sites/${site.id}`} className="mt-3">
                                      {site.nom} {site.region && site.commune ? (
                                        <span>({site.region?.nom} / {site.commune?.nom})</span>
                                      ) : null} 
                                  </option>
                                  ))}
                              </select>
                              ) : ( 
                              <input
                                  type="text"
                                  name={field}
                                  value={formData[field as keyof typeof formData]}
                                  onChange={handleChange}
                                  className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white focus:outline-none focus:ring-0 focus:border-transparent"
                                  autoComplete="off"
                                  required={field === "nom"}
                              />
                              ))}
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

export default AddTypeDemande;
