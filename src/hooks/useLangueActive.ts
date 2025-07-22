// src/hooks/useLangueActive.ts
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../service/Api";
import { publicApi } from "../service/publicApi";

type Langue = {
  id: number;
  titleFr: string;
  titleEn: string;
  icon: string;
  isActive: boolean;
  indice: string;
};

export const useLangueActive = () => {
  const [langueActive, setLangueActive] = useState<Langue | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    const email = sessionStorage.getItem("email");
    const storedLang = sessionStorage.getItem("langueActive");
  
    if (token && email) {
      api.get(`/api/users/${email}/get-langue`)
        .then((response) => {
          if (response.data && response.data.indice) {
            setLangueActive(response.data);
            i18n.changeLanguage(response.data.indice);
          } else if (storedLang) {
            const lang = JSON.parse(storedLang);
            setLangueActive(lang);
            i18n.changeLanguage(lang.indice);
          } else {
            // fallback: langue par défaut
            publicApi.get('/api/langues/get-is-active')
              .then((response) => {
                setLangueActive(response.data);
                i18n.changeLanguage(response.data.indice);
              })
              .catch((error) => console.log("Erreur API langue par défaut", error));
          }
        })
        .catch((error) => {
          console.log("Erreur API user langue", error);
          if (storedLang) {
            const lang = JSON.parse(storedLang);
            setLangueActive(lang);
            i18n.changeLanguage(lang.indice);
          } else {
            publicApi.get('/api/langues/get-is-active')
              .then((response) => {
                setLangueActive(response.data);
                i18n.changeLanguage(response.data.indice);
              })
              .catch((error) => console.log("Erreur API langue par défaut", error));
          }
        });
    } else if (storedLang) {
      const lang = JSON.parse(storedLang);
      setLangueActive(lang);
      i18n.changeLanguage(lang.indice);
    } else {
      publicApi.get('/api/langues/get-is-active')
        .then((response) => {
          setLangueActive(response.data);
          i18n.changeLanguage(response.data.indice);
        })
        .catch((error) => console.log("Erreur API langue par défaut", error));
    }
  }, []);
  

  return { langueActive, setLangueActive };
};
