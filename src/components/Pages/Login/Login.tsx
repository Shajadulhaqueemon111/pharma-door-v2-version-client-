/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Button, Card, Form, Input, Typography, Divider } from "antd";

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

const { Title, Text } = Typography;

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card
        className="w-full max-w-md rounded-2xl shadow-lg"
        styles={{
          body: {
            padding: "32px",
          },
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafetyCertificateOutlined
              style={{
                color: "white",
                fontSize: 28,
              }}
            />
          </div>

          <Title level={3} style={{ marginBottom: 4 }}>
            Welcome Back
          </Title>

          <Text type="secondary">Login to your Pharma Dashboard</Text>
        </div>

        {/* Demo Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            block
            size="large"
            icon={<UserOutlined />}
            onClick={() => {
              form.setFieldsValue({
                email: "admin@gmail.com",
                password: "admin1234",
              });
            }}
          >
            Admin Demo
          </Button>

          <Button
            block
            size="large"
            icon={<SafetyCertificateOutlined />}
            onClick={() => {
              form.setFieldsValue({
                email: "mdshajdulhaqueemon8@gmail.com",
                password: "12345",
              });
            }}
          >
            Pharmacist Demo
          </Button>
        </div>

        <Divider />

        {/* Form */}
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
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
              prefix={<MailOutlined />}
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
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
              prefix={<LockOutlined />}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p>
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </p>

          <p>
            Are you a Pharmacist?{" "}
            <Link to="/phermacist-register">Register here</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
