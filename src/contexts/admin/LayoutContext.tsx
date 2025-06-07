import React, { createContext, useContext, useState, useEffect } from "react";

type LayoutContent = "vertical" | "horizontal";

interface LayoutContextType {
  layoutContent: LayoutContent;
  setLayoutContent: (layoutContent: LayoutContent) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const LayoutContentContext = createContext<LayoutContextType>({
  layoutContent: "vertical",
  setLayoutContent: () => {},
  isSidebarCollapsed: false,
  setIsSidebarCollapsed: () => {},
});

export const LayoutContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [layoutContent, setLayoutContent] = useState<LayoutContent>("vertical");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    document.body.classList.remove("vertical", "horizontal");
    document.body.classList.add(layoutContent);
  }, [layoutContent]);

  return (
    <LayoutContentContext.Provider
      value={{
        layoutContent,
        setLayoutContent,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
      }}
    >
      {children}
    </LayoutContentContext.Provider>
  );
};

export const useLayoutContent = () => useContext(LayoutContentContext);
