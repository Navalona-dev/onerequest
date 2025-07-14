import React from "react";
import PrivilegeComponent from "../../components/admin/privilege/PrivilegeComponent";
import { useLangueActive } from "../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

const PrivilegePage = () => {
    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();

    return(
        <>
            <PrivilegeComponent />
        </>
    )
}

export default PrivilegePage;