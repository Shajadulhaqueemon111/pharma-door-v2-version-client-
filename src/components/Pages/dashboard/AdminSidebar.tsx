import { useState, type ReactNode } from "react";
import { Layout, Menu, Button } from "antd";
import type { MenuProps } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  FileProtectOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../privateRoute/AuthContext";
import { useTheme } from "../Theme-context/ThemeContext";

const { Header, Sider, Content } = Layout;

interface AdminSidebarProps {
  children?: ReactNode;
}

const AdminSidebar = ({ children }: AdminSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "/admin-dashboard",
      icon: <AppstoreOutlined />,
      label: "Dashboard",
    },
    {
      key: "/admin-dashboard/all-users",
      icon: <UserOutlined />,
      label: "All Users",
    },
    {
      key: "/admin-dashboard/all-pharmacist",
      icon: <MedicineBoxOutlined />,
      label: "Total Pharmacist",
    },
    {
      key: "/admin-dashboard/all-document",
      icon: <FileProtectOutlined />,
      label: "Document Verification",
    },
    {
      key: "theme",
      icon: <MoonOutlined />,
      label: theme === "dark" ? "Light Mode" : "Dark Mode",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const { key } = e;

    // 🔥 Theme toggle
    if (key === "theme") {
      toggleTheme();
      return;
    }

    // 🔥 Logout
    if (key === "logout") {
      handleLogout();
      return;
    }

    // 🔥 Navigation
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
      >
        <div
          style={{
            color: "white",
            textAlign: "center",
            padding: 16,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          {collapsed ? "AP" : "Admin Panel"}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      {/* MAIN AREA */}
      <Layout
        style={{
          background: theme === "dark" ? "#141414" : "#f5f6fa",
          transition: "0.3s",
        }}
      >
        {/* HEADER */}
        <Header
          style={{
            padding: 0,
            background: theme === "dark" ? "#1f1f1f" : "#fff",
            display: "flex",
            alignItems: "center",
            paddingLeft: 16,
            color: theme === "dark" ? "#fff" : "#000",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: theme === "dark" ? "#fff" : "#000" }}
          />
        </Header>

        {/* CONTENT */}
        <Content
          style={{
            margin: 16,
            padding: 16,
            minHeight: 280,
            background: theme === "dark" ? "#1f1f1f" : "#fff",
            borderRadius: 10,
            transition: "0.3s",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminSidebar;
