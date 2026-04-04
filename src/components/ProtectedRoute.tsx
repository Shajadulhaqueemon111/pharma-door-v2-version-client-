/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ProtectedRoute.tsx

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./Pages/privateRoute/AuthContext";
import { ScaleLoader } from "react-spinners";

const ProtectedRoute = ({ children }: { children: any }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log("Checking protected route. User:", user);
  if (loading) {
    return (
      <div>
        <ScaleLoader color="#2cabab" height={12} />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  // if (user.role !== "admin") {
  //   return <Navigate to="/" replace />;
  // }
  return children;
};

export default ProtectedRoute;
