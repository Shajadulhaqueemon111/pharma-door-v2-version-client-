/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          "https://pharma-door-backend.vercel.app/api/v1/users",
          {
            headers: { Authorization: `${token}` },
          }
        );
        const users = res.data?.data || [];
        setTotalUsers(users.length);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          "https://pharma-door-backend.vercel.app/api/v1/order/ordered-medicine",
          {
            headers: { Authorization: `${token}` },
          }
        );

        const orders = res.data?.data || [];

        let salesSum = 0;
        orders.forEach((order: any) => {
          salesSum += order.totalPrice;
        });
        setTotalSales(salesSum);
        setTotalProfit(salesSum * 0.2);

        const monthlySalesMap: Record<string, number> = {};
        orders.forEach((order: any) => {
          const month = getMonthName(order.createdAt);
          if (!monthlySalesMap[month]) {
            monthlySalesMap[month] = 0;
          }
          monthlySalesMap[month] += order.totalPrice;
        });

        const chartDataArray = monthOrder.map((month) => ({
          name: month,
          sales: parseFloat((monthlySalesMap[month] || 0).toFixed(2)),
        }));

        setChartData(chartDataArray);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-red-600">
        <ScaleLoader color="#2cabab" height={12} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Welcome to Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalUsers}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Total Sales</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ${totalSales.toFixed(2)}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Total Profit</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            ${totalProfit.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Monthly Sales Overview
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => [`$${value}`, "Sales"]} />
            <Bar dataKey="sales" fill="#3b82f6" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
