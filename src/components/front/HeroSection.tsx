import React, {useEffect, useState} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useGlobalActiveCodeCouleur } from '../../hooks/UseGlobalActiveCodeCouleur';
import { publicApi } from '../../service/publicApi';
import { useTranslation } from "react-i18next";
import { useLangueActive } from '../../hooks/useLangueActive';

type HeroSection = {
  id: number;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  bgImage: string;
}

type Langue = {
  id: number;
  titleFr: string;
  titleEn: string;
  icon: string;
  isActive: boolean;
  indice: string;
}

const HeroSection = () => {
  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
  const [hover, setHover] = useState(false);
  const [heroSections, setListeHeroSection] = useState<HeroSection[]>([]);
  const {langueActive, setLangueActive} = useLangueActive();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    publicApi.get('/api/hero_sections/liste')
    .then((response) => {
      setListeHeroSection(response.data)
    })
    .catch((error) => console.log("Erreur API", error))
  }, []);

  return (
    <div className="relative w-full">
       {codeCouleur?.id && (
        <style>
          {`
            .hero-swiper .swiper-pagination-bullet-active {
              background-color: ${codeCouleur.btnColor} !important;
            }
            .swiper-button-next, .swiper-button-prev {
              color: ${codeCouleur.btnColor} !important
            }
          `}
        </style>
      )}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
        className="min-h-screen hero-swiper"
      >
        {heroSections.map((data, index) => (
          <SwiperSlide key={index}>
            <div className="relative min-h-screen w-full">
              <img
                src={data.bgImage}
                alt="background image"
                className="absolute w-full h-full object-cover top-0 left-0"
              />
              <div className="absolute hero-text max-w-xl w-full p-4 text-center left-1/2 bottom-12 -translate-x-1/2 sm:right-12 sm:left-auto sm:translate-x-0 sm:text-right">
                <h2 className="text-4xl md:text-6xl text-white font-bold mb-2">
                  {langueActive?.indice === "fr" ? data.titleFr : langueActive?.indice === "en" ? data.titleEn : ""}
                  </h2>
                <p className="text-white text-base md:text-lg">
                  {langueActive?.indice === "fr" ? data.descriptionFr : langueActive?.indice === "en" ? data.descriptionEn : ""}
                </p>
                <p className="mt-6">
                  <a
                    href="/soumettre-demande"
                    className={`rounded-lg py-3 px-6 text-white`}
                    style={{
                      backgroundColor: hover
                        ? codeCouleur?.btnColorHover
                        : codeCouleur?.btnColor,
                    }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                  >
                    {t("menu.submit")}
                  </a>
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
};

export default HeroSection;
