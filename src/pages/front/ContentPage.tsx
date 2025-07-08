import React, { useEffect } from 'react';
import Header from '../../components/front/Header';
import HomePage from './HomePage';
import Footer from '../../components/front/Footer';
import DemandePage from './DemandePage';
import ContactPage from './ContactPage';
import { useModule } from '../../contexts/admin/ModuleContext';
import { useLocation } from 'react-router-dom';
import NewsletterBlock from '../../components/front/NewletterBlock';
import RendezVousPage from './RendezVousPage';
import RegionPage from '../admin/RegionPage';
import RegisterPage from './RegisterPage';
import LoginPageFront from './LoginPage';

export default function ContentPageFront() {
  const { currentModule, setCurrentModule } = useModule();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.slice(1); // enlève le "/"
    if (path === "") {
      setCurrentModule("accueil");
    } else if (["soumettre-demande", "accueil", "contact", "rendez-vous", "inscription", "connexion"].includes(path)) {
      setCurrentModule(path as any);
    }
  }, [location.pathname, setCurrentModule]);

  const renderContent = () => {
    switch (currentModule) {
      case "accueil":
        return <HomePage />;
      case "soumettre-demande":
        return <DemandePage />;
      case "contact":
          return <ContactPage />;
      case "rendez-vous":
          return <RendezVousPage />;
      case "inscription":
        return <RegisterPage />;
      case "connexion":
        return <LoginPageFront />;
      default:
        return <HomePage />;
    }
  };

  return (
    <>
      <Header />
      {renderContent()}
      <NewsletterBlock />
      <Footer />
    </>
  );
}
