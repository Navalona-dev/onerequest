// ContactMapAndForm.tsx
import React, { useState } from "react";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";
import { useLangueActive } from "../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

export const ContactForm: React.FC = () => {
  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
  const [hover, setHover] = useState(false);
  const {langueActive} = useLangueActive();
  const { t, i18n } = useTranslation();

  return (
    <div className="mx-auto max-w-screen-xl px-12">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Texte + Infos */}
        <div className="space-y-4">
          <p 
          style={{
            color: codeCouleur?.textColor
          }}
          className="text-sm font-medium uppercase">{t("contact.callus")}</p>
          <h2 
          style={{
            color: codeCouleur?.bgColor
          }}
          className="text-3xl font-semibold mb-12">{t("contact.title")}</h2>
          <p className="text-gray-600 mb-12">
           {t("contact.desc")}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Info 1 */}
            <div className="flex items-start space-x-4">
              <div 
              style={{
                backgroundColor: codeCouleur?.btnColor
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full text-white">
                <i className="bi bi-telephone-fill text-2xl"></i>
              </div>
              <div>
                <h6 className="font-semibold">{t("contact.numero")}</h6>
                <span>+012 345 67890</span>
              </div>
            </div>

            {/* Info 2 */}
            <div className="flex items-start space-x-4">
              <div 
              style={{
                backgroundColor: codeCouleur?.btnColor
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full text-white">
                <i className="bi bi-envelope-fill text-2xl"></i>
              </div>
              <div>
                <h6 className="font-semibold">{t("contact.mail")}</h6>
                <span>info@example.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div>
          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="sr-only">
                  {t("contact.form1")}
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder={t("contact.form1")}
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  {t("contact.mail")}
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder={t("contact.mail")}
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="sr-only">
                {t("contact.objet")}
              </label>
              <input
                type="text"
                id="subject"
                className="w-full rounded border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                placeholder={t("contact.objet")}
              />
            </div>

            <div>
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full rounded border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                placeholder={t("contact.message")}
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                style={{
                  backgroundColor: hover ? codeCouleur?.btnColorHover : codeCouleur?.btnColor
                }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className="inline-flex items-center rounded px-5 py-2 text-white hover:bg-red-600"
              >
                {t("contact.sendmessage")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
