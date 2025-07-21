import React, {useState, useEffect} from "react";
import api from "../../../service/Api";
import Pagination from "../Pagination";
import { useGlobalActiveCodeCouleur } from "../../../hooks/UseGlobalActiveCodeCouleur";
import { useLangueActive } from "../../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

type Site = {
    id: number;
    nom: string;
}

type Demandeur = {
    id: number;
    nom: string;
    prenom: string;
    email: string;

}

type TypeDemande = {
    id: number;
    nom: string;
    nomEn: string;
}

type Demande = {
    id: number;
    objet: string;
    contenu: string;
    statut: string;
    statutEn: string;
    type: TypeDemande | null;
    demandeur: Demandeur | null;
    fichier: string;
}

const DemandeComponent = () => {
    const [demandes, setListeDemande] = useState<Demande[]>([]);
    const [currentSite, setCurrentSite] = useState<Site | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const demandesPerPage = 5;

    const [searchStatut, setSearchStatut] = useState("");
    const [searchDemandeur, setSearchDemandeur] = useState("");
    const [searchTypeDemande, setSearchTypeDemande] = useState("");
    const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();
    const [statuts, setStatuts] = useState<{ statut: { [key: number]: string }; statutEn: { [key: number]: string } }>({
        statut: {},
        statutEn: {}
    });    

    useEffect(() => {
        api.get('/api/demandes/statut')
          .then(response => {
            setStatuts(response.data);
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des statuts :', error);
          })
          
      }, []);

    useEffect(() => {
        api.get('/api/sites/current')
        .then((response) => {
            if (response.status === 204 || !response.data) {
            setCurrentSite(null);
            } else {
            setCurrentSite(response.data);
            }
        })
        .catch((error) => {
            console.error("Erreur API:", error); // Autres erreurs réseau ou 500
        });
    }, []);

    useEffect(() => {
        if (!currentSite) return; 
        api.get(`/api/sites/${currentSite.id}/demandes`)
        .then((response) => {
            console.log('Demande', response.data);
            setListeDemande(response.data)
        })
        .catch((error) => console.log("Erreur API", error));
    }, [currentSite]);

    const filteredDemandes = demandes.filter(user => {
        const statutMatch = !searchStatut || user.statut.toLowerCase().includes(searchStatut.toLowerCase());
        const demandeurMatch = !searchDemandeur || user.demandeur?.nom.toLowerCase().includes(searchDemandeur.toLowerCase()) || user.demandeur?.prenom.toLowerCase().includes(searchDemandeur.toLowerCase());
        const typeMatch = !searchTypeDemande || user.type?.nom.toLowerCase().includes(searchTypeDemande.toLowerCase());

        return statutMatch && demandeurMatch && typeMatch;
    });
    
      const dataToPaginate = filteredDemandes;

      const totalPages = Math.max(1, Math.ceil(dataToPaginate.length / demandesPerPage));
      
      const indexOfLastDemande = currentPage * demandesPerPage;
      const indexOfFirstDemande = indexOfLastDemande - demandesPerPage;
      
      const currentDemandes = dataToPaginate.slice(indexOfFirstDemande, indexOfLastDemande);

      useEffect(() => {
        if (currentPage > totalPages) {
          setCurrentPage(1);
        }
      }, [currentPage, totalPages]);

    return(
        <>
            <div className="h-[69vh] overflow-y-auto mt-5">
                <div className="color-header px-4 flex justify-between items-center mb-3">
                    <h4 className="font-bold text-white">{t("listedemande")}</h4>
                </div>

                <div className="card my-6 px-5 mx-10 border border-gray-700 py-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="w-full">
                        <select
                            value={searchStatut}
                            onChange={(e) => setSearchStatut(e.target.value)}
                            className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                        focus:outline-none focus:ring-0 focus:border-transparent"
                            >
                            <option value="" disabled>
                                {t("selectstatut")}
                            </option>
                            {Object.entries(
                                langueActive?.indice === "fr" ? statuts.statut || {} 
                                : langueActive?.indice === "en" ? statuts.statutEn || {} 
                                : {}
                            ).map(([key, label]) => (
                                <option key={key} value={label}>
                                    {label}
                                </option>
                            ))}

                        </select>

                        </div>
                        <div className="w-full">
                            <input type="text" name="" id="" 
                            placeholder={`${t("demandeur")}...`}
                            value={searchDemandeur}
                            onChange={(e) => setSearchDemandeur(e.target.value)}
                            className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                    focus:outline-none focus:ring-0 focus:border-transparent"
                            />
                        </div>
                        <div className="w-full">
                            <input type="text" name="" id="" 
                            placeholder={`${t("typedemande")}...`}
                            value={searchTypeDemande}
                            onChange={(e) => setSearchTypeDemande(e.target.value)}
                            className="pl-10 pr-3 py-2 w-full bg-[#1c2d55] text-white rounded text-sm 
                                    focus:outline-none focus:ring-0 focus:border-transparent"
                            />
                        </div>
                        
                    </div>
                </div>

                <div className="mx-5">
                    <div className="w-[38vh] md:w-full sm:w-[38vh] h-[55vh] overflow-auto">
                        <table className="w-full border border-gray-700 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-[#1c2d55]">
                                <tr className="text-nowrap border-b-2 border-gray-700 text-center ...">
                                    <th scope="col" className="px-6 py-3 text-white">
                                        Actions
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        {t("demandeur")}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        {t("typedemande")}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        Statut
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        {t("fichier")}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        {t("objet")}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-white">
                                        {t("contenu")}
                                    </th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {currentDemandes.length > 0 ? (
                                    currentDemandes.map((item, index) => (
                                        <tr key={item.id} className={`${index % 2 === 0 ? "" : "bg-[#1c2d55]"}`}>
                                            <th className="px-6 py-4 text-nowrap">
                                            
                                            </th>
                                            <td className="px-6 py-4 text-nowrap">
                                                {item.demandeur?.nom} {item.demandeur?.prenom} <br />
                                                <span 
                                                    style={{
                                                        fontSize: "12px"
                                                    }}>
                                                    ({item.demandeur?.email})
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {langueActive?.indice === "fr" ? item.type?.nom : langueActive?.indice === "en" ? item.type?.nomEn : ""}
                                            </td>
                                            <td className="px-6 py-4 text-nowrap">
                                                {langueActive?.indice === "fr" ? item.statut : langueActive?.indice === "en" ? item.statutEn : ""}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <a 
                                                href={`${item.fichier}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline"
                                                style={{
                                                    color: codeCouleur?.textColor
                                                }}
                                                >Voir</a>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.objet}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.contenu}
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr className="bg-[#1c2d55] text-center">
                                        <td colSpan={7} className="px-6 py-4">{t("nodata")}</td>
                                    </tr>
                                )}
                                
                            
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mx-4 ">
                    <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>
        </>
    )
}

export default DemandeComponent;