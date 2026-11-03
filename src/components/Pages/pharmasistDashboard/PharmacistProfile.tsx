/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Typography,
  Input,
  Button,
  Avatar,
  Divider,
  Tag,
} from "antd";
import {
  UserOutlined,
  KeyOutlined,
  BgColorsOutlined,
  DesktopOutlined,
  SaveOutlined,
  CameraOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import { useAuth } from "../privateRoute/AuthContext";
import { usePharmacistTheme } from "./pharmacistTheme";

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

  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "security" | "sessions">("profile");

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

  // Theme Customization State
  const [customSidebarBg, setCustomSidebarBg] = useState(themeConfig.sidebarBg);
  const [customAccentColor, setCustomAccentColor] = useState(themeConfig.accentColor);
  const [customMode, setCustomMode] = useState<"dark" | "light">(themeConfig.mode);

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);

  // Handle Photo URL Change
  const handlePhotoChange = () => {
    const newUrl = prompt("Enter new Profile Image URL (Cloudinary / ImgBB):", profileImage);
    if (newUrl && newUrl.trim()) {
      setProfileImage(newUrl.trim());
      if (user && updateUser) {
        updateUser({ ...user, profileImage: newUrl.trim() });
      }
      toast.success("Profile photo updated!");
    }
  };

  // Handle Profile Update Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (user && updateUser) {
        updateUser({ ...user, name, profileImage });
      }
      toast.success("Pharmacist Profile information saved successfully!", { icon: "✅" });
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

  // Handle Password Update
  const handlePasswordUpdate = (e: React.FormEvent) => {
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

    toast.success("Security credentials updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

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
          <Avatar
            size={96}
            src={profileImage}
            icon={<UserOutlined />}
            className="border-4 shadow-xl"
            style={{ borderColor: customAccentColor }}
          />
          <button
            onClick={handlePhotoChange}
            className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-white text-slate-900 shadow-md hover:bg-slate-100 transition cursor-pointer"
            title="Update Profile Photo"
          >
            <CameraOutlined style={{ fontSize: 16 }} />
          </button>
        </div>

        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <Title level={3} style={{ color: "#fff", margin: 0, fontWeight: 800 }}>
              {name}
            </Title>
            <Tag color="cyan" className="font-bold text-xs rounded-full px-2.5">
              Verified Pharmacist
            </Tag>
          </div>

          <p className="text-xs sm:text-sm text-slate-200">
            {pharmacyName} • License: {drugLicense}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 pt-1">
            <span className="flex items-center gap-1.5">
              <MailOutlined />
              <span>{email}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <PhoneOutlined />
              <span>{phone}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <SafetyCertificateOutlined />
              <span>DGDA Grade-A Certified</span>
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
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "profile"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <UserOutlined />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab("appearance")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer relative ${
              activeTab === "appearance"
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
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "security"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <KeyOutlined />
            <span>Security & Passwords</span>
          </button>

          <button
            onClick={() => setActiveTab("sessions")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "sessions"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <DesktopOutlined />
            <span>Active Sessions</span>
          </button>
        </div>

        {/* TAB 1: Profile Details */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pharmacist Full Name *
                </label>
                <Input
                  size="large"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address (Login ID)
                </label>
                <Input
                  size="large"
                  disabled
                  value={email}
                  className="rounded-xl bg-slate-50 text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phone Number *
                </label>
                <Input
                  size="large"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="pt-2 flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={saving}
                icon={<SaveOutlined />}
                style={{
                  backgroundColor: customAccentColor,
                  borderColor: customAccentColor,
                  borderRadius: 12,
                  fontWeight: "bold",
                }}
              >
                Save Profile Information
              </Button>
            </div>
          </form>
        )}

        {/* TAB 2: Appearance & Color Customization (Pharmacist can customize sidebar color & text color) */}
        {activeTab === "appearance" && (
          <div className="space-y-8 max-w-4xl">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BgColorsOutlined style={{ color: customAccentColor }} />
                <span>Customize Sidebar & Text Colors</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose your preferred sidebar background color, active menu text color, and overall theme tone.
              </p>
            </div>

            {/* 1. Sidebar Background Color */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                1. Sidebar Background Color
              </label>

              {/* Color Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {sidebarPresets.map((preset) => {
                  const isSelected = customSidebarBg.toLowerCase() === preset.color.toLowerCase();
                  return (
                    <div
                      key={preset.color}
                      onClick={() => setCustomSidebarBg(preset.color)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col items-center gap-2 ${
                        isSelected
                          ? "border-teal-600 bg-teal-50/50 shadow-xs ring-2 ring-teal-500/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <span
                        className="w-10 h-10 rounded-xl shadow-inner border border-white/20"
                        style={{ backgroundColor: preset.color }}
                      />
                      <span className="text-xs font-bold text-slate-800 text-center truncate">
                        {preset.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Custom Color Picker for Sidebar */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-semibold text-slate-600">Custom Hex Code:</span>
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

            {/* 2. Text / Accent Theme Color */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                2. Active Text & Button Accent Color
              </label>

              {/* Accent Color Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {accentPresets.map((preset) => {
                  const isSelected = customAccentColor.toLowerCase() === preset.color.toLowerCase();
                  return (
                    <div
                      key={preset.color}
                      onClick={() => setCustomAccentColor(preset.color)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col items-center gap-2 ${
                        isSelected
                          ? "border-teal-600 bg-teal-50/50 shadow-xs ring-2 ring-teal-500/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <span
                        className="w-8 h-8 rounded-full shadow-inner border border-white"
                        style={{ backgroundColor: preset.color }}
                      />
                      <span className="text-[11px] font-bold text-slate-800 text-center truncate">
                        {preset.name}
                      </span>
                    </div>
                  );
                })}
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
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    customMode === "light"
                      ? "bg-amber-100 text-amber-900 border-2 border-amber-400 shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span>☀️ Light Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCustomMode("dark")}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    customMode === "dark"
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
                {/* Mini mockup */}
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
                      style={{ backgroundColor: `${customAccentColor}35`, color: customAccentColor }}
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

                {/* Explanation & Save Trigger */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    Ready to apply this appearance?
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                    Clicking <strong>Save & Apply Theme</strong> will immediately update your left sidebar, navigation icons, active buttons, and financial chart accents.
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

        {/* TAB 3: Security & Passwords */}
        {activeTab === "security" && (
          <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-lg">
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
        )}

        {/* TAB 4: Active Sessions & Compliance */}
        {activeTab === "sessions" && (
          <div className="space-y-4 max-w-lg text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Device:</span>
                <span className="font-bold text-slate-800">Chrome on Windows 11</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">DGDA License Verification:</span>
                <span className="font-bold text-emerald-600">Active & Certified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Session Status:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircleOutlined /> Logged In
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacistProfile;
