/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Table,
  Input,
  Button,
  Modal,
  Image,
  Spin,
  Typography,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
  Avatar,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EyeOutlined,
  DownloadOutlined,
  FileZipOutlined,
  SearchOutlined,
  ReloadOutlined,
  FileProtectOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type PharmacistType = {
  _id: string;
  user: string;
  name: string;
  address: string;
  storeName: string;
  phone: string;
  email: string;
  postCode: string;
  nid: string;
  nidImage: string;
  drugLicenseImage: string;
  tradeLicenseImage: string;
  status: string;
  createdAt: string;
};

const { Title, Text } = Typography;

const PharmacistDocument = () => {
  const [pharmacists, setPharmacists] = useState<PharmacistType[]>([]);
  const [filtered, setFiltered] = useState<PharmacistType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PharmacistType | null>(null);
  const [open, setOpen] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const fetchPharmacists = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const res = await axios.get(
        "https://pharmadoor-backend-v2.vercel.app/api/v1/phermacist",
        {
          headers: { Authorization: `${token}` },
        },
      );

      const data = res.data?.data || [];
      setPharmacists(data);
      setFiltered(data);
    } catch (error) {
      toast.error("Failed to load pharmacists documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacists();
  }, []);

  // Search filter
  useEffect(() => {
    const lower = search.toLowerCase().trim();
    if (!lower) {
      setFiltered(pharmacists);
      return;
    }

    const result = pharmacists.filter((item) => {
      return (
        item.name?.toLowerCase().includes(lower) ||
        item.email?.toLowerCase().includes(lower) ||
        item.phone?.includes(lower) ||
        item.storeName?.toLowerCase().includes(lower)
      );
    });

    setFiltered(result);
  }, [search, pharmacists]);

  const downloadSingleFile = async (url: string, name: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      saveAs(blob, name);
      toast.success(`Downloaded ${name}`);
    } catch {
      toast.error("Download failed");
    }
  };

  const downloadAllDocuments = async (doc: PharmacistType) => {
    setDownloadingZip(true);
    try {
      const zip = new JSZip();

      const files = [
        { url: doc.nidImage, name: "National-ID.jpg" },
        { url: doc.drugLicenseImage, name: "DGDA-Drug-License.jpg" },
        { url: doc.tradeLicenseImage, name: "City-Trade-License.jpg" },
      ];

      await Promise.all(
        files.map(async (file) => {
          if (file.url) {
            const res = await fetch(file.url);
            const blob = await res.blob();
            zip.file(file.name, blob);
          }
        }),
      );

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${doc.name.replace(/\s+/g, "_")}_Credentials.zip`);
      toast.success("Document archive package generated!");
    } catch {
      toast.error("ZIP download failed");
    } finally {
      setDownloadingZip(false);
    }
  };

  const columns: ColumnsType<PharmacistType> = [
    {
      title: "Applicant Pharmacist",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            icon={<UserOutlined />}
            size="large"
            className="rounded-full bg-teal-50 text-teal-600 border border-teal-200 shrink-0 font-bold"
          >
            {record.name ? record.name.charAt(0).toUpperCase() : "P"}
          </Avatar>
          <div>
            <Text strong className="text-slate-900 text-sm block">
              {record.name}
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
      title: "Pharmacy / Store",
      key: "storeName",
      render: (_, record) => (
        <div>
          <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
            <ShopOutlined className="text-teal-600" />
            {record.storeName || "Licensed Dispensary"}
          </span>
          <span className="text-[11px] text-slate-400 block truncate max-w-xs">
            {record.address}
          </span>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => <span className="font-mono text-xs text-slate-600">{phone}</span>,
    },
    {
      title: "Verification Portfolio",
      key: "docs",
      render: () => (
        <div className="flex items-center gap-1">
          <Tag color="cyan" className="text-[10px] rounded font-semibold">NID</Tag>
          <Tag color="blue" className="text-[10px] rounded font-semibold">Drug License</Tag>
          <Tag color="purple" className="text-[10px] rounded font-semibold">Trade</Tag>
        </div>
      ),
    },
    {
      title: "Inspect Credentials",
      key: "action",
      align: "center",
      render: (_: any, record: PharmacistType) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          style={{ backgroundColor: "#0d9488", borderColor: "#0d9488" }}
          size="small"
          onClick={() => {
            setSelected(record);
            setOpen(true);
          }}
        >
          View Files
        </Button>
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
              Pharmacist Legal Document Verification
            </Title>
            <Tag color="cyan" className="font-extrabold rounded-full px-2 py-0.5 text-xs">
              Compliance Desk
            </Tag>
          </div>
          <Text type="secondary" className="text-xs sm:text-sm">
            Inspect DGDA drug licenses, government National IDs, and municipal trade licenses submitted by pharmacy applicants.
          </Text>
        </div>

        <Button
          icon={<ReloadOutlined />}
          onClick={fetchPharmacists}
          loading={loading}
          className="rounded-xl font-semibold"
        >
          Refresh Documents
        </Button>
      </div>

      {/* KPI Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Document Portfolios</span>}
              value={pharmacists.length}
              prefix={<FileProtectOutlined className="text-teal-600 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#0f172a" }}
            />
            <div className="mt-2 text-[11px] text-slate-400">Total submitted license files</div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Filtered Applicants</span>}
              value={filtered.length}
              prefix={<SafetyCertificateOutlined className="text-emerald-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#10b981" }}
            />
            <div className="mt-2 text-[11px] text-slate-400">Matching search query</div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">DGDA Verification</span>}
              value="100%"
              prefix={<ShopOutlined className="text-blue-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#2563eb" }}
            />
            <div className="mt-2 text-[11px] text-blue-600 font-semibold">Strict licensing enforcement</div>
          </Card>
        </Col>
      </Row>

      {/* Table Card */}
      <Card bordered={false} className="shadow-xs rounded-2xl overflow-hidden border border-slate-200/70">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between gap-3">
          <Input
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="Search documents by pharmacist name, pharmacy store, or phone..."
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md rounded-xl"
          />
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3">
            <Spin size="large" />
            <Text type="secondary" className="text-xs">Loading legal portfolios...</Text>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filtered}
            rowKey="_id"
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              pageSizeOptions: ["8", "16", "32"],
              showTotal: (total) => `Total ${total} document dossiers`,
            }}
            scroll={{ x: 750 }}
          />
        )}
      </Card>

      {/* Inspection Modal */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={950}
        className="rounded-3xl overflow-hidden"
      >
        {selected && (
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Avatar size={48} className="bg-teal-500 text-white font-bold">
                  {selected.name?.charAt(0)}
                </Avatar>
                <div>
                  <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
                    {selected.name}
                  </Title>
                  <Text type="secondary" className="text-xs">
                    {selected.storeName} &bull; {selected.email}
                  </Text>
                </div>
              </div>

              <Button
                type="primary"
                icon={<FileZipOutlined />}
                loading={downloadingZip}
                onClick={() => downloadAllDocuments(selected)}
                style={{ backgroundColor: "#0d9488", borderColor: "#0d9488" }}
                className="rounded-xl font-bold shadow-md"
              >
                Download Portfolio ZIP
              </Button>
            </div>

            {/* Profile Brief Grid */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <Row gutter={[16, 12]} className="text-xs">
                <Col xs={12} sm={6}>
                  <span className="text-slate-400 block">Phone Number</span>
                  <span className="font-bold text-slate-800">{selected.phone || "N/A"}</span>
                </Col>
                <Col xs={12} sm={6}>
                  <span className="text-slate-400 block">Postal Code</span>
                  <span className="font-bold text-slate-800">{selected.postCode || "N/A"}</span>
                </Col>
                <Col xs={12} sm={6}>
                  <span className="text-slate-400 block">NID Serial</span>
                  <span className="font-bold text-slate-800 font-mono">{selected.nid || "N/A"}</span>
                </Col>
                <Col xs={12} sm={6}>
                  <span className="text-slate-400 block">Store Location</span>
                  <span className="font-bold text-slate-800 truncate block">{selected.address || "N/A"}</span>
                </Col>
              </Row>
            </div>

            {/* Document Gallery Cards */}
            <Row gutter={[16, 16]}>
              {/* NID */}
              <Col xs={24} md={8}>
                <Card
                  bordered={false}
                  className="rounded-2xl border border-slate-200 p-2 text-center bg-white shadow-xs"
                >
                  <p className="font-bold text-xs text-slate-700 mb-2">Government National ID</p>
                  <div className="h-44 flex items-center justify-center bg-slate-100 rounded-xl overflow-hidden mb-3">
                    <Image
                      src={selected.nidImage}
                      alt="National ID"
                      className="object-cover max-h-44"
                      fallback="https://placehold.co/400x300?text=No+NID+Image"
                    />
                  </div>
                  <Button
                    icon={<DownloadOutlined />}
                    block
                    size="small"
                    className="rounded-lg font-semibold"
                    onClick={() => downloadSingleFile(selected.nidImage, "NID.jpg")}
                  >
                    Download NID
                  </Button>
                </Card>
              </Col>

              {/* Drug License */}
              <Col xs={24} md={8}>
                <Card
                  bordered={false}
                  className="rounded-2xl border border-teal-200 p-2 text-center bg-teal-50/20 shadow-xs"
                >
                  <p className="font-bold text-xs text-teal-800 mb-2">DGDA Drug License</p>
                  <div className="h-44 flex items-center justify-center bg-slate-100 rounded-xl overflow-hidden mb-3">
                    <Image
                      src={selected.drugLicenseImage}
                      alt="Drug License"
                      className="object-cover max-h-44"
                      fallback="https://placehold.co/400x300?text=No+License+Image"
                    />
                  </div>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    block
                    size="small"
                    style={{ backgroundColor: "#0d9488", borderColor: "#0d9488" }}
                    className="rounded-lg font-semibold"
                    onClick={() => downloadSingleFile(selected.drugLicenseImage, "DrugLicense.jpg")}
                  >
                    Download Drug License
                  </Button>
                </Card>
              </Col>

              {/* Trade License */}
              <Col xs={24} md={8}>
                <Card
                  bordered={false}
                  className="rounded-2xl border border-slate-200 p-2 text-center bg-white shadow-xs"
                >
                  <p className="font-bold text-xs text-slate-700 mb-2">City Trade License</p>
                  <div className="h-44 flex items-center justify-center bg-slate-100 rounded-xl overflow-hidden mb-3">
                    <Image
                      src={selected.tradeLicenseImage}
                      alt="Trade License"
                      className="object-cover max-h-44"
                      fallback="https://placehold.co/400x300?text=No+Trade+Image"
                    />
                  </div>
                  <Button
                    icon={<DownloadOutlined />}
                    block
                    size="small"
                    className="rounded-lg font-semibold"
                    onClick={() => downloadSingleFile(selected.tradeLicenseImage, "TradeLicense.jpg")}
                  >
                    Download Trade License
                  </Button>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PharmacistDocument;
