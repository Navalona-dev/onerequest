// components/BookingSection.tsx
import React, { useEffect, useState } from "react";
import api from "../../service/Api";

import image1 from '../../assets/images/bg-tutoriel-1.jpeg';
import image2 from '../../assets/images/bg-tutoriel-2.jpeg';
import image3 from '../../assets/images/bg-tutoriel-3.jpeg';
import CodeColor from "../admin/codeCouleur/CodeColor";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";

type Region = {
  id: number;
  nom: string;
}

type Commune = {
  id: number;
  nom: string;
}

type Site = {
  id: number;
  nom: string;
  isActive: boolean;
  commune: Commune | null;
  region: Region | null;
}

type TypeDemande = {
  id: number;
  nom: string;
}

type Dossier = {
  id: number;
  title: string;
}

const DemandeContent: React.FC = () => {
  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
  const [sites, setListeSite] = useState<Site[]>([]);
  const [hover, setHover] = useState(false);
  const [typeDemandes, setListeTypeDemande] = useState<TypeDemande[]>([]);
  const [dossiers, setListeDossier] = useState<Dossier[]>([]);
  //const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");

  const [selectedTypeId, setSelectedTypeId] = useState<string>("");

  useEffect(() => {
    api.get('/api/sites')
    .then((response) => {
      setListeSite(response.data)
    })
    .catch((error) => console.log("Erreur API", error))
  }, []);

  useEffect(() => {
    api.get('/api/type_demandes/liste-by-entreprise')
    .then((response) => {
      setListeTypeDemande(response.data)
    })
    .catch((error) => console.log("Erreur API", error))
  }, []);

  useEffect(() => {
    if (!selectedTypeId) return;

    api.get(`api/type_demandes/${selectedTypeId}/dossiers-a-fournir`)
    .then((response) => {
      console.log("dossiers", response.data)
      setListeDossier(response.data)
    })
    .catch((error) => console.log("Erreur API", error))
  }, [selectedTypeId]);

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
              <select 
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 col-span-2 focus:outline-none focus:ring-0 focus:border-transparent"
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                >
                <option value="" disabled selected>Selectionner un site</option>
                {sites.length > 0 ? (
                  sites.map((item, index) => (
                    <option value={item.id} key={item.id}> {item.nom} ({item.region?.nom} / {item.commune?.nom}) </option>
                  ))
                ) : (
                  <option value="" disabled selected>Aucun site trouvé</option>
                )
                
                }
              </select>
              <select 
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 col-span-2 focus:outline-none focus:ring-0 focus:border-transparent"
                value={selectedTypeId}
                onChange={(e) => setSelectedTypeId(e.target.value)}
                >
                <option value="" disabled selected>Selectionner un type de demande</option>
                {typeDemandes.length > 0 ? (
                  typeDemandes.map((item, index) => (
                    <option value={item.id} key={item.id}> {item.nom} </option>
                  ))
                ) : (
                  <option value="" disabled selected>Aucun type de demande trouvé</option>
                )
              }
              </select>
              {selectedTypeId ? (
                <div>
                  <h5><strong>Voici la liste de dossiers à fournir : </strong></h5>
                  {dossiers.length > 0 ? (
                    dossiers.map((dossier, index) => (
                      <p className="mt-2"><i className="bi bi-record-circle-fill mr-1 text-xs"></i>{dossier.title}</p>
                    ))
                  ) : null}
                  <p className="bg-gray-200 px-3 py-1 my-2">Tos ces dossiers doivent être dans un seul fichier PDF. En suivant son ordre chronologique</p>
                </div>
              ) : null}
              
              <input type="text" placeholder="Objet" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 col-span-2 focus:outline-none focus:ring-0 focus:border-transparent" />
              <input type="text" placeholder="Fichier" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 col-span-2 focus:outline-none focus:ring-0 focus:border-transparent" />
              
            </div>
            <textarea placeholder="Message" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-28 w-full focus:outline-none focus:ring-0 focus:border-transparent" />
            <button
              type="submit"
              style={{
                backgroundColor: hover ? codeCouleur?.btnColorHover : codeCouleur?.btnColor
              }}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              className="text-white w-full py-2 rounded font-semibold transition"
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
