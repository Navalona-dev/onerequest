import Swal from "sweetalert2";
import api from "../Api";
import { store } from "../../store";

import { AxiosError } from "axios";

const toggleActiveCodeCouleur = async (
  idCode: number,
  isActive: boolean,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  langue: "fr" | "en" = "fr" 
) => {
  // Lecture directe du texte depuis le store (en fonction de isActive)
  const state = store.getState();
  const { actionWord, pastActionWord } =
  state.actionTexts[isActive ? "deactivate" : "activate"][langue];


  const result = await Swal.fire({
    title: `Es-tu sûr ?`,
    text: langue === "fr" ? `Cette action va ${actionWord} le code couleur. Cette action est irréversible !` : langue === "en" ? `This action will ${actionWord} the color code. This action is irreversible!` : "",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: langue === "fr" ? `Oui, ${pastActionWord} !` : langue === "en" ? `Yes, ${pastActionWord} !` : "",
    cancelButtonText: langue === "fr" ? "Annuler" : langue === "en" ? "Cancel" : "",
    background: "#1c2d55",
    color: "#fff",
  });

  if (result.isConfirmed) {
    try {

      const response = await api.post(`/api/code_couleurs/${idCode}/toggle-active`);
      console.log("Réponse API:", response.data);

      await Swal.fire({
        icon: "success",
        title: langue === "fr" ? "Bon travail!" : 
            langue === "en" ? "Good job !" : "",
        text: langue === "fr" ? `Code couleur ${pastActionWord} avec succès !` : langue === "en" ? `Color code ${pastActionWord} succesfully !` : "",
        confirmButtonColor: "#7c3aed",
        background: "#1c2d55",
        color: "#fff",
      });

      setShowModal(false);
      window.location.reload();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
    
      let errorMessage = langue === "fr" ? `Erreur lors de la ${actionWord} du code couleur.` : langue === "en" ? `Error while ${actionWord} the color code.` : "";
    
      if (error.response) {
        // Si une réponse est retournée par le backend
        const status = error.response.status;
        const backendMessage = error.response.data?.message;
    
        // Si le backend renvoie un message clair, on l’affiche
        if (backendMessage) {
          errorMessage = backendMessage;
        } else if (status === 404) {
          errorMessage = langue === "fr" ? "Code couleur introuvable." : langue === "en" ? "Color code not found." : "";
        } else if (status === 401) {
          errorMessage = langue === "fr" ? "Non autorisé. Veuillez vous reconnecter." : langue === "en" ? "Unauthorized. Please log in again." : "";
        } else if (status === 500) {
          errorMessage = langue === "fr" ? "Erreur serveur. Réessayez plus tard." : langue === "en" ? "Server error. Please try again later." : "";
        }
        // Tu peux rajouter d'autres cas ici si besoin
      } else {
        // Pas de réponse du serveur (ex: problème de réseau)
        errorMessage = langue === "fr" ? "Impossible de désactiver ce code couleur. Activez d'abord un autre code couleur pour ce site." : langue === "en" ? "Unable to deactivate this color code. Please activate another color code for this site first." : "";
      }
    
      await Swal.fire({
        icon: "error",
        title: langue === "fr" ? "Erreur" : langue === "en" ? "Error" : "",
        text: errorMessage,
        confirmButtonColor: "#ef4444",
        background: "#1c2d55",
        color: "#fff",
      });
    }
    
  }
};

export default toggleActiveCodeCouleur;
