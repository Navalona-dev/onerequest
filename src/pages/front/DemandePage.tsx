import React from "react";
import { Spinner } from "../../components/front/Spinner";
import PageBlock from "../../components/front/PageBlock";
import PageHeader from "../../components/front/PageHeader";
import DemandeContent from "../../components/front/DemandeContent";

const DemandePage = () => {
    return(
        <section>
            <Spinner />
            <PageHeader 
              title="Demande" 
              breadcrumbs={["Accueil", "Pages", "Demande"]} 
            />
            <PageBlock />
            <DemandeContent />
        </section>
    )
}

export default DemandePage;