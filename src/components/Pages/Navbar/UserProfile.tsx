/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useAuth } from "../privateRoute/AuthContext";
import { Link, useSearchParams } from "react-router-dom";
import {
  Upload,
  Input,
  Button,
  Tabs,
  Tag,
  Spin,
  Table,
  Badge,
} from "antd";
import {
  UserOutlined,
  CameraOutlined,
  MailOutlined,
  LockOutlined,
  DesktopOutlined,
  SaveOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  ShieldCheck,
  FileText,
  ShoppingBag,
  ArrowRight,
  Phone,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useUploadAvatarMutation,
  useChangePasswordMutation,
  useGetSessionsQuery,
} from "../../../redux/api/authApi";
import { API_BASE_URL } from "../../../config/api";
import { MyOrders } from "../Orders/MyOrders";

const UserProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "orders"; // Default to orders or param
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const { data: sessionsData, isLoading: isLoadingSessions } = useGetSessionsQuery(undefined, {
    pollingInterval: 30000,
  });

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("+880 1700-112233");
  const [address, setAddress] = useState("Dhanmondi, Dhaka, Bangladesh");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      if (user.profileImage) {
        setProfileImage(user.profileImage);
      }
    }
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-24 text-slate-500 font-medium">
        <p className="text-base text-slate-700 dark:text-slate-300 font-bold mb-3">
          You are not signed in.
        </p>
        <Link
          to="/login"
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-md"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  // Handle Cloudinary Avatar Upload
  const handleFileUpload = async (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.error("Please upload an image file (PNG, JPG, WEBP)");
      return Upload.LIST_IGNORE;
    }

    if (file.size / 1024 / 1024 > 5) {
      toast.error("Image size must be less than 5MB");
      return Upload.LIST_IGNORE;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await uploadAvatar(formData).unwrap();
      const newImageUrl = response.data?.profileImage || response.data?.image;

      if (newImageUrl) {
        setProfileImage(newImageUrl);
        updateUser({ profileImage: newImageUrl });
        toast.success("Profile photo updated successfully!", { icon: "📸" });
      } else {
        toast.error("Image upload succeeded but failed to receive URL.");
      }
    } catch (err: any) {
      console.error("Cloudinary upload error:", err);
      toast.error(err?.data?.message || "Failed to upload image. Please try again.");
    }

    return false;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE_URL}/api/v1/user/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData?.message || "Failed to update profile.");
      }

      updateUser({ name });
      toast.success("Profile details updated successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to save profile changes.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      await changePassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
      }).unwrap();

      toast.success("Password changed successfully!", { icon: "🔒" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password");
    }
  };

  // Session table columns
  const sessionColumns = [
    {
      title: "Device / Browser",
      dataIndex: "device",
      key: "device",
      render: (device: string, record: any) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold text-xs">
            <DesktopOutlined />
          </div>
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-100 text-xs">
              {device || "Current Web Device"}
            </p>
            <p className="text-[10px] text-slate-400">{record.browser || "Chrome / Browser"}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Location & IP",
      dataIndex: "ip",
      key: "ip",
      render: (ip: string, record: any) => (
        <div>
          <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 block">
            {ip || "103.145.244.12"}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <EnvironmentOutlined className="text-rose-500" />
            {record.location || "Dhaka, Bangladesh"}
          </span>
        </div>
      ),
    },
    {
      title: "Last Active",
      dataIndex: "lastActive",
      key: "lastActive",
      render: (date: string) => (
        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <ClockCircleOutlined />
          {date ? new Date(date).toLocaleTimeString() : "Just now"}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: () => (
        <Tag color="success" className="font-bold text-[10px] rounded-full">
          <CheckCircleOutlined className="mr-1" /> Active
        </Tag>
      ),
    },
  ];

  const tabItems = [
    {
      key: "orders",
      label: (
        <span className="flex items-center gap-1.5 font-bold text-xs">
          <Package className="w-4 h-4 text-teal-600" /> My Orders & Tracking
        </span>
      ),
      children: <MyOrders />,
    },
    {
      key: "details",
      label: (
        <span className="flex items-center gap-1.5 font-bold text-xs">
          <UserOutlined /> Personal Details
        </span>
      ),
      children: (
        <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name *
              </label>
              <Input
                size="large"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl dark:bg-slate-800 dark:text-white dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address (Login ID)
              </label>
              <Input
                size="large"
                value={user.email}
                disabled
                className="rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 cursor-not-allowed border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Phone Number
              </label>
              <Input
                size="large"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl dark:bg-slate-800 dark:text-white dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Delivery Address
              </label>
              <Input
                size="large"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded-xl dark:bg-slate-800 dark:text-white dark:border-slate-700"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="primary"
              htmlType="submit"
              loading={savingProfile}
              size="large"
              icon={<SaveOutlined />}
              className="rounded-xl font-bold bg-teal-600 hover:bg-teal-700"
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      ),
    },
    {
      key: "password",
      label: (
        <span className="flex items-center gap-1.5 font-bold text-xs">
          <LockOutlined /> Security & Password
        </span>
      ),
      children: (
        <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2 max-w-lg">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Current Password *
            </label>
            <Input.Password
              size="large"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="rounded-xl dark:bg-slate-800 dark:text-white dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              New Password *
            </label>
            <Input.Password
              size="large"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="rounded-xl dark:bg-slate-800 dark:text-white dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Confirm New Password *
            </label>
            <Input.Password
              size="large"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="rounded-xl dark:bg-slate-800 dark:text-white dark:border-slate-700"
            />
          </div>

          <div className="pt-2">
            <Button
              type="primary"
              htmlType="submit"
              loading={isChangingPassword}
              size="large"
              className="rounded-xl font-bold bg-teal-600 hover:bg-teal-700"
            >
              Update Password
            </Button>
          </div>
        </form>
      ),
    },
    {
      key: "sessions",
      label: (
        <span className="flex items-center gap-1.5 font-bold text-xs">
          <DesktopOutlined /> Active Sessions
        </span>
      ),
      children: (
        <div className="space-y-4 pt-2">
          <div className="p-4 bg-teal-50/60 dark:bg-teal-950/40 rounded-2xl border border-teal-200/80 dark:border-teal-800/60 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Real-time Session Security
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Track connected devices, locations, and IPs logged into your account.
              </p>
            </div>
            <Badge status="processing" text={<span className="text-xs font-bold text-teal-700 dark:text-teal-400">Protected</span>} />
          </div>

          <Table
            dataSource={
              sessionsData?.data?.sessions || [
                {
                  key: "1",
                  device: "Chrome on Windows",
                  browser: "Chrome / WebKit",
                  ip: "103.145.244.12",
                  location: "Dhaka, Bangladesh",
                  lastActive: new Date().toISOString(),
                },
              ]
            }
            columns={sessionColumns}
            loading={isLoadingSessions}
            pagination={false}
            className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Background Banner */}
        <div className="h-44 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 relative">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 backdrop-blur-md border border-teal-400/30 text-teal-300 text-xs font-bold rounded-full">
            <ShieldCheck size={14} />
            <span>PharmaDoor Verified Patient</span>
          </div>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 sm:px-10 pb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
            <div className="relative group shrink-0">
              <Spin spinning={isUploadingAvatar}>
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-teal-50 dark:bg-slate-800 flex items-center justify-center text-teal-700 dark:text-teal-400 font-extrabold text-3xl">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={user.name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span>{name?.charAt(0).toUpperCase() || "U"}</span>
                  )}
                </div>
              </Spin>

              {/* Cloudinary Upload Trigger (NO PROMPT) */}
              <Upload
                beforeUpload={handleFileUpload}
                showUploadList={false}
                accept="image/*"
              >
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white shadow-md transition cursor-pointer border-2 border-white dark:border-slate-800 flex items-center justify-center"
                  title="Upload avatar to Cloudinary"
                >
                  <CameraOutlined style={{ fontSize: 16 }} />
                </button>
              </Upload>
            </div>

            <div className="text-center sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800 uppercase tracking-wider">
                Role: {user.role || "User"}
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {name || "Valued Customer"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
              <MailOutlined className="text-teal-600 dark:text-teal-400" />
              <span>{user.email}</span>
            </p>
          </div>

          {/* Quick Account Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/upload-prescription"
              className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 hover:bg-teal-50 dark:hover:bg-teal-950/50 border border-teal-200/60 dark:border-teal-800 transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <ArrowRight size={14} className="text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">Prescription Upload</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Submit new prescription doctor note</p>
              </div>
            </Link>

            <Link
              to="/products/all-products"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <ShoppingBag size={18} />
                </div>
                <ArrowRight size={14} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">Browse Medicines</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Explore catalogue of authentic drugs</p>
              </div>
            </Link>

            <Link
              to="/contact-page"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <Phone size={18} />
                </div>
                <ArrowRight size={14} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">Help & Support</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Contact customer care & pharmacists</p>
              </div>
            </Link>
          </div>

          {/* Interactive Account Management Tabs */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Tabs
              activeKey={activeTab}
              onChange={(key) => {
                setActiveTab(key);
                setSearchParams({ tab: key });
              }}
              items={tabItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
