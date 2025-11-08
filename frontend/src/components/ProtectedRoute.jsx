import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  try {
    const token = localStorage.getItem("token");
    const expiry =
      parseInt(localStorage.getItem("tokenExpiry") || "0", 10) || 0;
    if (!token) return <Navigate to="/login" replace />;
    if (expiry && Date.now() > expiry) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("authChanged"));
      return <Navigate to="/login" replace />;
    }
    return children;
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
}
