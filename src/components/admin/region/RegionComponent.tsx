import React, {useState, useEffect} from "react";
import { store } from "../../../store";
import { Link } from "react-router-dom";
import api from "../../../service/Api";
import AddRegion from "./AddRegion";
import bgImage from '../../../assets/images/bg-site.png';
import Pagination from "../Pagination";
import UpdateRegion from "./UpdateRegion";
import deleteRegion from "../../../service/DeleteRegion";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";

type SiteType = {
  id: number;
  nom: string;
}

type RegionType = {
  id: number;
  nom: string;
}

const RegionComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<RegionType | null>(null);

  const state = store.getState();
  const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;

  const [regions, setListeRegion] = useState<RegionType[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const regionsPerPage = 5;

  const {codeCouleur, loading} = useGlobalActiveCodeCouleur();

  useEffect(() => {
    api.get("/api/regions")
      .then((response) => {
        setListeRegion(response.data);
      })
      .catch((error) => console.error("Erreur API:", error));
  }, []);

  const indexOfLastRegion = currentPage * regionsPerPage;
  const indexOfFirstRegion = indexOfLastRegion - regionsPerPage;
  const currentRegions = regions.slice(indexOfFirstRegion, indexOfLastRegion);
  const totalPages = Math.ceil(regions.length / regionsPerPage);

    return(
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-[50vh] md:h-[75vh] sm:h-[50vh] overflow-y-auto">
              <div className="color-header p-4 flex justify-between items-center mb-5">
                <h4 className="font-bold text-white">Liste région</h4>
                <div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-5 py-1.5 text-white rounded mr-3"
                  >
                    {create.upperText}
                  </button>
                  <Link to={'/site'}
                    className="btn-list px-5 py-2 text-white rounded">
                    Liste site
                  </Link>

                </div>
              </div>
              <div className="overflow-x-auto w-[43vh] md:w-full sm:w-[43vh] pl-4">
              <table className="w-full border border-gray-700 text-sm text-left rtl:text-right text-gray-400 dark:text-gray-400">
                  <thead className="text-xs text-white uppercase">
                    <tr className="text-nowrap border-b border-gray-700">
                      <th className="px-6 py-3">Actions</th>
                      <th className="px-6 py-3">Nom</th>
                    </tr>
                  </thead>
                  <tbody>
                  {currentRegions.length > 0 ? (
                    currentRegions.map((item, index) => (
                      <tr key={item.id} className={`text-nowrap ${index % 2 === 0 ? "" : "bg-[#1c2d55]"}`}>
                        <td className="px-6 py-4">
                          
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedRegion(item);
                              setShowModalUpdate(true);
                            }}
                            title={edit.upperText}
                          >
                            <i className="bi bi-pencil-square px-1.5 py-1 text-white rounded-3xl mr-3"
                            style={{
                              backgroundColor: codeCouleur?.btnColor
                            }}
                            ></i>
                          </a>
                          <a href="#"
                          title={deleteAction.upperText}
                          onClick={(e) => {
                            e.preventDefault();
                            deleteRegion(item.id , setShowModal);
                          }}
                          >
                            
                            <i className="bi bi-trash-fill bg-red-500 px-1.5 py-1 text-white rounded-3xl mr-3"></i>
                          </a>
                          <Link to={`/${item.id}/commune`} title="Liste commune">
                            <i className="bi bi-geo-alt-fill px-1.5 py-1 text-white rounded-3xl mr-3"
                            style={{
                              backgroundColor: codeCouleur?.btnColor
                            }}
                            ></i>
                          </Link>
                          
                        </td>
                        <td className="px-6 py-4">{item.nom}</td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                        Aucun enregistrement trouvé
                      </td>
                    </tr>
                  )}
                  </tbody>
              </table>
              </div>
              <div className="mx-4 mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
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
       

        {/* Modal */}
        {showModal && <AddRegion setShowModal={setShowModal} />}
        {showModalUpdate && selectedRegion &&
          <UpdateRegion 
            setShowModalUpdate={setShowModalUpdate} 
            regionId={selectedRegion.id}
            initialData={
              {
                nom: selectedRegion.nom
              }
            }
          />}
        </>
    )
}

export default RegionComponent;