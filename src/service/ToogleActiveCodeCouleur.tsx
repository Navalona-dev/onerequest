import Swal from "sweetalert2";
import api from "./Api";
import { store } from "../store";

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
    } catch (error) {
      console.error("Erreur API:", error);

      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: `Erreur lors de la ${actionWord} du code couleur.`,
        confirmButtonColor: "#ef4444",
        background: "#1c2d55",
        color: "#fff",
      });
    }
  }
};

export default toggleActiveCodeCouleur;
