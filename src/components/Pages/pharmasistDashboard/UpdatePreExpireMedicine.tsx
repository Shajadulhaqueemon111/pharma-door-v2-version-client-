/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
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
  Modal,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { usePharmacistTheme } from "./pharmacistTheme";

const { Title, Text } = Typography;

const UpdatePreExpireMedicines = () => {
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
          `https://pharmadoor-backend-v2.vercel.app/api/v1/medicine/${_id}`,
        );

        const fetchedData = res.data?.data;
        if (fetchedData) {
          setMedicine(fetchedData);
          setOldExpiryDate(fetchedData.expiryDate);
          form.setFieldsValue({
            expiryDate: dayjs(fetchedData.expiryDate),
          });
        }
      } catch (error) {
        toast.error("Failed to load medicine data.");
      } finally {
        setLoading(false);
      }
    };

    if (_id) fetchMedicine();
  }, [_id, form]);

  const handleSubmit = async (values: any) => {
    const newDate = values.expiryDate;
    const previousDate = dayjs(oldExpiryDate);
    const today = dayjs();

    if (newDate.isBefore(previousDate) || newDate.isSame(previousDate, "day")) {
      toast.error("New expiration date must be later than the existing expiration date.");
      return;
    }

    if (newDate.isBefore(today, "day")) {
      toast.error("Expiry date cannot be today or in the past.");
      return;
    }

    const diffInDays = newDate.diff(today, "day");

    const proceedUpdate = async () => {
      try {
        setUpdating(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("Please login first");
          return;
        }

        await axios.patch(
          `https://pharmadoor-backend-v2.vercel.app/api/v1/medicine/${_id}`,
          { expiryDate: newDate.toISOString() },
          {
            headers: { Authorization: token },
          },
        );

        toast.success("Medicine expiry date updated successfully!");
        navigate("/pharmacist-dashboard/pre-expire-medicine");
      } catch (err) {
        toast.error("Failed to update expiration date.");
      } finally {
        setUpdating(false);
      }
    };

    if (diffInDays <= 30) {
      Modal.confirm({
        title: "Date is still within 30 days",
        icon: <ExclamationCircleOutlined />,
        content: `The selected date is in ${diffInDays} days, which keeps this item in the pre-expiry watch list. Do you wish to continue?`,
        okText: "Yes, Proceed",
        cancelText: "Change Date",
        onOk: proceedUpdate,
      });
    } else {
      await proceedUpdate();
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
          <Link to="/pharmacist-dashboard/pre-expire-medicine">
            <Button icon={<ArrowLeftOutlined />} shape="circle" size="middle" />
          </Link>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Extend Expiry Date
            </Title>
            <Text type="secondary" className="text-xs sm:text-sm">
              Update shelf-life record for medications approaching 30-day expiration.
            </Text>
          </div>
        </div>

        <Link to="/pharmacist-dashboard/pre-expire-medicine">
          <Button>Cancel</Button>
        </Link>
      </div>

      <Card bordered={false} className="shadow-xs rounded-2xl border border-slate-200/80 p-4">
        {medicine && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800 text-sm">{medicine.name}</span>
              <Tag color="warning" className="font-bold text-xs rounded-full">Expiring Soon</Tag>
            </div>
            <p className="text-xs text-slate-500">
              Brand: <strong className="text-slate-700">{medicine.brand}</strong> &bull; Current Stock: <strong className="text-slate-700">{medicine.stock} units</strong>
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Current Expiry: <strong>{dayjs(oldExpiryDate).format("MMMM D, YYYY")}</strong>
            </p>
          </div>
        )}

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label={<span className="font-semibold text-slate-700">New Extended Expiration Date</span>}
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
            <Link to="/pharmacist-dashboard/pre-expire-medicine">
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
              Confirm Date Extension
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default UpdatePreExpireMedicines;
