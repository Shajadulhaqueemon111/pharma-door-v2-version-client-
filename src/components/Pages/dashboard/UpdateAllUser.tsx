/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Form,
  Select,
  Button,
  Card,
  Typography,
  Spin,
  message,
  Avatar,
  Tag,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const UpdateAllUser = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await axios.get(
          `${API_BASE_URL}/api/v1/users/${_id}`,
          {
            headers: { Authorization: `${token}` },
          },
        );

        const data = res.data?.data;
        setUser(data);

        form.setFieldsValue({
          role: data?.role || "user",
        });
      } catch (error) {
        console.error(error);
        message.error("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    if (_id) fetchUser();
  }, [_id, form]);

  const onFinish = async (values: any) => {
    if (values.role === user?.role) {
      return message.error("No changes detected");
    }

    setSubmitLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      await axios.patch(
        `${API_BASE_URL}/api/v1/users/${_id}`,
        values,
        {
          headers: { Authorization: `${token}` },
        },
      );

      message.success("User role updated successfully!");
      navigate("/admin-dashboard/all-users");
    } catch (error) {
      console.error(error);
      message.error("Failed to update role");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Spin size="large" />
        <Text type="secondary" className="text-xs">Loading user profile...</Text>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin-dashboard/all-users">
            <Button icon={<ArrowLeftOutlined />} shape="circle" size="middle" />
          </Link>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Update User Role
            </Title>
            <Text type="secondary" className="text-xs sm:text-sm">
              Assign or revoke administrator and provider permissions.
            </Text>
          </div>
        </div>

        <Link to="/admin-dashboard/all-users">
          <Button>Cancel</Button>
        </Link>
      </div>

      <Card bordered={false} className="shadow-xs rounded-2xl border border-slate-200/80 p-4">
        {user && (
          <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-6">
            <Avatar
              icon={<UserOutlined />}
              size={54}
              className="bg-teal-100 text-teal-700 font-bold border border-teal-200 shrink-0 text-xl"
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <div className="overflow-hidden">
              <span className="font-bold text-slate-800 text-sm block">{user.name}</span>
              <span className="text-xs text-slate-400 font-mono block">{user.email}</span>
              <Tag color="cyan" className="font-bold text-[10px] rounded-full mt-1">
                Current Role: {user.role || "user"}
              </Tag>
            </div>
          </div>
        )}

        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label={<span className="font-semibold text-slate-700">Select Permission Role</span>}
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select size="large" className="rounded-xl">
              <Select.Option value="user">Patient / Customer (Standard User)</Select.Option>
              <Select.Option value="admin">Super Administrator (Full System Control)</Select.Option>
            </Select>
          </Form.Item>

          <Divider className="my-4" />

          <div className="flex items-center justify-end gap-3">
            <Link to="/admin-dashboard/all-users">
              <Button size="large" className="rounded-xl">Cancel</Button>
            </Link>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={submitLoading}
              style={{
                backgroundColor: "#0d9488",
                borderColor: "#0d9488",
                borderRadius: 12,
                fontWeight: 700,
              }}
              className="px-6 shadow-md"
            >
              Update Permission
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateAllUser;
