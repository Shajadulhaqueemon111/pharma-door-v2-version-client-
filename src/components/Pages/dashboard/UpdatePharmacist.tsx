/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Select, Button, Card, Typography, Spin, message } from "antd";

const { Title } = Typography;

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
          `https://pharma-door-backend.vercel.app/api/v1/users/${_id}`,
          {
            headers: { Authorization: `${token}` },
          },
        );

        const data = res.data?.data;

        setUser(data);

        // set form values
        form.setFieldsValue({
          role: data?.role,
          status: data?.status,
        });
      } catch (error) {
        console.error(error);
        message.error("Failed to load user");
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
        `https://pharma-door-backend.vercel.app/api/v1/users/${_id}`,
        values,
        {
          headers: { Authorization: `${token}` },
        },
      );

      message.success("User updated successfully");
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
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
      <Card style={{ width: "100%", maxWidth: 500, borderRadius: 12 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          👨‍⚕️ Update Pharmacist
        </Title>

        <Form layout="vertical" form={form} onFinish={onFinish}>
          {/* ROLE */}
          <Form.Item
            label="Select Role"
            name="role"
            rules={[{ required: true, message: "Please select role" }]}
          >
            <Select size="large">
              <Select.Option value="pharmacist">Pharmacist</Select.Option>
              <Select.Option value="user">User</Select.Option>
            </Select>
          </Form.Item>

          {/* STATUS */}
          <Form.Item
            label="Select Status"
            name="status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select size="large">
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="approved">Approved</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
            </Select>
          </Form.Item>

          {/* SUBMIT */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={submitLoading}
            >
              Update Pharmacist
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdatePharmacist;
