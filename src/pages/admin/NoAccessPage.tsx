import React from "react";
import { useTranslation } from "react-i18next";

const NoAccessPage = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex items-center justify-center mt-12 px-4">
      <div className="bg-[#1c1f3a] shadow-lg rounded-lg p-10 text-center max-w-md w-full h-[50vh] overflow-auto">
        <div className="text-red-500 text-6xl mb-4">
          <i className="bi bi-exclamation-triangle-fill"></i>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-white">{t("accesRefuse")}</h1>
        <p className="text-gray-300 mb-6">
          {t("accessRefuseTitle")}
        </p>
        <a
          href="/admin"
          className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded transition-colors"
        >
          {t("retour")}
        </a>
      </div>
    </div>
  );
};

export default NoAccessPage;
