import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function AuthenticatedRoutes() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return user && isAuthenticated ? <Outlet /> : <Navigate to={"/login"} />;
}

export default AuthenticatedRoutes;
