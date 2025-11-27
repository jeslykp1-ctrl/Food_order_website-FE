import { Navigate,Outlet } from "react-router-dom";
import { useAuth } from "../context/auth-context";

const AdminRoute = () => {
  const {  isAdmin } = useAuth();

  if (!isAdmin()) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;