import { Outlet } from "react-router-dom";
import PharmacistSidebar from "./PharmacistSidebar";
import { Toaster } from "react-hot-toast";
import PharmacistNavbar from "./PharmacistNavbar";

const PharmasistMainLayout = () => {
  return (
    <PharmacistSidebar>
      <div
        style={{
          minHeight: "100vh",
          padding: "16px",
          background: "#f5f5f5", // matches your Content bg
        }}
      >
        <PharmacistNavbar />
        <Outlet />
        <Toaster />
      </div>
    </PharmacistSidebar>
  );
};

export default PharmasistMainLayout;
