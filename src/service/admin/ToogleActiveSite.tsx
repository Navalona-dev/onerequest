import Swal from "sweetalert2";
import api from "../Api";
import { store } from "../../store";

const toggleActiveSite = async (
  idSite: number,
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
    text: `Cette action va ${actionWord} le site. Cette action est irréversible !`,
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
      const response = await api.post(`/api/sites/${idSite}/toggle-active`);
      console.log("Réponse API:", response.data);

      await Swal.fire({
        icon: "success",
        title: langue === "fr" ? "Bon travail!" : 
            langue === "en" ? "Good job !" : "",
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
        text: `Erreur lors de la ${actionWord} du site.`,
        confirmButtonColor: "#ef4444",
        background: "#1c2d55",
        color: "#fff",
      });
    }
  }
};

export default toggleActiveSite;
