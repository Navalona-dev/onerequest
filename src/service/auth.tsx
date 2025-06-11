import { isTokenExpired } from "./isTokenExpired";

export const isLoggedIn = (): boolean => {
  const token = sessionStorage.getItem("jwt");

  if (!token || isTokenExpired(token)) {
    sessionStorage.clear(); // nettoyage si token expiré
    return false;
  }

  return true;
};
