import Swal from "sweetalert2";
import api from "../Api";

const deleteUser = async (
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
        const response = await api.delete(`/api/users/${idSite}`);
        console.log("Réponse API:", response.data);
  
        await Swal.fire({
          icon: "success",
          title: langueActive === "fr" ? "Bon travail!" : 
            langueActive === "en" ? "Good job !" : "",
          text: langueActive === "fr" ? "Utilisateur supprimé avec succès !" : langueActive === "en" ? "User deleted successfully!" : "",
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
            ? "Impossible de supprimer cet utilisateur : il existe déjà des demandes associées."
            : "Unable to delete this user: there are already requests associated.";
        } else {
          errorMessage = langueActive === "fr"
            ? "Erreur lors de la suppression de l'utilisateur."
            : "Error occurred while deleting the user.";
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

  export default deleteUser;