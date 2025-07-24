import Swal from "sweetalert2";
import api from "../../../service/Api";

const dissocieNiveauHierarchique = async (
    idNiveau: number,
    langueActive: "fr" | "en" | null = "fr",
    idDep: number,
    idRang: number
  ) => {  
    const result = await Swal.fire({
      title: langueActive === "fr" ? "Es-tu sûr ?" : langueActive === "en" ? "Are you sure?" : "",
       text: langueActive === "fr" ? "Cette action est irréversible !" : langueActive === "en" ? "This action is irreversible!" : "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280", // gris
      confirmButtonText: langueActive === "fr" ? "Oui, dissocier !" : langueActive === "en" ? "Yes, dissociate" : "",
      cancelButtonText: langueActive === "fr" ? "Annuler" : langueActive === "en" ? "Cancel" : "",
      background: "#1c2d55",
      color: "#fff",
    });
  
    if (result.isConfirmed) {
      try {
        const response = await api.delete(`/api/niveau_hierarchiques/${idNiveau}/departements/${idDep}/rangs/${idRang}/dissocier`);
  
        await Swal.fire({
          icon: "success",
          title: langueActive === "fr" ? "Bon travail!" : 
            langueActive === "en" ? "Good job !" : "",
          text: langueActive === "fr" ? "Niveau hierarchique dissocié avec succès !" : langueActive === "en" ? "Hierarchic level dissociate successfully!" : "",
          confirmButtonColor: "#7c3aed",
          background: "#1c2d55",
          color: "#fff",
        });
  
        window.location.reload();
  
      } catch (error) {
        console.error("Erreur API:", error);
  
        Swal.fire({
          icon: "error",
          title: langueActive === "fr" ? "Erreur" : langueActive === "en" ? "Error" : "",
          text: langueActive === "fr" ? "Erreur lors de la dissociation du niveau hierarchique." : langueActive === "en" ? "Error while dissociate the hierarchic level." : "",
          confirmButtonColor: "#ef4444",
          background: "#1c2d55",
          color: "#fff",
        });
      }
    }
  };

  export default dissocieNiveauHierarchique;