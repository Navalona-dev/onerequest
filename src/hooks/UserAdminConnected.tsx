import React, {useState, useEffect} from "react";
import api from "../service/Api";

const UserAdminConnected = () => {
    const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem("jwt");
      const email = sessionStorage.getItem("email");

      api.get(`/api/users/${email}/get-user-admin-connected`)
      .then((response) => {
        setUser(response.data)
      })
      .catch((error) => console.error("Erreur API:", error));
    };

    fetchUser();
  }, []);

  return user;
}

export default UserAdminConnected;