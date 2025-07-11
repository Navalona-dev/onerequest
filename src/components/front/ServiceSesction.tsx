import React, { useEffect, useState } from "react";
import { publicApi } from "../../service/publicApi";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";
import { useTranslation } from "react-i18next";
import { useLangueActive } from "../../hooks/useLangueActive";

type Service = {
  id: number;
  titleFr: string;
  titleEn: string;
  icon: string;
  isActive: boolean;
  number: string;
}

type Langue = {
  id: number;
  titleFr: string;
  titleEn: string;
  icon: string;
  isActive: boolean;
  indice: string;
}


const ServiceSection = () => {

  const [services, setListeService] = useState<Service[]>([]);
  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
  const {langueActive, setLangueActive} = useLangueActive();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    publicApi.get('/api/services/liste')
    .then((response) => {
      setListeService(response.data)
    })
    .catch((error) => console.log("Erreur API", error))
  }, []);

    return(
        <div className="w-full bg-[#111C44] my-12 px-6 py-12" id="service">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

          {services.map((item, index) => (
            <div className="text-center border border-gray-700 p-8" key={item.id}>
              <i className={`text-3xl text-white mb-4 block ${item.icon}`}></i>
              <h1 
              style={{
                color: codeCouleur?.textColor
              }}
              className="text-6xl font-bold text-primary mb-4" data-toggle="counter-up">{item.number}</h1>
              <span className="text-lg font-semibold text-white">{langueActive?.indice === "fr" ? item.titleFr : langueActive?.indice === "en" ? item.titleEn : ""}</span>
            </div>
          ))}

          </div>
        </div>


    )
}

export default ServiceSection;