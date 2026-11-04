/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
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
  Spin,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  MedicineBoxOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

type UserType = {
  _id: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected" | undefined;
  role: "user" | "admin" | "pharmacist";
};

const AllRegisterPharmacist = () => {
  const [pharmacists, setPharmacists] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchPharmacists = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(
        "https://pharmadoor-backend-v2.vercel.app/api/v1/users",
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );

      const allUsers: UserType[] = res.data.data || [];
      const filtered = allUsers.filter((user) => user.role === "pharmacist");
      setPharmacists(filtered);
    } catch (error) {
      toast.error("Failed to fetch pharmacists");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacists();
  }, []);

  const handleDelete = async (_id: string) => {
    const result = await Swal.fire({
      title: "Delete Pharmacist Account?",
      text: "This will revoke dispensary access and delete account records.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("Token does not exist");
          return;
        }

        await axios.delete(
          `https://pharmadoor-backend-v2.vercel.app/api/v1/users/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        toast.success("Pharmacist deleted successfully");
        fetchPharmacists();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const filteredPharmacists = useMemo(() => {
    return pharmacists.filter((p) => {
      const query = searchText.toLowerCase();
      const matchSearch =
        p.name?.toLowerCase().includes(query) ||
        p.email?.toLowerCase().includes(query);

      const matchStatus =
        statusFilter === "all" ||
        p.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [pharmacists, searchText, statusFilter]);

  // Statistics
  const totalCount = pharmacists.length;
  const approvedCount = pharmacists.filter((p) => p.status === "approved").length;
  const pendingCount = pharmacists.filter((p) => p.status === "pending" || !p.status).length;
  const rejectedCount = pharmacists.filter((p) => p.status === "rejected").length;

  const getStatusTag = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <Tag color="success" icon={<CheckCircleOutlined />} className="font-extrabold text-xs rounded-full px-2.5">Approved</Tag>;
      case "pending":
        return <Tag color="warning" icon={<ClockCircleOutlined />} className="font-extrabold text-xs rounded-full px-2.5">Pending</Tag>;
      case "rejected":
        return <Tag color="error" icon={<CloseCircleOutlined />} className="font-extrabold text-xs rounded-full px-2.5">Rejected</Tag>;
      default:
        return <Tag color="default" className="font-bold text-xs rounded-full px-2.5">Pending</Tag>;
    }
  };

  const columns: ColumnsType<UserType> = [
    {
      title: "Licensed Pharmacist",
      key: "pharmacist",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            icon={<MedicineBoxOutlined />}
            size="large"
            className="rounded-full bg-teal-50 text-teal-600 border border-teal-200 shrink-0 font-bold"
          >
            {record.name ? record.name.charAt(0).toUpperCase() : "P"}
          </Avatar>
          <div>
            <Text strong className="text-slate-900 text-sm block">
              {record.name || "Pharmacist Practitioner"}
            </Text>
            <Text copyable className="text-xs text-slate-400 font-mono">
              {record.email}
            </Text>
          </div>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "System Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color="cyan" className="font-bold text-xs rounded px-2">
          {role?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Credential Status",
      dataIndex: "status",
      key: "status",
      render: (st) => getStatusTag(st),
      filters: [
        { text: "Approved", value: "approved" },
        { text: "Pending", value: "pending" },
        { text: "Rejected", value: "rejected" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Verification Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Review license & change status">
            <Link to={`/admin-dashboard/all-pharmacist/${record._id}`}>
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                style={{ backgroundColor: "#0d9488", borderColor: "#0d9488" }}
              >
                Review Status
              </Button>
            </Link>
          </Tooltip>

          <Popconfirm
            title="Delete this pharmacist account?"
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
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Pharmacist Registry & Approval
            </Title>
            <Tag color="cyan" className="font-extrabold rounded-full px-2 py-0.5 text-xs">
              Credentialing
            </Tag>
          </div>
          <Text type="secondary" className="text-xs sm:text-sm">
            Verify DGDA drug licenses, trade registrations, and approve dispensary practitioner accounts.
          </Text>
        </div>

        <Button
          icon={<ReloadOutlined />}
          onClick={fetchPharmacists}
          loading={loading}
          className="rounded-xl font-semibold"
        >
          Refresh Registry
        </Button>
      </div>

      {/* KPI Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Total Registered</span>}
              value={totalCount}
              prefix={<MedicineBoxOutlined className="text-teal-600 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#0f172a" }}
            />
            <div className="mt-2 text-[11px] text-slate-400">Total pharmacist applicants</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Approved Practitioners</span>}
              value={approvedCount}
              prefix={<CheckCircleOutlined className="text-emerald-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#10b981" }}
            />
            <div className="mt-2 text-[11px] text-emerald-600 font-semibold">Active dispensary operations</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Pending Review</span>}
              value={pendingCount}
              prefix={<ClockCircleOutlined className="text-amber-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#f59e0b" }}
            />
            <div className="mt-2 text-[11px] text-amber-600 font-semibold">Awaiting document verification</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Rejected Credentials</span>}
              value={rejectedCount}
              prefix={<CloseCircleOutlined className="text-rose-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#e11d48" }}
            />
            <div className="mt-2 text-[11px] text-rose-600 font-semibold">Declined applications</div>
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card bordered={false} className="shadow-xs rounded-2xl overflow-hidden border border-slate-200/70">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Input
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="Search pharmacist by name or email..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md rounded-xl"
          />

          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-40"
            >
              <Option value="all">All Statuses</Option>
              <Option value="approved">Approved</Option>
              <Option value="pending">Pending</Option>
              <Option value="rejected">Rejected</Option>
            </Select>

            {(searchText || statusFilter !== "all") && (
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setSearchText("");
                  setStatusFilter("all");
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
            <Text type="secondary" className="text-xs">Loading pharmacist registry...</Text>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredPharmacists}
            rowKey="_id"
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              pageSizeOptions: ["8", "16", "32"],
              showTotal: (total) => `Total ${total} pharmacists`,
            }}
            scroll={{ x: 750 }}
          />
        )}
      </Card>
    </div>
  );
};

export default AllRegisterPharmacist;
