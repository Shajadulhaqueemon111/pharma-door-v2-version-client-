/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../privateRoute/AuthContext";
import { Typewriter } from "react-simple-typewriter";
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
  Avatar,
  Space,
  Typography,
  Tooltip,
  Alert,
  Spin,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ClockCircleOutlined,
  WarningOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  ReloadOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { usePharmacistTheme } from "./pharmacistTheme";

const { Title, Text } = Typography;

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

const ExpireAllMedicine = () => {
  const { user } = useAuth();
  const userId = user?._id;
  const { themeConfig } = usePharmacistTheme();

  const [expiredMedicines, setExpiredMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await axios.get(
        "https://pharmadoor-backend-v2.vercel.app/api/v1/medicine",
        {
          headers: { Authorization: `${token}` },
        },
      );

      const medicines: Medicine[] = res.data.data || [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expiredByUser = medicines.filter((medicine) => {
        const expiry = new Date(medicine.expiryDate);
        expiry.setHours(0, 0, 0, 0);
        return expiry <= today && medicine.createdBy?._id === userId;
      });

      setExpiredMedicines(expiredByUser);
    } catch (err) {
      console.error("Failed to fetch medicines:", err);
      toast.error("Failed to load expired medicines list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchMedicines();
  }, [userId]);

  const handleDelete = async (_id: any) => {
    const result = await Swal.fire({
      title: "Dispose Expired Medicine?",
      text: "This item will be permanently removed from inventory records.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, dispose & delete",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.delete(
          `https://pharmadoor-backend-v2.vercel.app/api/v1/medicine/${_id}`,
          { headers: { Authorization: `${token}` } },
        );

        if (res.status === 200) {
          toast.success("Expired medicine removed from inventory");
          setExpiredMedicines((prev) => prev.filter((item) => item._id !== _id));
        }
      } catch (err) {
        toast.error("Failed to delete medicine.");
      }
    }
  };

  const filteredData = useMemo(() => {
    return expiredMedicines.filter(
      (m) =>
        m.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        m.brand?.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [expiredMedicines, searchText]);

  // Stats
  const totalExpiredCount = expiredMedicines.length;
  const totalUnits = expiredMedicines.reduce((sum, m) => sum + (Number(m.stock) || 0), 0);
  const totalEstimatedLoss = expiredMedicines.reduce(
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
            size={50}
            src={record.medicineImage}
            icon={<MedicineBoxOutlined />}
            className="rounded-xl border border-rose-200 bg-rose-50 object-cover shrink-0"
          />
          <div>
            <Text strong className="text-slate-900 text-sm block">
              {record.name}
            </Text>
            <Tag color="red" className="text-[10px] rounded font-semibold mt-0.5">
              {record.brand || "Generic"}
            </Tag>
          </div>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Expired Since",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date) => {
        const d = new Date(date);
        const daysAgo = Math.floor((new Date().getTime() - d.getTime()) / (1000 * 3600 * 24));
        return (
          <div>
            <Tag color="error" className="font-bold text-xs rounded-full px-2.5">
              Expired ({daysAgo}d ago)
            </Tag>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </span>
          </div>
        );
      },
      sorter: (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
    },
    {
      title: "Stock Units",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => (
        <span className="font-bold text-rose-600 text-xs">
          {stock} Units
        </span>
      ),
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Unit Rate",
      dataIndex: "price",
      key: "price",
      render: (price) => <span className="font-semibold text-xs">৳ {(Number(price) || 0).toFixed(2)}</span>,
    },
    {
      title: "Total Loss Value",
      key: "loss",
      render: (_, record) => (
        <span className="font-bold text-xs text-rose-700">
          ৳ {((Number(record.price) || 0) * (Number(record.stock) || 0)).toFixed(2)}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Update Expiration Date (Batch Extension)">
            <Link to={`/pharmacist-dashboard/update-expire-medicines/${record._id}`}>
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                style={{
                  backgroundColor: themeConfig.accentColor,
                  borderColor: themeConfig.accentColor,
                }}
              >
                Update Date
              </Button>
            </Link>
          </Tooltip>

          <Popconfirm
            title="Dispose this expired medicine?"
            description="Permanently removes batch from dispensary registry."
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Dispose
            </Button>
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
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Expired Medicines Isolation
            </Title>
            <Tag color="error" className="font-extrabold rounded-full px-2 py-0.5 text-xs">
              DGDA Quarantine
            </Tag>
          </div>
          <Text type="secondary" className="text-xs sm:text-sm">
            Strict quarantine protocol for expired drugs. Do not sell, dispense, or distribute.
          </Text>
        </div>

        <Button
          icon={<ReloadOutlined />}
          onClick={fetchMedicines}
          loading={loading}
          className="rounded-xl font-semibold"
        >
          Refresh
        </Button>
      </div>

      {/* Safety Compliance Alert */}
      <Alert
        message="DGDA Drug Safety Compliance Alert"
        description={
          <div className="text-xs text-rose-700 font-medium">
            <Typewriter
              words={[
                "These medicines have passed their safe efficacy date.",
                "Immediately isolate from active dispensary shelves.",
                "Log batch destruction or supplier return per national regulations.",
              ]}
              loop={false}
              cursor
              cursorStyle="_"
              typeSpeed={40}
              deleteSpeed={0}
              delaySpeed={1200}
            />
          </div>
        }
        type="error"
        showIcon
        className="rounded-2xl border-rose-200 bg-rose-50/70"
      />

      {/* KPI Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Expired Formulations</span>}
              value={totalExpiredCount}
              prefix={<WarningOutlined className="text-rose-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#e11d48" }}
            />
            <div className="mt-2 text-[11px] text-slate-400">Total drug records expired</div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Quarantined Units</span>}
              value={totalUnits}
              prefix={<ClockCircleOutlined className="text-amber-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#d97706" }}
            />
            <div className="mt-2 text-[11px] text-slate-400">Units awaiting safe destruction</div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Total Inventory Loss</span>}
              value={totalEstimatedLoss}
              precision={2}
              prefix={<DollarOutlined className="text-rose-600 mr-1" />}
              suffix="৳"
              valueStyle={{ fontWeight: 800, color: "#be123c" }}
            />
            <div className="mt-2 text-[11px] text-slate-400">Cost value of expired stock</div>
          </Card>
        </Col>
      </Row>

      {/* Table Card */}
      <Card bordered={false} className="shadow-xs rounded-2xl overflow-hidden border border-slate-200/70">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between gap-3">
          <Input
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="Search expired medicines by name or manufacturer..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md rounded-xl"
          />
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3">
            <Spin size="large" />
            <Text type="secondary" className="text-xs">Loading expired inventory...</Text>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="_id"
            pagination={{
              pageSize: 6,
              showSizeChanger: true,
              pageSizeOptions: ["6", "12", "24"],
              showTotal: (total) => `Total ${total} expired items`,
            }}
            scroll={{ x: 700 }}
          />
        )}
      </Card>
    </div>
  );
};

export default ExpireAllMedicine;
