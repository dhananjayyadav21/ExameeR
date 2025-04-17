import React from "react";
import { Navigate } from "react-router-dom";

const GuardedRoute = ({hasToBeAuthenticated, redirectTo, element,})=>
{
  const Token = localStorage.getItem("token");

  if (hasToBeAuthenticated === Boolean(Token)) {
    return element;
  } else {
    return <Navigate to={redirectTo} replace />;
  }
};

export default GuardedRoute;
