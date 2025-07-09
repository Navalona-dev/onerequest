import { useState, useEffect } from "react";

const useUserAdminConnected = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("dataUser");

    try {
      const parsed = raw ? JSON.parse(raw) : null;
      setUser(parsed);
    } catch (e) {
      console.error("Erreur JSON.parse sur dataUser :", e);
      setUser(null);
    }
  }, []);

  return user;
};

export default useUserAdminConnected;
