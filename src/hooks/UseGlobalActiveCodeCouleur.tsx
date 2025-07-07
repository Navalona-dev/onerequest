import { useState, useEffect } from "react";
import api from "../service/Api";
import { publicApi } from "../service/publicApi";

export interface CodeCouleur {
  id: number;
  site: { id: number; nom: string } | null;
  bgColor: string;
  textColor: string;
  btnColor: string;
  colorOne: string;
  colorTwo: string;
  isActive: boolean;
  isGlobal: boolean;
  isDefault: boolean;
  btnColorHover: string;
  textColorHover: string;
}

export const useGlobalActiveCodeCouleur = () => {
  const [codeCouleur, setCodeCouleur] = useState<CodeCouleur | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.get("/api/code_couleurs/get-global-active")
      .then((response) => {
        setCodeCouleur(response.data);
      })
      .catch((error) => console.error("Erreur API:", error))
      .finally(() => setLoading(false));
  }, []);

  return { codeCouleur, loading };
};
