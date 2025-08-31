import Swal from "sweetalert2";
import api from "../Api";

const deleteSite = async (
    idSite: number,
    langueActive: "fr" | "en" | null = "fr",
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
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
        const response = await api.delete(`/api/sites/${idSite}`);
        console.log("Réponse API:", response.data);
  
        await Swal.fire({
          icon: "success",
          title: langueActive === "fr" ? "Bon travail!" : 
            langueActive === "en" ? "Good job !" : "",
          text: langueActive === "fr" ? "Site supprimé avec succès !" : langueActive === "en" ? "Site deleted successfully!" : "",
          confirmButtonColor: "#7c3aed",
          background: "#1c2d55",
          color: "#fff",
        });
  
        setShowModal(false);
        window.location.reload();
  
      } catch (error: any) {
        const status = error.response?.status;
        
        let errorMessage = "";
        if (status === 409) {
          errorMessage = langueActive === "fr"
            ? "Impossible de supprimer ce site : il existe déjà des demandes associées, vous pouvez seulement le rendre indisponible."
            : "Cannot delete this site: there are already associated requests, you can only make it unavailable.";
        } else if (status === 403) {
          errorMessage = langueActive === "fr"
            ? "Suppression impossible : ce site est actuellement utilisé. Veuillez sélectionner un autre site avant de le supprimer."
            : "Deletion not allowed: this site is currently in use. Please select another site before deleting it.";
        }
        
        Swal.fire({
          icon: "error",
          title: langueActive === "fr" ? "Erreur" : "Error",
          text: errorMessage,
          confirmButtonColor: "#ef4444",
          background: "#1c2d55",
          color: "#fff",
        });
      }
      
    }
  };

  export default deleteSite;