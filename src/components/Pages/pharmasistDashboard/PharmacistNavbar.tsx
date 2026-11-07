/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BellOutlined,
  UserOutlined,
  BgColorsOutlined,
  LogoutOutlined,
  IdcardOutlined,
  MedicineBoxOutlined,
  CheckOutlined,
  UndoOutlined,
  CheckCircleOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Badge, Space, Tooltip, Tag, Empty } from "antd";
import type { MenuProps } from "antd";
import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../privateRoute/AuthContext";
import { usePharmacistTheme } from "./pharmacistTheme";
import { API_BASE_URL } from "../../../config/api";
import { MessageSquare } from "lucide-react";
import { PharmacistChatModal } from "./PharmacistChatModal";
import { useGetMySupportChatQuery } from "../../../redux/api/supportChatApi";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "../../../redux/api/notificationApi";

interface LocalAlert {
  id: string;
  icon: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const PharmacistNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userId = user?._id;
  const profileImage = user?.profileImage || "";
  const pharmacistName = user?.name || "Pharmacist";
  const { themeConfig } = usePharmacistTheme();

  // RTK Query Notifications
  const { data: serverNotifications = [] } = useGetNotificationsQuery(undefined, {
    pollingInterval: 15000,
  });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const [localAlerts, setLocalAlerts] = useState<LocalAlert[]>([]);
  const [filterMode, setFilterMode] = useState<"all" | "unread">("all");
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const { data: supportChatData } = useGetMySupportChatQuery(undefined, { pollingInterval: 10000 });
  const unreadChatCount = supportChatData?.data?.unreadForPharmacist || 0;
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null);
  const prevCount = useRef(0);

  // Initialize audio
  useEffect(() => {
    notificationSoundRef.current = new Audio(
      "https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3",
    );
  }, []);

  // Fetch local inventory-based alerts (DGDA compliance & expiry)
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token || !userId) return;

        const res = await fetch(`${API_BASE_URL}/api/v1/medicine`, {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) return;

        const json = await res.json();
        const medicines = json?.data || [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const next30Days = new Date();
        next30Days.setDate(today.getDate() + 30);
        next30Days.setHours(0, 0, 0, 0);

        const expired = medicines.filter((m: any) => {
          const exp = new Date(m.expiryDate);
          exp.setHours(0, 0, 0, 0);
          return exp <= today && m.createdBy?._id === userId;
        });

        const expiringSoon = medicines.filter((m: any) => {
          const exp = new Date(m.expiryDate);
          exp.setHours(0, 0, 0, 0);
          return exp > today && exp <= next30Days && m.createdBy?._id === userId;
        });

        const alerts: LocalAlert[] = [];
        if (expired.length > 0) {
          alerts.push({
            id: "local-expired",
            icon: "🚨",
            message: `${expired.length} medicine batch(es) expired. Immediate DGDA quarantine required.`,
            read: false,
            createdAt: new Date().toISOString(),
          });
        }

        if (expiringSoon.length > 0) {
          alerts.push({
            id: "local-expiring",
            icon: "⏳",
            message: `${expiringSoon.length} medicine batch(es) expire within 30 days. Priority dispatch needed.`,
            read: false,
            createdAt: new Date().toISOString(),
          });
        }

        setLocalAlerts(alerts);
      } catch (error) {
        console.error("Error fetching medicines for alerts:", error);
      }
    };

    fetchMedicines();
  }, [userId]);

  // Combined notifications list
  const allNotifications = useMemo(() => {
    const list = [...localAlerts];
    serverNotifications.forEach((sn) => {
      list.push({
        id: sn._id,
        icon: sn.read ? "ℹ️" : "🔔",
        message: sn.message,
        read: sn.read,
        createdAt: sn.createdAt,
      });
    });
    return list;
  }, [localAlerts, serverNotifications]);

  // Unread count
  const unreadCount = useMemo(() => {
    return allNotifications.filter((n) => !n.read).length;
  }, [allNotifications]);

  // Play notification chime on new alert
  useEffect(() => {
    if (unreadCount > prevCount.current) {
      notificationSoundRef.current?.play().catch(() => { });
    }
    prevCount.current = unreadCount;
  }, [unreadCount]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Toggle single item read / unread
  const handleToggleRead = async (id: string, currentRead: boolean) => {
    if (id.startsWith("local-")) {
      setLocalAlerts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: !currentRead } : item)),
      );
    } else {
      await markAsRead({ id, read: !currentRead });
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    setLocalAlerts((prev) => prev.map((item) => ({ ...item, read: true })));
    await markAllAsRead();
  };

  // Filtered list
  const displayedNotifications = useMemo(() => {
    if (filterMode === "unread") {
      return allNotifications.filter((n) => !n.read);
    }
    return allNotifications;
  }, [allNotifications, filterMode]);

  // Notification Dropdown Overlay Panel
  const notificationOverlay = (
    <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden text-slate-800">
      {/* Header */}
      <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BellOutlined className="text-teal-400 text-base" />
          <span className="font-bold text-xs tracking-wide">Real-time Notifications</span>
          {unreadCount > 0 && (
            <Tag color="error" className="font-bold text-[10px] rounded-full px-2 py-0 border-0">
              {unreadCount} New
            </Tag>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-[11px] font-bold text-teal-300 hover:text-teal-200 flex items-center gap-1 transition cursor-pointer"
          >
            <CheckCircleOutlined /> Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-100 text-xs">
        <button
          onClick={() => setFilterMode("all")}
          className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${filterMode === "all"
              ? "bg-white text-slate-900 shadow-xs border border-slate-200"
              : "text-slate-500 hover:text-slate-800"
            }`}
        >
          All ({allNotifications.length})
        </button>
        <button
          onClick={() => setFilterMode("unread")}
          className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${filterMode === "unread"
              ? "bg-white text-teal-700 shadow-xs border border-teal-200"
              : "text-slate-500 hover:text-slate-800"
            }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {displayedNotifications.length > 0 ? (
          displayedNotifications.map((note) => (
            <div
              key={note.id}
              className={`p-3 transition flex items-start gap-3 hover:bg-slate-50 ${!note.read ? "bg-teal-50/40" : ""
                }`}
            >
              <span className="text-lg shrink-0 mt-0.5">{note.icon}</span>

              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-snug ${!note.read ? "font-bold text-slate-900" : "text-slate-600"}`}>
                  {note.message}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <span>{new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {!note.read && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />}
                </p>
              </div>

              {/* Action: Mark Read / Unread */}
              <button
                onClick={() => handleToggleRead(note.id, note.read)}
                className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${note.read
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
                  {filterMode === "unread" ? "No unread notifications" : "All quiet! Dispensary operates normally."}
                </span>
              }
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <AlertOutlined className="text-emerald-500" />
          Realtime Socket Connected
        </span>
        <Link
          to="/pharmacist-dashboard/profile"
          className="font-bold text-teal-600 hover:text-teal-700"
        >
          View Profile & Settings
        </Link>
      </div>
    </div>
  );

  const menuItems: MenuProps["items"] = [
    {
      key: "name",
      label: (
        <div className="px-1 py-1 border-b border-slate-100">
          <p className="text-xs font-bold text-slate-800">{pharmacistName}</p>
          <p className="text-[10px] text-slate-400">DGDA Model Dispensary</p>
        </div>
      ),
      disabled: true,
    },
    {
      key: "profile",
      icon: <IdcardOutlined />,
      label: <Link to="/pharmacist-dashboard/profile">Dispensary Profile & 2FA</Link>,
    },
    {
      key: "theme",
      icon: <BgColorsOutlined />,
      label: <Link to="/pharmacist-dashboard/profile">Theme & Sidebar Colors</Link>,
    },
    {
      key: "all-medicine",
      icon: <MedicineBoxOutlined />,
      label: <Link to="/pharmacist-dashboard/all-medicine">Medicine Inventory</Link>,
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

  return (
    <>
      <Space size={16} align="center">
        {/* Quick Color Appearance Trigger */}
        <Tooltip title="Customize Sidebar & Theme Colors">
          <Link
            to="/pharmacist-dashboard/profile"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition"
            style={{
              backgroundColor: `${themeConfig.accentColor}15`,
              color: themeConfig.accentColor,
              border: `1px solid ${themeConfig.accentColor}30`,
            }}
          >
            <BgColorsOutlined />
            <span>Theme Colors</span>
          </Link>
        </Tooltip>

        {/* Real-time 1-on-1 Admin Support Chat */}
        <Tooltip title="Direct Chat with Admin Support">
          <Badge count={unreadChatCount} offset={[-2, 2]}>
            <div
              onClick={() => setChatModalOpen(true)}
              className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Chat with PharmaDoor Admin"
            >
              <MessageSquare size={18} className="text-teal-600 dark:text-teal-400" />
            </div>
          </Badge>
        </Tooltip>

        {/* Real-time Notification Dropdown */}
        <Dropdown
          dropdownRender={() => notificationOverlay}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Badge count={unreadCount} offset={[-2, 2]}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Dispensary Notifications & Expiry Alerts"
            >
              <BellOutlined style={{ fontSize: 18 }} />
            </div>
          </Badge>
        </Dropdown>

        <span className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

        {/* Pharmacist Profile Dropdown */}
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["click"]}>
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <Avatar
              size={36}
              src={profileImage}
              icon={!profileImage ? <UserOutlined /> : undefined}
              className="border-2 shadow-xs group-hover:scale-105 transition-transform"
              style={{
                borderColor: themeConfig.accentColor,
              }}
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {pharmacistName}
              </p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">
                Pharmacist
              </p>
            </div>
          </div>
        </Dropdown>
      </Space>
      <PharmacistChatModal isOpen={chatModalOpen} onClose={() => setChatModalOpen(false)} />
    </>
  );
};

export default PharmacistNavbar;
