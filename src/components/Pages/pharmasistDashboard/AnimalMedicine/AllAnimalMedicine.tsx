/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../privateRoute/AuthContext";
import { Table, Button, Image, Typography, Space, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title } = Typography;
const { confirm } = Modal;

interface Medicine {
  _id: string;
  name: string;
  brand?: string;
  category: string;
  price: string;
  stock: string;
  medicineImage: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  isExpired: boolean;
}

const AllAnimalMedicinePage = () => {
  const [medicine, setMedicine] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const userId = user?._id;

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await axios.get(
          "https://pharma-door-backend.vercel.app/api/v1/animal-medicine",
          {
            headers: { Authorization: `${token}` },
          },
        );

        const allMedicines = response.data.data;

        const userMedicines = allMedicines.filter(
          (med: any) => med?.createdBy?._id === userId,
        );

        setMedicine(userMedicines);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch medicines");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchMedicine();
  }, [userId]);

  const handleDelete = async (_id: string) => {
    confirm({
      title: "Are you sure you want to delete this medicine?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "Cancel",

      onOk: async () => {
        try {
          const token = localStorage.getItem("accessToken");

          const res = await axios.delete(
            `https://pharma-door-backend.vercel.app/api/v1/animal-medicine/${_id}`,
            {
              headers: { Authorization: `${token}` },
            },
          );

          if (res.status === 200) {
            toast.success("Deleted successfully");

            setMedicine((prev) => prev.filter((item) => item._id !== _id));
          }
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete medicine");
        }
      },
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "medicineImage",
      key: "image",
      render: (img: string) => (
        <Image
          src={img}
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: string) => `$${price}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Medicine) => (
        <Space>
          <Button danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>

          <Link
            to={`/pharmacist-dashboard/update-animal-medicine/${record._id}`}
          >
            <Button type="primary">Update</Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={3} style={{ textAlign: "center" }}>
        🐾 My Animal Medicines
      </Title>

      <Table
        dataSource={medicine}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default AllAnimalMedicinePage;
