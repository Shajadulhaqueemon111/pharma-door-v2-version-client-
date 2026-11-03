/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type ReactNode } from "react";
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Avatar,
  Badge,
} from "antd";
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
  SunOutlined,
  VideoCameraOutlined,
  BellOutlined,
  SearchOutlined,
  IdcardOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../privateRoute/AuthContext";
import { useTheme } from "../Theme-context/ThemeContext";

const { Header, Sider, Content } = Layout;

interface AdminSidebarProps {
  children?: ReactNode;
}

const AdminSidebar = ({ children }: AdminSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminName = user?.name || "Md Sajedul Haque Emon";
  const adminEmail = user?.email || "admin@pharmadoor.com";
  const adminImage =
    user?.profileImage ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";

  // Sidebar Menu Items categorized cleanly
  const menuItems: MenuProps["items"] = [
    {
      key: "/admin-dashboard",
      icon: <AppstoreOutlined style={{ fontSize: 16 }} />,
      label: <span className="font-semibold text-xs sm:text-sm">Executive Dashboard</span>,
    },
    {
      key: "/admin-dashboard/doctors",
      icon: <VideoCameraOutlined style={{ fontSize: 16, color: "#14b8a6" }} />,
      label: (
        <span className="font-semibold text-xs sm:text-sm flex items-center justify-between">
          <span>Doctor Management</span>
          <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.2 rounded font-mono">
            Live
          </span>
        </span>
      ),
    },
    {
      key: "/admin-dashboard/all-users",
      icon: <UserOutlined style={{ fontSize: 16 }} />,
      label: <span className="font-semibold text-xs sm:text-sm">All Users & Patients</span>,
    },
    {
      key: "/admin-dashboard/all-pharmacist",
      icon: <MedicineBoxOutlined style={{ fontSize: 16 }} />,
      label: <span className="font-semibold text-xs sm:text-sm">Total Pharmacists</span>,
    },
    {
      key: "/admin-dashboard/all-document",
      icon: <FileProtectOutlined style={{ fontSize: 16 }} />,
      label: <span className="font-semibold text-xs sm:text-sm">Document Verification</span>,
    },
    {
      type: "divider",
    },
    {
      key: "/admin-dashboard/profile",
      icon: <IdcardOutlined style={{ fontSize: 16, color: "#38bdf8" }} />,
      label: <span className="font-semibold text-xs sm:text-sm">Admin Profile & Settings</span>,
    },
    {
      key: "/",
      icon: <ShopOutlined style={{ fontSize: 16 }} />,
      label: <span className="font-semibold text-xs sm:text-sm">Public Store Front</span>,
    },
    {
      key: "theme",
      icon: isDark ? <SunOutlined style={{ fontSize: 16 }} /> : <MoonOutlined style={{ fontSize: 16 }} />,
      label: <span className="font-semibold text-xs sm:text-sm">{isDark ? "Light Interface" : "Dark Interface"}</span>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ fontSize: 16, color: "#f43f5e" }} />,
      label: <span className="font-semibold text-xs sm:text-sm text-rose-400">Secure Logout</span>,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const { key } = e;

    if (key === "theme") {
      toggleTheme();
      return;
    }

    if (key === "logout") {
      handleLogout();
      return;
    }

    navigate(key);
  };

  // Top header user dropdown items
  const profileDropdownItems: MenuProps["items"] = [
    {
      key: "info",
      disabled: true,
      label: (
        <div className="py-1 px-1">
          <p className="font-bold text-slate-900 text-xs">{adminName}</p>
          <p className="text-[11px] text-slate-500 truncate">{adminEmail}</p>
          <span className="mt-1 inline-block text-[10px] font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
            Super Administrator
          </span>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "profile",
      icon: <IdcardOutlined />,
      label: "My Admin Profile",
      onClick: () => navigate("/admin-dashboard/profile"),
    },
    {
      key: "doctors",
      icon: <VideoCameraOutlined />,
      label: "Doctor Management Desk",
      onClick: () => navigate("/admin-dashboard/doctors"),
    },
    {
      key: "store",
      icon: <HomeOutlined />,
      label: "Visit Pharmacy Store",
      onClick: () => navigate("/"),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ color: "#e11d48" }} />,
      label: <span className="text-rose-600 font-bold">Logout</span>,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(val) => setCollapsed(val)}
        width={260}
        collapsedWidth={80}
        style={{
          background: isDark ? "#090d16" : "#0f172a",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin-dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/25 shrink-0">
              PD
            </div>
            {!collapsed && (
              <div>
                <span className="font-extrabold text-sm text-white tracking-tight block">
                  Pharma<span className="text-teal-400">Door</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                  Admin Control
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Menu Navigation */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            background: "transparent",
            paddingTop: 8,
            fontSize: 13,
          }}
        />

        {/* Sidebar Footer with Admin Profile Card */}
        {!collapsed && (
          <div className="absolute bottom-14 left-0 right-0 p-3 mx-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
            <Link
              to="/admin-dashboard/profile"
              className="flex items-center gap-2.5 overflow-hidden group flex-1"
            >
              <Avatar src={adminImage} size={34} className="border border-teal-400/60 shrink-0" />
              <div className="overflow-hidden">
                <p className="font-bold text-white text-xs truncate group-hover:text-teal-400 transition-colors">
                  {adminName}
                </p>
                <p className="text-[10px] text-teal-400 font-medium">Super Admin</p>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition cursor-pointer"
              title="Logout"
            >
              <LogoutOutlined style={{ fontSize: 14 }} />
            </button>
          </div>
        )}
      </Sider>

      {/* MAIN LAYOUT AREA */}
      <Layout
        style={{
          background: isDark ? "#0b0f19" : "#f8fafc",
          transition: "0.2s ease-in-out",
        }}
      >
        {/* TOP HEADER */}
        <Header
          style={{
            padding: "0 24px",
            background: isDark ? "#0f172a" : "#ffffff",
            borderBottom: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
            position: "sticky",
            top: 0,
            zIndex: 30,
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Left: Sidebar toggle + Search */}
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: 16,
                color: isDark ? "#e2e8f0" : "#475569",
              }}
            />

            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-400 w-64">
              <SearchOutlined />
              <input
                type="text"
                placeholder="Search orders, doctors, users..."
                className="bg-transparent border-none outline-none text-xs text-slate-700 dark:text-slate-200 w-full"
              />
              <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1 rounded font-mono">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right: Live Telemedicine status + Notifications + Admin Profile */}
          <div className="flex items-center gap-4">
            {/* Telemedicine Socket Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Socket.IO Teleconsultation: Active</span>
            </div>

            {/* Quick Doctor Desk Shortcut */}
            <Link
              to="/admin-dashboard/doctors"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
            >
              <VideoCameraOutlined style={{ color: "#0d9488" }} />
              <span>Doctor Desk</span>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
              title="Toggle Theme"
            >
              {isDark ? <SunOutlined style={{ fontSize: 16 }} /> : <MoonOutlined style={{ fontSize: 16 }} />}
            </button>

            {/* Notification Badge */}
            <Badge count={2} offset={[-2, 2]}>
              <button
                onClick={() => navigate("/admin-dashboard/doctors")}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
                title="Active Consultations"
              >
                <BellOutlined style={{ fontSize: 16 }} />
              </button>
            </Badge>

            <span className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

            {/* Admin Profile Dropdown */}
            <Dropdown menu={{ items: profileDropdownItems }} trigger={["click"]} placement="bottomRight">
              <div className="flex items-center gap-2.5 cursor-pointer pl-1 group">
                <Avatar
                  src={adminImage}
                  size={36}
                  className="border-2 border-teal-500 ring-2 ring-teal-500/20 group-hover:scale-105 transition-transform"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {adminName}
                  </p>
                  <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold leading-tight">
                    Super Admin
                  </p>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* CONTENT AREA */}
        <Content
          style={{
            margin: 0,
            padding: 0,
            minHeight: "calc(100vh - 64px)",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminSidebar;
