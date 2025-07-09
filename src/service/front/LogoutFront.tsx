import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutFront = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Supprime les données du sessionStorage
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("email");

    // Redirige vers la page de login
    navigate("/connexion");
  }, [navigate]);

  return null; // Pas besoin d'affichage
};

export default LogoutFront;
