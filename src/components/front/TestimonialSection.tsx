import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import TestimonialDatas from "../../datas/TestimonialData";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";

export default function TestimonialSection() {

const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
  return (
    <section
      id="testimonial"
      className="py-16 bg-white bg-cover bg-center testimonial"
     
    >

  {codeCouleur?.btnColor && (
        <style>
          {`
            
            .swiper-button-prev-custom, .swiper-button-next-custom  {
              background-color: ${codeCouleur.btnColor} !important
            }

            .swiper-button-prev-custom:hover, .swiper-button-next-custom:hover  {
              background-color: #fff !important
            }
            .swiper-button-prev-custom:hover i, .swiper-button-next-custom:hover i {
              color: ${codeCouleur.textColor}
            }
          `}
        </style>
      )}
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Boutons personnalisés */}
          <button className="swiper-button-prev-custom absolute top-1/2 left-0 transform -translate-y-1/2 z-10 text-white px-3 py-2 rounded transition">
            <i className="bi bi-arrow-left"></i>
          </button>
          <button className="swiper-button-next-custom absolute top-1/2 right-0 transform -translate-y-1/2 z-10 text-white px-3 py-2 rounded transition">
            <i className="bi bi-arrow-right"></i>
          </button>

          {/* Swiper */}
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              prevEl: ".swiper-button-prev-custom",
              nextEl: ".swiper-button-next-custom",
            }}
            autoplay={{ delay: 5000 }}
            loop
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 1 },
              1024: { slidesPerView: 2 },
            }}
            className="px-16"
          >
            {TestimonialDatas.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="testimonial-item relative bg-white rounded overflow-hidden px-6 py-12">
                  <p className="mb-4 text-gray-700">{item.text}</p>
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-[45px] h-[45px] rounded object-cover shrink-0"
                    />
                    <div className="ps-3">
                      <h6 className="font-bold mb-1">{item.name}</h6>
                      <small className="text-gray-500">{item.job}</small>
                    </div>
                  </div>
                  <i 
                  style={{
                    color: codeCouleur?.textColor
                  }}
                  className="bi bi-quote quote text-3xl absolute bottom-0 end-0 mb-[-0.25rem] me-4"></i>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}
