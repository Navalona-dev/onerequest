import React from "react";
import { Spinner } from "../../components/front/Spinner";
import PageHeader from "../../components/front/PageHeader";
import PageBlock from "../../components/front/PageBlock";
import RegisterForm from "../../components/front/RegisterComponent";

const RegisterPage = () => {
    return(
        <>
        <section className="mb-12">
            <Spinner />
            <PageHeader 
              title="Contact" 
              breadcrumbs={["Accueil", "Pages", "Contact"]} 
            />
            <PageBlock />
            <RegisterForm />
        </section>
        </>
    )
}

export default RegisterPage;