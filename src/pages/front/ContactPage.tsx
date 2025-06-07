import React from "react";

import { Spinner } from "../../components/front/Spinner";
import { ContactInfoGrid } from "../../components/front/ContactInfoGrid";
import { ContactForm } from "../../components/front/ContactForm";
import PageHeader from "../../components/front/PageHeader";
import PageBlock from "../../components/front/PageBlock";

const ContactPage = () => {
    return(
        <section className="mb-12">
            <Spinner />
            <PageHeader 
              title="Contact" 
              breadcrumbs={["Accueil", "Pages", "Contact"]} 
            />
            <PageBlock />
            <ContactInfoGrid />
            <ContactForm />
        </section>
    )
}

export default ContactPage;