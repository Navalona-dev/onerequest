// components/BookingSection.tsx
import React, { useEffect, useState } from "react";
import api from "../../service/Api";

import { useNavigate } from "react-router-dom";

import image1 from '../../assets/images/bg-tutoriel-1.jpeg';
import image2 from '../../assets/images/bg-tutoriel-2.jpeg';
import image3 from '../../assets/images/bg-tutoriel-3.jpeg';
import CodeColor from "../admin/codeCouleur/CodeColor";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";
import Swal from "sweetalert2";
import { useLangueActive } from "../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

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
  isActive: boolean;
  commune: Commune | null;
  region: Region | null;
}

type TypeDemande = {
  id: number;
  nom: string;
  nomEn: string;
}

type Dossier = {
  id: number;
  title: string;
  titleEn: string;
}

type Demande = {
  
}

const DemandeContent: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const {langueActive} = useLangueActive();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
      site: "",
      type: "",
      fichier: null as File | null,
      objet: "",
      contenu: "",
      demandeur: "",
      statut: ""
  });

  const fieldLabels: { [key: string]: string } = {
    objet: t("demande.objet"),
    contenu: t("demande.contenu"),
    demandeur: t("demande.demandeur"),
    type: t("demande.type"),
    site: t("demande.site"),
    fichier: t("demande.fichier")
  };

  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
  const [sites, setListeSite] = useState<Site[]>([]);
  const [hover, setHover] = useState(false);
  const [typeDemandes, setListeTypeDemande] = useState<TypeDemande[]>([]);
  const [dossiers, setListeDossier] = useState<Dossier[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");

  const [selectedTypeId, setSelectedTypeId] = useState<string>("");

  useEffect(() => {
    const userConnected = async () => {
      try {
        const email = sessionStorage.getItem('email');
        const token = sessionStorage.getItem('jwt');

        if (!email || !token) return;

        const userRes = await api.get(`/api/users/${email}/get-user-admin-connected`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(userRes.data);

      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur connecté", error);
      }
    };

    userConnected(); // <= important, on appelle la fonction ici
  }, []);

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
    api.get('/api/sites')
    .then((response) => {
      setListeSite(response.data)
    })
    .catch((error) => console.log("Erreur API", error))
  }, []);

  useEffect(() => {
    api.get('/api/type_demandes/liste-by-entreprise')
    .then((response) => {
      setListeTypeDemande(response.data)
    })
    .catch((error) => console.log("Erreur API", error))
  }, []);

  useEffect(() => {
    if (!selectedTypeId) return;

    api.get(`api/type_demandes/${selectedTypeId}/dossiers-a-fournir`)
    .then((response) => {
      setListeDossier(response.data)
    })
    .catch((error) => console.log("Erreur API", error))
  }, [selectedTypeId]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Utilisateur non authentifié.",
      });
      return;
    }
  
    const payload = new FormData();
    payload.append("site", `/api/sites/${formData.site}`);
    payload.append("type", `/api/type_demandes/${formData.type}`);
    payload.append("demandeur", `/api/users/${user.id}`);
    payload.append("statut", "1");
    payload.append("objet", formData.objet);
    payload.append("contenu", formData.contenu);
  
    if (formData.fichier) {
      payload.append("fichier", formData.fichier);
    }
  
    try {
      await api.post("/api/demandes", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        },
      });
  
      Swal.fire({
        icon: "success",
        title: "Bon travail!",
        text: "Demande ajoutée avec succès !",
        confirmButtonColor: "#7c3aed",
        cancelButtonColor: "#ef4444",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Annuler",
        background: "#1c2d55",
        color: "#fff",
      }).then(() => {
        navigate("/mes-demandes");
        window.location.reload();
      });
  
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de l'ajout de la demande.",
        confirmButtonColor: "#ef4444",
        background: "#1c2d55",
        color: "#fff",
      });
    }
  };
  
  return (
    <section className="bg-white py-16 px-4 mt-12">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h5 
          style={{
            color: codeCouleur?.textColor
          }}
          className="text-sm font-semibold tracking-wider uppercase">
            {t("demande.title")}
          </h5>
          <h2 className="text-3xl md:text-5xl font-bold">
            {t("demande.title1")}
            <span 
            style={{
              color: codeCouleur?.textColor
            }}
            className="">{t("demande.title2")}</span> {t("demande.title3")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-12">
          {/* Images */}
          <div className="grid grid-cols-2 gap-4 mt-12">
            {/* Image 1 */}
            <div className="flex justify-end">
              <img
                src={image1}
                alt=""
                className="w-3/4 rounded shadow-md mt-[25%] transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Image 2 */}
            <div className="flex justify-start">
              <img
                src={image2}
                alt=""
                className="w-full rounded shadow-md transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Image 3 */}
            <div className="flex justify-end">
              <img
                src={image3}
                alt=""
                className="w-1/2 h-2/3 rounded shadow-md transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Image 4 */}
            <div className="flex justify-start">
              <img
                src={image1}
                alt=""
                className="w-3/4 rounded shadow-md transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded shadow">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {Object.keys(formData).map((field) =>
              <div key={field}>
                {field === "site" ? (
                  <>
                    <label htmlFor="" className="mb-2">{t("demande.site")} <sup className="text-red-500">*</sup></label>
                    <select 
                      className="mb-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 col-span-2 focus:outline-none focus:ring-0 focus:border-transparent"
                      value={selectedSiteId}
                      onChange={(e) => {
                        setSelectedSiteId(e.target.value);
                        setFormData((prev) => ({ ...prev, site: e.target.value }));
                      }}
                      name="site"
                      required
                      >
                      <option value="" disabled>{t("demande.selectsite")}</option>
                      {sites.length > 0 ? (
                        sites.map((item, index) => (
                          <option value={item.id} key={item.id}> {item.nom} ({item.region?.nom} / {item.commune?.nom}) </option>
                        ))
                      ) : (
                        <option value="" disabled>{t("demande.nonsite")}</option>
                      )
                      
                      }
                    </select>
                  </>
                ) : field === "type" ? (
                  <>
                  <label htmlFor="" className="mb-2">{t("demande.type")} <sup className="text-red-500">*</sup></label>
                  <select 
                    className="mb-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 col-span-2 focus:outline-none focus:ring-0 focus:border-transparent"
                    value={selectedTypeId}
                    onChange={(e) => {
                      setSelectedTypeId(e.target.value);
                      setFormData((prev) => ({ ...prev, type: e.target.value }));
                    }}
                    name="type"
                    required
                    >
                    <option value="" disabled>{t("demande.selecttype")}</option>
                    {typeDemandes.length > 0 ? (
                      typeDemandes.map((item, index) => (
                        <option value={item.id} key={item.id}> {langueActive?.indice === "fr" ? item.nom : langueActive?.indice === "en" ? item.nomEn : ""} </option>
                      ))
                    ) : (
                      <option value="" disabled>{t("demande.nontype")}</option>
                    )
                  }
                  </select>
                  {selectedTypeId ? (
                    <div className="mb-3">
                      <h5><strong>{t("demande.dossiertitle")} : </strong></h5>
                      {dossiers.length > 0 ? (
                        dossiers.map((dossier, index) => (
                          <p className="mt-2" key={index}><i className="bi bi-record-circle-fill mr-1 text-xs"></i>
                            {langueActive?.indice === "fr" ? dossier.title : langueActive?.indice === "en" ? dossier.titleEn  : ""}
                          </p>
                        ))
                      ) : null}
                      <p className="bg-gray-200 px-3 py-1 my-2">{t("demande.dossierdesc")}</p>
                    </div>
                  ) : null}
                  </>
                ) : field === "contenu" ?  (
                  <>
                    <label htmlFor="" className="mb-2">Message <sup className="text-red-500">*</sup></label>
                    <textarea
                      name="contenu"
                      placeholder="Message"
                      value={formData.contenu}
                      onChange={handleChange}
                      className="mb-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 col-span-2 focus:outline-none focus:ring-0 focus:border-transparent" 
                      rows={5}
                      required
                    />

                  </>
                ) : field === "fichier" ? (
                 <>
                 <label htmlFor="" className="mb-2">{t("demande.fichier")} <sup className="text-red-500">*</sup></label>
                 <input
                      type="file"
                      name="fichier"
                      placeholder="fichier"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          fichier: e.target.files ? e.target.files[0] : null,
                        }))
                      }
                      className="mb-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 col-span-2 focus:outline-none focus:ring-0 focus:border-transparent" 
                      required
                    />

                 </>

                ) : field === "objet" ? (
                  <>
                    <label htmlFor="" className="mb-2">{t("demande.objet")}</label>
                    <input
                      type="text"
                      name="objet"
                      placeholder={t("demande.objet")}
                      value={formData.objet}
                      onChange={handleChange}
                      className="mb-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 col-span-2 focus:outline-none focus:ring-0 focus:border-transparent" 
                      
                    />

                  </>
                ) : null }
              </div>
            )}

            </div>
            <button
              type="submit"
              style={{
                backgroundColor: hover ? codeCouleur?.btnColorHover : codeCouleur?.btnColor
              }}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              className="text-white w-full py-2 rounded font-semibold transition"
            >
             {t("demande.title")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default DemandeContent;
