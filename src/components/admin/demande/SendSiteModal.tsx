import React, { useEffect, useState } from "react";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";
import { store } from "../../../store";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import Swal from "sweetalert2";
import api from "../../../service/Api";
import UserAdminConnected from "../../../hooks/UserAdminConnected";


interface SendProps {
    setShowModalSendSite: React.Dispatch<React.SetStateAction<boolean>>;
    demandeId: number;
    
  }

  type Departement = {
    id: number;
    nom: string;
    nomEn: string;
  }

  type Commune = {
    id: number;
    nom: string;
  }

  type Region = {
    id: number;
    nom: string;
  }

  type Site = {
    id: number;
    nom: string;
    commune: Commune | null;
    region: Region | null;
  }

  type Demande = {
    id: number,
    departement: Departement | null;
    site: Site | null;
  }

  type UserType = {
    id: number;
    nom: string;
    prenom: string;
    site: Site;
    message: string;
    isSuperAdmin: boolean;
    departement: Departement | null;
  };

  const SendSiteModal: React.FC<SendProps> = ({
    setShowModalSendSite,
    demandeId
  }) => {
    const [formData, setFormData] = useState({
        site: "",
        commentaire: ""
      });

      const {langueActive} = useLangueActive();
      const { t, i18n } = useTranslation();

      const fieldLabels: { [key: string]: string } = {
        site: "Site",
        commentaire: t("commentaire")
      };

    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate, send } = state.actionTexts;
    const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
    const [sites, setListeSite] = useState<Site[]>([]);
    const [siteDemande, setSiteDemande] = useState<number | null>(null);
    const user = UserAdminConnected() as UserType | null;

    const selectedSite = sites.find(
      (site) => `/api/sites/${site.id}` === formData.site
    );

    useEffect(() => {
      api.get(`/api/demandes/${demandeId}/sites`)
      .then((response) => {
        setListeSite(response.data);
      })
      .catch((error) => console.log("Erreur API", error));
    }, []);
    
    useEffect(() => {
      if(!demandeId) return;

      api.get(`/api/demandes/${demandeId}`)
        .then((response) => {
          const site = response.data.site;
          // Si API renvoie un IRI (/api/siteartements/5)
          if (typeof site === "string") {
            const siteId = parseInt(site.split("/").pop() || "0", 10);
            setSiteDemande(siteId > 0 ? siteId : null);
          } 
          // Si API renvoie un objet { id: 5, nom: "IT" }
          else if (site && site.id) {
            setSiteDemande(site.id);
          } 
          else {
            setSiteDemande(null);
          }
        })
        .catch((error) => console.log("Erreur API demande", error));
    }, [demandeId]);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
    
     const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
          Swal.fire({
            icon: "error",
            title: langueActive?.indice === "fr" ? "Erreur" : "Error",
            text: langueActive?.indice === "fr"
              ? "Utilisateur non connecté."
              : "User not connected.",
            confirmButtonColor: "#ef4444",
            background: "#1c2d55",
            color: "#fff",
          });
          return;
        }

        const payload = {
          site: formData.site,
          user: `/api/users/${user.id}`,
          commentaire: formData.commentaire
        };

    
        try {
          const response = await api.patch(`/api/demandes/${demandeId}/send-site`, payload,
            {
              headers: {
                'Content-Type': 'application/merge-patch+json'
              }
            }
          );
          Swal.fire({
            icon: "success",
            title: langueActive?.indice === "fr" ? "Bon travail!" : 
                langueActive?.indice === "en" ? "Good job !" : "",
                text:
                langueActive?.indice === "fr"
                  ? `Demande envoyée au site ${selectedSite?.nom ?? ""} avec succès !`
                  : langueActive?.indice === "en"
                  ? `Request sent successfully to the site ${selectedSite?.nom ?? ""} !`
                  : "",
              
            confirmButtonColor: "#7c3aed",
            cancelButtonColor: "#ef4444",
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: langueActive?.indice === "fr" ? "Annuler" : langueActive?.indice === "en" ? "Cancel" : "",
            background: "#1c2d55",
            color: "#fff",
          }).then(() => {
            setShowModalSendSite(false);
            window.location.reload();
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: langueActive?.indice === "fr" ? "Erreur" : langueActive?.indice === "en" ? "Error" : "",
            text: langueActive?.indice === "fr" ? "Erreur lors de la mise à jour de demande." : 
            langueActive?.indice === "en" ? "Error updating the request." : "",
            confirmButtonColor: "#ef4444",
            background: "#1c2d55",
            color: "#fff",
          });
        }
      };

    return(
        <>
            <div className="fixed inset-0 bg-[#111C44] bg-opacity-50 flex items-start justify-center pt-2 z-50">
                <div className="bg-[#111C44] border rounded-lg p-8 w-11/12 max-w-md relative shadow-lg slide-down"
                style={{
                    borderColor: codeCouleur?.btnColor
                }}
                >
                    <h2 className="text-xl font-bold mb-4 text-white">{t("sendSiteTitle")}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                    {Object.keys(formData).map((field) => (
                        <div key={field}>
                        
                        <label className="block text-gray-400 mb-1">
                        {fieldLabels[field] || field}
                              <sup className="text-red-500">*</sup>
                        </label>

                      {field == "site" ? (
                        <select
                            id="sites"
                            name="site"
                            value={formData.site}
                            onChange={handleChange}
                            className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                            required
                            >
                            <option value="" disabled>
                                {t("selectsite")}
                            </option>
                            {sites
                                .filter((site) => site.id !== siteDemande)
                                .map((site) => (
                                  <option key={site.id} value={`/api/sites/${site.id}`}>
                                    {site.nom} ({site.region?.nom} / {site.commune?.nom})
                                  </option>
                            ))}

                        </select>
                      ) : (
                        <textarea name="commentaire" id="commentaire"
                          rows={5}
                          value={formData.commentaire}
                          onChange={handleChange}
                          className="w-full p-2 rounded text-white bg-[#1c2d55] border-[#1c2d55] focus:outline-none focus:ring-0 focus:border-transparent"
                          required
                        >

                        </textarea>
                      )}
                        

                        </div>
                    ))}

                    <div className="flex justify-end">
                        <button type="submit" className="text-white px-4 py-2 rounded">
                        {langueActive?.indice === "fr" ? send.fr.upperText : langueActive?.indice === "en" ? send.en.upperText : ""}
                        </button>
                    </div>
                    </form>

                    <button
                    onClick={() => setShowModalSendSite(false)}
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

export default SendSiteModal;