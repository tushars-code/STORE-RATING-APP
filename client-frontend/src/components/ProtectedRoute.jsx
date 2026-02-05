import { Navigate } from "react-router-dom";
import { getRole, isLoggedIn } from "../auth";

export default function ProtectedRoute({ children, role }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const userRole = getRole();

  if (role && userRole !== role) {
    if (userRole === "ADMIN") return <Navigate to="/admin" replace />;
    if (userRole === "STORE_OWNER") return <Navigate to="/owner" replace />;
    return <Navigate to="/stores" replace />;
  }

  return children;
}
