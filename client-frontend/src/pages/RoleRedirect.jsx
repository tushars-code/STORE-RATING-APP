import { Navigate } from "react-router-dom";
import { getRole } from "../auth";

export default function RoleRedirect() {
  const role = getRole();

  if (role === "ADMIN") return <Navigate to="/admin" replace />;
  if (role === "STORE_OWNER") return <Navigate to="/owner" replace />;
  return <Navigate to="/stores" replace />;
}
