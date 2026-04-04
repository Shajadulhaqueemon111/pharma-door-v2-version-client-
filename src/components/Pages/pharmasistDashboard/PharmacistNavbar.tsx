/* eslint-disable @typescript-eslint/no-explicit-any */
import { BellOutlined, UserOutlined, CloseOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Modal, List, Badge, Space, Typography } from "antd";
import type { MenuProps } from "antd";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../privateRoute/AuthContext";

interface Notification {
  id: number;
  icon: string;
  message: string;
}

const { Text, Title } = Typography;

const PharmacistNavbar = () => {
  const { user } = useAuth();
  const userId = user?._id;
  const profileImage = user?.profileImage || "";

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

  // Unlock audio after first click (browsers block autoplay)
  useEffect(() => {
    const unlockAudio = () => {
      notificationSoundRef.current?.play().catch(() => {});
      document.removeEventListener("click", unlockAudio);
    };
    document.addEventListener("click", unlockAudio);
  }, []);

  // Fetch notifications based on medicines
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token || !userId) return;

        const res = await fetch(
          "https://pharma-door-backend.vercel.app/api/v1/medicine",
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
            message: `${expiredMedicines.length} medicine(s) have expired. Please update or delete them.`,
          });
        }

        if (expiringSoonMedicines.length > 0) {
          newNotifications.push({
            id: 2,
            icon: "⏳",
            message: `${expiringSoonMedicines.length} medicine(s) will expire in 30 days.`,
          });
        }

        setNotifications(newNotifications);
        setHasSeenNotifications(newNotifications.length === 0);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchMedicines();
  }, [userId]);

  // Play sound only after first user interaction
  useEffect(() => {
    if (notifications.length > prevCount.current) {
      notificationSoundRef.current?.play().catch(() => {});
    }
    prevCount.current = notifications.length;
  }, [notifications]);

  // Profile dropdown menu
  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: <Link to="/pharmacist-dashboard/profile">View Profile</Link>,
    },
    {
      key: "logout",
      label: <Link to="/logout">Logout</Link>,
    },
  ];

  return (
    <>
      {/* Navbar */}
      <div
        style={{
          background: "#1677ff",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Title level={4} style={{ color: "#fff", margin: 0 }}>
          Pharmacist Panel
        </Title>

        <Space size="middle">
          {/* Notification Bell */}
          <Badge
            count={!hasSeenNotifications ? notifications.length : 0}
            dot={notifications.length > 0 && !hasSeenNotifications}
            offset={[-2, 2]}
          >
            <BellOutlined
              style={{ fontSize: 22, color: "#fff", cursor: "pointer" }}
              onClick={() => {
                setIsModalOpen(true);
                setHasSeenNotifications(true);
                notificationSoundRef.current?.play().catch(() => {});
              }}
            />
          </Badge>

          {/* Profile Dropdown */}
          <Dropdown menu={{ items: menuItems }} placement="bottomRight">
            <Avatar
              size={40}
              src={profileImage}
              icon={!profileImage ? <UserOutlined /> : undefined}
              style={{ cursor: "pointer" }}
            />
          </Dropdown>
        </Space>
      </div>

      {/* Notifications Modal */}
      <Modal
        title="Notifications"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        closeIcon={<CloseOutlined />}
      >
        {notifications.length > 0 ? (
          <List
            dataSource={notifications}
            renderItem={(note) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Text>{note.icon}</Text>}
                  description={note.message}
                />
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">No notifications</Text>
        )}
      </Modal>
    </>
  );
};

export default PharmacistNavbar;
