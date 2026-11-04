// AdminMainLayout.tsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "../Theme-context/ThemeContext";
import { ConfigProvider } from "antd";

const AdminMainLayout = () => {
  return (
    <ThemeProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#0d9488",
            borderRadius: 12,
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          },
          components: {
            Card: {
              borderRadiusLG: 16,
            },
            Table: {
              borderRadius: 12,
            },
            Button: {
              borderRadius: 8,
              fontWeight: 600,
            },
          },
        }}
      >
        <AdminSidebar>
          <div className="w-full">
            <Outlet />
          </div>
        </AdminSidebar>
        <Toaster position="top-right" />
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default AdminMainLayout;
