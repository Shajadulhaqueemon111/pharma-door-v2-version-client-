/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../privateRoute/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Table,
  Button,
  Popconfirm,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
  Input,
  Select,
  Avatar,
  Space,
  Typography,
  Tooltip,
  Badge,
  Spin,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  FileTextOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { usePharmacistTheme } from "./pharmacistTheme";
import { API_BASE_URL, SOCKET_SERVER_URL } from "../../../config/api";
import { OrderStatusBadge, normalizeStatus } from "../Orders/OrderStatusBadge";
import io from "socket.io-client";

const { Title, Text } = Typography;
const { Option } = Select;

const OrderedMedicine = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userId = user?._id;
  const { themeConfig } = usePharmacistTheme();

  // Search & Filter
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await axios.get(
        `${API_BASE_URL}/api/v1/order/ordered-medicine`,
        {
          headers: { Authorization: `${token}` },
        },
      );

      const allOrders = res.data?.data || [];

      // Filter orders for pharmacist's products only
      const filteredOrders = allOrders
        .map((order: any) => {
          const matchingProducts = order.products?.filter(
            (item: any) => item.pharmacist === userId || !item.pharmacist,
          );

          if (matchingProducts && matchingProducts.length > 0) {
            return {
              ...order,
              products: matchingProducts,
            };
          }
          return order;
        })
        .filter((order: any) => order !== null);

      setOrders(filteredOrders.reverse());
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  // Real-time socket listener
  useEffect(() => {
    if (!userId) return;
    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      socket.emit("join-user-room", { userId });
      socket.emit("join-admin-room");
    });

    socket.on("new-order-received", (data: any) => {
      toast.success(
        `New order received: #${data.orderNumber || data.orderId?.slice(-6)} (৳${data.totalAmount})`,
        { icon: "📦" }
      );
      fetchOrders();
    });

    socket.on("order-status-updated", () => {
      fetchOrders();
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const handleDelete = async (_id: any) => {
    const result = await Swal.fire({
      title: "Delete Order?",
      text: "Are you sure you want to delete this order record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.delete(
          `${API_BASE_URL}/api/v1/order/${_id}`,
          { headers: { Authorization: `${token}` } },
        );

        if (res.status === 200 || res.status === 204) {
          toast.success("Order deleted successfully");
          setOrders((prev) => prev.filter((item) => item._id !== _id));
        }
      } catch (err) {
        toast.error("Failed to delete order record.");
      }
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customerName = order.user?.name || order.shippingAddress?.fullName || "";
      const customerEmail = order.user?.email || order.shippingAddress?.email || "";
      const customerPhone = order.user?.phone || order.shippingAddress?.phone || "";
      const orderNumber = order.orderNumber || "";
      const orderId = order._id || "";
      const query = searchText.toLowerCase();

      const matchSearch =
        customerName.toLowerCase().includes(query) ||
        customerEmail.toLowerCase().includes(query) ||
        customerPhone.toLowerCase().includes(query) ||
        orderNumber.toLowerCase().includes(query) ||
        orderId.toLowerCase().includes(query);

      const orderSt = normalizeStatus(order.orderStatus || order.status || "PENDING");
      const matchStatus =
        statusFilter === "all" ||
        orderSt === statusFilter.toUpperCase() ||
        (order.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [orders, searchText, statusFilter]);

  // Statistics
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => {
    const st = normalizeStatus(o.orderStatus || o.status || "");
    return st === "PENDING" || st === "CONFIRMED";
  }).length;

  const completedOrdersCount = orders.filter((o) => {
    const st = normalizeStatus(o.orderStatus || o.status || "");
    return st === "DELIVERED" || st === "COMPLETED";
  }).length;

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (Number(o.totalAmount || o.totalPrice) || 0),
    0
  );

  const columns: ColumnsType<any> = [
    {
      title: "Order ID",
      key: "orderNumber",
      render: (_, record) => (
        <div>
          <Text copyable strong className="font-mono text-xs text-slate-800 dark:text-slate-200">
            {record.orderNumber || (record._id ? `#${record._id.slice(-8).toUpperCase()}` : "N/A")}
          </Text>
        </div>
      ),
    },
    {
      title: "Patient / Customer",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            icon={<UserOutlined />}
            size="small"
            style={{ backgroundColor: `${themeConfig.accentColor}25`, color: themeConfig.accentColor }}
            className="shrink-0"
          />
          <div className="overflow-hidden">
            <span className="font-bold text-xs text-slate-800 dark:text-slate-100 block truncate">
              {record.shippingAddress?.fullName || record.user?.name || "Patient Customer"}
            </span>
            <span className="text-[11px] text-slate-400 block truncate">
              {record.shippingAddress?.phone || record.user?.phone || record.user?.email || "No contact"}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Items Prescribed",
      key: "products",
      render: (_, record) => {
        const count = record.items?.length || record.products?.length || 1;
        return (
          <div className="text-xs">
            <Badge
              count={`${count} Item(s)`}
              style={{ backgroundColor: "#e2e8f0", color: "#334155", fontWeight: 700 }}
            />
          </div>
        );
      },
    },
    {
      title: "Order Total",
      key: "totalAmount",
      render: (_, record) => (
        <span className="font-extrabold text-xs text-slate-900 dark:text-white">
          ৳ {(Number(record.totalAmount || record.totalPrice) || 0).toFixed(2)}
        </span>
      ),
      sorter: (a, b) =>
        (Number(a.totalAmount || a.totalPrice) || 0) - (Number(b.totalAmount || b.totalPrice) || 0),
    },
    {
      title: "Fulfillment Status",
      key: "status",
      render: (_, record) => (
        <OrderStatusBadge status={record.orderStatus || record.status || "PENDING"} size="sm" />
      ),
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status, record) => (
        <div className="text-xs">
          <Tag color={status === "Paid" ? "green" : "orange"} className="text-[11px] rounded font-semibold">
            {status || "Pending"}
          </Tag>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {record.paymentMethod || "Online"}
          </span>
        </div>
      ),
      responsive: ["md"],
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
        </span>
      ),
      responsive: ["lg"],
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Update Order Status & Dispatch">
            <Link to={`/pharmacist-dashboard/update-orderd-status/${record._id}`}>
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                style={{
                  backgroundColor: themeConfig.accentColor,
                  borderColor: themeConfig.accentColor,
                }}
              >
                Status
              </Button>
            </Link>
          </Tooltip>

          <Tooltip title="Generate Printable Invoice">
            <Link to={`/pharmacist-dashboard/invoice-medicine/${record._id}`}>
              <Button size="small" icon={<FileTextOutlined />} className="text-slate-700 dark:text-slate-200">
                Invoice
              </Button>
            </Link>
          </Tooltip>

          <Popconfirm
            title="Delete this order?"
            description="Remove this order transaction record?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Prescription Orders & Fulfillment
            </Title>
            <Tag color="cyan" className="font-extrabold rounded-full px-2 py-0.5 text-xs">
              Dispensary Desk
            </Tag>
          </div>
          <Text type="secondary" className="text-xs sm:text-sm">
            Review incoming patient medication requests, dispatch orders, and issue official invoices.
          </Text>
        </div>

        <Button
          icon={<ReloadOutlined />}
          onClick={fetchOrders}
          loading={loading}
          className="rounded-xl font-semibold"
        >
          Refresh Orders
        </Button>
      </div>

      {/* KPI Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-xs rounded-2xl hover:shadow-md transition">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>}
              value={totalOrdersCount}
              prefix={<ShoppingOutlined style={{ color: themeConfig.accentColor }} className="mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#0f172a" }}
            />
            <div className="mt-2 text-[11px] text-slate-400 font-medium">Assigned to dispensary inventory</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-xs rounded-2xl hover:shadow-md transition">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Verification</span>}
              value={pendingOrdersCount}
              prefix={<ClockCircleOutlined className="text-amber-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#f59e0b" }}
            />
            <div className="mt-2 text-[11px] text-amber-600 font-medium">Requires packaging & dispatch</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-xs rounded-2xl hover:shadow-md transition">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Deliveries</span>}
              value={completedOrdersCount}
              prefix={<CheckCircleOutlined className="text-emerald-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#10b981" }}
            />
            <div className="mt-2 text-[11px] text-emerald-600 font-medium">Delivered to patient doorstep</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-xs rounded-2xl hover:shadow-md transition">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dispensary Revenue</span>}
              value={totalRevenue}
              precision={2}
              prefix={<DollarOutlined className="text-teal-600 mr-1" />}
              suffix="৳"
              valueStyle={{ fontWeight: 800, color: "#0d9488" }}
            />
            <div className="mt-2 text-[11px] text-slate-400 font-medium">Total gross order fulfillment</div>
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card bordered={false} className="shadow-xs rounded-2xl overflow-hidden border border-slate-200/70">
        <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <Input
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Search by patient name, phone, or order ID..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="rounded-xl"
              size="middle"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-48"
              size="middle"
            >
              <Option value="all">All Statuses</Option>
              <Option value="PENDING">Pending Verification</Option>
              <Option value="CONFIRMED">Confirmed</Option>
              <Option value="PROCESSING">Processing / Dispensing</Option>
              <Option value="READY_FOR_DISPATCH">Ready for Dispatch</Option>
              <Option value="OUT_FOR_DELIVERY">Out for Delivery</Option>
              <Option value="DELIVERED">Delivered</Option>
              <Option value="CANCELLED">Cancelled</Option>
              <Option value="REJECTED">Rejected</Option>
            </Select>

            {(searchText || statusFilter !== "all") && (
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setSearchText("");
                  setStatusFilter("all");
                }}
                className="text-xs font-semibold text-rose-500"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3">
            <Spin size="large" />
            <Text type="secondary" className="text-xs">Loading orders...</Text>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="_id"
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              pageSizeOptions: ["8", "16", "32"],
              showTotal: (total, range) => (
                <span className="text-xs text-slate-500">
                  Showing {range[0]}-{range[1]} of <strong>{total}</strong> orders
                </span>
              ),
            }}
            scroll={{ x: 800 }}
          />
        )}
      </Card>
    </div>
  );
};

export default OrderedMedicine;
