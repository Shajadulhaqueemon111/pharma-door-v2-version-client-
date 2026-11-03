/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button, Form, Input } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Image1 from "../../../assets/heart.png";
import { ShieldCheck, Sparkles } from "lucide-react";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

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
      setLoading(true);

      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
      };

      const response = await axios.post(
        "https://pharmadoor-backend-v2.vercel.app/api/v1/users/create-user",
        userData,
      );

      console.log(response.data);
      toast.success("Account created successfully 🎉 Please sign in!");
      form.resetFields();
      navigate("/login");
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      toast.error("Registration failed! Please try a different email.");
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

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60 text-xs font-bold mb-2">
            <Sparkles size={13} className="text-teal-600" />
            <span>Create Patient / User Account</span>
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Join PharmaDoor Today
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Order authentic medicines, track prescriptions & enjoy discounts
          </p>
        </div>

        {/* Form */}
        <Form form={form} layout="vertical" onFinish={handleRegister}>
          {/* Name */}
          <Form.Item
            label={<span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</span>}
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter your name",
              },
            ]}
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
              {
                required: true,
                message: "Please enter your email",
              },
              {
                type: "email",
                message: "Enter a valid email",
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

          {/* Password */}
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
              placeholder="Create strong password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              className="rounded-xl py-2.5 text-xs sm:text-sm"
            />
          </Form.Item>

          {/* Submit */}
          <Form.Item className="mt-6 mb-4">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              className="!bg-gradient-to-r !from-teal-600 !to-emerald-600 hover:!from-teal-700 hover:!to-emerald-700 !border-0 !rounded-xl !h-11 !text-sm !font-bold !shadow-md shadow-teal-700/25"
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2 text-xs text-slate-500">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-teal-700 font-bold hover:underline">
              Sign In here
            </Link>
          </p>

          <p>
            Are you a pharmacy owner?{" "}
            <Link to="/phermacist-register" className="text-emerald-700 font-bold hover:underline">
              Register as Pharmacist
            </Link>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck size={13} className="text-teal-600" />
          <span>Strict HIPAA / DGDA Patient Data Privacy Guaranteed</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
