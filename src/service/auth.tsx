export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem("jwt");
  // Tu peux ajouter une vérification de validité du token (expiration) ici
  return !!token;
};

export const logout = () => {
  localStorage.removeItem("jwt");
};
