import { Outlet } from "react-router-dom";
import PharmacistSidebar from "./PharmacistSidebar";
import { Toaster } from "react-hot-toast";
import { ConfigProvider } from "antd";
import { usePharmacistTheme } from "./pharmacistTheme";

const PharmasistMainLayout = () => {
  const { themeConfig } = usePharmacistTheme();
  const isDarkMode = themeConfig.mode === "dark";

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: themeConfig.accentColor || "#0d9488",
          borderRadius: 12,
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          colorBgContainer: isDarkMode ? "#0f172a" : "#ffffff",
          colorText: isDarkMode ? "#f8fafc" : "#0f172a",
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
      <PharmacistSidebar>
        <div className="w-full">
          <Outlet />
          <Toaster position="top-right" />
        </div>
      </PharmacistSidebar>
    </ConfigProvider>
  );
};

export default PharmasistMainLayout;
