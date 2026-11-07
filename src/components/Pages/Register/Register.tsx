/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button, Form, Input, Alert } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  LockOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import Image1 from "../../../assets/heart.png";
import { Sparkles } from "lucide-react";
import {
  useRegisterUserMutation,
  useVerifyRegistrationOtpMutation,
  useResendOtpMutation,
} from "../../../redux/api/authApi";
import { useAuth } from "../privateRoute/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { login } = useAuth();

  // RTK Query Mutations
  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyRegistrationOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  // State for 2-step verification
  const [step, setStep] = useState<"register" | "verify">("register");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: any;
    if (step === "verify" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleRegister = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(values.password)) {
      toast.error(
        "Password must contain uppercase, lowercase, number & special character (min 8 chars)",
      );
      return;
    }

    try {
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
      };

      try {
        const res: any = await registerUser(userData).unwrap();
        toast.success(
          res?.message || "Verification code dispatched to your email! Please verify.",
          { icon: "✉️" },
        );
        setRegisteredEmail(values.email);
        setStep("verify");
        setCountdown(60);
        setCanResend(false);
        return;
      } catch (otpErr: any) {
        // If the backend is running on Vercel without new /auth/register route, fall back to /users/create-user
        if (
          otpErr?.status === 404 ||
          otpErr?.data?.message?.includes("Not Found") ||
          otpErr?.data?.message === "API Not Found"
        ) {
          console.warn("Falling back to standard user creation...");
          const fallbackRes = await axios.post(
            `${API_BASE_URL}/api/v1/users/create-user`,
            userData,
          );
          if (fallbackRes.data?.success || fallbackRes.status === 200 || fallbackRes.status === 201) {
            toast.success("Account created successfully 🎉 Please sign in!");
            form.resetFields();
            navigate("/login");
            return;
          }
        } else {
          throw otpErr;
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Registration failed! Please try a different email.",
      );
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      toast.error("Please enter the complete 6-digit OTP code");
      return;
    }

    try {
      const res: any = await verifyOtp({
        email: registeredEmail,
        otp: otpCode,
      }).unwrap();

      const accessToken = res?.data?.accessToken || res?.accessToken;
      const refreshToken = res?.data?.refreshToken || res?.refreshToken;

      if (accessToken) {
        login(accessToken, refreshToken);
        toast.success("Account verified & signed in successfully 🎉 Welcome!", {
          icon: "🚀",
        });
        navigate("/profile");
      } else {
        toast.success("Account verified successfully! Please sign in.");
        navigate("/login");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid or expired OTP code");
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    try {
      await resendOtp(registeredEmail).unwrap();
      toast.success("A fresh OTP verification code has been emailed to you!");
      setCountdown(60);
      setCanResend(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl">
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

          {step === "register" ? (
            <>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60 text-xs font-bold mb-2">
                <Sparkles size={13} className="text-teal-600" />
                <span>Create Patient / User Account</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Join PharmaDoor Today</h2>
              <p className="text-xs text-slate-400 mt-1">
                Order authentic medicines, track prescriptions & enjoy discounts
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60 text-xs font-bold mb-2">
                <SafetyCertificateOutlined className="text-teal-600" />
                <span>Email OTP Verification</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Verify Your Email</h2>
              <p className="text-xs text-slate-500 mt-1">
                We sent a 6-digit confirmation code to{" "}
                <strong className="text-slate-800">{registeredEmail}</strong>
              </p>
            </>
          )}
        </div>

        {/* STEP 1: Registration Form */}
        {step === "register" ? (
          <Form form={form} layout="vertical" onFinish={handleRegister}>
            {/* Name */}
            <Form.Item
              label={<span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</span>}
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="text-slate-400" />}
                placeholder="e.g. Tanvir Hasan"
                className="rounded-xl py-2.5 text-xs sm:text-sm"
              />
            </Form.Item>

            {/* Email */}
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
                placeholder="you@example.com"
                className="rounded-xl py-2.5 text-xs sm:text-sm"
              />
            </Form.Item>

            {/* Password */}
            <Form.Item
              label={<span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Secure Password</span>}
              name="password"
              rules={[{ required: true, message: "Please enter a password" }]}
              help="Must include 1 uppercase, 1 lowercase, 1 number & 1 special symbol (min 8 chars)"
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined className="text-slate-400" />}
                placeholder="Create a strong password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                className="rounded-xl py-2.5 text-xs sm:text-sm"
              />
            </Form.Item>

            <Form.Item className="mt-6 mb-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={isRegistering}
                block
                size="large"
                className="rounded-xl font-bold bg-teal-600 hover:bg-teal-700 h-11 text-sm shadow-md"
              >
                Create Account & Send OTP
              </Button>
            </Form.Item>

            <div className="text-center text-xs text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-teal-600 font-bold hover:underline">
                Sign In
              </Link>
            </div>
          </Form>
        ) : (
          /* STEP 2: Email OTP Verification Form */
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <Alert
              type="info"
              showIcon
              className="rounded-xl text-xs"
              message="Check Your Inbox"
              description="Enter the 6-digit verification code sent to your email to activate your account."
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 text-center uppercase tracking-wider">
                Enter 6-Digit OTP Code
              </label>
              <Input
                size="large"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="rounded-xl text-center font-mono text-2xl font-bold tracking-widest py-3 border-2 border-teal-500/40 focus:border-teal-600"
                autoFocus
              />
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={isVerifying}
              block
              size="large"
              className="rounded-xl font-bold bg-teal-600 hover:bg-teal-700 h-11 text-sm shadow-md"
            >
              Verify & Activate Account
            </Button>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep("register")}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <ArrowLeftOutlined /> Change Email
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || isResending}
                className={`font-bold transition cursor-pointer ${
                  canResend
                    ? "text-teal-600 hover:underline"
                    : "text-slate-400 cursor-not-allowed"
                }`}
              >
                {canResend ? "Resend OTP Code" : `Resend in ${countdown}s`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
