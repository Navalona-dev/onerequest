import React from "react";
import { useLocation } from "react-router-dom";
import NiveauHierarchiqueRangComponent from "../../components/admin/niveau_hierarchique/NiveauHierarchiqueRangComponent";
import DepartementRangComponent from "../../components/admin/departement/DepartementRangComponent";
const RangPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type") || ""; 

    return(
        <>
        {type === "niveau" && <NiveauHierarchiqueRangComponent />}
        {type === "departement" && <DepartementRangComponent />}
        </>
    )
}

export default RangPage;