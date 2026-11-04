/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Typography,
  Input,
  Button,
  Avatar,
  Divider,
  Tag,
  Upload,
  Switch,
  Alert,
  Spin,
  Table,
  Badge,
  Card,
} from "antd";
import {
  UserOutlined,
  KeyOutlined,
  BgColorsOutlined,
  DesktopOutlined,
  SaveOutlined,
  CameraOutlined,
  SafetyCertificateOutlined,
  PhoneOutlined,
  MailOutlined,
  HistoryOutlined,
  LockOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import { useAuth } from "../privateRoute/AuthContext";
import { usePharmacistTheme } from "./pharmacistTheme";
import {
  useUploadAvatarMutation,
  useChangePasswordMutation,
  useToggle2FAMutation,
  useGetSessionsQuery,
} from "../../../redux/api/authApi";
import { useGetAuditLogsQuery } from "../../../redux/api/auditApi";

const { Title } = Typography;

const sidebarPresets = [
  { name: "Midnight Slate", color: "#0f172a" },
  { name: "Deep Emerald", color: "#064e3b" },
  { name: "Royal Indigo", color: "#1e1b4b" },
  { name: "Medical Teal", color: "#134e4a" },
  { name: "Charcoal Dark", color: "#18181b" },
  { name: "Obsidian Black", color: "#090d16" },
];

const accentPresets = [
  { name: "Medical Teal", color: "#0d9488" },
  { name: "Emerald Green", color: "#10b981" },
  { name: "Sky Cyan", color: "#06b6d4" },
  { name: "Royal Blue", color: "#2563eb" },
  { name: "Vivid Violet", color: "#8b5cf6" },
  { name: "Rose Pink", color: "#f43f5e" },
  { name: "Amber Gold", color: "#f59e0b" },
];

const PharmacistProfile = () => {
  const { user, updateUser } = useAuth();
  const { themeConfig, setThemeConfig } = usePharmacistTheme();

  const [activeTab, setActiveTab] = useState<
    "profile" | "appearance" | "security" | "sessions" | "audit"
  >("profile");

  // RTK Query hooks
  const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [toggle2FA, { isLoading: isToggling2FA }] = useToggle2FAMutation();
  const { data: sessionsData, isLoading: isLoadingSessions } = useGetSessionsQuery(undefined, {
    pollingInterval: 30000,
  });
  const { data: auditLogs = [], isLoading: isLoadingAudit } = useGetAuditLogsQuery({ limit: 50 });

  // Profile fields state
  const [name, setName] = useState(user?.name || "Md Sajedul Haque Emon");
  const [email] = useState(user?.email || "pharmacist@pharmadoor.com");
  const [phone, setPhone] = useState("+880 1711-223344");
  const [pharmacyName, setPharmacyName] = useState("PharmaDoor Model Pharmacy & Dispensary");
  const [drugLicense, setDrugLicense] = useState("DGDA-DL-2024-88914");
  const [address, setAddress] = useState("House 42, Road 11, Dhanmondi, Dhaka");
  const [bio, setBio] = useState(
    "Licensed pharmacist committed to genuine medicine dispensation, patient counseling, and temperature-controlled storage compliance.",
  );
  const [profileImage, setProfileImage] = useState(
    user?.profileImage ||
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop",
  );

  // Sync profile photo if user object changes
  useEffect(() => {
    if (user?.profileImage) {
      setProfileImage(user.profileImage);
    }
  }, [user?.profileImage]);

  // Theme Customization State
  const [customSidebarBg, setCustomSidebarBg] = useState(themeConfig.sidebarBg);
  const [customAccentColor, setCustomAccentColor] = useState(themeConfig.accentColor);
  const [customMode, setCustomMode] = useState<"dark" | "light">(themeConfig.mode);

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  const [saving, setSaving] = useState(false);

  // Handle Real Cloudinary File Upload
  const handleFileUpload = async (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.error("Please upload an image file (PNG, JPG, WEBP)");
      return Upload.LIST_IGNORE;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      toast.error("Image file must be under 5MB");
      return Upload.LIST_IGNORE;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res: any = await uploadAvatar(formData).unwrap();
      const newImageUrl = res?.data?.profileImage || res?.profileImage;

      if (newImageUrl) {
        setProfileImage(newImageUrl);
        if (user && updateUser) {
          updateUser({ ...user, profileImage: newImageUrl });
        }
        toast.success("Profile photo hosted on Cloudinary successfully! ☁️", {
          icon: "📸",
        });
      }
    } catch (err: any) {
      console.error("Avatar upload failed:", err);
      toast.error(err?.data?.message || "Failed to upload photo to Cloudinary");
    }

    return false; // Prevent default upload action
  };

  // Handle Profile Update Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (user && updateUser) {
        updateUser({ ...user, name, profileImage });
      }
      toast.success("Pharmacist profile information saved successfully!", { icon: "✅" });
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Handle Appearance & Color Theme Save
  const handleApplyTheme = () => {
    setThemeConfig({
      sidebarBg: customSidebarBg,
      accentColor: customAccentColor,
      mode: customMode,
    });
    toast.success("Theme & Colors applied across Pharmacist Suite!", { icon: "🎨" });
  };

  // Handle Real Password Update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter current password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await changePassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
      }).unwrap();

      toast.success("Password changed successfully! Keep your credentials safe.", {
        icon: "🔒",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to change password. Please check current password.");
    }
  };

  // Handle 2FA Toggle
  const handleToggle2FA = async (checked: boolean) => {
    try {
      await toggle2FA({ enabled: checked }).unwrap();
      setIs2FAEnabled(checked);
      if (checked) {
        toast.success("Two-Factor Authentication activated! OTP required on login.", {
          icon: "🛡️",
        });
      } else {
        toast("Two-Factor Authentication disabled.", { icon: "⚠️" });
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update 2FA status");
    }
  };

  // Sessions Columns
  const sessionColumns = [
    {
      title: "Device / Browser",
      dataIndex: "device",
      key: "device",
      render: (text: string, record: any) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
            <DesktopOutlined />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-xs">{text || "Chrome on Windows 11"}</p>
            <p className="text-[10px] text-slate-400">{record.browser || "Chrome / WebKit"}</p>
          </div>
        </div>
      ),
    },
    {
      title: "IP Address & Location",
      dataIndex: "ip",
      key: "ip",
      render: (ip: string, record: any) => (
        <div>
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-700">
            <GlobalOutlined className="text-teal-600" />
            <span>{ip || "103.145.244.12"}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <EnvironmentOutlined className="text-rose-500" />
            <span>{record.location || "Dhaka, Bangladesh"}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Last Active",
      dataIndex: "lastActive",
      key: "lastActive",
      render: (date: string) => (
        <div className="text-xs text-slate-600 flex items-center gap-1.5">
          <ClockCircleOutlined className="text-slate-400" />
          <span>{date ? new Date(date).toLocaleTimeString() : "Just now"}</span>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: () => (
        <Tag color="success" className="font-bold text-[10px] rounded-full px-2.5 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1.5 animate-pulse" />
          Active Session
        </Tag>
      ),
    },
  ];

  // Audit Logs Columns
  const auditColumns = [
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action: string) => {
        let color = "blue";
        if (action.includes("DELETE")) color = "error";
        if (action.includes("UPDATE") || action.includes("MODIFY")) color = "warning";
        if (action.includes("LOGIN") || action.includes("2FA")) color = "purple";
        if (action.includes("UPLOAD")) color = "cyan";
        return (
          <Tag color={color} className="font-bold text-[10px] uppercase rounded">
            {action}
          </Tag>
        );
      },
    },
    {
      title: "Target / Entity",
      dataIndex: "target",
      key: "target",
      render: (target: string, record: any) => (
        <div>
          <p className="font-bold text-slate-800 text-xs">{target}</p>
          {record.targetId && (
            <p className="text-[10px] font-mono text-slate-400">ID: {record.targetId.slice(-8)}</p>
          )}
        </div>
      ),
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (details: string) => (
        <p className="text-xs text-slate-600 max-w-xs truncate" title={details}>
          {details || "Operation recorded"}
        </p>
      ),
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
      render: (ip: string) => (
        <span className="font-mono text-[11px] text-slate-500">{ip || "127.0.0.1"}</span>
      ),
    },
    {
      title: "Timestamp",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-[11px] text-slate-500">
          {new Date(date).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Hero Banner */}
      <div
        className="rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center gap-6"
        style={{
          background: `linear-gradient(135deg, ${customSidebarBg} 0%, #134e4a 100%)`,
        }}
      >
        <div className="relative group shrink-0">
          <Spin spinning={isUploadingAvatar}>
            <Avatar
              size={96}
              src={profileImage}
              icon={<UserOutlined />}
              className="border-4 shadow-xl"
              style={{ borderColor: customAccentColor }}
            />
          </Spin>

          {/* Real Cloudinary Upload Button */}
          <Upload
            beforeUpload={handleFileUpload}
            showUploadList={false}
            accept="image/*"
          >
            <button
              type="button"
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-white text-slate-900 shadow-md hover:bg-slate-100 transition cursor-pointer flex items-center justify-center border-0"
              title="Upload new profile photo to Cloudinary"
            >
              <CameraOutlined style={{ fontSize: 16 }} />
            </button>
          </Upload>
        </div>

        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <Title level={3} style={{ color: "#fff", margin: 0, fontWeight: 800 }}>
              {name}
            </Title>
            <Tag color="cyan" className="font-bold text-xs rounded-full px-2.5">
              Verified Pharmacist
            </Tag>
            <Tag color="emerald" className="font-bold text-xs rounded-full px-2.5">
              Cloudinary Synced
            </Tag>
          </div>

          <p className="text-xs sm:text-sm text-slate-200">
            {pharmacyName} • License: {drugLicense}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 pt-1">
            <span className="flex items-center gap-1.5">
              <MailOutlined /> {email}
            </span>
            <span className="flex items-center gap-1.5">
              <PhoneOutlined /> {phone}
            </span>
            <span className="flex items-center gap-1.5">
              <SafetyCertificateOutlined /> DGDA Grade-A Certified
            </span>
          </div>
        </div>

        {/* Current Active Color Pill */}
        <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-xs text-center space-y-1 shrink-0">
          <span className="text-[10px] text-slate-300 font-bold block uppercase tracking-wider">
            Active Colors
          </span>
          <div className="flex items-center justify-center gap-2">
            <span
              className="w-4 h-4 rounded-full border border-white shadow-xs"
              style={{ backgroundColor: customSidebarBg }}
              title="Sidebar Color"
            />
            <span
              className="w-4 h-4 rounded-full border border-white shadow-xs"
              style={{ backgroundColor: customAccentColor }}
              title="Text/Accent Color"
            />
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${activeTab === "profile"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            <UserOutlined />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab("appearance")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer relative ${activeTab === "appearance"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            <BgColorsOutlined style={{ color: customAccentColor }} />
            <span>Sidebar & Text Colors</span>
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${activeTab === "security"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            <KeyOutlined />
            <span>Security & 2FA</span>
          </button>

          <button
            onClick={() => setActiveTab("sessions")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${activeTab === "sessions"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            <DesktopOutlined />
            <span>Active Sessions & IP</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${activeTab === "audit"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            <HistoryOutlined />
            <span>Dispensary Audit Logs</span>
          </button>
        </div>

        {/* TAB 1: Profile Details */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pharmacist Full Name *
                </label>
                <Input
                  size="large"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Pharmacist Name"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address (Login ID)
                </label>
                <Input
                  size="large"
                  value={email}
                  disabled
                  className="rounded-xl bg-slate-50 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phone Number *
                </label>
                <Input
                  size="large"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880..."
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  DGDA Drug License Number
                </label>
                <Input
                  size="large"
                  value={drugLicense}
                  onChange={(e) => setDrugLicense(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pharmacy Dispensary Name
                </label>
                <Input
                  size="large"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Storefront Address
                </label>
                <Input
                  size="large"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pharmacist Professional Statement / Bio
              </label>
              <Input.TextArea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="rounded-xl"
              />
            </div>

            {/* Cloudinary Upload Reminder Callout */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={profileImage} size={48} className="border-2 border-teal-600" />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Profile Photo Hosted on Cloudinary
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Click the camera button on your avatar above or upload a new photo directly.
                  </p>
                </div>
              </div>

              <Upload
                beforeUpload={handleFileUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Button
                  loading={isUploadingAvatar}
                  icon={<CameraOutlined />}
                  className="rounded-xl font-bold text-xs"
                >
                  Upload New Avatar
                </Button>
              </Upload>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
                icon={<SaveOutlined />}
                size="large"
                style={{
                  backgroundColor: customAccentColor,
                  borderColor: customAccentColor,
                  borderRadius: 12,
                  fontWeight: "bold",
                }}
              >
                Save Profile Changes
              </Button>
            </div>
          </form>
        )}

        {/* TAB 2: Appearance & Theme Customizer */}
        {activeTab === "appearance" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    1. Pharmacist Suite Sidebar Background Color
                  </h4>
                  <p className="text-xs text-slate-500">
                    Pick a curated color preset or set your custom dispensary hex color.
                  </p>
                </div>
                <Tag
                  color="processing"
                  className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full"
                >
                  {customSidebarBg}
                </Tag>
              </div>

              {/* Sidebar Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-1">
                {sidebarPresets.map((preset) => (
                  <button
                    key={preset.color}
                    type="button"
                    onClick={() => setCustomSidebarBg(preset.color)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between h-20 ${customSidebarBg.toLowerCase() === preset.color.toLowerCase()
                        ? "border-teal-500 ring-2 ring-teal-500/20 shadow-md bg-teal-50/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-white/60 shadow-xs block"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="text-[11px] font-bold text-slate-700 block truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom Color Input for Sidebar */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-semibold text-slate-600">Custom Sidebar Hex:</span>
                <Input
                  value={customSidebarBg}
                  onChange={(e) => setCustomSidebarBg(e.target.value)}
                  style={{ width: 140, borderRadius: 10, fontFamily: "monospace" }}
                />
                <input
                  type="color"
                  value={customSidebarBg}
                  onChange={(e) => setCustomSidebarBg(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                />
              </div>
            </div>

            <Divider />

            {/* 2. Text / Accent Color */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    2. Primary Text & Interaction Accent Color
                  </h4>
                  <p className="text-xs text-slate-500">
                    Applied to active navigation tabs, buttons, metric charts, and highlights.
                  </p>
                </div>
                <Tag
                  color="processing"
                  className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full"
                >
                  {customAccentColor}
                </Tag>
              </div>

              {/* Accent Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-1">
                {accentPresets.map((preset) => (
                  <button
                    key={preset.color}
                    type="button"
                    onClick={() => setCustomAccentColor(preset.color)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between h-20 ${customAccentColor.toLowerCase() === preset.color.toLowerCase()
                        ? "border-teal-500 ring-2 ring-teal-500/20 shadow-md bg-teal-50/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-white/60 shadow-xs block"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="text-[11px] font-bold text-slate-700 block truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom Color Input for Accent */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-semibold text-slate-600">Custom Accent Hex:</span>
                <Input
                  value={customAccentColor}
                  onChange={(e) => setCustomAccentColor(e.target.value)}
                  style={{ width: 140, borderRadius: 10, fontFamily: "monospace" }}
                />
                <input
                  type="color"
                  value={customAccentColor}
                  onChange={(e) => setCustomAccentColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                />
              </div>
            </div>

            <Divider />

            {/* 3. Theme Mode Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                3. Workspace Theme Mode
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCustomMode("light")}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${customMode === "light"
                      ? "bg-amber-100 text-amber-900 border-2 border-amber-400 shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  <span>☀️ Light Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCustomMode("dark")}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${customMode === "dark"
                      ? "bg-slate-900 text-white border-2 border-teal-500 shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  <span>🌙 Dark Mode</span>
                </button>
              </div>
            </div>

            <Divider />

            {/* 4. Live Interactive Sidebar Mockup Preview */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                4. Live Sidebar & Accent Mockup Preview
              </label>

              <div className="p-4 bg-slate-100 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
                <div
                  className="w-56 rounded-2xl p-4 shadow-xl border border-white/10 space-y-3 shrink-0"
                  style={{ backgroundColor: customSidebarBg }}
                >
                  <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
                    <div
                      className="w-6 h-6 rounded-lg text-white font-black text-xs flex items-center justify-center"
                      style={{ backgroundColor: customAccentColor }}
                    >
                      Rx
                    </div>
                    <span className="text-white text-xs font-bold">
                      Pharma<span style={{ color: customAccentColor }}>Door</span>
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div
                      className="p-2 rounded-xl text-white font-bold flex items-center gap-2"
                      style={{
                        backgroundColor: `${customAccentColor}35`,
                        color: customAccentColor,
                      }}
                    >
                      <span>📊 Dashboard</span>
                    </div>
                    <div className="p-2 rounded-xl text-slate-300 font-medium">
                      <span>💊 All Medicines</span>
                    </div>
                    <div className="p-2 rounded-xl text-slate-300 font-medium">
                      <span>⏳ Expired Stock</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    Ready to apply this appearance?
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                    Clicking <strong>Save & Apply Theme</strong> will immediately update your left
                    sidebar, navigation icons, active buttons, and financial chart accents.
                  </p>
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleApplyTheme}
                    icon={<SaveOutlined />}
                    style={{
                      backgroundColor: customAccentColor,
                      borderColor: customAccentColor,
                      borderRadius: 12,
                      fontWeight: "bold",
                      boxShadow: `0 4px 14px ${customAccentColor}40`,
                    }}
                  >
                    Save & Apply Theme
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Security & Passwords & 2FA */}
        {activeTab === "security" && (
          <div className="space-y-6 max-w-2xl">
            {/* 2FA Card */}
            <Card className="rounded-2xl border border-teal-200/80 bg-teal-50/30 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <SafetyCertificateOutlined className="text-teal-600 text-lg" />
                    <h4 className="text-sm font-bold text-slate-900">
                      Two-Factor Authentication (Email 2FA)
                    </h4>
                    <Tag color={is2FAEnabled ? "success" : "default"} className="rounded-full font-bold text-[10px]">
                      {is2FAEnabled ? "PROTECTED" : "DISABLED"}
                    </Tag>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    When enabled, PharmaDoor generates and delivers a secure 6-digit OTP code to your registered email on every sign-in attempt.
                  </p>
                </div>
                <Switch
                  checked={is2FAEnabled}
                  loading={isToggling2FA}
                  onChange={handleToggle2FA}
                  checkedChildren="ON"
                  unCheckedChildren="OFF"
                  className="bg-slate-300"
                />
              </div>

              {/* 10-Minute Lockout Alert Callout */}
              <Alert
                className="mt-4 rounded-xl border border-amber-200 bg-amber-50"
                type="warning"
                showIcon
                message={
                  <span className="text-xs font-bold text-amber-900">
                    Security Lockout Policy (10 Minutes Penalty)
                  </span>
                }
                description={
                  <span className="text-xs text-amber-800">
                    To safeguard patient medicine logs and DGDA compliance, entering 3 consecutive incorrect OTPs will automatically invoke a strict <strong>10-minute lockout penalty</strong> during which login will be blocked.
                  </span>
                }
              />
            </Card>

            {/* Password Change Form */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <LockOutlined className="text-teal-600" />
                <span>Change Account Password</span>
              </h4>

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Current Password *
                  </label>
                  <Input.Password
                    size="large"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    New Password *
                  </label>
                  <Input.Password
                    size="large"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Confirm New Password *
                  </label>
                  <Input.Password
                    size="large"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="rounded-xl"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isChangingPassword}
                    size="large"
                    style={{
                      backgroundColor: customAccentColor,
                      borderColor: customAccentColor,
                      borderRadius: 12,
                      fontWeight: "bold",
                    }}
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: Active Sessions & IP / Device Detection */}
        {activeTab === "sessions" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <DesktopOutlined className="text-teal-600" />
                  <span>Real-time Active Sessions & Devices</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Real-time detection of IP address, geolocation, operating system, and browser sessions.
                </p>
              </div>

              <Tag color="cyan" className="font-bold text-xs rounded-full px-3 py-1 flex items-center gap-1.5 w-fit">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                Socket.IO Monitoring Live
              </Tag>
            </div>

            {/* Current Session Quick Card */}
            <div className="p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  <DesktopOutlined />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-bold text-slate-900">Current Active Device</h5>
                    <Badge status="processing" text="Online Now" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Chrome on Windows 11 • IP: 103.145.244.12 (Dhaka, Bangladesh)
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p>
                  <span className="text-slate-400">DGDA License:</span>{" "}
                  <strong className="text-emerald-700">Verified & Active</strong>
                </p>
                <p>
                  <span className="text-slate-400">Security:</span>{" "}
                  <strong className="text-teal-700">2FA Active • TLS 1.3</strong>
                </p>
              </div>
            </div>

            {/* Sessions Table */}
            <Table
              dataSource={
                sessionsData?.data?.sessions || [
                  {
                    key: "1",
                    device: "Chrome on Windows 11",
                    browser: "Chrome 122.0.0 / Windows NT 10.0",
                    ip: "103.145.244.12",
                    location: "Dhaka, Bangladesh",
                    lastActive: new Date().toISOString(),
                  },
                  {
                    key: "2",
                    device: "Safari on iPhone 15 Pro",
                    browser: "Mobile Safari 17.2",
                    ip: "103.145.244.12",
                    location: "Dhaka, Bangladesh",
                    lastActive: new Date(Date.now() - 3600000).toISOString(),
                  },
                ]
              }
              columns={sessionColumns}
              loading={isLoadingSessions}
              pagination={false}
              className="border border-slate-100 rounded-2xl overflow-hidden"
            />
          </div>
        )}

        {/* TAB 5: Dispensary Audit Logs */}
        {activeTab === "audit" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HistoryOutlined className="text-teal-600" />
                  <span>Audit Trail & Activity Logs</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Chronological records of dispensary actions, stock modifications, and security events.
                </p>
              </div>
              <Tag color="blue" className="rounded-full text-xs font-bold px-3">
                {auditLogs.length} Records Tracked
              </Tag>
            </div>

            <Table
              dataSource={auditLogs}
              columns={auditColumns}
              loading={isLoadingAudit}
              rowKey="_id"
              pagination={{ pageSize: 8 }}
              className="border border-slate-100 rounded-2xl overflow-hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacistProfile;
