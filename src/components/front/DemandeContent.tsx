// components/BookingSection.tsx
import React, { useState } from "react";

import image1 from '../../assets/images/bg-tutoriel-1.jpeg';
import image2 from '../../assets/images/bg-tutoriel-2.jpeg';
import image3 from '../../assets/images/bg-tutoriel-3.jpeg';
import CodeColor from "../admin/codeCouleur/CodeColor";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";

const DemandeContent: React.FC = () => {
  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
  const [hover, setHover] = useState(false);
  return (
    <section className="bg-white py-16 px-4 mt-12">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h5 
          style={{
            color: codeCouleur?.textColor
          }}
          className="text-sm font-semibold tracking-wider uppercase">
            Soumettre une demande
          </h5>
          <h2 className="text-3xl md:text-5xl font-bold">
            Envoyez 
            <span 
            style={{
              color: codeCouleur?.textColor
            }}
            className=""> votre demande</span> maintenant
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
              <input type="text" placeholder="Nom" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
              <input type="email" placeholder="Prénom" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
              <input type="date" placeholder="Check In" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
              <input type="date" placeholder="Check Out" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
              <select className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option>Choix 1</option>
              </select>
              <select className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option>Choix 2</option>
              </select>
              <select className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 col-span-2">
                <option>Choix 3</option>
              </select>
            </div>
            <textarea placeholder="Message" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-28 w-full" />
            <button
              type="submit"
              style={{
                backgroundColor: hover ? codeCouleur?.btnColorHover : codeCouleur?.btnColor
              }}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              className="text-white w-full py-3 rounded font-semibold transition"
            >
              SOUMETTRE LA DEMANDE
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default DemandeContent;
