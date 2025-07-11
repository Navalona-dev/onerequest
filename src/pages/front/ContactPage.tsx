import React from "react";

import { Spinner } from "../../components/front/Spinner";
import { ContactInfoGrid } from "../../components/front/ContactInfoGrid";
import { ContactForm } from "../../components/front/ContactForm";
import PageHeader from "../../components/front/PageHeader";
import PageBlock from "../../components/front/PageBlock";
import { useLangueActive } from "../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

const ContactPage = () => {
    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();

    return(
        <section className="mb-12">
            <Spinner />
            <PageHeader 
              title="Contact" 
              breadcrumbs={[`${t("menu.home")}`, "Pages", "Contact"]} 
            />
            <PageBlock />
            <ContactInfoGrid />
            <ContactForm />
        </section>
    )
}

export default ContactPage;