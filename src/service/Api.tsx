import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

// Crée une instance axios avec l'URL de base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // Ajoute ici d'autres headers si besoin (auth, etc.)
  },
});

export default api;
