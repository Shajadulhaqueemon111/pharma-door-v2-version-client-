/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useAuth } from "../privateRoute/AuthContext";
import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { Table, Button, Spin, Image, Popconfirm, Typography } from "antd";

const { Title } = Typography;

interface Medicine {
  _id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  medicineImage: string;
  expiryDate: string;
  createdBy: {
    _id: string;
  };
}

const PreExpiryNotification: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const userId = user?._id;
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await axios.get(
        "https://pharma-door-backend.vercel.app/api/v1/medicine",
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );

      const data: Medicine[] = res.data?.data || [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(today.getDate() + 30);
      thirtyDaysLater.setHours(23, 59, 59, 999);

      const preExpiring = data.filter((medicine) => {
        const expiry = new Date(medicine.expiryDate);
        return (
          expiry > today &&
          expiry <= thirtyDaysLater &&
          medicine.createdBy?._id === userId
        );
      });

      setMedicines(preExpiring);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.delete(
        `https://pharma-door-backend.vercel.app/api/v1/medicine/${_id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );

      if (res.status === 200) {
        toast.success("Deleted successfully");
        setMedicines((prev) => prev.filter((m) => m._id !== _id));
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    if (userId) fetchMedicines();
  }, [userId]);

  if (!userId) return <p>Please login first</p>;

  const columns = [
    {
      title: "Image",
      dataIndex: "medicineImage",
      render: (img: string) => (
        <Image
          src={img}
          width={50}
          height={50}
          style={{ objectFit: "cover", borderRadius: 6 }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Brand",
      dataIndex: "brand",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price: number) => `$${price}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      render: (date: string) => {
        const zoned = toZonedTime(date, userTimeZone);
        return (
          <span style={{ color: "red", fontWeight: 600 }}>
            {format(zoned, "PPP")}
          </span>
        );
      },
    },
    {
      title: "Actions",
      render: (_: any, record: Medicine) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Link
            to={`/pharmacist-dashboard/update-pre-expire-medicine/${record._id}`}
          >
            <Button type="primary">Update</Button>
          </Link>

          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={4} style={{ textAlign: "center", color: "#1677ff" }}>
        <Typewriter
          words={["⚠️ Medicines Expiring in 30 Days"]}
          loop={false}
          cursor
        />
      </Title>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={medicines}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          bordered
        />
      )}
    </div>
  );
};

export default PreExpiryNotification;
