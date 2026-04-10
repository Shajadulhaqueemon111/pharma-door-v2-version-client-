/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../privateRoute/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { Table, Button, Spin, Image, Typography } from "antd";

const { Title } = Typography;

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

const ITEMS_PER_PAGE = 5;

const AllEquipmentPage = () => {
  const [medicine, setMedicine] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const userId = user?._id;

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await axios.get(
          "https://pharma-door-backend.vercel.app/api/v1/equipment",
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        );

        const allMedicines = response.data.data;

        const userMedicines = allMedicines.filter(
          (med: any) => med?.createdBy?._id === userId,
        );

        setMedicine(userMedicines);
      } catch (error) {
        console.error("Error fetching medicine:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMedicine();
    }
  }, [userId]);

  const handleDelete = async (_id: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await axios.delete(
          `https://pharma-door-backend.vercel.app/api/v1/equipment/${_id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        );

        if (res.status === 200) {
          toast.success("Deleted successfully");

          setMedicine((prev: any) =>
            prev.filter((item: any) => item._id !== _id),
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  // ✅ Ant Design Table Columns
  const columns = [
    {
      title: "Image",
      dataIndex: "medicineImage",
      key: "image",
      render: (img: string) => (
        <Image src={img} width={60} height={60} style={{ borderRadius: 8 }} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price}`,
    },
    {
      title: "Stock",
      dataIndex: "stock_quantity",
      key: "stock",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Delete",
      key: "delete",
      render: (_: any, record: any) => (
        <Button danger onClick={() => handleDelete(record._id)}>
          Delete
        </Button>
      ),
    },
    {
      title: "Update",
      key: "update",
      render: (_: any, record: any) => (
        <Link to={`/pharmacist-dashboard/update-equipment/${record._id}`}>
          <Button type="primary">Update</Button>
        </Link>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3} style={{ textAlign: "center" }}>
        My Equipments
      </Title>

      <Table
        columns={columns}
        dataSource={medicine}
        rowKey="_id"
        bordered
        pagination={{
          pageSize: ITEMS_PER_PAGE,
        }}
      />
    </div>
  );
};

export default AllEquipmentPage;
