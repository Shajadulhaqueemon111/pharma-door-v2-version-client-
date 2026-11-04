/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
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
  MedicineBoxOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const UpdatePharmacist = () => {
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
          `https://pharmadoor-backend-v2.vercel.app/api/v1/users/${_id}`,
          {
            headers: { Authorization: `${token}` },
          },
        );

        const data = res.data?.data;
        setUser(data);

        form.setFieldsValue({
          role: data?.role,
          status: data?.status || "pending",
        });
      } catch (error) {
        console.error(error);
        message.error("Failed to load pharmacist details");
      } finally {
        setLoading(false);
      }
    };

    if (_id) fetchUser();
  }, [_id, form]);

  const onFinish = async (values: any) => {
    if (values.role === user?.role && values.status === user?.status) {
      return message.error("No changes detected");
    }

    setSubmitLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      await axios.patch(
        `https://pharmadoor-backend-v2.vercel.app/api/v1/users/${_id}`,
        values,
        {
          headers: { Authorization: `${token}` },
        },
      );

      message.success("Pharmacist credentials & status updated successfully!");
      navigate("/admin-dashboard/all-pharmacist");
    } catch (error) {
      console.error(error);
      message.error("Update failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Spin size="large" />
        <Text type="secondary" className="text-xs">Loading pharmacist details...</Text>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin-dashboard/all-pharmacist">
            <Button icon={<ArrowLeftOutlined />} shape="circle" size="middle" />
          </Link>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Review Pharmacist Status
            </Title>
            <Text type="secondary" className="text-xs sm:text-sm">
              Approve, put on hold, or decline pharmacy dispensary account access.
            </Text>
          </div>
        </div>

        <Link to="/admin-dashboard/all-pharmacist">
          <Button>Cancel</Button>
        </Link>
      </div>

      <Card bordered={false} className="shadow-xs rounded-2xl border border-slate-200/80 p-4">
        {user && (
          <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-6">
            <Avatar
              icon={<MedicineBoxOutlined />}
              size={54}
              className="bg-teal-100 text-teal-700 font-bold border border-teal-200 shrink-0 text-xl"
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "P"}
            </Avatar>
            <div className="overflow-hidden">
              <span className="font-bold text-slate-800 text-sm block">{user.name}</span>
              <span className="text-xs text-slate-400 font-mono block">{user.email}</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Tag color="cyan" className="font-bold text-[10px] rounded-full">
                  Role: {user.role || "pharmacist"}
                </Tag>
                <Tag
                  color={user.status === "approved" ? "success" : user.status === "rejected" ? "error" : "warning"}
                  className="font-bold text-[10px] rounded-full"
                >
                  Status: {user.status || "pending"}
                </Tag>
              </div>
            </div>
          </div>
        )}

        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label={<span className="font-semibold text-slate-700">Verification Status</span>}
            name="status"
            rules={[{ required: true, message: "Please select verification status" }]}
          >
            <Select size="large" className="rounded-xl">
              <Select.Option value="pending">Pending Document Review</Select.Option>
              <Select.Option value="approved">Approved & Licensed (Dispensary Active)</Select.Option>
              <Select.Option value="rejected">Rejected / Invalid Drug License</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-slate-700">Assigned System Role</span>}
            name="role"
            rules={[{ required: true, message: "Please select role" }]}
          >
            <Select size="large" className="rounded-xl">
              <Select.Option value="pharmacist">Licensed Pharmacist</Select.Option>
              <Select.Option value="user">Standard Patient / User</Select.Option>
              <Select.Option value="admin">Super Administrator</Select.Option>
            </Select>
          </Form.Item>

          <Divider className="my-4" />

          <div className="flex items-center justify-end gap-3">
            <Link to="/admin-dashboard/all-pharmacist">
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
              Update Pharmacist Status
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default UpdatePharmacist;
