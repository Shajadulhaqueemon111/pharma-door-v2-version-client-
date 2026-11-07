/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  InboxOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  OrderedListOutlined,
  PercentageOutlined,
  LogoutOutlined,
  IdcardOutlined,
  ToolOutlined,
  ReadOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { useAuth } from "../privateRoute/AuthContext";
import PharmacistNavbar from "./PharmacistNavbar";
import { usePharmacistTheme } from "./pharmacistTheme";

const { Sider, Content, Header } = Layout;

interface AdminSidebarProps {
  children?: ReactNode;
}

const PharmacistSidebar = ({ children }: AdminSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { themeConfig } = usePharmacistTheme();

  const isDarkMode = themeConfig.mode === "dark";

  // Auto-collapse sidebar on route change on mobile
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setCollapsed(true);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const pharmacistName = user?.name || "Pharmacist";
  const pharmacistImage =
    user?.profileImage ||
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop";

  const menuItems = [
    {
      key: "/pharmacist-dashboard",
      icon: <AppstoreOutlined />,
      label: <Link to="/pharmacist-dashboard">Executive Dashboard</Link>,
    },
    {
      type: "divider" as const,
    },
    {
      key: "sub-medicines",
      icon: <MedicineBoxOutlined />,
      label: "Medicine Inventory",
      children: [
        {
          key: "/pharmacist-dashboard/all-medicine",
          icon: <InboxOutlined />,
          label: <Link to="/pharmacist-dashboard/all-medicine">All Medicines Stock</Link>,
        },
        {
          key: "/pharmacist-dashboard/create-medicine",
          icon: <OrderedListOutlined />,
          label: <Link to="/pharmacist-dashboard/create-medicine">Add New Medicine</Link>,
        },
        {
          key: "/pharmacist-dashboard/expire-medicines",
          icon: <ClockCircleOutlined />,
          label: <Link to="/pharmacist-dashboard/expire-medicines">Expired Medicines</Link>,
        },
        {
          key: "/pharmacist-dashboard/pre-expire-medicine",
          icon: <WarningOutlined />,
          label: <Link to="/pharmacist-dashboard/pre-expire-medicine">Pre-Expiry (30 Days)</Link>,
        },
      ],
    },
    {
      key: "sub-equipment",
      icon: <ToolOutlined />,
      label: "Medical Equipments",
      children: [
        {
          key: "/pharmacist-dashboard/all-equipment",
          icon: <InboxOutlined />,
          label: <Link to="/pharmacist-dashboard/all-equipment">All Equipment</Link>,
        },
        {
          key: "/pharmacist-dashboard/create-equipment",
          icon: <OrderedListOutlined />,
          label: <Link to="/pharmacist-dashboard/create-equipment">Add New Equipment</Link>,
        },
      ],
    },
    {
      key: "sub-veterinary",
      icon: <MedicineBoxOutlined />,
      label: "Veterinary Care",
      children: [
        {
          key: "/pharmacist-dashboard/all-animal-medicine",
          icon: <InboxOutlined />,
          label: <Link to="/pharmacist-dashboard/all-animal-medicine">Animal Medicines</Link>,
        },
        {
          key: "/pharmacist-dashboard/create-animal-medicine",
          icon: <OrderedListOutlined />,
          label: <Link to="/pharmacist-dashboard/create-animal-medicine">Add Animal Medicine</Link>,
        },
      ],
    },
    {
      key: "sub-orders",
      icon: <OrderedListOutlined />,
      label: "Customer Orders",
      children: [
        {
          key: "/pharmacist-dashboard/orderd-medicine",
          icon: <OrderedListOutlined />,
          label: <Link to="/pharmacist-dashboard/orderd-medicine">Prescription Orders</Link>,
        },
      ],
    },
    {
      key: "sub-offers",
      icon: <PercentageOutlined />,
      label: "Promotions & Offers",
      children: [
        {
          key: "/pharmacist-dashboard/all-offers",
          icon: <InboxOutlined />,
          label: <Link to="/pharmacist-dashboard/all-offers">Promotional Deals</Link>,
        },
        {
          key: "/pharmacist-dashboard/create-offer",
          icon: <OrderedListOutlined />,
          label: <Link to="/pharmacist-dashboard/create-offer">Publish New Promo</Link>,
        },
      ],
    },
    {
      key: "/pharmacist-dashboard/create-blog",
      icon: <ReadOutlined />,
      label: <Link to="/pharmacist-dashboard/create-blog">Medical Blog Publish</Link>,
    },
    {
      key: "/pharmacist-dashboard/profile",
      icon: <IdcardOutlined />,
      label: <Link to="/pharmacist-dashboard/profile">Dispensary Profile & Theme</Link>,
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ color: "#ef4444" }} />,
      label: <span onClick={handleLogout} className="text-rose-400 font-bold">Logout</span>,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }} className="relative">
      {/* Mobile Backdrop Overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Dynamic Customizable Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        breakpoint="lg"
        collapsedWidth={0}
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        width={260}
        style={{
          background: themeConfig.sidebarBg,
          borderRight: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "2px 0 12px rgba(0,0,0,0.15)",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          zIndex: 35,
        }}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <Link to="/pharmacist-dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold shadow-md shrink-0"
              style={{ backgroundColor: themeConfig.accentColor }}
            >
              Rx
            </div>
            {!collapsed && (
              <div>
                <span className="font-extrabold text-sm text-white tracking-tight block">
                  Pharma<span style={{ color: themeConfig.accentColor }}>Door</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                  Pharmacist Suite
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Menu Navigation */}
        <div className="py-2 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-none">
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{
              background: "transparent",
              fontSize: 13,
            }}
          />
        </div>

        {/* Sidebar Footer with Profile Mini Card */}
        {!collapsed && (
          <div className="absolute bottom-4 left-0 right-0 px-3">
            <Link
              to="/pharmacist-dashboard/profile"
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={pharmacistImage}
                  alt={pharmacistName}
                  className="w-8 h-8 rounded-full object-cover border shrink-0"
                  style={{ borderColor: themeConfig.accentColor }}
                />
                <div className="overflow-hidden">
                  <p className="font-bold text-white text-xs truncate group-hover:text-teal-300 transition">
                    {pharmacistName}
                  </p>
                  <p className="text-[10px] text-slate-400">DGDA Licensed</p>
                </div>
              </div>

              <div
                className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: themeConfig.accentColor }}
                title="Current Accent Color"
              />
            </Link>
          </div>
        )}
      </Sider>

      {/* Main Right Side Layout */}
      <Layout
        style={{
          background: isDarkMode ? "#090d16" : "#f8fafc",
          transition: "0.2s ease-in-out",
        }}
      >
        {/* Executive Header */}
        <Header
          className="sticky top-0 z-20 flex items-center justify-between px-3 sm:px-6 shadow-xs border-b transition-colors duration-200"
          style={{
            background: isDarkMode ? "#0f172a" : "#ffffff",
            borderColor: isDarkMode ? "#1e293b" : "#e2e8f0",
            height: 64,
          }}
        >
          {/* Left: Collapse Toggle + Sub-title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              type="text"
              onClick={() => setCollapsed(!collapsed)}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              style={{
                fontSize: 16,
                color: isDarkMode ? "#e2e8f0" : "#334155",
              }}
            />

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Panel /</span>
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                Dispensary & Pharmacy Operations
              </span>
            </div>
          </div>

          {/* Right: Notifications, Accent Trigger, Profile Dropdown */}
          <PharmacistNavbar />
        </Header>

        {/* Content Area with responsive padding */}
        <Content
          className="p-3 sm:p-6 transition-all"
          style={{
            minHeight: "calc(100vh - 64px)",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default PharmacistSidebar;
