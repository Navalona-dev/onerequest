import Swal from "sweetalert2";
import api from "../Api";

const deleteTypeDemandeEtape = async (
    idTypeDemandeEtape: number,
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
        const response = await api.delete(`/api/type_demande_etapes/${idTypeDemandeEtape}`);
  
        await Swal.fire({
          icon: "success",
          title: langueActive === "fr" ? "Bon travail!" : 
            langueActive === "en" ? "Good job !" : "",
          text: langueActive === "fr" ? "Étape type demande supprimé avec succès !" : langueActive === "en" ? "Step request type deleted successfully!" : "",
          confirmButtonColor: "#7c3aed",
          background: "#1c2d55",
          color: "#fff",
        });
  
        window.location.reload();
  
      } catch (error: any) {
        console.error("Erreur API:", error);
      
        const status = error.response?.status; 
        const errorMessage =
          error.response?.data?.detail ||
          (langueActive === "fr"
            ? "Impossible de supprimer ce type de demande : il existe déjà des demandes associées."
            : langueActive === "en" ? "Impossible to delete this request type: there are already associated requests." : "");
      
        Swal.fire({
          icon: "error",
          title:
            langueActive === "fr"
              ? `Erreur`
              : `Error`,
          text: errorMessage,
          confirmButtonColor: "#ef4444",
          background: "#1c2d55",
          color: "#fff",
        });
      }
    }
  };

  export default deleteTypeDemandeEtape;