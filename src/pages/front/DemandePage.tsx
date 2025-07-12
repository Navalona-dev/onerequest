import React from "react";
import { Spinner } from "../../components/front/Spinner";
import PageBlock from "../../components/front/PageBlock";
import PageHeader from "../../components/front/PageHeader";
import DemandeContent from "../../components/front/DemandeContent";
import { useLangueActive } from "../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

const DemandePage = () => {
    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();

    return(
        <section>
            <Spinner />
            <PageHeader 
              title={t("menu.demande")} 
              breadcrumbs={[`${t("menu.home")}`, "Pages", `${t("menu.demande")}`]} 
            />
            <PageBlock />
            <DemandeContent />
        </section>
    )
}

export default DemandePage;