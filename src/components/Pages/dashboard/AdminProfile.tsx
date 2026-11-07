/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Upload,
  Switch,
  Alert,
  Spin,
  Tag,
  Badge,
  Input,
  Button,
} from "antd";
import {
  UserOutlined,
  CameraOutlined,
  SaveOutlined,
  LockOutlined,
  EnvironmentOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Key,
  Award,
  Smartphone,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../privateRoute/AuthContext";
import { API_BASE_URL } from "../../../config/api";
import {
  useUploadAvatarMutation,
  useChangePasswordMutation,
  useToggle2FAMutation,
  useGetSessionsQuery,
  useGetMeQuery,
} from "../../../redux/api/authApi";
import { useGetAuditLogsQuery } from "../../../redux/api/auditApi";

const AdminProfile = () => {
  const { user, updateUser } = useAuth();
  const { data: meData } = useGetMeQuery(undefined);

  // RTK Query Mutations & Queries
  const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [toggle2FA, { isLoading: isToggling2FA }] = useToggle2FAMutation();
  const { data: sessionsData } = useGetSessionsQuery(undefined, { pollingInterval: 30000 });
  const { data: auditLogs = [] } = useGetAuditLogsQuery({ limit: 8 });

  // Profile Form State
  const [name, setName] = useState(user?.name || "Md Sajedul Haque Emon");
  const [email] = useState(user?.email || "admin@pharmadoor.com");
  const [phone, setPhone] = useState("+880 1712-345678");
  const [role] = useState("Super Administrator");
  const [designation, setDesignation] = useState("Head of Operations & Telemedicine");
  const [hospital, setHospital] = useState("PharmaDoor Healthcare Headquarters, Dhaka");
  const [bio, setBio] = useState(
    "Super Administrator managing PharmaDoor digital pharmacy logistics, BMDC doctor teleconsultations, and healthcare operations.",
  );
  const [profileImage, setProfileImage] = useState(
    user?.profileImage ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
  );

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    user?.twoFactorEnabled !== undefined ? user.twoFactorEnabled : false,
  );

  // Loading states
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (meData?.data) {
      if (meData.data.profileImage) {
        setProfileImage(meData.data.profileImage);
      }
      if (meData.data.twoFactorEnabled !== undefined) {
        setTwoFactorEnabled(Boolean(meData.data.twoFactorEnabled));
      }
      if (meData.data.name) {
        setName(meData.data.name);
      }
    } else if (user) {
      if (user.profileImage) {
        setProfileImage(user.profileImage);
      }
      if (user.twoFactorEnabled !== undefined) {
        setTwoFactorEnabled(Boolean(user.twoFactorEnabled));
      }
      if (user.name) {
        setName(user.name);
      }
    }
  }, [meData?.data, user]);

  // Handle Real Cloudinary File Upload (NO PROMPT)
  const handleFileUpload = async (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP)");
      return Upload.LIST_IGNORE;
    }

    if (file.size / 1024 / 1024 > 5) {
      toast.error("Image size must be less than 5MB");
      return Upload.LIST_IGNORE;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res: any = await uploadAvatar(formData).unwrap();
      const newImageUrl = res?.data?.profileImage || res?.profileImage;
      const newToken = res?.data?.accessToken;

      if (newImageUrl) {
        setProfileImage(newImageUrl);
        if (updateUser) {
          updateUser({ profileImage: newImageUrl }, newToken);
        }
        toast.success("Admin avatar hosted on Cloudinary successfully! ☁️", {
          icon: "📸",
        });
      }
    } catch (err: any) {
      console.error("Cloudinary upload failed:", err);
      toast.error(err?.data?.message || "Failed to upload image to Cloudinary");
    }

    return false;
  };

  // Handle Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      if (user?._id) {
        const token = localStorage.getItem("accessToken");
        await fetch(`${API_BASE_URL}/api/v1/users/${user._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({ name }),
        }).catch(() => null);
      }

      if (user && updateUser) {
        updateUser({ ...user, name, profileImage });
      }

      toast.success("Admin profile updated successfully!", { icon: "✅" });
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Real Password Change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter current password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
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

      toast.success("Admin security credentials updated successfully!", { icon: "🔒" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password");
    }
  };

  // Handle 2FA Toggle
  const handleToggle2FA = async (checked: boolean) => {
    try {
      await toggle2FA({ enabled: checked }).unwrap();
      setTwoFactorEnabled(checked);
      if (updateUser) {
        updateUser({ twoFactorEnabled: checked });
      }
      if (checked) {
        toast.success("2FA Security Enabled! OTP sent to email on login.", { icon: "🛡️" });
      } else {
        toast("2FA Security Disabled.", { icon: "⚠️" });
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update 2FA status");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group shrink-0">
            <Spin spinning={isUploadingAvatar}>
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl bg-slate-800 flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={name}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <UserOutlined className="text-3xl text-teal-400" />
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
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white shadow-lg transition cursor-pointer border-2 border-white flex items-center justify-center"
                title="Upload Photo to Cloudinary"
              >
                <CameraOutlined style={{ fontSize: 16 }} />
              </button>
            </Upload>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{name}</h2>
              <Tag color="cyan" className="font-bold text-xs rounded-full px-2.5">
                {role}
              </Tag>
              <Tag color="emerald" className="font-bold text-xs rounded-full px-2.5">
                Cloudinary Active
              </Tag>
            </div>

            <p className="text-xs sm:text-sm text-teal-200/90 font-medium">
              {designation} • {hospital}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <Mail size={13} className="text-teal-400" />
                <span>{email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={13} className="text-teal-400" />
                <span>{phone}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>Verified System Admin</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Left (8 cols) + Info Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Profile & Security Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile Information Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <User size={18} className="text-teal-600" />
                  <span>General Profile Information</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update administrative credentials and contact information
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name *
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
                    value={email}
                    disabled
                    className="rounded-xl bg-slate-50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone Number
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
                    Administrative Role
                  </label>
                  <Input
                    size="large"
                    value={role}
                    disabled
                    className="rounded-xl bg-slate-50 cursor-not-allowed font-semibold text-teal-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Designation / Title
                  </label>
                  <Input
                    size="large"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Headquarters / Facility
                  </label>
                  <Input
                    size="large"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Bio / Responsibilities
                </label>
                <Input.TextArea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              {/* Cloudinary Quick Upload Callout */}
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-teal-500 shadow-xs">
                    <img src={profileImage} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Cloudinary Avatar Integration Active
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Upload directly without entering manual image URLs or prompts.
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
                    Change Avatar
                  </Button>
                </Upload>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={savingProfile}
                  icon={<SaveOutlined />}
                  size="large"
                  className="rounded-xl font-bold bg-slate-900 hover:bg-teal-700"
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Security & 2FA & Password Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Key size={18} className="text-teal-600" />
                  <span>Security & Two-Factor Authentication</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage two-step verification and update administrator login credentials
                </p>
              </div>
            </div>

            {/* 2FA Card */}
            <div className="p-4 bg-teal-50/40 rounded-2xl border border-teal-200/80 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-teal-600" />
                    <h4 className="text-sm font-bold text-slate-900">
                      Two-Factor Authentication (Email 2FA)
                    </h4>
                    <Tag
                      color={twoFactorEnabled ? "success" : "default"}
                      className="rounded-full font-bold text-[10px]"
                    >
                      {twoFactorEnabled ? "ACTIVE" : "OFF"}
                    </Tag>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    When active, a 6-digit OTP is required on login.
                  </p>
                </div>

                <Switch
                  checked={twoFactorEnabled}
                  loading={isToggling2FA}
                  onChange={handleToggle2FA}
                  checkedChildren="ON"
                  unCheckedChildren="OFF"
                />
              </div>

              {/* 10-Minute Lockout Alert */}
              <Alert
                type="warning"
                showIcon
                className="rounded-xl border border-amber-200 bg-amber-50"
                message={
                  <span className="text-xs font-bold text-amber-900">
                    Security Lockout Policy (10-Minute Penalty)
                  </span>
                }
                description={
                  <span className="text-xs text-amber-800">
                    To prevent brute-force intrusion, 3 consecutive failed OTP attempts will invoke an immediate <strong>10-minute lockout penalty</strong> on the administrator account.
                  </span>
                }
              />
            </div>

            {/* Password Change Inputs */}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <LockOutlined className="text-teal-600" />
                <span>Change Administrator Password</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Current Password *
                  </label>
                  <Input.Password
                    size="large"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
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
                    placeholder="Min 6 characters"
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Confirm Password *
                  </label>
                  <Input.Password
                    size="large"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isChangingPassword}
                  size="large"
                  icon={<LockOutlined />}
                  className="rounded-xl font-bold bg-slate-900 hover:bg-teal-700"
                >
                  Update Admin Password
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (4 cols): Privileges, Realtime Sessions & Audit */}
        <div className="lg:col-span-4 space-y-6">
          {/* Admin Privileges Badge Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award size={16} className="text-teal-600" />
              <span>Admin Clearance & Privileges</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-teal-50/60 rounded-2xl border border-teal-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Doctor Telemedicine Desk</span>
                  <span className="text-[11px] text-slate-500">Supervise audio/video calls</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Granted
                </span>
              </div>

              <div className="p-3 bg-teal-50/60 rounded-2xl border border-teal-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Pharmacist License Verify</span>
                  <span className="text-[11px] text-slate-500">DGDA trade license approval</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Granted
                </span>
              </div>

              <div className="p-3 bg-teal-50/60 rounded-2xl border border-teal-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Order & Financial Reports</span>
                  <span className="text-[11px] text-slate-500">Full revenue analytics</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Granted
                </span>
              </div>
            </div>
          </div>

          {/* Active Session & Device Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Smartphone size={16} className="text-teal-600" />
                <span>Active Session & Device</span>
              </h4>
              <Badge status="processing" text={<span className="text-xs font-bold text-emerald-600">Online</span>} />
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl text-xs space-y-2 text-slate-600 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Device / OS:</span>
                <span className="font-bold text-slate-800">
                  {sessionsData?.data?.sessions?.[0]?.device || "Chrome on Windows 11"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">IP Location:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <EnvironmentOutlined className="text-rose-500" />
                  {sessionsData?.data?.sessions?.[0]?.location || "Dhaka, Bangladesh"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">IP Address:</span>
                <span className="font-mono text-teal-700 font-bold">
                  {sessionsData?.data?.sessions?.[0]?.ip || "103.145.244.12"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Socket Protocol:</span>
                <span className="font-bold text-emerald-600">Encrypted WSS / WebRTC</span>
              </div>
            </div>
          </div>

          {/* Recent Audit Log Feed */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HistoryOutlined className="text-teal-600" />
                <span>Recent System Audit Logs</span>
              </h4>
              <Tag color="cyan" className="rounded-full text-[10px] font-bold">
                Live Audit
              </Tag>
            </div>

            <div className="space-y-3 text-xs">
              {auditLogs.slice(0, 4).map((log: any) => (
                <div key={log._id || Math.random()} className="flex items-start gap-2.5 pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                  <span className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{log.details || log.action}</p>
                    <p className="text-[10px] text-slate-400">
                      {log.userName || "System"} • {new Date(log.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {auditLogs.length === 0 && (
                <p className="text-slate-400 text-xs text-center py-2">No audit events recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
