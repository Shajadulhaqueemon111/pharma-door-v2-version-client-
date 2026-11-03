/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BellOutlined,
  UserOutlined,
  CloseOutlined,
  BgColorsOutlined,
  LogoutOutlined,
  IdcardOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Modal, List, Badge, Space, Tooltip } from "antd";
import type { MenuProps } from "antd";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../privateRoute/AuthContext";
import { usePharmacistTheme } from "./pharmacistTheme";

interface Notification {
  id: number;
  icon: string;
  message: string;
}


const PharmacistNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userId = user?._id;
  const profileImage = user?.profileImage || "";
  const pharmacistName = user?.name || "Pharmacist";
  const { themeConfig } = usePharmacistTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasSeenNotifications, setHasSeenNotifications] = useState(true);
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null);
  const prevCount = useRef(0);

  // Initialize audio
  useEffect(() => {
    notificationSoundRef.current = new Audio(
      "https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3",
    );
  }, []);

  // Fetch notifications based on medicines
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token || !userId) return;

        const res = await fetch(
          "https://pharmadoor-backend-v2.vercel.app/api/v1/medicine",
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!res.ok) throw new Error("Failed to fetch medicines");

        const json = await res.json();
        const medicines = json?.data || [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const next30Days = new Date();
        next30Days.setDate(today.getDate() + 30);
        next30Days.setHours(0, 0, 0, 0);

        const expiredMedicines = medicines.filter((medicine: any) => {
          const expiryDate = new Date(medicine.expiryDate);
          expiryDate.setHours(0, 0, 0, 0);
          return expiryDate <= today && medicine.createdBy?._id === userId;
        });

        const expiringSoonMedicines = medicines.filter((medicine: any) => {
          const expiryDate = new Date(medicine.expiryDate);
          expiryDate.setHours(0, 0, 0, 0);
          return (
            expiryDate > today &&
            expiryDate <= next30Days &&
            medicine.createdBy?._id === userId
          );
        });

        const newNotifications: Notification[] = [];

        if (expiredMedicines.length > 0) {
          newNotifications.push({
            id: 1,
            icon: "⚠️",
            message: `${expiredMedicines.length} medicine(s) have expired. Please update or clear them.`,
          });
        }

        if (expiringSoonMedicines.length > 0) {
          newNotifications.push({
            id: 2,
            icon: "⏳",
            message: `${expiringSoonMedicines.length} medicine(s) will reach expiration within 30 days.`,
          });
        }

        setNotifications(newNotifications);
        setHasSeenNotifications(newNotifications.length === 0);
      } catch (error) {
        console.error("Error fetching medicines for alerts:", error);
      }
    };

    fetchMedicines();
  }, [userId]);

  // Play notification chime
  useEffect(() => {
    if (notifications.length > prevCount.current) {
      notificationSoundRef.current?.play().catch(() => { });
    }
    prevCount.current = notifications.length;
  }, [notifications]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Profile dropdown menu items
  const menuItems: MenuProps["items"] = [
    {
      key: "info",
      disabled: true,
      label: (
        <div className="py-1 px-1">
          <p className="font-bold text-slate-900 text-xs">{pharmacistName}</p>
          <p className="text-[11px] text-slate-500">{user?.email || "Licensed Pharmacist"}</p>
          <span
            className="mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${themeConfig.accentColor}18`,
              color: themeConfig.accentColor,
            }}
          >
            Verified Dispenser
          </span>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "profile",
      icon: <IdcardOutlined />,
      label: <Link to="/pharmacist-dashboard/profile">Pharmacist Profile</Link>,
    },
    {
      key: "theme",
      icon: <BgColorsOutlined style={{ color: themeConfig.accentColor }} />,
      label: <Link to="/pharmacist-dashboard/profile">Sidebar & Text Colors</Link>,
    },
    {
      key: "medicines",
      icon: <MedicineBoxOutlined />,
      label: <Link to="/pharmacist-dashboard/all-medicine">Manage Medicines</Link>,
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ color: "#ef4444" }} />,
      label: <span className="text-rose-600 font-bold">Logout</span>,
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

        {/* Notification Bell */}
        <Badge
          count={!hasSeenNotifications ? notifications.length : 0}
          dot={notifications.length > 0 && !hasSeenNotifications}
          offset={[-2, 2]}
        >
          <div
            onClick={() => {
              setIsModalOpen(true);
              setHasSeenNotifications(true);
              notificationSoundRef.current?.play().catch(() => { });
            }}
            className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            title="Medicine Expiry Alerts"
          >
            <BellOutlined style={{ fontSize: 18 }} />
          </div>
        </Badge>

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

      {/* Notifications Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <BellOutlined style={{ color: themeConfig.accentColor }} />
            <span>Medicine Inventory & Expiration Alerts</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        closeIcon={<CloseOutlined />}
      >
        {notifications.length > 0 ? (
          <List
            dataSource={notifications}
            renderItem={(note) => (
              <List.Item className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl mb-2 border border-slate-100 dark:border-slate-800">
                <List.Item.Meta
                  avatar={<span className="text-xl">{note.icon}</span>}
                  description={<span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{note.message}</span>}
                />
              </List.Item>
            )}
          />
        ) : (
          <div className="text-center py-6 text-slate-400 text-xs">
            No active medicine expiration alerts today. All stocks are safe.
          </div>
        )}
      </Modal>
    </>
  );
};

export default PharmacistNavbar;
