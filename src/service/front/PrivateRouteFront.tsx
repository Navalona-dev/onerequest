import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../auth";

const PrivateRouteFront = () => {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/connexion" replace />;
};

export default PrivateRouteFront;
