// AdminMainLayout.tsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "../Theme-context/ThemeContext";

const AdminMainLayout = () => {
  return (
    <>
      <ThemeProvider>
        <AdminSidebar>
          <Outlet />
        </AdminSidebar>
        <Toaster position="top-right" />
      </ThemeProvider>
    </>
  );
};

export default AdminMainLayout;
