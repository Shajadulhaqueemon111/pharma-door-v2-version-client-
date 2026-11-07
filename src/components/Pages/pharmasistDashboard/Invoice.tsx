/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../../../config/api";
import {
  Card,
  Typography,
  Button,
  Spin,
  Table,
  Divider,
  Tag,
  Row,
  Col,
} from "antd";
import {
  PrinterOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { usePharmacistTheme } from "./pharmacistTheme";

const { Title, Text } = Typography;

const Invoice = () => {
  const { _id } = useParams<{ _id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { themeConfig } = usePharmacistTheme();

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token || !_id) return;

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/order/${_id}`,
          {
            headers: { Authorization: `${token}` },
          },
        );

        const data = await res.json();
        setOrder(data?.data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [_id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Spin size="large" />
        <Text type="secondary" className="text-xs">Generating official pharmacy invoice...</Text>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-rose-500 font-bold mb-4">Invoice record not found.</p>
        <Link to="/pharmacist-dashboard/orderd-medicine">
          <Button icon={<ArrowLeftOutlined />}>Return to Orders</Button>
        </Link>
      </div>
    );
  }

  const columns = [
    {
      title: "Item Description",
      key: "product",
      render: (_: any, record: any, idx: number) => (
        <div>
          <span className="font-bold text-slate-800 text-xs">
            {record.productName || record.name || `Prescription Medication #${idx + 1}`}
          </span>
          <span className="text-[11px] text-slate-400 block font-mono">
            Ref: {record.product ? String(record.product).slice(-8).toUpperCase() : "RX-MED"}
          </span>
        </div>
      ),
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
      render: (qty: number) => <span className="font-semibold text-xs">{qty || 1}</span>,
    },
    {
      title: "Unit Rate",
      key: "unitPrice",
      align: "right" as const,
      render: (_: any, record: any) => {
        const total = Number(order.totalPrice || 0);
        const count = order.products?.length || 1;
        const rate = record.price || (total / count);
        return <span className="text-xs text-slate-700">৳ {(Number(rate) || 0).toFixed(2)}</span>;
      },
    },
    {
      title: "Subtotal",
      key: "subtotal",
      align: "right" as const,
      render: (_: any, record: any) => {
        const total = Number(order.totalPrice || 0);
        const count = order.products?.length || 1;
        const line = record.total || (total / count);
        return <span className="font-bold text-xs text-slate-900">৳ {(Number(line) || 0).toFixed(2)}</span>;
      },
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Controls (Hidden on print) */}
      <div className="flex items-center justify-between print:hidden">
        <Link to="/pharmacist-dashboard/orderd-medicine">
          <Button icon={<ArrowLeftOutlined />} className="rounded-xl font-semibold">
            Back to Orders
          </Button>
        </Link>

        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={() => window.print()}
          style={{
            backgroundColor: themeConfig.accentColor,
            borderColor: themeConfig.accentColor,
            borderRadius: 12,
            fontWeight: 700,
          }}
          className="shadow-md"
        >
          Print Official Invoice
        </Button>
      </div>

      {/* Printable Invoice Sheet */}
      <Card
        bordered={false}
        className="shadow-md rounded-3xl border border-slate-200/90 p-6 sm:p-10 bg-white text-slate-800"
      >
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-md"
              style={{ backgroundColor: themeConfig.accentColor }}
            >
              Rx
            </div>
            <div>
              <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
                Pharma<span style={{ color: themeConfig.accentColor }}>Door</span>
              </Title>
              <Text className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                Model Pharmacy & Dispensary
              </Text>
              <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-mono border border-teal-200">
                DGDA Reg: DGDA-DISP-2024-88914
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <Tag color="cyan" className="font-extrabold text-xs uppercase px-2.5 py-0.5 rounded-full mb-1">
              Tax Invoice
            </Tag>
            <p className="font-mono text-xs font-bold text-slate-900">
              INV-{order._id ? order._id.slice(-8).toUpperCase() : "2026-001"}
            </p>
            <p className="text-xs text-slate-500">
              Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : new Date().toLocaleDateString()}
            </p>
            <p className="text-xs text-slate-500">
              Status: <span className="font-bold text-emerald-600">{order.status || "Delivered"}</span>
            </p>
          </div>
        </div>

        {/* Customer & Billing Info */}
        <Row gutter={[24, 24]} className="py-6">
          <Col xs={24} sm={12}>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Billed To (Patient)
              </span>
              <p className="font-bold text-sm text-slate-900">{order.user?.name || "Registered Patient"}</p>
              <p className="text-xs text-slate-600">{order.user?.phone || "Phone: N/A"}</p>
              <p className="text-xs text-slate-600">{order.user?.email || "Email: N/A"}</p>
              <p className="text-xs text-slate-500 mt-1">
                <strong>Address:</strong> {order.user?.address || "Delivery address verified by customer"}
              </p>
            </div>
          </Col>

          <Col xs={24} sm={12}>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Dispensary & Payment Details
              </span>
              <p className="text-xs text-slate-700">
                <strong>Payment Method:</strong> {order.paymentStatus || "Cash On Delivery"}
              </p>
              <p className="text-xs text-slate-700 font-mono">
                <strong>Txn ID:</strong> {order.transactionId || order._id?.slice(-12).toUpperCase()}
              </p>
              <p className="text-xs text-slate-700">
                <strong>Dispensed by:</strong> Licensed Pharmacist on Duty
              </p>
              <p className="text-xs text-slate-500">
                <strong>Fulfillment Center:</strong> Central Hub, Dhaka
              </p>
            </div>
          </Col>
        </Row>

        {/* Items Table */}
        <div className="my-2">
          <Table
            columns={columns}
            dataSource={order.products || []}
            rowKey={(rec, idx) => rec._id || `item-${idx}`}
            pagination={false}
            size="small"
            bordered
            className="rounded-xl overflow-hidden"
          />
        </div>

        {/* Financial Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-6">
          <div className="text-xs text-slate-400 max-w-sm">
            <p className="font-bold text-slate-600 mb-1">Pharmacy Compliance Notice:</p>
            <p>
              All dispensed medications undergo stringent temperature checks and batch verification per DGDA standards. Keep out of reach of children.
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold">৳ {Number(order.totalPrice || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Delivery Fee:</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>VAT / Tax (0%):</span>
              <span className="font-semibold">৳ 0.00</span>
            </div>
            <Divider className="my-2" />
            <div className="flex justify-between text-sm font-extrabold text-slate-900">
              <span>Grand Total:</span>
              <span style={{ color: themeConfig.accentColor }}>
                ৳ {Number(order.totalPrice || 0).toFixed(2)} BDT
              </span>
            </div>
          </div>
        </div>

        {/* Signature Line */}
        <div className="mt-12 pt-8 border-t border-dashed border-slate-200 flex justify-between items-end text-xs text-slate-500">
          <div>
            <p className="font-bold text-slate-700">Customer Signature</p>
            <div className="w-40 border-b border-slate-300 mt-8" />
          </div>
          <div className="text-right">
            <div className="w-40 border-b border-slate-300 mb-1" />
            <p className="font-bold text-slate-700">Authorized Pharmacist</p>
            <p className="text-[10px] text-slate-400">Digital Seal & Verification</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Invoice;
