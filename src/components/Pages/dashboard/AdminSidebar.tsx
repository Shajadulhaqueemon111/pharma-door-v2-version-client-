/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, type ReactNode } from "react";
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Avatar,
  Badge,
  Tag,
  Empty,
  Tooltip,
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
  IdcardOutlined,
  ShopOutlined,
  HistoryOutlined,
  CheckOutlined,
  UndoOutlined,
  CheckCircleOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../privateRoute/AuthContext";
import { useTheme } from "../Theme-context/ThemeContext";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "../../../redux/api/notificationApi";

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

  // RTK Query Notifications
  const { data: serverNotifications = [] } = useGetNotificationsQuery(undefined, {
    pollingInterval: 15000,
  });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [filterMode, setFilterMode] = useState<"all" | "unread">("all");

  const unreadCount = useMemo(() => {
    return serverNotifications.filter((n) => !n.read).length;
  }, [serverNotifications]);

  const displayedNotifications = useMemo(() => {
    if (filterMode === "unread") {
      return serverNotifications.filter((n) => !n.read);
    }
    return serverNotifications;
  }, [serverNotifications, filterMode]);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    await markAsRead({ id, read: !currentRead });
  };

  const isDark = theme === "dark";
  const adminName = user?.name || "Md Sajedul Haque Emon";
  const adminImage =
    user?.profileImage ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Sidebar Menu Items
  const menuItems: MenuProps["items"] = [
    {
      key: "/admin-dashboard",
      icon: <HomeOutlined style={{ fontSize: 16 }} />,
      label: <span className="font-semibold text-xs sm:text-sm">Control Overview</span>,
    },
    {
      key: "/admin-dashboard/doctors",
      icon: <VideoCameraOutlined style={{ fontSize: 16, color: "#14b8a6" }} />,
      label: (
        <span className="font-semibold text-xs sm:text-sm flex items-center justify-between">
          <span>Telemedicine Ops</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-2" />
        </span>
      ),
    },
    {
      key: "/admin-dashboard/products",
      icon: <AppstoreOutlined style={{ fontSize: 16 }} />,
      label: <span className="font-semibold text-xs sm:text-sm">Products & Catalog</span>,
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
      key: "/admin-dashboard/audit-logs",
      icon: <HistoryOutlined style={{ fontSize: 16, color: "#06b6d4" }} />,
      label: <span className="font-semibold text-xs sm:text-sm">Audit & Security Logs</span>,
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
          <p className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
            {adminName}
          </p>
          <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold leading-tight mt-0.5">
            Super Administrator
          </p>
          <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
            {user?.email}
          </p>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "profile",
      icon: <IdcardOutlined />,
      label: "Admin Profile & 2FA",
      onClick: () => navigate("/admin-dashboard/profile"),
    },
    {
      key: "audit",
      icon: <HistoryOutlined />,
      label: "System Audit Logs",
      onClick: () => navigate("/admin-dashboard/audit-logs"),
    },
    {
      key: "store",
      icon: <ShopOutlined />,
      label: "Store Front",
      onClick: () => navigate("/"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
      label: "Sign Out",
      onClick: handleLogout,
    },
  ];

  // Admin Notification Dropdown Overlay
  const notificationOverlay = (
    <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden text-slate-800">
      <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BellOutlined className="text-teal-400 text-base" />
          <span className="font-bold text-xs tracking-wide">Admin System Alerts</span>
          {unreadCount > 0 && (
            <Tag color="error" className="font-bold text-[10px] rounded-full px-2 py-0 border-0">
              {unreadCount} New
            </Tag>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="text-[11px] font-bold text-teal-300 hover:text-teal-200 flex items-center gap-1 transition cursor-pointer"
          >
            <CheckCircleOutlined /> Mark all read
          </button>
        )}
      </div>

      <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-100 text-xs">
        <button
          onClick={() => setFilterMode("all")}
          className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
            filterMode === "all"
              ? "bg-white text-slate-900 shadow-xs border border-slate-200"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          All ({serverNotifications.length})
        </button>
        <button
          onClick={() => setFilterMode("unread")}
          className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
            filterMode === "unread"
              ? "bg-white text-teal-700 shadow-xs border border-teal-200"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {displayedNotifications.length > 0 ? (
          displayedNotifications.map((note) => (
            <div
              key={note._id}
              className={`p-3 transition flex items-start gap-3 hover:bg-slate-50 ${
                !note.read ? "bg-teal-50/40" : ""
              }`}
            >
              <span className="text-lg shrink-0 mt-0.5">{note.read ? "ℹ️" : "🔔"}</span>

              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-snug ${!note.read ? "font-bold text-slate-900" : "text-slate-600"}`}>
                  {note.message}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <span>{new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {!note.read && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />}
                </p>
              </div>

              <button
                onClick={() => handleToggleRead(note._id, note.read)}
                className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                  note.read
                    ? "text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                    : "text-teal-600 hover:bg-teal-100 hover:text-teal-800"
                }`}
                title={note.read ? "Mark as unread" : "Mark as read"}
              >
                {note.read ? <UndoOutlined /> : <CheckOutlined />}
              </button>
            </div>
          ))
        ) : (
          <div className="py-8 text-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-xs text-slate-400">
                  {filterMode === "unread" ? "No unread alerts" : "All administrative systems normal."}
                </span>
              }
            />
          </div>
        )}
      </div>

      <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <AlertOutlined className="text-emerald-500" />
          Realtime Socket Connected
        </span>
        <Link
          to="/admin-dashboard/audit-logs"
          className="font-bold text-teal-600 hover:text-teal-700"
        >
          View System Audit
        </Link>
      </div>
    </div>
  );

  return (
    <Layout className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* SIDER */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={0}
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        width={260}
        style={{
          background: isDark ? "#090d16" : "#0f172a",
          overflowY: "auto",
          height: "100vh",
          position: "sticky",
          top: 0,
          left: 0,
          zIndex: 30,
        }}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <Link to="/admin-dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-sm shadow-md shrink-0">
              Rx
            </div>
            {!collapsed && (
              <div className="leading-none whitespace-nowrap">
                <span className="text-base font-extrabold text-white tracking-tight">
                  Pharma<span className="text-teal-400">Door</span>
                </span>
                <span className="block text-[9px] font-bold text-teal-300 uppercase tracking-widest mt-0.5">
                  Super Admin
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="py-4">
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            className="border-r-0"
            style={{
              background: "transparent",
            }}
          />
        </div>
      </Sider>

      {/* RIGHT SIDE MAIN CONTAINER */}
      <Layout
        className="transition-all duration-300"
        style={{
          background: isDark ? "#0b0f19" : "#f8fafc",
          minHeight: "100vh",
        }}
      >
        {/* TOP HEADER */}
        <Header
          className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 shadow-xs border-b transition-colors duration-200"
          style={{
            height: 64,
            background: isDark ? "#0f172a" : "#ffffff",
            borderColor: isDark ? "#1e293b" : "#e2e8f0",
          }}
        >
          {/* Left: Collapse toggle + Breadcrumb hint */}
          <div className="flex items-center gap-3">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-slate-600 dark:text-slate-300 hover:text-teal-600 text-base flex items-center justify-center"
            />
            <div className="hidden sm:block text-xs font-semibold text-slate-400">
              Admin Suite / <span className="text-slate-700 dark:text-slate-200 font-bold capitalize">{location.pathname.split("/").pop() || "Overview"}</span>
            </div>
          </div>

          {/* Right: Actions, Live Notifications & Admin Profile */}
          <div className="flex items-center gap-3">
            {/* Storefront button */}
            <Tooltip title="View Public Pharmacy">
              <Link
                to="/"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800 transition hover:bg-teal-100"
              >
                <ShopOutlined />
                <span>Storefront</span>
              </Link>
            </Tooltip>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
              title="Toggle Theme"
            >
              {isDark ? <SunOutlined style={{ fontSize: 16 }} /> : <MoonOutlined style={{ fontSize: 16 }} />}
            </button>

            {/* Realtime Notification Dropdown */}
            <Dropdown
              dropdownRender={() => notificationOverlay}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Badge count={unreadCount} offset={[-2, 2]}>
                <div
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
                  title="System Notifications & Alerts"
                >
                  <BellOutlined style={{ fontSize: 16 }} />
                </div>
              </Badge>
            </Dropdown>

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
