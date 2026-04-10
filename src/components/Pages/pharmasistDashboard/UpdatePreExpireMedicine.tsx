/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { Form, DatePicker, Button, Spin, Card, Typography, Modal } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

const UpdatePreExpireMedicines = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [oldExpiryDate, setOldExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMedicine = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://pharma-door-backend.vercel.app/api/v1/medicine/${_id}`,
        );

        const fetchedDate = res.data?.data?.expiryDate;

        if (fetchedDate) {
          setOldExpiryDate(fetchedDate);
          form.setFieldsValue({
            expiryDate: dayjs(fetchedDate),
          });
        }
      } catch (error) {
        toast.error("Failed to load medicine data.");
      } finally {
        setLoading(false);
      }
    };

    if (_id) fetchMedicine();
  }, [_id]);

  const getUTCDateOnly = (date: dayjs.Dayjs) => {
    return Date.UTC(date.year(), date.month(), date.date());
  };

  const handleSubmit = async (values: any) => {
    const newDate = values.expiryDate;
    const previousDate = dayjs(oldExpiryDate);
    const today = dayjs();

    const newDateUTC = getUTCDateOnly(newDate);
    const oldDateUTC = getUTCDateOnly(previousDate);
    const todayUTC = getUTCDateOnly(today);

    // ❌ validation
    if (newDateUTC <= oldDateUTC) {
      toast.error("New expiry date must be greater than current expiry date.");
      return;
    }

    if (newDateUTC <= todayUTC) {
      toast.error("Expiry date cannot be today or in the past.");
      return;
    }

    const diffInDays = (newDateUTC - todayUTC) / (1000 * 60 * 60 * 24);

    const proceedUpdate = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("Please login first");
          return;
        }

        await axios.patch(
          `https://pharma-door-backend.vercel.app/api/v1/medicine/${_id}`,
          { expiryDate: newDate.toISOString() },
          {
            headers: { Authorization: token },
          },
        );

        toast.success("Expiry date updated successfully!");
        navigate("/pharmacist-dashboard/pre-expire-medicine");
      } catch (error) {
        toast.error("Update failed");
      }
    };

    // ⚠️ warning modal (instead of window.confirm)
    if (diffInDays <= 30) {
      Modal.confirm({
        title: "⚠️ Warning",
        content: `This expiry date is only ${Math.round(
          diffInDays,
        )} day(s) away. Are you sure you want to continue?`,
        okText: "Yes, Continue",
        cancelText: "Cancel",
        onOk: proceedUpdate,
      });
    } else {
      proceedUpdate();
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
      <Card style={{ width: 420, borderRadius: 12 }}>
        <Title level={4} style={{ textAlign: "center", color: "#1677ff" }}>
          Update Expiry Date
        </Title>

        {/* Show current expiry */}
        <p style={{ marginBottom: 10, textAlign: "center" }}>
          Current: {dayjs(oldExpiryDate).format("DD MMM YYYY")}
        </p>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Select New Expiry Date"
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

export default UpdatePreExpireMedicines;
