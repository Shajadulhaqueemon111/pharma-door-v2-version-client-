/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../privateRoute/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
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
  Rate,
  Spin,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ToolOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { usePharmacistTheme } from "./pharmacistTheme";

const { Title, Text } = Typography;
const { Option } = Select;

interface Equipment {
  _id: string;
  name: string;
  brand: string;
  category: string;
  color?: string;
  price: number;
  stock_quantity: number;
  rating?: number;
  medicineImage: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
}

const AllEquipmentPage = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userId = user?._id;
  const { themeConfig } = usePharmacistTheme();

  // Search & Filter
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await axios.get(
        "https://pharmadoor-backend-v2.vercel.app/api/v1/equipment",
        {
          headers: { Authorization: `${token}` },
        },
      );

      const allEquipment = response.data?.data || [];
      const userEquipment = allEquipment.filter(
        (eq: any) => eq?.createdBy?._id === userId,
      );

      setEquipmentList(userEquipment);
    } catch (error) {
      console.error("Error fetching equipment:", error);
      toast.error("Failed to load medical equipment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchEquipment();
  }, [userId]);

  const handleDelete = async (_id: any) => {
    const result = await Swal.fire({
      title: "Delete Equipment?",
      text: "Are you sure you want to delete this equipment?",
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
          `https://pharmadoor-backend-v2.vercel.app/api/v1/equipment/${_id}`,
          { headers: { Authorization: `${token}` } },
        );

        if (res.status === 200) {
          toast.success("Equipment deleted successfully");
          setEquipmentList((prev) => prev.filter((item) => item._id !== _id));
        }
      } catch (err) {
        toast.error("Failed to delete equipment.");
      }
    }
  };

  // Distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    equipmentList.forEach((e) => {
      if (e.category) set.add(e.category.trim());
    });
    return Array.from(set);
  }, [equipmentList]);

  // Filtered
  const filteredEquipment = useMemo(() => {
    return equipmentList.filter((e) => {
      const matchSearch =
        e.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        e.brand?.toLowerCase().includes(searchText.toLowerCase()) ||
        e.category?.toLowerCase().includes(searchText.toLowerCase());

      const matchCat =
        categoryFilter === "all" ||
        e.category?.toLowerCase() === categoryFilter.toLowerCase();

      return matchSearch && matchCat;
    });
  }, [equipmentList, searchText, categoryFilter]);

  // Stats
  const totalCount = equipmentList.length;
  const inStockCount = equipmentList.filter((e) => (e.stock_quantity || 0) > 5).length;
  const lowStockCount = equipmentList.filter((e) => (e.stock_quantity || 0) <= 5).length;
  const totalValuation = equipmentList.reduce(
    (sum, e) => sum + (Number(e.price) || 0) * (Number(e.stock_quantity) || 0),
    0,
  );

  const columns: ColumnsType<Equipment> = [
    {
      title: "Equipment Device",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            shape="square"
            size={52}
            src={record.medicineImage}
            icon={<ToolOutlined />}
            className="rounded-xl border border-slate-200 bg-slate-50 object-cover shrink-0"
          />
          <div>
            <Text strong className="text-slate-900 text-sm block">
              {record.name}
            </Text>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-slate-500 font-medium">{record.brand}</span>
              {record.color && (
                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  {record.color}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat) => (
        <Tag color="cyan" className="font-semibold text-xs rounded-md px-2 py-0.5">
          {cat || "Medical Device"}
        </Tag>
      ),
    },
    {
      title: "Retail Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <span className="font-bold text-slate-900 text-sm">৳ {(Number(price) || 0).toFixed(2)}</span>,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Stock Units",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      render: (stock) => {
        const qty = Number(stock) || 0;
        if (qty <= 5) {
          return <Tag color="warning" className="font-bold rounded-full px-2">Low Stock ({qty})</Tag>;
        }
        return <Tag color="success" className="font-bold rounded-full px-2">In Stock ({qty})</Tag>;
      },
      sorter: (a, b) => a.stock_quantity - b.stock_quantity,
    },
    {
      title: "Quality Rating",
      dataIndex: "rating",
      key: "rating",
      render: (r) => <Rate disabled allowHalf value={Number(r) || 5} className="text-xs text-amber-500" />,
      responsive: ["lg"],
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Update Equipment Specifications">
            <Link to={`/pharmacist-dashboard/update-equipment/${record._id}`}>
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                style={{
                  backgroundColor: themeConfig.accentColor,
                  borderColor: themeConfig.accentColor,
                }}
              >
                Update
              </Button>
            </Link>
          </Tooltip>

          <Popconfirm
            title="Delete this medical equipment?"
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
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Medical Equipments & Devices
            </Title>
            <Tag color="cyan" className="font-extrabold rounded-full px-2 py-0.5 text-xs">
              Diagnostics & Instruments
            </Tag>
          </div>
          <Text type="secondary" className="text-xs sm:text-sm">
            Manage stethoscopes, digital thermometers, BP monitors, glucometers, and diagnostic tools.
          </Text>
        </div>

        <div className="flex items-center gap-3">
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchEquipment}
            loading={loading}
            className="rounded-xl font-semibold"
          >
            Refresh
          </Button>

          <Link to="/pharmacist-dashboard/create-equipment">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                backgroundColor: themeConfig.accentColor,
                borderColor: themeConfig.accentColor,
                borderRadius: 12,
                fontWeight: 700,
              }}
              className="shadow-md"
            >
              Add Equipment
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Total Equipment</span>}
              value={totalCount}
              prefix={<ToolOutlined style={{ color: themeConfig.accentColor }} className="mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#0f172a" }}
            />
            <div className="mt-2 text-[11px] text-slate-400">Diagnostic models in stock</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">In-Stock Ready</span>}
              value={inStockCount}
              prefix={<CheckCircleOutlined className="text-emerald-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#10b981" }}
            />
            <div className="mt-2 text-[11px] text-emerald-600 font-medium">Sufficient units available</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Low Stock Alert</span>}
              value={lowStockCount}
              prefix={<WarningOutlined className="text-amber-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#f59e0b" }}
            />
            <div className="mt-2 text-[11px] text-amber-600 font-medium">Under 5 units remaining</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Equipment Asset Value</span>}
              value={totalValuation}
              precision={2}
              prefix={<DollarOutlined className="text-teal-600 mr-1" />}
              suffix="৳"
              valueStyle={{ fontWeight: 800, color: "#0d9488" }}
            />
            <div className="mt-2 text-[11px] text-slate-400">Total catalog inventory value</div>
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card bordered={false} className="shadow-xs rounded-2xl overflow-hidden border border-slate-200/70">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Input
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="Search equipment by name, brand, or category..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md rounded-xl"
          />

          <div className="flex items-center gap-2">
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              className="w-44"
            >
              <Option value="all">All Categories</Option>
              {categories.map((c) => (
                <Option key={c} value={c}>{c}</Option>
              ))}
            </Select>

            {(searchText || categoryFilter !== "all") && (
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setSearchText("");
                  setCategoryFilter("all");
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
            <Text type="secondary" className="text-xs">Loading equipment inventory...</Text>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredEquipment}
            rowKey="_id"
            pagination={{
              pageSize: 6,
              showSizeChanger: true,
              pageSizeOptions: ["6", "12", "24"],
              showTotal: (total) => `Total ${total} items`,
            }}
            scroll={{ x: 750 }}
          />
        )}
      </Card>
    </div>
  );
};

export default AllEquipmentPage;
