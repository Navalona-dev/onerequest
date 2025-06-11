export const isLoggedIn = (): boolean => {
  const token = sessionStorage.getItem("jwt");
  // Tu peux ajouter une vérification de validité du token (expiration) ici
  return !!token;
};

export const logout = () => {
  sessionStorage.removeItem("jwt");
};
