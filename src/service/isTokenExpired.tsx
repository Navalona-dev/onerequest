export const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000); // en secondes
      return exp < now;
    } catch (e) {
      return true; // token invalide = considéré expiré
    }
  };
  