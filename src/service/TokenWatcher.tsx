import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "./isTokenExpired";

const TokenWatcher = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const token = sessionStorage.getItem("jwt");
      if (token && isTokenExpired(token)) {
        sessionStorage.clear();
        navigate("/admin/login");
      }
    }, 5000); // vérifie toutes les 5 secondes

    return () => clearInterval(interval);
  }, [navigate]);

  return null;
};

export default TokenWatcher;
