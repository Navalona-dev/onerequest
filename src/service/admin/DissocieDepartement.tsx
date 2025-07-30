import Swal from "sweetalert2";
import api from "../Api";

const dissocieDepartement = async (
    idDep: number,
    langueActive: "fr" | "en" | null = "fr",
    idSite: number
  ) => {  
    const result = await Swal.fire({
      title: langueActive === "fr" ? "Es-tu sûr ?" : langueActive === "en" ? "Are you sure?" : "",
      text: langueActive === "fr" ? "Cette action est irréversible !" : langueActive === "en" ? "This action is irreversible!" : "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280", // gris
      confirmButtonText: langueActive === "fr" ? "Oui, dissocier !" : langueActive === "en" ? "Yes, dissociate" : "",
      cancelButtonText: langueActive === "fr" ? "Annuler" : langueActive === "en" ? "Cancel" : "",
      background: "#1c2d55",
      color: "#fff",
    });
  
    if (result.isConfirmed) {
      try {
        const response = await api.delete(`/api/departements/${idDep}/site/${idSite}/dissocie`);
        console.log("Réponse API:", response.data);
  
        await Swal.fire({
          icon: "success",
          title: langueActive === "fr" ? "Bon travail!" : 
            langueActive === "en" ? "Good job !" : "",
          text: langueActive === "fr" ? "Departement dissocié du site avec succès !" : 
          langueActive === "en" ? "Departement dissociated successfully!" : "",
          confirmButtonColor: "#7c3aed",
          background: "#1c2d55",
          color: "#fff",
        });
  
        window.location.reload();
  
      } catch (error) {
        console.error("Erreur API:", error);
  
        Swal.fire({
          icon: "error",
          title: langueActive === "fr" ? "Erreur" : langueActive === "en" ? "Error" : "",
          text: langueActive === "fr" ? "Erreur lors de la dissociation de departement." : 
          langueActive === "en" ? "Error while dissociating the departement." : "",
          confirmButtonColor: "#ef4444",
          background: "#1c2d55",
          color: "#fff",
        });
      }
    }
  };

  export default dissocieDepartement;