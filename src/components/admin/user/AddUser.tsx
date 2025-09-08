import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../../store";
import api from "../../../service/Api";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useLangueActive } from "../../../hooks/useLangueActive";

interface AddUserProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

type Departement = {
  id: number;
  nom: string;
  nomEn: string;
}

type Site = {
  id: number;
  nom: string;
}

type Niveau = {
  id: number;
  nom: string;
  nomEn: string;
}

type Privilege = {
  id: number;
  title: string;
  libelleFr: string;
  libelleEn: string;
}

const AddUser: React.FC<AddUserProps> = ({ setShowModal }) => {
    const [formData, setFormData] = useState({
        site: "",
        departement: "",
        niveauHierarchique: "",
        nom: "",
        prenom: "",
        email: "",
        privileges: [] as string[]
    });

    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();

    const fieldLabels: { [key: string]: string } = {
        site: "Site",
        departement: t("departement"),
        nom: t("nom"),
        prenom: t("prenom"),
        email: t("mail"),
        //privileges: t("privileges"),
        niveauHierarchique: t("niveauhierarchique")
      };

      const [siteListe, setSiteListe] = useState<{ id: number; nom?: string; libelle?: string }[]>([]);
      const [privilegeListe, setPrivilegeListe] = useState<{ id: number; title?: string; description?: string; libelleFr: string; libelleEn: string; }[]>([]);
      const {codeCouleur} = useGlobalActiveCodeCouleur();
      const state = store.getState();
      const { create, delete: deleteAction, edit, activate, deactivate, save } = state.actionTexts;
      const [selectedSite, setSelectedSite] = useState<{id: number; nom?: string} | null>(null);
      const [departements, setListeDepartement] = useState<Departement[]>([]);
      const [site, setSite] = useState<Site | null>(null);
      const [niveaus, setListeNiveau] = useState<Niveau[]>([]);
      const [idDepartement, setIdDepartement] = useState<number | null>(null);
      const [privilege, setPrivilege] = useState<Privilege|null>(null);
      const [isPrivilege, setIsPrivilege] = useState(false);

    const listeSite = async () => {
      try {
        const response = await api.get("/api/sites");
        const sites = response.data;
        return sites;
      } catch (error) {
        return 0;
      }
    };

    useEffect(() => {
      api.get('/api/sites/current')
      .then((response) => {
          setSite(response.data)
      })
      .catch((error) => console.log("Erreur API", error));

      if (!site?.id) return;
      api.get(`/api/sites/${site?.id}/departements`)
      .then((response) => {
          setListeDepartement(response.data)
      })
      .catch((error) => console.log("Erreur API", error));
      
  }, [site?.id]);

 

    const listePrivilege = async () => {
        try {
          const response = await api.get("/api/privileges");
          const privileges = response.data;
          return privileges;
        } catch (error) {
          return 0;
        }
      };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, multiple } = e.target;
      
        if (multiple) {
          const target = e.target as HTMLSelectElement;
          const values = Array.from(target.selectedOptions, option => option.value);
          setFormData(prev => ({ ...prev, [name]: values }));
        } else {
          setFormData(prev => ({ ...prev, [name]: value }));
      
          if (name === "site") {
            const foundSite = siteListe.find(s => `/api/sites/${s.id}` === value);
            setSelectedSite(foundSite || null);
          }
      
          if (name === "departement") {
            const depId = parseInt(value.split("/").pop() || "0", 10);
            setIdDepartement(depId);
          }
      
          if (name === "niveauHierarchique") {
            const nivId = parseInt(value.split("/").pop() || "0", 10);
      
            // Charger le niveau hiérarchique pour récupérer le privilège associé
            api.get(`/api/niveau_hierarchiques/${nivId}`)
              .then((res) => {
                const niveau = res.data;
      
                if (niveau.privilege) {
                  // 👉 tu mets dans privilege (useState séparé)
                  setPrivilege({
                    id: niveau.privilege.id,
                    title: niveau.privilege.title,
                    libelleFr: niveau.privilege.libelleFr,
                    libelleEn: niveau.privilege.libelleEn
                  });
                  setIsPrivilege(true);
      
                  // 👉 et tu mets aussi dans formData
                  setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                    privileges: [`/api/privileges/${niveau.privilege.id}`]
                  }));
                } else {
                  setPrivilege(null);
                  setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                    privileges: []
                  }));
                }
              })
              .catch((err) => console.log("Erreur récupération niveau", err));
          }
        }
      };
      
      useEffect(() => {
        if (!idDepartement) return;
      
        api.get(`/api/departements/${idDepartement}/niveau-hierarchique`)
          .then((response) => {
            setListeNiveau(response.data);
          })
          .catch((error) => console.log("Erreur API", error));
      }, [idDepartement]);
      
      
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
          const response = await api.post("/api/users", formData);
    
          Swal.fire({
            icon: "success",
            title: langueActive?.indice === "fr" ? "Bon travail!" : 
            langueActive?.indice === "en" ? "Good job !" : "",
            text: langueActive?.indice === "fr" ? `Utilisateur ajouté au ${selectedSite?.nom} avec succès !` : 
            langueActive?.indice === "en" ? `User added successfully in ${selectedSite?.nom}` : "",
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
          
            let errorMessage = langueActive?.indice === "fr" ? "Erreur lors de l'ajout d'un utilisateur." : 
            langueActive?.indice === "en" ? "Error while adding user." : "";
          
            if (error.response) {
              // Si une réponse est retournée par le backend
              const status = error.response.status;
              const backendMessage = error.response.data?.message;
          
              // Si le backend renvoie un message clair, on l’affiche
              if (backendMessage) {
                errorMessage = backendMessage;
              } else if (status == 400) {
                errorMessage = langueActive?.indice === "fr" ? "Un compte avec cet email existe déjà." : 
                langueActive?.indice === "en" ? "An account with this email already exists." : "";
              }
              else if (status === 404) {
                errorMessage = langueActive?.indice === "fr" ? "Utilisateur introuvable." : 
                langueActive?.indice === "en" ? "User not found" : "";
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
              //errorMessage = "Un compte avec cet email existe déjà.";
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
        const fetchSiteListe = async () => {
          const liste = await listeSite();
          setSiteListe(liste);
        };

        const fetchPrivilege = async () => {
            const liste = await listePrivilege();
            setPrivilegeListe(liste);
          };
      
        fetchSiteListe();
        fetchPrivilege();
      }, []);

      return (
        <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50 h-[100vh]">
          <div className="bg-[#111C44] border rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down h-[95vh] overflow-auto"
          style={{
            borderColor: codeCouleur?.btnColor
          }}
          >
            <h2 className="text-xl font-bold mb-4 text-white">{t("useraddtitle")}</h2>
    
            <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((field) =>
                <div key={field}>
                  {field === "privileges" ? (
                    null
                  ) : (
                    <label className="block text-gray-400 mb-1">
                      {fieldLabels[field] || field}
                      {(field === "prenom") ? (
                          <sup></sup>
                    ) : (
                      <sup className="text-red-500">*</sup>
                      
                    )}
                    </label>
                  )}
                 
                  {field === "privileges" ? (
                    <input type="hidden" name="" />
                    /*<select
                        name="privileges"
                        multiple
                        value={formData.privileges}
                        onChange={handleChange}
                        className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                        required
                    >
                        <option value="" disabled>{t("selecetpriv")}</option>
                        {privilegeListe.map((priv) => (
                        <option key={priv.id} value={`/api/privileges/${priv.id}`} className="mt-3">
                            {priv.title} ({langueActive?.indice === "fr" ? priv.libelleFr : langueActive?.indice === "en" ? priv.libelleEn : ""})
                        </option>
                        ))}
                    </select>*/
                    
                    ): 
                  (field === "site" ? (
                    <select
                        id="sites"
                        name="site"
                        value={formData.site}
                        onChange={handleChange}
                        className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                        required
                    >
                        <option value="" disabled>{t("selectsite")}</option>
                        {siteListe.map((site) => (
                        <option key={site.id} value={`/api/sites/${site.id}`}>
                            {site.nom}
                        </option>
                        ))}

                    </select>
                    ) : (field === "departement") ? (
                      <select
                          id="departements"
                          name="departement"
                          value={formData.departement}
                          onChange={handleChange}
                          className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                          required
                      >
                          <option value="" disabled>{t("selectDepartement")}</option>
                          {departements.map((dep) => (
                          <option key={dep.id} value={`/api/departements/${dep.id}`}>
                              {langueActive?.indice === "fr" ? dep.nom : langueActive?.indice === "en" ? dep.nomEn : ""}
                          </option>
                          ))}

                      </select>
                    ) : (field === "niveauHierarchique") ? (
                      <>
                        <select
                            id="niveauHierarchiques"
                            name="niveauHierarchique"
                            value={formData.niveauHierarchique}
                            onChange={handleChange}
                            className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                            required
                        >
                            <option value="" disabled>{t("selectNiveau")}</option>
                            {niveaus.map((niv) => (
                            <option key={niv.id} value={`/api/niveau_hierarchiques/${niv.id}`}>
                                {langueActive?.indice === "fr" ? niv.nom : langueActive?.indice === "en" ? niv.nomEn : ""}
                            </option>
                            ))}

                        </select>
                      {isPrivilege && (
                        <p className="mt-3 text-gray-400">{t("privilege")} : 
                          {langueActive?.indice === "fr" ? privilege?.libelleFr : 
                          langueActive?.indice === "en" ? privilege?.libelleEn : ""} 
                          ({privilege?.title})
                        </p>
                      )}
                        
                      </>
                    ) : (
                    <input
                        type="text"
                        name={field}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-[#1c2d55] border-[#1c2d55] text-white focus:outline-none focus:ring-0 focus:border-transparent"
                        autoComplete="off"
                        required={field === "nom" || field === "email"}
                    />
                    ))}
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

export default AddUser;
