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
  UserOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

type UserType = {
  _id: string;
  name: string;
  email: string;
  status?: string;
  role?: string;
  createdAt?: string;
};

const AllUsers = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://pharmadoor-backend-v2.vercel.app/api/v1/users",
        {
          headers: {
            Authorization: `${localStorage.getItem("accessToken")}`,
          },
        },
      );

      const allUsers = res.data.data || [];
      const filteredUsers = allUsers.filter(
        (user: UserType & { role?: string }) => user.role !== "pharmacist",
      );

      setUsers(filteredUsers);
    } catch (err) {
      toast.error("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (_id: string) => {
    const result = await Swal.fire({
      title: "Delete User Account?",
      text: "This user profile and associated patient record will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete user",
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

        toast.success("User deleted successfully");
        fetchUsers();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const query = searchText.toLowerCase();
      const matchSearch =
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query);

      const matchRole =
        roleFilter === "all" ||
        u.role?.toLowerCase() === roleFilter.toLowerCase();

      return matchSearch && matchRole;
    });
  }, [users, searchText, roleFilter]);

  // Statistics
  const totalCount = users.length;
  const regularPatients = users.filter((u) => u.role === "user" || !u.role).length;
  const admins = users.filter((u) => u.role === "admin").length;

  const columns: ColumnsType<UserType> = [
    {
      title: "User / Patient",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            icon={<UserOutlined />}
            size="large"
            className="rounded-full bg-teal-50 text-teal-600 border border-teal-200 shrink-0 font-bold"
          >
            {record.name ? record.name.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <div>
            <Text strong className="text-slate-900 text-sm block">
              {record.name || "Anonymous Patient"}
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
      title: "Assigned Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        if (role === "admin") {
          return <Tag color="purple" className="font-extrabold text-xs rounded-full px-2.5">Super Admin</Tag>;
        }
        if (role === "doctor") {
          return <Tag color="teal" className="font-extrabold text-xs rounded-full px-2.5">BMDC Doctor</Tag>;
        }
        return <Tag color="blue" className="font-semibold text-xs rounded-full px-2.5">Patient / User</Tag>;
      },
    },
    {
      title: "Account Status",
      key: "status",
      render: (_, record) => (
        <Tag color="success" className="font-bold text-xs rounded-full px-2">
          {record.status || "Active"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Modify user role & privileges">
            <Link to={`/admin-dashboard/all-users/${record._id}/edit`}>
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                style={{ backgroundColor: "#0d9488", borderColor: "#0d9488" }}
              >
                Edit Role
              </Button>
            </Link>
          </Tooltip>

          <Popconfirm
            title="Delete this user account?"
            description="Are you sure you want to delete this user?"
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
              All Users & Patients
            </Title>
            <Tag color="geekblue" className="font-extrabold rounded-full px-2 py-0.5 text-xs">
              User Directory
            </Tag>
          </div>
          <Text type="secondary" className="text-xs sm:text-sm">
            Manage customer accounts, registered telemedicine patients, and system administrators.
          </Text>
        </div>

        <Button
          icon={<ReloadOutlined />}
          onClick={fetchUsers}
          loading={loading}
          className="rounded-xl font-semibold"
        >
          Refresh Directory
        </Button>
      </div>

      {/* KPI Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Total User Accounts</span>}
              value={totalCount}
              prefix={<TeamOutlined className="text-teal-600 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#0f172a" }}
            />
            <div className="mt-2 text-[11px] text-slate-400">Total registered identities</div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Standard Patients</span>}
              value={regularPatients}
              prefix={<UserOutlined className="text-blue-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#2563eb" }}
            />
            <div className="mt-2 text-[11px] text-slate-400">E-Commerce & Telehealth Users</div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Super Administrators</span>}
              value={admins}
              prefix={<SafetyCertificateOutlined className="text-purple-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#7c3aed" }}
            />
            <div className="mt-2 text-[11px] text-purple-600 font-semibold">Elevated administrative privilege</div>
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card bordered={false} className="shadow-xs rounded-2xl overflow-hidden border border-slate-200/70">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Input
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="Search patient by name or email address..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md rounded-xl"
          />

          <div className="flex items-center gap-2">
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              className="w-40"
            >
              <Option value="all">All Roles</Option>
              <Option value="user">Patients / Users</Option>
              <Option value="admin">Administrators</Option>
            </Select>

            {(searchText || roleFilter !== "all") && (
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setSearchText("");
                  setRoleFilter("all");
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
            <Text type="secondary" className="text-xs">Loading user directory...</Text>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="_id"
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              pageSizeOptions: ["8", "16", "32"],
              showTotal: (total) => `Total ${total} users`,
            }}
            scroll={{ x: 750 }}
          />
        )}
      </Card>
    </div>
  );
};

export default AllUsers;
