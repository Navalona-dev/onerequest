import React, {useState} from "react";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";
import { useLangueActive } from "../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

const NewsletterBlock = () => {
    const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
    const [hover, setHover] = useState(false);
    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();

    return(
        <div className="container mx-auto mt-12 newsletter">
        
            <div className="flex justify-center">
                <div className="w-full max-w-3xl border rounded-lg p-1">
                <div className="border rounded-lg text-center p-1">
                    <div className="bg-white rounded-lg px-6 py-12">
                    <h4 className="text-xl font-semibold mb-4">
                        {t("newsletter.title")}
                        <span 
                        style={{
                            color: codeCouleur?.textColor
                        }}
                        className="uppercase"> Newsletter</span>
                    </h4>
                    <div className="relative mx-auto max-w-md">
                        <input
                        type="text"
                        placeholder={`${t("newsletter.mail")}`}
                        className="form-input w-full py-3 pl-4 pr-20 border border-gray-300 rounded-lg focus:outline-none"
                        />
                        <button
                        type="button"
                        style={{
                            backgroundColor: hover ? 
                            codeCouleur?.btnColorHover : codeCouleur?.btnColor
                        }}
                        onMouseEnter={ () => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        className="absolute top-2 right-1 btn-news text-white px-4 py-2 rounded-lg text-sm transition"
                        >
                        {t("newsletter.subscribe")}
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default NewsletterBlock;