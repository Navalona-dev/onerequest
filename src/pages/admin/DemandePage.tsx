import React from "react";
import { useLocation } from "react-router-dom";
import DemandeComponent from "../../components/admin/demande/DemandeComponent";
import DemandeEnAttenteComponent from "../../components/admin/demande/DemandeEnAttenteComponent";

const DemandePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type") || "liste"; // valeur par défaut

  return (
    <>
      {type === "liste" && <DemandeComponent />}
      {type === "en-attente" && <DemandeEnAttenteComponent />}
    </>
  );
};

export default DemandePage;
