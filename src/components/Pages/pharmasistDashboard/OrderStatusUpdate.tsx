/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Typography,
  Button,
  Spin,
  Input,
  DatePicker,
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { ShieldAlert, Truck } from "lucide-react";
import { API_BASE_URL } from "../../../config/api";
import { OrderStatusBadge, normalizeStatus } from "../Orders/OrderStatusBadge";
import dayjs from "dayjs";

const { Text } = Typography;

// Valid transition mapping
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "REJECTED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["READY_FOR_DISPATCH", "CANCELLED"],
  READY_FOR_DISPATCH: ["OUT_FOR_DELIVERY", "CANCELLED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "RETURNED"],
  DELIVERED: ["RETURNED"],
  CANCELLED: [],
  REJECTED: [],
  RETURNED: [],
  // Legacy mappings
  Pending: ["CONFIRMED", "PROCESSING", "DELIVERED", "CANCELLED"],
  Paid: ["PROCESSING", "READY_FOR_DISPATCH", "DELIVERED"],
  Shipped: ["DELIVERED", "RETURNED"],
  Completed: ["RETURNED"],
};

const OrderStatusUpdate = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [nextStatus, setNextStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState<dayjs.Dayjs | null>(null);

  // Delivery rider fields
  const [riderName, setRiderName] = useState("");
  const [riderPhone, setRiderPhone] = useState("");
  const [riderNotes, setRiderNotes] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token || !_id) return;

        const res = await axios.get(`${API_BASE_URL}/api/v1/order/${_id}`, {
          headers: { Authorization: token },
        });

        if (res.data?.data) {
          const ord = res.data.data;
          setOrder(ord);
          const curr = ord.orderStatus || ord.status || "PENDING";
          setNextStatus(curr);
          if (ord.estimatedDeliveryDate) {
            setEstimatedDelivery(dayjs(ord.estimatedDeliveryDate));
          }
          if (ord.deliveryInfo) {
            setRiderName(ord.deliveryInfo.riderName || "");
            setRiderPhone(ord.deliveryInfo.riderPhone || "");
            setRiderNotes(ord.deliveryInfo.notes || "");
          }
        }
      } catch (err) {
        console.error("Failed to load order:", err);
        toast.error("Failed to load order details.");
      } finally {
        setFetching(false);
      }
    };

    fetchOrder();
  }, [_id]);

  const currentStatus = normalizeStatus(order?.orderStatus || order?.status || "PENDING");
  const validNextOptions = ALLOWED_TRANSITIONS[currentStatus] || [];

  const handleUpdate = async () => {
    if (!nextStatus) {
      toast.error("Please select a status.");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please log in again.");
        return;
      }

      // 1. Update status
      await axios.patch(
        `${API_BASE_URL}/api/v1/order/${_id}/status`,
        {
          status: nextStatus,
          note: statusNote || undefined,
          estimatedDeliveryDate: estimatedDelivery ? estimatedDelivery.toISOString() : undefined,
        },
        {
          headers: { Authorization: token },
        }
      );

      // 2. If rider info provided, assign delivery info
      if (riderName || riderPhone) {
        await axios.patch(
          `${API_BASE_URL}/api/v1/order/${_id}/assign-delivery`,
          {
            riderName,
            riderPhone,
            notes: riderNotes,
            estimatedDeliveryDate: estimatedDelivery ? estimatedDelivery.toISOString() : undefined,
          },
          {
            headers: { Authorization: token },
          }
        );
      }

      toast.success("Order status and delivery info updated successfully!");
      navigate("/pharmacist-dashboard/orderd-medicine");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update order status.");
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Spin size="large" />
        <Text type="secondary" className="text-xs">
          Loading order details...
        </Text>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-sm font-bold text-slate-700">Order not found.</p>
        <Link
          to="/pharmacist-dashboard/orderd-medicine"
          className="text-teal-600 text-xs font-bold underline mt-2 inline-block"
        >
          Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/pharmacist-dashboard/orderd-medicine">
            <Button icon={<ArrowLeftOutlined />} shape="circle" size="small" />
          </Link>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Order Fulfillment & Status Control
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Order #{order.orderNumber || order._id}
            </p>
          </div>
        </div>

        <OrderStatusBadge status={currentStatus} size="md" />
      </div>

      {/* Patient & Order Details Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Patient & Delivery Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <UserOutlined className="text-teal-600" />
              {order.shippingAddress?.fullName || order.user?.name || "Patient"}
            </p>
            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <PhoneOutlined />
              {order.shippingAddress?.phone || order.user?.phone || "N/A"}
            </p>
            <p className="text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
              <HomeOutlined className="mt-0.5" />
              <span>
                {order.shippingAddress?.address || order.user?.address || "Address on file"},{" "}
                {order.shippingAddress?.city || "Dhaka"}
              </span>
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Payment:</span>{" "}
              {order.paymentMethod || "Online"} (
              <span
                className={
                  order.paymentStatus === "Paid" ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"
                }
              >
                {order.paymentStatus || "Pending"}
              </span>
              )
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Total Amount:</span>{" "}
              <span className="font-bold text-teal-700 dark:text-teal-400">
                ৳{(Number(order.totalAmount || order.totalPrice) || 0).toFixed(2)}
              </span>
            </p>
            {order.customerNotes && (
              <p className="text-slate-500 dark:text-slate-400 italic">
                <span className="font-semibold text-slate-700 dark:text-slate-200">Patient Note:</span> "
                {order.customerNotes}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Status Transition Control Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <ShieldAlert className="w-5 h-5 text-teal-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Controlled Status Transition
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Current Status: <span className="text-teal-600 font-extrabold">{currentStatus}</span>
            </label>

            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Valid Forward Status *
            </label>
            <select
              value={nextStatus}
              onChange={(e) => setNextStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white font-medium focus:outline-none focus:border-teal-500"
            >
              <option value={currentStatus}>Stay at current: {currentStatus}</option>
              {validNextOptions.map((st) => (
                <option key={st} value={st}>
                  Advance to: {st}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Safety rule: Only clinically and logistically valid transitions are permitted.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Pharmacist / Staff Verification Note (Customer Visible)
            </label>
            <textarea
              rows={2}
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="e.g. Prescription validated against DGDA guidelines. Packed under cold-chain storage."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Estimated Delivery Date & Time
            </label>
            <DatePicker
              showTime
              value={estimatedDelivery}
              onChange={(val) => setEstimatedDelivery(val)}
              className="w-full rounded-xl py-2"
              placeholder="Select expected arrival time"
            />
          </div>
        </div>
      </div>

      {/* Courier & Delivery Rider Assignment */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Truck className="w-5 h-5 text-purple-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Dispatch & Rider Assignment
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Rider / Courier Name
            </label>
            <Input
              value={riderName}
              onChange={(e) => setRiderName(e.target.value)}
              placeholder="e.g. Md. Shakil (Pathao / PharmaDoor Rider)"
              className="rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Rider Contact Phone
            </label>
            <Input
              value={riderPhone}
              onChange={(e) => setRiderPhone(e.target.value)}
              placeholder="017XXXXXXXX"
              className="rounded-xl"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Delivery Notes / Tracking Ref
            </label>
            <Input
              value={riderNotes}
              onChange={(e) => setRiderNotes(e.target.value)}
              placeholder="e.g. Express Cold-chain insulated delivery bag #14"
              className="rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Submit Action */}
      <div className="flex justify-end gap-3 pt-4">
        <Link to="/pharmacist-dashboard/orderd-medicine">
          <Button size="large" className="rounded-xl">
            Cancel
          </Button>
        </Link>
        <Button
          type="primary"
          size="large"
          loading={submitting}
          onClick={handleUpdate}
          className="rounded-xl font-bold bg-teal-600 hover:bg-teal-700"
        >
          Save & Publish Status Update
        </Button>
      </div>
    </div>
  );
};

export default OrderStatusUpdate;
