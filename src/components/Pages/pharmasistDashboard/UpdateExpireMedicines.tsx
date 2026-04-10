/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { Form, DatePicker, Button, Spin, Card, Typography } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

const UpdateExpireMedicines = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [oldExpiryDate, setOldExpiryDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const res = await axios.get(
          `https://pharma-door-backend.vercel.app/api/v1/medicine/${_id}`,
        );

        const dbDate = res.data?.data?.expiryDate;

        if (dbDate) {
          setOldExpiryDate(dbDate);
          form.setFieldsValue({
            expiryDate: dayjs(dbDate),
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch medicine");
      } finally {
        setLoading(false);
      }
    };

    if (_id) fetchMedicine();
  }, [_id]);

  const handleSubmit = async (values: any) => {
    const newDate = values.expiryDate.toISOString();
    const newDateStr = values.expiryDate.format("YYYY-MM-DD");
    const oldDateStr = dayjs(oldExpiryDate).format("YYYY-MM-DD");

    if (newDateStr <= oldDateStr) {
      toast.error("New expiry date must be greater than current expiry date.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      await axios.patch(
        `https://pharma-door-backend.vercel.app/api/v1/medicine/${_id}`,
        { expiryDate: newDate },
        {
          headers: { Authorization: token },
        },
      );

      toast.success("Expiry date updated successfully!");
      navigate("/pharmacist-dashboard/expire-medicines");
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
      <Card style={{ width: 400, borderRadius: 10 }}>
        <Title level={4} style={{ textAlign: "center", color: "#1677ff" }}>
          Update Expiry Date
        </Title>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Expiry Date"
            name="expiryDate"
            rules={[{ required: true, message: "Please select expiry date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateExpireMedicines;
