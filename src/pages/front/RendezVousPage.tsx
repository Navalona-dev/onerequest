import React from "react";
import { Spinner } from "../../components/front/Spinner";
import PageBlock from "../../components/front/PageBlock";
import PageHeader from "../../components/front/PageHeader";
import RendezVous from "../../components/front/RendezVous";

const RendezVousPage = () => {
    return(
        <section>
            <Spinner />
            <PageHeader 
              title="Rendez-vous" 
              breadcrumbs={["Accueil", "Pages", "Rendez-vous"]} 
            />
            <PageBlock />
            <RendezVous />
        </section>
    )
}

export default RendezVousPage;