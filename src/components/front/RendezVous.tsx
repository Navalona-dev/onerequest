// components/BookingSection.tsx
import React from "react";

import image1 from '../../assets/images/bg-tutoriel-1.jpeg';
import image2 from '../../assets/images/bg-tutoriel-2.jpeg';
import image3 from '../../assets/images/bg-tutoriel-3.jpeg';

const RendezVous: React.FC = () => {
  return (
    <section className="bg-white py-16 px-4 mt-12">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h5 className="text-sm text-red-500 font-semibold tracking-wider uppercase">
            Prendre un rendez-vous
          </h5>
          <h2 className="text-3xl md:text-5xl font-bold">
            Prennez <span className="text-red-500">votre rendez-vous</span> maintenant
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-12">
          {/* Images */}
          <div className="grid grid-cols-2 gap-4 mt-12">
            {/* Image 1 */}
            <div className="flex justify-end">
              <img
                src={image1}
                alt=""
                className="w-3/4 rounded shadow-md mt-[25%] transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Image 2 */}
            <div className="flex justify-start">
              <img
                src={image2}
                alt=""
                className="w-full rounded shadow-md transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Image 3 */}
            <div className="flex justify-end">
              <img
                src={image3}
                alt=""
                className="w-1/2 h-2/3 rounded shadow-md transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Image 4 */}
            <div className="flex justify-start">
              <img
                src={image1}
                alt=""
                className="w-3/4 rounded shadow-md transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>


          {/* Form */}
          <form className="space-y-4 bg-gray-50 p-6 rounded shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Nom" className="input" />
              <input type="email" placeholder="Prénom" className="input" />
              <input type="date" placeholder="Check In" className="input" />
              <input type="date" placeholder="Check Out" className="input" />
              <select className="input">
                <option>Choix 1</option>
              </select>
              <select className="input">
                <option>Choix 2</option>
              </select>
              <select className="input col-span-2">
                <option>Choix 3</option>
              </select>
            </div>
            <textarea placeholder="Message" className="input h-28 w-full" />
            <button
              type="submit"
              className="bg-orange-500 text-white w-full py-3 rounded hover:bg-orange-600 font-semibold transition"
            >
              SOUMETTRE LA DEMANDE
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RendezVous;
