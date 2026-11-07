/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config/api";
import toast from "react-hot-toast";
import { useAuth } from "../../privateRoute/AuthContext";
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
  Avatar,
  Space,
  Typography,
  Tooltip,
  Spin,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { usePharmacistTheme } from "../pharmacistTheme";

const { Title, Text } = Typography;

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
  const [searchText, setSearchText] = useState("");
  const { user } = useAuth();
  const userId = user?._id;
  const { themeConfig } = usePharmacistTheme();

  const fetchMedicine = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(
        `${API_BASE_URL}/api/v1/animal-medicine`,
        {
          headers: { Authorization: `${token}` },
        },
      );

      const allMedicines = response.data?.data || [];
      const userMedicines = allMedicines.filter(
        (med: any) => med?.createdBy?._id === userId,
      );

      setMedicine(userMedicines);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch veterinary medicines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchMedicine();
  }, [userId]);

  const handleDelete = async (_id: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.delete(
        `${API_BASE_URL}/api/v1/animal-medicine/${_id}`,
        {
          headers: { Authorization: `${token}` },
        },
      );

      if (res.status === 200 || res.status === 204) {
        toast.success("Veterinary medicine deleted successfully!");
        setMedicine((prev) => prev.filter((item) => item._id !== _id));
      }
    } catch (error) {
      toast.error("Failed to delete medicine");
    }
  };

  const filteredMedicines = useMemo(() => {
    return medicine.filter(
      (m) =>
        m.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        m.category?.toLowerCase().includes(searchText.toLowerCase()) ||
        m.brand?.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [medicine, searchText]);

  // Stats
  const totalCount = medicine.length;
  const inStockCount = medicine.filter((m) => Number(m.stock || 0) > 10).length;
  const lowStockCount = medicine.filter((m) => Number(m.stock || 0) <= 10).length;

  const columns: ColumnsType<Medicine> = [
    {
      title: "Veterinary Medicine",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            shape="square"
            size={52}
            src={record.medicineImage}
            className="rounded-xl border border-teal-200 bg-teal-50 object-cover shrink-0 text-lg"
          >
            🐾
          </Avatar>
          <div>
            <Text strong className="text-slate-900 text-sm block">
              {record.name}
            </Text>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Tag color="cyan" className="text-[10px] rounded font-semibold">
                {record.category || "Veterinary"}
              </Tag>
              {record.brand && <span className="text-xs text-slate-400">{record.brand}</span>}
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
      render: (cat) => <Tag color="blue" className="rounded font-semibold text-xs">{cat}</Tag>,
    },
    {
      title: "Retail Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <span className="font-bold text-slate-900 text-sm">৳ {(Number(price) || 0).toFixed(2)}</span>,
      sorter: (a, b) => Number(a.price) - Number(b.price),
    },
    {
      title: "Available Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => {
        const qty = Number(stock) || 0;
        return qty > 10 ? (
          <Tag color="success" className="font-bold rounded-full px-2.5">In Stock ({qty})</Tag>
        ) : (
          <Tag color="warning" className="font-bold rounded-full px-2.5">Low Stock ({qty})</Tag>
        );
      },
      sorter: (a, b) => Number(a.stock) - Number(b.stock),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Update specs">
            <Link to={`/pharmacist-dashboard/update-animal-medicine/${record._id}`}>
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
            title="Delete this animal medicine?"
            description="Remove this medicine from inventory?"
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
              Veterinary & Animal Health
            </Title>
            <Tag color="green" className="font-extrabold rounded-full px-2 py-0.5 text-xs">
              Livestock & Pets
            </Tag>
          </div>
          <Text type="secondary" className="text-xs sm:text-sm">
            Manage anti-parasitics, feed supplements, antibiotics, and vaccines for cattle, poultry, and pets.
          </Text>
        </div>

        <div className="flex items-center gap-3">
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchMedicine}
            loading={loading}
            className="rounded-xl font-semibold"
          >
            Refresh
          </Button>

          <Link to="/pharmacist-dashboard/create-animal-medicine">
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
              Add Animal Medicine
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Total Animal Formulas</span>}
              value={totalCount}
              prefix={<span className="mr-2">🐾</span>}
              valueStyle={{ fontWeight: 800, color: "#0f172a" }}
            />
            <div className="mt-2 text-[11px] text-slate-400">Veterinary medicines cataloged</div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Available In Stock</span>}
              value={inStockCount}
              prefix={<CheckCircleOutlined className="text-emerald-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#10b981" }}
            />
            <div className="mt-2 text-[11px] text-emerald-600 font-medium">Ready for farm & pet care</div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Reorder Alert</span>}
              value={lowStockCount}
              prefix={<WarningOutlined className="text-amber-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#f59e0b" }}
            />
            <div className="mt-2 text-[11px] text-amber-600 font-medium">Units &le;10 remaining</div>
          </Card>
        </Col>
      </Row>

      {/* Table Card */}
      <Card bordered={false} className="shadow-xs rounded-2xl overflow-hidden border border-slate-200/70">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between gap-3">
          <Input
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="Search veterinary medicine by name, category, or brand..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md rounded-xl"
          />
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3">
            <Spin size="large" />
            <Text type="secondary" className="text-xs">Loading veterinary inventory...</Text>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredMedicines}
            rowKey="_id"
            pagination={{
              pageSize: 6,
              showSizeChanger: true,
              pageSizeOptions: ["6", "12", "24"],
              showTotal: (total) => `Total ${total} items`,
            }}
            scroll={{ x: 700 }}
          />
        )}
      </Card>
    </div>
  );
};

export default AllAnimalMedicinePage;
