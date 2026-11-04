/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import {
  Table,
  Tag,
  Input,
  Select,
  Button,
  Card,
  Space,
  Typography,
  Tooltip,
} from "antd";
import {
  HistoryOutlined,
  SearchOutlined,
  ReloadOutlined,
  GlobalOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useGetAuditLogsQuery } from "../../../redux/api/auditApi";

const { Title, Text } = Typography;

const AuditLogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("ALL");

  const { data: logs = [], isLoading, refetch } = useGetAuditLogsQuery(
    { limit: 200 },
    { pollingInterval: 30000 },
  );

  const filteredLogs = useMemo(() => {
    return logs.filter((log: any) => {
      const matchSearch =
        !searchTerm ||
        log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress?.includes(searchTerm);

      const matchAction =
        actionFilter === "ALL" ||
        log.action?.toUpperCase().includes(actionFilter.toUpperCase());

      return matchSearch && matchAction;
    });
  }, [logs, searchTerm, actionFilter]);

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      render: (date: string) => (
        <span className="text-xs text-slate-500 font-mono">
          {new Date(date).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 140,
      render: (action: string) => {
        let color = "blue";
        if (action.includes("DELETE")) color = "error";
        if (action.includes("UPDATE") || action.includes("MODIFY")) color = "warning";
        if (action.includes("2FA") || action.includes("SECURITY")) color = "purple";
        if (action.includes("CREATE") || action.includes("REGISTER")) color = "success";
        if (action.includes("UPLOAD")) color = "cyan";

        return (
          <Tag color={color} className="font-bold text-[10px] uppercase rounded">
            {action}
          </Tag>
        );
      },
    },
    {
      title: "Operator / User",
      dataIndex: "userName",
      key: "userName",
      width: 220,
      render: (name: string, record: any) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
            <UserOutlined />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-800 text-xs truncate">{name || "System"}</p>
            <p className="text-[10px] text-slate-400 truncate">{record.userEmail}</p>
          </div>
          <Tag color={record.userRole === "admin" ? "gold" : record.userRole === "pharmacist" ? "cyan" : "default"} className="text-[9px] uppercase font-bold rounded">
            {record.userRole}
          </Tag>
        </div>
      ),
    },
    {
      title: "Target / Entity",
      dataIndex: "target",
      key: "target",
      width: 140,
      render: (target: string, record: any) => (
        <div>
          <span className="font-semibold text-xs text-slate-800 block">{target}</span>
          {record.targetId && (
            <span className="text-[10px] font-mono text-slate-400">
              #{record.targetId.slice(-6)}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Audit Details",
      dataIndex: "details",
      key: "details",
      render: (details: string) => (
        <Tooltip title={details}>
          <p className="text-xs text-slate-600 max-w-sm truncate">
            {details || "Operation executed"}
          </p>
        </Tooltip>
      ),
    },
    {
      title: "Client IP & Origin",
      dataIndex: "ipAddress",
      key: "ipAddress",
      width: 140,
      render: (ip: string) => (
        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-600">
          <GlobalOutlined className="text-teal-600" />
          <span>{ip || "127.0.0.1"}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HistoryOutlined className="text-teal-600 text-xl" />
            <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
              System Audit Trail & Compliance Logs
            </Title>
            <Tag color="cyan" className="rounded-full font-bold text-xs px-2.5">
              Live Auditing
            </Tag>
          </div>
          <Text className="text-xs text-slate-500">
            Immutable log of administrative operations, data creations, modifications, and deletions.
          </Text>
        </div>

        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isLoading}
            className="rounded-xl font-bold text-xs"
          >
            Refresh Logs
          </Button>
        </Space>
      </div>

      {/* Filter and Search Bar */}
      <Card className="rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Input
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Search user, action, details, IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-72 rounded-xl"
              allowClear
            />

            <Select
              value={actionFilter}
              onChange={setActionFilter}
              className="w-full sm:w-44"
              options={[
                { value: "ALL", label: "All Actions" },
                { value: "CREATE", label: "Creations (CREATE)" },
                { value: "UPDATE", label: "Modifications (UPDATE)" },
                { value: "DELETE", label: "Deletions (DELETE)" },
                { value: "SECURITY", label: "Security & 2FA" },
                { value: "UPLOAD", label: "Cloudinary Uploads" },
              ]}
            />
          </div>

          <div className="text-xs text-slate-500 font-medium self-end sm:self-auto">
            Showing <strong>{filteredLogs.length}</strong> of {logs.length} logged events
          </div>
        </div>
      </Card>

      {/* Audit Logs Table */}
      <Card className="rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <Table
          dataSource={filteredLogs}
          columns={columns}
          loading={isLoading}
          rowKey="_id"
          pagination={{ pageSize: 12, showSizeChanger: true }}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
};

export default AuditLogsPage;
