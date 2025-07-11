// ContactInfoGrid.tsx
import React, { useState } from "react";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";
import { useLangueActive } from "../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

export const ContactInfoGrid: React.FC = () => {
  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
  const [hover, setHover] = useState<string | null>(null);
  const {langueActive} = useLangueActive();
  const { t, i18n } = useTranslation();

  return (
    <div className="py-12">
      <div className="mx-auto max-w-screen-xl px-12">
        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Phone */}
          <div className="flex flex-col items-center bg-gray-100 px-6 h-[65vh] py-12 rounded-lg text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white mb-4">
              <i 
              style={{
                color: codeCouleur?.textColor
              }}
              className="bi bi-telephone-fill text-3xl"></i>
            </div>
            <h4 className="mb-2 text-xl font-semibold">{t('contact.numero')}</h4>
            <p className="mb-1">+012 345 67890</p>
            <p className="mb-4">+012 345 67891</p>
            <a
              href="tel:+0123456789"
              style={{
                backgroundColor: hover === "telephone" ? codeCouleur?.btnColorHover : codeCouleur?.btnColor
              }}
              onMouseEnter={() => setHover("telephone")}
              onMouseLeave={() => setHover(null)}
              className="inline-flex items-center rounded px-4 py-2 text-white"
            >
              {t("contact.call")} <i className="bi bi-arrow-right ms-2"></i>
            </a>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center bg-gray-100 px-6 h-[65vh] py-12 rounded-lg text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white mb-4">
              <i 
              style={{
                color: codeCouleur?.textColor
              }}
              className="bi bi-envelope-paper-fill text-3xl"></i>
            </div>
            <h4 className="mb-2 text-xl font-semibold">{t("contact.mail")}</h4>
            <p className="mb-1">info@example.com</p>
            <p className="mb-4">support@example.com</p>
            <a
              href="mailto:info@example.com"
              style={{
                backgroundColor: hover === "email" ? codeCouleur?.btnColorHover : codeCouleur?.btnColor
              }}
              onMouseEnter={() => setHover("email")}
              onMouseLeave={() => setHover(null)}
              className="inline-flex items-center rounded px-4 py-2 text-white"
            >
              {t("contact.sendmail")} <i className="bi bi-arrow-right ms-2"></i>
            </a>
          </div>

          {/* Office Address */}
          <div className="flex flex-col items-center bg-gray-100 px-6 h-[65vh] py-12 rounded-lg text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white mb-4">
              <i 
              style={{
                color: codeCouleur?.textColor
              }}
              className="bi bi-geo-alt-fill text-3xl"></i>
            </div>
            <h4 className="mb-2 text-xl font-semibold">{t("contact.officiel")}</h4>
            <p className="mb-1">123 Main Street</p>
            <p className="mb-4">Your City, Country</p>
            <a
              href="https://goo.gl/maps/FsznshxgnULBGgkN9"
              target="_blank"
              rel="noreferrer"
              style={{
                backgroundColor: hover === "adresseoff" ? codeCouleur?.btnColorHover : codeCouleur?.btnColor
              }}
              onMouseEnter={() => setHover("adresseoff")}
              onMouseLeave={() => setHover(null)}
              className="inline-flex items-center rounded px-4 py-2 text-white"
            >
              Direction <i className="bi bi-arrow-right ms-2"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
