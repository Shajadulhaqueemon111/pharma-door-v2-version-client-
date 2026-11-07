/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import toast from "react-hot-toast";
import {
  Form,
  DatePicker,
  Button,
  Spin,
  Card,
  Typography,
  Divider,
  Tag,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { usePharmacistTheme } from "./pharmacistTheme";

const { Title, Text } = Typography;

const UpdateExpireMedicines = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const { themeConfig } = usePharmacistTheme();

  const [form] = Form.useForm();
  const [medicine, setMedicine] = useState<any>(null);
  const [oldExpiryDate, setOldExpiryDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/medicine/${_id}`,
        );

        const medData = res.data?.data;
        if (medData) {
          setMedicine(medData);
          setOldExpiryDate(medData.expiryDate);
          form.setFieldsValue({
            expiryDate: dayjs(medData.expiryDate),
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch medicine details");
      } finally {
        setLoading(false);
      }
    };

    if (_id) fetchMedicine();
  }, [_id, form]);

  const handleSubmit = async (values: any) => {
    const newDate = values.expiryDate.toISOString();
    const newDateStr = values.expiryDate.format("YYYY-MM-DD");
    const oldDateStr = dayjs(oldExpiryDate).format("YYYY-MM-DD");

    if (newDateStr <= oldDateStr) {
      toast.error("New expiry date must be greater than current expired date.");
      return;
    }

    try {
      setUpdating(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please log in first");
        return;
      }

      await axios.patch(
        `${API_BASE_URL}/api/v1/medicine/${_id}`,
        { expiryDate: newDate },
        {
          headers: { Authorization: token },
        },
      );

      toast.success("Medicine expiry date updated successfully!");
      navigate("/pharmacist-dashboard/expire-medicines");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update expiration date");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Spin size="large" />
        <Text type="secondary" className="text-xs">Loading medicine details...</Text>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/pharmacist-dashboard/expire-medicines">
            <Button icon={<ArrowLeftOutlined />} shape="circle" size="middle" />
          </Link>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Update Expiry Date
            </Title>
            <Text type="secondary" className="text-xs sm:text-sm">
              Extend or rectify batch expiration date after laboratory re-certification.
            </Text>
          </div>
        </div>

        <Link to="/pharmacist-dashboard/expire-medicines">
          <Button>Cancel</Button>
        </Link>
      </div>

      <Card bordered={false} className="shadow-xs rounded-2xl border border-slate-200/80 p-4">
        {medicine && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800 text-sm">{medicine.name}</span>
              <Tag color="red" className="font-bold text-xs rounded-full">Expired</Tag>
            </div>
            <p className="text-xs text-slate-500">
              Brand: <strong className="text-slate-700">{medicine.brand}</strong> &bull; Stock: <strong className="text-slate-700">{medicine.stock} units</strong>
            </p>
            <p className="text-xs text-rose-600 mt-1">
              Recorded Expiry: {dayjs(oldExpiryDate).format("MMMM D, YYYY")}
            </p>
          </div>
        )}

        <Alert
          message="Notice"
          description="Ensure updated expiry date complies with manufacturer batch stability test records."
          type="info"
          showIcon
          className="rounded-xl mb-6 text-xs"
        />

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label={<span className="font-semibold text-slate-700">New Expiration Date</span>}
            name="expiryDate"
            rules={[{ required: true, message: "Please select new expiration date" }]}
          >
            <DatePicker
              size="large"
              className="w-full rounded-xl"
              placeholder="Select future valid date"
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <Divider className="my-4" />

          <div className="flex items-center justify-end gap-3">
            <Link to="/pharmacist-dashboard/expire-medicines">
              <Button size="large" className="rounded-xl">
                Cancel
              </Button>
            </Link>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={updating}
              style={{
                backgroundColor: themeConfig.accentColor,
                borderColor: themeConfig.accentColor,
                borderRadius: 12,
                fontWeight: 700,
              }}
              className="px-6 shadow-md"
            >
              Update Expiry
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateExpireMedicines;
