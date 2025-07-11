import React from "react";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";
import { useLangueActive } from "../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

const PageBlock = () => {
    const {codeCouleur,loading} = useGlobalActiveCodeCouleur();
    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();

    return(
        <div className="w-full py-12 bg-white page-block shadow-md animate-fade-in">
            {codeCouleur?.id && (
                <style>
                    {`
                        .page-block-card {
                            border-color: ${codeCouleur.btnColor} !important
                        }
                        .page-block-card:hover {
                            background-color: ${codeCouleur.btnColor} !important
                        }
                    `}
                </style>
                )}
            <div className="container mx-auto">
            <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mx-6">
                {/* Cette div occupe 4 colonnes sur 5 */}
                <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="page-block-card">
                    <p className="text-gray-700 font-medium">{t("pageblock.title1")}</p>
                </div>
                <div className="page-block-card">
                    <p className="text-gray-700 font-medium">{t("pageblock.title2")}</p>
                </div>
                <div className="page-block-card">
                    <p className="text-gray-700 font-medium">{t("pageblock.title3")}</p>
                </div>
                <div className="page-block-card">
                    <p className="text-gray-700 font-medium">{t("pageblock.title4")}</p>
                </div>
                </div>

                {/* Si tu veux un bloc supplémentaire dans la 5e colonne */}
                <div className="hidden md:block md:col-span-1"></div>
            </div>
            </div>

            </div>
        </div>

    )
}

export default PageBlock;