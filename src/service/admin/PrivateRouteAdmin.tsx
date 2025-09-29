import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserAdminConnected from "../../hooks/UserAdminConnected";
import { isLoggedIn } from "../auth";

type PrivateRouteAdminProps = {
  requiredPrivilege?: string; 
  requireIsSuperAdmin?: boolean;
};

type Privilege = {
  id: number;
  title: string;
};

type UserType = {
  privileges: Privilege[];
  isSuperAdmin: boolean
};

const PrivateRouteAdmin: React.FC<PrivateRouteAdminProps> = ({ requiredPrivilege, requireIsSuperAdmin }) => {
  const user = UserAdminConnected() as UserType | null;

  // Si l'utilisateur n'est pas connecté → redirection login
  if (!user) return isLoggedIn() ? <Outlet /> : <Navigate to="/admin/login" replace />;

  // Si un privilège est requis et que l'utilisateur ne l'a pas → redirection admin
  if (requiredPrivilege && !user.privileges.some(p => p.title === requiredPrivilege)) {
    return <Navigate to="/no-access" replace />;
  }

  // Vérification isSuperAdmin si demandé
  if (requireIsSuperAdmin && !user.isSuperAdmin) {
    return <Navigate to="/no-access" replace />;
  }

  // Sinon, rend les routes enfants
  return <Outlet />;
};

export default PrivateRouteAdmin;

