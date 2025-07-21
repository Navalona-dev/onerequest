import React, { useState, useEffect } from "react";
import Header from "../../components/admin/Header";
import Footer from "../../components/admin/Footer";
import Sidebar from "../../components/admin/Sidebar";
import ThemeCustomizer from '../../components/admin/ThemeCustomizer';
import Dashboard from "./Dashboard";
import HorizontalNav from '../../components/admin/HorizontalNav';
import { useLayoutContent } from '../../contexts/admin/LayoutContext';
import FileManager from "./FileManager"; 
import { useModule } from '../../contexts/admin/ModuleContext';
import { useLocation } from "react-router-dom";
import CodeColorPage from "./CodeColorPage";
import SitePage from "./SitePage";
import UserPage from "./UserPage";
import LoginPage from "./LoginPage";
import RegionPage from "./RegionPage";
import CommunePage from "./CommunePage";
import CategorieDomaineEntreprise from "./CategorieDomaineEntreprise";
import DomaineEntreprise from "./DomaineEntreprise";
import TypeDemandePage from "./TypeDemandePage";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";
import DemandePage from "./DemandePage";
import PrivilegePage from "./PrivilegePage";
import DepartementPage from "./DepartementPage";
import NiveauHierarchiqueByDepartementPage from "./NiveauHierarchiqueByDepartementPage";
import NiveauHierarchiquePage from "./NiveauHierarchiquePage";

const ContentPage = () => {
    const { layoutContent } = useLayoutContent();
    const { currentModule, setCurrentModule } = useModule();
    const location = useLocation();

    const [showCustomizer, setShowCustomizer] = useState(false);
    const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
    const {codeCouleur, loading} = useGlobalActiveCodeCouleur();

    useEffect(() => {
        const path = location.pathname.replace(/^\/+/, ""); // enlève les slashes initiaux
    
        if ([
            "dashboard", 
            "document", 
            "report", 
            "demande", 
            "code-couleur", 
            "site", 
            "user",
            "region",
            "categorie-domaine-entreprise",
            "type-demande",
            "demande",
            "privilege",
            "departement",
            "niveau-hierarchiques"
        ].includes(path)) {
            setCurrentModule(path as any);
        } else if (/^\d+\/commune$/.test(path)) {
            // correspond à /1/commune ou /5/commune, etc.
            setCurrentModule("commune");
        }else if (/^\d+\/domaine-entreprise$/.test(path)) {
            
            setCurrentModule("domaine-entreprise");
        } else if (/^\d+\/niveau-hierarchique$/.test(path)) {
            
            setCurrentModule("niveau-hierarchique");
        }
        else {
            setCurrentModule("dashboard"); // fallback
        }
    }, [location.pathname, setCurrentModule]);
    
    const renderContent = () => {
        switch (currentModule) {
            case "dashboard":
                return <Dashboard />;
            case "document":
                return <FileManager />;
            case "code-couleur":
                return <CodeColorPage />;
                return null;
            case "site":
                return <SitePage />;
            case "user":
                return <UserPage />;
            case "region":
                return <RegionPage />;
            case "commune":
                return <CommunePage />;
            case "categorie-domaine-entreprise":
                return <CategorieDomaineEntreprise />;
            case "domaine-entreprise":
                return <DomaineEntreprise />;
            case "type-demande":
                return <TypeDemandePage />;
            case "demande":
                return <DemandePage />;
            case "privilege":
                return <PrivilegePage />;
            case "departement":
                return <DepartementPage />;
            case "niveau-hierarchique":
                return <NiveauHierarchiqueByDepartementPage />;
            case "niveau-hierarchiques":
                return <NiveauHierarchiquePage />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className={layoutContent === 'vertical' ? 'flex' : 'flex flex-col'}>
            {layoutContent === 'vertical' && (
                <div className={`fixed z-50 top-0 left-0 h-full transition-transform duration-300 ${isMobileSidebarVisible ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
                    <Sidebar onCloseMobileSidebar={() => setIsMobileSidebarVisible(false)} />
                </div>
            )}

            <div className="flex-1 bg-[#0F1C3F] flex flex-col min-h-screen">
                <Header onToggleMobileSidebar={() => setIsMobileSidebarVisible(true)} />
                {layoutContent === 'horizontal' && <HorizontalNav />}
                
                <div className="flex-grow">
                    {renderContent()}
                </div>

                <Footer />
            </div>


            {!showCustomizer && (
                <button
                    onClick={() => setShowCustomizer(true)}
                    className="fixed bottom-4 right-4 z-50 p-2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg theme-icon"
                >
                    <i className="bi bi-gear-fill text-white text-xl animate-spin"></i>
                </button>
            )}

            {showCustomizer && (
                <div className="absolute top-0 right-0 z-40 w-[400px] h-full bg-[#1c2d55] shadow-lg max-h-[100vh]">
                    <ThemeCustomizer onClose={() => setShowCustomizer(false)} />
                </div>
            )}
        </div>
    );
};

export default ContentPage;
