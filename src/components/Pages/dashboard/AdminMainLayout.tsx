import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Toaster } from "react-hot-toast";

const AdminMainLayout = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />
      <main className="flex-1 p-4">
        <Outlet />
        <Toaster position="top-right" />
      </main>
    </div>
  );
};

export default AdminMainLayout;
