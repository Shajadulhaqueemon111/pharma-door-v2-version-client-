import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config/api";
import bgVideo from "../../../assets/Science Laboratory 4K Stock Video.mp4";
import Image1 from "../../../assets/heart.png";
import {
  User,
  Store,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Lock,
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Eye,
  EyeOff,
  Building,
  Sparkles,
} from "lucide-react";

const PharmacistRegister = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    storeName: "",
    phone: "",
    email: "",
    postCode: "",
    nid: "",
    password: "",
  });

  const [images, setImages] = useState<{
    profileImage: File | null;
    drugLicenseImage: File | null;
    nidImage: File | null;
    tradeLicenseImage: File | null;
  }>({
    profileImage: null,
    drugLicenseImage: null,
    nidImage: null,
    tradeLicenseImage: null,
  });

  const [previews, setPreviews] = useState<{
    profileImage?: string;
    drugLicenseImage?: string;
    nidImage?: string;
    tradeLicenseImage?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof images,
  ) => {
    const file = e.target.files?.[0] || null;
    setImages((prev) => ({ ...prev, [field]: file }));

    if (file) {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviews((prev) => ({ ...prev, [field]: url }));
      } else {
        setPreviews((prev) => ({ ...prev, [field]: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !images.profileImage ||
      !images.drugLicenseImage ||
      !images.nidImage ||
      !images.tradeLicenseImage
    ) {
      toast.error("Please upload all 4 required regulatory verification documents.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const form = new FormData();

      form.append("profileImage", images.profileImage);
      form.append("drugLicenseImage", images.drugLicenseImage);
      form.append("nidImage", images.nidImage);
      form.append("tradeLicenseImage", images.tradeLicenseImage);

      // JSON stringified payload required by backend
      form.append(
        "body",
        JSON.stringify({
          password: formData.password,
          pharmacist: {
            name: formData.name,
            address: formData.address,
            storeName: formData.storeName,
            phone: formData.phone,
            email: formData.email,
            postCode: formData.postCode,
            nid: formData.nid,
          },
        }),
      );

      // Verify file sizes under 5MB each
      const fileEntries = Object.entries(images) as [keyof typeof images, File | null][];
      for (const [key, file] of fileEntries) {
        if (file && file.size / 1024 / 1024 > 5) {
          toast.error(`Document "${key}" exceeds 5MB limit. Please upload a smaller file.`);
          setIsSubmitting(false);
          return;
        }
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/users/create-phermasist`,
        form,
      );

      console.log(response);
      toast.success("Pharmacist application submitted successfully! Please await admin approval.");
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed! Please check your information and try again.";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const documentUploadFields: Array<{
    key: keyof typeof images;
    title: string;
    sub: string;
    icon: React.ReactNode;
  }> = [
      {
        key: "profileImage",
        title: "Pharmacist Photo",
        sub: "Clear passport-style photo",
        icon: <User size={20} className="text-teal-600" />,
      },
      {
        key: "drugLicenseImage",
        title: "DGDA Drug License",
        sub: "Official Drug License Certificate",
        icon: <ShieldCheck size={20} className="text-emerald-600" />,
      },
      {
        key: "nidImage",
        title: "National ID (NID)",
        sub: "Front & Back copy / Smart Card",
        icon: <CreditCard size={20} className="text-cyan-600" />,
      },
      {
        key: "tradeLicenseImage",
        title: "Trade License",
        sub: "City Corporation or Union Trade License",
        icon: <Building size={20} className="text-indigo-600" />,
      },
    ];

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Laboratory Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Cinematic Dark Mesh Overlay */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-0" />

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl w-full my-6 bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12 text-slate-800">
        {/* Brand Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center shadow-md p-2 group-hover:scale-105 transition-transform">
              <img
                src={Image1}
                alt="PharmaDoor Logo"
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Pharma<span className="text-teal-600">Door</span>
            </span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60 text-xs font-bold mb-2">
            <Sparkles size={13} className="text-teal-600" />
            <span>Healthcare Partner Onboarding</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pharmacist & Pharmacy Store Registration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            Register your licensed pharmacy store to join Bangladesh&apos;s leading digital healthcare supply network and receive wholesale procurement benefits.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ── SECTION 1: Personal & Store Information ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <User size={18} className="text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                1. Pharmacist & Store Credentials
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pharmacist Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Md. Shajdul Haque"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Store Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pharmacy / Store Name *
                </label>
                <div className="relative">
                  <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    name="storeName"
                    required
                    placeholder="e.g. Popular Pharma Care"
                    value={formData.storeName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Official Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="pharmacist@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contact Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="01XXXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Post Code */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Postal Code *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    name="postCode"
                    required
                    placeholder="e.g. 1344"
                    value={formData.postCode}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* NID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  National ID (NID) Number *
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    name="nid"
                    required
                    placeholder="10 or 17 digit NID"
                    value={formData.nid}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Portal Login Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Minimum 6 characters secure password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Full Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Pharmacy Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                  <textarea
                    name="address"
                    required
                    rows={2}
                    placeholder="Shop/Road No, Area/Thana, District (e.g. House 12, Road 4, Ashulia, Savar, Dhaka)"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 2: Regulatory Document Verification Uploads ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-teal-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  2. Regulatory Licensing Documents (Mandatory)
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                4 Required Files
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documentUploadFields.map((field) => {
                const selectedFile = images[field.key];
                const previewUrl = previews[field.key];

                return (
                  <div
                    key={field.key}
                    className={`relative rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${selectedFile
                        ? "bg-teal-50/60 border-teal-300 shadow-2xs"
                        : "bg-slate-50/80 border-slate-200 hover:border-teal-300"
                      }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                          {field.icon}
                        </div>
                        {selectedFile ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={12} />
                            <span>Uploaded</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                            Required *
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                        {field.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {field.sub}
                      </p>
                    </div>

                    {/* Preview / Upload trigger */}
                    <div className="mt-4 pt-3 border-t border-slate-200/60">
                      {previewUrl ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={previewUrl}
                            alt={field.title}
                            className="w-12 h-12 rounded-lg object-cover border border-teal-200 shadow-xs"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              {selectedFile?.name}
                            </p>
                            <label
                              htmlFor={field.key}
                              className="text-[11px] text-teal-700 font-bold hover:underline cursor-pointer"
                            >
                              Change file
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor={field.key}
                          className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 rounded-xl text-xs font-semibold cursor-pointer transition shadow-2xs"
                        >
                          <UploadCloud size={14} className="text-teal-600" />
                          <span>
                            {selectedFile ? selectedFile.name : "Choose File (JPG/PNG)"}
                          </span>
                        </label>
                      )}

                      <input
                        id={field.key}
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleImageChange(e, field.key)}
                        className="hidden"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legal verification guarantee */}
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-start gap-3">
            <ShieldCheck size={20} className="text-teal-700 shrink-0 mt-0.5" />
            <p className="text-xs text-teal-900 leading-relaxed">
              <strong>DGDA Compliance Assurance:</strong> Submitted Drug Licenses & Trade Documents are manually cross-verified by our Chief Regulatory Pharmacist. Accounts are approved within 12 to 24 hours of submission.
            </p>
          </div>

          {/* Submit Action */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-teal-700/25 hover:shadow-teal-700/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span>Submitting Registration Application...</span>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Submit Pharmacist Registration</span>
                </>
              )}
            </button>

            <p className="mt-4 text-center text-xs text-slate-500">
              Already registered as a licensed partner?{" "}
              <Link
                to="/login"
                className="text-teal-700 font-bold hover:underline"
              >
                Sign In to Pharmacist Portal
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PharmacistRegister;
