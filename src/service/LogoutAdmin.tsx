import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutAdmin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Supprime les données du localStorage
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    localStorage.removeItem("email");

    // Redirige vers la page de login
    navigate("/admin/login");
  }, [navigate]);

  return null; // Pas besoin d'affichage
};

export default LogoutAdmin;
