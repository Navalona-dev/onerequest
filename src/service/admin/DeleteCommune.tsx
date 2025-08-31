import Swal from "sweetalert2";
import api from "../Api";

const deleteCommune = async (
    idCommune: number,
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
        const response = await api.delete(`/api/communes/${idCommune}`);
        console.log("Réponse API:", response.data);
  
        await Swal.fire({
          icon: "success",
          title: langueActive === "fr" ? "Bon travail!" : 
            langueActive === "en" ? "Good job !" : "",
          text: langueActive === "fr" ? "Commune supprimé avec succès !" : langueActive === "en" ? "Commune deleted successfully!" : "",
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
            ? "Impossible de supprimer cette commune : il existe déjà des demandes associées aux sites associés."
            : "Unable to delete this municipality: there are already requests associated with the linked sites.";
        } else {
          errorMessage = langueActive === "fr"
            ? "Erreur lors de la suppression de commune."
            : "Error occurred while deleting the municipality.";
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

  export default deleteCommune;