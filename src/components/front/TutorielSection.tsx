import React, { useEffect, useState } from "react";
import { publicApi } from "../../service/publicApi";
import { useLangueActive } from "../../hooks/useLangueActive";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";
import { useTranslation } from "react-i18next";

type Tutoriel = {
    id: number;
    titleFr: string;
    titleEn: string;
    descriptionFr: string;
    descriptionEn: string;
    icon: string;
    video: string;
    fichier: string;
    isActive: string;
}

const TutorielSection = () => {
    const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
    const {langueActive, setLangueActive} = useLangueActive();
    const [tutoriels, setListeTutoriel] = useState<Tutoriel[]>([]);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        publicApi.get('/api/tutoriels/liste')
        .then((response) => {
            setListeTutoriel(response.data)
        })
        .catch((error) => console.log("Erreur API", error));
    })
    return(

        <section className="py-16 bg-white" id="tutoriel">
             {codeCouleur?.id && (
                <style>
                    {`
                        .tutoriel-card:hover {
                            background-color: ${codeCouleur.textColor} !important
                        }
                        .icon-tuto {
                            border: 0.5px solid ${codeCouleur?.textColor} !important
                        }
                        .tutoriel-card:hover .icon-tuto {
                            border: 0.5px solir #fff !important
                        }
                        .tutoriel-card:hover .tutoriel-footer {
                            background-color: #fff !important;
                            color: ${codeCouleur.textColor} !important;
                        }
                    `}
                </style>
                )}
            <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
                <p 
                style={{
                    color: codeCouleur?.textColor
                }}
                className="text-sm uppercase font-medium mb-2">
                    Tutoriels
                </p>
                <h1 
                style={{
                    color: codeCouleur?.bgColor
                }}
                className="text-4xl font-bold">
                    {t("tutoriel.title")}
                </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-12 py-8">

                {tutoriels.map((tuto, index) => (
                    <div
                        key={index}
                        
                        className={`tutoriel-card bg-gray-50 rounded-lg shadow-md pt-6 hover:shadow-xl transition flex flex-col justify-between delay-${index == 0 ? "100" : index * 100}`}
                        >
                        <div className="px-6">
                            <div className="w-16 h-16 flex items-center justify-center icon-tuto border rounded-full mb-4 mx-auto">
                                <i 
                                style={{
                                    color: codeCouleur?.textColor
                                }}
                                className={`${tuto.icon} text-3xl`}></i>
                            </div>
                            <h3 className="text-xl font-semibold text-center mb-2 text-black">{langueActive?.indice === "fr" ? tuto.titleFr : langueActive?.indice === "en" ? tuto.titleEn : ""}</h3>
                            <p className="text-gray-600 text-center text-black">{langueActive?.indice === "fr" ? tuto.descriptionFr : langueActive?.indice === "en" ? tuto.descriptionEn : ""}</p>
                        </div>

                        <div 
                        style={{
                            backgroundColor: codeCouleur?.textColor
                        }}
                        className="tutoriel-footer py-3 mt-4 text-center text-white rounded-b-md">
                            <a href={tuto.video} target="_blank">{t("tutoriel.videoshow")}</a>
                        </div>
                    </div>
                ))}
            </div>

            </div>
        </section>


    )
}

export default TutorielSection;