import Swal from "sweetalert2";
import api from "../Api";

const deleteCodeCouleur = async (
    idCode: number,
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
        const response = await api.delete(`/api/code_couleurs/${idCode}`);
        console.log("Réponse API:", response.data);
  
        await Swal.fire({
          icon: "success",
          title: langueActive === "fr" ? "Bon travail!" : 
            langueActive === "en" ? "Good job !" : "",
          text: langueActive === "fr" ? "Code couleur supprimé avec succès !" : langueActive === "en" ? "Color code deleted successfully!" : "",
          confirmButtonColor: "#7c3aed",
          background: "#1c2d55",
          color: "#fff",
        });
  
        setShowModal(false);
        window.location.reload();
  
      } catch (error: any) {
        console.error("Erreur API:", error);
      
        const status = error.response?.status; 
        const errorMessage =
          error.response?.data?.detail ||
          (langueActive === "fr"
            ? "Impossible de supprimer ce code couleur : veuillez d'abord activé un autre code couleur avant de le supprimer."
            : langueActive === "en" ? "Impossible to delete this color code: please activate another color code first before deleting it." : "");
      
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

  export default deleteCodeCouleur;