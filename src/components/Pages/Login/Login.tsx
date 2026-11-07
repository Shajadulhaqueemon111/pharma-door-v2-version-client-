/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button, Form, Input, Alert } from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../privateRoute/AuthContext";
import Image1 from "../../../assets/heart.png";
import {
  useLoginMutation,
  useVerify2FAMutation,
  useVerifyRegistrationOtpMutation,
  useResendOtpMutation,
} from "../../../redux/api/authApi";

interface DecodedToken {
  name: string;
  profileImage: string;
  role: string;
  email: string;
  status?: "pending" | "approved" | "rejected";
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form] = Form.useForm();

  // RTK Query Mutations
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [verify2FAMutation, { isLoading: isVerifying2FA }] = useVerify2FAMutation();
  const [verifyRegistrationOtpMutation, { isLoading: isVerifyingEmail }] =
    useVerifyRegistrationOtpMutation();
  const [resendOtpMutation, { isLoading: isResendingOtp }] = useResendOtpMutation();

  // 2FA & Lockout States
  const [step, setStep] = useState<"login" | "2fa" | "verify_email">("login");
  const [twoFactorEmail, setTwoFactorEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [twoFactorOtp, setTwoFactorOtp] = useState("");
  const [lockoutMessage, setLockoutMessage] = useState<string | null>(null);
  const [penaltyMinutes, setPenaltyMinutes] = useState<number | null>(null);

  // Countdown for resending OTP
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: any;
    if ((step === "2fa" || step === "verify_email") && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const from = (location.state as { from?: Location })?.from?.pathname || "/";

  const handleLoginSubmit = async (values: { email: string; password: string }) => {
    setLockoutMessage(null);
    try {
      const response: any = await loginMutation({
        email: values.email,
        password: values.password,
      }).unwrap();

      // Check if email verification is required
      if (response?.data?.requiresEmailVerification) {
        setTwoFactorEmail(response.data.email || values.email);
        setMaskedEmail(values.email);
        setStep("verify_email");
        setCountdown(60);
        setCanResend(false);
        toast.success(
          "Email verification code sent to your inbox! Enter 6-digit code to activate.",
          { icon: "✉️" },
        );
        return;
      }

      // Check if 2FA is required for this account
      if (response?.data?.requires2FA) {
        setTwoFactorEmail(response.data.email || values.email);
        setMaskedEmail(response.data.maskedEmail || values.email);
        setStep("2fa");
        setCountdown(60);
        setCanResend(false);
        toast.success(
          "2FA Security Active! 6-digit verification code sent to your email.",
          { icon: "🛡️" },
        );
        return;
      }

      // Direct Login (2FA off)
      const accessToken = response?.data?.accessToken || response?.accessToken;
      const refreshToken = response?.data?.refreshToken || response?.refreshToken;

      if (!accessToken) {
        throw new Error("No access token returned");
      }

      processLoginSuccess(accessToken, refreshToken);
    } catch (error: any) {
      const msg = error?.data?.message || error?.message || "Invalid email or password";
      if (error?.status === 403 || msg.toLowerCase().includes("penalty") || msg.toLowerCase().includes("locked")) {
        setLockoutMessage(msg);
      } else {
        toast.error(msg);
      }
    }
  };

  const handleVerify2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorOtp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP code");
      return;
    }

    try {
      let response: any;
      if (step === "verify_email") {
        response = await verifyRegistrationOtpMutation({
          email: twoFactorEmail,
          otp: twoFactorOtp,
        }).unwrap();
      } else {
        response = await verify2FAMutation({
          email: twoFactorEmail,
          otp: twoFactorOtp,
        }).unwrap();
      }

      const accessToken = response?.data?.accessToken || response?.accessToken;
      const refreshToken = response?.data?.refreshToken || response?.refreshToken;

      if (!accessToken) {
        throw new Error("No access token returned");
      }

      processLoginSuccess(accessToken, refreshToken);
    } catch (error: any) {
      const msg = error?.data?.message || "Invalid code. Please verify again.";
      if (error?.status === 403 || msg.toLowerCase().includes("penalty") || msg.toLowerCase().includes("locked")) {
        setLockoutMessage(msg);
        setPenaltyMinutes(10);
      } else {
        toast.error(msg);
      }
    }
  };

  const processLoginSuccess = (accessToken: string, refreshToken?: string) => {
    const decoded = jwtDecode<DecodedToken>(accessToken);
    const role = decoded.role;
    const status = decoded.status;

    if (role === "pharmacist" && status !== "approved") {
      toast.error("Your pharmacist account is awaiting DGDA admin approval.");
      return;
    }

    login(accessToken, refreshToken);
    toast.success("Login Successful 🎉", { icon: "👋" });

    if (from && from !== "/login" && from !== "/") {
      navigate(from, { replace: true });
    } else {
      if (role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else if (role === "pharmacist") {
        navigate("/pharmacist-dashboard", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    }
  };

  const handleResend2FA = async () => {
    if (!canResend) return;
    try {
      await resendOtpMutation(twoFactorEmail).unwrap();
      toast.success("A fresh 2FA security code has been dispatched to your email!");
      setCountdown(60);
      setCanResend(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to resend 2FA code");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 sm:py-12 px-3 sm:px-4 bg-slate-50 w-full overflow-x-hidden">
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xl mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center shadow-sm p-2">
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

          {step === "login" ? (
            <>
              <h2 className="text-xl font-bold text-slate-900">Welcome to Pharma Portal</h2>
              <p className="text-xs text-slate-400 mt-1">
                Sign in to track orders, manage prescriptions & access services
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60 text-xs font-bold mb-2">
                <SafetyCertificateOutlined className="text-teal-600" />
                <span>Two-Factor Authentication</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Enter Security Code</h2>
              <p className="text-xs text-slate-500 mt-1">
                We sent a 6-digit 2FA code to <strong className="text-slate-800">{maskedEmail || twoFactorEmail}</strong>
              </p>
            </>
          )}
        </div>

        {/* Lockout Penalty Alert */}
        {lockoutMessage && (
          <Alert
            className="mb-5 rounded-2xl border-2 border-rose-300 bg-rose-50"
            type="error"
            showIcon
            icon={<WarningOutlined className="text-rose-600 text-lg" />}
            message={
              <span className="text-xs font-extrabold text-rose-900">
                10-Minute Lockout Penalty Enforced
              </span>
            }
            description={
              <div className="text-xs text-rose-800 space-y-1">
                <p>{lockoutMessage}</p>
                <p className="font-semibold flex items-center gap-1 text-[11px] text-rose-700">
                  <ClockCircleOutlined /> Please wait {penaltyMinutes || 10} minutes before attempting again.
                </p>
              </div>
            }
          />
        )}

        {/* STEP 1: Standard Login Form */}
        {step === "login" ? (
          <>
            {/* Demo Quick Fill Buttons */}
            <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 mb-5 sm:mb-6 space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
                One-Click Demo Credentials
              </p>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => {
                    form.setFieldsValue({
                      email: "admin@gmail.com",
                      password: "admin1234",
                    });
                  }}
                  className="py-2 px-1.5 sm:px-3 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-0.5 transition cursor-pointer shadow-xs overflow-hidden"
                >
                  <div className="flex items-center gap-1 sm:gap-1.5 font-bold text-slate-800 text-[11px] sm:text-xs">
                    <UserOutlined className="text-teal-600" />
                    <span>Admin Demo</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 truncate max-w-full">admin@gmail.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    form.setFieldsValue({
                      email: "mdshajdulhaqueemon8@gmail.com",
                      password: "12345",
                    });
                  }}
                  className="py-2 px-1.5 sm:px-3 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-0.5 transition cursor-pointer shadow-xs overflow-hidden"
                >
                  <div className="flex items-center gap-1 sm:gap-1.5 font-bold text-slate-800 text-[11px] sm:text-xs">
                    <SafetyCertificateOutlined className="text-teal-600" />
                    <span>Pharmacist</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 truncate max-w-full">mdshajdulhaque...</span>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <Form form={form} layout="vertical" onFinish={handleLoginSubmit}>
              <Form.Item
                label={<span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</span>}
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined className="text-slate-400" />}
                  placeholder="name@example.com"
                  className="rounded-xl py-2.5 text-xs sm:text-sm"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</span>}
                name="password"
                rules={[{ required: true, message: "Please enter your password" }]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined className="text-slate-400" />}
                  placeholder="••••••••"
                  className="rounded-xl py-2.5 text-xs sm:text-sm"
                />
              </Form.Item>

              <div className="flex justify-between items-center mb-6 text-xs">
                <Link to="/forgot-password" className="text-teal-600 hover:underline font-semibold">
                  {/* Forgot Password? */}
                </Link>
                <Link to="/register" className="text-slate-500 hover:text-slate-800 font-medium">
                  Register as Patient
                </Link>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoggingIn}
                  block
                  size="large"
                  className="rounded-xl font-bold bg-teal-600 hover:bg-teal-700 h-11 text-sm shadow-md"
                >
                  Sign In to PharmaDoor
                </Button>
              </Form.Item>
            </Form>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              Pharmacist registration with trade license?{" "}
              <Link to="/phermacistregister" className="text-teal-600 font-bold hover:underline">
                Apply Here
              </Link>
            </div>
          </>
        ) : (
          /* STEP 2: 2FA or Email Verification Form */
          <form onSubmit={handleVerify2FASubmit} className="space-y-6">
            <Alert
              type={step === "verify_email" ? "info" : "warning"}
              showIcon
              className="rounded-xl text-xs"
              message={
                step === "verify_email"
                  ? "Email Verification Required"
                  : "Two-Factor Security Active"
              }
              description={
                step === "verify_email"
                  ? `Enter the 6-digit activation code sent to ${twoFactorEmail || "your email"} to complete login.`
                  : "Entering 3 consecutive incorrect codes will trigger a 10-minute security penalty."
              }
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 text-center uppercase tracking-wider">
                {step === "verify_email"
                  ? "Enter 6-Digit Activation Code"
                  : "Enter 6-Digit 2FA Code"}
              </label>
              <Input
                size="large"
                maxLength={6}
                value={twoFactorOtp}
                onChange={(e) => setTwoFactorOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="rounded-xl text-center font-mono text-2xl font-bold tracking-widest py-3 border-2 border-teal-500/40 focus:border-teal-600"
                autoFocus
              />
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={isVerifying2FA || isVerifyingEmail}
              block
              size="large"
              className="rounded-xl font-bold bg-teal-600 hover:bg-teal-700 h-11 text-sm shadow-md"
            >
              {step === "verify_email" ? "Verify & Sign In" : "Verify Code & Access Account"}
            </Button>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setStep("login");
                  setLockoutMessage(null);
                }}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <ArrowLeftOutlined /> Back to Login
              </button>

              <button
                type="button"
                onClick={handleResend2FA}
                disabled={!canResend || isResendingOtp}
                className={`font-bold transition cursor-pointer ${canResend
                  ? "text-teal-600 hover:underline"
                  : "text-slate-400 cursor-not-allowed"
                  }`}
              >
                {canResend ? "Resend 2FA Code" : `Resend in ${countdown}s`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
