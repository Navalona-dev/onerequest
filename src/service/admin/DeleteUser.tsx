import Swal from "sweetalert2";
import api from "../Api";

const deleteUser = async (
    idSite: number,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  ) => {  
    const result = await Swal.fire({
      title: "Es-tu sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280", // gris
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
      background: "#1c2d55",
      color: "#fff",
    });
  
    if (result.isConfirmed) {
      try {
        const response = await api.delete(`/api/users/${idSite}`);
        console.log("Réponse API:", response.data);
  
        await Swal.fire({
          icon: "success",
          title: "Bon travail!",
          text: "Utilisateur supprimé avec succès !",
          confirmButtonColor: "#7c3aed",
          background: "#1c2d55",
          color: "#fff",
        });
  
        setShowModal(false);
        window.location.reload();
  
      } catch (error) {
        console.error("Erreur API:", error);
  
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Erreur lors de la suppression d\'utilisateur.",
          confirmButtonColor: "#ef4444",
          background: "#1c2d55",
          color: "#fff",
        });
      }
    }
  };

  export default deleteUser;