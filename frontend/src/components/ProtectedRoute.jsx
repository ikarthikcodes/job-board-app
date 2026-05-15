import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({
  children,
  allowedRole
}) {

  const { token, role } = useContext(AuthContext);

  // Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Wrong role
  if (role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;