/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Button, Card, Form, Input, Typography } from "antd";

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

const { Title, Text } = Typography;

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
        "Password must contain uppercase, lowercase, number & special character",
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

      toast.success("Registration successful 🎉");

      form.resetFields();

      navigate("/login");
    } catch (error: any) {
      console.error(error.response?.data || error.message);

      toast.error("Registration failed!");
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
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center mx-auto mb-4">
            <UserOutlined
              style={{
                color: "white",
                fontSize: 28,
              }}
            />
          </div>

          <Title
            level={3}
            style={{
              marginBottom: 4,
            }}
          >
            Create Account
          </Title>

          <Text type="secondary">Register your Pharma account</Text>
        </div>

        {/* Form */}
        <Form form={form} layout="vertical" onFinish={handleRegister}>
          {/* Name */}
          <Form.Item
            label="Full Name"
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
              prefix={<UserOutlined />}
              placeholder="Enter your full name"
            />
          </Form.Item>

          {/* Email */}
          <Form.Item
            label="Email"
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
              prefix={<MailOutlined />}
              placeholder="Enter your email"
            />
          </Form.Item>

          {/* Password */}
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
              placeholder="Create password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          {/* Submit */}
          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              Register
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div className="text-center mt-4">
          <Text type="secondary">
            Already have an account? <Link to="/login">Login here</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Register;
