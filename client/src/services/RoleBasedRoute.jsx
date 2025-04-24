import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ allowedRoles = ["Admin", "Instructor"], element }) => {
  const userRole = localStorage.getItem("userRole");

  return allowedRoles.includes(userRole)
    ? element
    : <Navigate to="/" replace />;
};

export default RoleBasedRoute;
