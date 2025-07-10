import React, { useEffect, useState } from 'react';
import useInView from '../../hooks/useInView';
import About1 from '../../assets/images/about-1.png';
import About2 from '../../assets/images/about-2.png';
import { useGlobalActiveCodeCouleur } from '../../hooks/UseGlobalActiveCodeCouleur';
import { publicApi } from '../../service/publicApi';
import { useTranslation } from "react-i18next";

type AboutSection = {
    id: number;
    titleFr: string;
    titleEn: string;
    descriptionFr: string;
    descriptionEn: string;
}

type Langue = {
    id: number;
    titleFr: string;
    titleEn: string;
    icon: string;
    isActive: boolean;
    indice: string;
  }
  

const AboutSection = () => {
    const [leftRef, leftVisible] = useInView();
    const [rightRef, rightVisible] = useInView();
    const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
    const [abouts, setListeAbout] = useState<AboutSection[]>([]);

    const [langueActive, setLangueActive] = useState<Langue | null>(null);
    const { t, i18n } = useTranslation();

  useEffect(() => {
    publicApi.get('/api/langues/get-is-active')
    .then((response) => {
      setLangueActive(response.data)
      i18n.changeLanguage(response.data.indice);
    })
    .catch((error) => console.log("Erreur API", error));
  }, []);

    useEffect(() => {
        publicApi.get('/api/about_sections/liste')
        .then((response) => {
            setListeAbout(response.data)
        })
        .catch((error) => console.log("Erreur API", error))
    }, []);
    
    return(
        <div className="py-20 px-4 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Left Side - Images */}
                <div className="flex-1 flex flex-row sm:flex-col gap-4 h-full">
                    <div
                        ref={leftRef}
                        className={`w-1/2 self-start transition-all duration-1000 ${
                        leftVisible ? "animate-fadeInUp" : "opacity-0 translate-y-24"
                        }`}
                    >
                        <img src={About1} alt="About 1" className="w-full h-auto rounded-lg shadow-md" />
                    </div>
                    <div
                        ref={rightRef}
                        className={`w-1/2 self-end transition-all duration-1000 about-image-two ${
                        rightVisible ? "animate-fadeInDown" : "opacity-0 -translate-y-24"
                        }`}
                    >
                        <img src={About2} alt="About 2" className="w-full h-auto rounded-lg shadow-md" />
                    </div>
                </div>


                {/* Right Side - Content */}
                <div className="flex-1 space-y-6 animate-fadeIn delay-500">
                <p 
                style={{
                    color: codeCouleur?.textColor
                }}
                className="text-sm font-semibold uppercase"

                >{t("about.aboutus")}</p>
                {abouts.map((item, index) => (
                    <>
                    <h1 
                        style={{
                            color: codeCouleur?.bgColor
                        }}
                        className="text-4xl md:text-5xl font-bold"
                    >
                    {langueActive?.indice === "fr" ? item.titleFr : langueActive?.indice === "en" ? item.titleEn : ""}
                    </h1>
                    <div
                        className="text-gray-600"
                        dangerouslySetInnerHTML={{
                            __html:
                            langueActive?.indice === "fr"
                                ? item.descriptionFr
                                : langueActive?.indice === "en"
                                ? item.descriptionEn
                                : "",
                        }}
                    />

                    </>
                ))}
                

                <div className="flex items-center gap-6 bg-gray-50 p-6 rounded-lg shadow">
                    <div 
                        style={{
                            backgroundColor: codeCouleur?.btnColor
                        }}
                        className="text-white text-center px-6 py-9"
                    >
                        <h1 
                        style={{
                            color: codeCouleur?.bgColor
                        }}
                        className="text-5xl font-bold"
                        >25</h1>
                        <p className="text-lg">{t("about.annee")}</p>
                        <p className="text-lg">{t("about.experience")}</p>
                    </div>
                    <div className="space-y-2">
                    <p><i 
                    style={{
                        color: codeCouleur?.textColor
                    }}
                    className="bi bi-check-all mr-2 text-xl"></i>{t("about.demande1")}</p>
                    <p><i 
                    style={{
                        color: codeCouleur?.textColor
                    }}
                    className="bi bi-check-all mr-2 text-xl"></i>{t("about.demande2")}</p>
                    <p><i 
                    style={{
                        color: codeCouleur?.textColor
                    }}
                    className="bi bi-check-all mr-2 text-xl"></i>{t("about.demande3")}</p>
                    <p><i 
                    style={{
                        color: codeCouleur?.textColor
                    }}
                    className="bi bi-check-all mr-2 text-xl"></i>{t("about.demande4")}</p>
                    <p><i 
                    style={{
                        color: codeCouleur?.textColor
                    }}
                    className="bi bi-check-all mr-2 text-xl"></i>{t("about.demande5")}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    <div className="flex items-center gap-4">
                    <div 
                    style={{
                        backgroundColor: codeCouleur?.btnColor
                    }}
                    className="rounded-full w-14 h-14 flex items-center justify-center">
                        <i className="bi bi-envelope-open-fill text-white text-xl"></i>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">{t("about.mailus")}</p>
                        <h5 className="text-lg font-semibold">info@example.com</h5>
                    </div>
                    </div>
                    <div className="flex items-center gap-4">
                    <div 
                    style={{
                        backgroundColor: codeCouleur?.btnColor
                    }}
                    className="rounded-full w-14 h-14 flex items-center justify-center">
                        <i className="bi bi-telephone-fill text-white text-xl"></i>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">{t("about.contactus")}</p>
                        <h5 className="text-lg font-semibold">+012 345 6789</h5>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>

    )
}

export default AboutSection;