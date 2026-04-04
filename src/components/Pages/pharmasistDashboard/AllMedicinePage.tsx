/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../privateRoute/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Table, Button, Popconfirm, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

interface Medicine {
  _id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  medicineImage: string;
  manufactureDate: string;
  expiryDate: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  isExpired: boolean;
}

const AllMedicinePage = () => {
  const { user } = useAuth();
  const userId = user?._id;
  const [medicine, setMedicine] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoadingId, setButtonLoadingId] = useState<string | null>(null); // ✅ Track which row's button is loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token || !userId) return;

        const response = await axios.get(
          "https://pharma-door-backend.vercel.app/api/v1/medicine",
          {
            headers: { Authorization: token },
          },
        );

        const allMedicines = response.data.data;
        const userMedicines = allMedicines.filter(
          (med: any) => med?.createdBy?._id === userId,
        );

        setMedicine(userMedicines);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch medicines.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [userId]);

  const handleDelete = async (_id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("No access token found");
          return;
        }

        const res = await axios.delete(
          `https://pharma-door-backend.vercel.app/api/v1/medicine/${_id}`,
          { headers: { Authorization: token } },
        );

        if (res.status === 200) {
          toast.success("Medicine deleted successfully");
          setMedicine((prev) => prev.filter((item) => item._id !== _id));
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete medicine");
      }
    }
  };

  const handleUpdateClick = (id: string) => {
    setButtonLoadingId(id); // show spinner
    setTimeout(() => {
      navigate(`/pharmacist-dashboard/update-specific-medicine/${id}`);
      setButtonLoadingId(null); // reset spinner
    }, 500); // optional delay for UX
  };

  const columns: ColumnsType<Medicine> = [
    {
      title: "Image",
      dataIndex: "medicineImage",
      key: "medicineImage",
      render: (_, record) => (
        <img
          src={record.medicineImage}
          alt={record.name}
          className="w-16 h-16 object-cover rounded"
        />
      ),
      responsive: ["sm"] as (
        | "xs"
        | "sm"
        | "md"
        | "lg"
        | "xl"
        | "xxl"
        | "xxxl"
      )[],
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      sorter: (a, b) => a.brand.localeCompare(b.brand),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            loading={buttonLoadingId === record._id} // ✅ Loading state per row
            onClick={() => handleUpdateClick(record._id)}
          >
            Update
          </Button>

          <Popconfirm
            title="Are you sure to delete this medicine?"
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        My Medicines
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading medicines..." />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={medicine}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          bordered
          scroll={{ x: "max-content" }}
        />
      )}
    </div>
  );
};

export default AllMedicinePage;
