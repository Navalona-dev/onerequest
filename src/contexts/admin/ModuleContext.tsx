import React, { createContext, useContext, useState, ReactNode } from "react";

type ModuleType = "dashboard" | "document" | "code-couleur" | "demande" | "accueil" | "soumettre-demande" | "contact" | "rendez-vous" | "site" | "user" | "region" | "commune" | "categorie-domaine-entreprise" | "domaine-entreprise" | "type-demande" | "demande" | "inscription";

interface ModuleContextType {
  currentModule: ModuleType;
  setCurrentModule: (module: ModuleType) => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider = ({ children }: { children: ReactNode }) => {
  const [currentModule, setCurrentModule] = useState<ModuleType>("accueil");

  return (
    <ModuleContext.Provider value={{ currentModule, setCurrentModule }}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModule = () => {
  const context = useContext(ModuleContext);
  if (!context) throw new Error("useModule must be used within a ModuleProvider");
  return context;
};
