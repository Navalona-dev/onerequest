import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { store } from "../../../store";
import bgImage from '../../../assets/images/bg-site.png';
import { useParams } from 'react-router-dom';
import api from "../../../service/Api";
import AddCommune from "./AddCommune";
import UpdateCommune from "./UpdateCommune";
import deleteCommune from "../../../service/DeleteCommune";

type CommuneType = {
    id: number;
    district: string;
    nom: string;
};

type RegionType = {
    id: number;
    nom: string;
}

const CommuneComponent = () => {
    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;
    const { idRegion } = useParams();
    const [communes, setListeCommune] = useState<CommuneType[]>([]);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [region, setRegion] = useState<RegionType | null>(null);
  const [selectedCommune, setSelectedCommune] = useState<CommuneType | null>(null);


    useEffect(() => {
        api.get(`/api/regions/${idRegion}`)
        .then((response) => {
            setRegion(response.data)
        })
        .catch((error) => console.error("Erreur API", error))
    }, [])

    useEffect(() => {
        api.get(`/api/regions/${idRegion}/communes`)
        .then((response) => {
            setListeCommune(response.data)
        })
        .catch((error) => console.error("Erreur API", error))
    }, []);

    return(
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-[50vh] md:h-[75vh] sm:h-[50vh] overflow-y-auto">
            <div className="color-header p-4 mb-5">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <h4 className="font-bold text-white">Liste commune</h4>
                    {region ? (
                        <h4 className="font-bold text-white">
                        Région <span> {region.nom}</span>
                        </h4>
                    ) : null}
                    

                    
                </div>
                <div className="flex flex-col md:flex-row mt-6 justify-center gap-4">
                    <button
                        className="bg-red-500 px-5 py-1.5 text-white rounded  "
                        onClick={(e) => {
                            e.preventDefault();
                            setShowModalAdd(true);
                        }}
                    >
                        {create.upperText}
                    </button>

                    <Link
                        to="/site"
                        className="bg-red-500 px-5 py-1 text-white rounded text-center mx-3 "
                    >
                        Liste site
                    </Link>

                    <Link
                        to="/region"
                        className="bg-red-500 px-5 py-1 text-white rounded text-center "
                    >
                        Liste région
                    </Link>
                </div>
            </div>

                <div className="overflow-x-auto w-[43vh] md:w-full sm:w-[43vh] pl-4">
                <table className="w-full border border-gray-700 text-sm text-left rtl:text-right text-gray-400 dark:text-gray-400">
                  <thead className="text-xs text-white uppercase">
                    <tr className="text-nowrap border-b border-gray-700">
                      <th className="px-6 py-3">Actions</th>
                      <th className="px-6 py-3">Nom</th>
                      <th className="px-6 py-3">District</th>
                    </tr>
                  </thead>
                  <tbody>
                  {communes.length > 0 ? (
                    communes.map((item, index) => (
                      <tr key={item.id} className={`text-nowrap ${index % 2 === 0 ? "" : "bg-[#1c2d55]"}`}>
                        <td className="px-6 py-4">
                          
                          <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setSelectedCommune(item);
                                setShowModalUpdate(true);
                            }}
                            title={edit.upperText}
                          >
                            <i className="bi bi-pencil-square bg-blue-500 px-1.5 py-1 text-white rounded-3xl mr-3"></i>
                          </a>
                          <a href="#"
                          title={deleteAction.upperText}
                          onClick={(e) => {
                            e.preventDefault();
                            deleteCommune(item.id, setShowModalAdd);
                          }}
                          >
                            
                            <i className="bi bi-trash-fill bg-red-500 px-1.5 py-1 text-white rounded-3xl mr-3"></i>
                          </a>
                          
                        </td>
                        <td className="px-6 py-4">{item.nom}</td>
                        <td className="px-6 py-4">{item.district}</td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                        Aucun enregistrement trouvé
                      </td>
                    </tr>
                  )}
                  </tbody>
              </table>
                </div>
            </div>
            
            <div className="color-card h-[45vh] md:h-[75vh]">
            <div className="h-[40vh] md:h-[70vh] p-8 flex items-center justify-center">
              <img
                src={bgImage}
                alt="background"
                className="w-[30vh] h-[30vh] md:w-[60vh] md:h-[60vh]"
              />
            </div>
          </div>
        </div>

        {showModalAdd && 
        <AddCommune 
        setShowModal={setShowModalAdd}
        idRegion={Number(idRegion)} />}

        {showModalUpdate && selectedCommune &&
            <UpdateCommune 
                setShowModalUpdate={setShowModalUpdate}
                communeId={selectedCommune?.id}
                initialData={{
                    nom: selectedCommune.nom,
                    district: selectedCommune.district
                }}
            />
        }
        </>
    )
}

export default CommuneComponent;