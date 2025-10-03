import React, { useEffect, useState } from "react";
import api from "../../service/Api";
import { useGlobalActiveCodeCouleur } from "../../hooks/UseGlobalActiveCodeCouleur";
import { store } from "../../store";
import deleteDemandeFront from "../../service/front/DeleteDemande";
import { useLangueActive } from "../../hooks/useLangueActive";
import { useTranslation } from "react-i18next";

type Region = {
    id: number;
    nom: string
}

type Commune = {
    id: number;
    nom: string;
}

type Site = {
    id: number;
    nom: string;
    region: Region | null;
    commune : Commune | null;
}

type Dossier = {
    id: number;
    title: string;
}

type TypeDemande = {
    id: number;
    nom: string;
    dossierAFournirs: Dossier[] | [];
    nomEn: string;
}

type Demande = {
    id: number;
    objet: string;
    contenu: string;
    fichier: string;
    site: Site | null;
    type: TypeDemande | null;
    statut: string;
    statutEn: string;
}

const DemandeListeComponent = () => {
    const [demandes, setListeDemande] = useState<Demande[]>([]);
    const [user, setUser] = useState<any>(null);
    const {codeCouleur, loading} = useGlobalActiveCodeCouleur();
    const [urlFichier, setUrlFichier] = useState<any>(null);   

    const state = store.getState();
    const { create, delete: deleteAction, edit, activate, deactivate, save, fileText } = state.actionTexts;
    const {langueActive} = useLangueActive();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const userConnected = async () => {
          try {
            const email = sessionStorage.getItem('email');
            const token = sessionStorage.getItem('jwt');
    
            if (!email || !token) return;
    
            const userRes = await api.get(`/api/users/${email}/get-demandeur-connected`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
    
            setUser(userRes.data);
    
          } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur connecté", error);
          }
        };
    
        userConnected(); // <= important, on appelle la fonction ici
      }, []);

    useEffect(() => {
        if (!user) return;

        api.get(`/api/users/${user.id}/demandes`)
        .then((response) => {
            setListeDemande(response.data)
        })
        .catch((error) => console.log("Erreur API", error))
    }, [user]);

    sessionStorage.setItem('urlFichier', urlFichier);

    return(
        <>
        <div className="my-12">
            {demandes.length < 1 ? (
                <div className="flex justify-center">
                <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 w-[100vh]" role="alert">
                    <p className="font-bold">Aucune demande enregistrée</p>
                    <p>Vous n’avez pas encore soumis de demande. Cliquez sur le bouton <strong><a href="/soumettre-demande" className="underline">"Soumettre une demande"</a></strong> pour en créer une et commencer le processus.</p>
                </div>
            </div>
            ) : (
                <>
                <div className="flex flex-wrap justify-center gap-6 py-12">
                    {demandes.map((demande) => (
                        <div
                        key={demande.id}
                        className="relative w-64 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col justify-between "
                      >
                        {/* Top */}
                        <div
                          className="h-24 rounded-t-xl"
                          style={{
                            backgroundImage: `linear-gradient(to right, ${codeCouleur?.btnColor}, ${codeCouleur?.btnColorHover})`,
                          }}
                        >
                          <div className="flex justify-end pr-3 pt-2 text-white text-xl">♡</div>
                          <div className="flex justify-center -mt-10">
                            <div className="bg-white w-20 h-20 flex items-center justify-center rounded-full text-3xl shadow-lg">
                              📄
                            </div>
                          </div>
                        </div>
                      
                        {/* Content */}
                        <div className="bg-white p-5 text-center flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-md font-bold">{demande.objet}</h3>
                            <p className="text-xs text-gray-500 my-2">
                              {demande.site?.nom} ({demande.site?.region?.nom} / {demande.site?.commune?.nom})
                            </p>
                            <p className="text-sm text-gray-600">{langueActive?.indice === "fr" ? demande.type?.nom : langueActive?.indice === "en" ? demande.type?.nomEn : ""}</p>
                            <p className="text-xs text-gray-500 my-2 line-clamp-2">{demande.contenu || "Aucun contenu."}</p>
                          </div>
                          <p>
                            <span
                              className="text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm"
                              style={{ backgroundColor: codeCouleur?.btnColorHover }}
                            >
                              {langueActive?.indice === "fr" ? demande.statut : langueActive?.indice === "en" ? demande.statutEn : ""}
                            </span>
                          </p>
                        </div>
                      
                        {/* Footer */}
                        
                        <div
                          className="block text-white text-center py-3 cursor-pointer hover:bg-gray-700"
                          style={{
                            backgroundColor: codeCouleur?.bgColor,
                        }}
                          >
                            <a
                                href={`${demande.fichier}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-2 px-2.5 rounded-full mx-2"
                                title={langueActive?.indice === "fr" ? fileText.fr.upperText : langueActive?.indice === "en" ? fileText.en.upperText : ""}                                
                                style={{
                                    backgroundColor: codeCouleur?.btnColorHover
                                }}
                                >
                                <i className="bi bi-file-pdf-fill"></i>
                            </a>
                            <a href={`/${demande.id}/update-demande`}
                            onClick={(e) => {
                                setUrlFichier(demande.fichier);
                            }}
                                className="py-2 px-2.5 rounded-full mx-2"
                                title={langueActive?.indice === "fr" ? edit.fr.upperText : langueActive?.indice === "en" ? edit.en.upperText : ""}
                                style={{
                                    backgroundColor: codeCouleur?.btnColorHover
                                }}
                             >
                                <i className="bi bi-pencil-square"></i>
                            </a>
                            <a href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              deleteDemandeFront(demande.id)
                            }}
                                className="py-2 px-2.5 rounded-full mx-2"
                                title={langueActive?.indice === "fr" ? deleteAction.fr.upperText : langueActive?.indice === "en" ? deleteAction.en.upperText : ""}
                                style={{
                                    backgroundColor: codeCouleur?.btnColorHover
                                }}
                             >
                                <i className="bi bi-trash-fill"></i>
                            </a>
                        </div>
                       
                      </div>
                      
                    ))}
                </div>

                </>
            )}
            
        </div>
        </>
    )
}

export default DemandeListeComponent;