import React, {useState, useEffect} from "react";
import api from "../service/Api";

const UserAdminConnected = () => {
    const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem("jwt");
        const email = sessionStorage.getItem("email");

        const response = await api.get(`/api/users/${email}/get-user-admin-connected`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur", err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return user;
}

export default UserAdminConnected;