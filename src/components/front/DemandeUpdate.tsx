// components/BookingSection.tsx
import React, { useEffect, useRef, useState } from "react";
import api from "../../service/Api";

import { useNavigate } from "react-router-dom";

import image1 from '../../assets/images/bg-tutoriel-1.jpeg';
import image2 from '../../assets/images/bg-tutoriel-2.jpeg';
import image3 from '../../assets/images/bg-tutoriel-3.jpeg';
import CodeColor from "../admin/codeCouleur/CodeColor";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
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

type Demandeur = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  adresse: string;
}

type Demande = {
  id: number;
  site: Site | null;
  type: TypeDemande | null;
  objet: string;
  contenu: string;
  demandeur: Demandeur;
  fichier: string;
  statut: string;
}

interface FormData {
  site: string;
  type: string;
  fichier: File | null;
  objet: string;
  contenu: string;
  demandeur: string;
  statut: string;
}

const DemandeUpdate: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const { idDemande } = useParams(); 
  const [demande, setDemande] = useState<Demande | null>(null);

  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    site: '',
    type: '',
    fichier: null,
    objet: '',
    contenu: '',
    demandeur: '',
    statut: '1'
  });
  

  const fieldLabels: { [key: string]: string } = {
    objet: "Objet",
    contenu: "Contenu",
    demandeur: "Demandeur",
    type: "Type de demande",
    site: "Site",
    fichier: "Fichier"
  };

  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
  const [sites, setListeSite] = useState<Site[]>([]);
  const [hover, setHover] = useState(false);
  const [typeDemandes, setListeTypeDemande] = useState<TypeDemande[]>([]);
  const [dossiers, setListeDossier] = useState<Dossier[]>([]);
  const urlFichier = sessionStorage.getItem('urlFichier');
  const formInitialized = useRef(false);
  const {langueActive} = useLangueActive();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!idDemande) return;
  
    api.get(`/api/demandes/${idDemande}`)
      .then((res) => {
        const data = res.data;
        setDemande(data);
  })
      .catch((err) => console.log("Erreur lors du chargement de la demande", err));
  }, [idDemande]);
  

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
    if (!formData.type) return;
  
    api.get(`api/type_demandes/${formData.type}/dossiers-a-fournir`)
      .then((response) => {
        setListeDossier(response.data)
      })
      .catch((error) => console.log("Erreur API", error));
  }, [formData.type]);

  useEffect(() => {
    if (!demande || formInitialized.current) return;
  
    setFormData({
      site: demande.site?.id.toString() || '',
      type: demande.type?.id.toString() || '',
      fichier: null,
      objet: demande.objet || '',
      contenu: demande.contenu || '',
      demandeur: demande.demandeur?.id?.toString() || '',
      statut: demande.statut || '1'
    });
  
    formInitialized.current = true;
  }, [demande]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!user) {
      Swal.fire({
        icon: "error",
        title: langueActive?.indice === "fr" ? "Erreur" : langueActive?.indice === "en" ? "Error" : "",
        text: "Utilisateur non authentifié.",
      });
      return;
    }

      const payload = {
        site: `/api/sites/${formData.site}`,
        type: `/api/type_demandes/${formData.type}`,
        demandeur: `/api/users/${user.id}`,
        statut: "1",
        objet: formData.objet,
        contenu: formData.contenu,
      };
  
    try {
      
      await api.patch(`/api/demandes/${idDemande}`, payload);
  
      Swal.fire({
        icon: "success",
        title: langueActive?.indice === "fr" ? "Bon travail!" : 
            langueActive?.indice === "en" ? "Good job !" : "",
        text: "Demande modifiée avec succès !",
        confirmButtonColor: "#7c3aed",
        cancelButtonColor: "#ef4444",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: langueActive?.indice === "fr" ? "Annuler" : langueActive?.indice === "en" ? "Cancel" : "",
        background: "#1c2d55",
        color: "#fff",
      }).then(() => {
        navigate("/mes-demandes");
        window.location.reload();
      });
  
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: langueActive?.indice === "fr" ? "Erreur" : langueActive?.indice === "en" ? "Error" : "",
        text: "Erreur lors de la modification de la demande.",
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
           {t("demande.updatetitle")}
          </h5>
          <h2 className="text-3xl md:text-5xl font-bold">
            {t("demande.title4")}
            <span 
            style={{
              color: codeCouleur?.textColor
            }}
            className=""> {t("demande.title2")}</span> {t("demande.title3")}
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
                    <label htmlFor="" className="mb-2">Site <sup className="text-red-500">*</sup></label>
                    <select 
                      className="mb-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 col-span-2 focus:outline-none focus:ring-0 focus:border-transparent"
                      value={formData.site}
                      onChange={(e) => setFormData(prev => ({ ...prev, site: e.target.value }))}
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
                    value={formData.type}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({ ...prev, type: value }));
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
                  {formData.type ? (
                    <div className="mb-3">
                      <h5><strong>{t("demande.dossiertitle")} : </strong></h5>
                      {dossiers.length > 0 ? (
                        dossiers.map((dossier, index) => (
                          <p className="mt-2" key={index}><i className="bi bi-record-circle-fill mr-1 text-xs"></i>
                            {langueActive?.indice === "fr" ? dossier.title : langueActive?.indice === "en" ? dossier.titleEn : ""}
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
                 {demande?.fichier && (
                  <div className="mb-2 text-sm text-gray-700">
                    {t("demande.fichiernow")} :{demande.fichier} <br />
                    <a
                      href={`${urlFichier}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {t("demande.download")}
                    </a>
                   
                  </div>
                )}

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
              {t("demande.btnupdate")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default DemandeUpdate;
