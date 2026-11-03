/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button, Form, Input } from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../privateRoute/AuthContext";
import Image1 from "../../../assets/heart.png";
import { ShieldCheck } from "lucide-react";

interface DecodedToken {
  name: string;
  profileImage: string;
  role: string;
  email: string;
  status?: "pending" | "approved" | "rejected";
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = (location.state as { from?: Location })?.from?.pathname || "/";
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://pharmadoor-backend-v2.vercel.app/api/v1/auth/login",
        {
          email: values.email,
          password: values.password,
        },
        {
          withCredentials: true,
        },
      );

      const accessToken = response.data?.data?.accessToken;

      if (!accessToken) {
        throw new Error("No access token received");
      }

      const decoded = jwtDecode<DecodedToken>(accessToken);

      const role = decoded.role;
      const status = decoded.status;

      if (role === "pharmacist" && status !== "approved") {
        toast.error(
          "Your account is not approved yet. Please wait for admin approval.",
        );
        return;
      }

      login(accessToken);
      toast.success("Login Successful 🎉");

      if (from && from !== "/login" && from !== "/") {
        navigate(from, { replace: true });
      } else {
        if (role === "admin") {
          navigate("/admin-dashboard", { replace: true });
        } else if (role === "pharmacist") {
          navigate("/pharmacist-dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    } catch (error: any) {
      toast.error("Invalid email or password");
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
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

          <h2 className="text-xl font-bold text-slate-900">
            Welcome to Pharma Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to track orders, manage prescriptions & access services
          </p>
        </div>

        {/* Demo Quick Fill Buttons */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-6 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
            One-Click Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                form.setFieldsValue({
                  email: "admin@gmail.com",
                  password: "admin1234",
                });
              }}
              className="py-1.5 px-3 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <UserOutlined />
              <span>Admin Demo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                form.setFieldsValue({
                  email: "mdshajdulhaqueemon8@gmail.com",
                  password: "12345",
                });
              }}
              className="py-1.5 px-3 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <SafetyCertificateOutlined />
              <span>Pharmacist</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</span>}
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email",
              },
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
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-slate-400" />}
              placeholder="Enter your password"
              className="rounded-xl py-2.5 text-xs sm:text-sm"
            />
          </Form.Item>

          <Form.Item className="mt-6 mb-4">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              className="!bg-gradient-to-r !from-teal-600 !to-emerald-600 hover:!from-teal-700 hover:!to-emerald-700 !border-0 !rounded-xl !h-11 !text-sm !font-bold !shadow-md shadow-teal-700/25"
            >
              Sign In to Account
            </Button>
          </Form.Item>
        </Form>

        {/* Footer links */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2 text-xs text-slate-500">
          <p>
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-teal-700 font-bold hover:underline">
              Register as User
            </Link>
          </p>

          <p>
            Are you a licensed Pharmacist?{" "}
            <Link to="/phermacist-register" className="text-emerald-700 font-bold hover:underline">
              Pharmacist Registration
            </Link>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck size={13} className="text-teal-600" />
          <span>SSL Secured Healthcare Data Encryption</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
