import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../privateRoute/AuthContext";
import { ScaleLoader } from "react-spinners";

const PharmacistProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
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

  if (user.role !== "pharmacist") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PharmacistProtectedRoute;
