import Swal from "sweetalert2";
import api from "../Api";
import { store } from "../../store";

import { AxiosError } from "axios";

const toggleActiveCodeCouleur = async (
  idCode: number,
  isActive: boolean,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Lecture directe du texte depuis le store (en fonction de isActive)
  const state = store.getState();
  const { actionWord, pastActionWord } = state.actionTexts[isActive ? "deactivate" : "activate"];

  const result = await Swal.fire({
    title: `Es-tu sûr ?`,
    text: `Cette action va ${actionWord} le code couleur. Cette action est irréversible !`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: `Oui, ${pastActionWord} !`,
    cancelButtonText: "Annuler",
    background: "#1c2d55",
    color: "#fff",
  });

  if (result.isConfirmed) {
    try {
      console.log("ID envoyé:", idCode);

      const response = await api.post(`/api/code_couleurs/${idCode}/toggle-active`);
      console.log("Réponse API:", response.data);

      await Swal.fire({
        icon: "success",
        title: "Bon travail!",
        text: `Site ${pastActionWord} avec succès !`,
        confirmButtonColor: "#7c3aed",
        background: "#1c2d55",
        color: "#fff",
      });

      setShowModal(false);
      window.location.reload();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
    
      let errorMessage = `Erreur lors de la ${actionWord} du code couleur.`;
    
      if (error.response) {
        // Si une réponse est retournée par le backend
        const status = error.response.status;
        const backendMessage = error.response.data?.message;
    
        // Si le backend renvoie un message clair, on l’affiche
        if (backendMessage) {
          errorMessage = backendMessage;
        } else if (status === 404) {
          errorMessage = "Code couleur introuvable.";
        } else if (status === 401) {
          errorMessage = "Non autorisé. Veuillez vous reconnecter.";
        } else if (status === 500) {
          errorMessage = "Erreur serveur. Réessayez plus tard.";
        }
        // Tu peux rajouter d'autres cas ici si besoin
      } else {
        // Pas de réponse du serveur (ex: problème de réseau)
        errorMessage = "Impossible de désactiver ce code couleur. Activez d'abord un autre code couleur pour ce site.";
      }
    
      await Swal.fire({
        icon: "error",
        title: "Erreur",
        text: errorMessage,
        confirmButtonColor: "#ef4444",
        background: "#1c2d55",
        color: "#fff",
      });
    }
    
  }
};

export default toggleActiveCodeCouleur;
