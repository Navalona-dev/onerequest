import axios from "axios";

export const publicApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
});
