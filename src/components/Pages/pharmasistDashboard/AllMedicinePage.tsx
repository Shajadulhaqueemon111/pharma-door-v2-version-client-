/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import {
  useGetMedicinesQuery,
  useDeleteMedicineMutation,
} from "../../../redux/api/medicineApi";
import { useAuth } from "../privateRoute/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Table,
  Button,
  Popconfirm,
  Spin,
  Card,
  Row,
  Col,
  Statistic,
  Input,
  Select,
  Tag,
  Avatar,
  Space,
  Typography,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate, Link } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { usePharmacistTheme } from "./pharmacistTheme";

const { Title, Text } = Typography;
const { Option } = Select;

interface Medicine {
  _id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  medicineImage: string;
  manufactureDate?: string;
  expiryDate?: string;
  medicineType?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  isExpired?: boolean;
}

const AllMedicinePage = () => {
  const { user } = useAuth();
  const userId = user?._id;
  const { themeConfig } = usePharmacistTheme();
  const navigate = useNavigate();

  // RTK Query hooks for automated caching, background refetching and instant load
  const {
    data: allMedicines = [],
    isLoading: loading,
    refetch: fetchMedicine,
  } = useGetMedicinesQuery();
  const [deleteMedicineMutation] = useDeleteMedicineMutation();

  const [buttonLoadingId, setButtonLoadingId] = useState<string | null>(null);

  // Search and filter states
  const [searchText, setSearchText] = useState("");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");

  const medicine = useMemo(() => {
    return (allMedicines as any[]).filter(
      (med: any) => !userId || med?.createdBy?._id === userId,
    );
  }, [allMedicines, userId]);

  const handleDelete = async (_id: string) => {
    const result = await Swal.fire({
      title: "Delete Medicine?",
      text: "This action cannot be undone and will remove it from inventory.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        await deleteMedicineMutation(_id).unwrap();
        toast.success("Medicine deleted successfully");
      } catch (err: any) {
        console.error(err);
        toast.error(err?.data?.message || "Failed to delete medicine");
      }
    }
  };

  const handleUpdateClick = (id: string) => {
    setButtonLoadingId(id);
    navigate(`/pharmacist-dashboard/update-specific-medicine/${id}`);
  };

  // Distinct brands for filter
  const brandsList = useMemo(() => {
    const set = new Set<string>();
    medicine.forEach((m) => {
      if (m.brand) set.add(m.brand.trim());
    });
    return Array.from(set);
  }, [medicine]);

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    return medicine.filter((item) => {
      const matchSearch =
        item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.medicineType?.toLowerCase().includes(searchText.toLowerCase());

      const matchBrand =
        brandFilter === "all" ||
        item.brand?.toLowerCase() === brandFilter.toLowerCase();

      let matchStock = true;
      if (stockFilter === "in_stock") matchStock = item.stock > 10;
      else if (stockFilter === "low_stock") matchStock = item.stock > 0 && item.stock <= 10;
      else if (stockFilter === "out_of_stock") matchStock = item.stock <= 0;

      return matchSearch && matchBrand && matchStock;
    });
  }, [medicine, searchText, stockFilter, brandFilter]);

  // Statistics
  const totalCount = medicine.length;
  const inStockCount = medicine.filter((m) => m.stock > 10).length;
  const lowStockCount = medicine.filter((m) => m.stock > 0 && m.stock <= 10).length;
  const outOfStockCount = medicine.filter((m) => m.stock <= 0).length;
  const totalValuation = medicine.reduce(
    (sum, m) => sum + (Number(m.price) || 0) * (Number(m.stock) || 0),
    0,
  );

  const columns: ColumnsType<Medicine> = [
    {
      title: "Medicine",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            shape="square"
            size={52}
            src={record.medicineImage}
            icon={<MedicineBoxOutlined />}
            className="rounded-xl border border-slate-200 shadow-xs object-cover bg-slate-50 shrink-0"
          />
          <div className="overflow-hidden">
            <Text strong className="text-slate-800 text-sm block truncate">
              {record.name}
            </Text>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-slate-500 font-medium">
                {record.brand || "Generic"}
              </span>
              {record.medicineType && (
                <Tag color="cyan" className="text-[10px] px-1.5 py-0 rounded">
                  {record.medicineType}
                </Tag>
              )}
            </div>
          </div>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (brand) => (
        <Tag color="blue" className="rounded-md font-semibold text-xs px-2 py-0.5">
          {brand || "Pharma"}
        </Tag>
      ),
      responsive: ["md"],
      sorter: (a, b) => (a.brand || "").localeCompare(b.brand || ""),
    },
    {
      title: "Unit Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span className="font-bold text-slate-900 text-sm">
          ৳ {(Number(price) || 0).toFixed(2)}
        </span>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Stock Status",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => {
        if (stock <= 0) {
          return (
            <Tag color="error" icon={<CloseCircleOutlined />} className="rounded-full px-2.5 py-0.5 font-bold">
              Out of Stock (0)
            </Tag>
          );
        }
        if (stock <= 10) {
          return (
            <Tag color="warning" icon={<WarningOutlined />} className="rounded-full px-2.5 py-0.5 font-bold">
              Low Stock ({stock})
            </Tag>
          );
        }
        return (
          <Tag color="success" icon={<CheckCircleOutlined />} className="rounded-full px-2.5 py-0.5 font-bold">
            In Stock ({stock})
          </Tag>
        );
      },
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date) => {
        if (!date) return <span className="text-slate-400 text-xs">N/A</span>;
        const d = new Date(date);
        const isExp = d < new Date();
        return (
          <span className={`text-xs font-semibold ${isExp ? "text-rose-600" : "text-slate-600"}`}>
            {d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </span>
        );
      },
      responsive: ["lg"],
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit medicine specs and stock">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              loading={buttonLoadingId === record._id}
              onClick={() => handleUpdateClick(record._id)}
              style={{
                backgroundColor: themeConfig.accentColor,
                borderColor: themeConfig.accentColor,
              }}
            >
              Update
            </Button>
          </Tooltip>

          <Popconfirm
            title="Delete this medicine?"
            description="Are you sure to remove this item from your stock?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete permanently">
              <Button danger size="small" icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Title level={3} style={{ margin: 0, fontWeight: 800 }} className="text-slate-900">
              Medicines Inventory
            </Title>
            <Tag color="cyan" className="font-extrabold rounded-full px-2 py-0.5 text-xs">
              Live Stock
            </Tag>
          </div>
          <Text type="secondary" className="text-xs sm:text-sm">
            Monitor dispensary medicine stocks, adjust retail prices, and manage expiration dates.
          </Text>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchMedicine}
            loading={loading}
            className="rounded-xl font-semibold"
          >
            Refresh
          </Button>

          <Link to="/pharmacist-dashboard/create-medicine" className="w-full sm:w-auto">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                backgroundColor: themeConfig.accentColor,
                borderColor: themeConfig.accentColor,
                borderRadius: 12,
                fontWeight: 700,
              }}
              className="w-full sm:w-auto shadow-md"
            >
              Add New Medicine
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metric Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-xs rounded-2xl hover:shadow-md transition">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Medicines</span>}
              value={totalCount}
              prefix={<MedicineBoxOutlined style={{ color: themeConfig.accentColor }} className="mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#0f172a" }}
            />
            <div className="mt-2 text-[11px] text-slate-400 font-medium">Registered in dispensary database</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-xs rounded-2xl hover:shadow-md transition">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Stock Available</span>}
              value={inStockCount}
              prefix={<CheckCircleOutlined className="text-emerald-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#10b981" }}
            />
            <div className="mt-2 text-[11px] text-emerald-600 font-medium">Ready for immediate fulfillment</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-xs rounded-2xl hover:shadow-md transition">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Low Stock Alert (&le;10)</span>}
              value={lowStockCount}
              prefix={<WarningOutlined className="text-amber-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#f59e0b" }}
            />
            <div className="mt-2 text-[11px] text-amber-600 font-medium">Needs reorder requisition</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-xs rounded-2xl hover:shadow-md transition">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inventory Valuation</span>}
              value={totalValuation}
              precision={2}
              prefix={<DollarOutlined className="text-teal-600 mr-1" />}
              suffix="৳"
              valueStyle={{ fontWeight: 800, color: "#0d9488" }}
            />
            <div className="mt-2 text-[11px] text-slate-400 font-medium">
              Out of stock items: <span className="font-bold text-rose-500">{outOfStockCount}</span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Table Card with Search & Filtering */}
      <Card bordered={false} className="shadow-xs rounded-2xl overflow-hidden border border-slate-200/70">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="flex-1 max-w-md">
            <Input
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Search medicine by name, brand, or type..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="rounded-xl"
              size="middle"
            />
          </div>

          {/* Filter options */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Select
              value={stockFilter}
              onChange={setStockFilter}
              className="w-36"
              size="middle"
            >
              <Option value="all">All Stock</Option>
              <Option value="in_stock">In Stock (&gt;10)</Option>
              <Option value="low_stock">Low Stock (1-10)</Option>
              <Option value="out_of_stock">Out of Stock</Option>
            </Select>

            <Select
              value={brandFilter}
              onChange={setBrandFilter}
              className="w-36"
              size="middle"
            >
              <Option value="all">All Brands</Option>
              {brandsList.map((b) => (
                <Option key={b} value={b}>
                  {b}
                </Option>
              ))}
            </Select>

            {(searchText || stockFilter !== "all" || brandFilter !== "all") && (
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setSearchText("");
                  setStockFilter("all");
                  setBrandFilter("all");
                }}
                className="text-xs font-semibold text-rose-500"
              >
                Reset Filters
              </Button>
            )}
          </div>
        </div>

        {/* Ant Design Data Table */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3">
            <Spin size="large" />
            <Text type="secondary" className="text-xs">
              Loading pharmacist inventory...
            </Text>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredMedicines}
            rowKey="_id"
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              pageSizeOptions: ["8", "16", "32"],
              showTotal: (total, range) => (
                <span className="text-xs text-slate-500">
                  Showing {range[0]}-{range[1]} of <strong>{total}</strong> items
                </span>
              ),
            }}
            scroll={{ x: 800 }}
            className="ant-table-custom"
          />
        )}
      </Card>
    </div>
  );
};

export default AllMedicinePage;
