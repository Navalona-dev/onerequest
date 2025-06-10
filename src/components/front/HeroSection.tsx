import React, {useState} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import HeroSectionData from '../../datas/HeroSectionData';
import { useGlobalActiveCodeCouleur } from '../../hooks/UseGlobalActiveCodeCouleur';

const HeroSection = () => {
  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
  const [hover, setHover] = useState(false);

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
        {HeroSectionData.map((data, index) => (
          <SwiperSlide key={index}>
            <div className="relative min-h-screen w-full">
              <img
                src={data.image}
                alt="..."
                className="absolute w-full h-full object-cover top-0 left-0"
              />
              <div className="absolute hero-text max-w-xl w-full p-4 text-center left-1/2 bottom-12 -translate-x-1/2 sm:right-12 sm:left-auto sm:translate-x-0 sm:text-right">
                <h2 className="text-4xl md:text-6xl text-white font-bold mb-2">{data.title}</h2>
                <p className="text-white text-base md:text-lg">{data.desc}</p>
                <p className="mt-6">
                  <a
                    href="#"
                    className={`rounded-lg py-3 px-6 text-white`}
                    style={{
                      backgroundColor: hover
                        ? codeCouleur?.btnColorHover
                        : codeCouleur?.btnColor,
                    }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                  >
                    Soumettre une demande 
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
