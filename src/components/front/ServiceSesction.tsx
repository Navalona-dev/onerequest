import React from "react";

const ServiceSection = () => {
    return(
        <div className="w-full bg-[#111C44] my-12 px-6 py-12" id="service">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

            <div className="text-center border border-gray-700 p-8">
              <i className="bi bi-lightning-charge-fill text-3xl text-white mb-4 block"></i>
              <h1 className="text-6xl text-red-500 font-bold text-primary mb-4" data-toggle="counter-up">25</h1>
              <span className="text-lg font-semibold text-white">Demandes traitées / jour</span>
            </div>

            <div className="text-center border border-gray-700 p-8">
              <i className="bi bi-clock-history text-3xl text-white mb-4 block"></i>
              <h1 className="text-6xl text-red-500 font-bold text-primary mb-4" data-toggle="counter-up">1h</h1>
              <span className="text-lg font-semibold text-white">Temps moyen de réponse</span>
            </div>

            <div className="text-center border border-gray-700 p-8">
              <i className="bi bi-emoji-smile-fill text-3xl text-white mb-4 block"></i>
              <h1 className="text-6xl text-red-500 font-bold text-primary mb-4" data-toggle="counter-up">98%</h1>
              <span className="text-lg font-semibold text-white">Clients satisfaits</span>
            </div>

            <div className="text-center border border-gray-700 p-8">
              <i className="bi bi-headset text-3xl text-white mb-4 block"></i>
              <h1 className="text-6xl text-red-500 font-bold text-primary mb-4" data-toggle="counter-up">24/7</h1>
              <span className="text-lg font-semibold text-white">Support disponible</span>
            </div>

          </div>
        </div>


    )
}

export default ServiceSection;