import React, { useEffect, useState } from "react";
import api from "../../../service/Api";

type Commune = {
    id: number;
    nom: string;
}

type Region = {
    id: number;
    nom: string;
}

type Site = {
    id: number;
    nom: string;
    commune: Commune | null;
    region: Region | null;
}

type Departement = {
    id: number;
    nom: string;
    nomEn: string;
}

type User = {
    id: number;
    nom: string;
    prenom: string;
    email: string;
}

type Traitement = {
    id: number;
    site: Site | null;
    departement: Departement | null;
    type: string;
    statut: string;
    createdAt: string;
    commentaire: string;
    user: User | null;

}

const TraitementByDemande = () => {
    const [traitements, setTraitement] = useState<Traitement[]>([]);

    useEffect(() => {
        api.get('/api/traitements')
        .then((response) => {
            setTraitement(response.data);
        })
        .catch((error) => console.log("Erreur API", error))
    }, []);
    return(
        <>
        </>
    )
}

export default TraitementByDemande;