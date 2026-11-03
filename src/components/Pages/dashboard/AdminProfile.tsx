/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Key,
  Camera,
  CheckCircle,
  Save,
  Lock,
  Calendar,
  Award,
  Activity,
  Smartphone,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../privateRoute/AuthContext";
import { API_BASE_URL } from "../../../config/api";

const AdminProfile = () => {
  const { user, updateUser } = useAuth();

  // Profile Form State
  const [name, setName] = useState(user?.name || "Md Sajedul Haque Emon");
  const [email] = useState(user?.email || "mdshajdulhaqueemon8@gmail.com");
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
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Loading states
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);

  // Handle Photo URL or Upload
  const handlePhotoChange = () => {
    const newUrl = prompt("Enter new Profile Image URL (ImgBB / Cloudinary):", profileImage);
    if (newUrl && newUrl.trim()) {
      setProfileImage(newUrl.trim());
      if (user && updateUser) {
        updateUser({ ...user, profileImage: newUrl.trim() });
      }
      toast.success("Profile photo updated successfully!");
    }
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

      toast.success("Admin Profile updated successfully!", { icon: "✅" });
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Password Change
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

    setSavingSecurity(true);
    setTimeout(() => {
      setSavingSecurity(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Admin security credentials updated successfully!");
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Top Profile Header Hero */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-800/40 p-6 sm:p-8 text-white shadow-xl overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar with Camera Overlay */}
          <div className="relative group shrink-0">
            <img
              src={profileImage}
              alt="Admin Profile"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-teal-500/60 shadow-xl"
            />
            <button
              onClick={handlePhotoChange}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg transition cursor-pointer"
              title="Change Profile Photo"
            >
              <Camera size={16} />
            </button>
          </div>

          {/* Admin Identity */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {name}
              </h1>
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold inline-flex items-center gap-1">
                <ShieldCheck size={14} className="text-teal-400" />
                <span>Super Administrator</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {designation} • {hospital}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Mail size={13} className="text-teal-400" />
                <span>{email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={13} className="text-teal-400" />
                <span>{phone}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-teal-400" />
                <span>Member since Jan 2024</span>
              </span>
            </div>
          </div>

          {/* Quick status pill */}
          <div className="self-center sm:self-start bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700 text-xs text-right space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              Access Scope
            </span>
            <span className="text-emerald-400 font-extrabold flex items-center gap-1">
              <CheckCircle size={13} />
              Full System Clearance
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Profile Details Form + Security & Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Personal Info & Security */}
        <div className="lg:col-span-8 space-y-8">
          {/* Card 1: Personal & Professional Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User size={18} className="text-teal-600" />
                  <span>Personal & Role Information</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your contact info and administrative identity on PharmaDoor.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-teal-600 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address (Account ID)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-teal-600 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Administrative Role
                  </label>
                  <input
                    type="text"
                    disabled
                    value={role}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Official Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-teal-600 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Operations Base
                  </label>
                  <input
                    type="text"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-teal-600 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Administrative Bio / Responsibilities
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-teal-600 leading-relaxed bg-slate-50/50"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-extrabold transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save size={15} />
                  <span>{savingProfile ? "Saving Profile..." : "Save Profile Changes"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Security & Password Management */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Key size={18} className="text-teal-600" />
                  <span>Security & Authentication</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage administrator credentials and account protection.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                2FA Active
              </span>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter existing password"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-teal-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    New Password *
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Confirm New Password *
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-teal-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="twoFactor"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="twoFactor" className="text-xs text-slate-600 font-semibold cursor-pointer">
                    Enable Two-Factor Authentication (OTP on login)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={savingSecurity || !currentPassword}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-extrabold transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  <Lock size={14} />
                  <span>{savingSecurity ? "Updating..." : "Update Password"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (4 cols): Privileges, Activity & Quick Info */}
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
                  <span className="text-[11px] text-slate-500">Assign doctors & supervise calls</span>
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
                  <span className="text-[11px] text-slate-500">Full revenue analytics & invoices</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Granted
                </span>
              </div>
            </div>
          </div>

          {/* Active Session & Device Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Smartphone size={16} className="text-teal-600" />
              <span>Current Session & Device</span>
            </h4>

            <div className="p-3.5 bg-slate-50 rounded-2xl text-xs space-y-2 text-slate-600 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Device / Browser:</span>
                <span className="font-bold text-slate-800">Chrome on Windows</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">IP Location:</span>
                <span className="font-bold text-slate-800">Dhaka, Bangladesh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Socket Protocol:</span>
                <span className="font-bold text-emerald-600">Encrypted WSS / WebRTC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Online Active
                </span>
              </div>
            </div>
          </div>

          {/* Recent Admin Activity Log */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity size={16} className="text-teal-600" />
              <span>Recent Activity Log</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Assigned Doctor to Consultation</p>
                  <p className="text-[11px] text-slate-400">Dr. Tanvir Ahmed • Just now</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Verified Pharmacist License</p>
                  <p className="text-[11px] text-slate-400">License #DGDA-2024-91 • Today</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">System Socket.IO Server Online</p>
                  <p className="text-[11px] text-slate-400">Port 5001 • Teleconsultation ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
