/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  Table,
  Avatar,
  Space,
  Badge,
} from "antd";
import { DollarOutlined, RiseOutlined, UserOutlined } from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useAuth } from "../privateRoute/AuthContext";

const { Title, Text } = Typography;

const getMonthName = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("default", { month: "short" });
};

const monthOrder = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const PharmasistsDashboard = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get(
        "https://pharma-door-backend.vercel.app/api/v1/order/ordered-medicine",
        { headers: { Authorization: `${token}` } },
      );

      const orders = res.data?.data || [];

      const pharmacistOrders = orders.filter((order: any) =>
        order.products?.some((p: any) => p.pharmacist === user?._id),
      );

      const sales = pharmacistOrders.reduce(
        (sum: number, o: any) => sum + o.totalPrice,
        0,
      );
      const profit = sales * 0.2;

      setTotalSales(sales);
      setTotalProfit(profit);

      const monthlyMap: Record<string, number> = {};
      pharmacistOrders.forEach((o: any) => {
        const month = getMonthName(o.createdAt);
        monthlyMap[month] = (monthlyMap[month] || 0) + o.totalPrice;
      });

      const data = monthOrder.map((m) => ({
        name: m,
        sales: monthlyMap[m] || 0,
      }));

      setChartData(data);

      // Recent 5 orders
      setRecentOrders(pharmacistOrders.slice(-5).reverse());
    };

    if (user?._id) fetchData();
  }, [user]);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (text: string) => <Text copyable>{text.slice(-6)}</Text>,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (customer: any) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <span>{customer?.name || "N/A"}</span>
        </Space>
      ),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: number) => <Text>{price.toFixed(2)} TK</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = status === "delivered" ? "green" : "orange";
        return <Badge color={color} text={status.toUpperCase()} />;
      },
    },
  ];

  return (
    <>
      {/* Title */}
      <Title level={3} style={{ marginBottom: "20px" }}>
        Welcome, {user?.name || "Pharmacist"}!
      </Title>

      {/* Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Sales"
              value={totalSales}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="TK"
              valueStyle={{ color: "#16a34a" }}
            />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Profit"
              value={totalProfit}
              precision={2}
              prefix={<RiseOutlined />}
              suffix="TK"
              valueStyle={{ color: "#9333ea" }}
            />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Recent Orders"
              value={recentOrders.length}
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Month"
              value={new Date().toLocaleString("default", { month: "long" })}
              valueStyle={{ color: "#f59e0b" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Chart */}
      <Card
        style={{ marginTop: "20px" }}
        title="Monthly Sales Performance"
        bordered={false}
      >
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#1677ff" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Orders Table */}
      <Card
        style={{ marginTop: "20px" }}
        title="Recent Orders"
        bordered={false}
      >
        <Table
          dataSource={recentOrders}
          columns={columns}
          rowKey={(record) => record._id}
          pagination={false}
          scroll={{ x: 600 }}
        />
      </Card>
    </>
  );
};

export default PharmasistsDashboard;
