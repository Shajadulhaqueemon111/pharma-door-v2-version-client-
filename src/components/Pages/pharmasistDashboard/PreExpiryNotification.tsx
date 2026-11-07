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
  WarningOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PercentageOutlined,
  SearchOutlined,
  ReloadOutlined,
  MedicineBoxOutlined,
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

const PreExpiryNotification = () => {
  const { user } = useAuth();
  const userId = user?._id;
  const { themeConfig } = usePharmacistTheme();

  const {
    data: allMedicines = [],
    isLoading: loading,
    refetch: fetchMedicines,
  } = useGetMedicinesQuery();
  const [deleteMedicineMutation] = useDeleteMedicineMutation();

  const [searchText, setSearchText] = useState("");

  const medicines = useMemo(() => {
    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return (allMedicines as any[]).filter((m) => {
      if (!m.expiryDate) return false;
      const exp = new Date(m.expiryDate);
      return (
        exp > now &&
        exp <= thirtyDaysLater &&
        (!userId || m.createdBy?._id === userId)
      );
    });
  }, [allMedicines, userId]);

  const handleDelete = async (_id: string) => {
    const result = await Swal.fire({
      title: "Remove from Inventory?",
      text: "Are you sure you want to remove this expiring item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        await deleteMedicineMutation(_id).unwrap();
        toast.success("Medicine deleted successfully");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete medicine");
      }
    }
  };

  const filteredMedicines = useMemo(() => {
    return medicines.filter(
      (m) =>
        m.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        m.brand?.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [medicines, searchText]);

  // Urgency Counts
  const urgentCount7 = medicines.filter((m) => {
    const days = Math.ceil((new Date(m.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    return days <= 7;
  }).length;

  const urgentCount15 = medicines.filter((m) => {
    const days = Math.ceil((new Date(m.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    return days > 7 && days <= 15;
  }).length;

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
            className="rounded-xl border border-amber-200 bg-amber-50 object-cover shrink-0"
          />
          <div>
            <Text strong className="text-slate-900 text-sm block">
              {record.name}
            </Text>
            <Tag color="orange" className="text-[10px] rounded font-semibold mt-0.5">
              {record.brand || "Generic"}
            </Tag>
          </div>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Days Remaining",
      dataIndex: "expiryDate",
      key: "countdown",
      render: (date) => {
        const days = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        const color = days <= 7 ? "error" : days <= 15 ? "warning" : "orange";
        return (
          <div>
            <Tag color={color} className="font-extrabold text-xs rounded-full px-2.5">
              {days <= 0 ? "Expiring Today" : `${days} Days Left`}
            </Tag>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        );
      },
      sorter: (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
    },
    {
      title: "Available Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => <span className="font-bold text-xs text-slate-800">{stock} Units</span>,
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Unit Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <span className="font-bold text-xs text-slate-900">৳ {(Number(price) || 0).toFixed(2)}</span>,
    },
    {
      title: "Action / Clearance Strategy",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Create Flash Sale / Clearance Discount">
            <Link to="/pharmacist-dashboard/create-offer-medicine">
              <Button size="small" icon={<PercentageOutlined />} className="text-amber-700 bg-amber-50 border-amber-200">
                Discount Offer
              </Button>
            </Link>
          </Tooltip>

          <Tooltip title="Update Expiry Date">
            <Link to={`/pharmacist-dashboard/update-pre-expire-medicine/${record._id}`}>
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
            title="Delete medicine?"
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
      {/* Page Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Pre-Expiry Early Warning
            </Title>
            <Tag color="warning" className="font-extrabold rounded-full px-2 py-0.5 text-xs">
              30-Day Window
            </Tag>
          </div>
          <Text type="secondary" className="text-xs sm:text-sm">
            Proactively manage medications reaching shelf life expiration within the next 30 calendar days.
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

      {/* Warning Notice Alert */}
      <Alert
        message="Inventory Clearance Recommendation"
        description="To mitigate loss from expired medicines, consider creating promotional discount offers or prioritizing FIFO (First-In, First-Out) dispensation for these batches."
        type="warning"
        showIcon
        className="rounded-2xl border-amber-200 bg-amber-50/70 text-xs"
      />

      {/* KPI Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Expiring in &le;7 Days</span>}
              value={urgentCount7}
              prefix={<WarningOutlined className="text-rose-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#e11d48" }}
            />
            <div className="mt-2 text-[11px] text-rose-600 font-semibold">Immediate clearance required</div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Expiring in 8-15 Days</span>}
              value={urgentCount15}
              prefix={<ClockCircleOutlined className="text-amber-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#d97706" }}
            />
            <div className="mt-2 text-[11px] text-amber-600 font-semibold">Suggested for discount sale</div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Total in 30-Day Alert</span>}
              value={medicines.length}
              prefix={<MedicineBoxOutlined style={{ color: themeConfig.accentColor }} className="mr-2" />}
              valueStyle={{ fontWeight: 800, color: themeConfig.accentColor }}
            />
            <div className="mt-2 text-[11px] text-slate-400">Batches currently tracked</div>
          </Card>
        </Col>
      </Row>

      {/* Table Card */}
      <Card bordered={false} className="shadow-xs rounded-2xl overflow-hidden border border-slate-200/70">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between gap-3">
          <Input
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="Search pre-expiry medicine by trade name or brand..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md rounded-xl"
          />
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3">
            <Spin size="large" />
            <Text type="secondary" className="text-xs">Loading pre-expiry inventory...</Text>
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
              showTotal: (total) => `Total ${total} pre-expiry items`,
            }}
            scroll={{ x: 750 }}
          />
        )}
      </Card>
    </div>
  );
};

export default PreExpiryNotification;
