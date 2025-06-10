import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "./auth";

const PrivateRouteAdmin = () => {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default PrivateRouteAdmin;
