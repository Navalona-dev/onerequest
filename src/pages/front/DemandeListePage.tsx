import React from "react";
import DemandeListeComponent from "../../components/front/DemandeListeComponent";
import { Spinner } from "../../components/front/Spinner";
import PageBlock from "../../components/front/PageBlock";
import PageHeader from "../../components/front/PageHeader";

const DemandeListePage = () => {
    return(
        <>
        <section>
            <Spinner />
            <PageHeader 
              title="Demande" 
              breadcrumbs={["Accueil", "Pages", "Demande"]} 
            />
            <PageBlock />
            <DemandeListeComponent />
        </section>
        </>
    )
}

export default DemandeListePage;