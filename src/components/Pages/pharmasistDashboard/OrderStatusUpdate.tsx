/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Card,
  Typography,
  Select,
  Button,
  Steps,
  Spin,
  Tag,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CarOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { usePharmacistTheme } from "./pharmacistTheme";

const { Title, Text } = Typography;
const { Option } = Select;

const OrderStatusUpdate = () => {
  const { _id } = useParams();
  const [status, setStatus] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const { themeConfig } = usePharmacistTheme();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token || !_id) return;

        const res = await axios.get(
          `https://pharmadoor-backend-v2.vercel.app/api/v1/order/${_id}`,
          { headers: { Authorization: token } },
        );

        if (res.data?.data) {
          setOrder(res.data.data);
          setStatus(res.data.data.status || "Pending");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    fetchOrder();
  }, [_id]);

  const handleStatusUpdate = async () => {
    if (!status) {
      toast.error("Please select a valid order status.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authentication token missing. Please log in.");
        return;
      }

      const response = await axios.patch(
        `https://pharmadoor-backend-v2.vercel.app/api/v1/order/${_id}`,
        { status },
        {
          headers: { Authorization: `${token}` },
        },
      );

      if (response.status === 200) {
        toast.success("Order fulfillment status updated!");
        navigate("/pharmacist-dashboard/orderd-medicine");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update order status.");
    } finally {
      setLoading(false);
    }
  };

  const getStepCurrent = (st: string) => {
    switch (st?.toLowerCase()) {
      case "pending":
        return 0;
      case "paid":
        return 1;
      case "shipped":
        return 2;
      case "completed":
        return 3;
      default:
        return 0;
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Spin size="large" />
        <Text type="secondary" className="text-xs">Loading order details...</Text>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/pharmacist-dashboard/orderd-medicine">
            <Button icon={<ArrowLeftOutlined />} shape="circle" size="middle" />
          </Link>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Update Order Status
            </Title>
            <Text type="secondary" className="text-xs sm:text-sm">
              Change shipment, verification, and fulfillment progress.
            </Text>
          </div>
        </div>

        <Link to="/pharmacist-dashboard/orderd-medicine">
          <Button>Back to Orders</Button>
        </Link>
      </div>

      {/* Main Card */}
      <Card bordered={false} className="shadow-xs rounded-2xl border border-slate-200/80 p-4">
        {/* Order Details Brief */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-mono">Order Tracking ID</span>
              <p className="font-extrabold text-sm text-slate-800">#{_id?.slice(-8).toUpperCase()}</p>
            </div>
            <Tag color="cyan" className="font-bold text-xs rounded-full px-2.5">
              Current: {order?.status || status}
            </Tag>
          </div>

          {order?.user && (
            <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Customer</span>
                <span className="font-semibold text-slate-700">{order.user.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Contact</span>
                <span className="font-semibold text-slate-700">{order.user.phone || order.user.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Order Total</span>
                <span className="font-bold text-teal-600">৳ {Number(order.totalPrice || 0).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Steps Visualizer */}
        <div className="py-4 px-2">
          <Steps
            current={getStepCurrent(status)}
            items={[
              { title: "Pending", icon: <InboxOutlined /> },
              { title: "Paid", icon: <SyncOutlined spin={status?.toLowerCase() === "paid"} /> },
              { title: "Shipped", icon: <CarOutlined /> },
              { title: "Completed", icon: <CheckCircleOutlined /> },
            ]}
          />
        </div>

        <Divider className="my-6" />

        {/* Status Dropdown */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Select New Fulfillment State
            </label>
            <Select
              value={status}
              onChange={setStatus}
              size="large"
              className="w-full rounded-xl"
            >
              <Option value="Pending">Pending Verification</Option>
              <Option value="Paid">Payment Confirmed (Paid)</Option>
              <Option value="Shipped">Dispatched / Shipped with Courier</Option>
              <Option value="Completed">Order Completed / Delivered</Option>
              <Option value="Cancelled">Cancelled / Refunded</Option>
            </Select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Link to="/pharmacist-dashboard/orderd-medicine">
              <Button size="large" className="rounded-xl">
                Cancel
              </Button>
            </Link>
            <Button
              type="primary"
              size="large"
              onClick={handleStatusUpdate}
              loading={loading}
              icon={<CheckCircleOutlined />}
              style={{
                backgroundColor: themeConfig.accentColor,
                borderColor: themeConfig.accentColor,
                borderRadius: 12,
                fontWeight: 700,
              }}
              className="px-6 shadow-md"
            >
              Apply Status Update
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderStatusUpdate;
