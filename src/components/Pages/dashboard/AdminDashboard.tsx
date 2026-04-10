/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Typography, Spin } from "antd";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const { Title } = Typography;

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

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const [userRes, orderRes] = await Promise.all([
          axios.get("https://pharma-door-backend.vercel.app/api/v1/users", {
            headers: { Authorization: `${token}` },
          }),
          axios.get(
            "https://pharma-door-backend.vercel.app/api/v1/order/ordered-medicine",
            {
              headers: { Authorization: `${token}` },
            },
          ),
        ]);

        // USERS
        const users = userRes.data?.data || [];
        setTotalUsers(users.length);

        // ORDERS
        const orders = orderRes.data?.data || [];

        const salesSum = orders.reduce(
          (sum: number, order: any) => sum + order.totalPrice,
          0,
        );

        setTotalSales(salesSum);
        setTotalProfit(salesSum * 0.2);

        // MONTHLY DATA
        const monthlyMap: Record<string, number> = {};

        orders.forEach((order: any) => {
          const month = getMonthName(order.createdAt);
          monthlyMap[month] = (monthlyMap[month] || 0) + order.totalPrice;
        });

        const chart = monthOrder.map((m) => ({
          name: m,
          sales: monthlyMap[m] || 0,
        }));

        setChartData(chart);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 24,
        background: "#f5f6fa",
        minHeight: "100vh",
      }}
    >
      {/* TITLE */}
      <Title level={2} style={{ textAlign: "center", marginBottom: 30 }}>
        📊 Admin Dashboard
      </Title>

      {/* STATS */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card hoverable style={{ borderRadius: 14 }}>
            <Statistic
              title="Total Users"
              value={totalUsers}
              valueStyle={{ color: "#3b82f6" }}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card hoverable style={{ borderRadius: 14 }}>
            <Statistic
              title="Total Sales"
              value={totalSales}
              precision={2}
              prefix="$"
              valueStyle={{ color: "#16a34a" }}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card hoverable style={{ borderRadius: 14 }}>
            <Statistic
              title="Total Profit"
              value={totalProfit}
              precision={2}
              prefix="$"
              valueStyle={{ color: "#a855f7" }}
            />
          </Card>
        </Col>
      </Row>

      {/* CHART */}
      <Card
        style={{
          marginTop: 20,
          borderRadius: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        }}
        title="📈 Revenue Analytics (Premium View)"
      >
        <div style={{ width: "100%", height: 380 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              {/* Gradient */}
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

              <XAxis dataKey="name" />
              <YAxis />

              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "none",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
                formatter={(value: number) => [`$${value}`, "Revenue"]}
              />

              {/* Main Area */}
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorSales)"
              />

              {/* Overlay Line (premium feel) */}
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#1d4ed8"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
