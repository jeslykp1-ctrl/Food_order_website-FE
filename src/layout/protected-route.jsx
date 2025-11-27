import { useAuth } from "../context/auth-context";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { authUser } = useAuth();

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
