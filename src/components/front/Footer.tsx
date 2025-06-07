import React from "react";

const Footer = () => {
    return(
        <footer className="bg-gray-900 text-gray-300 mt-10 pt-12 footer">
            <div className="container mx-auto px-4 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Branding */}
                <div className="bg-red-600 rounded-lg p-5">
                    <h1 className="text-white text-2xl font-bold mb-3 uppercase">ONEREQUEST</h1>
                    <p className="text-white text-sm">
                    Pour toute demande d’information, de partenariat ou d’assistance, n'hésitez pas à nous contacter. Notre équipe est à votre écoute.
                    </p>
                </div>

                {/* Contact */}
                <div>
                    <h6 className="section-title text-xl text-red-500 uppercase mb-4 font-semibold">Contact</h6>
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
                    <h6 className="section-title text-xl text-red-500 uppercase mb-4 font-semibold">Informations</h6>
                    <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white transition">À propos</a></li>
                    <li><a href="#" className="hover:text-white transition">Contact</a></li>
                    <li><a href="#" className="hover:text-white transition">Politique de confidentialité</a></li>
                    <li><a href="#" className="hover:text-white transition">Conditions générales</a></li>
                    <li><a href="#" className="hover:text-white transition">Support</a></li>
                    </ul>
                </div>

                {/* Services */}
                <div>
                    <h6 className="section-title text-xl text-red-500 uppercase mb-4 font-semibold">Services</h6>
                    <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white transition">Restauration</a></li>
                    <li><a href="#" className="hover:text-white transition">Bien-être</a></li>
                    <li><a href="#" className="hover:text-white transition">Sport & Loisirs</a></li>
                    <li><a href="#" className="hover:text-white transition">Événementiel</a></li>
                    <li><a href="#" className="hover:text-white transition">Salle de sport</a></li>
                    </ul>
                </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-700 py-4 text-sm copyright">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 space-y-2 md:space-y-0">
                <div className="text-center md:text-left">
                    &copy; <span className="text-white font-semibold">ATDM</span>, Tous droits réservés.
                    Conçu par <a href="https://www.visco-consulting.com/" target="blank" className="text-white underline hover:text-red-500">VAL IT-SOLUTIONS CONSULTING</a>
                </div>
                <div className="flex space-x-4 footer-menu">
                    <a href="#" className="hover:text-white">Accueil</a>
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