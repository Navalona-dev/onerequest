import Swal from "sweetalert2";
import api from "../Api";

const deleteDomaineEntreprise = async (
    idDomaine: number,
    langueActive: "fr" | "en" = "fr"
  ) => {  
    const result = await Swal.fire({
      title: langueActive === "fr" ? "Es-tu sûr ?" : langueActive === "en" ? "Are you sure?" : "",
       text: langueActive === "fr" ? "Cette action est irréversible !" : langueActive === "en" ? "This action is irreversible!" : "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280", // gris
      confirmButtonText: langueActive === "fr" ? "Oui, supprimer !" : langueActive === "en" ? "Yes, delete" : "",
      cancelButtonText: langueActive === "fr" ? "Annuler" : langueActive === "en" ? "Cancel" : "",
      background: "#1c2d55",
      color: "#fff",
    });
  
    if (result.isConfirmed) {
      try {
        const response = await api.delete(`/api/domaine_entreprises/${idDomaine}`);
        console.log("Réponse API:", response.data);
  
        await Swal.fire({
          icon: "success",
          title: langueActive === "fr" ? "Bon travail!" : 
            langueActive === "en" ? "Good job !" : "",
          text: langueActive === "fr" ? "Domaine entreprise supprimée avec succès !" : langueActive === "en" ? "Business domain deleted successfully!" : "",
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
          text: langueActive === "fr" ? "Erreur lors de la suppression de domaine entreprise." : langueActive === "en" ? "Error while deleting business domain." : "",
          confirmButtonColor: "#ef4444",
          background: "#1c2d55",
          color: "#fff",
        });
      }
    }
  };

  export default deleteDomaineEntreprise;