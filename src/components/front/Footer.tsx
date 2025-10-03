import React, { useEffect, useState } from "react";

import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";
import { useTranslation } from "react-i18next";
import { publicApi } from "../../service/publicApi";
import { error } from "console";
import { useLangueActive } from "../../hooks/useLangueActive";

type Service = {
    id: number;
    titleFr: string;
    titleEn: string;
}

const Footer = () => {
    const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
    const { t, i18n } = useTranslation();
    const [services, setListeService] = useState<Service[]>([]);
    const {langueActive} = useLangueActive();

    useEffect(() => {
        publicApi.get('/api/services/liste')
        .then((response) => {
            setListeService(response.data)
        })
        .catch((error) => console.log("Erreur API", error))
    }, []);

    return(
        <footer className="bg-gray-900 text-gray-300 mt-10 pt-12 footer">
            {codeCouleur?.id && (
                <style>
                    {`
                       .footer .section-title::after {
                        background: ${codeCouleur.textColor} !important
                       }
                    `}
                </style>
                )}
            <div className="container mx-auto px-4 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Branding */}
                <div 
                style={{
                    backgroundColor: codeCouleur?.btnColor
                }}
                className="rounded-lg p-5">
                    <h1 className="text-white text-2xl font-bold mb-3 uppercase">ONEREQUEST</h1>
                    <p className="text-white text-sm">
                        {t("footer.desc")}
                    </p>
                </div>

                {/* Contact */}
                <div>
                    <h6 
                    style={{
                        color: codeCouleur?.textColor
                    }}
                    className="section-title text-xl uppercase mb-4 font-semibold">Contact</h6>
                    <p className="mb-2"><i className="bi bi-geo-alt-fill mr-2"></i>123 Rue, Antananarivo, Madagascar</p>
                    <p className="mb-2"><i className="bi bi-telephone-fill mr-2"></i>+261 34 00 000 00</p>
                    <p className="mb-2"><i className="bi bi-envelope-fill mr-2"></i>contact@atdm.mg</p>
                    <div className="flex space-x-2 pt-2">
                    <a className="btn-social" href="#"><i className="bi bi-twitter"></i></a>
                    <a className="btn-social" href="#"><i className="bi bi-facebook"></i></a>
                    <a className="btn-social" href="#"><i className="bi bi-youtube"></i></a>
                    <a className="btn-social" href="#"><i className="bi bi-linkedin"></i></a>
                    </div>
                </div>

                {/* Liens utiles */}
                <div>
                    <h6 
                    style={{
                        color: codeCouleur?.textColor
                    }}
                    className="section-title text-xl uppercase mb-4 font-semibold">Informations</h6>
                    <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white transition">{t("menu.about")}</a></li>
                    <li><a href="#" className="hover:text-white transition">Contact</a></li>
                    <li><a href="#" className="hover:text-white transition">{t("menu.politique")}</a></li>
                    <li><a href="#" className="hover:text-white transition">{t("menu.condition")}</a></li>
                    </ul>
                </div>

                {/* Services */}
                <div>
                    <h6 
                    style={{
                        color: codeCouleur?.textColor
                    }}
                    className="section-title text-xl uppercase mb-4 font-semibold">Services</h6>
                    <ul className="space-y-2">
                        {services.map((item, index) => (
                            <li className="hover:text-white transition" key={item.id}> {langueActive?.indice === "fr" ? item.titleFr : langueActive?.indice === "en" ? item.titleEn : ""} </li>
                        ))}
                    </ul>
                </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-700 py-4 text-sm copyright">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 space-y-2 md:space-y-0">
                <div className="text-center md:text-left">
                    &copy; <span className="text-white font-semibold">ONEREQUEST</span>, {t("footer.desc1")}
                    . {t("footer.desc2")} <a href="https://www.visco-consulting.com/" target="blank" className="text-white underline hover:text-red-500">VAL IT-SOLUTIONS CONSULTING</a>
                </div>
                <div className="flex space-x-4 footer-menu">
                    <a href="/" className="hover:text-white">{t("menu.home")}</a>
                    <a href="#" className="hover:text-white">Cookies</a>
                    <a href="#" className="hover:text-white">Aide</a>
                    <a href="#" className="hover:text-white">FAQ</a>
                </div>
                </div>
            </div>
        </footer>

    )
}

export default Footer;